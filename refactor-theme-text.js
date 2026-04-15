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

      // Smart replace on classNames
      content = content.replace(/className=(?:"([^"]+)"|{`([^`]+)`})/g, (match, doubleQuotes, backticks) => {
        let classNames = doubleQuotes || backticks || "";
        let originalClasses = classNames;
        
        // Skip text-replace logic if it's a primary colored button or uses specific backgrounds
        let keepWhiteText = /bg-indigo|bg-blue|from-|bg-primary|gradient-text/i.test(classNames);
        
        if (!keepWhiteText) {
          classNames = classNames.replace(/\btext-white\b/g, "text-foreground");
          classNames = classNames.replace(/\bhover:text-white\b/g, "hover:text-foreground");
        }
        
        classNames = classNames
          .replace(/\btext-white\/([0-9]+)\b/g, "text-foreground/$1")
          .replace(/\btext-slate-100\b/g, "text-foreground")
          .replace(/\btext-slate-200\b/g, "text-foreground")
          .replace(/\btext-slate-300\b/g, "text-muted-foreground")
          .replace(/\btext-slate-400\b/g, "text-muted-foreground")
          .replace(/\btext-slate-500\b/g, "text-muted-foreground")
          
          .replace(/\bhover:text-slate-100\b/g, "hover:text-foreground")
          .replace(/\bhover:text-slate-200\b/g, "hover:text-foreground")
          .replace(/\bhover:text-slate-300\b/g, "hover:text-muted-foreground")
          
          .replace(/\bbg-slate-950\b|bg-slate-900\b/g, "bg-card")
          .replace(/\bbg-slate-800\/([0-9]+)\b/g, "bg-muted/$1")
          .replace(/\bbg-slate-800\b/g, "bg-muted")
          .replace(/\bbg-slate-700\/([0-9]+)\b/g, "bg-accent/$1")
          .replace(/\bbg-slate-700\b/g, "bg-accent")
          .replace(/\bbg-slate-600\b/g, "bg-secondary")
          
          .replace(/\bborder-white\/([0-9]+)\b/g, "border-border")
          .replace(/\bring-white\/([0-9]+)\b/g, "ring-border")
          .replace(/\bborder-slate-[0-9]+\b/g, "border-border")
          .replace(/\bring-slate-[0-9]+\b/g, "ring-border");
          
        if (doubleQuotes) return `className="${classNames}"`;
        if (backticks) return `className={\`${classNames}\`}`;
        return match;
      });

      // Special handling for hardcoded dropdown styles
      content = content.replace(/bg-slate-900 border-white\/10 text-white/g, "bg-background border-border text-foreground");
      content = content.replace(/bg-slate-900 border-white\/5 text-white/g, "bg-background border-border text-foreground");

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

console.log("Deep text and layout color refactoring complete!");
