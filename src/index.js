const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const pngToIco = require("png-to-ico");
const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);
const os = require("os");

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

async function generateIcon(sourceIcon, size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  const image = await loadImage(sourceIcon);
  ctx.drawImage(image, 0, 0, size, size);
  return canvas.toBuffer("image/png");
}

async function generateIcons(inputPath, outputPath) {
  try {
    // Create output directory
    fs.mkdirSync(outputPath, { recursive: true });

    // Generate macOS icons (ICNS) only if on macOS
    if (os.platform() === "darwin") {
      const iconSetDir = path.join(outputPath, "icon.iconset");
      fs.mkdirSync(iconSetDir, { recursive: true });

      // Generate the 10 layers for macOS
      for (const spec of MACOS_SPECS) {
        const iconBuffer = await generateIcon(inputPath, spec.size);
        fs.writeFileSync(path.join(iconSetDir, spec.filename), iconBuffer);
      }

      // Create ICNS file
      const icnsOutputPath = path.join(outputPath, "icon.icns");
      await execAsync(
        `iconutil -c icns -o "${icnsOutputPath}" "${iconSetDir}"`
      );

      // Remove temporary iconset folder
      fs.rmSync(iconSetDir, { recursive: true });
      console.log("- icon.icns (macOS)");
    } else {
      console.log(
        "Skipping .icns creation: iconutil is only available on macOS"
      );
    }

    // Generate Windows icon (ICO)
    await pngToIco(inputPath)
      .then((icoBuffer) => {
        fs.writeFileSync(path.join(outputPath, "icon.ico"), icoBuffer);
      })
      .catch((error) => {
        console.error("Error generating .ico file:", error);
      });

    // Generate Linux icon (512x512 PNG)
    const linuxIconBuffer = await generateIcon(inputPath, 512);
    fs.writeFileSync(path.join(outputPath, "icon.png"), linuxIconBuffer);

    console.log("Icon generation complete. Generated:");
    if (os.platform() === "darwin") {
      console.log("- icon.icns (macOS)");
    }
    console.log("- icon.ico (Windows)");
    console.log("- icon.png (Linux)");
  } catch (error) {
    console.error("Error generating icons:", error);
    throw error; // Re-throw the error so cli.js can handle it
  }
}

// Only run directly if this file is being executed directly
if (require.main === module) {
  const SOURCE_ICON = "../Content.png";
  const OUTPUT_DIR = "build";
  generateIcons(SOURCE_ICON, OUTPUT_DIR).catch(console.error);
}

module.exports = generateIcons;
