import invariant from "tiny-invariant"
import { create } from "zustand"

// A map of all nodes, keyed by their ID. This contains nodes from ALL trees.
export type NodesMap = Map<string, MessageNode>

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
  parentId: string | undefined // Link to the parent node
  childrenIds: Array<string> // Links to all direct replies/branches

  /**
   * The configuration that will be used to generate children from this node.
   * This is inherited from the parent by default when the node is created.
   */
  config: MessageNodeConfig
}

export interface AppStore extends AppState {
  createRootNode: (message: string, config: MessageNodeConfig) => void
  createUserNode: (message: string, parentId: string) => void
  createAssistantNode: (message: string, parentId: string) => void
  setActiveConversationRootId: (id: string) => void
}

// This is a function for creating the store
// eslint-disable-next-line max-lines-per-function
export const useAppStore = create<AppStore>()((set) => ({
  rootNodeIds: [],
  nodes: new Map(),
  activeConversationRootId: undefined,

  createUserNode: (message: string, parentId: string) => {
    const nodeId = crypto.randomUUID()

    set((state) => {
      const clonedNodes = new Map(state.nodes)

      const parentNode = clonedNodes.get(parentId)
      invariant(parentNode, "Parent node not found")

      const node = {
        id: nodeId,
        message,
        role: "user",
        parentId,
        childrenIds: [],
        config: parentNode.config,
      } satisfies MessageNode

      clonedNodes.set(node.id, node)
      clonedNodes.set(parentId, {
        ...parentNode,
        childrenIds: [...parentNode.childrenIds, nodeId],
      })

      return {
        nodes: clonedNodes,
      }
    })

    return nodeId
  },

  createAssistantNode: (parentId: string) => {
    const nodeId = crypto.randomUUID()

    set((state) => {
      const clonedNodes = new Map(state.nodes)

      const parentNode = clonedNodes.get(parentId)
      invariant(parentNode, "Parent node not found")

      const node: MessageNode = {
        id: nodeId,
        message: "",
        role: "assistant",
        parentId,
        childrenIds: [],
        config: parentNode.config,
      }

      clonedNodes.set(node.id, node)

      clonedNodes.set(parentId, {
        ...parentNode,
        childrenIds: [...parentNode.childrenIds, nodeId],
      })

      return { nodes: clonedNodes }
    })

    return nodeId
  },

  createRootNode: (message: string, config: MessageNodeConfig) => {
    set((state) => {
      const clonedNodes = new Map(state.nodes)

      const node = {
        id: crypto.randomUUID(),
        message,
        role: "user",
        parentId: undefined,
        childrenIds: [],
        config,
      } satisfies MessageNode

      clonedNodes.set(node.id, node)

      return {
        nodes: clonedNodes,
        rootNodeIds: [...state.rootNodeIds, node.id],
      }
    })
  },

  setActiveConversationRootId: (id: string) => {
    set({ activeConversationRootId: id })
  },
}))
