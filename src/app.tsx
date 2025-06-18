import type { MouseEvent } from "react"

import { MantineProvider } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import { QueryClientProvider } from "@tanstack/react-query"
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  SelectionMode,
  useReactFlow,
} from "@xyflow/react"

import classes from "./app.module.css"
import {
  ContextMenu,
  menuClickListener,
} from "./components/context-menu/context-menu"
import { AssistantMessageNode } from "./components/nodes/assistant-message/assistant-message"
import { UserMessageNode } from "./components/nodes/user-message/user-message"
import { TopLeftPanel } from "./components/panels/top-left"
import { NODE_ORIGIN } from "./lib/constants"
import { queryClient } from "./lib/query"

// Mantine
import "@mantine/core/styles.layer.css"
import "@mantine/notifications/styles.layer.css"
import "@mantine/dropzone/styles.layer.css"
// React Flow
import "@xyflow/react/dist/style.css"

// Custom
import "./styles/global.css"
import { useFlowStore, type FlowNode } from "./stores/flow"

const nodeTypes = {
  userMessage: UserMessageNode,
  assistantMessage: AssistantMessageNode,
  // Thanks TypeScript for `satisfies`
} satisfies Record<FlowNode["type"], unknown>

function Main() {
  const instance = useReactFlow()

  const nodes = useFlowStore((state) => state.nodes)
  const edges = useFlowStore((state) => state.edges)

  const onNodesChange = useFlowStore((state) => state.onNodesChange)

  const onContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    menuClickListener({ event, instance })
  }

  return (
    <main>
      <div className={classes.flowContainer}>
        <ReactFlow
          zoomOnDoubleClick
          edges={edges}
          nodeOrigin={NODE_ORIGIN}
          nodes={nodes}
          nodeTypes={nodeTypes}
          panOnDrag={false}
          panOnScroll={true}
          selectionMode={SelectionMode.Partial}
          onContextMenu={onContextMenu}
          onNodesChange={onNodesChange}
        >
          <Background gap={32} variant={BackgroundVariant.Cross} />
          <Controls />
          <MiniMap />

          {/* Panels */}
          <TopLeftPanel />
        </ReactFlow>
      </div>

      <ContextMenu />
    </main>
  )
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <MantineProvider>
          <Main />
          <Notifications position="bottom-center" />
        </MantineProvider>
      </ReactFlowProvider>
    </QueryClientProvider>
  )
}
