import { MantineProvider } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
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
import { Sidebar } from "./components/panels/sidebar/sidebar"
import { NODE_ORIGIN } from "./lib/constants"
import { useFlowStore, type FlowNode } from "./stores/flow"

// Mantine
import "@mantine/core/styles.layer.css"
import "@mantine/notifications/styles.layer.css"
// import "@mantine/code-highlight/styles.layer.css"
// React Flow
import "@xyflow/react/dist/style.css"
// Highlight.js
// import "highlight.js/styles/github.css"

// Custom
import "./styles/global.css"

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
          onContextMenu={(event) => {
            event.preventDefault()
            menuClickListener({ event, instance })
          }}
          onNodesChange={onNodesChange}
        >
          <Background gap={32} variant={BackgroundVariant.Cross} />
          <Controls />
          <MiniMap />

          {/* Custom Components */}
          <Sidebar />
        </ReactFlow>
      </div>

      <ContextMenu />
    </main>
  )
}

export function App() {
  return (
    <ReactFlowProvider>
      <MantineProvider>
        <Main />
        <Notifications position="bottom-center" />
      </MantineProvider>
    </ReactFlowProvider>
  )
}
