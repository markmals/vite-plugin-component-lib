import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { components } from "vite-plugin-component-lib";

export default defineConfig({
    plugins: [solid(), components()],
});
