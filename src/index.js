const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

// Configuration
const SOURCE_ICON = "Content.png";
const OUTPUT_DIR = "build";

// MacOS icon specifications
const MACOS_SPECS = [
  { size: 16, filename: "icon_16x16.png" },
  { size: 32, filename: "icon_16x16@2x.png" },
  { size: 32, filename: "icon_32x32.png" },
  { size: 64, filename: "icon_32x32@2x.png" },
  { size: 128, filename: "icon_128x128.png" },
  { size: 256, filename: "icon_128x128@2x.png" },
  { size: 256, filename: "icon_256x256.png" },
  { size: 512, filename: "icon_256x256@2x.png" },
  { size: 512, filename: "icon_512x512.png" },
  { size: 1024, filename: "icon_512x512@2x.png" },
];

async function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  const image = await loadImage(SOURCE_ICON);
  ctx.drawImage(image, 0, 0, size, size);
  return canvas.toBuffer("image/png");
}

async function generateIcons() {
  try {
    // Create output directory
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    // Generate macOS icons (ICNS)
    const iconSetDir = path.join(OUTPUT_DIR, "icon.iconset");
    fs.mkdirSync(iconSetDir, { recursive: true });

    // Generate the 10 layers for macOS
    for (const spec of MACOS_SPECS) {
      const iconBuffer = await generateIcon(spec.size);
      fs.writeFileSync(path.join(iconSetDir, spec.filename), iconBuffer);
    }

    // Create ICNS file
    const icnsOutputPath = path.join(OUTPUT_DIR, "icon.icns");
    await execAsync(`iconutil -c icns -o "${icnsOutputPath}" "${iconSetDir}"`);

    // Remove temporary iconset folder
    fs.rmSync(iconSetDir, { recursive: true });

    // Generate Windows icon (256x256 PNG)
    const windowsIconBuffer = await generateIcon(256);
    fs.writeFileSync(
      path.join(OUTPUT_DIR, "icon.png"),
      //Convert this to Ico later
      windowsIconBuffer
    );

    // Generate Linux icon (512x512 PNG)
    const linuxIconBuffer = await generateIcon(512);
    fs.writeFileSync(
      path.join(OUTPUT_DIR, "icon_512x512.png"),
      linuxIconBuffer
    );

    console.log("Icon generation complete. Generated:");
    console.log("- icon.icns (macOS)");
    console.log("- icon.png (Windows - convert to ICO)");
    console.log("- icon_512x512.png (Linux)");
  } catch (error) {
    console.error("Error generating icons:", error);
  }
}

if (require.main === module) {
  generateIcons().catch(console.error);
}

module.exports = generateIcons;
