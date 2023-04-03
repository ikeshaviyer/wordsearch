//JAVA SCRIPT VERSION OF PYTHON FILE
var splitGraphemeClusters = require('@stdlib/string-split-grapheme-clusters');
const { range, shuffle } = require("lodash");
const { countBy } = require("lodash");
const { table } = require("table");

const language = "en";
// const language = "sa";

let words, n;
if (language === "sa") {
  words = `कर्म 
  भक्ति 
  धर्म 
  सत्यं 
  शान्ति
  भक्ति 
  अहिंसा 
  सर्वं 
  रामदूत
  एकं 
  हनुमान्
  लक्ष्मणः`;
  n = 10;
} else if (language === "en") {
  words = `Karma
  Bhakti
  Dharma
  Satyam
  Shanti
  Bhakti
  Ahimsa
  Sarvam
  Ramdoot
  Ekam
  Hanuman
  Lakshmana`;
  n = 12;
}

words = words.split(/\s+/);

const deft = ".";
const wordsearch = range(n).map((i) => range(n).map((j) => deft));

function get_string(array) {
  let html = '<table>';

  for (let i = 0; i < array.length; i++) {
    html += '<tr>';

    for (let j = 0; j < array[i].length; j++) {
      html += '<td>' + array[i][j] + '</td>';
    }

    html += '</tr>';
  }

  html += '</table>';
  return html;
}

function display() {
  console.log(get_string(wordsearch));
}

function get_dir(i0, j0, i1, j1) {
  let di = 0;
  if (i0 !== i1) {
    di = Math.floor((i1 - i0) / Math.abs(i1 - i0));
  }

  let dj = 0
  if (j0 !== j1) {
    dj = Math.floor((j1 - j0) / Math.abs(j1 - j0));
  }
  return [di, dj]
}

function get_length(i0, j0, i1, j1) {
  return Math.max(Math.abs(i1 - i0) + 1, Math.abs(j1 - j0) + 1);
}

function check_bounds(i0, j0, i1, j1) {
  for (let x in [i0, j0, i1, j1]) {
    //maybe add console.assert instead if errors happen
    console.assert(x >= 0);
    console.assert(x < n);
  }
}

function free(i0, j0, i1, j1) {
  // determines if the segment [(i0,j0), (i1,j1)] is not taken by other characters
  const [di, dj] = get_dir(i0, j0, i1, j1);
  const length = get_length(i0, j0, i1, j1);
  console.log("dir:", di, dj);
  console.log(`i0: ${i0}, j0: ${j0}, i1: ${i1}, j1: ${j1}`);
  console.log("length:", length);
  for (let idx = 0; idx < length; idx++) {
    if (wordsearch[i0 + idx * di][j0 + idx * dj] !== deft) {
      return false;
    }
  }
  return true;
}


function write(i0, j0, i1, j1, chars) {
  const [di, dj] = get_dir(i0, j0, i1, j1);
  const length = get_length(i0, j0, i1, j1);
  if (chars.length !== length) {
    throw new Error("Assertion failed: len(chars) == length");
  }

  for (let idx = 0; idx < length; idx++) {
    if (wordsearch[i0 + idx * di][j0 + idx * dj] !== deft) {
      throw new Error("Assertion failed: wordsearch[i0+idx*di][j0+idx*dj] == deft");
    }
    wordsearch[i0 + idx * di][j0 + idx * dj] = chars[idx];
  }
}

let satisfiable = true;

const orient_counts = {};

for (const w of words) {
  let chars = Array.from(w.toUpperCase());
  const numChars = chars.length;
  console.log(chars);
  let cnt = 0;
  const threshold = 1000;

  while (true) {
    cnt += 1;
    if (cnt > threshold) {
      satisfiable = false;
      break;
    }

    let done = false;
    let orient = Math.floor(Math.random() * 31);
    let flip = Math.floor(Math.random() * 2);
    if (flip === 1) {
      chars = chars.reverse();
    }
    if (orient <= 11) {
      // horizontal
      i0 = Math.floor(Math.random() * (n));
      i1 = i0;
      j0 = Math.floor(Math.random() * (n - numChars));
      j1 = j0 + numChars - 1;
    } else if (orient <= 22) {
      // vertical
      i0 = Math.floor(Math.random() * (n - numChars));
      i1 = i0 + numChars - 1;
      j0 = Math.floor(Math.random() * (n));
      j1 = j0;
    } else if (orient <= 26) {
      // diagonal from bottom left to top right
      i0 = Math.floor(Math.random() * (n - numChars + 1) + numChars - 1);
      j0 = Math.floor(Math.random() * (n - numChars));
      i1 = i0 - numChars + 1;
      j1 = j0 + numChars - 1;
    } else if (orient <= 30) {
      // diagonal from top left to bottom right
      i0 = Math.floor(Math.random() * (n - numChars));
      j0 = Math.floor(Math.random() * (n - numChars));
      i1 = i0 + numChars - 1;
      j1 = j0 + numChars - 1;
    }

    check_bounds(i0, j0, i1, j1); // Assuming check_bounds function is already defined in JavaScript

    if (free(i0, j0, i1, j1)) {
      if (numChars !== chars.length) {
        throw new Error("Assertion failed: numChars == len(chars)");
      }
      if (!orient_counts[orient]) {
        orient_counts[orient] = 0;
      }
      orient_counts[orient] += 1;
      write(i0, j0, i1, j1, chars); // Assuming write function is already defined in JavaScript
      break;
    }
  }
}

if (!satisfiable) {
  display();
  console.log("Word search not creatable given the current program");
} else {
  display();
}
console.log(`orient counts: ${JSON.stringify(orient_counts)}`);


let answer = get_string(wordsearch)

function random_letter() {
  if (language === "en") {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 26));
  }
  const vowels = ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ॠ", "ऌ", "ॡ", "ए", "ऐ", "ओ", "औ"];
  const consonants = ["क", "ख", "ग", "घ", "ङ", "च", "छ", "ज", "झ", "ञ", "ट", "ठ", "ड", "ढ", "ण", "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य", "र", "ल", "ळ", "व", "श", "ष", "स", "ह"];
  const combiners = ["ा", "ि", "ी", "ु", "ू", "ृ", "ॄ", "े", "ै", "ो", "ौ", "ौ", "ं", "ः", "्"];
  let l = Math.floor(Math.random() * 11);
  let char;
  if (l <= 3) {
    char = vowels[Math.floor(Math.random() * vowels.length)];
  } else {
    char = consonants[Math.floor(Math.random() * consonants.length)];
    l = Math.floor(Math.random() * 11);
    if (l <= 5) {
      char += combiners[Math.floor(Math.random() * combiners.length)];
    }
  }
  return char;
}

for (let i = 0; i < wordsearch.length; i++) {
  for (let j = 0; j < wordsearch[i].length; j++) {
    if (wordsearch[i][j] === deft) {
      wordsearch[i][j] = random_letter();
    }
  }
}

const fs = require("fs");
const html = "<style>table, td {border: 0; padding: 5px 10px} th {display: none}</style>" +
  "<h1>Puzzle:</h1><br><br>" + get_string(wordsearch) + "<br><br><h1>Words:</h1><br><br>" +
  "<br>\n" + words.join("<br>\n") + "<br><br><h1>Answer:</h1><br><br>" + answer;
fs.writeFileSync("output.html", html, { encoding: "utf-8" });
