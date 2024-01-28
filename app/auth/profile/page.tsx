import { validateRequest } from '@/auth'
import { redirect } from 'next/navigation'
import { signOut } from '@/app/actions'

export default async function Profiel() {
  const { user } = await validateRequest()
  if (!user) redirect('/auth/signin')

  return (
    <>
      <h1>Profile</h1>
      <p>User id: {user.id}</p>
      <p>Email: {user.email}</p>
      <form action={signOut}>
        <input type="submit" value="Sign out" />
      </form>
    </>
  )
}
