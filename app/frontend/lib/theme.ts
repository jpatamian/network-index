import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// Define semantic tokens that adapt to light/dark mode
const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Semantic tokens for text colors
        fg: {
          DEFAULT: { value: { base: "gray.900", _dark: "gray.100" } },
          subtle: { value: { base: "gray.600", _dark: "gray.400" } },
          muted: { value: { base: "gray.500", _dark: "gray.500" } },
        },
        // Semantic tokens for backgrounds
        bg: {
          DEFAULT: { value: { base: "white", _dark: "gray.800" } },
          subtle: { value: { base: "orange.50", _dark: "gray.900" } },
          muted: { value: { base: "orange.100", _dark: "gray.700" } },
        },
        // Semantic tokens for borders
        border: {
          DEFAULT: { value: { base: "orange.200", _dark: "gray.700" } },
          subtle: { value: { base: "orange.100", _dark: "gray.700" } },
        },
      },
    },
  },
  globalCss: {
    body: {
      bg: "bg.subtle",
      color: "fg",
    },
  },
});

export const system = createSystem(defaultConfig, config);
