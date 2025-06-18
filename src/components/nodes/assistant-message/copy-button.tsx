import { Icon } from "@iconify/react"
import { ActionIcon, Tooltip, type ActionIconProps } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useState } from "react"

import { sleep } from "~/src/lib/utils"

interface CopyButtonProps extends ActionIconProps {
  message: string
}

export function CopyButton({ message, ...props }: CopyButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setShowTooltip(true)
      await sleep(2000)
      setShowTooltip(false)
    } catch (error) {
      notifications.show({
        message: (error as Error).message,
        color: "red",
        withBorder: true,
      })
    }
  }

  return (
    <Tooltip label="Copied!" opened={showTooltip}>
      <ActionIcon
        {...props}
        aria-label="Copy message"
        className="nodrag"
        title="Copy message"
        variant="outline"
        onClick={copy}
      >
        <Icon icon="mingcute:copy-2-fill" />
      </ActionIcon>
    </Tooltip>
  )
}
