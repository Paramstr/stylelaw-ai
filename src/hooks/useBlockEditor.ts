import { useEffect, useState } from 'react'
import { useEditor, useEditorState } from '@tiptap/react'
import type { AnyExtension, Editor } from '@tiptap/core'

import { ExtensionKit } from '@/extensions/extension-kit'
import { initialContent } from '@/lib/data/initialContent'
import { Ai } from '@/extensions/Ai'
import { AiImage, AiWriter } from '@/extensions'

declare global {
  interface Window {
    editor: Editor | null
  }
}

export const useBlockEditor = ({
  aiToken,
  userId,
  userName = 'Maxi',
}: {
  aiToken?: string
  userId?: string
  userName?: string
}) => {
  const editor = useEditor(
    {
      immediatelyRender: true,
      shouldRerenderOnTransaction: false,
      autofocus: true,
      onCreate: ctx => {
        if (ctx.editor.isEmpty) {
          ctx.editor.commands.setContent(initialContent)
          ctx.editor.commands.focus('start', { scrollIntoView: true })
        }
      },
      extensions: [
        ...ExtensionKit(),
        aiToken
          ? AiWriter.configure({
              authorId: userId,
              authorName: userName,
            })
          : undefined,
        aiToken
          ? AiImage.configure({
              authorId: userId,
              authorName: userName,
            })
          : undefined,
        aiToken ? Ai.configure({ token: aiToken }) : undefined,
      ].filter((e): e is AnyExtension => e !== undefined),
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          class: 'min-h-full',
        },
      },
    },
    [],
  )

  window.editor = editor

  return { editor }
}
