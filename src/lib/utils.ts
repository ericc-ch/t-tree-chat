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
