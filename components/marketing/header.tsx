import Image from 'next/image'
import TitleAnimation from '../title-animation'
import { subtitle, title } from '../primitives'
import { Link } from '@nextui-org/link'
import { Button } from '@nextui-org/button'
import LearnMoreButton from './lean-more-button'

export default function MarketingHeader() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 py-8 px-4 sm:px-0 md:py-10">
      <Image
        src="/logo.svg"
        alt="Tastebuds AI"
        width={680}
        height={823}
        className="w-48 h-48 select-none"
      />
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={title()}>Cook&nbsp;</h1>
        <TitleAnimation />
        <br />
        <h1 className={title()}>
          meals with your friends, without the hassle.
        </h1>
        <h2 className={subtitle({ class: 'mt-4' })}>
          With Tastebuds AI, and{' '}
          <span className="italic">the power of machine learning</span>,
          there&apos;s no need to put fun cooking nights on the back-burner.
        </h2>
      </div>

      <div className="max-w-[900px] gap-4 flex px-8">
        <Button
          variant="shadow"
          radius="md"
          color="primary"
          size="lg"
          as={Link}
          href="/auth/signin"
        >
          Get started
        </Button>
        <LearnMoreButton />
      </div>
    </section>
  )
}
