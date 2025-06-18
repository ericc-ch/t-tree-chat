import { Icon } from "@iconify/react"
import {
  ActionIcon,
  Badge,
  Box,
  Divider,
  Group,
  Paper,
  Stack,
} from "@mantine/core"
import { Handle, Position, type NodeProps } from "@xyflow/react"

import { useFlowStore, type AssistantMessageNode } from "~/src/stores/flow"

import classes from "./assistant-message.module.css"
import { CopyButton } from "./copy-button"
import { MarkdownRenderer } from "./markdown-renderer"
import { ReplyButton } from "./reply-button"

export function AssistantMessageNode(props: NodeProps<AssistantMessageNode>) {
  const hasChild = props.data.childrenIds.length > 0

  const deleteNode = useFlowStore((state) => state.deleteNode)
  const onDelete = () => {
    deleteNode(props.id)
  }

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
        className={classes.paper}
        p="md"
        shadow="md"
        w="min(calc(100vw - 2rem), 32rem)"
      >
        <Stack gap="sm">
          <Group gap="xs">
            <Badge color="teal">Assistant</Badge>
            <Badge color="teal">{props.data.config.model}</Badge>

            <ActionIcon
              aria-label="Delete node"
              color="red"
              ml="auto"
              title="Delete node"
              variant="outline"
              onClick={onDelete}
            >
              <Icon icon="mingcute:close-fill" />
            </ActionIcon>
          </Group>

          <Divider />

          <Box my="sm">
            <MarkdownRenderer markdown={props.data.message} />
          </Box>

          <Divider />

          <Group gap="xs" justify="end">
            <CopyButton message={props.data.message} />
            <ReplyButton nodeId={props.id} />
          </Group>
        </Stack>
      </Paper>
    </>
  )
}
