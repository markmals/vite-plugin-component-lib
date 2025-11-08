import path from "node:path";
import type { LogOptions, Plugin, PluginOption, UserConfig } from "vite";
import { normalizePath } from "vite";
import dts from "unplugin-dts/vite";
import type { PluginOptions as DtsPluginOptions } from "unplugin-dts";
import { matches, isBare } from "./utils.ts";

export interface PluginComponentLibOptions {
    /** Your library entry (string | array | named object). Defaults to "src/index.ts". */
    entry?: string | string[] | Record<string, string>;
    /** Base output dir. ESM/CJS land in subfolders. Defaults to "dist". */
    outDir?: string;
    /** Strip this prefix in preserved module paths. Defaults to "src". */
    preserveModulesRoot?: string;
    /** Override emitted file suffixes (per format). Defaults to ".js" / ".cjs". */
    fileSuffix?: { esm?: string; cjs?: string };
    /** Extra bare ids to force-external (regex or exact strings). */
    external?: (RegExp | string)[];
    /** Allow-list bare ids to keep internal (won’t be externalized). */
    internal?: (RegExp | string)[];
    /** Rename the environment keys if you like. */
    envNames?: { esm?: string; cjs?: string };
    /** Choose formats to emit. Defaults to `["esm", "cjs"]` */
    formats?: ("esm" | "cjs")[];
    /** Only in Vite Library mode. Skip overriding environments. */
    disableBuilder?: boolean;
    /** Configure (or disable) built-in declaration file generation powered by unplugin-dts. */
    dts?: boolean | DtsPluginOptions;
}

/** Framework-agnostic, unbundled dual-format build in one `vite build`. */
export function components(options: PluginComponentLibOptions = {}): PluginOption {
    const entry = options.entry ?? "src/index.ts";
    const outBase = options.outDir ?? "dist";
    const preserveModulesRoot = options.preserveModulesRoot ?? "src";
    const envNames = { esm: "esm", cjs: "cjs", ...(options.envNames ?? {}) };
    const formats = options.formats ?? ["esm", "cjs"];
    const suffix = {
        esm: options.fileSuffix?.esm ?? ".js",
        cjs: options.fileSuffix?.cjs ?? ".cjs",
    };
    const dtsOptions = typeof options.dts === "object" && options.dts ? options.dts : undefined;
    const hasCustomBeforeWrite =
        typeof options.dts === "object" &&
        options.dts !== null &&
        Object.prototype.hasOwnProperty.call(options.dts, "beforeWriteFile");
    const emittedModuleStems = new Set<string>();
    let resolvedRoot: string | undefined;
    const stripExt = (id: string) => id.replace(/\.[^/.]+$/, "");
    const recordModule = (id?: string) => {
        if (!id) return;
        const absolute = path.normalize(id);
        const rel = resolvedRoot ? path.relative(resolvedRoot, absolute) : absolute;
        emittedModuleStems.add(stripExt(normalizePath(rel)));
    };
    const dtsExtRE = /\.d\.(?:[mc]?ts)$/;
    const resolveOutDir = () =>
        path.isAbsolute(outBase)
            ? path.normalize(outBase)
            : path.normalize(path.join(resolvedRoot ?? "", outBase));
    const shouldKeepDeclaration = (filePath: string): boolean => {
        if (!resolvedRoot || emittedModuleStems.size === 0) return true;
        const outDirAbs = resolveOutDir();
        const rel = normalizePath(path.relative(outDirAbs, path.normalize(filePath)));
        if (rel.startsWith("..")) return true;
        const stem = normalizePath(path.join(preserveModulesRoot, rel).replace(dtsExtRE, ""));
        return emittedModuleStems.has(stem);
    };
    const trackModules = (): Plugin => ({
        name: "vite-plugin-component-lib-track-modules",
        generateBundle(_, bundle) {
            for (const chunk of Object.values(bundle)) {
                if (chunk.type === "chunk" && chunk.facadeModuleId) {
                    recordModule(chunk.facadeModuleId);
                }
            }
        },
    });
    const silenceDtsLogs = (): Plugin => ({
        name: "vite-plugin-component-lib-silence-dts",
        enforce: "pre",
        apply: "build",
        configResolved(config) {
            const suppress = <T extends (msg: string, options?: LogOptions | undefined) => void>(
                fn: T,
            ): T =>
                ((msg: string, options?: LogOptions | undefined) => {
                    if (
                        typeof msg === "string" &&
                        (msg.includes("[dts]") ||
                            msg.includes("[unplugin:dts]") ||
                            msg.includes("unplugin-dts"))
                    ) {
                        return undefined as ReturnType<T>;
                    }
                    return fn(msg, options);
                }) as T;
            config.logger.info = suppress(config.logger.info.bind(config.logger));
            config.logger.warn = suppress(config.logger.warn.bind(config.logger));
        },
    });
    const dtsPlugin: PluginOption | undefined =
        options.dts === false
            ? undefined
            : dts({
                  outDirs: outBase,
                  entryRoot: preserveModulesRoot,
                  insertTypesEntry: true,
                  strictOutput: true,
                  ...(hasCustomBeforeWrite
                      ? {}
                      : {
                            beforeWriteFile(filePath) {
                                if (!shouldKeepDeclaration(filePath)) return false;
                            },
                        }),
                  ...dtsOptions,
              });

    const external: NonNullable<
        NonNullable<UserConfig["build"]>["rollupOptions"]
    >["external"] = id => {
        if (matches(id, options.internal)) return false;
        if (matches(id, options.external)) return true;
        return isBare(id);
    };

    const environments: NonNullable<UserConfig["environments"]> = {};

    if (formats.includes("esm")) {
        environments[envNames.esm] = {
                build: {
                    outDir: `${outBase}/esm`,
                    lib: {
                        entry,
                        fileName: (_, n) => `${n}${suffix.esm}`,
                    },
                rollupOptions: {
                    external,
                    plugins: [trackModules()],
                    output: [
                        {
                            format: "esm",
                            preserveModules: true,
                            preserveModulesRoot,
                            entryFileNames: `[name]${suffix.esm}`,
                            chunkFileNames: `[name]${suffix.esm}`,
                            assetFileNames: "[name][ext]",
                        },
                    ],
                },
            },
        };
    }

    if (formats.includes("cjs")) {
        environments[envNames.cjs] = {
                build: {
                    outDir: `${outBase}/cjs`,
                    lib: {
                        entry,
                        fileName: (_, n) => `${n}${suffix.cjs}`,
                    },
                rollupOptions: {
                    external,
                    plugins: [trackModules()],
                    output: [
                        {
                            format: "cjs",
                            exports: "auto",
                            preserveModules: true,
                            preserveModulesRoot,
                            entryFileNames: `[name]${suffix.cjs}`,
                            chunkFileNames: `[name]${suffix.cjs}`,
                            assetFileNames: "[name][ext]",
                        },
                    ],
                },
            },
        };
    }

    const baseConfig: UserConfig = options.disableBuilder
        ? { environments }
        : {
              environments,
              builder: {
                  async buildApp(builder) {
                      for (const name of formats.map(f => envNames[f])) {
                          const env = builder.environments[name];
                          if (env) await builder.build(env);
                      }
                  },
              },
          };

    const componentPlugin: Plugin = {
        name: "vite-plugin-component-lib",
        enforce: "pre",
        apply: "build",
        config: () => baseConfig,
        configResolved(config) {
            resolvedRoot = config.root;
        },
    };

    if (!dtsPlugin) return componentPlugin;

    const extra = Array.isArray(dtsPlugin) ? dtsPlugin : [dtsPlugin];
    return [componentPlugin, silenceDtsLogs(), ...extra];
}
