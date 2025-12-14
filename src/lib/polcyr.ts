// Source: https://github.com/acipenserSturio/polcyr
// Translated to TS

const alphabet = {
  b: "б",
  c: "ц",
  č: "ч",
  d: "д",
  f: "ф",
  g: "г",
  ɣ: "ғ",
  h: "х",
  j: "ј",
  k: "к",
  l: "л",
  m: "м",
  n: "н",
  p: "п",
  r: "р",
  s: "с",
  š: "ш",
  t: "т",
  w: "в",
  z: "з",
  ž: "ж",
  // "v": "в",
  // "q": "кв",
  // "x": "кс",
};

// converts polish latin to cyrillic
function encode(w: string) {
  console.log(`0: ${w}`);
  // 0. Unusual combinations sometimes occur at morpheme boundaries,
  // particularly with pół-i, try-a, przy-a.
  // Let's use a hyphen in Cyrillic.
  w = w.replaceAll(/(?<=pół)(?=i)/g, "-");
  w = w.replaceAll(/(?<=rzy)(?=[ao])/g, "-");
  // w = w.replaceAll(/(?<=^od)(?=i)/g, "-")
  // w = w.replaceAll(/(?<=^pod)(?=i)/g, "-")
  // w = w.replaceAll(/(?<=^nad)(?=i)/g, "-")
  // w = w.replaceAll(/(?<=^post)(?=i)/g, "-")
  // w = w.replaceAll(/(?<=^przed)(?=i)/g, "-")

  // 1. to avoid wrong matches, let us convert digraph consonants
  // to a less error-prone view:
  w = w.replaceAll(/(?<!c)h/g, "ɣ");
  w = w.replaceAll("ch", "h");
  w = w.replaceAll("cz", "č");
  w = w.replaceAll("sz", "š");
  w = w.replaceAll("ż", "ž"); // just for letter consistency
  w = w.replaceAll(/rz(?!i)/g, "ř"); // exclude rzi: its actually r-zi

  // 2. Sequences of type "dia, tia, ria"
  // are treated as underlying "dyja, tyja, ryja".
  w = w.replaceAll(/(?<=[dtr])i(?=[aeioóuyąę])/g, "yj");
  w = w.replaceAll(/li(?=[aeioóuyąę])/g, "łyj");

  // 2.1. some <i> in Polish is borrowed, and doesn't trigger palatalisation.
  // We will mark the non-palatalisation with a diaeresis.
  // Unfortunately, this looks like <ji> to a Ukrainian speaker.
  w = w.replaceAll(/(?<=[dtr])i/g, "ї");

  console.log(`3: ${w}`);
  // 3. <i> is ь with vowels, and ьy /ʲɨ/ elsewhere
  w = w.replaceAll(/i(?![aeioóuyąę])/g, "ьy");
  w = w.replaceAll("i", "ь");

  console.log(`4: ${w}`);
  // 4. Intervocalic j will also be represented by the "soft" vowel series.
  // But not before nasal vowels - they will always be "hard".
  w = w.replaceAll(/(?<=[aeoóuyąę])j(?=[aeoóuy])/g, "ь");

  console.log(`5: ${w}`);
  // 5. While we are at it, split apart the palatalisation
  // from acute consonants.
  w = w.replaceAll("ć", "tь");
  w = w.replaceAll("ń", "nь");
  w = w.replaceAll("ś", "sь");
  w = w.replaceAll("ź", "zь");

  console.log(`6: ${w}`);
  // 6. Polish treats lь vs l as orthographic l vs ł,
  // and rь as rz. Let's undo that
  w = w.replaceAll(/l(?![ьӥ])/g, "lь"); // Have to be fancy to avoid lььy and lьӥ
  w = w.replaceAll("ł", "l");
  w = w.replaceAll("ř", "rь");

  console.log(`7: ${w}`);
  // 7. Polish prefers affricate representation of /tj dj/g, let's undo it
  w = w.replaceAll("cь", "tь");
  w = w.replaceAll("dzь", "dь");

  console.log(`8: ${w}`);
  // 8. *sv *st *zd was palatalised in its entirety,
  // so lets remove the redundant ь.
  w = w.replaceAll(/(?<=s)ь(?=wь)/g, "");
  // w = w.replaceAll(/(?<=z)ь(?=wь)/g, "")
  w = w.replaceAll(/(?<=s)ь(?=tь)/g, "");
  // w = w.replaceAll(/(?<=z)ь(?=dь)/g, "")

  // 9. Let's insert historic palatalisation for retroflexes.
  // w = w.replaceAll("č", "čь")
  // w = w.replaceAll("š", "šь")
  // w = w.replaceAll("ž", "žь")
  // j at the beginnings of words will be turned into ь,
  // for ease of vowel representation.
  w = w.replaceAll(/^j/g, "ь");

  // 9.4. For e vs ie:
  // add softness for all "pairless" consonants
  // don't need to do k g because Polish already has
  // todo: dz
  // w = re.sub(r"(?<=[čšžchɣ])(?=[e])", "ь")

  // 9.5. When sibilants are followed by a nasal vowel,
  // treat the sibilant as soft.
  w = w.replaceAll(/(?<=[čšž])(?=[ęą])/g, "ь");

  console.log(`10: ${w}`);
  // 10. Now, let's cyrillicise the vowels:
  w = w.replaceAll("ьa", "іа");
  w = w.replaceAll("ьe", "є");
  w = w.replaceAll("ьo", "іо");
  w = w.replaceAll("ьu", "ю");
  w = w.replaceAll("ьó", "іо́");
  w = w.replaceAll("ьę", "я");
  w = w.replaceAll("ьą", "я́");
  w = w.replaceAll("ьy", "і");

  w = w.replaceAll("a", "а");
  w = w.replaceAll("e", "е");
  w = w.replaceAll("u", "оу");
  w = w.replaceAll("o", "о");
  w = w.replaceAll("ó", "о́");
  w = w.replaceAll("ę", "у");
  w = w.replaceAll("ą", "у́");
  w = w.replaceAll("y", "и");

  // Handle riV => рjV ?
  // w = re.sub("ri(?=[aeiouyąę])", "rj")

  // 11. Finally, let's use cyrillic consonants:
  for (const [lat, cyr] of Object.entries(alphabet)) {
    w = w.replaceAll(lat, cyr);
  }

  // 12. Add щ for шч
  w = w.replaceAll("шч", "щ");

  console.log(`13: ${w}`);
  // 13. Word initial оу,
  // оу thats part of an e- diphthong -> у
  w = w.replaceAll(/((?<=^)|(?<=[ае]))оу(?!\u0301)/g, "у");

  // 14. Shorten іа before vowels to я
  w = w.replaceAll(/(?<=[іиєеяаоую\u0301])іа/g, "я");

  console.log(`end: ${w}`);
  return w;
}

// converts polish cyrillic to latin
function decode(w: string) {
  console.log(`14: ${w}`);
  // 14. я before vowels is actually іа
  w = w.replaceAll(/(?<=[іиєеяаоую\u0301])я/g, "іа");

  console.log(`13: ${w}`);
  // 13. Word initial у,
  // у thats part of a diphthong -> оу
  w = w.replaceAll(/((?<=^)|(?<=[ае]))у(?!\u0301)/g, "оу");

  console.log(`12: ${w}`);
  // 12. Remove щ for шч
  w = w.replaceAll("щ", "шч");

  console.log(`11: ${w}`);
  // 11. First, let's use latin consonants:
  for (const [lat, cyr] of Object.entries(alphabet)) {
    w = w.replaceAll(cyr, lat);
  }

  console.log(`10: ${w}`);
  // 10. De - cyrillicise the vowels:
  w = w.replaceAll(/оу(?!\u0301)/g, "u"); // avoid misinterpretations with io, ą

  w = w.replaceAll("іо́", "ьó"); // trigraph
  w = w.replaceAll("іа", "ьa");
  w = w.replaceAll("іо", "ьo");
  w = w.replaceAll("я́", "ьą"); // digraphs have to go first
  w = w.replaceAll("є", "ьe");
  w = w.replaceAll("ю", "ьu");
  w = w.replaceAll("я", "ьę");
  w = w.replaceAll("і", "ьy");

  w = w.replaceAll("о́", "ó");
  w = w.replaceAll("у́", "ą"); // digraphs have to go first
  w = w.replaceAll("а", "a");
  w = w.replaceAll("е", "e");
  w = w.replaceAll("о", "o");
  w = w.replaceAll("у", "ę");
  w = w.replaceAll("и", "y");

  // 9.5.Remove softness from sibilants before nasal vowels.
  w = w.replaceAll(/(?<=[čšž])ь(?=[ęą])/g, "");

  // 9.4.For e vs ie:
  // remove softness for all "pairless" consonants
  // don't need to do k g because Polish already has
  // todo: dz
  // w = w.replaceAll(/(?<=[čšžchɣ])ь(?=[e])/g, "")

  console.log(`9: ${w}`);
  // 9. Word - initial ь is j:
  w = w.replaceAll(/^ь/g, "j");

  console.log(`8: ${w}`);
  // 8. Re - insert implicit palatalisation:
  w = w.replaceAll(/(?<=s)(?=wь)/g, "ь");
  // w = w.replaceAll(/(?<=z)(?=wь)/g, "ь")
  w = w.replaceAll(/(?<=s)(?=tь)/g, "ь");
  // w = w.replaceAll(/(?<=z)(?=dь)/g, "ь")

  console.log(`7: ${w}`);
  // 7. Polish prefers affricate representation of / tj dj /:
  w = w.replaceAll("tь", "cь");
  w = w.replaceAll("dь", "dzь");

  console.log(`6: ${w}`);
  // 6. Use Polish l vs ł, and rz:
  w = w.replaceAll(/l(?![ьӥ])/g, "ł");
  w = w.replaceAll("lьy", "li"); // erroneously goes to ly otherwise
  w = w.replaceAll("lь", "l");
  w = w.replaceAll("rь", "ř");

  console.log(`5: ${w}`);
  // 5. When not followed by a vowel, use diacritic for soft consonants:
  w = w.replaceAll(/cь(?![aeoóuyąę]|ьy)/g, "ć");
  w = w.replaceAll(/nь(?![aeoóuyąę]|ьy)/g, "ń");
  w = w.replaceAll(/sь(?![aeoóuyąę]|ьy)/g, "ś");
  w = w.replaceAll(/zь(?![aeoóuyąę]|ьy)/g, "ź");

  console.log(`4: ${w}`);
  // 4. Bring back j intervocalically
  // except before nasal vowels, where it is already there:
  w = w.replaceAll(/(?<=[aeoóuyąę])ь(?=[aeoóuy])/g, "j");

  console.log(`3: ${w}`);
  // 3. Re - establish ь -> i
  w = w.replaceAll(/ьy?/g, "i");
  w = w.replaceAll(/jy/g, "i"); // after a vowel!

  // 2.1.Re - interpret non - palatalising i:
  w = w.replaceAll("ї", "i");

  console.log(`2: ${w}`);
  // 2. Sequences of underlying type "dyja, tyja, ryja"
  // are treated as "dia, tia, ria".
  w = w.replaceAll(/(?<=[dtr])yj(?=[aeioóuyąę])/g, "i");
  w = w.replaceAll(/łyj(?=[aeioóuyąę])/g, "li");

  console.log(`1: ${w}`);
  // 1. Replace Czech letters with Polish digraphs
  w = w.replaceAll("h", "ch");
  w = w.replaceAll("ɣ", "h");
  w = w.replaceAll("č", "cz");
  w = w.replaceAll("š", "sz");
  w = w.replaceAll("ž", "ż"); // just for letter consistency
  w = w.replaceAll("ř", "rz");

  // 0. Remove morpheme boundary hyphens.
  w = w.replaceAll(/(?<=pół)-(?=i)/g, "");
  w = w.replaceAll(/(?<=rzy)-(?=[ao])/g, "");
  // w = w.replaceAll(/(?<=^od)-(?=i)/g, "")
  // w = w.replaceAll(/(?<=^pod)-(?=i)/g, "")
  // w = w.replaceAll(/(?<=^nad)-(?=i)/g, "")
  // w = w.replaceAll(/(?<=^post)-(?=i)/g, "")
  // w = w.replaceAll(/(?<=^przed)-(?=i)/g, "")
  return w;
}

// https://medium.com/@sankarums/convert-a-string-to-title-case-in-typescript-742bfd869cb9
// i couldn't be bothered
function toTitleCase(str: any) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word: any) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function convert(text: string) {
  let cyrillics: string[] = [];
  let tokens = text.trim().split(" ");
  for (let token of tokens) {
    let capd = token[0].toUpperCase() == token[0];
    token = token.toLowerCase();
    let cyr = encode(token);
    if (capd) {
      cyr = toTitleCase(cyr);
    }
    cyrillics = [...cyrillics, cyr];
  }

  return cyrillics.join(" ");
}

export function revert(text: string) {
  let lacinka: string[] = [];
  let tokens = text.trim().split(" ");
  for (let token of tokens) {
    let capd = token[0].toUpperCase() == token[0];
    token = token.toLowerCase();
    let cyr = decode(token);
    if (capd) {
      cyr = toTitleCase(cyr);
    }
    lacinka = [...lacinka, cyr];
  }
  return lacinka.join(" ");
}
