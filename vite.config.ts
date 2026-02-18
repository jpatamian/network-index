import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import RubyPlugin from "vite-plugin-ruby"
import path from "path"

export default defineConfig({
  plugins: [RubyPlugin(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "app/frontend"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        application: path.resolve(__dirname, "app/frontend/entrypoints/application.tsx"),
      },
    },
  },
})