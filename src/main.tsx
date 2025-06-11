import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { App } from "./app.tsx"
import { useUIStore } from "./stores/ui.ts"

const root = document.querySelector("#root")
if (!root) throw new Error("No root element found")

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// To close the context menu when selecting nodes
document.addEventListener("keydown", (event) => {
  if (event.shiftKey) {
    useUIStore.getState().closeContextMenu()
  }
})
