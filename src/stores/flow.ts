import {
  type Edge,
  type Node,
  type OnNodesChange,
  type XYPosition,
  addEdge,
  applyNodeChanges,
  getNodesBounds,
} from "@xyflow/react"
import invariant from "tiny-invariant"
import { create } from "zustand"

import { NODE_ORIGIN } from "../lib/constants"
import {
  DEFAULT_GENERATION_CONFIG,
  type GenerationConfig,
} from "../lib/generation"

export interface Attachment {
  type: "image" | "pdf"
  name: string
  url: string
}

interface MessageNodeData extends Record<string, unknown> {
  config: GenerationConfig

  message: string
  attachments: Array<Attachment>
  parentId?: string
  childrenIds: Array<string>
}

export type UserMessageNode = Node<MessageNodeData, "userMessage">
export type AssistantMessageNode = Node<MessageNodeData, "assistantMessage">

export type FlowNode = UserMessageNode | AssistantMessageNode

interface FlowState {
  nodes: Array<FlowNode>
  edges: Array<Edge>

  // React Flow handlers
  onNodesChange: OnNodesChange<FlowNode>

  // Custom chat actions
  createRootNode: (options: { position: XYPosition }) => string
  createUserNode: (options: { parentId: string }) => string
  createAssistantNode: (options: { parentId: string }) => string

  getDescendants: (nodeId: string) => Array<FlowNode>
  getAncestors: (nodeId: string) => Array<FlowNode>

  updateNode: (options: {
    nodeId: string
    updater: (data: MessageNodeData) => Partial<MessageNodeData>
  }) => void

  deleteNode: (nodeId: string) => void

  // Syncing
  exportJSON: () => string
  importJSON: (json: string, options?: { force?: boolean }) => string

  // Internal actions
  _createChildNode: (options: {
    parentId: string
    type: FlowNode["type"]
  }) => string
}

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  lastUpdated: undefined,

  // --- REACT FLOW HANDLERS ---
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    })
  },

  // --- CUSTOM CHAT ACTIONS ---
  createRootNode: ({ position }) => {
    const nodeId = crypto.randomUUID()
    const newNode: UserMessageNode = {
      id: nodeId,
      type: "userMessage",
      position,
      data: {
        message: "",
        attachments: [],
        parentId: undefined,
        childrenIds: [],
        config: structuredClone(DEFAULT_GENERATION_CONFIG),
      },
    }

    set({
      nodes: [...get().nodes, newNode],
    })

    return nodeId
  },

  _createChildNode: ({ parentId, type }) => {
    const nodeId = crypto.randomUUID()

    const newEdge: Edge = {
      id: `${parentId}>${nodeId}`,
      source: parentId,
      target: nodeId,
    }

    const { nodes, edges } = get()

    const parentNode = nodes.find((node) => node.id === parentId)
    invariant(parentNode, `Parent node not found for ${parentId}`)

    const parentRect = getNodesBounds([parentNode], { nodeOrigin: NODE_ORIGIN })
    const siblingCount = parentNode.data.childrenIds.length

    const HORIZONTAL_PADDING = 20
    const VERTICAL_PADDING = 40

    const newNode: FlowNode = {
      id: nodeId,
      type,
      position: {
        x:
          // Approximate offset from siblings
          // Also the last value is padding (only if there are siblings)
          // siblingCount * (16 * 24)
          // + parentNode.position.x
          // + siblingCount * HORIZONTAL_PADDING,

          // Turns out doing the above is kinda annoying
          parentNode.position.x + siblingCount * HORIZONTAL_PADDING,
        // Add some space between nodes (last value)
        y: parentRect.y + parentRect.height + VERTICAL_PADDING,
      },
      data: {
        message: "",
        attachments: [],
        parentId,
        childrenIds: [],
        config: structuredClone(parentNode.data.config),
      },
    }

    const updatedParentNode: FlowNode = {
      ...parentNode,
      data: {
        ...parentNode.data,
        childrenIds: [...parentNode.data.childrenIds, nodeId],
      },
    }

    set({
      nodes: nodes
        .map((node) => (node.id === parentId ? updatedParentNode : node))
        .concat(newNode),
      edges: addEdge(newEdge, edges),
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

  getDescendants: (nodeId: string) => {
    const descendants: Array<FlowNode> = []
    const { nodes } = get()

    const startNode = nodes.find((node) => node.id === nodeId)
    invariant(startNode, `Node not found for ${nodeId}`)

    const queue = [...startNode.data.childrenIds]

    while (queue.length > 0) {
      const currentId = queue.shift()
      if (!currentId) continue

      const currentNode = nodes.find((node) => node.id === currentId)
      if (currentNode) {
        descendants.push(currentNode)
        queue.push(...currentNode.data.childrenIds)
      }
    }

    return descendants
  },

  getAncestors: (nodeId: string) => {
    const ancestors: Array<FlowNode> = []
    const { nodes } = get()

    let currentNode = nodes.find((node) => node.id === nodeId)
    invariant(currentNode, `Node not found for ${nodeId}`)

    while (currentNode.data.parentId) {
      // currentNode should never be undefined though
      const parentNode = nodes.find(
        (node) => node.id === currentNode?.data.parentId,
      )
      if (!parentNode) break

      ancestors.unshift(parentNode)
      currentNode = parentNode
    }

    return ancestors
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

  deleteNode: (nodeId: string) => {
    const { getDescendants, nodes, edges } = get()

    const descendants = getDescendants(nodeId)
    const idsToDelete = new Set([nodeId, ...descendants.map((node) => node.id)])

    const nodeToDelete = nodes.find((node) => node.id === nodeId)
    invariant(nodeToDelete, `Node to delete not found for ${nodeId}`)

    const { parentId } = nodeToDelete.data

    const updatedNodes = nodes
      .filter((node) => !idsToDelete.has(node.id))
      .map((node) => {
        if (node.id === parentId) {
          return {
            ...node,
            data: {
              ...node.data,
              childrenIds: node.data.childrenIds.filter((id) => id !== nodeId),
            },
          }
        }
        return node
      })

    const updatedEdges = edges.filter(
      (edge) => !idsToDelete.has(edge.source) && !idsToDelete.has(edge.target),
    )

    set({
      nodes: updatedNodes,
      edges: updatedEdges,
    })
  },

  exportJSON: () => {
    const { nodes, edges } = get()
    return JSON.stringify({
      nodes,
      edges,
    })
  },

  importJSON: (json) => {
    const { nodes: importedNodes, edges: importedEdges } = JSON.parse(
      json,
    ) as Pick<FlowState, "nodes" | "edges">

    const { nodes: currentNodes, edges: currentEdges } = get()

    const nodeMap = new Map(importedNodes.map((node) => [node.id, node]))
    for (const node of currentNodes) {
      nodeMap.set(node.id, node)
    }

    const edgeMap = new Map(importedEdges.map((edge) => [edge.id, edge]))
    for (const edge of currentEdges) {
      edgeMap.set(edge.id, edge)
    }

    const mergedState = {
      nodes: Array.from(nodeMap.values()),
      edges: Array.from(edgeMap.values()),
    }

    set(mergedState)

    return JSON.stringify(mergedState)
  },
}))

export class ImportError extends Error {
  type: string

  constructor(message: string, { type }: { type: string }) {
    super(message)
    this.name = "ImportError"
    this.type = type
  }
}
