import { Paper, Table, TypographyStylesProvider } from "@mantine/core"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import clsx from "clsx"
import Markdown from "markdown-to-jsx"

import { type AssistantMessageNode } from "~/src/stores/flow"

import classes from "./assistant-message.module.css"

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

      <Paper
        withBorder
        className={clsx("nowheel", classes.container)}
        p="md"
        shadow="md"
        w="min(calc(100vw - 2rem), 32rem)"
      >
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
      </Paper>
    </>
  )
}
