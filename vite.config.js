import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
const manifest = {
  name: "Nikhil Vite App",
  short_name: "Shopping Cart",
  description: "Simple shoping test app on vite",
  icons: [
    {
      src: "/logo.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
};
// console.log(process?.env?.VITE_API_URL)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: manifest,
      workbox: {
        globPatterns: ["**/*.{js,css,html,pdf}"],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              return url.pathname.startsWith("/api");
            },
            handler: "CacheFirst",
            options: {
              cacheName: "api-cache",
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      "api/v1": {
        target: "http://localhost:9080/api/v1",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
      components: path.resolve(__dirname, "src/components"),
      pages: path.resolve(__dirname, "src/pages"),
      utils: path.resolve(__dirname, "src/utils"),
    },
  },
  preview: {
    host: true,
    port: 8008,
    https: true,
  },
});
