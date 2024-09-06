import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";



export default defineConfig({
  plugins: [remix(), tsconfigPaths()],
  server: {
    hmr: true,
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 3000,
  },
  logLevel: 'info',
  css: {
    preprocessorOptions: {
      scss: {
        // Add any Sass compiler options here
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.browser': true, // Define a process.browser variable for browser
  },
});
