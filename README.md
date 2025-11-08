## vite-plugin-component-lib

Framework-agnostic Vite plugin that emits an unbundled component library in both ESM and CJS formats by default, using a single `vite build` command. It wires up Vite’s `environments` + `builder` APIs so the same source can ship to multiple module targets without hand-rolled Rollup/Rolldown configs.

### Why use it?

- Dual-format output with preserved modules, so consumers can tree-shake from either `dist/esm` or `dist/cjs`
- Sensible defaults for externals: every bare import is treated as external unless you explicitly keep it internal
- Works for any UI stack (React, Vue, Svelte, Solid, Lit, etc.) because it never assumes a renderer; you can bring your own Vite plugins

> [!IMPORTANT]
> Requires Vite 6+ for the Environment API

## Installation

```bash
npm add -D vite-plugin-component-lib
```

## Quick start

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { components } from "vite-plugin-component-lib";

export default defineConfig({
    plugins: [react(), components()],
});
```

Run `vite build`. The plugin:

1. Creates two environments (`esm` and `cjs` by default).
2. Uses Vite’s builder to run them sequentially in one command.
3. Emits preserved modules into `dist/esm` and `dist/cjs` with matching folder structures.
4. Generates declaration files via [unplugin-dts](https://github.com/qmhc/unplugin-dts) and writes them to `dist`.

## Output layout

```
dist/
├─ esm/
│  ├─ index.js
│  └─ components/Button.js
└─ cjs/
   ├─ index.cjs
   └─ components/Button.cjs
```

- Both formats preserve the relative paths found under `src` by default (`preserveModulesRoot`).
- Asset names are preserved (`[name][ext]`) so CSS, SVG, and other static files keep their filenames.
- Declaration files mirror your source tree and ship alongside the build output, so `package.json#types` can target `dist/index.d.ts`.

## Type declarations

- Enabled by default through `unplugin-dts`.
- Emits `.d.ts` files into the base `outDir` (`dist` unless overridden).
- Automatically inserts or updates the `types` entry file (`dist/index.d.ts` by default).
- Customize any `unplugin-dts` option (or disable emission entirely) with the `dts` option.

## Recommended `package.json` exports

```jsonc
{
    "name": "my-component-lib",
    "type": "module",
    "main": "./dist/cjs/index.cjs",
    "module": "./dist/esm/index.js",
    "types": "./dist/index.d.ts",
    "exports": {
        ".": {
            "import": "./dist/esm/index.js",
            "require": "./dist/cjs/index.cjs",
            "types": "./dist/index.d.ts",
        },
    },
}
```

## Options

| Option                | Type                                          | Default                     | Description                                                                                     |
| --------------------- | --------------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------- |
| `entry`               | `string \| string[] \| Record<string,string>` | `"src/index.ts"`            | Library entry passed to `build.lib.entry`.                                                      |
| `outDir`              | `string`                                      | `"dist"`                    | Base output directory. Format folders (`esm`, `cjs`) are nested inside.                         |
| `preserveModulesRoot` | `string`                                      | `"src"`                     | Root folder trimmed from emitted paths when `preserveModules` is on.                            |
| `fileSuffix`          | `{ esm?: string; cjs?: string }`              | `{esm: ".js", cjs: ".cjs"}` | Customize per-format filename suffixes.                                                         |
| `external`            | `(RegExp \| string)[]`                        | bare imports                | Extra ids to mark as external.                                                                  |
| `internal`            | `(RegExp \| string)[]`                        | `[]`                        | Allow-listed bare ids that should stay bundled.                                                 |
| `envNames`            | `{ esm?: string; cjs?: string }`              | `{esm: "esm", cjs: "cjs"}`  | Rename the environments if you need non-default names.                                          |
| `formats`             | `("esm" \| "cjs")[]`                          | `["esm", "cjs"]`            | Choose which formats to emit. Pass `["esm"]` for ESM-only, etc.                                 |
| `disableBuilder`      | `boolean`                                     | `false`                     | Skip registering the builder hook. Useful for CI workflows that call environments individually. |
| `dts`                 | `boolean \| PluginOptions`                    | `true`                      | Configure the bundled `unplugin-dts` instance or disable it.                                    |

`PluginOptions` is the option type exported by `unplugin-dts`.

## License

MIT
