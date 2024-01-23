import { Button, ButtonGroup } from "@nextui-org/button"
import {
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
} from "@nextui-org/dropdown"
import { Spinner } from "@nextui-org/spinner"
import type { Selection } from "@react-types/shared"
import { useState } from "react"

export default function SaveRecipeButton({
  handleSaveRecipe,
  isSaving,
}: {
  handleSaveRecipe: (shouldGenerateImage: boolean) => void
  isSaving: boolean
}) {
  const [selectedOption, setSelectedOption] = useState("image")

  const descriptionsMap = {
    image:
      "Save the recipe and generate an image for it. This may take a few seconds.",
    saveOnly:
      "Save the recipe without generating an image. You can generate an image later.",
  }

  const labelsMap = {
    image: "Save & Generate Image",
    saveOnly: "Save only",
  }

  return (
    <ButtonGroup variant="flat">
      <Button
        onPress={() => handleSaveRecipe(selectedOption === "image")}
        color="primary"
        isDisabled={isSaving}
        endContent={isSaving && <Spinner size="sm" color="white" />}
      >
        {isSaving
          ? "Saving"
          : labelsMap[selectedOption as keyof typeof labelsMap]}
      </Button>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button isIconOnly>
            <svg
              fill="none"
              height="14"
              viewBox="0 0 24 24"
              width="14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
                fill="currentColor"
              />
            </svg>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Save options"
          selectedKeys={selectedOption}
          selectionMode="single"
          onSelectionChange={(keys: Selection) => {
            if (keys instanceof Set) {
              setSelectedOption(keys.entries().next().value[0])
            }
          }}
          className="max-w-[300px]"
        >
          <DropdownItem key="image" description={descriptionsMap["image"]}>
            {labelsMap["image"]}
          </DropdownItem>
          <DropdownItem
            key="saveOnly"
            description={descriptionsMap["saveOnly"]}
          >
            {labelsMap["saveOnly"]}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  )
}
