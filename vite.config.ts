import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import RubyPlugin from "vite-plugin-ruby"
import tsconfigPaths from "vite-tsconfig-paths"
import path from "path"

export default defineConfig({
  plugins: [RubyPlugin(), react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "app/frontend"),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      input: {
        application: path.resolve(__dirname, "app/frontend/entrypoints/application.tsx"),
      },
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('@chakra-ui') || id.includes('@emotion') || id.includes('framer-motion')) {
            return 'ui-vendor'
          }
          return undefined
        },
      },
    },
  },
})