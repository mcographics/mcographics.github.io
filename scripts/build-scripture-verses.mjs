import { readFile, writeFile } from "node:fs/promises";

const sourceUrl = new URL("../content/scripture/encouragement.md", import.meta.url);
const outputUrl = new URL("../app/scripture-verses.json", import.meta.url);
const source = await readFile(sourceUrl, "utf8");

const verses = [...source.matchAll(/^\d+\.\s+\*\*(.*?)\*\*\s+—\s+“(.*)”\s*$/gm)].map((match) => {
  const label = match[1].trim();
  const wordsOfChrist = label.startsWith("✝ JESUS — ");
  return {
    reference: wordsOfChrist ? label.replace("✝ JESUS — ", "") : label,
    text: match[2].trim(),
    wordsOfChrist,
  };
});

const christCount = verses.filter((verse) => verse.wordsOfChrist).length;
if (verses.length !== 100 || christCount !== 37) {
  throw new Error(`Expected 100 verses and 37 words-of-Christ entries; found ${verses.length} and ${christCount}.`);
}

await writeFile(outputUrl, `${JSON.stringify(verses, null, 2)}\n`, "utf8");
console.log(`Prepared ${verses.length} ticker verses (${christCount} words-of-Christ entries).`);
