import type { CoreMessage } from "ai"

import type { FlowNode } from "../stores/flow"

export const buildMessages = (
  nodes: Array<Pick<FlowNode, "type" | "data">>,
): Array<CoreMessage> =>
  nodes.map((node) => {
    return {
      role: node.type === "userMessage" ? "user" : "assistant",
      content: node.data.message,
    }
  })

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

// Taken from https://github.com/unjs/ufo
export const cleanDoubleSlashes = (input: string) =>
  input.replaceAll(/\/{2,}/g, "/")

export const stringToFile = (str: string, filename: string) => {
  const blob = new Blob([str], { type: "application/json" })
  const file = new File([blob], filename, {
    type: blob.type,
    lastModified: Date.now(),
  })

  return file
}
