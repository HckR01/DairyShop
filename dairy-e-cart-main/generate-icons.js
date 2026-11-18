// Script to generate PWA icons from the existing apple-icon.png
// Run: node generate-icons.js

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceIcon = path.join(__dirname, 'public', 'apple-icon.png');
const iconsDir = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Try using sharp if available, else copy the source as fallback
async function generateIcons() {
  try {
    const sharp = require('sharp');
    console.log('Using sharp to resize icons...');
    for (const size of sizes) {
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      await sharp(sourceIcon).resize(size, size).toFile(outputPath);
      console.log(`✓ Generated ${size}x${size} icon`);
    }
    console.log('\n✅ All PWA icons generated successfully!');
  } catch (e) {
    console.warn('sharp not available, copying source icon as fallback...');
    for (const size of sizes) {
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      fs.copyFileSync(sourceIcon, outputPath);
      console.log(`✓ Copied icon-${size}x${size}.png`);
    }
    console.log('\n⚠️  Icons copied (not resized). Install sharp for proper resizing: npm install sharp');
  }
}

generateIcons();
