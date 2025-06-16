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
import { Handle, Position, type NodeProps } from "@xyflow/react"
import clsx from "clsx"
import Markdown from "markdown-to-jsx"

import { type AssistantMessageNode } from "~/src/stores/flow"

import classes from "./assistant-message.module.css"

// eslint-disable-next-line max-lines-per-function
export function AssistantMessageNode(props: NodeProps<AssistantMessageNode>) {
  const hasChild = props.data.childrenIds.length > 0

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
          <Badge color="blue">Assistant</Badge>

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

          <Group justify="end">
            <ActionIcon
              aria-label="Copy message"
              title="Copy message"
              variant="outline"
            >
              <Icon icon="mingcute:copy-2-fill" />
            </ActionIcon>
          </Group>
        </Stack>
      </Paper>
    </>
  )
}
