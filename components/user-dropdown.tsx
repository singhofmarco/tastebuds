'use client'

import { signOut } from '@/app/actions'
import { UserContext } from '@/app/providers'
import { Avatar } from '@nextui-org/avatar'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/dropdown'
import { useContext } from 'react'

export default function UserDropdown() {
  const user = useContext(UserContext)

  return (
    <Dropdown className="select-none">
      <DropdownTrigger>
        <Avatar
          as="button"
          src={undefined}
          fallback={user?.name.charAt(0)}
          className="transition-transform"
          isBordered
          size="sm"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="faded">
        <DropdownItem key="profile" className="h-14 gap-2" isReadOnly>
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{user?.email}</p>
        </DropdownItem>
        <DropdownItem key="team_settings">Team</DropdownItem>
        <DropdownItem key="settings">Settings</DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          className="text-danger"
          onPress={() => signOut()}
        >
          Sign out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
