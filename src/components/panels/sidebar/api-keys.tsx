import { Icon } from "@iconify/react/dist/iconify.js"
import { Button, Group, PasswordInput, Stack, Title } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { type FormEvent, type FormEventHandler } from "react"

import { useSettingsStore } from "~/src/stores/settings"

export function APIKeys() {
  const openRouterAPIKey = useSettingsStore((state) => state.openRouterAPIKey)
  const googleAPIKey = useSettingsStore((state) => state.googleAPIKey)

  const setAPIKeys = useSettingsStore((store) => store.setAPIKeys)
  const reset = useSettingsStore((store) => store.reset)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const openRouterAPIKey = data.get("openRouter") as string
    const googleAPIKey = data.get("google") as string

    setAPIKeys({ openRouterAPIKey, googleAPIKey })

    notifications.show({
      withBorder: true,
      message: "API keys saved!",
    })
  }

  return (
    <Stack
      component="form"
      gap="md"
      onReset={reset}
      onSubmit={onSubmit as unknown as FormEventHandler<HTMLDivElement>}
    >
      <Title order={3}>API Keys</Title>

      <Stack gap="xs">
        <PasswordInput
          defaultValue={googleAPIKey}
          label="Gemini API Key"
          name="google"
          placeholder="AIzaSy..."
        />
        <PasswordInput
          defaultValue={openRouterAPIKey}
          label="OpenRouter API Key"
          name="openRouter"
          placeholder="sk-or-..."
        />
      </Stack>

      <Group gap="xs" justify="end">
        <Button
          leftSection={<Icon icon="mingcute:delete-back-fill" />}
          type="reset"
          variant="outline"
        >
          Reset
        </Button>
        <Button
          leftSection={<Icon icon="mingcute:save-2-fill" />}
          type="submit"
        >
          Save
        </Button>
      </Group>
    </Stack>
  )
}
