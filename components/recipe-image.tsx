'use client'

import Image from 'next/image'
import { Button } from '@nextui-org/button'
import { useEffect, useState } from 'react'
import { Spinner } from '@nextui-org/spinner'
import { generateImage } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { useInterval } from '@/lib/use-interval'
import { SparklesIcon } from '@heroicons/react/24/solid'

export default function RecipeImage({
  recipeId,
  title,
  image,
  isGeneratingImage,
}: {
  recipeId: number
  title: string
  image: string | null
  isGeneratingImage: boolean
}) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState<boolean>(isGeneratingImage)

  useEffect(() => {
    setIsGenerating(isGeneratingImage)
  }, [isGeneratingImage])

  useInterval(
    () => {
      router.refresh()
    },
    isGenerating ? 2000 : null
  )

  return (
    <div className="select-none">
      <div className="aspect-square w-full">
        {image && !isGeneratingImage ? (
          <Image
            className="h-full w-full object-cover object-center sm:rounded-lg shadow-lg"
            src={image}
            alt={title}
            width={1024}
            height={1024}
          />
        ) : (
          <div className="relative w-full h-full shadow-md rounded-lg border flex justify-center items-center">
            {isGeneratingImage || isGenerating ? (
              <div className="absolute inset-0 flex flex-col gap-4 justify-center items-center">
                <Spinner color="primary" size="lg" />
                <span className="text-foreground-400">Generating...</span>
              </div>
            ) : (
              <>
                <SparklesIcon className="absolute w-10 h-10 text-foreground" />
                <Button
                  className="absolute bottom-4 right-0 left-0 mx-4"
                  color="default"
                  variant="solid"
                  radius="sm"
                  size="lg"
                  onPress={() => {
                    setIsGenerating(true)
                    generateImage(recipeId)
                  }}
                >
                  Generate Image
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
