import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import RubyPlugin from "vite-plugin-ruby"

export default defineConfig({
  plugins: [
    RubyPlugin(),
    react(),
  ],
  // Optional: if you want the @ alias
  resolve: {
    alias: {
      "@": "/app/frontend",
    },
  },
})
