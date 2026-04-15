const fs = require("fs");
const path = require("path");

function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      let content = fs.readFileSync(fullPath, "utf-8");
      let originalContent = content;

      // 1. Fix duplicated text colors from previous script runs
      content = content.replace(/text-indigo-600 dark:text-indigo-600 dark:text-indigo-400/g, "text-indigo-600 dark:text-indigo-400");
      content = content.replace(/hover:text-indigo-600 dark:hover:text-indigo-700 dark:hover:text-indigo-300/g, "hover:text-indigo-600 dark:hover:text-indigo-300");
      content = content.replace(/hover:text-indigo-600 dark:hover:text-indigo-700 dark:hover:text-indigo-400/g, "hover:text-indigo-600 dark:hover:text-indigo-400");
      
      // 2. Catch remaining hover:text-white in common layout patterns
      // These usually appear in ternaries or template literals which the previous script's regex missed.
      content = content.replace(/\bhover:text-white\b/g, (match, offset, fullText) => {
        // Only replace if NOT preceded by a dark background like bg-indigo-600
        // We look back ~50 chars to see if bg-indigo-600 is nearby.
        const prev = fullText.slice(Math.max(0, offset - 50), offset);
        if (/bg-indigo-600|bg-primary|gradient|bg-blue-600/i.test(prev)) {
          return match;
        }
        return "hover:text-foreground";
      });

      // 3. Fix invisible hover backgrounds in light mode
      content = content.replace(/\bhover:bg-white\/5\b/g, "hover:bg-accent/50");
      content = content.replace(/\bhover:bg-white\/10\b/g, "hover:bg-accent");
      
      // 4. Cleanup any hover:hover: or dark:dark:
      content = content.replace(/\bhover:hover:\b/g, "hover:");
      content = content.replace(/\bdark:dark:\b/g, "dark:");

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, "utf-8");
      }
    }
  }
}

["app", "components"].forEach((dir) => {
  const absolutePath = path.join(__dirname, dir);
  if (fs.existsSync(absolutePath)) {
    processDirectory(absolutePath);
  }
});

console.log("Final theme color stabilization and cleanup complete!");
