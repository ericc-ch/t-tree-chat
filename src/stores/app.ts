// A map of all nodes, keyed by their ID. This contains nodes from ALL trees.
export type NodesMap = { [nodeId: string]: MessageNode }

export interface AppState {
  /**
   * An array of node IDs. Each ID is the root of a separate conversation tree.
   */
  rootNodeIds: Array<string>

  /**
   * A single, flat map containing every node from every conversation.
   * This design is highly performant.
   */
  nodes: NodesMap

  /**
   * Optional: The root ID of the currently focused conversation tree,
   * so your UI knows which one to display.
   */
  activeConversationRootId?: string
}

export interface MessageNodeConfig {
  model: string
  system: string
}

export interface MessageNode {
  // Core properties
  id: string
  message: string
  role: "user" | "assistant"

  // Tree structure links
  parentId: string | null // Link to the parent node
  childrenIds: Array<string> // Links to all direct replies/branches

  /**
   * The configuration that will be used to generate children from this node.
   * This is inherited from the parent by default when the node is created.
   */
  config?: MessageNodeConfig
}
