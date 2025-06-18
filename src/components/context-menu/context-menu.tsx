import type { ReactFlowInstance } from "@xyflow/react"
import type { MouseEvent } from "react"

import { Icon } from "@iconify/react"
import { Menu } from "@mantine/core"
import clsx from "clsx"
import invariant from "tiny-invariant"

import { MENU_TARGET } from "../../lib/constants"
import { getMenuTarget } from "../../lib/dom"
import { useFlowStore } from "../../stores/flow"
import { useUIStore } from "../../stores/ui"
import classes from "./context-menu.module.css"

export function ContextMenu() {
  const opened = useUIStore((state) => state.isContextMenuOpen)
  const setOpened = useUIStore((state) => state.setContextMenuOpen)

  const createRootNode = useFlowStore((state) => state.createRootNode)

  return (
    <Menu
      hideDetached={false}
      opened={opened}
      position="right-start"
      shadow="md"
      onChange={setOpened}
    >
      <Menu.Target>
        <div
          className={clsx(MENU_TARGET, classes.target)}
          data-position="0,0"
        ></div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<Icon fontSize="0.875em" icon="mingcute:add-fill" />}
          onClick={() => {
            const menuTarget = getMenuTarget()
            const position = menuTarget.dataset.position
            invariant(position, "Menu target [data-position] not found")

            const [x, y] = position.split(",").map(Number)

            createRootNode({ position: { x, y } })
          }}
        >
          New Chat
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

interface menuClickListenerOptions {
  event: MouseEvent<HTMLDivElement>
  instance: ReactFlowInstance
}

export function menuClickListener(options: menuClickListenerOptions) {
  options.event.preventDefault()

  if (!(options.event.target instanceof HTMLElement)) return
  if (!options.event.target.classList.contains("react-flow__pane")) return

  const position = options.instance.screenToFlowPosition({
    x: options.event.clientX,
    y: options.event.clientY,
  })

  const menuTarget = document.querySelector<HTMLDivElement>("." + MENU_TARGET)
  invariant(menuTarget, "Menu target not found")

  menuTarget.style.left = `${options.event.clientX}px`
  menuTarget.style.top = `${options.event.clientY}px`
  menuTarget.dataset.position = `${position.x},${position.y}`

  useUIStore.getState().openContextMenu()
}
