import { Icon } from "@iconify/react/dist/iconify.js"
import {
  ActionIcon,
  Avatar,
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
import { useQuery } from "@tanstack/react-query"
import { GithubAuthProvider } from "firebase/auth"
import { useState, type FormEvent, type FormEventHandler } from "react"

import { getUser } from "~/src/api/get-user"
import { useSignIn } from "~/src/api/sign-in"
import { useSignOut } from "~/src/api/sign-out"
import { useSync } from "~/src/api/sync"
import { useSettingsStore } from "~/src/stores/settings"

import classes from "./sidebar.module.css"

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const setAPIKeys = useSettingsStore((store) => store.setAPIKeys)

  const onOpen = () => {
    setIsOpen(true)
  }
  const onClose = () => {
    setIsOpen(false)
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const openRouterAPIKey = data.get("openrouter") as string
    const googleAPIKey = data.get("google") as string

    setAPIKeys({ openRouterAPIKey, googleAPIKey })

    notifications.show({
      withBorder: true,
      message: "API keys saved!",
    })
  }

  const userQuery = useQuery(getUser)
  const signIn = useSignIn()
  const signOut = useSignOut()

  const sync = useSync()

  const onGithubSignIn = () => {
    signIn.mutate(new GithubAuthProvider())
  }

  const onSignOut = () => {
    signOut.mutate()
  }

  if (!isOpen) {
    return (
      <ActionIcon
        aria-label="Open sidebar"
        className={classes.toggleSidebar}
        size="lg"
        title="Open sidebar"
        variant="outline"
        onClick={onOpen}
      >
        <Icon icon="mingcute:align-arrow-right-fill" />
      </ActionIcon>
    )
  }

  const onSync = () => {
    sync.mutate(undefined, {
      onSuccess: () => {
        notifications.show({
          message: "Conversations synced successfully!",
          withBorder: true,
        })
      },
      onError: (error) => {
        notifications.show({
          message: error.message,
          color: "red",
          withBorder: true,
        })
      },
    })
  }

  return (
    <Paper
      withBorder
      className={classes.paper}
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
            onClick={onClose}
          >
            <Icon icon="mingcute:close-fill" />
          </ActionIcon>
        </Group>

        <Stack
          component="form"
          gap="md"
          onSubmit={onSubmit as unknown as FormEventHandler<HTMLDivElement>}
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

        <Divider my="lg" />

        <Stack gap="md">
          <div>
            <Title order={3}>Account</Title>
            <Text c="dimmed" size="sm">
              For syncing and stuff
            </Text>
            <Text c="dimmed" size="xs">
              (currently just syncing)
            </Text>
            <Text c="orange" mt="xs" size="xs">
              Note: API keys are saved locally and are not synced with your
              account.
            </Text>
          </div>

          {userQuery.data ?
            <>
              <Group>
                <Avatar
                  color="initials"
                  name={userQuery.data.displayName ?? "John Doe"}
                />
                <Text>{userQuery.data.displayName}</Text>
              </Group>

              <Stack gap="xs">
                <Button
                  leftSection={<Icon icon="uil:sync" />}
                  loading={sync.isPending}
                  type="submit"
                  variant="outline"
                  onClick={onSync}
                >
                  Sync now
                </Button>
                <Button
                  color="red"
                  leftSection={<Icon icon="mingcute:exit-fill" />}
                  loading={signOut.isPending}
                  type="submit"
                  variant="outline"
                  onClick={onSignOut}
                >
                  Sign out
                </Button>
              </Stack>
            </>
          : <Stack gap="xs">
              {/* TODO: Add more sign in options */}
              <Button
                leftSection={<Icon icon="mingcute:github-fill" />}
                type="submit"
                variant="outline"
                onClick={onGithubSignIn}
              >
                Sign in with GitHub
              </Button>
            </Stack>
          }
        </Stack>
      </Stack>
    </Paper>
  )
}
