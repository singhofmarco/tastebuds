'use client'

import { ArrowDownIcon } from '@heroicons/react/24/solid'
import { Button } from '@nextui-org/button'

export default function LearnMoreButton() {
  return (
    <Button
      variant="light"
      radius="md"
      size="lg"
      onPress={() => {
        const features = document.getElementById('features')
        features?.scrollIntoView({ behavior: 'smooth' })
      }}
      endContent={<ArrowDownIcon className="w-5 h-5" />}
    >
      Learn more
    </Button>
  )
}
