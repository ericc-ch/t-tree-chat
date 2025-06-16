import type { ComponentProps } from "react"

import { Table, TypographyStylesProvider } from "@mantine/core"
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
  markdown: string
}

export function MarkdownRenderer(props: MarkdownRendererProps) {
  return (
    <div className={clsx("nowheel", classes.markdownRenderer)}>
      {/* https://reactflow.dev/api-reference/react-flow#nowheelclassname */}
      <TypographyStylesProvider>
        <Markdown options={markdownOptions}>{props.markdown}</Markdown>
      </TypographyStylesProvider>
    </div>
  )
}
