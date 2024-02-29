'use client'

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from '@nextui-org/navbar'
import { Link } from '@nextui-org/link'
import { link as linkStyles } from '@nextui-org/theme'
import { siteConfig } from '@/config/site'
import NextLink from 'next/link'
import clsx from 'clsx'
import { ThemeSwitch } from '@/components/theme-switch'
import Image from 'next/image'
import { User } from '@nextui-org/user'
import UserDropdown from './user-dropdown'
import { Divider } from '@nextui-org/divider'
import AddRecipeButton from './add-recipe-button'
import { PlusIcon } from '@heroicons/react/16/solid'
import React, { useContext, useState } from 'react'
import { signOut } from '@/app/actions'
import { UserContext } from '@/app/providers'

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const user = useContext(UserContext)

  return (
    <NextUINavbar
      className="select-none"
      maxWidth="xl"
      position="sticky"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarBrand className="max-w-fit">
        <NextLink
          className="flex justify-start items-center gap-2"
          href={user ? '/recipes' : '/'}
          onClick={() => setIsMenuOpen(false)}
        >
          <Image
            src="/logo.svg"
            alt="Tastebuds AI"
            width={680}
            height={823}
            className="w-10 h-10"
          />
          <p className="font-bold text-inherit tracking-tight">Tastebuds AI</p>
        </NextLink>
      </NavbarBrand>
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <ul className="hidden sm:flex gap-4 justify-start ml-6">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium'
                )}
                color="foreground"
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <div className="hidden sm:flex gap-6">
          {user && (
            <NavbarItem>
              <AddRecipeButton
                size="sm"
                startContent={<PlusIcon className="w-4 h-4" />}
                onClick={() => setIsMenuOpen(false)}
              >
                New Recipe
              </AddRecipeButton>
            </NavbarItem>
          )}

          <ThemeSwitch />

          {user ? (
            <UserDropdown />
          ) : (
            <Link color="foreground" href="/auth/signin" size="sm">
              Sign in
            </Link>
          )}
        </div>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        {user && (
          <NavbarItem>
            <AddRecipeButton
              size="sm"
              startContent={<PlusIcon className="h-4 w-4" />}
              onClick={() => setIsMenuOpen(false)}
            >
              Recipe
            </AddRecipeButton>
          </NavbarItem>
        )}

        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>

      <NavbarMenu className="select-none">
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color="foreground"
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}

          <Divider className="mt-2 mb-4" />

          {user ? (
            <>
              <User
                className="self-start gap-4 text-foreground-600"
                name={user.name}
                avatarProps={{
                  fallback: user.name.charAt(0),
                  src: undefined,
                  isBordered: true,
                  size: 'sm',
                }}
              />
              <div className="ml-12 flex flex-col gap-2">
                <NavbarMenuItem>
                  <Link
                    color="danger"
                    size="sm"
                    onPress={() => {
                      signOut()
                      setIsMenuOpen(false)
                    }}
                  >
                    Sign out
                  </Link>
                </NavbarMenuItem>
              </div>
            </>
          ) : (
            <NavbarMenuItem>
              <Link
                color="foreground"
                href="/auth/signin"
                size="sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign in
              </Link>
            </NavbarMenuItem>
          )}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  )
}
