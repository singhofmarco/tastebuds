import { validateRequest } from '@/auth'
import { redirect } from 'next/navigation'
import MarketingHeader from '@/components/marketing/header'
import MarketingFeatures from '@/components/marketing/features'
import { Divider } from '@nextui-org/divider'

export default async function Home() {
  const { user } = await validateRequest()

  if (user) {
    return redirect('/recipes')
  }

  return (
    <>
      <MarketingHeader />

      <Divider className="mt-16" />

      <MarketingFeatures />
    </>
  )
}
