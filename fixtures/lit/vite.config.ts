import { defineConfig } from "vite";
import { components } from "vite-plugin-component-lib";

export default defineConfig({
    plugins: [components()],
});
