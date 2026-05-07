import type { FiniteGroup } from "./schema";

type KernelExports = {
  memory: WebAssembly.Memory;
  product: (ptr: number, order: number, a: number, b: number) => number;
  inverse: (ptr: number, order: number, identity: number, a: number) => number;
  element_order: (ptr: number, order: number, identity: number, a: number) => number;
};

export type GroupKernel = {
  product: (a: number, b: number) => number;
  inverse: (identity: number, a: number) => number;
  elementOrder: (identity: number, a: number) => number;
};

const tableOffset = 1024;
let wasmPromise: Promise<KernelExports> | undefined;

async function loadKernel(): Promise<KernelExports> {
  wasmPromise ??= fetch(`${import.meta.env.BASE_URL}wasm/gap-kernel.wasm`)
    .then((response) => {
      if (!response.ok) throw new Error(`Could not load WASM kernel: ${response.status}`);
      return response.arrayBuffer();
    })
    .then((buffer) => WebAssembly.instantiate(buffer))
    .then((result) => result.instance.exports as KernelExports);

  return wasmPromise;
}

export async function createGroupKernel(group: FiniteGroup): Promise<GroupKernel> {
  if (group.order > 255) {
    throw new Error("The v1 WASM table kernel supports groups up to order 255.");
  }

  const exports = await loadKernel();
  const table = new Uint8Array(exports.memory.buffer, tableOffset, group.order * group.order);
  table.set(group.operationTable.flat());

  return {
    product: (a, b) => exports.product(tableOffset, group.order, a, b),
    inverse: (identity, a) => exports.inverse(tableOffset, group.order, identity, a),
    elementOrder: (identity, a) => exports.element_order(tableOffset, group.order, identity, a)
  };
}
