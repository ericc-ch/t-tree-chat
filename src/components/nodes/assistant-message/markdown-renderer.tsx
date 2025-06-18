import type { ComponentProps } from "react"

import { Box, Stack, Table, TypographyStylesProvider } from "@mantine/core"
import clsx from "clsx"
import Markdown from "markdown-to-jsx"

import classes from "./assistant-message.module.css"

const markdownOptions: ComponentProps<typeof Markdown>["options"] = {
  overrides: {
    pre: {
      props: {
        className: classes.pre,
      },
    },
    table: Table,
    thead: Table.Thead,
    tbody: Table.Tbody,
    tr: Table.Tr,
    td: Table.Td,
    th: Table.Th,
  },
}

interface MarkdownRendererProps {
  reasoning: string
  message: string
}

export function MarkdownRenderer(props: MarkdownRendererProps) {
  return (
    <div className={clsx("nowheel", classes.markdownRenderer)}>
      {/* https://reactflow.dev/api-reference/react-flow#nowheelclassname */}
      <TypographyStylesProvider>
        <Stack>
          {props.reasoning && (
            <Box bg="gray.1" className={classes.thoughtsRenderer} p="xs">
              <Markdown options={markdownOptions}>{props.reasoning}</Markdown>
            </Box>
          )}
          <Markdown options={markdownOptions}>{props.message}</Markdown>
        </Stack>
      </TypographyStylesProvider>
    </div>
  )
}
