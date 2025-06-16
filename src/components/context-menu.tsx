import type { ReactFlowInstance } from "@xyflow/react"
import type React from "react"

import { Icon } from "@iconify/react"
import { Menu } from "@mantine/core"
import invariant from "tiny-invariant"

import { MENU_TARGET } from "../lib/constants"
import { getMenuTarget } from "../lib/dom"
import { useFlowStore } from "../stores/flow"
import { useUIStore } from "../stores/ui"

export function ContextMenu() {
  const opened = useUIStore((state) => state.isContextMenuOpen)
  const close = useUIStore((state) => state.closeContextMenu)

  const createRootNode = useFlowStore((state) => state.createRootNode)

  return (
    <Menu
      hideDetached={false}
      opened={opened}
      position="right-start"
      shadow="md"
    >
      <Menu.Target>
        <div
          className={MENU_TARGET}
          data-position="0,0"
          style={{
            position: "fixed",
          }}
        ></div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<Icon fontSize={14} icon="mingcute:add-fill" />}
          onClick={() => {
            const menuTarget = getMenuTarget()
            const position = menuTarget.dataset.position
            invariant(position, "Menu target [data-position] not found")

            const [x, y] = position.split(",").map(Number)

            createRootNode({ position: { x, y } })
            close()
          }}
        >
          New Chat
        </Menu.Item>
        <Menu.Item
          leftSection={<Icon fontSize={14} icon="mingcute:key-2-fill" />}
        >
          Set API keys
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

interface menuClickListenerOptions {
  event: React.MouseEvent
  instance: ReactFlowInstance
}

export function menuClickListener(options: menuClickListenerOptions) {
  const position = options.instance.screenToFlowPosition({
    x: options.event.clientX,
    y: options.event.clientY,
  })

  const menuTarget = document.querySelector<HTMLDivElement>("." + MENU_TARGET)
  invariant(menuTarget, "Menu target not found")

  menuTarget.style.left = `${options.event.clientX}px`
  menuTarget.style.top = `${options.event.clientY}px`
  menuTarget.dataset.position = `${position.x},${position.y}`

  useUIStore.getState().toggleContextMenu()
}
