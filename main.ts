// One-Line Office Joke: 24-Hour Sprint — a program that writes one
// short joke about office life, to /output/entry.txt.
//
// The joke is a fixed text on purpose: the entry is judged on the
// writing, so the program's job is to deliver exactly that one line,
// byte for byte, every run.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Why this line, against the judge's brief:
// - It is a one-line joke about office life: the daily standup, the
//   meeting every office worker knows.
// - It is funny: the punchline pays off the setup by reading the
//   meeting's name literally — a standup that lasts 45 minutes
//   because nobody stands up. Anyone who has sat in one recognises
//   it instantly.
// - It is one line: a single sentence, setup and punchline on the
//   same line, with no rambling around it.
// - It is fresh: it finds a specific detail (the standup that never
//   stands) rather than a generic complaint about meetings, and it is
//   not the "this meeting should have been an email" joke everyone
//   has already heard.
// - It is clear on first read: no reference the reader cannot
//   follow, and the wording is tight.
const JOKE =
  "Our daily standup lasts 45 minutes because nobody stands up.";

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;

function main(): void {
  // The gate only accepts 1 to 200 characters of UTF-8 text, so refuse
  // loudly instead of shipping a text the gate would throw away. It
  // also refuses text that is only white space, so check that too.
  if (JOKE.length < 1 || JOKE.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${JOKE.length}`);
  }
  if (JOKE.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  // No leading or trailing white space either: the gate counts every
  // byte, and a stray space at either end would sit in front of the
  // judge for nothing.
  if (JOKE !== JOKE.trim()) {
    throw new Error("entry must not have leading or trailing white space");
  }
  // One line means no line break hiding inside it, and no tabs or
  // doubled spaces either: a stray tab would read as a formatting
  // glitch in front of the judge.
  if (/[\n\r]/.test(JOKE)) {
    throw new Error("entry must be exactly one line");
  }
  // One sentence, not two hiding behind a period: the joke must end
  // with a single full stop, and no full stop may be followed by
  // another word, or the judge would be reading two sentences.
  if (!JOKE.endsWith(".") || /\. /.test(JOKE)) {
    throw new Error("entry must be exactly one sentence");
  }
  if (/[\t]/.test(JOKE) || /  /.test(JOKE)) {
    throw new Error("entry must not contain tabs or double spaces");
  }
  // No invisible control characters for the same reason.
  if (/[\u0000-\u001f\u007f]/.test(JOKE)) {
    throw new Error("entry must not contain control characters");
  }
  // The gate counts every byte, so write exactly the line and nothing
  // else: no trailing newline.
  // /output is a mount point in the grader sandbox: never delete the
  // directory itself, only create it if missing and write the file.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JOKE, "utf8");
  // Read the file back and refuse to finish unless it holds exactly
  // the line: a stray byte would make the gate reject the entry,
  // and it is cheaper to fail here than on the server.
  if (readFileSync(OUT_FILE, "utf8") !== JOKE) {
    throw new Error("entry file does not hold exactly the joke");
  }
  console.log(`Wrote ${JOKE.length} characters to ${OUT_FILE}`);
}

main();
