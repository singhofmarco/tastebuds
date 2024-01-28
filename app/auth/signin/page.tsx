import { validateRequest } from '@/auth'
import { redirect } from 'next/navigation'
import { Link } from '@nextui-org/link'
import Image from 'next/image'
import { title } from '@/components/primitives'
import { SignInForm } from '@/components/signin-form'

export default async function SignIn() {
  const { user } = await validateRequest()
  if (user) redirect('/')

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          className="mx-auto h-16 w-auto"
          src="/logo.svg"
          alt="Tastebuds"
          width={680}
          height={823}
        />
        <h2
          className={title({
            size: 'sm',
            className: 'mt-6 block text-center',
          })}
        >
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-foreground-50 px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <SignInForm />
        </div>

        <p className="mt-10 text-center text-sm text-foreground-500">
          Not a member?{' '}
          <Link href="/auth/signup" size="sm">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  )
}
