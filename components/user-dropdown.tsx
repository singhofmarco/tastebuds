"use client";

import { Avatar } from "@nextui-org/avatar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";

export default function UserDropdown({ className }: { className?: string }) {
  return (
    <Dropdown className="select-none">
      <DropdownTrigger>
        <Avatar
          as="button"
          src="https://avatars.githubusercontent.com/u/6352336?v=4"
          className="transition-transform"
          name="Marco Singhof"
          isBordered
          size="sm"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="faded">
        <DropdownItem key="profile" className="h-14 gap-2" isReadOnly>
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">singhofmarco@gmail.com</p>
        </DropdownItem>
        <DropdownItem key="team_settings">Team</DropdownItem>
        <DropdownItem key="settings">Settings</DropdownItem>
        <DropdownItem key="logout" color="danger" className="text-danger">
          Log out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
