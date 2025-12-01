const fs = require("fs");
const path = require("path");

const inputFile = path.join(__dirname, "css", "style.css");
const outputFile = path.join(__dirname, "css", "style.min.css");

fs.readFile(inputFile, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  let minified = data
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, "")
    // Remove whitespace around braces, colons, semicolons
    .replace(/\s*([\{:;,])\s*/g, "$1")
    // Remove newlines and multiple spaces
    .replace(/\s+/g, " ")
    // Restore space for media queries (and, or, not)
    .replace(/@media ([a-zA-Z0-9-]+)/g, "@media $1")
    .replace(/ and \(/g, " and (")
    // Fix calc() spacing issues if any (simplified)
    .replace(/calc\(([^)]+)\)/g, (match) => match.replace(/\s+/g, ""))
    // Remove last semicolon in block
    .replace(/;\}/g, "}")
    .trim();

  fs.writeFile(outputFile, minified, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log(`Minified CSS saved to ${outputFile}`);

    const originalSize = fs.statSync(inputFile).size;
    const minifiedSize = fs.statSync(outputFile).size;
    console.log(`Original size: ${(originalSize / 1024).toFixed(2)} KiB`);
    console.log(`Minified size: ${(minifiedSize / 1024).toFixed(2)} KiB`);
    console.log(
      `Saved: ${((originalSize - minifiedSize) / 1024).toFixed(2)} KiB`
    );
  });
});
