import { Icon } from "@iconify/react/dist/iconify.js"
import { ActionIcon, Divider, Group, Paper, Stack } from "@mantine/core"

import { useUIStore } from "~/src/stores/ui"

import { Account } from "./account"
import { APIKeys } from "./api-keys"
import classes from "./sidebar.module.css"

export function Sidebar() {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen)
  const openSidebar = useUIStore((state) => state.openSidebar)
  const closeSidebar = useUIStore((state) => state.closeSidebar)

  return (
    <>
      <ActionIcon
        aria-label="Open sidebar"
        display={isSidebarOpen ? "none" : "block"}
        size="lg"
        title="Open sidebar"
        variant="outline"
        onClick={openSidebar}
      >
        <Icon icon="mingcute:align-arrow-right-fill" />
      </ActionIcon>
      <Paper
        withBorder
        className={classes.paper}
        display={isSidebarOpen ? "block" : "none"}
        h="calc(100vh - 2rem)"
        p="sm"
        shadow="lg"
        w="16rem"
      >
        <Stack gap={0}>
          <Group justify="end">
            <ActionIcon
              aria-label="Close sidebar"
              title="Close sidebar"
              variant="outline"
              onClick={closeSidebar}
            >
              <Icon icon="mingcute:close-fill" />
            </ActionIcon>
          </Group>

          <APIKeys />
          <Divider my="md" />
          <Account />
        </Stack>
      </Paper>
    </>
  )
}
