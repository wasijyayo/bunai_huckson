import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/bunai_huckson/", // GitHub Pages 用のベースパスを設定
  build: {
    outDir: "dist",
    publicDir: "public",
  },
});
