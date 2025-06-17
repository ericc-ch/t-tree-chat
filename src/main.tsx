import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { syncConversation } from "./api/sync.ts"
import { App } from "./app.tsx"
import { cleanDoubleSlashes } from "./lib/utils.ts"

if (
  globalThis.location.pathname
  === cleanDoubleSlashes(`${import.meta.env.BASE_URL}/oauth`)
) {
  globalThis.location.href = "/"
}

const root = document.querySelector("#root")
if (!root) throw new Error("No root element found")

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const save = async (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "s") {
    event.preventDefault()
    await syncConversation()
  }
}

document.addEventListener("keydown", save)
