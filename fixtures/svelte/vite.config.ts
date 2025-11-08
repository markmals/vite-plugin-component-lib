import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { components } from "vite-plugin-component-lib";

export default defineConfig({
    plugins: [svelte(), components()],
});
