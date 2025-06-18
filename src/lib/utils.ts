import type { CoreAssistantMessage, CoreMessage, CoreUserMessage } from "ai"

import type { FlowNode } from "../stores/flow"

export const buildUserMessage = (
  node: Pick<FlowNode, "type" | "data">,
  { withAttachments = true }: { withAttachments: boolean },
): CoreUserMessage => {
  const content: CoreUserMessage["content"] = []
  content.push({
    type: "text",
    text: node.data.message,
  })

  if (!withAttachments) return { role: "user", content }

  for (const attachment of node.data.attachments) {
    if (attachment.type === "image") {
      content.push({
        type: "image",
        image: attachment.url,
      })
      continue
    }

    content.push({
      type: "file",
      mimeType: "application/pdf",
      filename: attachment.name,
      data: attachment.url,
    })
  }

  return {
    role: "user",
    content,
  }
}

export const buildMessages = (
  nodes: Array<Pick<FlowNode, "type" | "data">>,
  { withAttachments = true }: { withAttachments: boolean },
): Array<CoreMessage> =>
  nodes.map((node) => {
    if (node.type === "userMessage") {
      return buildUserMessage(node, { withAttachments })
    }

    const content: CoreAssistantMessage["content"] = []

    if (node.data.reasoning) {
      content.push({
        type: "reasoning",
        text: node.data.reasoning,
      })
    }

    content.push({
      type: "text",
      text: node.data.message,
    })

    return {
      role: "assistant",
      content,
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

export const objToFormData = (obj: Record<string, string | File>) => {
  const formData = new FormData()

  for (const [key, value] of Object.entries(obj)) {
    formData.append(key, value)
  }

  return formData
}
