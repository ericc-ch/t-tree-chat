import {
  type Edge,
  type Node,
  type OnNodesChange,
  type XYPosition,
  addEdge,
  applyNodeChanges,
} from "@xyflow/react"
import invariant from "tiny-invariant"
import { create } from "zustand"

import { GOOGLE_MODELS } from "../providers/google"

export interface MessageNodeData extends Record<string, unknown> {
  config: GenerationConfig

  parentId?: string
  childrenIds: Array<string>
}

export type UserMessageNode = Node<MessageNodeData, "userMessage">
export type AssistantMessageNode = Node<MessageNodeData, "assistantMessage">

export type FlowNode = UserMessageNode | AssistantMessageNode

export interface GenerationConfig {
  userPrompt: string
  model: string
  systemPrompt: string
  temperature: number
  thinkingMode: boolean
  thinkingBudget: number
}

export interface FlowState {
  nodes: Array<FlowNode>
  edges: Array<Edge>
  rootNodeIds: Array<string>
  activeConversationRootId?: string

  // React Flow handlers
  onNodesChange: OnNodesChange<FlowNode>

  // Custom chat actions
  createRootNode: (options: { position: XYPosition }) => string
  createUserNode: (options: { parentId: string }) => string
  createAssistantNode: (options: { parentId: string }) => string
  updateNode: (options: {
    nodeId: string
    updater: (data: MessageNodeData) => Partial<MessageNodeData>
  }) => void
  setActiveConversationRootId: (options: { id: string }) => void

  // Internal actions
  _createChildNode: (options: {
    parentId: string
    type: FlowNode["type"]
  }) => string
}

// eslint-disable-next-line max-lines-per-function
export const useFlowStore = create<FlowState>((set, get) => ({
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
  createRootNode: ({ position }) => {
    const nodeId = crypto.randomUUID()
    const newNode: UserMessageNode = {
      id: nodeId,
      type: "userMessage",
      position,
      data: {
        config: {
          userPrompt: "",
          model: GOOGLE_MODELS[0].value,
          systemPrompt: "",
          temperature: 0.5,
          thinkingMode: false,
          thinkingBudget: 0,
        },
        parentId: undefined,
        childrenIds: [],
      },
    }

    set((state) => ({
      nodes: [...state.nodes, newNode],
      rootNodeIds: [...state.rootNodeIds, newNode.id],
    }))

    return nodeId
  },

  _createChildNode: ({ parentId, type }) => {
    const nodeId = crypto.randomUUID()

    const newEdge: Edge = {
      id: `${parentId}>${nodeId}`,
      source: parentId,
      target: nodeId,
    }

    const parentNode = get().nodes.find((node) => node.id === parentId)
    invariant(parentNode, `Parent node not found for ${parentId}`)

    const newNode: FlowNode = {
      id: nodeId,
      type,
      position: {
        x: parentNode.position.x,
        y: parentNode.position.y + 400,
      },
      data: {
        config: parentNode.data.config,
        parentId,
        childrenIds: [],
      },
    }

    set((state) => {
      const updatedParentNode: FlowNode = {
        ...parentNode,
        data: {
          ...parentNode.data,
          childrenIds: [...parentNode.data.childrenIds, nodeId],
        },
      }

      return {
        nodes: state.nodes
          .map((n) => (n.id === parentId ? updatedParentNode : n))
          .concat(newNode),
        edges: addEdge(newEdge, state.edges),
      }
    })

    return nodeId
  },

  createUserNode: ({ parentId }) => {
    return get()._createChildNode({
      parentId,
      type: "userMessage",
    })
  },

  createAssistantNode: ({ parentId }) => {
    return get()._createChildNode({
      parentId,
      type: "assistantMessage",
    })
  },

  updateNode: ({ nodeId, updater }) => {
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

  setActiveConversationRootId: ({ id }) => {
    set({ activeConversationRootId: id })
  },

  getAncestors: (nodeId: string) => {
    const ancestors: Array<FlowNode> = []
    const { nodes } = get()

    let currentNode = nodes.find((n) => n.id === nodeId)

    while (currentNode?.data.parentId) {
      const parentNode = nodes.find((n) => n.id === currentNode.data.parentId)
      if (parentNode) {
        ancestors.unshift(parentNode)
        currentNode = parentNode
      } else {
        break
      }
    }

    return ancestors
  },
}))
