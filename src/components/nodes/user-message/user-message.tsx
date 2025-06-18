import { Handle, Position, type NodeProps } from "@xyflow/react"

import { type UserMessageNode } from "~/src/stores/flow"

import { Form } from "./form"

export function UserMessageNode(props: NodeProps<UserMessageNode>) {
  // Child node means it's not a root node
  const isChildNode = Boolean(props.data.parentId)
  const hasChild = props.data.childrenIds.length > 0

  return (
    <>
      {isChildNode && (
        <Handle isConnectable={false} position={Position.Top} type="target" />
      )}
      {hasChild && (
        <Handle
          isConnectable={false}
          position={Position.Bottom}
          type="source"
        />
      )}

      <Form {...props} />
    </>
  )
}
