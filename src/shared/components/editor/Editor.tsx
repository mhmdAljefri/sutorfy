import { FC, useEffect } from "react"
import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { TRANSFORMERS } from "@lexical/markdown"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import {
  InitialEditorStateType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"

import ActionsPlugin from "./plugins/ActionsPlugin"
import ChangesListenerPlugin, {
  ChangesListenerPluginProps,
} from "./plugins/ChangesListenerPlugin"
import InitStatePlugin, {
  InitStatePluginProps,
} from "./plugins/InitStatePlugin"
// import ActionsPlugin from "./plugins/ActionsPlugin"
// import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin"
import ToolbarPlugin from "./plugins/ToolbarPlugin"
import exampleTheme from "./themes/example-theme"

function Placeholder() {
  return (
    <div className="editor-placeholder">
      Write the content using markdown here
    </div>
  )
}

const editorConfig = {
  editorState: null,
  namespace: "post",
  theme: exampleTheme,
  // Handling of errors during update
  onError(error) {
    throw error
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
}

type Props = {
  readOnly?: boolean
  state?: InitStatePluginProps["state"]
} & ChangesListenerPluginProps
const Editor: FC<Props> = ({ onChange, readOnly = false, state = null }) => {
  return (
    <LexicalComposer
      initialConfig={{
        ...editorConfig,
        editable: !readOnly,
      }}
    >
      <div className="editor-container">
        {/* <ToolbarPlugin /> */}
        <InitStatePlugin state={state} />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <ChangesListenerPlugin onChange={onChange} />
          {/* <CodeHighlightPlugin /> */}
        </div>
        {/* <ActionsPlugin /> */}
      </div>
    </LexicalComposer>
  )
}

export default Editor
