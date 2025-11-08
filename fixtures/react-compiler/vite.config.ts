import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { components } from "vite-plugin-component-lib";

export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [["babel-plugin-react-compiler"]],
            },
        }),
        components(),
    ],
});
