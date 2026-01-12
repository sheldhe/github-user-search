import fs from "node:fs/promises";
import path from "node:path";
import wabtFactory from "wabt";

const root = process.cwd();
const watPath = path.join(root, "wasm", "avatar.wat");
const outDir = path.join(root, "public", "wasm");
const outPath = path.join(outDir, "avatar.wasm");

const wabt = await wabtFactory();
const wat = await fs.readFile(watPath, "utf8");

const mod = wabt.parseWat("avatar.wat", wat);
const { buffer } = mod.toBinary({ log: false, write_debug_names: true });

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(outPath, Buffer.from(buffer));

console.log("✅ wrote:", outPath);
