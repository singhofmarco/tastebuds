"use client";

import Image from "next/image";
import { AiIcon } from "./icons";
import { Button } from "@nextui-org/button";
import { Recipe } from "@prisma/client";
import { useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { generateImage } from "@/app/actions";

export default function RecipeImage({ recipe }: { recipe: Recipe }) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  return (
    <>
      {recipe.image ? (
        <div className="aspect-h-1 aspect-w-1 w-full">
          <Image
            className="h-full w-full object-cover object-center sm:rounded-lg shadow-lg"
            src={recipe.image}
            alt={recipe.title}
            width={1024}
            height={1024}
          />
        </div>
      ) : (
        <div className="relative w-full h-full p-48 shadow-md rounded-lg border flex justify-center items-center">
          <AiIcon className="absolute w-10 h-10 text-foreground" />
          <Button
            className="absolute bottom-4 right-0 left-0 mx-4"
            color="default"
            variant="solid"
            radius="sm"
            size="lg"
            isDisabled={isGenerating}
            endContent={isGenerating && <Spinner color="current" size="sm" />}
            onPress={async () => {
              setIsGenerating(true);
              await generateImage(recipe);
              setIsGenerating(false);
            }}
          >
            Generate Image
          </Button>
        </div>
      )}
    </>
  );
}
