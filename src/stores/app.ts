import invariant from "tiny-invariant"
import { create } from "zustand"

/**
 * A map of all nodes, keyed by their ID. This contains nodes from ALL trees.
 */
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

/**
 * Configuration for generating a response from a message node.
 */
export interface MessageNodeConfig {
  /** The model to use for the response. */
  model: string
  /** The system prompt to use. */
  system: string
}

/**
 * Represents a single message in a conversation tree.
 */
export interface MessageNode {
  /** A unique identifier for the node. */
  id: string
  /** The text content of the message. */
  message: string
  /** The role of the message author. */
  role: "user" | "assistant"

  /** The ID of the parent node. `undefined` if this is a root node. */
  parentId: string | undefined
  /** An array of IDs of the direct child nodes. */
  childrenIds: Array<string>

  /**
   * The configuration that will be used to generate children from this node.
   * This is inherited from the parent by default when the node is created.
   */
  config: MessageNodeConfig
}

export interface AppStore extends AppState {
  /**
   * Creates a new root node, starting a new conversation tree.
   * @param message The message content of the root node.
   * @param config The configuration for the new conversation.
   */
  createRootNode: (message: string, config: MessageNodeConfig) => void
  /**
   * Creates a new user message node as a child of an existing node.
   * @param message The message content.
   * @param parentId The ID of the parent node.
   * @returns The ID of the newly created node.
   */
  createUserNode: (message: string, parentId: string) => string
  /**
   * Creates a new empty assistant node as a child of an existing node.
   * @param parentId The ID of the parent node.
   * @returns The ID of the newly created node.
   */
  createAssistantNode: (parentId: string) => string
  /**
   * Updates a single node with new data.
   * @param nodeId The ID of the node to update.
   * @param data A partial object of the node's properties to update.
   */
  updateNode: (nodeId: string, data: Partial<MessageNode>) => void
  /**
   * Sets the currently active conversation tree.
   * @param id The root ID of the conversation tree to set as active.
   */
  setActiveConversationRootId: (id: string) => void
}

/**
 * Zustand store for managing the application state.
 * This includes all conversation trees and the active conversation.
 */
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

  updateNode: (nodeId: string, data: Partial<MessageNode>) => {
    set((state) => {
      const clonedNodes = new Map(state.nodes)

      const node = clonedNodes.get(nodeId)
      invariant(node, "Node not found")

      const updatedNode = { ...node, ...data }
      clonedNodes.set(nodeId, updatedNode)

      return { nodes: clonedNodes }
    })
  },

  setActiveConversationRootId: (id: string) => {
    set({ activeConversationRootId: id })
  },
}))
