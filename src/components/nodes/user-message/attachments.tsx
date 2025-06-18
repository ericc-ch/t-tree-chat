import { Icon } from "@iconify/react"
import {
  ActionIcon,
  Group,
  Loader,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core"
import { Dropzone, MIME_TYPES } from "@mantine/dropzone"
import { notifications } from "@mantine/notifications"
import { useState } from "react"
import invariant from "tiny-invariant"

import type { AttachmentsCapabilities } from "~/src/lib/generation"
import type { Attachment, UserMessageNode } from "~/src/stores/flow"

import { useUpload } from "~/src/api/upload"
import { GENERATION_CONFIG_KEY } from "~/src/lib/constants"
import { pb } from "~/src/lib/pocketbase"

const buildAcceptProp = (capabilities: AttachmentsCapabilities) => {
  const mimeTypes: Array<string> = []

  if (capabilities.image) {
    mimeTypes.push(MIME_TYPES.jpeg, MIME_TYPES.png)
  }

  if (capabilities.pdf) {
    mimeTypes.push(MIME_TYPES.pdf)
  }
  return mimeTypes
}

interface UploadedAttachment extends Omit<Attachment, "url"> {
  uploaded: boolean
  file?: File
  url?: string
}

interface AttachmentsProps {
  capabilities: AttachmentsCapabilities
  defaultValues: UserMessageNode["data"]["attachments"]
}

export function Attachments(props: AttachmentsProps) {
  const accept = buildAcceptProp(props.capabilities)

  const upload = useUpload()

  const [files, setFiles] = useState<Array<UploadedAttachment>>(
    props.defaultValues.map((attachment) => ({
      ...attachment,
      uploaded: true,
    })),
  )

  const onDrop = (newFiles: Array<File>) => {
    const unique = newFiles.filter((newFile) => {
      return !files.some((oldFile) => oldFile.name === newFile.name)
    })

    const transformed = unique.map(
      (file): UploadedAttachment => ({
        name: file.name,
        uploaded: false,
        type: file.type.startsWith("image") ? "image" : "pdf",
        file,
      }),
    )

    setFiles((files) => [...files, ...transformed])

    for (const file of transformed) {
      // `file` should not be undefined since these are the uploaded ones
      invariant(file.file, "File should not be undefined")

      upload.mutate(file.file, {
        onSuccess: (data) => {
          const fileUrl = pb.files.getURL(data, data.upload as string)

          setFiles((oldFiles) =>
            oldFiles.map((oldFile) => {
              if (oldFile.name === file.name) {
                return {
                  ...oldFile,
                  uploaded: true,
                  url: fileUrl,
                }
              }

              return oldFile
            }),
          )
        },
        onError: () => {
          setFiles((oldFiles) =>
            oldFiles.filter((oldFile) => oldFile.name !== file.name),
          )

          notifications.show({
            message: `Failed to upload ${file.name}`,
            color: "red",
            withBorder: true,
          })
        },
      })
    }
  }

  return (
    <Stack gap="4">
      <Dropzone accept={accept} mb="4" p="xs" onDrop={onDrop}>
        <Group gap="xs" justify="center">
          <ThemeIcon c="dimmed" variant="transparent">
            <Icon icon="mingcute:attachment-fill" />
          </ThemeIcon>
          <Text c="dimmed" size="sm">
            Upload attachments
          </Text>
        </Group>
      </Dropzone>

      {files.map((file) => (
        <Group
          key={file.name}
          style={{
            borderColor: "var(--mantine-color-gray-4)",
            borderStyle: "solid",
            borderWidth: "1px",
            borderRadius: "var(--mantine-radius-default)",
            padding: "var(--mantine-spacing-xs)",
          }}
        >
          <ThemeIcon variant="light">
            {file.uploaded ?
              <Icon icon="mingcute:document-2-fill" />
            : <Loader size="xs" />}
          </ThemeIcon>
          <Text c={file.uploaded ? undefined : "dimmed"} size="sm">
            {file.name}
          </Text>

          <ActionIcon
            aria-label="Delete node"
            color="red"
            disabled={!file.uploaded}
            ml="auto"
            title="Delete node"
            variant="outline"
            onClick={() => {
              setFiles((oldFiles) =>
                // eslint-disable-next-line max-nested-callbacks
                oldFiles.filter((oldFile) => oldFile.name !== file.name),
              )
            }}
          >
            <Icon icon="mingcute:close-fill" />
          </ActionIcon>
        </Group>
      ))}

      <input name={GENERATION_CONFIG_KEY.ATTACHMENTS} type="hidden" />
    </Stack>
  )
}
