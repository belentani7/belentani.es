const sharp = require('sharp');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets');

async function processImages() {
  console.log('Processing images with Sharp...\n');
  const imageDir = path.join(ASSETS_DIR, 'images');
  const files = fs.readdirSync(imageDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));

  for (const file of files) {
    const input = path.join(imageDir, file);
    const name = path.parse(file).name;

    try {
      await sharp(input)
        .webp({ quality: 85, effort: 6 })
        .toFile(path.join(imageDir, `${name}.webp`));
      console.log(`✓ ${file} → ${name}.webp`);

      await sharp(input)
        .avif({ quality: 70, effort: 9 })
        .toFile(path.join(imageDir, `${name}.avif`));
      console.log(`✓ ${file} → ${name}.avif`);

      const widths = [400, 800, 1200, 1920];
      for (const w of widths) {
        await sharp(input)
          .resize(w, null, { withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(path.join(imageDir, `${name}-${w}w.webp`));
      }
      console.log(`✓ ${file} → responsive variants`);
    } catch (e) {
      console.error(`✗ ${file}:`, e.message);
    }
  }
}

async function processVideo() {
  console.log('\nProcessing video with FFmpeg...\n');
  const videoDir = path.join(ASSETS_DIR, 'video');
  const files = fs.readdirSync(videoDir).filter(f => /\.(mp4|mov|webm)$/i.test(f));

  for (const file of files) {
    const input = path.join(videoDir, file);
    const name = path.parse(file).name;

    try {
      execSync(`ffmpeg -i "${input}" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus -b:a 96k "${path.join(videoDir, `${name}.webm`)}"`, { stdio: 'inherit' });
      console.log(`✓ ${file} → ${name}.webm`);

      execSync(`ffmpeg -i "${input}" -vf "select=eq(n\\,0)" -q:v 2 "${path.join(videoDir, `${name}-poster.webp`)}"`, { stdio: 'inherit' });
      console.log(`✓ ${file} → ${name}-poster.webp`);
    } catch (e) {
      console.error(`✗ ${file}:`, e.message);
    }
  }
}

async function main() {
  await processImages();
  await processVideo();
  console.log('\nAll assets processed!');
}

main();