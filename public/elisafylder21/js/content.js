/* ============================================================================
   ELISAFYLDER21.COM  —  DIT INDHOLD / YOUR CONTENT
   ----------------------------------------------------------------------------
   Alt det personlige bor i denne ene fil. Ret teksterne her, og siden opdaterer
   sig selv. Hver tekst findes på dansk (da) og engelsk (en).

   👉 START MED DE 3 TING MARKERET MED  ‼️  HERUNDER.
   ============================================================================ */

window.SITE_CONTENT = {

  /* ‼️ 1) HENDES NAVN OG ALDER ---------------------------------------------- */
  name: "Elisa",
  age: 21,

  /* ‼️ 2) FØDSELSDAGEN — nedtællingen peger herhen.
        Elisa fylder 21 den 20. juni kl. 00:00 DANSK TID.
        "+02:00" sikrer dansk sommertid, uanset hvor siden åbnes i verden. */
  birthday: "2026-06-20T00:00:00+02:00",

  /* Standardsprog når siden åbnes: "da" (dansk) eller "en" (engelsk) */
  defaultLang: "da",

  /* ‼️ 3) MUSIK — indsæt et Spotify-link til "jeres sang" eller en playliste.
        Sådan får du linket: I Spotify -> ... (Del) -> Kopiér link.
        Du kan bruge en sang ELLER en playliste — begge dele virker.
        Lad feltet stå tomt ("") for at skjule afspilleren. */
  spotify: {
    // "All the Stars" — Kendrick Lamar & SZA  (jeres sang ♥)
    url: "https://open.spotify.com/track/3GCdLUSnKSMJhs4Tj6CV3s",
    da: { title: "Vores sang", subtitle: "All the Stars · Kendrick Lamar & SZA" },
    en: { title: "Our song",   subtitle: "All the Stars · Kendrick Lamar & SZA" }
  },

  /* --- FORSIDE / HERO ------------------------------------------------------ */
  hero: {
    da: {
      eyebrow: "Tillykke",
      titleTop: "Elisa",
      titleBottom: "fylder 21",
      tagline: "En hel side — kun til dig.",
      countdownLabel: "Der er kun",
      scroll: "Rul ned"
    },
    en: {
      eyebrow: "Happy birthday",
      titleTop: "Elisa",
      titleBottom: "turns 21",
      tagline: "A whole page — just for you.",
      countdownLabel: "Only",
      scroll: "Scroll down"
    }
  },

  /* --- LILLE INTRO UNDER FORSIDEN ------------------------------------------ */
  intro: {
    da: {
      title: "Til den smukkeste",
      text: "Jeg ville lave noget, der varer længere end blomster. Så jeg byggede et lille sted på internettet, hvor alt handler om dig. Tag dig god tid — der er ingen, der skynder på."
    },
    en: {
      title: "To the most beautiful",
      text: "I wanted to make something that lasts longer than flowers. So I built a little place on the internet where everything is about you. Take your time — there’s no rush."
    }
  },

  /* --- TIDSLINJE / VORES HISTORIE ------------------------------------------
     Tilføj eller fjern punkter frit. Rækkefølge = øverst-til-nederst.
     "date" vises som lille guld-overskrift. Den kan være ren tekst ("2024")
     ELLER tosproget, fx:  date: { da: "I dag", en: "Today" } */
  timeline: {
    sectionTitle: { da: "Vores historie", en: "Our story" },
    sectionSubtitle: {
      da: "De øjeblikke der førte os hertil",
      en: "The moments that led us here"
    },
    events: [
      {
        date: "2023",
        da: { title: "Tivoli-turen", text: "Lys i træerne, sukkerspind og din hånd i min. En af vores allerførste ture — og en jeg aldrig glemmer." },
        en: { title: "The Tivoli trip", text: "Lights in the trees, cotton candy and your hand in mine. One of our very first days out — and one I'll never forget." }
      },
      {
        date: "2023",
        da: { title: "Din tur i X Factor", text: "At følge dig hele vejen — modig, talentfuld og helt dig selv på den store scene. Jeg var den stolteste i hele salen." },
        en: { title: "Your X Factor run", text: "Following you all the way — brave, talented and entirely yourself on that big stage. I was the proudest person in the room." }
      },
      {
        date: "2024",
        da: { title: "Lalandia — to gange", text: "Vandland, hygge og grin til vi ikke kunne mere. Vi kunne li' det så godt, at vi måtte afsted igen." },
        en: { title: "Lalandia — twice", text: "Water park, cosiness and laughing until we couldn't breathe. We loved it so much we just had to go back." }
      },
      {
        date: "2025",
        da: { title: "Marienlyst Strandhotel", text: "Strand, bobler og en weekend kun for os to. Ren luksus — men det smukkeste var stadig dig." },
        en: { title: "Marienlyst Beach Hotel", text: "Beach, bubbles and a weekend just for the two of us. Pure luxury — but the most beautiful part was still you." }
      },
      {
        date: { da: "I dag", en: "Today" },
        da: { title: "21 år", text: "Og her står vi. Klar til alt det, der kommer." },
        en: { title: "21 years", text: "And here we are. Ready for everything that’s coming." }
      }
    ]
  },

  /* --- GALLERI / MINDER ----------------------------------------------------
     Læg dine billeder i mappen:  public/assets/images/
     Skriv så filnavnet i "src" herunder (fx "billede1.jpg").
     Indtil du tilføjer rigtige billeder, vises et elegant marmor-felt.
     "shape": "circle" (rund) eller "rounded" (bløde hjørner) — for et redaktionelt look. */
  gallery: {
    sectionTitle: { da: "Minder", en: "Memories" },
    sectionSubtitle: { da: "Et lille udvalg af os", en: "A little selection of us" },
    items: [
      { src: "assets/images/marienlyst-hotel.jpg",  shape: "rounded", da: "På Marienlyst", en: "At Marienlyst" },
      { src: "assets/images/elisa-og-jeg-glad.jpg", shape: "circle",  da: "Os to", en: "The two of us" },
      { src: "assets/images/elisa-superman.jpg",    shape: "rounded", da: "Min superhelt", en: "My superhero" },
      { src: "assets/images/drikker-drinks.jpg",    shape: "rounded", da: "Sommerdrinks", en: "Summer drinks" },
      { src: "assets/images/elisa-menukort.jpg",    shape: "circle",  da: "Datenight", en: "Date night" },
      { src: "assets/images/elisa-brunch.jpg",      shape: "rounded", da: "Brunch sammen", en: "Brunch together" }
    ]
  },

  /* --- 21 GRUNDE TIL AT JEG ELSKER DIG -------------------------------------
     Præcis det antal punkter du vil. (Det behøver ikke være 21 — men det er en fin idé 😉) */
  reasons: {
    sectionTitle: { da: "21 grunde til at jeg elsker dig", en: "21 reasons I love you" },
    sectionSubtitle: { da: "Én for hvert år", en: "One for every year" },
    items: [
      { da: "Din latter — den smitter altid.", en: "Your laugh — it’s always contagious." },
      { da: "Måden du ser på verden på.", en: "The way you see the world." },
      { da: "Hvor god du er mod andre.", en: "How kind you are to others." },
      { da: "Dit blik om morgenen.", en: "Your eyes in the morning." },
      { da: "At du gør mig til et bedre menneske.", en: "That you make me a better person." },
      { da: "Din styrke når det er svært.", en: "Your strength when things are hard." },
      { da: "Måden du siger mit navn på.", en: "The way you say my name." },
      { da: "Vores stilhed der aldrig er akavet.", en: "Our silence that’s never awkward." },
      { da: "Din nysgerrighed.", en: "Your curiosity." },
      { da: "At du danser i køkkenet.", en: "That you dance in the kitchen." },
      { da: "Hvor smuk du er — også uden at vide det.", en: "How beautiful you are — even without knowing it." },
      { da: "Din humor, der altid rammer.", en: "Your humor that always lands." },
      { da: "At du tror på mig.", en: "That you believe in me." },
      { da: "Din varme.", en: "Your warmth." },
      { da: "Måden du holder min hånd på.", en: "The way you hold my hand." },
      { da: "Dine drømme — og at jeg er med i dem.", en: "Your dreams — and that I’m part of them." },
      { da: "At alt føles nemmere med dig.", en: "That everything feels easier with you." },
      { da: "Din ærlighed.", en: "Your honesty." },
      { da: "Hvordan du gør et sted til et hjem.", en: "How you turn a place into a home." },
      { da: "At du er præcis dig.", en: "That you are exactly you." },
      { da: "Og fordi det her aldrig bliver nok grunde.", en: "And because this will never be enough reasons." }
    ]
  },

  /* --- KÆRLIGHEDSBREV / PERSONLIG HILSEN ----------------------------------- */
  letter: {
    sectionTitle: { da: "Et brev til dig", en: "A letter to you" },
    da: {
      greeting: "Min elskede Elisa,",
      body: [
        "Der er ord, jeg aldrig får sagt højt nok, så jeg skriver dem her i stedet.",
        "Tak fordi du er dig. Tak for hver eneste almindelige dag, som du gør til noget særligt, helt uden at prøve. Jeg er stolt af den, du er ved at blive — og jeg glæder mig til alt det, vi endnu ikke har oplevet.",
        "Tillykke med de 21 år. Verden er heldig at have dig. Det er jeg også."
      ],
      sign: "Altid din,",
      name: "Anders"
    },
    en: {
      greeting: "My beloved Elisa,",
      body: [
        "There are words I never quite say out loud enough, so I’m writing them here instead.",
        "Thank you for being you. Thank you for every ordinary day that you turn into something special without even trying. I’m proud of who you’re becoming — and I can’t wait for everything we haven’t lived yet.",
        "Happy 21st birthday. The world is lucky to have you. So am I."
      ],
      sign: "Always yours,",
      name: "Anders"
    }
  },

  /* --- AFSLUTNING / FOOTER ------------------------------------------------- */
  footer: {
    da: { line: "Lavet med kærlighed", sub: "til Elisa · 21 år" },
    en: { line: "Made with love", sub: "for Elisa · 21 years" }
  },

  /* ============================================================================
     ‼️ HEMMELIG GAVE  (åbner sig selv når nedtællingen rammer nul)
     ----------------------------------------------------------------------------
     En forseglet boks nederst på siden. Den kan FØRST åbnes på fødselsdagen,
     og kræver et kodeord. Skriver hun det rigtige kodeord, vises selve gaven.

     👀 TEST DET FØR DAGEN: åbn siden med  ?preview  bagerst i adressen, fx
        http://localhost:5510/?preview  — så er boksen ulåst, og du kan prøve
        både kodeord og gave igennem. Send den HELT ALMINDELIGE adresse
        (uden ?preview) til hende, så forbliver gaven låst indtil d. 20. juni.
     ============================================================================ */
  gift: {
    /* ‼️ KODEORDET hun skal skrive (ikke versalfølsomt, mellemrum er ligegyldige).
       Skift det til noget I to deler — og giv hende et hint nedenfor, eller sig
       det mundtligt / i et kort. */
    password: "jegelskerdig",

    /* Vis den forseglede boks som en lille teaser FØR fødselsdagen?
       true  = hun kan se, at en hemmelighed venter (bygger spænding).
       false = boksen er helt skjult, indtil nedtællingen rammer nul. */
    showTeaser: true,

    /* Tekster på den LÅSTE boks (før fødselsdagen) */
    locked: {
      da: { badge: "Forseglet", title: "En hemmelighed venter", text: "Der ligger en gave gemt her. Den åbner sig selv, når nedtællingen rammer nul — på din fødselsdag." },
      en: { badge: "Sealed", title: "A secret is waiting", text: "A gift is hidden here. It opens itself when the countdown reaches zero — on your birthday." }
    },
    /* Tekster når boksen er ÅBEN (på selve dagen) */
    unlocked: {
      da: { badge: "Åben", title: "Den er klar til dig", text: "Tillykke, min skat. Din gave kan åbnes nu.", button: "Åbn gaven" },
      en: { badge: "Open", title: "It’s ready for you", text: "Happy birthday, my love. Your gift can be opened now.", button: "Open the gift" }
    },
    /* Kodeords-vinduet */
    gate: {
      da: { title: "Skriv kodeordet", hint: "Lille hint: tre små ord jeg altid siger 🤍", placeholder: "Kodeord", button: "Lås op", error: "Ikke helt — prøv igen, min skat." },
      en: { title: "Enter the password", hint: "Little hint: three small words I always say 🤍", placeholder: "Password", button: "Unlock", error: "Not quite — try again, my love." }
    },

    /* ============================================================
       🎈 MINIGAME — pop ballonerne FØR gaven afsløres
       ------------------------------------------------------------
       Når hun har skrevet kodeordet rigtigt, møder hun først et lille
       spil: en masse balloner svæver op. Nogle er bare sjove GÆT på,
       hvad gaven er ("type": "guess"), andre gemmer et SPOR om rejsen
       ("type": "clue"). Hun popper dem alle — sporerne samler sig
       nederst — og til sidst kan hun åbne selve gaven.
       Du kan frit ændre, fjerne eller tilføje balloner herunder. */
    game: {
      da: {
        eyebrow: "Næsten fremme",
        title: "Pop ballonerne 🎈",
        intro: "Din gave gemmer sig bag ballonerne. Pop dem alle — nogle er bare gæt, andre er små spor om, hvor vi skal hen …",
        counter: "spor fundet",
        revealBtn: "Åbn din gave",
        done: "Alle spor fundet! Kan du gætte det?"
      },
      en: {
        eyebrow: "Almost there",
        title: "Pop the balloons 🎈",
        intro: "Your gift is hiding behind the balloons. Pop them all — some are only guesses, others are little clues about where we’re going …",
        counter: "clues found",
        revealBtn: "Open your gift",
        done: "All clues found! Can you guess it?"
      },
      /* "guess" = et drilsk gæt (udfordrer, hvad hun TROR gaven er).
         "clue"  = et ægte spor, der samler sig nederst på vej mod gaven. */
      balloons: [
        { type: "guess", emoji: "👜", da: "En ny taske?",       en: "A new bag?",          reactDa: "Næ 😏",            reactEn: "Nope 😏" },
        { type: "guess", emoji: "💍", da: "En ring?!",           en: "A ring?!",            reactDa: "…ikke i dag 😅",   reactEn: "…not today 😅" },
        { type: "guess", emoji: "👠", da: "Nye sko?",            en: "New shoes?",          reactDa: "Tæt på — nej 🙈",  reactEn: "Close — no 🙈" },
        { type: "guess", emoji: "🎟️", da: "Koncertbilletter?",   en: "Concert tickets?",    reactDa: "Tænk større 🎶",   reactEn: "Think bigger 🎶" },
        { type: "clue",  emoji: "✈️", da: "Et fly",             en: "A flight" },
        { type: "clue",  emoji: "☀️", da: "Sol",                en: "Sunshine" },
        { type: "clue",  emoji: "🌊", da: "Turkist hav",        en: "Turquoise sea" },
        { type: "clue",  emoji: "🏖️", da: "Strand",             en: "Beach" },
        { type: "clue",  emoji: "🏛️", da: "Oldtid",             en: "Ancient ruins" },
        { type: "clue",  emoji: "🌅", da: "Solnedgang",         en: "Sunset" }
      ]
    },

    /* ‼️ SELVE GAVEN — det hun ser, når ballonerne er poppet.
       Gaven er en rejse til Santa Quaranta i Sarandë, Albanien.
       "headline" = det store ord/linje. "location" = stedet under.
       "lines" = afsnit. "images" = billed-galleriet (ligger i
       assets/images/saranda/). "credit" = lille fotokreditering. */
    reveal: {
      da: {
        eyebrow: "Din gave",
        headline: "Santa Quaranta",
        location: "Sarandë · Den albanske riviera",
        lines: [
          "Vi skal en tur væk sammen — til Santa Quaranta i Sarandë, hvor det joniske hav er så turkist, at det ser opdigtet ud.",
          "Sol, lange middage med udsigt over bugten, antikke ruiner i Butrint og solnedgange, der får hele himlen til at gløde. Bare os to.",
          "Tillykke med de 21 år, min skat. Lad os pakke kufferten."
        ],
        note: "(Du må gerne begynde at glæde dig nu 🤍)",
        signature: "— Anders"
      },
      en: {
        eyebrow: "Your gift",
        headline: "Santa Quaranta",
        location: "Sarandë · The Albanian Riviera",
        lines: [
          "We’re going away together — to Santa Quaranta in Sarandë, where the Ionian Sea is so turquoise it looks made up.",
          "Sun, long dinners over the bay, ancient ruins in Butrint and sunsets that set the whole sky on fire. Just the two of us.",
          "Happy 21st, my love. Let’s pack the suitcase."
        ],
        note: "(You’re allowed to start looking forward to it now 🤍)",
        signature: "— Anders"
      },
      /* Billed-galleri i afsløringen. Ligger lokalt i assets/images/saranda/.
         Du kan tilføje/fjerne frit — billedteksten findes på da + en. */
      images: [
        { src: "assets/images/saranda/saranda-harbour.jpg", da: "Bugten ved Sarandë",   en: "The bay of Sarandë" },
        { src: "assets/images/saranda/ksamil-coast.jpg",    da: "Det joniske hav",      en: "The Ionian Sea" },
        { src: "assets/images/saranda/saranda-town.jpg",    da: "Sarandës promenade",   en: "The Sarandë promenade" },
        { src: "assets/images/saranda/riviera-aerial.jpg",  da: "Den albanske riviera", en: "The Albanian Riviera" },
        { src: "assets/images/saranda/lekuresi-castle.jpg", da: "Udsigt fra Lëkurësi",  en: "View from Lëkurësi" },
        { src: "assets/images/saranda/butrint.jpg",         da: "Oldtidsbyen Butrint",  en: "Ancient Butrint" },
        { src: "assets/images/saranda/butrint-sunset.jpg",  da: "Solnedgang ved Butrint", en: "Sunset over Butrint" }
      ],
      credit: {
        da: "Stedfotos: Wikimedia Commons (CC BY / CC BY-SA) — Sharon Hahn Darlin · Qmccart · Doni2020 · kallerna · wstuppert · Marmontel · Julianruizp",
        en: "Location photos: Wikimedia Commons (CC BY / CC BY-SA) — Sharon Hahn Darlin · Qmccart · Doni2020 · kallerna · wstuppert · Marmontel · Julianruizp"
      }
    }
  },

  /* --- VIDEO / FILM --------------------------------------------------------
     Filmene vises nu BLANDET ind mellem billederne i "Minder"-galleriet
     (i tilfældig rækkefølge). De auto-looper lydløst.
     Hver video kan være:
       • En egen fil: læg den i  public/assets/videos/  og skriv "assets/videos/film.mp4"
       • YouTube/Vimeo-link (vises pænt, men kan ikke auto-loope lydløst)
     Lad listen være tom ([]) for slet ingen film.
     Til egne filer kan du tilføje "poster" = et billede der vises før play. */
  video: {
    sectionTitle:    { da: "Små film af os", en: "Little films of us" },
    sectionSubtitle: { da: "Tryk på play", en: "Press play" },
    items: [
      { url: "assets/videos/elisa-flot.mp4",       da: "Smukke dig", en: "Beautiful you" },
      { url: "assets/videos/sjove-ansigter.mp4",   da: "Sjove ansigter", en: "Funny faces" },
      { url: "assets/videos/spiser-is-sammen.mp4", da: "Is sammen", en: "Ice cream together" },
      { url: "assets/videos/cykler.mp4",           da: "På cykel", en: "On the bikes" },
      { url: "assets/videos/elisa-monster.mp4",    da: "Monster-pause", en: "Monster break" },
      { url: "assets/videos/ser-dumme-ud.mp4",     da: "Fjolleri", en: "Being silly" },
      { url: "assets/videos/spiser-is.mp4",        da: "Is-tid", en: "Ice cream time" }
    ]
  },

  /* --- NAVIGATION (menupunkter) ------------------------------------------- */
  nav: {
    story:   { da: "Historie", en: "Story" },
    gallery: { da: "Minder",   en: "Memories" },
    reasons: { da: "21 grunde", en: "21 reasons" },
    letter:  { da: "Brev",     en: "Letter" },
    music:   { da: "Musik",    en: "Music" },
    gift:    { da: "Gave",     en: "Gift" }
  }
};
