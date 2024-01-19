"use client"

import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { GearIcon } from "./icons";
import { deleteRecipe } from "@/app/actions";
import { Recipe } from "@prisma/client";
import clsx from "clsx";

export default function RecipeDropdown({ recipe, className }: { recipe: Recipe, className?: string }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className={clsx(className, "flex items-center gap-2")}
          color="default"
          variant="bordered"
        >
          <GearIcon size={20} />
          <span className="hidden sm:block">Actions</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Actions">
        <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            variant="solid"
            onClick={async () => {
                await deleteRecipe(recipe).catch(() => {
                    alert("Unable to delete recipe.")
                })
            }}
        >
            Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
