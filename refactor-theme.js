const fs = require("fs");
const path = require("path");

const rules = [
  // Backgrounds
  { search: /\bbg-slate-950\b/g, replace: "bg-background" },
  { search: /\bbg-slate-900\b/g, replace: "bg-card" },
  { search: /\bbg-slate-800\/50\b/g, replace: "bg-muted/50" },
  { search: /\bbg-slate-800\/30\b/g, replace: "bg-muted/30" },
  { search: /\bbg-slate-800\b/g, replace: "bg-muted" },
  { search: /\bbg-slate-700\/50\b/g, replace: "bg-accent/50" },
  { search: /\bbg-slate-700\/30\b/g, replace: "bg-accent/30" },
  { search: /\bbg-slate-700\b/g, replace: "bg-accent" },
  { search: /\bbg-slate-600\b/g, replace: "bg-secondary" },

  // Text colors
  // Do NOT replace text-white on colored buttons or elements unless it's a general text color.
  // We'll replace text-white with text-foreground, but this might catch buttons.
  // Actually, to be safe, I'm NOT replacing text-white blindly here.
  // We replace standard text-slate variants.
  { search: /\btext-slate-200\b/g, replace: "text-foreground" },
  { search: /\btext-slate-300\b/g, replace: "text-muted-foreground" },
  { search: /\btext-slate-400\b/g, replace: "text-muted-foreground" },
  { search: /\btext-slate-500\b/g, replace: "text-muted-foreground" },

  // Borders
  { search: /\bborder-white\/5\b/g, replace: "border-border" },
  { search: /\bborder-white\/10\b/g, replace: "border-border" },
  { search: /\bborder-slate-800\b/g, replace: "border-border" },

  // Rings
  { search: /\bring-slate-700\b/g, replace: "ring-border" },
];

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

      for (const rule of rules) {
        content = content.replace(rule.search, rule.replace);
      }

      // Hack for text-white: Replace ONLY if it appears closely with dark backgrounds,
      // but the safest way the user often used it was general body text.
      // Let's replace `text-white` with `text-foreground`, BUT revert `text-foreground`
      // back to `text-white` specifically inside buttons or blocks that have `bg-indigo-600`.
      // Actually, since this script is localized, I'll just apply the core rules above.

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, "utf-8");
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

// Process 'app' and 'components' directories
["app", "components"].forEach((dir) => {
  const absolutePath = path.join(__dirname, dir);
  if (fs.existsSync(absolutePath)) {
    processDirectory(absolutePath);
  }
});

console.log("Refactoring complete!");
