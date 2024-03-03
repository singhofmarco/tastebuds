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

export function Providers({ children, themeProps, user }: ProvidersProps) {
  const router = useRouter()

  return (
    <UserContext.Provider value={user}>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </NextUIProvider>
    </UserContext.Provider>
  )
}
