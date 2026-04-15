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

      // Clean up previous mistakes if any (like hover:hover:)
      content = content.replace(/\bhover:hover:\b/g, "hover:");

      // Smart replace on classNames
      content = content.replace(/className=(?:"([^"]+)"|{`([^`]+)`})/g, (match, doubleQuotes, backticks) => {
        let classNames = doubleQuotes || backticks || "";
        
        // Skip text-replace logic if it's a primary colored button
        let isPrimaryButton = /bg-indigo-600|bg-primary/i.test(classNames);
        
        if (!isPrimaryButton) {
          // Fix hover colors to be visible in light mode
          classNames = classNames.replace(/\bhover:text-white\b/g, "hover:text-foreground");
          
          // Fix Indigo accessibility
          // text-indigo-400 is too light for white backgrounds.
          classNames = classNames.replace(/\btext-indigo-400\b/g, "text-indigo-600 dark:text-indigo-400");
          classNames = classNames.replace(/\bhover:text-indigo-300\b/g, "hover:text-indigo-700 dark:hover:text-indigo-300");
          classNames = classNames.replace(/\bhover:text-indigo-400\b/g, "hover:text-indigo-700 dark:hover:text-indigo-400");
        }

        // Fix background transparency - white/X is invisible on light backgrounds
        classNames = classNames.replace(/\bbg-white\/5\b/g, "bg-muted/30 hover:bg-muted/50");
        classNames = classNames.replace(/\bbg-white\/10\b/g, "bg-muted/50 hover:bg-muted/80");
        classNames = classNames.replace(/\bhover:bg-white\/5\b/g, "hover:bg-accent/50");
        classNames = classNames.replace(/\bhover:bg-white\/10\b/g, "hover:bg-accent");
        
        // Final cleanup of any potential hover:hover: messes
        classNames = classNames.replace(/\bhover:hover:\b/g, "hover:");
        
        if (doubleQuotes) return `className="${classNames}"`;
        if (backticks) return `className={\`${classNames}\`}`;
        return match;
      });

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

console.log("Hover cleanup and indigo accessibility complete!");
