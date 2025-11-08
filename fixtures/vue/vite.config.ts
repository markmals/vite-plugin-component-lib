import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { components } from "vite-plugin-component-lib";

export default defineConfig({
    plugins: [vue(), components()],
});
