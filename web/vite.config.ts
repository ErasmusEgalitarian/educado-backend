import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load parent directory .env so we can keep a single env file at repo root.
  // loadEnv with empty prefix ('') loads all keys; we'll then filter to VITE_ keys.
  const parentEnv = loadEnv(mode, path.resolve(__dirname, '..'), '');

  // Extract only VITE_ prefixed vars (security: only these should reach client bundle)
  const viteClientVars = Object.fromEntries(
    Object.entries(parentEnv).filter(([k]) => k.startsWith('VITE_'))
  );

  // Derive frontend port (prefer explicit VITE_FRONTEND_PORT, fallback to 5174)
  const frontendPortRaw = viteClientVars.VITE_FRONTEND_PORT || process.env.VITE_FRONTEND_PORT;
  const frontendPort = Number(frontendPortRaw) || 5174;

  // Build define map: inject as literal replacements import.meta.env.X
  const defineEnvEntries = Object.fromEntries(
    Object.entries(viteClientVars).map(([k, v]) => [
      `import.meta.env.${k}`,
      JSON.stringify(v),
    ])
  );

  return {
    server: {
      port: frontendPort,
      host: true,
    },
    plugins: [react(), tailwindcss()],
    define: {
      global: {},
      ...defineEnvEntries,
    },
    resolve: {
      alias: [
        { find: "@/shared", replacement: path.resolve(__dirname, "src/shared") },
        { find: "@/auth", replacement: path.resolve(__dirname, "src/features/auth") },
        { find: "@/certificates", replacement: path.resolve(__dirname, "src/features/certificates") },
        { find: "@/course", replacement: path.resolve(__dirname, "src/features/course") },
        { find: "@/exercise", replacement: path.resolve(__dirname, "src/features/exercise") },
        { find: "@/lecture", replacement: path.resolve(__dirname, "src/features/lecture") },
        { find: "@/section", replacement: path.resolve(__dirname, "src/features/section") },
        { find: "@/user", replacement: path.resolve(__dirname, "src/features/user") },
        { find: "@/unplaced", replacement: path.resolve(__dirname, "src/unplaced") },
        { find: "@", replacement: path.resolve(__dirname, "src") },
      ],
    },
  };
});
