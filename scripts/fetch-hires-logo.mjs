// Fetch high-resolution brand logos from DuckDuckGo's icon service.
// DDG serves multi-resolution .ico files. The large frames are encoded either
// as PNG (use directly) or as a raw DIB/BMP bitmap (we convert it to PNG here
// with Node's built-in zlib — no native deps). We pick the biggest frame and
// only overwrite a logo when the result is larger than what we already have,
// so good logos are never downgraded.
import { writeFileSync, statSync, existsSync } from "node:fs";
import zlib from "node:zlib";

const domains = process.argv.slice(2);

const slugify = (d) =>
  d
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isPng = (b, o = 0) =>
  b[o] === 0x89 && b[o + 1] === 0x50 && b[o + 2] === 0x4e && b[o + 3] === 0x47;

// --- minimal PNG encoder (8-bit RGBA) -------------------------------------
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
};
function encodePng(width, height, rgba) {
  const stride = width * 4 + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0; // filter type none
    rgba.copy(raw, y * stride + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type RGBA
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// --- DIB (icon bitmap) -> PNG ---------------------------------------------
// Handles 1/4/8-bit palette, 24-bit BGR and 32-bit BGRA frames, plus the
// 1-bit AND transparency mask used by palette/24-bit icons.
function dibToPng(dib) {
  const headerSize = dib.readUInt32LE(0);
  const width = dib.readInt32LE(4);
  const height = Math.floor(dib.readInt32LE(8) / 2); // ICO stores XOR+AND -> 2x
  const bitCount = dib.readUInt16LE(14);
  if (width <= 0 || height <= 0) return { err: "bad dims" };
  if (![1, 4, 8, 24, 32].includes(bitCount)) return { err: `${bitCount}bpp` };

  let clrUsed = dib.readUInt32LE(32);
  if (bitCount <= 8 && clrUsed === 0) clrUsed = 1 << bitCount;
  const paletteOffset = headerSize;
  const pixelOffset = paletteOffset + (bitCount <= 8 ? clrUsed * 4 : 0);
  const rowSize = Math.ceil((width * bitCount) / 32) * 4; // 4-byte aligned
  const rgba = Buffer.alloc(width * height * 4);

  const indexAt = (rowStart, x) => {
    if (bitCount === 8) return dib[rowStart + x];
    if (bitCount === 4) {
      const b = dib[rowStart + (x >> 1)];
      return x & 1 ? b & 0x0f : (b >> 4) & 0x0f;
    }
    const b = dib[rowStart + (x >> 3)];
    return (b >> (7 - (x & 7))) & 1;
  };

  for (let y = 0; y < height; y++) {
    const rowStart = pixelOffset + (height - 1 - y) * rowSize; // bottom-up
    for (let x = 0; x < width; x++) {
      const di = (y * width + x) * 4;
      if (bitCount === 32) {
        const si = rowStart + x * 4;
        rgba[di] = dib[si + 2];
        rgba[di + 1] = dib[si + 1];
        rgba[di + 2] = dib[si];
        rgba[di + 3] = dib[si + 3];
      } else if (bitCount === 24) {
        const si = rowStart + x * 3;
        rgba[di] = dib[si + 2];
        rgba[di + 1] = dib[si + 1];
        rgba[di + 2] = dib[si];
        rgba[di + 3] = 255;
      } else {
        const p = paletteOffset + indexAt(rowStart, x) * 4;
        rgba[di] = dib[p + 2];
        rgba[di + 1] = dib[p + 1];
        rgba[di + 2] = dib[p];
        rgba[di + 3] = 255;
      }
    }
  }

  let needMask = bitCount !== 32;
  if (bitCount === 32) {
    let anyAlpha = false;
    for (let i = 3; i < rgba.length; i += 4)
      if (rgba[i] !== 0) {
        anyAlpha = true;
        break;
      }
    needMask = !anyAlpha;
  }
  if (needMask) {
    const andOffset = pixelOffset + height * rowSize;
    const andRow = Math.ceil(width / 32) * 4;
    if (andOffset + andRow * height <= dib.length) {
      for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
          const byte = dib[andOffset + (height - 1 - y) * andRow + (x >> 3)];
          if ((byte >> (7 - (x & 7))) & 1) rgba[(y * width + x) * 4 + 3] = 0;
        }
    }
  }
  return { png: encodePng(width, height, rgba), w: width };
}

function saveIfBigger(domain, buf, note) {
  const slug = slugify(domain);
  const path = `public/uploads/brands/${slug}.png`;
  const old = existsSync(path) ? statSync(path).size : 0;
  if (buf.length > old || process.env.FORCE === "1") {
    writeFileSync(path, buf);
    console.log(
      `OK  ${domain.padEnd(22)} ${note.padEnd(12)} ${(old / 1024).toFixed(
        1
      )} -> ${(buf.length / 1024).toFixed(1)} KB`
    );
  } else {
    console.log(
      `--  ${domain.padEnd(22)} ${note.padEnd(12)} ${(buf.length / 1024).toFixed(
        1
      )} KB not bigger than ${(old / 1024).toFixed(1)} KB, kept`
    );
  }
}

for (const domain of domains) {
  try {
    const res = await fetch(`https://icons.duckduckgo.com/ip3/${domain}.ico`);
    if (!res.ok) {
      console.log(`XX  ${domain.padEnd(22)} HTTP ${res.status}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (isPng(buf)) {
      saveIfBigger(domain, buf, "direct PNG");
      continue;
    }
    if (buf.readUInt16LE(0) !== 0 || buf.readUInt16LE(2) !== 1) {
      console.log(`XX  ${domain.padEnd(22)} not ico/png`);
      continue;
    }
    const count = buf.readUInt16LE(4);
    let best = null;
    for (let i = 0; i < count; i++) {
      const o = 6 + i * 16;
      const w = buf[o] === 0 ? 256 : buf[o];
      const size = buf.readUInt32LE(o + 8);
      const off = buf.readUInt32LE(o + 12);
      if (!best || w > best.w) best = { w, size, off };
    }
    const frame = buf.subarray(best.off, best.off + best.size);
    if (isPng(frame)) {
      saveIfBigger(domain, Buffer.from(frame), `${best.w}px PNG`);
    } else {
      const out = dibToPng(frame);
      if (out.png) saveIfBigger(domain, out.png, `${out.w}px BMP`);
      else console.log(`--  ${domain.padEnd(22)} ${best.w}px ${out.err}, skipped`);
    }
  } catch (e) {
    console.log(`XX  ${domain.padEnd(22)} ${e.message}`);
  }
}
