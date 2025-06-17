import { Icon } from "@iconify/react/dist/iconify.js"
import { Group, ThemeIcon } from "@mantine/core"
import { Panel } from "@xyflow/react"

import { useUIStore } from "~/src/stores/ui"

import { Sidebar } from "./sidebar/sidebar"

export function TopLeftPanel() {
  return (
    <>
      <Panel position="top-left">
        <Group align="start">
          <Sidebar />
          <SyncIndicator />
        </Group>
      </Panel>
    </>
  )
}

const SyncIndicator = () => {
  const isSyncing = useUIStore((state) => state.isSyncing)

  return isSyncing ?
      <ThemeIcon>
        <Icon className="spin-cc" icon="uil:sync" />
      </ThemeIcon>
    : undefined
}
