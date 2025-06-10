import { Button, Input, Paper, Stack } from "@mantine/core"
import { Panel } from "@xyflow/react"

import { useSettingsStore } from "~/src/stores/settings"

export function Settings() {
  const setAPIKeys = useSettingsStore((store) => store.setAPIKeys)

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

          <Button mt="auto" type="submit">
            Save
          </Button>
        </Stack>
      </Paper>
    </Panel>
  )
}
