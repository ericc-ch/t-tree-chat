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

import classes from "./user-message.module.css"

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

  const onDrop = async (newFiles: Array<File>) => {
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

      try {
        const result = await upload.mutateAsync(file.file)
        const fileUrl = pb.files.getURL(result, result.upload as string)

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
      } catch (error) {
        setFiles((oldFiles) =>
          oldFiles.filter((oldFile) => oldFile.name !== file.name),
        )

        notifications.show({
          message: `Failed to upload ${file.name}: ${(error as Error).message}`,
          color: "red",
          withBorder: true,
        })
      }
    }
  }

  const inputValue = JSON.stringify(
    files.map((file) => ({
      ...file,
      file: undefined,
    })),
  )

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
          className={classes.fileEntry}
          component={file.url ? "a" : "div"}
          // @ts-expect-error if url exists, it should be an anchor, if it's not, `href` gonna be undefined anyway
          href={file.url}
          target="_blank"
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
            className="nodrag"
            color="red"
            disabled={!file.uploaded}
            ml="auto"
            title="Delete node"
            variant="outline"
            onClick={(event) => {
              event.stopPropagation()

              setFiles((oldFiles) =>
                // eslint-disable-next-line max-nested-callbacks
                oldFiles.filter((oldFile) => oldFile.name !== file.name),
              )
            }}
          >
            <Icon icon="mingcute:delete-2-line" />
          </ActionIcon>
        </Group>
      ))}

      <input
        name={GENERATION_CONFIG_KEY.ATTACHMENTS}
        type="hidden"
        value={inputValue}
      />
    </Stack>
  )
}
