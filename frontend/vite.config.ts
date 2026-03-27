import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const appDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "./app"
);

export default defineConfig({
  resolve: {
    alias: {
      "@": appDirectory,
    },
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
