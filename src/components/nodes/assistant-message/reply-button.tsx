import { Icon } from "@iconify/react"
import { ActionIcon, type ActionIconProps } from "@mantine/core"
import { useUpdateNodeInternals } from "@xyflow/react"

import { useFlowStore } from "~/src/stores/flow"

interface ReplyButtonProps extends ActionIconProps {
  nodeId: string
}

export function ReplyButton({ nodeId, ...props }: ReplyButtonProps) {
  const updateNodeInternals = useUpdateNodeInternals()
  const createUserNode = useFlowStore((state) => state.createUserNode)

  const onClick = () => {
    createUserNode({ parentId: nodeId })

    // Call this to notify that we updated the state of the handler
    // because bottom handler only appears after we added a child
    // https://reactflow.dev/learn/troubleshooting#couldnt-create-edge-for-sourcetarget-handle-id-some-id-edge-id-some-id
    updateNodeInternals(nodeId)
  }

  return (
    <ActionIcon
      {...props}
      aria-label="Reply message"
      title="Reply message"
      variant="outline"
      onClick={onClick}
    >
      <Icon icon="mingcute:corner-up-left-fill" />
    </ActionIcon>
  )
}
