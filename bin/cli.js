#!/usr/bin/env node

const generateIcons = require("../src/index");
const path = require("path");

const argv = require("yargs")
  .usage("Usage: $0 -i [input] -o [output]")
  .option("i", {
    alias: "input",
    describe: "Input image path",
    type: "string",
    demandOption: true,
  })
  .option("o", {
    alias: "output",
    describe: "Output directory path",
    type: "string",
    demandOption: true,
  })
  .help("h")
  .alias("h", "help").argv;

const run = async () => {
  try {
    const inputPath = path.resolve(process.cwd(), argv.input);
    const outputPath = path.resolve(process.cwd(), argv.output);

    await generateIcons(inputPath, outputPath);
    console.log("Icons generated successfully!");
    console.log(`Output directory: ${outputPath}`);
    console.log("Generated files:");
    console.log("- icon.icns (macOS)");
    console.log("- icon.png (Windows - 256x256)");
    console.log("- icon_512x512.png (Linux)");
  } catch (error) {
    console.error("Error generating icons:", error.message);
    process.exit(1);
  }
};

run();
