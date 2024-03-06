import {
  CloudArrowUpIcon,
  PaintBrushIcon,
  WindowIcon,
} from '@heroicons/react/20/solid'
import Image from 'next/image'

const features = [
  {
    name: 'Generate recipes.',
    description:
      'Use the power of machine learning to generate recipes that are perfect for you.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Beautiful images.',
    description:
      'Generate beautiful images of your recipes to share with friends.',
    icon: PaintBrushIcon,
  },
  {
    name: 'Desktop and phone.',
    description:
      'Tastebuds AI works on any device, so you can cook anywhere, anytime.',
    icon: WindowIcon,
  },
]

export default function MarketingFeatures() {
  return (
    <div className="overflow-hidden py-24 sm:py-32" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-primary">
                Cooking but tastier
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-foreground-900 sm:text-4xl">
                A better cookbook
              </p>
              <p className="mt-6 text-lg leading-8 text-foreground-600">
                Generate recipes, share them with friends, and cook together.
                Tastebuds AI is the best way to cook.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-foreground-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-foreground-900">
                      <feature.icon
                        className="absolute left-1 top-1 h-5 w-5 text-primary"
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <Image
            src="/example-recipe-light-screenshot.jpg"
            alt="Product screenshot"
            className="dark:hidden w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
            width={2432}
            height={1442}
          />
          <Image
            src="/example-recipe-dark-screenshot.jpg"
            alt="Product screenshot"
            className="hidden dark:block w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
            width={2432}
            height={1442}
          />
        </div>
      </div>
    </div>
  )
}
