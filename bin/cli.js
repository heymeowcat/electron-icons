#!/usr/bin/env node

const generateIcons = require("../src/index");
const path = require("path");
const fs = require("fs");
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
    // Resolve paths relative to the current working directory
    const inputPath = path.resolve(process.cwd(), argv.input);
    const outputPath = path.resolve(process.cwd(), argv.output);

    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }

    // Create output directory if it doesn't exist
    fs.mkdirSync(outputPath, { recursive: true });

    // Check for write permissions
    try {
      fs.accessSync(path.dirname(outputPath), fs.constants.W_OK);
    } catch (error) {
      throw new Error(
        `No write permission for output directory: ${outputPath}`
      );
    }

    console.log("Input file:", inputPath);
    console.log("Output directory:", outputPath);

    // Generate icons
    await generateIcons(inputPath, outputPath);

    console.log("\nIcons generated successfully!");
    console.log(`Output directory: ${outputPath}`);

    // Verify files were created
    const expectedFiles = ["icon.icns", "icon.png", "icon.ico"];
    const missingFiles = expectedFiles.filter(
      (file) => !fs.existsSync(path.join(outputPath, file))
    );
    if (missingFiles.length > 0) {
      console.warn("\nWarning: Some files were not generated:");
      missingFiles.forEach((file) => console.warn(`- ${file}`));
    }
  } catch (error) {
    console.error("\nError:", error.message);
    process.exit(1);
  }
};

run();
