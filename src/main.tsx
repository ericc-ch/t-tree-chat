import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { App } from "./app.tsx"

const root = document.querySelector("#root")
if (!root) throw new Error("No root element found")

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const save = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "s") {
    event.preventDefault()

    console.log("Ctrl+S pressed! Executing custom save logic...")
  }
}

document.addEventListener("keydown", save)
