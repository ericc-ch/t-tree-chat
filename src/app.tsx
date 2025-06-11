import { Button, MantineProvider, Paper } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import {
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react"

import { UserMessageNode } from "./components/nodes/user-message"
import { Settings } from "./components/panels/settings"
import { useFlowStore } from "./stores/flow"

// Mantine
import "@mantine/core/styles.layer.css"
// React Flow
import "@xyflow/react/dist/style.css"

// Custom
import "./styles/global.css"

const nodeTypes = {
  userMessage: UserMessageNode,
}

function Main() {
  const nodes = useFlowStore((state) => state.nodes)
  const edges = useFlowStore((state) => state.edges)

  const onNodesChange = useFlowStore((state) => state.onNodesChange)
  const createRootNode = useFlowStore((state) => state.createRootNode)

  return (
    <div style={{ width: "100v", height: "100vh" }}>
      <ReactFlow
        edges={edges}
        nodes={nodes}
        nodeTypes={nodeTypes}
        onContextMenu={() => false}
        onNodesChange={onNodesChange}
        onPaneClick={(event) => {
          const position = reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          })
          const newNode = {
            id: getId(),
            position,
            data: { label: `Node ${id}` },
          }
          setNodes((nds) => nds.concat(newNode))
        }}
      >
        <Background gap={32} variant={BackgroundVariant.Cross} />
        <Controls />
        <Settings />
        <Panel position="bottom-center">
          <Paper withBorder p="sm">
            <Button onClick={() => createRootNode()}>New</Button>
          </Paper>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export function App() {
  return (
    <MantineProvider>
      <ModalsProvider>
        <ReactFlowProvider>
          <Main />
        </ReactFlowProvider>
      </ModalsProvider>
    </MantineProvider>
  )
}
