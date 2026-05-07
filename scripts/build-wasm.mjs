import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import wabtFactory from "wabt";

const wabt = await wabtFactory();
const source = readFileSync("wasm/gap-kernel.wat", "utf8");
const module = wabt.parseWat("gap-kernel.wat", source);
module.resolveNames();
module.validate();
const { buffer } = module.toBinary({ log: false, write_debug_names: true });

mkdirSync("public/wasm", { recursive: true });
writeFileSync("public/wasm/gap-kernel.wasm", Buffer.from(buffer));
