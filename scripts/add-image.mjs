#!/usr/bin/env node
// Download image(s) straight into public/uploads/ with clean, web-safe names.
//
// Usage:
//   node scripts/add-image.mjs <url> [name]        # one image, optional name
//   node scripts/add-image.mjs <url1> <url2> ...    # several images, auto-named
//
// Why a Node script (not .ps1)? It runs through `node`, so it isn't affected by
// the PowerShell execution policy that blocks .ps1 shims in this environment.
//
// It verifies the bytes are a real image (by magic number, not just the
// Content-Type header), picks the correct extension, slugifies the filename
// (Netlify's Linux host is case-sensitive), saves it, and prints the
// /uploads/... path to reference in code.

import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const UPLOADS = join(here, "..", "public", "uploads");

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/add-image.mjs <url> [name]");
  console.error("       node scripts/add-image.mjs <url1> <url2> ...");
  process.exit(1);
}

const isUrl = (s) => /^https?:\/\//i.test(s);

// Single mode when a custom name is given (2nd arg isn't itself a URL),
// otherwise treat every argument as a URL and auto-name from it.
let jobs;
if (args.length === 2 && isUrl(args[0]) && !isUrl(args[1])) {
  jobs = [{ url: args[0], name: args[1] }];
} else {
  jobs = args.filter(isUrl).map((url) => ({ url, name: null }));
}
if (jobs.length === 0) {
  console.error("No valid http(s) URL provided.");
  process.exit(1);
}

function detectExt(b) {
  if (b.length >= 4 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b.length >= 4 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return "gif";
  if (b.length >= 12 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (b.length >= 4 && b[0] === 0x00 && b[1] === 0x00 && b[2] === 0x01 && b[3] === 0x00) return "ico";
  const head = b.toString("utf8", 0, Math.min(256, b.length)).toLowerCase();
  if (head.includes("<svg") || (head.includes("<?xml") && head.includes("svg"))) return "svg";
  return null;
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

if (typeof fetch !== "function") {
  console.error("This script needs Node 18+ (global fetch).");
  process.exit(1);
}

await mkdir(UPLOADS, { recursive: true });

let ok = 0;
for (const { url, name } of jobs) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (image-fetch; aboutMe)" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0) throw new Error("downloaded 0 bytes");

    const ext = detectExt(buf);
    if (!ext) throw new Error("not a recognized image (png/jpg/gif/webp/svg/ico)");

    const raw = name || decodeURIComponent(new URL(url).pathname.split("/").pop() || "");
    // Allow an optional subfolder, e.g. "brands/acme" -> public/uploads/brands/acme.<ext>
    const segs = raw.split("/").filter(Boolean);
    const fileBase = segs.pop() || "";
    const subdir = segs.map(slugify).filter(Boolean).join("/");
    const slug = slugify(fileBase) || `image-${Date.now()}`;
    const dir = subdir ? join(UPLOADS, subdir) : UPLOADS;
    const ref = `/uploads/${subdir ? subdir + "/" : ""}${slug}.${ext}`;

    await mkdir(dir, { recursive: true });
    const outPath = join(dir, `${slug}.${ext}`);
    await writeFile(outPath, buf);
    console.log(`✓ ${(buf.length / 1024).toFixed(1).padStart(7)} KB  →  ${ref}`);
    ok++;
  } catch (err) {
    console.error(`✗ ${url}\n   ${err.message}`);
  }
}

console.log(`\nDone: ${ok}/${jobs.length} saved to public/uploads/`);
// Use exitCode (not process.exit) so pending libuv handles close cleanly on Windows.
process.exitCode = ok === jobs.length ? 0 : 1;
