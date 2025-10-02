import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    host: true,
  },
  plugins: [react(), tailwindcss()],
  define: {
    global: {}, // For working with AWS
  },
  resolve: {
    // Use ordered array so specific aliases take precedence over generic '@'
    alias: [
      { find: "@/shared", replacement: path.resolve(__dirname, "src/shared") },
      {
        find: "@/auth",
        replacement: path.resolve(__dirname, "src/features/auth"),
      },
      {
        find: "@/certificates",
        replacement: path.resolve(__dirname, "src/features/certificates"),
      },
      {
        find: "@/course",
        replacement: path.resolve(__dirname, "src/features/course"),
      },
      {
        find: "@/exercise",
        replacement: path.resolve(__dirname, "src/features/exercise"),
      },
      {
        find: "@/lecture",
        replacement: path.resolve(__dirname, "src/features/lecture"),
      },
      {
        find: "@/section",
        replacement: path.resolve(__dirname, "src/features/section"),
      },
      {
        find: "@/user",
        replacement: path.resolve(__dirname, "src/features/user"),
      },
      {
        find: "@/unplaced",
        replacement: path.resolve(__dirname, "src/unplaced"),
      },
      // Keep the generic '@' last to avoid shadowing more specific aliases
      { find: "@", replacement: path.resolve(__dirname, "src") },
    ],
  },
});
