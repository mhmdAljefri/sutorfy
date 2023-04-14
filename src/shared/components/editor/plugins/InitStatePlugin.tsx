import { FC, useEffect } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { SerializedEditorState, SerializedLexicalNode } from "lexical"

type Props = { state?: SerializedEditorState<SerializedLexicalNode> }
const InitStatePlugin: FC<Props> = ({ state }) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (state?.root) {
      editor.setEditorState(editor.parseEditorState(state))

      return () => {}
    }
  }, [state, editor])

  return null
}

export default InitStatePlugin

export type { Props as InitStatePluginProps }
