type Exports = {
  memory: WebAssembly.Memory;
  tint: (
    ptr: number,
    len: number,
    addR: number,
    addG: number,
    addB: number
  ) => void;
};

let cached: Promise<Exports> | null = null;

export function getAvatarWasm() {
  if (cached) return cached;

  cached = (async () => {
    const res = await fetch("/wasm/avatar.wasm");
    const buf = await res.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(buf, {});
    return instance.exports as unknown as Exports;
  })();

  return cached;
}
