import { Button, Group, Input, Paper, Stack } from "@mantine/core"
import { Panel } from "@xyflow/react"
import { useState } from "react"

import { useSettingsStore } from "~/src/stores/settings"

// eslint-disable-next-line max-lines-per-function
export function Settings() {
  const [isOpen, setIsOpen] = useState(false)
  const setAPIKeys = useSettingsStore((store) => store.setAPIKeys)

  if (!isOpen) {
    return (
      <Panel position="center-left">
        <Button
          onClick={() => {
            setIsOpen(true)
          }}
        >
          Settings
        </Button>
      </Panel>
    )
  }

  return (
    <Panel position="center-left">
      <Paper withBorder h="16rem" p="sm">
        <Stack
          component="form"
          h="100%"
          onSubmit={(e) => {
            e.preventDefault()

            const data = new FormData(
              e.currentTarget as unknown as HTMLFormElement,
            )
            const openRouterAPIKey = data.get("openrouter") as string
            const googleAPIKey = data.get("google") as string

            console.log(openRouterAPIKey, googleAPIKey)

            setAPIKeys({ openRouterAPIKey, googleAPIKey })
          }}
        >
          <Input name="openrouter" placeholder="OpenRouter API Key" />
          <Input name="google" placeholder="Gemini API Key" />

          <Group mt="auto">
            <Button type="submit">Save</Button>
            <Button
              variant="default"
              onClick={() => {
                setIsOpen(false)
              }}
            >
              Close
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Panel>
  )
}
