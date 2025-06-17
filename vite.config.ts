import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

const BASE = process.env.BASE ?? "/"

export default defineConfig({
  base: BASE,
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", {}]],
      },
    }),
    tsconfigPaths(),
  ],
})
