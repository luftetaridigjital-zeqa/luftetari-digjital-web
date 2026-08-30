export type JourneyCopyLine = {
  text: string;
  style: "body" | "lead" | "quote" | "divider";
};

export type JourneyScreenKind = "intro" | "code" | "instructions" | "email" | "form" | "scale" | "manifest" | "confirmation" | "story" | "quote" | "cta" | "pillar" | "choice" | "choice-cards" | "breathing";

export type JourneyScreen = {
  id: number;
  kind: JourneyScreenKind;
  eyebrow: string;
  title: string;
  copy: JourneyCopyLine[];
  options: string[];
  cta: string;
  ctaVariant?: "solid" | "ghost";
  accent?: "gold";
  asset?: string;
  assetAlt?: string;
  assetSmall?: boolean;
  maxSelections?: number;
  requiredSelections?: number;
  autoAdvanceMs?: number;
  pillarColor?: string;
  breathCycle?: number;
  breathCount?: number;
  breathLabel?: string;
  breathHint?: string;
};

export const journeyScreens: JourneyScreen[] = [
  {
    "id": 1,
    "kind": "intro",
    "eyebrow": "",
    "title": "Ti je këtu sepse diçka brenda teje të th",
    "copy": [],
    "options": [],
    "cta": "",
    "asset": "/journey-assets/sword.png",
    "assetAlt": "Ekran pothuajse i zi me grimca të zbehta si yje; në qendër ka një ikonë katrore me qoshe të rrumbullakosura që paraqet një shpatë vertikale të artë me shkëlqim në bazë. Poshtë saj shfaqet një rresht teksti me kursor në fund. Në cepin e sipërm djathtas ka buton audio me ikonë altoparlanti.",
    "autoAdvanceMs": 3600
  },
  {
    "id": 2,
    "kind": "code",
    "eyebrow": "",
    "title": "ÇFARË KODI MBAN?",
    "copy": [
      {
        "text": "Shtyp Enter për të hapur portën",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "Shtyp Enter për të hapur portën",
    "asset": "",
    "assetAlt": "Ekran i zi me grimca të arta që zbresin diagonalisht drejt një fushe kodi në qendër. Titulli është i bardhë me serif; kodi është me shkronja të arta të hapësuara dhe vijë të artë poshtë. Ana e djathtë e kodit duket e prerë ose e errësuar në screenshot."
  },
  {
    "id": 3,
    "kind": "story",
    "eyebrow": "",
    "title": "Tani frymëmer.",
    "copy": [
      {
        "text": "Telefoni në heshtje. Kufjet në vesh. Dera e mbyllur.",
        "style": "body"
      },
      {
        "text": "Vetëm ti dhe vetvetja jote.",
        "style": "body"
      },
      {
        "text": "Aplikacioni nuk është formular.",
        "style": "body"
      },
      {
        "text": "Është pasqyrë.",
        "style": "body"
      },
      {
        "text": "Sa thellë do të shohësh, varet vetëm nga ti.",
        "style": "body"
      },
      {
        "text": "Mos nxito.",
        "style": "body"
      },
      {
        "text": "Mos shtypi pyetjet sikur po mbushësh një CV.",
        "style": "body"
      },
      {
        "text": "Përgjigju nga vendi më i sinqertë që ke brenda.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "HYR →",
    "asset": "",
    "assetAlt": "Panel i gjatë i zi me tekst të bardhë dhe gri, i rreshtuar majtas. Një bllok citimi në mes shënohet nga vijë vertikale e artë; disa fjali janë me bold. Në fund ka një buton të madh të artë, pjesërisht të prerë nga skaji i poshtëm."
  },
  {
    "id": 4,
    "kind": "story",
    "eyebrow": "FJALA JOTE E FUQISË",
    "title": "SHQIPE",
    "copy": [
      {
        "text": "Para se të hapësh aplikacionin, dua të të jap dy gjëra. Të dyja janë",
        "style": "body"
      },
      {
        "text": "vetëm të tuat.",
        "style": "body"
      },
      {
        "text": "Mbaje në mendje. Është mantra jote.",
        "style": "body"
      },
      {
        "text": "KODI YT UNIK",
        "style": "body"
      },
      {
        "text": "SHQIPE-YJIO-2026",
        "style": "body"
      },
      {
        "text": "Vetëm ky kod të hap derën. Vetëm ty.",
        "style": "body"
      },
      {
        "text": "Tani frymëmer.",
        "style": "body"
      },
      {
        "text": "Telefoni në heshtje. Kufjet në vesh. Dera e mbyllur.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "Vazhdo",
    "asset": "",
    "assetAlt": "Pjesë e një emaili me sfond të zi. Dy karta të mëdha janë vendosur vertikalisht: e para me kornizë të hollë të artë dhe fjalën SHQIPE; e dyta me kornizë të ndërprerë dhe kodin unik të përzgjedhur me sfond blu. Teksti vazhdon sipër dhe poshtë kartave."
  },
  {
    "id": 5,
    "kind": "email",
    "eyebrow": "LUFTETARI DIGJITAL",
    "title": "SHQIPE · Dera u hap për ty.",
    "copy": [
      {
        "text": "DERA E HAPUR · 00:00",
        "style": "body"
      },
      {
        "text": "Përshëndetje {{emri}}.",
        "style": "body"
      },
      {
        "text": "Siç të thashë, sonte do të pranosh një email nga sistemi.",
        "style": "body"
      },
      {
        "text": "Ja ku është.",
        "style": "body"
      },
      {
        "text": "Para se të hapësh aplikacionin, dua të të jap dy gjëra. Të dyja janë",
        "style": "body"
      },
      {
        "text": "vetëm të tuat.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "Vazhdo",
    "asset": "",
    "assetAlt": "Pamje e hapur e Gmail-it. Emaili ka sfond të zi dhe një kartë qendrore të errët; në krye të kartës ka emoji me dy shpata të kryqëzuara, emrin e markës me të artë dhe një nëntitull gri. Përmbajtja e mesazhit është me tekst të bardhë, e rreshtuar majtas."
  },
  {
    "id": 6,
    "kind": "form",
    "eyebrow": "",
    "title": "ÇFARË JE I GATSHËM TË HEQËSH DORË PËR 30 DITËT E ARDHSHME?",
    "copy": [
      {
        "text": "(ZGJEDH TË GJITHA QË APLIKOHEN)",
        "style": "body"
      }
    ],
    "options": [
      "Gjumë deri vonë",
      "Social media pa qëllim",
      "Netflix/YouTube pa limit",
      "Ushqim i shpejtë (fast food)",
      "Alkool",
      "Ankime dhe justifikime"
    ],
    "cta": "Vazhdo ›",
    "asset": "",
    "assetAlt": "Formular përzgjedhjeje me sfond të zi. Sipër majtas ka ikonë të artë me pikëpyetje; titulli i madh i bardhë është në qendër. Gjashtë opsione shfaqen si shirita të gjerë të errët me qoshe të rrumbullakosura. Poshtë ka lidhjen Mbrapa dhe butonin e artë Vazhdo."
  },
  {
    "id": 7,
    "kind": "scale",
    "eyebrow": "PYETJA 1 NGA 12",
    "title": "SA I GATSHËM JE TË SAKRIFIKOSH KOMODITETIN PËR RRITJE?",
    "copy": [
      {
        "text": "(1 = ASPAK, 10 = PLOTËSISHT)",
        "style": "body"
      }
    ],
    "options": [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10"
    ],
    "cta": "Vazhdo ›",
    "asset": "",
    "assetAlt": "Ekran pyetësori me sfond të zi dhe ikonë të artë me pikëpyetje majtas. Nën titullin qendror ka dhjetë butona katrorë të errët në një rresht, të etiketuar 1–10. Poshtë janë Mbrapa, butoni i artë Vazhdo dhe treguesi i progresit me segmentin e parë të artë e pikat e tjera gri."
  },
  {
    "id": 8,
    "kind": "manifest",
    "eyebrow": "",
    "title": "MANIFESTI I LUFTETARIT DIGJITAL",
    "copy": [
      {
        "text": "Lexo me kujdes dhe pranoj nëse je dakord",
        "style": "body"
      },
      {
        "text": "KUSH JEMI NE?",
        "style": "body"
      },
      {
        "text": "Ne nuk jemi njerëz të zakonshëm që jetojnë në autopilot.",
        "style": "body"
      },
      {
        "text": "Ne jemi ata që refuzojmë të jetojmë nën potencialin tonë.",
        "style": "body"
      },
      {
        "text": "Ata që zgjedhin disiplinën kur të tjerët zgjedhin rehatinë.",
        "style": "body"
      },
      {
        "text": "Ata që ngrihen kur të tjerët dorëzohen.",
        "style": "body"
      },
      {
        "text": "Ata që përballen me errësirën brenda vetes dhe vendosin të transformohen.",
        "style": "body"
      },
      {
        "text": "Ne jemi Luftetarët e Epokës Digjitale.",
        "style": "body"
      },
      {
        "text": "Në një botë plot shpërqendrim, kaos dhe dobësi mendore, ne zgjedhim:",
        "style": "body"
      },
      {
        "text": "🎯 Qartësinë",
        "style": "body"
      },
      {
        "text": "💪 Forcën",
        "style": "body"
      },
      {
        "text": "🧘 Qetësinë",
        "style": "body"
      },
      {
        "text": "🚀 Misionin",
        "style": "body"
      },
      {
        "text": "Ne nuk ndërtojmë vetëm sukses të jashtëm. Ne ndërtojmë njeriun e plotë:",
        "style": "body"
      },
      {
        "text": "MENDJA • TRUPI • SHPIRTI • MISIONI",
        "style": "body"
      },
      {
        "text": "BESIMI YNË",
        "style": "body"
      },
      {
        "text": "✨ NE BESOJMË se çdo njeri ka një forcë të fshehur brenda vetes që pret të aktivizohet.",
        "style": "body"
      }
    ],
    "options": [
      "E kam lexuar dhe pranoj Manifestin e Luftetarit"
    ],
    "cta": "Vazhdo ›",
    "asset": "",
    "assetAlt": "Ekran manifesti me sfond të zi. Sipër majtas ka ikonë rrethore të artë të një libri të hapur; titulli i artë është në qendër. Teksti ndodhet në një panel të madh të errët me qoshe të rrumbullakosura, ku disa rreshta janë bold dhe ka emoji. Poshtë panelit ka checkbox të zbrazët, lidhjen Kthehu dhe një buton të artë Vazhdo, të dy të prerë pjesërisht nga skaji i poshtëm."
  },
  {
    "id": 9,
    "kind": "cta",
    "eyebrow": "",
    "title": "APLIKIMI PËR LUFTETAR",
    "copy": [
      {
        "text": "Ky aplikim është dizajnuar për të kuptuar mentalitetin, disiplinën,",
        "style": "body"
      },
      {
        "text": "thellësinë emocionale dhe gatishmërinë tënde për transformim.",
        "style": "body"
      },
      {
        "text": "Përgjigju me sinqeritet. Nuk ka përgjigje të sakta ose gabim.",
        "style": "body"
      },
      {
        "text": "Ka vetëm vetëdije dhe angazhim.",
        "style": "body"
      },
      {
        "text": "⏱ Rreth 15-20 minuta • 12 pyetje + video",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "Fillo Aplikimin →",
    "asset": "",
    "assetAlt": "Ekran hyrës me sfond të zi. Sipër majtas ka ikonë rrethore të artë të një lapsi; titulli i madh serif është pjesërisht i artë dhe pjesërisht i bardhë. Në qendër ka tekst shpjegues gri, një buton të gjerë të artë dhe poshtë tij shënimin e kohëzgjatjes me ikonë kronometri."
  },
  {
    "id": 10,
    "kind": "email",
    "eyebrow": "BETIMI YT ËSHTË NËNSHKRUAR.",
    "title": "LUFTETARI DIGJITAL",
    "copy": [
      {
        "text": "{{emri}},",
        "style": "body"
      },
      {
        "text": "Betimi nuk është aplikim.",
        "style": "body"
      },
      {
        "text": "Betimi është premtimi yt për ta filluar këtë rrugëtim me sinqeritet të plotë.",
        "style": "body"
      },
      {
        "text": "Tani vjen aplikimi — ku do të të sprovohet betimi yt me pyetje të vërteta.",
        "style": "body"
      },
      {
        "text": "UNË, {{emri}}, U BETOVA QË:",
        "style": "body"
      },
      {
        "text": "Do të jem i sinqertë me veten time — pa justifikime, pa maska, pa",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "Vazhdo",
    "asset": "",
    "assetAlt": "Pamje e Gmail-it me shiritin Search mail dhe kontrollet e postës sipër. Emaili i errët ka kartë qendrore me emoji të dy shpatave të kryqëzuara, emrin e markës në të artë, vijë ndarëse të artë dhe tekst të bardhë/gri. Një kuti betimi me kornizë të artë nis në pjesën e poshtme dhe vazhdon jashtë pamjes. Poshtë majtas ka një njoftim të Gmail-it që mbulon pjesërisht përmbajtjen."
  },
  {
    "id": 11,
    "kind": "cta",
    "eyebrow": "",
    "title": "BETIMI U NËNSHKRUA.",
    "copy": [
      {
        "text": "Tani vjen sprova, {{emri}}. Përgjigju nga zemra.",
        "style": "body"
      },
      {
        "text": "📧 Konfirmimi u dërgua te:",
        "style": "body"
      },
      {
        "text": "email@shembull.com",
        "style": "body"
      },
      {
        "text": "ℹ️ Betimi nuk është aplikim.",
        "style": "body"
      },
      {
        "text": "Betimi është premtimi yt për ta filluar këtë rrugëtim me sinqeritet të plotë. Tani vjen aplikimi — ku do të sprovohet betimi yt me pyetje të vërteta. Përgjigju nga zemra, jo nga mendja.",
        "style": "body"
      }
    ],
    "options": [
      "Apliko — me sinqeritet →",
      "Lexo më shumë para se të vendos"
    ],
    "cta": "Apliko — me sinqeritet →",
    "asset": "",
    "assetAlt": "A centered square icon showing a golden-orange phoenix rising above flames on a black background, framed by a thin gold border and glow."
  },
  {
    "id": 12,
    "kind": "form",
    "eyebrow": "",
    "title": "",
    "copy": [
      {
        "text": "programit.",
        "style": "body"
      },
      {
        "text": "Betimi yt personal (opsional)",
        "style": "body"
      },
      {
        "text": "Unë gjithashtu betoj që...",
        "style": "body"
      },
      {
        "text": "⚠️ E rëndësishme: Ky betim nuk garanton pranimin në program. Ai tregon gatishmërinë tënde. Pas betimit, do të vazhdosh me aplikimin.",
        "style": "body"
      }
    ],
    "options": [
      "⚡ Do të veproj qysh nga momenti i parë — jo pas, jo nesër, tani.",
      "🛡️ Do të respektoj rregullat dhe çdo person të tjetër brenda grupit.",
      "⚔️ Do ta marr seriozisht — si ditën më të rëndësishme të jetës sime.",
      "🌟 Besoj plotësisht në proces — edhe kur s’e shoh fundin, do të ec."
    ],
    "cta": "Nënshkruaj Betimin ✨",
    "asset": "",
    "assetAlt": "Lower portion of a dark black-and-gold pledge form, with checked gold checkboxes, an optional dark text area, an amber warning box, and a wide glowing yellow submit button."
  },
  {
    "id": 13,
    "kind": "form",
    "eyebrow": "",
    "title": "Unë, {{emri}}, betoj që:",
    "copy": [
      {
        "text": "Email-i yt (ku të dërgojmë betimin)",
        "style": "body"
      },
      {
        "text": "email@shembull.com",
        "style": "body"
      }
    ],
    "options": [
      "🛡️ Do të jem i sinqertë me veten time — pa justifikime, pa maska, pa gënjeshtra të vogla.",
      "🤝 Do të jem i sinqertë me Arlindin — do t’i them edhe atë që më dhemb ta them.",
      "❤️ Do t’u përgjigjem pyetjeve nga zemra, jo nga mendja që dëshiron të impresionoj.",
      "🔥 Fjala “JO” nuk do të ekzistojë për mua gjatë 30 ditëve të programit.",
      "⚡ Do të veproj qysh nga momenti i parë — jo pas, jo nesër, tani.",
      "🛡️ Do të respektoj rregullat dhe çdo person të tjetër brenda grupit.",
      "⚔️ Do ta marr seriozisht — si ditën më të rëndësishme të jetës sime."
    ],
    "cta": "Vazhdo",
    "asset": "",
    "assetAlt": "Midsection of a black-and-gold pledge form. A pale email field sits above a personalized pledge heading; the first four pledge cards have gold checked boxes and the following cards have empty dark checkboxes."
  },
  {
    "id": 14,
    "kind": "form",
    "eyebrow": "",
    "title": "Unë, {{emri}}, betoj që:",
    "copy": [
      {
        "text": "Email-i yt (ku të dërgojmë betimin)",
        "style": "body"
      },
      {
        "text": "email@shembull.com",
        "style": "body"
      }
    ],
    "options": [
      "🛡️ Do të jem i sinqertë me veten time — pa justifikime, pa maska, pa gënjeshtra të vogla.",
      "🤝 Do të jem i sinqertë me Arlindin — do t’i them edhe atë që më dhemb ta them.",
      "❤️ Do t’u përgjigjem pyetjeve nga zemra, jo nga mendja që dëshiron të impresionoj.",
      "🔥 Fjala “JO” nuk do të ekzistojë për mua gjatë 30 ditëve të programit.",
      "⚡ Do të veproj qysh nga momenti i parë — jo pas, jo nesër, tani.",
      "🛡️ Do të respektoj rregullat dhe çdo person të tjetër brenda grupit.",
      "⚔️ Do ta marr seriozisht — si ditën më të rëndësishme të jetës sime."
    ],
    "cta": "Vazhdo",
    "asset": "",
    "assetAlt": "Midsection of a black-and-gold pledge form with a pale prefilled email field, a personalized heading, and a vertical stack of seven dark pledge cards, all showing empty checkboxes."
  },
  {
    "id": 15,
    "kind": "form",
    "eyebrow": "",
    "title": "BETIMI I LUFTETARIT",
    "copy": [
      {
        "text": "Para se të aplikosh, beto se do të jesh i sinqertë. Përgjigjja “po” e do një njeri të plotë.",
        "style": "body"
      },
      {
        "text": "Si dëshiron të të thërrasim?",
        "style": "body"
      },
      {
        "text": "Emri yt...",
        "style": "body"
      },
      {
        "text": "Email-i yt (ku të dërgojmë betimin)",
        "style": "body"
      },
      {
        "text": "email@shembull.com",
        "style": "body"
      }
    ],
    "options": [
      "🛡️ Do të jem i sinqertë me veten time — pa justifikime, pa maska, pa gënjeshtra të vogla.",
      "🤝 Do të jem i sinqertë me Arlindin — do t’i them edhe atë që më dhemb ta them."
    ],
    "cta": "Vazhdo",
    "asset": "",
    "assetAlt": "Desktop browser view of a centered black-and-gold pledge page. A glowing square icon contains a rolled golden scroll; below it are the gold serif title, introductory copy, two dark input fields, and empty-checkbox pledge cards."
  },
  {
    "id": 16,
    "kind": "story",
    "eyebrow": "Mirësevjen në luftë.",
    "title": "TANI QË E DI KUSH JAM...",
    "copy": [
      {
        "text": "Arlind Berisha",
        "style": "body"
      },
      {
        "text": "Kthehu dhe nënshkruaj betimin tënd.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "Kthehu te Betimi →",
    "asset": "",
    "assetAlt": "Minimal black page with oversized gold welcome text at the top and a centered, thin gold-outlined dark card containing a gold serif heading and a glowing yellow button."
  },
  {
    "id": 17,
    "kind": "story",
    "eyebrow": "“Suksesi i vërtetë është kush bëhesh brenda gjatë rrugës.”",
    "title": "Mirësevjen në luftë.",
    "copy": [
      {
        "text": "Nuk jam dorëzuar kurrë.",
        "style": "body"
      },
      {
        "text": "Edhe kur kisha çdo arsye për ta bërë.",
        "style": "body"
      },
      {
        "text": "Dhe nuk do të lë as ty të dorëzohesh.",
        "style": "body"
      },
      {
        "text": "Sepse drita ime nuk humbet duke ndezur dritën tënde. Përkundrazi... bota bëhet më e ndriçuar bashkë.",
        "style": "body"
      },
      {
        "text": "Arlind Berisha",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "← Kthehu",
    "asset": "",
    "assetAlt": "Sparse black editorial page with centered gold and gray typography, a small gold ornamental divider, a back link in the upper left, and a dark music-status pill in the upper right."
  },
  {
    "id": 18,
    "kind": "story",
    "eyebrow": "“Luftetari Digjital nuk fshihet nga bota moderne. E sundon atë.”",
    "title": "Misioni im",
    "copy": [
      {
        "text": "Për të shtuar dashurinë. Jo për ta zëvendësuar.",
        "style": "body"
      },
      {
        "text": "Për të shtuar rehatinë e vërtetë. Jo për t'u dukur të rehatshëm.",
        "style": "body"
      },
      {
        "text": "Të ndez një brez të tërë luftëtarësh digjitalë në botën shqipfolëse.",
        "style": "body"
      },
      {
        "text": "Njerëz që nuk ndahen më në copa. Që nuk bien në një anë sepse harruan tjetrën. Dhe që e dinë se suksesi i vërtetë nuk është çfarë ndërton jashtë.",
        "style": "body"
      },
      {
        "text": "“Suksesi i vërtetë është kush bëhesh",
        "style": "quote"
      }
    ],
    "options": [],
    "cta": "← Kthehu",
    "asset": "",
    "assetAlt": "Black editorial story page with gold italic quotation text, a small gold ornamental divider, a centered gold section heading, gray body copy, a back link, and a music-status pill. The next quotation is partially visible at the bottom."
  },
  {
    "id": 19,
    "kind": "manifest",
    "eyebrow": "E njëjta gjë që mund të na bëjë të lirë... na po bën skllevër pa zinxhirë.",
    "title": "“Shumica e njerëzve nuk e dinë se janë në luftë. Por janë.”",
    "copy": [
      {
        "text": "Dhe në çdo luftë ka dy zgjedhje. Të bësh paqe me humbjen. Ose të ngrihesh dhe të luftosh.",
        "style": "body"
      },
      {
        "text": "Luftetari Digjital është metafora e atyre që zgjedhin të luftojnë.",
        "style": "body"
      },
      {
        "text": "Atyre që nuk e refuzojnë teknologjinë. Por e zotërojnë atë.",
        "style": "body"
      },
      {
        "text": "Atyre që e marrin të njëjtën armë që po shkatërron shumicën, dhe e kthejnë në mjet ndërtimi.",
        "style": "body"
      },
      {
        "text": "Atyre që e përdorin teknologjinë për të shtuar suksesin. Jo për ta hequr.",
        "style": "body"
      },
      {
        "text": "Për të shtuar dashurinë. Jo për ta zëvendësuar.",
        "style": "body"
      },
      {
        "text": "Për të shtuar rehatinë e vërtetë. Jo për t'u dukur të rehatshëm.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "← Kthehu",
    "asset": "",
    "assetAlt": "Black editorial manifesto page with a large centered gold italic quote, gray paragraph copy with selected phrases highlighted in gold or white, a back link at top left, and a dark music-status pill at top right."
  },
  {
    "id": 20,
    "kind": "story",
    "eyebrow": "“Luftetari Digjital është qiriri që po ndez. Dhe ti je qiriri tjetër.”",
    "title": "Pse emri \"Luftetari Digjital\"",
    "copy": [
      {
        "text": "Në botën që po jetojmë, ka një armë të padukshme që po na rrëmben gjithçka.",
        "style": "body"
      },
      {
        "text": "Na rrëmben kohën.",
        "style": "body"
      },
      {
        "text": "Na rrëmben fokusin.",
        "style": "body"
      },
      {
        "text": "Na rrëmben paqen e mendjes.",
        "style": "body"
      },
      {
        "text": "Na rrëmben lidhjet e vërteta.",
        "style": "body"
      },
      {
        "text": "Na rrëmben aftësinë për të ndier sukses, dashuri, dhe rehati.",
        "style": "body"
      },
      {
        "text": "Ajo armë është teknologjia.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "← Kthehu",
    "asset": "",
    "assetAlt": "Black editorial page with a large centered gold italic quote, a small gold ornamental divider, a gold section heading, gray body copy with the final word highlighted in gold, plus a back link and music-status pill in the header."
  },
  {
    "id": 21,
    "kind": "story",
    "eyebrow": "",
    "title": "Çfarë është Luftetari Digjital",
    "copy": [
      {
        "text": "E di ndjenjën. E njoh në mënyrë intime.",
        "style": "body"
      },
      {
        "text": "Dhe nuk do të të lë vetëm aty.",
        "style": "body"
      },
      {
        "text": "Nuk është një kurs.",
        "style": "body"
      },
      {
        "text": "Nuk është një bootcamp marketingu.",
        "style": "body"
      },
      {
        "text": "Nuk është një seminar motivimi që dëgjon dhe harron pas tri ditësh.",
        "style": "body"
      },
      {
        "text": "Është rruga që do të doja ta kisha pasur kur isha ti.",
        "style": "body"
      },
      {
        "text": "Një rrugë e strukturuar për të ndërtuar veten plotësisht. Mendjen. Trupin. Shpirtin. Dhe profesionalizmin. Bashkë, jo veç e veç.",
        "style": "body"
      },
      {
        "text": "Sepse e mësova në mënyrën më të vështirë: ky është i vetmi mënyrë që funksionon vërtet. Gjatë.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "",
    "asset": "",
    "assetAlt": "Black full-width editorial page with a thin dark header, a back-arrow control at upper left and a music-active pill at upper right. Gold and gray typography is arranged in a narrow centered column; a three-dot/two-line gold divider sits above the centered gold section title. There are no photographic assets."
  },
  {
    "id": 22,
    "kind": "story",
    "eyebrow": "",
    "title": "Pse mund të më besosh",
    "copy": [
      {
        "text": "Nuk jam këtu rastësisht.",
        "style": "body"
      },
      {
        "text": "Jam këtu sepse kam paguar çmimin me jetën time. Para se dikush të më paguajë mua një euro.",
        "style": "body"
      },
      {
        "text": "Jam këtu sepse kam lexuar librat që pak njerëz në vendin tim i kanë lexuar. Dhe i kam jetuar mësimet e tyre.",
        "style": "body"
      },
      {
        "text": "Jam këtu sepse kam ndjekur trajnimet më të fuqishme në botë. Dhe i kam testuar në jetën time reale.",
        "style": "body"
      },
      {
        "text": "Jam këtu sepse kam ndërtuar biznese që funksionojnë. Jo teori që tingëllojnë mirë.",
        "style": "body"
      },
      {
        "text": "Jam këtu sepse kam dështuar mjaftueshëm sa të di ku janë gropat. Dhe kam fituar mjaftueshëm sa të di ku është rruga.",
        "style": "body"
      },
      {
        "text": "Dhe mbi të gjitha... jam këtu sepse e di se ndoshta tani, ti je atje ku isha unë para disa vitesh.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "",
    "asset": "",
    "assetAlt": "Black editorial page with a fixed dark header, back-arrow control, and music-active pill. A gold ornamental divider precedes a centered gold heading. The body is a sequence of gray paragraphs in a centered narrow column, ending with a bold white phrase. No image or illustration is present."
  },
  {
    "id": 23,
    "kind": "story",
    "eyebrow": "",
    "title": "",
    "copy": [
      {
        "text": "Përkundrazi. Bota bëhet më e ndriçuar.",
        "style": "body"
      },
      {
        "text": "Unë kalova vite duke ecur në errësirë sepse askush nuk më tregoi rrugën e plotë.",
        "style": "body"
      },
      {
        "text": "Askush nuk më tha që nuk mund të ndërtoja biznes të suksesshëm me një trup të shkatërruar.",
        "style": "body"
      },
      {
        "text": "Askush nuk më tha që paratë pa shpirt të bëjnë më të vetmuar se varfëria.",
        "style": "body"
      },
      {
        "text": "Askush nuk më tha që forca shpirtërore pa profesionalizëm mbetet ëndërr që nuk realizohet kurrë.",
        "style": "body"
      },
      {
        "text": "Mësova vetë. Duke u rrëzuar. Duke paguar çmimin.",
        "style": "body"
      },
      {
        "text": "Dhe sot kam një zgjedhje.",
        "style": "body"
      },
      {
        "text": "Mund ta ruaj këtë dije për veten. Të ndërtoj biznesin tim. Të jetoj jetën time. Dhe të mbyll derën pas vetes.",
        "style": "body"
      },
      {
        "text": "Ose mund të ndez një qiri tjetër. Dhe një tjetër. Dhe një tjetër.",
        "style": "body"
      },
      {
        "text": "Derisa një brez i tërë luftëtarësh digjitalë në botën shqipfolëse të mos detyrohet të ecë në errësirën që unë eca.",
        "style": "body"
      },
      {
        "text": "\"Kjo është arsyeja pse Luftetari Digjital nuk është biznes për mua. Është mision.\"",
        "style": "quote"
      }
    ],
    "options": [],
    "cta": "",
    "asset": "",
    "assetAlt": "A mid-scroll view of a black editorial page. The fixed header contains the back and music controls. Gray narrative paragraphs fill a centered column, with one sentence emphasized in bold gold and a large italic gold quotation beginning at the cropped lower edge. No photographic asset appears."
  },
  {
    "id": 24,
    "kind": "quote",
    "eyebrow": "",
    "title": "Pse po e bëj Luftetarin Digjital",
    "copy": [
      {
        "text": "Sepse tani jam gati. Dhe tani e di me siguri se çfarë po jap.",
        "style": "body"
      },
      {
        "text": "Ka një fjalë që e mbaj në zemër çdo ditë.",
        "style": "body"
      },
      {
        "text": "\"Një qiri që ndez një qiri tjetër nuk humbet asgjë nga drita e vet.\"",
        "style": "quote"
      },
      {
        "text": "Përkundrazi. Bota bëhet më e ndriçuar.",
        "style": "body"
      },
      {
        "text": "Unë kalova vite duke ecur në errësirë sepse askush nuk më tregoi rrugën e plotë.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "",
    "asset": "",
    "assetAlt": "Black editorial section with a small gray sentence above a gold three-dot divider. A centered gold heading leads into a gray intro and a large centered italic gold quotation. Supporting gray text follows below, with a short clause highlighted gold. No image is present; the top header is mostly cropped."
  },
  {
    "id": 25,
    "kind": "story",
    "eyebrow": "",
    "title": "",
    "copy": [
      {
        "text": "e dobëson rrethin para tij.\"",
        "style": "quote"
      },
      {
        "text": "Unë këto rrathë i ndërtova një për një, qysh para disa vitesh.",
        "style": "body"
      },
      {
        "text": "Jo për t'u mburrur, e them me modesti të plotë. Por sepse është e vërtetë, dhe sepse kjo e vërtetë më jep paqe të flas tani.",
        "style": "body"
      },
      {
        "text": "Veten time e ndërtova.",
        "style": "body"
      },
      {
        "text": "Familjen time e mbështeta.",
        "style": "body"
      },
      {
        "text": "Shoqërinë time e ngrita.",
        "style": "body"
      },
      {
        "text": "Komshijtë e mi i ndihmova.",
        "style": "body"
      },
      {
        "text": "Dhe tani, vetëm tani, ndjej se ka ardhur koha t'i shërbej komunitetit më të madh.",
        "style": "body"
      },
      {
        "text": "Jo si dikush që ende po eksperimenton. Por si dikush që ka ecur rrugën, ka parë çfarë funksionon në jetën reale, dhe ndjen në zemër se është momenti ta japë më tutje.",
        "style": "body"
      },
      {
        "text": "\"Luftetari Digjital lind tani. Jo dje. Jo më herët. Tani.\"",
        "style": "quote"
      }
    ],
    "options": [],
    "cta": "",
    "asset": "",
    "assetAlt": "Mid-scroll black editorial page under a fixed header with back and music controls. Gray paragraphs are interspersed with bold white and gold emphasis. A large italic gold quotation is partially visible at the bottom, while the tail of an earlier quotation is cropped at the top. No visual asset beyond typography and layout."
  },
  {
    "id": 26,
    "kind": "story",
    "eyebrow": "",
    "title": "",
    "copy": [
      {
        "text": "Sepse unë besoj që të ndihmojmë të tjerët nuk është një veprim i rastësishëm. Është një rrugëtim që fillon nga brenda dhe zgjerohet në rrathë.",
        "style": "body"
      },
      {
        "text": "Së pari, ndihmojmë veten. Të jemi të plotë, të qartë, të fortë në këmbët tona.",
        "style": "body"
      },
      {
        "text": "Pastaj familjen. Ata që na japin themelet dhe na duan pa kushte.",
        "style": "body"
      },
      {
        "text": "Pastaj shoqërinë. Miqtë dhe shokët që ecin krah për krah me ne.",
        "style": "body"
      },
      {
        "text": "Pastaj komshijtë. Rrethin ku jetojmë çdo ditë.",
        "style": "body"
      },
      {
        "text": "Dhe vetëm pastaj komunitetin e gjerë.",
        "style": "body"
      },
      {
        "text": "\"Çdo rreth që kapërcejmë pa qenë të plotë, e dobëson rrethin para tij.\"",
        "style": "quote"
      },
      {
        "text": "Unë këto rrathë i ndërtova një për një, qysh para disa vitesh.",
        "style": "body"
      }
    ],
    "options": [
      "Së pari, ndihmojmë veten. Të jemi të plotë, të qartë, të fortë në këmbët tona.",
      "Pastaj familjen. Ata që na japin themelet dhe na duan pa kushte.",
      "Pastaj shoqërinë. Miqtë dhe shokët që ecin krah për krah me ne.",
      "Pastaj komshijtë. Rrethin ku jetojmë çdo ditë.",
      "Dhe vetëm pastaj komunitetin e gjerë."
    ],
    "cta": "",
    "asset": "",
    "assetAlt": "Black editorial page with a fixed dark header. A gray introductory paragraph is followed by five gold-arrow list rows; each starts with bold white lead text and continues in gray. A large centered italic gold quote appears beneath the list, followed by the beginning of the next gray paragraph at the bottom edge."
  },
  {
    "id": 27,
    "kind": "quote",
    "eyebrow": "",
    "title": "Të ndihmoj ka qenë gjithmonë në natyrën time.",
    "copy": [
      {
        "text": "Por mësova rendin.",
        "style": "body"
      },
      {
        "text": "Unë jam rritur duke u munduar të ndihmoj gjithkë që më rrethonte. Familjen. Miqtë. Shokët. Partnerët e biznesit. Këdo që vinte tek unë me një peshë në shpinë.",
        "style": "body"
      },
      {
        "text": "Kjo është një pjesë e zemrës që e dashuroj. Të jap është ndoshta gjëja që më bën të ndihem më i plotë në këtë botë.",
        "style": "body"
      },
      {
        "text": "Por me kohën, mësova diçka që më ndryshoi mënyrën si e shihja të ndihmuarit.",
        "style": "body"
      },
      {
        "text": "\"Rendi ka rëndësi. Shumë rëndësi.\"",
        "style": "quote"
      },
      {
        "text": "Sepse unë besoj që të ndihmojmë të tjerët nuk është një veprim i rastësishëm. Është një rrugëtim që fillon nga brenda dhe zgjerohet në rrathë.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "",
    "asset": "",
    "assetAlt": "Centered black editorial section under a fixed back/music header. A gold ornamental divider leads into a bold gold title and large gray subtitle. Three gray narrative paragraphs sit in a narrow column, followed by a prominent italic gold quotation. The next paragraph is partially visible at the lower edge."
  },
  {
    "id": 28,
    "kind": "quote",
    "eyebrow": "",
    "title": "Të ndihmoj ka qenë gjithmonë në natyrën time.",
    "copy": [
      {
        "text": "BERIX u ndërtua mbi këtë themel.",
        "style": "body"
      },
      {
        "text": "Zoom Growth u bë agjencia kryesore e marketingut në vendin tim mbi këtë themel.",
        "style": "body"
      },
      {
        "text": "Familja ime u forcua mbi këtë themel.",
        "style": "body"
      },
      {
        "text": "Besimi im u thellua mbi këtë themel.",
        "style": "body"
      },
      {
        "text": "\"Gjithçka që sheh sot tek unë, është ndërtuar mbi këto katër shtylla. Asgjë më pak.\"",
        "style": "quote"
      },
      {
        "text": "Por mësova rendin.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "",
    "asset": "",
    "assetAlt": "Black editorial transition page with fixed back and music controls. Four left-aligned proof statements use gold bold subjects and gray continuations. A large centered italic gold quote follows, then a gold dot-and-line divider and the beginning of the next section with a gold title and gray subtitle."
  },
  {
    "id": 29,
    "kind": "quote",
    "eyebrow": "",
    "title": "",
    "copy": [
      {
        "text": "\"Atë ditë, jeta ime filloi të ndriçojë.\"",
        "style": "quote"
      },
      {
        "text": "Jo sepse gjërat u bënë të lehta. Ato u bënë më të vështira. Sepse për herë të parë po luftoja me të gjitha forcat e mia bashkë.",
        "style": "body"
      },
      {
        "text": "Por për herë të parë...",
        "style": "body"
      },
      {
        "text": "Çdo betejë e fituar qëndronte.",
        "style": "body"
      },
      {
        "text": "Çdo hap përpara nuk shoqërohej me dy hapa prapa.",
        "style": "body"
      },
      {
        "text": "Çdo arritje nuk më linte bosh.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "",
    "asset": "",
    "assetAlt": "Minimal black editorial page with a fixed top bar, back control, and music-active pill. A large italic gold quotation is centered near the top. Beneath it, gray text sits in a narrow left-aligned column with selected phrases in bold white. A small gold three-dot/two-line divider closes the section near the bottom."
  },
  {
    "id": 30,
    "kind": "pillar",
    "eyebrow": "",
    "title": "Dita që jeta ime filloi të ndriçojë",
    "copy": [
      {
        "text": "Vendosa të bashkoja katër shtyllat që e mbajnë një njeri të tërë në këmbë.",
        "style": "body"
      }
    ],
    "options": [
      "MENDJA — Të mendoj qartë. Të zgjedh me vetëdije. Të ndërtoj jetë, jo thjesht ta jetoj rastësisht.",
      "TRUPI — Të mbaj peshën e një vizioni të madh pa u thyer. Sepse asnjë ëndërr nuk realizohet pa një trup që e mban.",
      "SHPIRTI — Të qëndroj në rrugë kur askush nuk po sheh. Kur gjithçka po dështon. Kur jam vetëm me veten në mes të natës.",
      "PROFESIONALIZMI — Të shndërroj dijen në rezultat real. Jo dëshira boshe që digjen me kalimin e kohës."
    ],
    "cta": "",
    "asset": "",
    "assetAlt": "Black section with a centered gold title and gray explanatory subtitle. Four dark rounded cards are arranged in a two-by-two grid. Each card has a gold serif uppercase heading and gray descriptive copy: MENDJA, TRUPI, SHPIRTI, and PROFESIONALIZMI. A gold dot-and-line divider sits centered below the grid; the top navigation is cropped out."
  },
  {
    "id": 31,
    "kind": "story",
    "eyebrow": "",
    "title": "Dita që jeta ime filloi të ndriçojë",
    "copy": [
      {
        "text": "Po luftoja luftëra të ndara. Dhe çdo betejë e fituar në një front, po e humbisja dyfish në një front tjetër.",
        "style": "body"
      },
      {
        "text": "\"Nuk isha një njeri i tërë. Isha copa të shkëputura që po grindeshin me njëra-tjetrën.\"",
        "style": "quote"
      },
      {
        "text": "Vendosa të bashkoja katër shtyllat që e mbajnë një njeri të tërë në këmbë.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "",
    "asset": "",
    "assetAlt": "Black story page with white and gold typography; a centered gold italic pull quote and two decorative gold dot-and-line dividers. A back control is at top left and an active-music control at top right."
  },
  {
    "id": 32,
    "kind": "story",
    "eyebrow": "",
    "title": "Dhe një ditë, gjithçka u bashkua. Pashë të vërtetën që po më ikte.",
    "copy": [
      {
        "text": "E gjeta duke ndjekur trajnimet më të fuqishme në botë. Duke investuar gjithçka në vetveten time kur kisha pak.",
        "style": "body"
      },
      {
        "text": "E gjeta duke takuar mësues, mentorë, dhe njerëz që kishin ecur rrugën para meje.",
        "style": "body"
      },
      {
        "text": "Dhe më e rëndësishmja... e gjeta duke u rrëzuar, duke u ngritur, dhe duke pyetur veten çdo herë: \"Çfarë po më mungon?\"",
        "style": "quote"
      },
      {
        "text": "Po investoja vetëm në një anë të jetës time. Dhe pjesa tjetër po më vriste pa e ditur.",
        "style": "body"
      },
      {
        "text": "Kur mendja ime ishte e mprehtë... trupi im ishte i shkatërruar.",
        "style": "body"
      },
      {
        "text": "Kur biznesi po ecte... shpirti im ishte zbrazur.",
        "style": "body"
      },
      {
        "text": "Kur lutesha shumë... profesionalizmi më ngecte.",
        "style": "body"
      },
      {
        "text": "Kur trupi po stërvitej... mendja më ikte gjithandej.",
        "style": "body"
      },
      {
        "text": "Po luftoja luftëra të ndara. Dhe çdo betejë e fituar në një front, po e humbisja dyfish në",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "",
    "asset": "",
    "assetAlt": "Black long-form story page with white, gray, gold, and red typography. The main realization is set larger with a gold phrase; four contrast statements use red endings. A gold dot-and-line divider separates sections."
  },
  {
    "id": 33,
    "kind": "story",
    "eyebrow": "Por një gjë nuk bëra kurrë.",
    "title": "Nuk u dorëzova.",
    "copy": [
      {
        "text": "Sepse diçka brenda meje më thoshte se rruga ekzistonte. Vetëm se ende nuk e kisha gjetur.",
        "style": "body"
      },
      {
        "text": "\"Dhe pastaj e gjeta.\"",
        "style": "quote"
      },
      {
        "text": "Nuk erdhi në një ëndërr. Nuk më ra nga qielli. Nuk më e tregoi askush.",
        "style": "body"
      },
      {
        "text": "E gjeta duke lexuar libra. Natë pas nate, kur të tjerët flinin.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "",
    "asset": "",
    "assetAlt": "Minimal black story page with a large gold headline, gray body copy, a centered gold italic pull quote, and gold dot-and-line dividers above and between sections."
  },
  {
    "id": 34,
    "kind": "story",
    "eyebrow": "",
    "title": "\"A ja vlen vërtet? A jam unë i bërë për këtë rrugë?\"",
    "copy": [
      {
        "text": "Kam nisur biznese që kanë rënë.",
        "style": "body"
      },
      {
        "text": "Kam ndërtuar projekte që kanë vdekur në djep.",
        "style": "body"
      },
      {
        "text": "Kam shpenzuar para që nuk i kisha. Kohë që nuk më kthehej kurrë. Energji që më hante natën.",
        "style": "body"
      },
      {
        "text": "Kam pasur netë ku më ka pyetur veten...",
        "style": "body"
      },
      {
        "text": "Kam ndier vetminë e atij që ka një vizion që askush nuk e sheh.",
        "style": "body"
      },
      {
        "text": "Peshën e të qenit i pari në familje, në rreth, në komunitet që guxon të ëndërrojë kaq lart.",
        "style": "body"
      },
      {
        "text": "Kam kaluar humbje financiare. Tradhti. Dështime në biznes. Zhgënjime nga njerëzit. Presion. Ankth. Vetmi. Dhe beteja të brendshme që askush nuk i shihte.",
        "style": "body"
      },
      {
        "text": "Ka pasur momente ku errësira mendore ishte aq e rëndë, sa ndihesha i shkëputur nga vetja dhe jeta.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "",
    "asset": "",
    "assetAlt": "Black long-form story page with muted gray paragraphs and a centered gold italic question used as a pull quote. Top navigation shows back and active-music controls."
  },
  {
    "id": 35,
    "kind": "story",
    "eyebrow": "Por nëse më kishe takuar para disa vitesh...",
    "title": "Do të kishe parë një histori krejt tjetër.",
    "copy": [
      {
        "text": "Do të kishe parë një djalë që po luftonte në errësirë. Që nuk e dinte pse po vuante. Që mundohej me të gjitha forcat, por asgjë nuk po qëndronte në këmbë.",
        "style": "body"
      },
      {
        "text": "\"E kaluara ime ishte e dhimbshme. Por sot e di. Ishte mësuesi im më i madh.\"",
        "style": "quote"
      },
      {
        "text": "Kam nisur biznese që kanë rënë.",
        "style": "body"
      },
      {
        "text": "Kam ndërtuar projekte që kanë vdekur në djep.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "",
    "asset": "",
    "assetAlt": "Black story page with a white heading, muted gray copy, a large centered gold italic quotation, and a decorative gold dot-and-line divider."
  },
  {
    "id": 36,
    "kind": "story",
    "eyebrow": "",
    "title": "Emri im është Arlind Berisha.",
    "copy": [
      {
        "text": "Sot jam në krye të një ekosistemi biznesesh. BERIX. Zoom Growth. Dhe projekte të ndryshme.",
        "style": "body"
      },
      {
        "text": "Jam edhe themelues i Luftetari Digjital. Programi që do ta kisha pasur 10 vjet më parë, sikur ekzistonte.",
        "style": "body"
      },
      {
        "text": "Po shkruaj sot këto rreshta, dhe më ngrohet zemra që kam guximin t'i them. Sepse pak vite më parë nuk do të kisha mundur.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "",
    "asset": "",
    "assetAlt": "Minimal black founder-story page with white and gray text; BERIX and Zoom Growth are highlighted in gold, and Luftetari Digjital is bold. A gold dot-and-line divider appears near the bottom."
  },
  {
    "id": 37,
    "kind": "story",
    "eyebrow": "THEMELUES",
    "title": "ARLIND BERISHA",
    "copy": [
      {
        "text": "Themelues i Luftetarit Digjital",
        "style": "body"
      },
      {
        "text": "Nuk jam dorëzuar kurrë.",
        "style": "body"
      },
      {
        "text": "As edhe atëherë kur çdo gjë brenda meje më thoshte se duhej të dorëzohesha.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "Lexo historinë time",
    "asset": "",
    "assetAlt": "Black and gold founder hero. A circular portrait shows Arlind Berisha in a dark suit, seated with clasped hands against branded gold-and-black signage. Below it are a gold founder badge, oversized serif name, founder subtitle, statement, and a downward chevron."
  },
  {
    "id": 38,
    "kind": "story",
    "eyebrow": "",
    "title": "PRIT PAK.",
    "copy": [
      {
        "text": "Para se të nënshkruash betimin, njih atë që ka shkruar manifestin.",
        "style": "body"
      },
      {
        "text": "Nuk është mësues. Nuk është guru. Është dikush që ka rënë më shumë se shumica—dhe ka zgjedhur të ngrihet sërish.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "Lexo historinë e tij",
    "asset": "",
    "assetAlt": "Dark cinematic black-and-gold screen with faint star-like particles and a warm central glow. A framed ornate gold keyhole/mirror emblem sits above the gold serif heading. The CTA is a large gold rounded button with book and arrow icons; a speaker button is at top right."
  },
  {
    "id": 39,
    "kind": "cta",
    "eyebrow": "",
    "title": "A JE GATI TË BËSH BETIMIN?",
    "copy": [
      {
        "text": "Betimi nuk është aplikim. Është procesi që e bën aplikimin tënd të vërtetë.",
        "style": "body"
      },
      {
        "text": "Nëse beton, do të të sprovohet sinqeriteti me pyetje të vërteta.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "Po, jam gati",
    "asset": "",
    "assetAlt": "Dark black-and-gold prompt with sparse star-like particles and a centered warm halo. A framed gold scroll icon appears above the serif heading. The CTA is a bright gold rounded button with a right arrow; a speaker control sits at top right."
  },
  {
    "id": 40,
    "kind": "story",
    "eyebrow": "Por... çfarë nëse këto katër nuk janë gjithçka?",
    "title": "ÇDO DITË ËSHTË DHURATË",
    "copy": [
      {
        "text": "Brenda LD të presin shumë më shumë se kaq.",
        "style": "body"
      },
      {
        "text": "Gjera që nuk i tregojmë këtu — që zbulohen vetëm ditë pas dite.",
        "style": "body"
      },
      {
        "text": "Dhe dhuratat hapen, nuk tregohen.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "Jam kurioz",
    "asset": "",
    "assetAlt": "Dark cinematic black-and-gold teaser with a central warm glow and tiny star-like particles. A framed gold gift-box icon sits above the large gold serif headline. The outlined rounded CTA includes a right chevron; a speaker button is at top right."
  },
  {
    "id": 41,
    "kind": "story",
    "eyebrow": "Por... çfarë nëse këto katër nuk janë gjithçka?",
    "title": "ÇDO DITË ËSHTË DHURATË",
    "copy": [
      {
        "text": "Brenda LD të presin shumë më shumë se kaq.",
        "style": "body"
      },
      {
        "text": "Gjera që nuk i tregojmë këtu — që zbulohen vetëm ditë pas dite.",
        "style": "body"
      },
      {
        "text": "Dhe dhuratat hapen, nuk tregohen.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "",
    "asset": "/journey-assets/gift.png",
    "assetAlt": "Dark black-and-gold screen with faint floating specks and a central glowing square icon showing an open ornate golden gift box; a speaker button is at the upper right."
  },
  {
    "id": 42,
    "kind": "pillar",
    "eyebrow": "",
    "title": "MISIONI",
    "copy": [
      {
        "text": "Transformo potencialin në rezultat",
        "style": "body"
      }
    ],
    "options": [
      "Aftësi profesionale të kërkuara në treg",
      "AI dhe automatizim praktik",
      "Ndërtim projektesh reale",
      "Networking me profesionistë",
      "Personal branding dhe prezencë"
    ],
    "cta": "",
    "asset": "/journey-assets/mission.png",
    "assetAlt": "Dark black-and-gold screen with faint specks, five stacked rounded list cards, and a glowing compass with a flame in a square icon above the heading; a speaker button is at the upper right.",
    "pillarColor": "#eeae2d"
  },
  {
    "id": 43,
    "kind": "pillar",
    "eyebrow": "",
    "title": "SHPIRTI",
    "copy": [
      {
        "text": "Gjej qetësinë brenda kaosit",
        "style": "body"
      }
    ],
    "options": [
      "Praktika falënderimi çdo mëngjes",
      "Lidhje me natyrën dhe heshtjen",
      "Reflektim i thellë mbi veten",
      "Eliminim i energjive negative",
      "Ndërtim i paqes së brendshme"
    ],
    "cta": "",
    "asset": "/journey-assets/spirit.png",
    "assetAlt": "Dark screen with a purple glow, five stacked rounded list cards, and a luminous purple-and-gold looped heart or ribbon emblem in a square icon above the heading; a speaker button is at the upper right.",
    "pillarColor": "#9d63f5"
  },
  {
    "id": 44,
    "kind": "pillar",
    "eyebrow": "",
    "title": "TRUPI",
    "copy": [
      {
        "text": "Disiplina fizike ndërton karakter",
        "style": "body"
      }
    ],
    "options": [
      "Ushtrime intensive çdo mëngjes",
      "Cold shower — dush i ftohtë çdo ditë",
      "Gjumë i rregullt 7-8 orë",
      "Ushqim i pastër pa junk food",
      "Hidratim 3+ litra ujë në ditë",
      "Outdoor challenges çdo vikend"
    ],
    "cta": "",
    "asset": "/journey-assets/body.png",
    "assetAlt": "Dark screen with green accents, six stacked rounded list cards, and a green jewel-like figure inside a gold star emblem above the heading; a speaker button is at the upper right. The top edge of another rounded element is partially visible at the bottom, with no readable text.",
    "pillarColor": "#31cf86"
  },
  {
    "id": 45,
    "kind": "pillar",
    "eyebrow": "",
    "title": "MENDJA",
    "copy": [
      {
        "text": "Kontrollo mendjen, kontrollo jetën",
        "style": "body"
      }
    ],
    "options": [
      "Meditim i thellë 15-30 min çdo ditë",
      "Journaling për vetëdije dhe qartësi",
      "Digital detox — kontroll i telefonit",
      "Teknika për eliminimin e ankthit"
    ],
    "cta": "",
    "asset": "/journey-assets/mind.png",
    "assetAlt": "Dark screen with blue accents, four stacked rounded list cards, and a glowing blue-outlined brain icon above the heading; a thin progress line runs across the top and a speaker button is at the upper right.",
    "pillarColor": "#57a2ff"
  },
  {
    "id": 46,
    "kind": "cta",
    "eyebrow": "",
    "title": "A JE GATI TË SHOHËSH VETEN NË VERSIONIN MË TË MIRË?",
    "copy": [
      {
        "text": "Atë version që e di se ekziston brenda teje.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "Po, jam gati →",
    "asset": "/journey-assets/mirror.png",
    "assetAlt": "Minimal dark screen with faint gold haze and specks, an ornate oval mirror icon centered above the text, and a large glowing yellow rounded CTA button; a speaker button is at the upper right."
  },
  {
    "id": 47,
    "kind": "cta",
    "eyebrow": "",
    "title": "A JE GATI TË NDRYSHOSH? JO PAK... PLOTËSISHT?",
    "copy": [
      {
        "text": "Ndryshimi i vërtetë kërkon gjithçka.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "Po, jam gati →",
    "asset": "/journey-assets/fire.png",
    "assetAlt": "Minimal dark screen with faint amber haze and specks, a bright flame icon in a rounded square centered above the text, and a large glowing yellow rounded CTA button; a speaker button is at the upper right."
  },
  {
    "id": 48,
    "kind": "choice",
    "eyebrow": "Zgjidh deri në 3",
    "title": "CILAT JANË BETEJAT E TUA TË BRENDSHME?",
    "copy": [],
    "options": [
      "⏰ Disiplina",
      "☁️ Mendimet negative",
      "😰 Ankthi",
      "🔋 Energjia",
      "🎯 Qëllimi",
      "🧘 Vetmia",
      "😨 Frika",
      "🎯 Fokusi",
      "⌛ Shtyrja",
      "💪 Vetëbesimi"
    ],
    "cta": "",
    "asset": "/journey-assets/battles.png",
    "assetAlt": "Dark screen with faint amber haze and specks, a crossed-swords icon above the question, and ten rounded selectable chips arranged across three rows; a speaker button is at the upper right.",
    "maxSelections": 3,
    "requiredSelections": 1
  },
  {
    "id": 49,
    "kind": "choice-cards",
    "eyebrow": "si ndihesh realisht?",
    "title": "KUR JE VETËM ME VETEN...",
    "copy": [],
    "options": [
      "◻️ I humbur||Nuk di ku po shkoj",
      "😔 I lodhur||Energjia më ka lënë",
      "🌀 I shpërndarë||Mendja nuk qetësohet",
      "⚡ I fortë por i paqëndrueshëm||Kam momente, por nuk zgjasin",
      "◯ Bosh||Diçka mungon brenda",
      "🔥 Gati për më shumë||E di që mundem"
    ],
    "cta": "",
    "asset": "/journey-assets/self.png",
    "assetAlt": "Dark screen with faint gold haze and specks, an ornate oval mirror icon above the prompt, and six large rounded response cards in a two-row by three-column grid, each with a small icon, primary label, and subtitle; a speaker button is at the upper right.",
    "maxSelections": 1,
    "requiredSelections": 1
  },
  {
    "id": 50,
    "kind": "breathing",
    "eyebrow": "Cikli 2 nga 3",
    "title": "Merr frymë ngadalë",
    "copy": [
      {
        "text": "4",
        "style": "body"
      },
      {
        "text": "Ndjej ajrin duke mbushur mushkëritë",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "",
    "asset": "",
    "assetAlt": "Dark breathing-timer screen with faint gold haze and specks. Three small progress dots appear near the top with the middle dot highlighted, and a large gold-outlined circle contains the number 4; a speaker button is partially visible at the upper right edge.",
    "breathCycle": 1,
    "breathCount": 4,
    "breathLabel": "Merr frymë ngadalë",
    "breathHint": "Ndiej ajrin duke mbushur mushkëritë",
    "autoAdvanceMs": 4200
  },
  {
    "id": 51,
    "kind": "breathing",
    "eyebrow": "Cikli 1 nga 3",
    "title": "Mbaje",
    "copy": [
      {
        "text": "Qetësi e plotë. Prani.",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "",
    "asset": "",
    "assetAlt": "Ekran i errët me sfond yjor shumë të zbehtë. Në qendër ka një rreth të madh të artë me shkëlqim, numrin 1 brenda dhe tregues me tre pika sipër, ku pika e parë është e artë. Një ikonë pauze shfaqet pranë titullit. Butoni i zërit ndodhet lart djathtas.",
    "breathCycle": 0,
    "breathCount": 1,
    "breathLabel": "Mbaje",
    "breathHint": "Qetësi e plotë. Prani.",
    "autoAdvanceMs": 3200
  },
  {
    "id": 52,
    "kind": "breathing",
    "eyebrow": "Cikli 1 nga 3",
    "title": "Merr frymë ngadalë",
    "copy": [
      {
        "text": "Ndjej ajrin duke mbushur mushkëritë",
        "style": "body"
      }
    ],
    "options": [],
    "cta": "",
    "asset": "",
    "assetAlt": "Ekran i errët me sfond yjor shumë të zbehtë. Në qendër ka një rreth të madh me kontur të artë dhe numrin 3 brenda; sipër tij janë tre pika treguese, me të parën të artë. Një simbol i vogël frymëmarrjeje shfaqet pranë titullit. Butoni i zërit ndodhet lart djathtas.",
    "breathCycle": 0,
    "breathCount": 3,
    "breathLabel": "Merr frymë ngadalë",
    "breathHint": "Ndiej ajrin duke mbushur mushkëritë",
    "autoAdvanceMs": 4200
  },
  {
    "id": 53,
    "kind": "cta",
    "eyebrow": "",
    "title": "Ti je këtu sepse diçka brenda teje të thërret...",
    "copy": [
      {
        "text": "Kjo rrugë kërkon vëmendje të plotë.",
        "style": "lead"
      }
    ],
    "options": [],
    "cta": "Jam gati",
    "asset": "/journey-assets/sword.png",
    "assetAlt": "Shpatë vertikale e ndriçuar me dritë të artë"
  }
];
