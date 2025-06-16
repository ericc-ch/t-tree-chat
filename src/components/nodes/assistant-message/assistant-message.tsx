import { Icon } from "@iconify/react"
import {
  ActionIcon,
  Badge,
  Box,
  Divider,
  Group,
  Paper,
  Stack,
  Table,
  TypographyStylesProvider,
} from "@mantine/core"
import { useClipboard } from "@mantine/hooks"
import {
  Handle,
  Position,
  useUpdateNodeInternals,
  type NodeProps,
} from "@xyflow/react"
import clsx from "clsx"
import Markdown from "markdown-to-jsx"

import { useFlowStore, type AssistantMessageNode } from "~/src/stores/flow"

import classes from "./assistant-message.module.css"

export function AssistantMessageNode(props: NodeProps<AssistantMessageNode>) {
  const hasChild = props.data.childrenIds.length > 0

  const clipboard = useClipboard()
  const updateNodeInternals = useUpdateNodeInternals()
  const deleteNode = useFlowStore((state) => state.deleteNode)
  const createUserNode = useFlowStore((state) => state.createUserNode)

  return (
    <>
      <Handle isConnectable={false} position={Position.Top} type="target" />

      {hasChild && (
        <Handle
          isConnectable={false}
          position={Position.Bottom}
          type="source"
        />
      )}

      <Paper withBorder p="md" shadow="md" w="min(calc(100vw - 2rem), 32rem)">
        <Stack gap="sm">
          <Group gap="xs">
            <Badge color="blue">Assistant</Badge>
            <Badge color="blue">{props.data.config.model}</Badge>
          </Group>

          <Divider />

          <Box className={clsx("nowheel", classes.container)}>
            {/* https://reactflow.dev/api-reference/react-flow#nowheelclassname */}
            <TypographyStylesProvider>
              <Markdown
                options={{
                  overrides: {
                    pre: {
                      props: {
                        className: classes.pre,
                      },
                    },
                    table: Table,
                    thead: Table.Thead,
                    tbody: Table.Tbody,
                    tr: Table.Tr,
                    td: Table.Td,
                    th: Table.Th,
                  },
                }}
              >
                {props.data.message}
              </Markdown>
            </TypographyStylesProvider>
          </Box>

          <Divider />

          <Group gap="xs" justify="end">
            <ActionIcon
              aria-label="Delete node"
              color="red"
              mr="auto"
              title="Delete node"
              variant="outline"
              onClick={() => {
                deleteNode(props.id)
              }}
            >
              <Icon icon="mingcute:delete-fill" />
            </ActionIcon>

            <ActionIcon
              aria-label="Copy message"
              title="Copy message"
              variant="outline"
              onClick={() => {
                clipboard.copy(props.data.message)
              }}
            >
              <Icon icon="mingcute:copy-2-fill" />
            </ActionIcon>
            <ActionIcon
              aria-label="Reply message"
              title="Reply message"
              variant="outline"
              onClick={() => {
                createUserNode({ parentId: props.id })

                // Call this to notify that we updated the state of the handler
                // because bottom handler only appears after we added a child
                // https://reactflow.dev/learn/troubleshooting#couldnt-create-edge-for-sourcetarget-handle-id-some-id-edge-id-some-id
                updateNodeInternals(props.id)
              }}
            >
              <Icon icon="mingcute:corner-up-left-fill" />
            </ActionIcon>
          </Group>
        </Stack>
      </Paper>
    </>
  )
}
