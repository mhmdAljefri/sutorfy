import { FC, useEffect, useRef } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

type Props = { onChange?: (state) => void }
const ChangesListenerPlugin: FC<Props> = ({ onChange }) => {
  const [editor] = useLexicalComposerContext()
  const timerRef = useRef(null)

  useEffect(() => {
    const removeUpdateListener = editor.registerUpdateListener(
      ({ editorState }) => {
        editorState.read(() => {
          clearTimeout(timerRef.current)

          timerRef.current = setTimeout(() => {
            onChange?.(editorState)
          }, 1000)
        })
      }
    )

    return () => {
      removeUpdateListener()
      clearTimeout(timerRef.current)
    }
  }, [editor, onChange])

  return null
}

export default ChangesListenerPlugin
export type { Props as ChangesListenerPluginProps }
