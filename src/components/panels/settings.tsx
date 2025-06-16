import { Icon } from "@iconify/react/dist/iconify.js"
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { Panel } from "@xyflow/react"
import { useState } from "react"

import { useSettingsStore } from "~/src/stores/settings"
import { useUIStore } from "~/src/stores/ui"

import classes from "./settings.module.css"

// eslint-disable-next-line max-lines-per-function
export function Settings() {
  const [isOpen, setIsOpen] = useState(false)
  const setAPIKeys = useSettingsStore((store) => store.setAPIKeys)
  const closeContextMenu = useUIStore((store) => store.closeContextMenu)

  if (!isOpen) {
    return (
      <Panel position="top-left">
        <ActionIcon
          aria-label="Open settings"
          className={classes.toggleSettings}
          size="lg"
          title="Open settings"
          variant="outline"
          onClick={() => {
            setIsOpen(true)
            closeContextMenu()
          }}
        >
          <Icon icon="mingcute:align-arrow-right-fill" />
        </ActionIcon>
      </Panel>
    )
  }

  return (
    <Panel position="center-left">
      <Paper withBorder h="calc(100vh - 2rem)" p="sm" shadow="lg" w="16rem">
        <Stack gap={0}>
          <Group justify="end">
            <ActionIcon
              aria-label="Close settings"
              title="Close settings"
              variant="outline"
              onClick={() => {
                setIsOpen(false)
              }}
            >
              <Icon icon="mingcute:close-fill" />
            </ActionIcon>
          </Group>

          <Stack
            component="form"
            gap="md"
            onSubmit={(e) => {
              e.preventDefault()

              const data = new FormData(
                e.currentTarget as unknown as HTMLFormElement,
              )
              const openRouterAPIKey = data.get("openrouter") as string
              const googleAPIKey = data.get("google") as string

              setAPIKeys({ openRouterAPIKey, googleAPIKey })

              notifications.show({
                withBorder: true,
                message: "API keys saved!",
                color: "green",
              })
            }}
          >
            <Title order={3}>API Keys</Title>

            <Stack gap="xs">
              <PasswordInput
                label="OpenRouter API Key"
                name="openrouter"
                placeholder="sk-or-..."
              />
              <PasswordInput
                label="Gemini API Key"
                name="google"
                placeholder="AIzaSy..."
              />
            </Stack>

            <Group justify="end">
              <Button
                leftSection={<Icon icon="mingcute:save-2-fill" />}
                type="submit"
              >
                Save
              </Button>
            </Group>
          </Stack>

          <Divider my="xl" />

          <Stack gap="md">
            <Box>
              <Title order={3}>Account</Title>
              <Text c="dimmed" size="sm">
                For syncing and stuff
                <br />
                (currently just syncing)
              </Text>
            </Box>

            <Stack gap="xs">
              <Button
                leftSection={<Icon icon="mingcute:google-fill" />}
                type="submit"
                variant="outline"
              >
                Sign in with Google
              </Button>
              <Button
                leftSection={<Icon icon="mingcute:github-fill" />}
                type="submit"
                variant="outline"
              >
                Sign in with GitHub
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Panel>
  )
}
