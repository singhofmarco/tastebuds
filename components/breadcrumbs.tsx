import Link from 'next/link'
import { HomeIcon } from './icons'
import clsx from 'clsx'

export default function Breadcrumbs({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <nav
      className={clsx(className, 'flex select-none')}
      aria-label="Breadcrumb"
    >
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link
              href="/"
              className="text-foreground-500 hover:text-foreground-700"
            >
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {children}
      </ol>
    </nav>
  )
}
