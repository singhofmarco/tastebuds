import Link from 'next/link'

export default function BreadcrumbItem({
  href,
  current,
  children,
}: {
  href: string
  current?: boolean
  children: React.ReactNode
}) {
  return (
    <li>
      <div className="flex items-center">
        <svg
          className="h-5 w-5 flex-shrink-0 text-foreground-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
        </svg>
        <Link
          href={href}
          className="ml-4 text-sm font-medium text-foreground-600 hover:text-foreground-700"
          aria-current={current ? 'page' : undefined}
        >
          {children}
        </Link>
      </div>
    </li>
  )
}
