// Fails when tailwind.css is out of date with the classes used in index.html / app.js / site-fx.js.
// Run before committing: npm run check:css   (fix: npm run build:css)
import { execFileSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";

const tmp = ".tailwind.check.css";
execFileSync("npx", ["--yes", "tailwindcss@3.4.17", "-c", "tailwind.config.js", "-i", "tailwind.input.css", "-o", tmp, "--minify"], { stdio: "ignore" });
const same = readFileSync(tmp, "utf8") === readFileSync("tailwind.css", "utf8");
rmSync(tmp);
if (!same) { console.error("tailwind.css is out of date. Run: npm run build:css"); process.exit(1); }
console.log("tailwind.css is up to date");
