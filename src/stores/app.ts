import {
  type Edge,
  type Node,
  type OnNodesChange,
  addEdge,
  applyNodeChanges,
} from "@xyflow/react"
import invariant from "tiny-invariant"
import { create } from "zustand"

export interface MessageNodeData extends Record<string, unknown> {
  role: "user" | "assistant"
  message: string
  config: MessageNodeConfig

  parentId?: string
  childrenIds: Array<string>
}

export type UserMessageNode = Node<MessageNodeData, "userMessage">
export type AssistantMessageNode = Node<MessageNodeData, "assistantMessage">

export type AppNode = UserMessageNode | AssistantMessageNode

export interface MessageNodeConfig {
  model: string
  system: string
}

export interface AppState {
  nodes: Array<AppNode>
  edges: Array<Edge>
  rootNodeIds: Array<string>
  activeConversationRootId?: string

  // React Flow handlers
  onNodesChange: OnNodesChange<AppNode>

  // Custom chat actions
  createRootNode: (config: MessageNodeConfig, message: string) => string
  createUserNode: (parentId: string, message: string) => string
  createAssistantNode: (parentId: string) => string
  updateNode: (
    nodeId: string,
    updater: (data: MessageNodeData) => Partial<MessageNodeData>,
  ) => void
  setActiveConversationRootId: (id: string) => void

  // Internal actions
  _createChildNode: (
    parentId: string,
    role: "user" | "assistant",
    message: string,
  ) => string
}

// eslint-disable-next-line max-lines-per-function
export const useAppStore = create<AppState>((set, get) => ({
  nodes: [],
  edges: [],
  rootNodeIds: [],
  activeConversationRootId: undefined,

  // --- REACT FLOW HANDLERS ---
  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }))
  },

  // --- CUSTOM CHAT ACTIONS ---
  createRootNode: (config, message) => {
    const nodeId = crypto.randomUUID()
    const newNode = {
      id: nodeId,
      type: "userMessage",
      position: { x: 0, y: 0 },
      data: {
        role: "user",
        message,
        config,
        parentId: undefined,
        childrenIds: [],
      },
    } satisfies UserMessageNode

    set((state) => ({
      nodes: [...state.nodes, newNode],
      rootNodeIds: [...state.rootNodeIds, newNode.id],
    }))

    return nodeId
  },

  _createChildNode: (
    parentId: string,
    role: "user" | "assistant",
    message: string,
  ) => {
    const nodeId = crypto.randomUUID()

    const newEdge: Edge = {
      id: `e${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
    }

    const parentNode = get().nodes.find((node) => node.id === parentId)
    invariant(parentNode, "Parent node not found")

    const newNode = {
      id: nodeId,
      type: "userMessage",
      position: {
        x: parentNode.position.x,
        y: parentNode.position.y + 120,
      },
      data: {
        role,
        message,
        config: parentNode.data.config, // Inherit config
        parentId,
        childrenIds: [],
      },
    } satisfies UserMessageNode

    set((state) => {
      const updatedParentNode = {
        ...parentNode,
        data: {
          ...parentNode.data,
          childrenIds: [...parentNode.data.childrenIds, nodeId],
        },
      } satisfies AppNode

      return {
        nodes: state.nodes
          .map((n) => (n.id === parentId ? updatedParentNode : n))
          .concat(newNode),
        edges: addEdge(newEdge, state.edges),
      }
    })

    return nodeId
  },

  createUserNode: (parentId: string, message: string) => {
    return get()._createChildNode(parentId, "user", message)
  },

  createAssistantNode: (parentId: string) => {
    return get()._createChildNode(parentId, "assistant", "")
  },

  updateNode: (nodeId, updater) => {
    const updateNodes = get().nodes.map((node) => {
      if (node.id === nodeId) {
        const clonedNode = structuredClone(node)
        const newData = updater(clonedNode.data)

        clonedNode.data = {
          ...clonedNode.data,
          ...newData,
        }

        return clonedNode
      }

      return node
    })

    set({
      nodes: updateNodes,
    })
  },

  setActiveConversationRootId: (id) => {
    set({ activeConversationRootId: id })
  },
}))

export type CreateChildNode = ReturnType<
  typeof useAppStore.getState
>["_createChildNode"]
