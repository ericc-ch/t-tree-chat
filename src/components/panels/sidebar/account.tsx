import { Icon } from "@iconify/react/dist/iconify.js"
import { Avatar, Button, Group, Stack, Text, Title } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

import { getUser } from "~/src/api/get-user"
import { useSignIn } from "~/src/api/sign-in"
import { signOut } from "~/src/api/sign-out"
import { useSync } from "~/src/api/sync"

export function Account() {
  const userQuery = useQuery(getUser)
  const signIn = useSignIn()

  const sync = useSync()

  useEffect(() => {
    if (!userQuery.isSuccess) return
    sync.mutate({ pull: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sync.mutate, userQuery.isSuccess])

  const onGithubSignIn = () => {
    signIn.mutate("github")
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
          Note: API keys are saved locally and are not synced with your account.
        </Text>
      </div>

      {userQuery.data ?
        <>
          <Group>
            <Avatar color="initials" name={userQuery.data.name as string} />
            <Text>{userQuery.data.name}</Text>
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
              type="submit"
              variant="outline"
              onClick={signOut}
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
  )
}
