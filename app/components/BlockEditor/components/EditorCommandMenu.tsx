import { Icon } from '@/components/ui/Icon'
import { Toolbar } from '@/components/ui/Toolbar'
import { GROUPS } from '@/extensions/SlashCommand/groups'
import { Editor } from '@tiptap/react'
import * as Dropdown from '@radix-ui/react-dropdown-menu'
import { Surface } from '@/components/ui/Surface'
import { DropdownButton } from '@/components/ui/Dropdown'

export type EditorCommandMenuProps = {
  editor: Editor
}

export const EditorCommandMenu = ({ editor }: EditorCommandMenuProps) => {
  return (
    <div className="flex items-center gap-2">
      {GROUPS.map(group => (
        <Dropdown.Root key={group.name}>
          <Dropdown.Trigger asChild>
            <Toolbar.Button>
              {group.title}
              <Icon name="ChevronDown" className="w-2 h-2 ml-1" />
            </Toolbar.Button>
          </Dropdown.Trigger>
          <Dropdown.Content asChild>
            <Surface className="p-2 min-w-[10rem]">
              {group.commands.map(command => (
                <Dropdown.Item key={command.name}>
                  <DropdownButton onClick={() => command.action(editor)}>
                    <Icon name={command.iconName} />
                    {command.label}
                  </DropdownButton>
                </Dropdown.Item>
              ))}
            </Surface>
          </Dropdown.Content>
        </Dropdown.Root>
      ))}
    </div>
  )
}
