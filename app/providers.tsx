'use client'

import * as React from 'react'
import { NextUIProvider } from '@nextui-org/system'
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { User } from 'lucia'

export interface ProvidersProps {
  children: React.ReactNode
  themeProps?: ThemeProviderProps
  user: User | null
}

export const UserContext = React.createContext<User | null>(null)
export const ViewContext = React.createContext<{
  view: 'list' | 'grid'
  setView: React.Dispatch<React.SetStateAction<'list' | 'grid'>>
}>({
  view: 'grid',
  setView: () => {},
})

export function Providers({ children, themeProps, user }: ProvidersProps) {
  const router = useRouter()

  const [view, setView] = React.useState<'list' | 'grid'>('grid')

  return (
    <UserContext.Provider value={user}>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>
          <ViewContext.Provider
            value={{
              view,
              setView,
            }}
          >
            {children}
          </ViewContext.Provider>
        </NextThemesProvider>
      </NextUIProvider>
    </UserContext.Provider>
  )
}
