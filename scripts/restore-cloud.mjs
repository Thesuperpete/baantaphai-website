// Puts a saved copy of the site data back on the live Cloud Sync endpoint.
//
//   node scripts/restore-cloud.mjs [snapshot.json] [--endpoint https://.../.netlify/functions/sync]
//
// It asks for the admin passphrase (ADMIN_TOKEN) with the typing hidden, logs in, shows what would be
// replaced, and only writes after you type "yes". The passphrase is never stored or printed.
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const DEFAULT_ENDPOINT = "https://baantaphairesort.netlify.app/.netlify/functions/sync";
const DEFAULT_FILE = join(homedir(), "Desktop", "Baan Ta Phai", "Website Backup", "cloud-restore-snapshot.json");

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i > -1 ? args[i + 1] : undefined; };
const endpoint = flag("--endpoint") || DEFAULT_ENDPOINT;
const file = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--endpoint") || DEFAULT_FILE;

const say = (m = "") => console.log(m);
const die = (m) => { console.error("\n" + m); process.exit(1); };

let piped = "";
// one line from the keyboard; hidden = typed characters are not shown
function ask(question, hidden) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    if (!process.stdin.isTTY) {                       // piped input (used by the automated test): one line per question
      process.stdin.setEncoding("utf8");
      const take = () => { const n = piped.indexOf("\n"); if (n < 0) return false; const line = piped.slice(0, n).replace(/\r$/, ""); piped = piped.slice(n + 1); process.stdin.off("data", onData); resolve(line); return true; };
      const onData = (d) => { piped += d; take(); };
      if (!take()) process.stdin.on("data", onData);
      process.stdin.resume();
      return;
    }
    let value = "";
    process.stdin.setRawMode(true); process.stdin.resume(); process.stdin.setEncoding("utf8");
    const onData = (ch) => {
      for (const c of ch) {
        if (c === "\u0003") { process.stdout.write("\n"); process.exit(130); }              // Ctrl-C
        if (c === "\r" || c === "\n") { process.stdin.setRawMode(false); process.stdin.pause(); process.stdin.off("data", onData); process.stdout.write("\n"); return resolve(value); }
        if (c === "\u007f" || c === "\b") { value = value.slice(0, -1); continue; }
        value += c; if (!hidden) process.stdout.write(c);
      }
    };
    process.stdin.on("data", onData);
  });
}

let snapshot;
try { snapshot = JSON.parse(readFileSync(file, "utf8")); } catch (e) { die(`Cannot read the snapshot file:\n  ${file}\n  (${e.message})`); }
if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) die("The snapshot file is not a site-data object.");
const keys = Object.keys(snapshot);
if (keys.includes("passphrase")) die("The snapshot contains a 'passphrase' field. Remove it first; it must never be saved to the cloud.");
if (keys.length < 10) die(`The snapshot has only ${keys.length} sections, which looks incomplete. Nothing was written.`);

say("Restore site data to the live Cloud Sync");
say(`  endpoint : ${endpoint}`);
say(`  snapshot : ${file}  (${keys.length} sections, ${Math.round(readFileSync(file).length / 1024)} KB)`);

let live;
try {
  const r = await fetch(endpoint, { headers: { "cache-control": "no-cache" } });
  live = (await r.json()).data || null;
} catch (e) { die(`Cannot reach the endpoint: ${e.message}`); }
const liveKeys = live ? Object.keys(live) : [];
say(`  live now : ${liveKeys.length} sections${liveKeys.length <= 2 ? "  (looks wiped)" : ""}`);
if (liveKeys.includes("passphrase")) say("  note     : the live data holds a 'passphrase' field; this restore removes it");
if (liveKeys.length > 5) say("  WARNING  : the live site already has content. A restore replaces ALL of it with the snapshot.");

const passphrase = await ask("\nAdmin passphrase (typing is hidden): ", true);
if (!passphrase) die("No passphrase entered. Nothing was written.");

const login = await fetch(endpoint + (endpoint.includes("?") ? "&" : "?") + "action=login", {
  method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ passphrase }),
});
const lj = await login.json().catch(() => ({}));
if (login.status === 503 && lj.error === "weak_token") die("The server says ADMIN_TOKEN is shorter than 12 characters. Set a longer one in Netlify and deploy again.");
if (login.status === 503) die("The server has no ADMIN_TOKEN yet (or it is not deployed). Set it in Netlify and deploy again.");
if (login.status === 405 || login.status === 404) die("The server is still the old version (no login yet). Deploy the new version first.");
if (login.status === 429) die(`Too many wrong attempts. Wait ${Math.ceil((lj.retryAfterSec || 900) / 60)} minutes and try again.`);
if (!login.ok || !lj.token) die("Wrong passphrase. Nothing was written.");
say("Login OK.");

const sure = await ask(`\nReplace the live data with this snapshot? Type "yes" to continue: `, false);
if (sure.trim().toLowerCase() !== "yes") die("Cancelled. Nothing was written.");

const save = await fetch(endpoint, {
  method: "POST", headers: { "content-type": "application/json", authorization: "Bearer " + lj.token }, body: JSON.stringify(snapshot),
});
const sj = await save.json().catch(() => ({}));
if (!save.ok || !sj.success) die(`The save failed (HTTP ${save.status}${sj.error ? ", " + sj.error : ""}). Nothing was changed.`);

const check = (await (await fetch(endpoint, { headers: { "cache-control": "no-cache" } })).json()).data || {};
const missing = keys.filter((k) => !(k in check));
say(`\nDone. Saved at ${sj.updatedAt}. The live data now has ${Object.keys(check).length} sections.`);
if (missing.length) say(`Warning: these sections did not come back: ${missing.join(", ")}`);
if ("passphrase" in check) say("Warning: a 'passphrase' field is still in the live data.");
else say("The old 'passphrase' field is gone from the live data.");
say("Reload the website (Cmd+Shift+R) to see it.");
