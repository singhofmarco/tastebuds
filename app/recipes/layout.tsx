import { validateRequest } from '@/auth'
import { redirect } from 'next/navigation'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await validateRequest()

  if (!user) {
    return redirect('/auth/signin')
  }

  return <div className="container mx-auto max-w-7xl mt-8">{children}</div>
}
