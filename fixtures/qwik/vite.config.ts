import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { components } from "vite-plugin-component-lib";

export default defineConfig(() => ({
    plugins: [qwikVite(), components()],
}));
