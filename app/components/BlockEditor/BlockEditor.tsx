import { EditorContent } from '@tiptap/react'
import React, { useRef } from 'react'

import { LinkMenu } from '../menus'
import { useBlockEditor } from '@/hooks/useBlockEditor'
import '@/styles/index.css'

import { Sidebar } from '../Sidebar'
import ImageBlockMenu from '@/extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '@/extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '@/extensions/Table/menus'
import { EditorHeader } from './components/EditorHeader'
import { TextMenu } from '../menus/TextMenu'
import { ContentItemMenu } from '../menus/ContentItemMenu'
import { useSidebar } from '@/hooks/useSidebar'

export const BlockEditor = ({ aiToken }: { aiToken?: string }) => {
  const menuContainerRef = useRef(null)
  const leftSidebar = useSidebar()
  const { editor } = useBlockEditor({ aiToken })

  if (!editor) {
    return null
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))]" ref={menuContainerRef}>
      <Sidebar isOpen={leftSidebar.isOpen} onClose={leftSidebar.close} editor={editor} />
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        <EditorHeader editor={editor} isSidebarOpen={leftSidebar.isOpen} toggleSidebar={leftSidebar.toggle} />
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
        <ContentItemMenu editor={editor} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
  )
}

export default BlockEditor
