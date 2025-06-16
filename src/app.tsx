import { MantineProvider } from "@mantine/core"
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

import { ContextMenu, menuClickListener } from "./components/context-menu"
import { AssistantMessageNode } from "./components/nodes/assistant-message/assistant-message"
import { UserMessageNode } from "./components/nodes/user-message/user-message"
import { Settings } from "./components/panels/settings"
import { NODE_ORIGIN } from "./lib/constants"
import { useFlowStore, type FlowNode } from "./stores/flow"

// Mantine
import "@mantine/core/styles.layer.css"
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
      <div style={{ width: "100v", height: "100vh" }}>
        <ReactFlow
          zoomOnDoubleClick
          edges={edges}
          nodeOrigin={NODE_ORIGIN}
          nodes={nodes}
          nodeTypes={nodeTypes}
          panOnDrag={false}
          panOnScroll={true}
          selectionMode={SelectionMode.Partial}
          onNodesChange={onNodesChange}
          onPaneClick={(event) => {
            menuClickListener({ event, instance })
          }}
        >
          <Background gap={32} variant={BackgroundVariant.Cross} />
          <Controls />
          <MiniMap />

          {/* Custom Components */}
          <Settings />
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
      </MantineProvider>
    </ReactFlowProvider>
  )
}
