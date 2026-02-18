// AppProvider wraps the application with Chakra UI and theme support
// Chakra UI provides component styling system and theming
// next-themes enables light/dark mode switching
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"

interface AppProviderProps {
  children: ReactNode
}

const system = createSystem(defaultConfig)

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </ChakraProvider>
  )
}
