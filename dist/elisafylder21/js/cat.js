/* ============================================================================
   ELISAFYLDER21.COM — den søde kat 🐱
   En lille cremehvid kat med guldhalsbånd der:
     • trasker rundt langs bunden af skærmen
     • blinker, vifter med halen, kigger sig omkring (idle)
     • hopper op og sætter sig på sektioner / kort
     • reagerer på scroll (løber i scroll-retningen, hopper ned fra sin plads)
     • maver og sender et hjerte når man klikker på den
   Selvstændigt modul — påvirker ikke resten af siden.
   ============================================================================ */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Kattens udseende (side-profil, kigger mod højre) ---- */
  var CAT_SVG =
    '<svg viewBox="0 0 128 104" width="100%" height="100%" aria-hidden="true">' +
      '<defs>' +
        '<linearGradient id="catFur" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#FCF7F0"/>' +
          '<stop offset="1" stop-color="#EFE2CF"/>' +
        '</linearGradient>' +
      '</defs>' +
      // skygge under katten
      '<ellipse class="cat-shadow" cx="64" cy="98" rx="40" ry="6" fill="rgba(124,96,64,0.18)"/>' +
      // hale
      '<g class="cat-tail">' +
        '<path d="M26 70 C2 66 6 36 20 28 C26 24 32 28 28 34 C18 42 20 60 34 64 Z" ' +
              'fill="url(#catFur)" stroke="#D9C39A" stroke-width="1.2"/>' +
      '</g>' +
      // bagben (animeres ved gang)
      '<g class="cat-legs" stroke="#D9C39A" stroke-width="1">' +
        '<rect class="cat-leg cat-leg--b1" x="40" y="78" width="9" height="18" rx="4.5" fill="url(#catFur)"/>' +
        '<rect class="cat-leg cat-leg--f1" x="78" y="78" width="9" height="18" rx="4.5" fill="url(#catFur)"/>' +
        '<rect class="cat-leg cat-leg--b2" x="52" y="80" width="9" height="16" rx="4.5" fill="url(#catFur)"/>' +
        '<rect class="cat-leg cat-leg--f2" x="90" y="80" width="9" height="16" rx="4.5" fill="url(#catFur)"/>' +
      '</g>' +
      // krop
      '<ellipse cx="62" cy="64" rx="40" ry="24" fill="url(#catFur)" stroke="#D9C39A" stroke-width="1.3"/>' +
      // hoved
      '<g class="cat-head">' +
        // ører
        '<path d="M78 36 L72 14 L92 28 Z" fill="url(#catFur)" stroke="#D9C39A" stroke-width="1.2"/>' +
        '<path d="M104 30 L116 12 L118 36 Z" fill="url(#catFur)" stroke="#D9C39A" stroke-width="1.2"/>' +
        '<path class="cat-ear-in" d="M80 32 L77 21 L88 29 Z" fill="#E7C3CC"/>' +
        '<path class="cat-ear-in" d="M106 30 L112 19 L114 33 Z" fill="#E7C3CC"/>' +
        // hovedform
        '<circle cx="98" cy="52" r="24" fill="url(#catFur)" stroke="#D9C39A" stroke-width="1.3"/>' +
        // kinder
        '<circle cx="90" cy="58" r="6.5" fill="#F4DCE1" opacity="0.65"/>' +
        '<circle cx="108" cy="58" r="6.5" fill="#F4DCE1" opacity="0.65"/>' +
        // øjne (blinker)
        '<g class="cat-eyes">' +
          '<g class="cat-eye">' +
            '<ellipse cx="91" cy="50" rx="3.6" ry="4.6" fill="#3A2E26"/>' +
            '<circle cx="92.2" cy="48.4" r="1.2" fill="#fff"/>' +
          '</g>' +
          '<g class="cat-eye">' +
            '<ellipse cx="106" cy="50" rx="3.6" ry="4.6" fill="#3A2E26"/>' +
            '<circle cx="107.2" cy="48.4" r="1.2" fill="#fff"/>' +
          '</g>' +
        '</g>' +
        // næse
        '<path d="M97 57 L101 57 L99 60 Z" fill="#E08AA0"/>' +
        // mund
        '<path d="M99 60 q-3 4 -6 2 M99 60 q3 4 6 2" fill="none" stroke="#B98A7A" stroke-width="1" stroke-linecap="round"/>' +
        // tunge (vises når katten slikker sig selv)
        '<ellipse class="cat-tongue" cx="99" cy="64" rx="2.6" ry="3.6" fill="#F2A0B4"/>' +
        // knurhår
        '<g stroke="#D9C39A" stroke-width="0.9" stroke-linecap="round" opacity="0.8">' +
          '<path d="M86 54 L70 50"/><path d="M86 57 L70 58"/>' +
          '<path d="M112 54 L128 50"/><path d="M112 57 L128 58"/>' +
        '</g>' +
      '</g>' +
      // guld-halsbånd med lille hjerte
      '<path d="M80 70 Q98 80 116 68" fill="none" stroke="#C2A05E" stroke-width="3.2" stroke-linecap="round"/>' +
      '<path class="cat-charm" d="M98 75 c-1.6 -2.4 -5 -1.2 -5 1.4 c0 2 2.6 3.6 5 5.6 c2.4 -2 5 -3.6 5 -5.6 c0 -2.6 -3.4 -3.8 -5 -1.4 Z" fill="#C2A05E"/>' +
    '</svg>';

  /* ---- Oprejst, fremadvendt kat der sidder på numsen og slikker sig selv ---- */
  var UPRIGHT_SVG =
    '<svg viewBox="0 0 128 104" width="100%" height="100%" aria-hidden="true">' +
      '<defs>' +
        '<linearGradient id="catFurU" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#FCF7F0"/>' +
          '<stop offset="1" stop-color="#EFE2CF"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<ellipse class="cat-shadow" cx="64" cy="99" rx="30" ry="5" fill="rgba(124,96,64,0.18)"/>' +
      // hale krøllet rundt om højre side
      '<g class="cat-tail-up">' +
        '<path d="M86 90 C110 88 114 60 92 54 C106 62 102 82 82 84 Z" fill="url(#catFurU)" stroke="#D9C39A" stroke-width="1.2"/>' +
      '</g>' +
      // bagpoter splittet ud
      '<ellipse cx="47" cy="95" rx="10" ry="5.5" fill="url(#catFurU)" stroke="#D9C39A" stroke-width="1"/>' +
      '<ellipse cx="81" cy="95" rx="10" ry="5.5" fill="url(#catFurU)" stroke="#D9C39A" stroke-width="1"/>' +
      // siddende krop (pæreformet, bred forneden)
      '<path d="M46 52 C39 64 36 80 43 89 C48 96 55 98 64 98 C73 98 80 96 85 89 C92 80 89 64 82 52 C78 43 72 41 64 41 C56 41 50 43 46 52 Z" fill="url(#catFurU)" stroke="#D9C39A" stroke-width="1.3"/>' +
      // forben + poter (tæt sammen i midten). Det højre skjules når den slikker (erstattes af hævet pote)
      '<rect x="56" y="72" width="7.5" height="24" rx="3.7" fill="url(#catFurU)" stroke="#D9C39A" stroke-width="1"/>' +
      '<ellipse cx="59.7" cy="95" rx="5" ry="3.4" fill="url(#catFurU)" stroke="#D9C39A" stroke-width="1"/>' +
      '<g class="cat-up-frontpaw-r">' +
        '<rect x="64.5" y="72" width="7.5" height="24" rx="3.7" fill="url(#catFurU)" stroke="#D9C39A" stroke-width="1"/>' +
        '<ellipse cx="68.2" cy="95" rx="5" ry="3.4" fill="url(#catFurU)" stroke="#D9C39A" stroke-width="1"/>' +
      '</g>' +
      // hoved (kan dyppe ned når den slikker)
      '<g class="cat-up-head">' +
        // ører
        '<path d="M48 24 L44 5 L62 18 Z" fill="url(#catFurU)" stroke="#D9C39A" stroke-width="1.2"/>' +
        '<path d="M80 18 L84 5 L80 24 Z" fill="url(#catFurU)" stroke="#D9C39A" stroke-width="1.2"/>' +
        '<path class="cat-ear-in" d="M50 22 L47 11 L59 19 Z" fill="#E7C3CC"/>' +
        '<path class="cat-ear-in" d="M79 20 L82 11 L80 22 Z" fill="#E7C3CC"/>' +
        // hovedform
        '<circle cx="64" cy="30" r="22" fill="url(#catFurU)" stroke="#D9C39A" stroke-width="1.3"/>' +
        // kinder
        '<circle cx="51" cy="34" r="6.5" fill="#F4DCE1" opacity="0.65"/>' +
        '<circle cx="77" cy="34" r="6.5" fill="#F4DCE1" opacity="0.65"/>' +
        // øjne (blinker)
        '<g class="cat-eyes">' +
          '<g class="cat-eye"><ellipse cx="55" cy="29" rx="3.6" ry="4.6" fill="#3A2E26"/><circle cx="56.2" cy="27.4" r="1.2" fill="#fff"/></g>' +
          '<g class="cat-eye"><ellipse cx="73" cy="29" rx="3.6" ry="4.6" fill="#3A2E26"/><circle cx="74.2" cy="27.4" r="1.2" fill="#fff"/></g>' +
        '</g>' +
        // næse
        '<path d="M61 37 L67 37 L64 40.5 Z" fill="#E08AA0"/>' +
        // mund
        '<path d="M64 40.5 q-3.5 4 -7 1.5 M64 40.5 q3.5 4 7 1.5" fill="none" stroke="#B98A7A" stroke-width="1" stroke-linecap="round"/>' +
        // tunge (flikker når den slikker)
        '<ellipse class="cat-up-tongue" cx="64" cy="44" rx="3" ry="4" fill="#F2A0B4"/>' +
        // knurhår
        '<g stroke="#D9C39A" stroke-width="0.9" stroke-linecap="round" opacity="0.8">' +
          '<path d="M48 34 L30 31"/><path d="M48 37 L30 39"/>' +
          '<path d="M80 34 L98 31"/><path d="M80 37 L98 39"/>' +
        '</g>' +
      '</g>' +
      // guld-halsbånd med hjerte
      '<path d="M50 49 Q64 58 78 49" fill="none" stroke="#C2A05E" stroke-width="3.2" stroke-linecap="round"/>' +
      '<path class="cat-charm" d="M64 54 c-1.6 -2.4 -5 -1.2 -5 1.4 c0 2 2.6 3.6 5 5.6 c2.4 -2 5 -3.6 5 -5.6 c0 -2.6 -3.4 -3.8 -5 -1.4 Z" fill="#C2A05E"/>' +
      // hævet slikke-pote (foran brystet, op mod hagen) — vises når den plejer sig
      '<g class="cat-up-lickpaw">' +
        '<path d="M60 70 C57 60 59 49 64 44 C66 42 69 43 69 46 C69 54 66 62 65 70 Z" fill="url(#catFurU)" stroke="#D9C39A" stroke-width="1"/>' +
        '<ellipse cx="66" cy="44" rx="4.2" ry="3.2" fill="url(#catFurU)" stroke="#D9C39A" stroke-width="1"/>' +
      '</g>' +
    '</svg>';

  /* ---- DOM ---- */
  var root = document.createElement("div");
  root.className = "cat-root";
  root.setAttribute("aria-hidden", "true");
  root.innerHTML =
    '<div class="cat" id="elisaCat" title="Klap mig!">' +
      '<div class="cat__bubble" aria-hidden="true">miav</div>' +
      '<div class="cat__flip">' +
        '<div class="cat__bob">' +
          '<div class="cat-side">' + CAT_SVG + '</div>' +
          '<div class="cat-up">' + UPRIGHT_SVG + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  function mount() {
    document.body.appendChild(root);
    init();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

  /* ---- Tilstand ---- */
  var catEl, flipEl, bobEl, bubbleEl;
  var CAT_W = 84, CAT_H = 68;
  // Kattens krop-midte i SVG'en (ellipse cx=62, cy=64 i viewBox 128x104)
  var BODY_CX = 62 / 128, BODY_CY = 64 / 104;
  // Oprejst positur: centreret (x=0.5), numsen i bunden (~y96/104)
  var UP_CX = 0.5, UP_PAW_FRAC = 0.94;
  var _measCtx = null;
  var posX = 40, liftY = 0;          // liftY = hvor højt katten sidder over gulvet
  var targetX = 40, targetLift = 0;
  var facing = 1;                    // 1 = mod højre, -1 = mod venstre
  var mode = "idle";                 // idle | walking | perched
  var onBrand = false;               // sidder den på E'et (logoet)?
  var lastTs = 0;
  var actionTimer = null;
  var msgTimer = null;
  var groomTimer = null;
  var perchedEl = null;
  var staysInARow = 0;               // hvor mange gange i træk den bare har siddet
  var lastMoveAt = Date.now();

  /* ---- Søde beskeder fra Anders (vises i talebobler) ---- */
  var MSG = {
    da: [
      "Anders elsker dig \uD83E\uDD0D", "Du er smuk i dag", "Tillykke, skat",
      "Anders tænker på dig", "Du fortjener hele verden", "Kram fra Anders \uD83E\uDD0D",
      "Du gør ham så glad", "21 klæder dig", "Han er heldig at have dig",
      "Jeg passer på dig \uD83D\uDC3E", "Du er hans yndlings", "Smil — du er elsket"
    ],
    en: [
      "Anders loves you \uD83E\uDD0D", "You look beautiful today", "Happy birthday, love",
      "Anders is thinking of you", "You deserve the whole world", "A hug from Anders \uD83E\uDD0D",
      "You make him so happy", "21 suits you", "He's lucky to have you",
      "I'm watching over you \uD83D\uDC3E", "You're his favorite", "Smile — you are loved"
    ]
  };
  function curLang() { return (document.documentElement.lang === "en") ? "en" : "da"; }
  function randomMessage() { var a = MSG[curLang()]; return a[Math.floor(Math.random() * a.length)]; }

  function vw() { return window.innerWidth || document.documentElement.clientWidth; }
  function vh() { return window.innerHeight || document.documentElement.clientHeight; }
  function measureCat() {
    if (!catEl) return;
    CAT_W = catEl.offsetWidth || CAT_W;
    CAT_H = catEl.offsetHeight || CAT_H;
  }
  function clampX(x) { return Math.max(6, Math.min(vw() - CAT_W - 6, x)); }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  function setFacing(dir) {
    if (dir !== facing) {
      facing = dir;
      flipEl.style.transform = "scaleX(" + dir + ")";
    }
  }

  function applyTransform() {
    catEl.style.transform = "translate3d(" + posX.toFixed(1) + "px," + (-liftY).toFixed(1) + "px,0)";
  }

  /* ---- Talebobler ---- */
  function modalOpen() {
    return !!document.querySelector(".gate.is-open, .giftview.is-open");
  }
  function showMessage(text, dur) {
    if (!bubbleEl) return;
    bubbleEl.textContent = text;
    bubbleEl.classList.remove("show");
    void bubbleEl.offsetWidth;
    bubbleEl.classList.add("show");
    clearTimeout(bubbleEl._t);
    bubbleEl._t = setTimeout(function () { bubbleEl.classList.remove("show"); }, dur || 2600);
  }
  function scheduleMessage() {
    clearTimeout(msgTimer);
    msgTimer = setTimeout(function () {
      if (!modalOpen()) showMessage(randomMessage(), 3400);
      scheduleMessage();
    }, rnd(16000, 30000));
  }

  /* ---- Sid med kroppens midte på midten af E'et i det store "Elisa" ---- */
  function brandRect() {
    var b = document.querySelector(".hero__title-top");
    return b ? b.getBoundingClientRect() : null;
  }
  // Måler E'ets præcise midte via en DOM-Range over første bogstav (sand position),
  // og versalens lodrette midte via font-metrics.
  function measureE() {
    var span = document.querySelector(".hero__title-top");
    if (!span || !span.firstChild) return null;
    var tn = span.firstChild;
    if (tn.nodeType !== 3) return null;            // skal være en tekst-node
    var range;
    try {
      range = document.createRange();
      range.setStart(tn, 0);
      range.setEnd(tn, 1);
    } catch (e) { return null; }
    var er = range.getBoundingClientRect();        // line-box-rect for "E" (sand x)
    if (!er || !er.width) return null;
    var centerX = er.left + er.width / 2;

    // Lodret: find versalens cap-top og baseline via canvas-metrics
    var cs = window.getComputedStyle(span);
    if (!_measCtx) _measCtx = document.createElement("canvas").getContext("2d");
    _measCtx.font = (cs.fontStyle || "normal") + " " + (cs.fontWeight || "400") + " " + cs.fontSize + " " + cs.fontFamily;
    var F = parseFloat(cs.fontSize) || 100;
    var fm = _measCtx.measureText("E");
    var cap = fm.actualBoundingBoxAscent || F * 0.7;
    var fAsc = fm.fontBoundingBoxAscent || F * 0.8;
    var fDesc = fm.fontBoundingBoxDescent || F * 0.2;
    var halfLeading = (er.height - (fAsc + fDesc)) / 2;
    var baseline = er.top + halfLeading + fAsc;
    var capTop = baseline - cap;
    var centerY = (capTop + baseline) / 2;

    return { centerX: centerX, centerY: centerY, capTop: capTop, capH: cap, baseline: baseline };
  }

  function sitOnBrandSnap() {
    var r = brandRect();
    onBrand = true;
    mode = "perched";
    perchedEl = null;
    // Oprejst, fremadvendt sidde-positur (på numsen) + plejer sig selv
    catEl.classList.remove("is-walking", "is-lying", "is-stretch");
    catEl.classList.add("is-sitting", "is-perched", "on-brand", "is-upright", "is-grooming");
    setFacing(1);
    if (!r || r.bottom < 0 || r.top > vh()) {
      // Hero ikke synlig (fx scrollet væk) — fald tilbage til gulvet
      sitLickStop();
      onBrand = false;
      catEl.classList.remove("on-brand", "is-perched", "is-upright", "is-grooming");
      posX = clampX(rnd(30, vw() * 0.35)); targetX = posX;
      liftY = targetLift = 0; applyTransform(); return;
    }
    var m = measureE();
    var eCenterX = m ? m.centerX : (r.left + r.height * 0.34);
    var capTop = m ? m.capTop : (r.top + r.height * 0.30);
    var capH = m ? m.capH : (r.height * 0.55);

    // Oprejst kat: vandret centreret på E'et, numsen hviler på E'ets overkant
    var sink = capH * 0.08;
    posX = targetX = clampX(eCenterX - UP_CX * CAT_W);
    liftY = targetLift = Math.max(0, vh() - capTop - sink - CAT_H * (1 - UP_PAW_FRAC));
    applyTransform();

    sitLickStart();   // begynd at slikke sig selv
  }

  /* ---- Selv-slikning mens den sidder oprejst på E'et ---- */
  function sitLickCycle() {
    if (!onBrand) return;
    catEl.classList.add("is-lick");
    clearTimeout(groomTimer);
    groomTimer = setTimeout(function () {
      catEl.classList.remove("is-lick");
      if (!onBrand) return;
      clearTimeout(groomTimer);
      groomTimer = setTimeout(sitLickCycle, rnd(2400, 5200));   // lille pause mellem slik-runder
    }, rnd(2200, 3400));
  }
  function sitLickStart() {
    clearTimeout(groomTimer);
    if (reduce) { catEl.classList.add("is-lick"); return; }     // statisk slikke-positur
    groomTimer = setTimeout(sitLickCycle, rnd(500, 1300));      // slikker næsten med det samme
  }
  function sitLickStop() {
    clearTimeout(groomTimer);
    catEl.classList.remove("is-lick", "is-grooming", "is-upright");
  }

  /* ---- Adfærds-planlægger ---- */
  function scheduleNext(delay) {
    clearTimeout(actionTimer);
    actionTimer = setTimeout(decideAction, delay);
  }

  function decideAction() {
    if (onBrand) {
      // bliv siddende oprejst på E'et og plej sig selv; vis af og til en sød besked
      if (Math.random() < 0.55) showMessage(randomMessage(), 3000);
      scheduleNext(rnd(6000, 11000));
      return;
    }
    var roll = Math.random();
    if (roll < 0.015) { glitterFart(); return; }                 // meget sjældent: glimmer-prut
    if (staysInARow >= 2) { staysInARow = 0; goPerchAndRest(); return; }  // stået for længe -> find plads + plej dig
    if (roll < 0.42) { goPerchAndRest(); return; }
    if (roll < 0.66) { staysInARow = 0; wanderTo(clampX(rnd(20, vw() - CAT_W - 20))); return; }
    if (roll < 0.84) { groom(); staysInARow++; scheduleNext(rnd(2600, 5200)); return; }
    staysInARow++;
    scheduleNext(rnd(2400, 4600));
  }

  function wanderTo(x) {
    targetX = clampX(x);
    setFacing(targetX >= posX ? 1 : -1);
    mode = "walking";
    catEl.classList.add("is-walking");
    catEl.classList.remove("is-sitting", "is-lying");
  }

  function arrive() {
    mode = "idle";
    catEl.classList.remove("is-walking");
    catEl.classList.add("is-sitting");
    lastMoveAt = Date.now();
    scheduleNext(rnd(2200, 4800));
  }

  /* kort idle-gestus (lille hoved-dyp) */
  function groom() {
    catEl.classList.add("is-groom");
    setTimeout(function () { catEl.classList.remove("is-groom"); }, 1600);
  }

  /* ---- Glimmer-prut (meget sjældent) ---- */
  function glitterFart() {
    // lille forskrækkelses-hop
    var prev = targetLift;
    targetLift = liftY + 28;
    setTimeout(function () { targetLift = prev; }, 220);
    showMessage(curLang() === "en" ? "pfft \u2728" : "pft \u2728", 1200);
    if (reduce) { scheduleNext(rnd(2200, 4200)); return; }

    var rearX = posX + (facing === 1 ? CAT_W * 0.16 : CAT_W * 0.84);
    var baseY = liftY + CAT_H * 0.40;
    var glyphs = ["\u2726", "\u2727", "\u00B7", "\u2728"];
    var cols = ["#C2A05E", "#E7B6C0", "#D9C39A", "#F4DCE1", "#A9C4D8"];
    for (var i = 0; i < 14; i++) {
      var g = document.createElement("div");
      g.className = "cat-glitter";
      g.textContent = glyphs[i % glyphs.length];
      g.style.color = cols[i % cols.length];
      g.style.left = rearX + "px";
      g.style.bottom = baseY + "px";
      var dx = (facing === 1 ? -1 : 1) * rnd(12, 72) + rnd(-12, 12);
      var dy = rnd(-12, 26);
      g.style.setProperty("--gx", dx.toFixed(0) + "px");
      g.style.setProperty("--gy", dy.toFixed(0) + "px");
      g.style.animationDelay = (i * 0.012).toFixed(3) + "s";
      root.appendChild(g);
      (function (node) { setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 1700); })(g);
    }
    scheduleNext(rnd(2400, 4400));
  }

  /* ---- Find en plads (billede/tekst), hop op, læg dig og plej dig selv ---- */
  function perchCandidates() {
    var sel = ".gallery__item, .section__title, .vault__inner, .letter__card, .music__frame, .reason";
    var list = document.querySelectorAll(sel);
    var out = [];
    var H = vh();
    var bandTop = H * 0.45;
    var bandBottom = H - 130;
    for (var i = 0; i < list.length; i++) {
      var r = list[i].getBoundingClientRect();
      if (r.width < 70) continue;
      if (r.top > bandTop && r.top < bandBottom) out.push(r);
    }
    return out;
  }

  function goPerchAndRest() {
    var cands = perchCandidates();
    if (!cands.length) { wanderTo(clampX(rnd(20, vw() - CAT_W - 20))); return; }
    cands.sort(function (a, b) {
      return Math.abs((a.left + a.width / 2) - (posX + CAT_W / 2)) -
             Math.abs((b.left + b.width / 2) - (posX + CAT_W / 2));
    });
    var pick = cands[Math.floor(rnd(0, Math.min(3, cands.length)))] || cands[0];
    perchedEl = { top: pick.top, rest: true };
    targetX = clampX(pick.left + pick.width / 2 - CAT_W / 2);
    setFacing(targetX >= posX ? 1 : -1);
    mode = "walking";
    catEl.classList.add("is-walking");
    catEl.classList.remove("is-sitting", "is-lying");
    root.dataset.perchPending = "1";
  }

  function doHopUp() {
    if (!perchedEl) { arrive(); return; }
    var lift = vh() - perchedEl.top - CAT_H + 6;
    var maxLift = vh() * 0.5;
    if (lift < 30 || lift > maxLift) { arrive(); return; }
    targetLift = lift;
    mode = "perched";
    catEl.classList.remove("is-walking");
    catEl.classList.add("is-sitting", "is-perched");
    lastMoveAt = Date.now();
    if (perchedEl.rest) { lieDownGroom(); scheduleNext(rnd(6500, 10500)); }
    else { scheduleNext(rnd(3500, 7000)); }
  }

  /* Læg dig ned (loaf) + ræ dig + slik dig selv */
  function lieDownGroom() {
    catEl.classList.add("is-lying");
    catEl.classList.add("is-stretch");                          // ræ dig først
    setTimeout(function () { catEl.classList.remove("is-stretch"); }, 1500);
    setTimeout(function () {                                    // slik dig selv et par gange
      catEl.classList.add("is-lick");
      setTimeout(function () { catEl.classList.remove("is-lick"); }, 3000);
    }, 1700);
  }

  function dropToFloor() {
    targetLift = 0;
    perchedEl = null;
    onBrand = false;
    sitLickStop();   // stop selv-slikning + skift tilbage til sideprofil
    catEl.classList.remove("is-perched", "is-lying", "is-lick", "is-stretch", "on-brand", "is-upright", "is-grooming");
  }

  function hopDown() {
    dropToFloor();
    mode = "idle";
    setTimeout(function () {
      catEl.classList.add("is-sitting");
      lastMoveAt = Date.now();
      scheduleNext(rnd(1500, 3200));
    }, 360);
  }

  /* ---- Animationsløkke ---- */
  function loop(ts) {
    if (!lastTs) lastTs = ts;
    var dt = Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;

    if (mode === "walking") {
      var dx = targetX - posX;
      var step = 150 * dt;
      if (Math.abs(dx) <= step) {
        posX = targetX;
        if (root.dataset.perchPending === "1") {
          root.dataset.perchPending = "";
          doHopUp();
        } else {
          arrive();
        }
      } else {
        posX += (dx > 0 ? step : -step);
      }
    }

    if (Math.abs(targetLift - liftY) > 0.5) {
      liftY += (targetLift - liftY) * Math.min(1, dt * 9);
    } else {
      liftY = targetLift;
    }

    applyTransform();
    requestAnimationFrame(loop);
  }

  /* ---- Scroll-reaktion: hop ned (med hjerte når man scroller ned) ---- */
  var lastScroll = window.pageYOffset || 0;
  var scrollIdle = null;
  function onScroll() {
    var y = window.pageYOffset || 0;
    var dir = y > lastScroll ? 1 : -1;
    lastScroll = y;

    if (onBrand || mode === "perched") {
      if (dir === 1) spawnHeart();        // scroller man NED, kommer der et hjerte
      dropToFloor();
    }

    setFacing(dir === 1 ? 1 : -1);
    if (mode !== "walking") catEl.classList.add("is-walking");
    catEl.classList.remove("is-lying");
    targetX = clampX(posX + dir * rnd(40, 110));
    mode = "walking";

    clearTimeout(scrollIdle);
    scrollIdle = setTimeout(function () {
      if (mode === "walking" && root.dataset.perchPending !== "1") { targetX = posX; arrive(); }
    }, 420);
  }

  /* ---- Klik/klap: hjerte + (hop ned hvis den sidder oppe) + sød besked ---- */
  function happyBump() {
    var prev = targetLift;
    targetLift = liftY + 44;
    setTimeout(function () { targetLift = prev; }, 250);
  }
  function onPet() {
    spawnHeart();
    if (onBrand || mode === "perched") {
      dropToFloor();
      mode = "idle";
      catEl.classList.add("is-sitting");
      clearTimeout(actionTimer);
      scheduleNext(rnd(1400, 2600));
    } else {
      happyBump();
    }
    showMessage(Math.random() < 0.75 ? randomMessage() : (curLang() === "en" ? "purr \uD83E\uDD0D" : "miav \uD83E\uDD0D"), 2600);
  }

  function spawnHeart() {
    if (reduce) return;
    var h = document.createElement("div");
    h.className = "cat-heart";
    h.textContent = "\u2665";
    h.style.left = (posX + CAT_W * 0.62) + "px";
    h.style.bottom = (liftY + CAT_H * 0.7) + "px";
    root.appendChild(h);
    setTimeout(function () { if (h.parentNode) h.parentNode.removeChild(h); }, 1500);
  }

  /* ---- Init ---- */
  function init() {
    catEl = document.getElementById("elisaCat");
    flipEl = root.querySelector(".cat__flip");
    bobEl = root.querySelector(".cat__bob");
    bubbleEl = root.querySelector(".cat__bubble");
    measureCat();

    // Start: katten sidder ovenpå E'et i det store "Elisa"
    sitOnBrandSnap();
    // Fonte/layout kan flytte titlen efter load — gen-justér så katten lander præcist
    function resnapIfOnBrand() { if (onBrand) sitOnBrandSnap(); }
    [250, 600, 1200].forEach(function (d) { setTimeout(resnapIfOnBrand, d); });
    window.addEventListener("load", resnapIfOnBrand);
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(resnapIfOnBrand); }

    catEl.addEventListener("click", onPet);
    catEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPet(); }
    });

    window.addEventListener("resize", function () {
      measureCat();
      if (onBrand) { sitOnBrandSnap(); return; }
      posX = clampX(posX);
      if (mode === "perched") hopDown();
      applyTransform();
    }, { passive: true });

    scheduleMessage();

    if (reduce) {
      // Reduceret bevægelse: katten sidder stille på E'et og blinker
      requestAnimationFrame(loop);
      return;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    requestAnimationFrame(loop);
    scheduleNext(rnd(5000, 8000));   // bliver lidt på E'et før første lille gestus
  }
})();
