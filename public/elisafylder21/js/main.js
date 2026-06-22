/* ============================================================================
   ELISAFYLDER21.COM — logik
   Nedtælling · sprogskift (DA/EN) · tidslinje · galleri · lightbox · Spotify
   Alt personligt indhold styres fra  js/content.js
   ============================================================================ */
(function () {
  "use strict";

  var C = window.SITE_CONTENT || {};
  var LANG_KEY = "efl-lang";
  var lang = localStorage.getItem(LANG_KEY) || C.defaultLang || "da";

  /* Gave-lås: nedtællingen skal være færdig (rigtige fødselsdag) før gaven kan åbnes.
     ?preview i adressen låser den op til DIN egen test — send aldrig det link til hende. */
  var GIFT_KEY = "efl-gift";
  var PREVIEW = /\bpreview\b/i.test(window.location.search + " " + window.location.hash);

  /* UI-tekster der ikke bor i content.js */
  var UI = {
    da: { days: "dage", hours: "timer", mins: "min.", secs: "sek.",
          done: "Tillykke med fødselsdagen \uD83E\uDD0D", addPhoto: "Tilføj billede",
          emptyMusic: "Indsæt et Spotify-link i js/content.js for at vise jeres sang her." },
    en: { days: "days", hours: "hours", mins: "min", secs: "sec",
          done: "Happy birthday \uD83E\uDD0D", addPhoto: "Add photo",
          emptyMusic: "Add a Spotify link in js/content.js to show your song here." }
  };

  /* ---------------------------- små hjælpere ---------------------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function getPath(path) {
    return path.split(".").reduce(function (o, k) { return (o == null) ? undefined : o[k]; }, C);
  }
  /* Henter en tekst i det aktive sprog, uanset om strukturen er
     {da,en}, eller fx hero.da.eyebrow / spotify.da.title */
  function resolveContent(path) {
    var v = getPath(path);
    if (typeof v === "string") return v;
    if (v && (typeof v.da === "string" || typeof v.en === "string")) return v[lang] != null ? v[lang] : (v.da != null ? v.da : v.en);
    var parts = path.split(".");
    var langPath = parts.slice(0, -1).concat(lang, parts[parts.length - 1]).join(".");
    v = getPath(langPath);
    if (typeof v === "string") return v;
    if (parts.length >= 2) {
      var alt = [parts[0], lang].concat(parts.slice(1)).join(".");
      v = getPath(alt);
      if (typeof v === "string") return v;
    }
    return undefined;
  }
  function L(obj) { /* vælg sprog fra et {da,en}-objekt */
    if (!obj) return "";
    return obj[lang] != null ? obj[lang] : (obj.da != null ? obj.da : obj.en);
  }

  /* ------------------------- statiske tekster --------------------------- */
  function applyStaticText() {
    document.documentElement.setAttribute("lang", lang);
    var nodes = document.querySelectorAll("[data-content]");
    nodes.forEach(function (n) {
      var val = resolveContent(n.getAttribute("data-content"));
      if (val !== undefined) n.textContent = val;
    });
    /* nedtællings-enheder */
    document.querySelectorAll("[data-unit]").forEach(function (n) {
      n.textContent = UI[lang][n.getAttribute("data-unit")];
    });
  }

  /* ----------------------------- tidslinje ------------------------------ */
  function renderTimeline() {
    var wrap = $("#timeline");
    if (!wrap || !C.timeline || !C.timeline.events) return;
    wrap.innerHTML = "";
    C.timeline.events.forEach(function (ev) {
      var item = el("div", "tl-item reveal");
      var dateStr = (ev.date && typeof ev.date === "object") ? L(ev.date) : ev.date;
      item.appendChild(el("p", "tl-date", esc(dateStr || "")));
      item.appendChild(el("h3", "tl-title", esc(L(ev) && L(ev).title)));
      item.appendChild(el("p", "tl-text", esc(L(ev) && L(ev).text)));
      wrap.appendChild(item);
    });
  }

  /* ------------------------------ galleri (billeder + film blandet) ----- */

  /* Auto-afspil film lydløst, kun mens de er synlige (sparer batteri/data). */
  function tryPlay(v) {
    var p = v.play();
    if (p && p.catch) {
      p.catch(function () {
        var retry = function () { v.removeEventListener("canplay", retry); var q = v.play(); if (q && q.catch) q.catch(function () {}); };
        v.addEventListener("canplay", retry);
      });
    }
  }
  var galleryVideoIO = ("IntersectionObserver" in window)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var v = e.target;
          if (e.isIntersecting) { tryPlay(v); }
          else { try { v.pause(); } catch (err) {} }
        });
      }, { threshold: 0.2 })
    : null;

  function shuffleArray(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* Bland billeder + film til én pulje. Rækkefølgen caches, så sprogskift
     ikke blander om hver gang. */
  var galleryOrder = null;
  function galleryPool() {
    if (galleryOrder) return galleryOrder;
    var imgs = (C.gallery && C.gallery.items)
      ? C.gallery.items.map(function (it) { return { kind: "image", item: it }; })
      : [];
    var vids = (C.video && C.video.items)
      ? C.video.items.filter(function (v) { return v && v.url; })
          .map(function (v) { return { kind: "video", item: v }; })
      : [];
    galleryOrder = shuffleArray(imgs.concat(vids));
    return galleryOrder;
  }

  function makeGalleryImage(it) {
    var shape = it.shape === "circle" ? " gallery__item--circle" : "";
    var fig = el("figure", "gallery__item reveal" + shape);
    var caption = L(it);

    var img = new Image();
    img.alt = caption || "";
    img.decoding = "async";

    var ph = el("div", "gallery__ph",
      '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1">' +
      '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/>' +
      '<path d="M3 17l5-4 4 3 3-2 6 5"/></svg><span>' + esc(UI[lang].addPhoto) + "</span>");

    // Pladsholderen vises mens billedet loader; skjules når det er klar.
    img.onerror = function () { fig.classList.add("is-placeholder"); };
    img.onload = function () {
      fig.classList.add("is-loaded");
      if (caption) fig.appendChild(el("figcaption", "gallery__cap", esc(caption)));
      fig.addEventListener("click", function () { openLightbox(it.src, caption); });
    };
    img.src = it.src;

    fig.appendChild(img);
    fig.appendChild(ph);
    return fig;
  }

  function makeGalleryVideo(v) {
    var fig = el("figure", "gallery__item gallery__item--video reveal is-loaded");
    var caption = L(v);
    var isLocal = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(String(v.url).trim());

    if (isLocal) {
      var vid = document.createElement("video");
      vid.muted = true;          // lydløs
      vid.defaultMuted = true;
      vid.loop = true;           // looper
      vid.playsInline = true;
      vid.autoplay = true;       // start automatisk (lydløs autoplay er tilladt)
      vid.setAttribute("muted", "");
      vid.setAttribute("playsinline", "");
      vid.setAttribute("webkit-playsinline", "");
      vid.setAttribute("autoplay", "");
      vid.preload = "metadata";
      if (v.poster) vid.poster = v.poster;
      var src = document.createElement("source");
      src.src = v.url;
      vid.appendChild(src);
      fig.appendChild(vid);
      if (galleryVideoIO) galleryVideoIO.observe(vid);
      tryPlay(vid);
    } else {
      // YouTube/Vimeo som fallback (kan ikke auto-loope lydløst, men vises pænt)
      var wrap = el("div", "gallery__embed");
      wrap.innerHTML = videoEmbed(v.url, v.poster);
      fig.appendChild(wrap);
    }

    if (caption) fig.appendChild(el("figcaption", "gallery__cap", esc(caption)));
    return fig;
  }

  function renderGallery() {
    var grid = $("#galleryGrid");
    if (!grid) return;
    grid.innerHTML = "";
    galleryPool().forEach(function (entry) {
      grid.appendChild(entry.kind === "video"
        ? makeGalleryVideo(entry.item)
        : makeGalleryImage(entry.item));
    });
  }

  /* ----------------------------- 21 grunde ------------------------------ */
  function renderReasons() {
    var list = $("#reasonsList");
    if (!list || !C.reasons || !C.reasons.items) return;
    list.innerHTML = "";
    C.reasons.items.forEach(function (r) {
      var li = el("li", "reason reveal", "<span>" + esc(L(r)) + "</span>");
      list.appendChild(li);
    });
  }

  /* ------------------------------- brev --------------------------------- */
  function renderLetter() {
    var card = $("#letterCard");
    if (!card || !C.letter) return;
    var d = C.letter[lang] || C.letter.da;
    var body = (d.body || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    card.innerHTML =
      '<p class="letter__greeting">' + esc(d.greeting) + "</p>" +
      '<div class="letter__body">' + body + "</div>" +
      '<p class="letter__sign">' + esc(d.sign) + '</p>' +
      '<p class="letter__name">' + esc(d.name) + "</p>";
  }

  /* ------------------------------ musik --------------------------------- */
  function spotifyEmbed(url) {
    if (!url) return null;
    var m = url.match(/(track|playlist|album|episode|artist)\/([A-Za-z0-9]+)/);
    if (!m) return null;
    var type = m[1], id = m[2];
    var tall = (type === "playlist" || type === "album" || type === "artist");
    var src = "https://open.spotify.com/embed/" + type + "/" + id + "?utm_source=generator&theme=0";
    return '<iframe src="' + src + '" height="' + (tall ? 352 : 152) + '" ' +
           'allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" ' +
           'loading="lazy"></iframe>';
  }
  function renderMusic() {
    var frame = $("#musicFrame");
    if (!frame) return;
    var url = C.spotify && C.spotify.url;
    var embed = spotifyEmbed(url);
    frame.innerHTML = embed
      ? embed
      : '<div class="music__empty">' + esc(UI[lang].emptyMusic) + "</div>";
  }

  /* ------------------------------ video --------------------------------- */
  function videoEmbed(url, poster) {
    if (!url) return null;
    var u = String(url).trim();

    // Lokal videofil (mp4/webm/ogg/mov/m4v)
    if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(u)) {
      return '<video class="video__el" controls playsinline preload="metadata"' +
        (poster ? ' poster="' + esc(poster) + '"' : "") + ">" +
        '<source src="' + esc(u) + '">' +
        "</video>";
    }
    // YouTube (watch, youtu.be, embed, shorts)
    var yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    if (yt) {
      var ysrc = "https://www.youtube-nocookie.com/embed/" + yt[1] + "?rel=0";
      return '<iframe class="video__el" src="' + ysrc + '" title="video" ' +
        'allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" ' +
        'allowfullscreen loading="lazy"></iframe>';
    }
    // Vimeo
    var vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vm) {
      var vsrc = "https://player.vimeo.com/video/" + vm[1];
      return '<iframe class="video__el" src="' + vsrc + '" title="video" ' +
        'allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
    }
    // Ukendt link — forsoeg som direkte videokilde
    return '<video class="video__el" controls playsinline preload="metadata"' +
      (poster ? ' poster="' + esc(poster) + '"' : "") + '><source src="' + esc(u) + '"></video>';
  }

  /* ===================== HEMMELIG GAVE (vault + lås + reveal) ============= */
  function isBirthdayReached() {
    var t = new Date(C.birthday).getTime();
    return !isNaN(t) && Date.now() >= t;
  }
  function giftRemembered() {
    try { return localStorage.getItem(GIFT_KEY) === "open"; } catch (e) { return false; }
  }
  function rememberGift() {
    try { localStorage.setItem(GIFT_KEY, "open"); } catch (e) {}
  }
  function pickLang(obj) {
    if (!obj) return {};
    return obj[lang] || obj.da || obj.en || {};
  }
  function lockSvg(open) {
    var shackle = open
      ? '<path d="M16 23 V15 a8 8 0 0 1 15.6 -2.4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'
      : '<path d="M16 23 V15 a8 8 0 0 1 16 0 V23" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>';
    return '<div class="vault__lock"><svg viewBox="0 0 48 50" aria-hidden="true">' + shackle +
      '<rect x="9" y="23" width="30" height="24" rx="5" fill="none" stroke="currentColor" stroke-width="2.4"/>' +
      '<circle cx="24" cy="33" r="3" fill="currentColor"/>' +
      '<line x1="24" y1="35.5" x2="24" y2="41" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>' +
      '</svg></div>';
  }
  function renderVault() {
    var sec = document.getElementById("vault");
    var inner = $("#vaultInner");
    var navGift = document.getElementById("navGift");
    var g = C.gift;
    if (!sec || !inner || !g) return;

    var unlocked = PREVIEW || isBirthdayReached();
    var showTeaser = (g.showTeaser !== false);

    if (!unlocked && !showTeaser) {           // helt skjult indtil dagen
      sec.style.display = "none";
      if (navGift) navGift.style.display = "none";
      return;
    }
    sec.style.display = "";
    if (navGift) navGift.style.display = "";

    if (unlocked) {
      var u = pickLang(g.unlocked);
      inner.className = "vault__inner is-unlocked is-visible";
      inner.innerHTML =
        (u.badge ? '<span class="vault__badge">' + esc(u.badge) + "</span>" : "") +
        lockSvg(true) +
        '<h2 class="vault__title">' + esc(u.title || "") + "</h2>" +
        '<p class="vault__text">' + esc(u.text || "") + "</p>" +
        '<button class="vault__btn" id="giftOpenBtn" type="button">' + esc(u.button || "") + "</button>";
      var btn = $("#giftOpenBtn");
      if (btn) btn.addEventListener("click", function () {
        /* Har hun låst op før, springer vi direkte til gaven (men i ?preview
           gennemspilles kodeord + minigame altid, så Anders kan teste). */
        if (!PREVIEW && giftRemembered()) openGift(); else openGate();
      });
    } else {
      var lk = pickLang(g.locked);
      inner.className = "vault__inner is-locked is-visible";
      inner.innerHTML =
        (lk.badge ? '<span class="vault__badge">' + esc(lk.badge) + "</span>" : "") +
        lockSvg(false) +
        '<h2 class="vault__title">' + esc(lk.title || "") + "</h2>" +
        '<p class="vault__text">' + esc(lk.text || "") + "</p>";
    }
  }

  /* --- Kodeords-lås (gate) --- */
  function openGate() {
    var gateEl = $("#gate");
    if (!gateEl || !C.gift) return;
    var t = pickLang(C.gift.gate);
    $("#gateTitle").textContent = t.title || "";
    $("#gateHint").textContent = t.hint || "";
    var input = $("#gateInput");
    input.placeholder = t.placeholder || "";
    input.value = "";
    $("#gateBtn").textContent = t.button || "";
    var err = $("#gateError"); err.textContent = ""; err.classList.remove("is-shown");
    gateEl.classList.add("is-open");
    gateEl.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(function () { input.focus(); }, 220);
  }
  function closeGate() {
    var gateEl = $("#gate");
    if (!gateEl) return;
    gateEl.classList.remove("is-open");
    gateEl.setAttribute("aria-hidden", "true");
    if (!isGiftOpen()) document.body.style.overflow = "";
  }
  function normalize(s) {
    return String(s == null ? "" : s).trim().toLowerCase().replace(/\s+/g, "");
  }
  function checkPassword() {
    var input = $("#gateInput");
    var t = pickLang(C.gift.gate);
    if (normalize(input.value) === normalize(C.gift.password)) {
      rememberGift();
      closeGate();
      openGame();            // først minigamet — derefter selve gaven
    } else {
      var card = $(".gate__card");
      var err = $("#gateError");
      err.textContent = t.error || "";
      err.classList.add("is-shown");
      card.classList.remove("is-wrong");
      void card.offsetWidth;                  // reflow så shake-animationen genstarter
      card.classList.add("is-wrong");
      input.select();
    }
  }

  /* --- Selve gaven (reveal-overlay) --- */
  function isGiftOpen() {
    var o = $("#giftOverlay");
    return !!(o && o.classList.contains("is-open"));
  }
  function renderGiftContent() {
    var inner = $("#giftInner");
    if (!inner || !C.gift || !C.gift.reveal) return;
    var rev = C.gift.reveal;
    var r = pickLang(rev);
    var lines = (r.lines || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");

    var gallery = "";
    var imgs = rev.images || [];
    if (imgs.length) {
      gallery = '<div class="giftview__gallery gv-anim d3">' +
        imgs.map(function (im) {
          var cap = L(im);
          return '<figure class="gv-shot" data-src="' + esc(im.src) + '" data-cap="' + esc(cap) + '" ' +
                 'tabindex="0" role="button" aria-label="' + esc(cap) + '">' +
            '<img src="' + esc(im.src) + '" alt="' + esc(cap) + '" loading="lazy" decoding="async">' +
            '<figcaption>' + esc(cap) + "</figcaption>" +
          "</figure>";
        }).join("") +
      "</div>";
    }
    var credit = rev.credit ? L(rev.credit) : "";

    inner.innerHTML =
      (r.eyebrow ? '<p class="giftview__eyebrow gv-anim d1">' + esc(r.eyebrow) + "</p>" : "") +
      '<div class="giftview__rule gv-anim d1"></div>' +
      '<h2 class="giftview__headline gv-anim d2">' + esc(r.headline || "") + "</h2>" +
      (r.location ? '<p class="giftview__location gv-anim d2">' + esc(r.location) + "</p>" : "") +
      '<div class="giftview__lines gv-anim d3">' + lines + "</div>" +
      gallery +
      (r.note ? '<p class="giftview__note gv-anim d4">' + esc(r.note) + "</p>" : "") +
      (r.signature ? '<p class="giftview__sign gv-anim d4">' + esc(r.signature) + "</p>" : "") +
      (credit ? '<p class="giftview__credit">' + esc(credit) + "</p>" : "");

    /* Billederne kan forstørres i lightboxen */
    inner.querySelectorAll(".gv-shot").forEach(function (fig) {
      function open() { openLightbox(fig.getAttribute("data-src"), fig.getAttribute("data-cap")); }
      fig.addEventListener("click", open);
      fig.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
    });
  }
  function openGift() {
    var o = $("#giftOverlay");
    if (!o) return;
    renderGiftContent();
    o.classList.add("is-open");
    o.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    confetti();
  }
  function closeGift() {
    var o = $("#giftOverlay");
    if (!o) return;
    o.classList.remove("is-open");
    o.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function setupGift() {
    var form = $("#gateForm");
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); checkPassword(); });
    var gc = $("#gateClose"); if (gc) gc.addEventListener("click", closeGate);
    var gateEl = $("#gate");
    if (gateEl) gateEl.addEventListener("click", function (e) { if (e.target === gateEl) closeGate(); });
    var gmc = $("#gameClose"); if (gmc) gmc.addEventListener("click", closeGame);
    var gx = $("#giftClose"); if (gx) gx.addEventListener("click", closeGift);
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (lb && lb.classList.contains("is-open")) return;   // lightboxen lukker sig selv
      if (isGiftOpen()) closeGift();
      else if (isGameOpen()) closeGame();
      else if (gateEl && gateEl.classList.contains("is-open")) closeGate();
    });
  }

  /* ===================== MINIGAME: POP BALLONERNE ======================= */
  var GAME_COLORS = ["#E7B6C0", "#C2A05E", "#9DBEB0", "#C7B2D6", "#F0CBA0", "#A9C4D8", "#E8A6A0", "#D9C39A"];

  function gameData() { return (C.gift && C.gift.game) ? C.gift.game : null; }
  function gameBalloons() { var g = gameData(); return (g && g.balloons) ? g.balloons : []; }
  function gameClueTotal() { return gameBalloons().filter(function (b) { return b.type === "clue"; }).length; }
  function isGameOpen() { var o = $("#gameOverlay"); return !!(o && o.classList.contains("is-open")); }

  function balloonSvg(color) {
    return '<svg class="gb-balloon__svg" viewBox="0 0 50 74" aria-hidden="true">' +
      '<ellipse cx="25" cy="26" rx="22" ry="27" fill="' + color + '"/>' +
      '<ellipse cx="17" cy="17" rx="5.5" ry="8" fill="rgba(255,255,255,0.55)"/>' +
      '<path d="M21 51 L25 57 L29 51 Z" fill="' + color + '"/>' +
      '<path d="M25 57 q5 6 0 11 q-5 5 0 6" fill="none" stroke="rgba(120,96,64,0.4)" stroke-width="1"/>' +
      "</svg>";
  }

  var gameState = null;

  function renderGameContent() {
    var inner = $("#gameInner");
    var g = gameData();
    if (!inner || !g) return;
    var t = pickLang(g);
    inner.innerHTML =
      '<div class="game__head">' +
        (t.eyebrow ? '<p class="game__eyebrow">' + esc(t.eyebrow) + "</p>" : "") +
        '<h2 class="game__title">' + esc(t.title || "") + "</h2>" +
        '<p class="game__intro">' + esc(t.intro || "") + "</p>" +
      "</div>" +
      '<div class="game__field" id="gameField"></div>' +
      '<div class="game__tray">' +
        '<p class="game__counter"><span id="gameClueCount">0</span> / ' + gameClueTotal() + " " + esc(t.counter || "") + "</p>" +
        '<div class="game__clues" id="gameClues"></div>' +
        '<button class="game__reveal" id="gameReveal" type="button" hidden>' + esc(t.revealBtn || "") + "</button>" +
      "</div>";
    var rv = $("#gameReveal");
    if (rv) rv.addEventListener("click", function () { closeGame(); openGift(); });
  }

  function openGame() {
    var o = $("#gameOverlay");
    if (!o || !gameData()) { openGift(); return; }   // intet spil defineret -> direkte til gaven
    renderGameContent();
    o.classList.add("is-open");
    o.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    startGame();
  }
  function closeGame() {
    var o = $("#gameOverlay");
    if (!o) return;
    o.classList.remove("is-open");
    o.setAttribute("aria-hidden", "true");
    if (gameState && gameState.timers) gameState.timers.forEach(function (id) { clearTimeout(id); });
    gameState = null;
    if (!isGiftOpen()) document.body.style.overflow = "";
  }

  function startGame() {
    var field = $("#gameField");
    if (!field) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var balloons = gameBalloons();
    gameState = { total: balloons.length, popped: 0, clues: 0, timers: [] };
    if (reduce) field.classList.add("game__field--static");
    balloons.forEach(function (b, i) { addBalloon(field, b, i, balloons.length, reduce); });
  }

  function addBalloon(field, data, i, total, reduce) {
    var color = GAME_COLORS[i % GAME_COLORS.length];
    var btn = el("button", "gb-balloon");
    btn.type = "button";
    var label = L(data);
    btn.setAttribute("aria-label", label);
    if (!reduce) {
      var lane = 12 + 76 * (total <= 1 ? 0.5 : i / (total - 1)) + (Math.random() * 5 - 2.5);
      lane = Math.max(10, Math.min(90, lane));
      var dur = 7 + Math.random() * 5;
      var delay = -(Math.random() * dur);
      var sway = (8 + Math.random() * 14) * (Math.random() < 0.5 ? -1 : 1);
      var size = 50 + Math.random() * 16;
      btn.style.cssText = "left:" + lane.toFixed(1) + "%;width:" + size.toFixed(0) + "px;" +
        "--dur:" + dur.toFixed(2) + "s;--delay:" + delay.toFixed(2) + "s;--sway:" + sway.toFixed(0) + "px;";
    }
    btn.innerHTML = balloonSvg(color) +
      '<span class="gb-balloon__emoji">' + esc(data.emoji) + "</span>" +
      '<span class="gb-balloon__label">' + esc(label) + "</span>";
    btn.addEventListener("click", function () {
      if (!btn.classList.contains("is-pop")) popBalloon(btn, data);
    });
    field.appendChild(btn);
  }

  function popBalloon(btn, data) {
    if (!gameState) return;
    var field = $("#gameField");
    /* Frys ballonen præcis hvor den er, så pop-animationen ikke "hopper" */
    if (field) {
      var fr0 = field.getBoundingClientRect();
      var br0 = btn.getBoundingClientRect();
      btn.style.left = (br0.left - fr0.left) + "px";
      btn.style.top = (br0.top - fr0.top) + "px";
      btn.style.width = br0.width + "px";
    }
    btn.classList.add("is-pop");
    btn.style.animation = "gbPop 0.42s cubic-bezier(0.22,1,0.36,1) forwards";
    btn.disabled = true;
    spawnBurst(btn, data);
    gameState.popped++;
    if (data.type === "clue") {
      gameState.clues++;
      addClueChip(data);
      var cc = $("#gameClueCount");
      if (cc) cc.textContent = gameState.clues;
    }
    var t = setTimeout(function () { if (btn.parentNode) btn.parentNode.removeChild(btn); }, 440);
    gameState.timers.push(t);
    if (gameState.popped >= gameState.total) finishGame();
  }

  function spawnBurst(btn, data) {
    var field = $("#gameField");
    if (!field) return;
    var fr = field.getBoundingClientRect();
    var br = btn.getBoundingClientRect();
    var x = br.left - fr.left + br.width / 2;
    var y = br.top - fr.top + br.height / 2;

    var burst = el("div", "gb-burst");
    burst.style.left = x + "px";
    burst.style.top = y + "px";
    for (var k = 0; k < 6; k++) {
      var dot = el("i", "gb-burst__dot");
      var ang = (Math.PI * 2 * k) / 6;
      dot.style.setProperty("--dx", (Math.cos(ang) * 26).toFixed(0) + "px");
      dot.style.setProperty("--dy", (Math.sin(ang) * 26).toFixed(0) + "px");
      burst.appendChild(dot);
    }
    field.appendChild(burst);

    var msg = (data.type === "guess")
      ? (lang === "en" ? data.reactEn : data.reactDa)
      : ("\u2728 " + L(data));
    if (msg) {
      var m = el("div", "gb-msg" + (data.type === "clue" ? " gb-msg--clue" : ""), esc(msg));
      m.style.left = x + "px";
      m.style.top = y + "px";
      field.appendChild(m);
      var tm = setTimeout(function () { if (m.parentNode) m.parentNode.removeChild(m); }, 1300);
      gameState.timers.push(tm);
    }
    var tb = setTimeout(function () { if (burst.parentNode) burst.parentNode.removeChild(burst); }, 720);
    gameState.timers.push(tb);
  }

  function addClueChip(data) {
    var tray = $("#gameClues");
    if (!tray) return;
    tray.appendChild(el("span", "gb-chip", esc(data.emoji) + " <b>" + esc(L(data)) + "</b>"));
  }

  function finishGame() {
    var g = pickLang(gameData());
    var counter = $(".game__counter");
    if (counter && g.done) counter.textContent = g.done;
    var rv = $("#gameReveal");
    if (rv) { rv.hidden = false; rv.classList.add("is-ready"); try { rv.focus(); } catch (e) {} }
    confetti();
  }

  /* ---------------------------- nedtælling ------------------------------ */
  function setupCountdown() {
    var box = $("#countdown");
    if (!box) return;
    var target = new Date(C.birthday).getTime();
    var celebrate = el("p", "countdown__celebrate", esc(UI[lang].done));
    box.appendChild(celebrate);

    var refs = {
      days: $("#cdDays"), hours: $("#cdHours"),
      mins: $("#cdMins"), secs: $("#cdSecs")
    };
    function pad(n) { return (n < 10 ? "0" : "") + n; }

    function tick() {
      var diff = target - Date.now();
      if (isNaN(target)) return;
      if (diff <= 0) {
        box.classList.add("is-done");
        celebrate.textContent = UI[lang].done;
        if (!box.dataset.celebrated) { box.dataset.celebrated = "1"; confetti(); balloons(); renderVault(); }
        clearInterval(window.__cdTimer);
        return;
      }
      var s = Math.floor(diff / 1000);
      refs.days.textContent  = Math.floor(s / 86400);
      refs.hours.textContent = pad(Math.floor((s % 86400) / 3600));
      refs.mins.textContent  = pad(Math.floor((s % 3600) / 60));
      refs.secs.textContent  = pad(s % 60);
    }
    tick();
    window.__cdTimer = setInterval(tick, 1000);
  }

  /* Diskret guld/rosa konfetti når dagen er kommet */
  function confetti() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var colors = ["#C2A05E", "#D9C39A", "#E7C3CC", "#F4DCE1", "#A8842F"];
    var layer = el("div", "");
    layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:120;overflow:hidden";
    document.body.appendChild(layer);
    for (var i = 0; i < 80; i++) {
      var p = el("div", "");
      var size = 6 + Math.random() * 7;
      p.style.cssText =
        "position:absolute;top:-20px;left:" + (Math.random() * 100) + "%;" +
        "width:" + size + "px;height:" + (size * 0.5) + "px;" +
        "background:" + colors[i % colors.length] + ";opacity:" + (0.6 + Math.random() * 0.4) + ";" +
        "border-radius:2px;transform:rotate(" + (Math.random() * 360) + "deg);" +
        "animation:fall " + (3.5 + Math.random() * 3) + "s linear " + (Math.random() * 2) + "s forwards";
      layer.appendChild(p);
    }
    var style = el("style", "");
    style.textContent = "@keyframes fall{to{transform:translateY(110vh) rotate(720deg);opacity:0}}";
    document.head.appendChild(style);
    setTimeout(function () { layer.remove(); }, 9000);
  }

  /* Farvede balloner der svæver op når nedtællingen er gået 🎈 */
  function balloons(count) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    count = count || 16;
    var colors = [
      "#E7B6C0", // rosa
      "#C2A05E", // guld
      "#9DBEB0", // mint
      "#C7B2D6", // lavendel
      "#F0CBA0", // fersken
      "#A9C4D8", // støvet blå
      "#E8A6A0", // koral
      "#D9C39A"  // champagne
    ];
    var layer = document.getElementById("balloonLayer");
    if (!layer) {
      layer = el("div", "balloons-layer");
      layer.id = "balloonLayer";
      document.body.appendChild(layer);
    }
    var longest = 0;
    for (var i = 0; i < count; i++) {
      var color = colors[i % colors.length];
      var left = Math.random() * 96 + 2;          // 2–98 %
      var dur = 8 + Math.random() * 5;            // 8–13 s
      var delay = Math.random() * 3.5;            // forskudt start
      var size = 42 + Math.random() * 30;         // 42–72 px bred
      var sway = Math.random() * 80 - 40;         // -40…+40 px sideglid
      longest = Math.max(longest, dur + delay);
      var b = el("div", "balloon");
      b.style.cssText =
        "left:" + left + "%;width:" + size + "px;" +
        "--dur:" + dur.toFixed(2) + "s;--delay:" + delay.toFixed(2) + "s;--sway:" + sway.toFixed(0) + "px;";
      b.innerHTML =
        '<svg viewBox="0 0 50 74" aria-hidden="true">' +
          '<ellipse cx="25" cy="26" rx="22" ry="27" fill="' + color + '"/>' +
          '<ellipse cx="17" cy="17" rx="5.5" ry="8" fill="rgba(255,255,255,0.5)"/>' +
          '<path d="M21 51 L25 57 L29 51 Z" fill="' + color + '"/>' +
          '<path d="M25 57 q5 6 0 11 q-5 5 0 6" fill="none" stroke="rgba(120,96,64,0.45)" stroke-width="1"/>' +
        '</svg>';
      layer.appendChild(b);
    }
    // ryd op når den sidste ballon er ude af billedet
    setTimeout(function () {
      if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
    }, longest * 1000 + 800);
  }
  /* eksponer så fejrings-blokken kan kalde den */
  window.__balloons = balloons;

  /* ----------------------------- lightbox ------------------------------- */
  var lb = $("#lightbox"), lbImg = $("#lightboxImg"), lbCap = $("#lightboxCap");
  function openLightbox(src, cap) {
    if (!lb) return;
    lbImg.src = src;
    lbImg.alt = cap || "";
    lbCap.textContent = cap || "";
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lb) return;
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    /* Hvis gaven/minigamet stadig er åbent bagved, holdes baggrunden låst */
    document.body.style.overflow = (isGiftOpen() || isGameOpen()) ? "hidden" : "";
  }
  if (lb) {
    $("#lightboxClose").addEventListener("click", closeLightbox);
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (!lb.classList.contains("is-open")) return;
      e.stopImmediatePropagation();   // luk KUN lightboxen — ikke gaven bagved
      closeLightbox();
    });
  }

  /* -------------------------- reveal ved scroll ------------------------- */
  var io = ("IntersectionObserver" in window)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" })
    : null;
  function observeReveals() {
    document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (n) {
      if (io) io.observe(n); else n.classList.add("is-visible");
    });
  }

  /* ------------------------------- nav ---------------------------------- */
  function setupNav() {
    var nav = $("#nav"), burger = $("#navBurger"), links = $("#navLinks");
    window.addEventListener("scroll", function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 40);
    }, { passive: true });

    if (burger && links) {
      burger.addEventListener("click", function () {
        var open = links.classList.toggle("is-open");
        burger.classList.toggle("is-open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      links.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          links.classList.remove("is-open");
          burger.classList.remove("is-open");
          burger.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  /* --------------------------- sprogskift ------------------------------- */
  function setupLangToggle() {
    var toggle = $("#langToggle");
    if (!toggle) return;
    toggle.addEventListener("click", function () {
      lang = (lang === "da") ? "en" : "da";
      localStorage.setItem(LANG_KEY, lang);
      toggle.querySelectorAll(".lang-toggle__opt").forEach(function (s) {
        s.classList.toggle("is-active", s.getAttribute("data-lang") === lang);
      });
      renderAll();
    });
    toggle.querySelectorAll(".lang-toggle__opt").forEach(function (s) {
      s.classList.toggle("is-active", s.getAttribute("data-lang") === lang);
    });
  }

  /* ----------------------------- render --------------------------------- */
  function renderAll() {
    applyStaticText();
    renderTimeline();
    renderGallery();
    renderReasons();
    renderLetter();
    renderMusic();
    renderVault();
    if (isGiftOpen()) renderGiftContent();
    observeReveals();
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.SITE_CONTENT) {
      console.error("content.js mangler eller kunne ikke indlæses.");
      return;
    }
    renderAll();
    setupCountdown();
    setupNav();
    setupLangToggle();
    setupGift();

    /* ?preview lader Anders se f\u00f8dselsdags-stemningen (balloner) f\u00f8r dagen. */
    if (PREVIEW && !isBirthdayReached()) {
      setTimeout(function () { balloons(); }, 700);
    }
  });
})();
