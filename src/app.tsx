import { Button, MantineProvider, Menu, Paper, Text } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import {
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  SelectionMode,
  useReactFlow,
} from "@xyflow/react"
import { useState } from "react"
import invariant from "tiny-invariant"

import { UserMessageNode } from "./components/nodes/user-message"

// Mantine
import "@mantine/core/styles.layer.css"
// React Flow
import "@xyflow/react/dist/style.css"

// Custom
import "./styles/global.css"
import { Settings } from "./components/panels/settings"
import { useFlowStore } from "./stores/flow"

const nodeTypes = {
  userMessage: UserMessageNode,
}

// eslint-disable-next-line max-lines-per-function
function Main() {
  const instance = useReactFlow()

  const nodes = useFlowStore((state) => state.nodes)
  const edges = useFlowStore((state) => state.edges)

  const onNodesChange = useFlowStore((state) => state.onNodesChange)
  const createRootNode = useFlowStore((state) => state.createRootNode)

  const [opened, setOpened] = useState(false)
  // const [position, setPosition] = useState({ x: 0, y: 0 })

  return (
    <main>
      <div style={{ width: "100v", height: "100vh" }}>
        <ReactFlow
          edges={edges}
          nodeOrigin={[0.5, 0.5]}
          nodes={nodes}
          nodeTypes={nodeTypes}
          panOnDrag={false}
          panOnScroll={true}
          selectionMode={SelectionMode.Partial}
          onNodesChange={onNodesChange}
          onPaneClick={(event) => {
            const position = instance.screenToFlowPosition({
              x: event.clientX,
              y: event.clientY,
            })

            const menuTarget =
              document.querySelector<HTMLDivElement>(".menuTarget")
            invariant(menuTarget, "Menu target not found")

            menuTarget.style.left = `${event.clientX}px`
            menuTarget.style.top = `${event.clientY}px`

            // setOpened((prev) => !prev)

            // createRootNode({ position })
          }}
        >
          <Background gap={32} variant={BackgroundVariant.Cross} />
          <Controls />
          <Settings />
          <Panel position="bottom-center">
            <Paper withBorder p="sm">
              <Button
                onClick={() => createRootNode({ position: { x: 0, y: 0 } })}
              >
                New
              </Button>
            </Paper>
          </Panel>
        </ReactFlow>
      </div>

      <Menu opened={opened} shadow="md" width={200} onChange={setOpened}>
        <Menu.Target>
          <div
            className="menuTarget"
            style={{
              position: "fixed",
            }}
          ></div>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Application</Menu.Label>
          <Menu.Item>Settings</Menu.Item>
          <Menu.Item
            rightSection={
              <Text c="dimmed" size="xs">
                ⌘K
              </Text>
            }
          >
            Search
          </Menu.Item>

          <Menu.Divider />
        </Menu.Dropdown>
      </Menu>
    </main>
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
