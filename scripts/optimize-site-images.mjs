import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(projectRoot, "public");
const checkOnly = process.argv.includes("--check");
const homeWidths = [480, 1200];
const aboutBackground = {
  source: "/about/luminous-gold-veins-on-black-marble-3x.jpg",
  outputBase: "optimized/about/luminous-gold-veins-on-black-marble",
  widths: [821, 1440, 1920, 2463],
};
const brandImage = {
  source: "/brand/majestic-lion.png",
  outputBase: "optimized/brand/majestic-lion",
  widths: [48, 96, 144, 512, 1024, 1920],
};
const socialCard = {
  source: "/og.png",
  output: "optimized/og.jpg",
  width: 1672,
  height: 941,
};

function homeOutputPath(source, width) {
  const parsed = path.parse(source.slice(1));
  return path.join("optimized", "home", parsed.dir, `${parsed.name}-${width}.webp`);
}

async function prepareVariants(source, outputs, quality) {
  const sourceFile = path.join(publicRoot, source.slice(1));
  const sourceMetadata = await sharp(sourceFile).metadata();
  const sourceSize = (await fs.stat(sourceFile)).size;
  if (!sourceMetadata.width) throw new Error(`Could not read image dimensions: ${source}`);

  for (const { width, relativePath } of outputs) {
    if (width > sourceMetadata.width) {
      throw new Error(`${source} is only ${sourceMetadata.width}px wide; cannot generate the ${width}px variant.`);
    }

    const destination = path.join(publicRoot, relativePath);
    if (checkOnly) {
      const outputMetadata = await sharp(destination).metadata();
      const outputSize = (await fs.stat(destination)).size;
      if (outputMetadata.width !== width) throw new Error(`Incorrect width for ${relativePath}: expected ${width}px.`);
      if (outputSize >= sourceSize) throw new Error(`${relativePath} is not smaller than its original image.`);
      continue;
    }

    await fs.mkdir(path.dirname(destination), { recursive: true });
    await sharp(sourceFile)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 5, alphaQuality: 100 })
      .toFile(destination);
  }
}

async function prepareSocialCard() {
  const sourcePath = path.join(publicRoot, socialCard.source.slice(1));
  const outputPath = path.join(publicRoot, socialCard.output);
  const sourceSize = (await fs.stat(sourcePath)).size;

  if (checkOnly) {
    const outputMetadata = await sharp(outputPath).metadata();
    const outputSize = (await fs.stat(outputPath)).size;
    if (outputMetadata.format !== "jpeg" || outputMetadata.width !== socialCard.width || outputMetadata.height !== socialCard.height) {
      throw new Error(`${socialCard.output} must be a ${socialCard.width}x${socialCard.height} JPEG.`);
    }
    if (outputSize >= sourceSize) throw new Error(`${socialCard.output} is not smaller than its original image.`);
    return;
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await sharp(sourcePath).jpeg({ quality: 88, mozjpeg: true }).toFile(outputPath);
}

const homepageSource = await fs.readFile(path.join(projectRoot, "app", "page.tsx"), "utf8");
const homeImages = [...new Set(
  [...homepageSource.matchAll(/image:\s*["'](\/projects\/[^"']+\.(?:png|jpe?g))["']/gi)].map((match) => match[1]),
)];
if (homeImages.length === 0) throw new Error("No homepage image paths were found in app/page.tsx.");

for (const source of homeImages) {
  await prepareVariants(source, homeWidths.map((width) => ({ width, relativePath: homeOutputPath(source, width) })), 88);
}

await prepareVariants(
  aboutBackground.source,
  aboutBackground.widths.map((width) => ({
    width,
    relativePath: `${aboutBackground.outputBase}-${width}.webp`,
  })),
  90,
);

await prepareVariants(
  brandImage.source,
  brandImage.widths.map((width) => ({
    width,
    relativePath: `${brandImage.outputBase}-${width}.webp`,
  })),
  90,
);
await prepareSocialCard();

const action = checkOnly ? "Verified" : "Generated";
console.log(`${action} ${homeImages.length} homepage images at ${homeWidths.join("px and ")}px, ${aboutBackground.widths.length} About background variants, ${brandImage.widths.length} brand logo variants, and the optimized social card.`);
