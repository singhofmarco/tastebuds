"use client"

import {
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarMenu,
	NavbarMenuToggle,
	NavbarBrand,
	NavbarItem,
	NavbarMenuItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";
import { ThemeSwitch } from "@/components/theme-switch";
import Image from "next/image";
import { User } from "@nextui-org/user";
import UserDropdown from "./user-dropdown";
import { Divider } from "@nextui-org/divider";
import AddRecipeButton from "./add-recipe-button";
import { PlusIcon } from "./icons";
import { useState } from "react";

export const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<NextUINavbar
			maxWidth="xl"
			position="sticky"
			isMenuOpen={isMenuOpen}
			onMenuOpenChange={setIsMenuOpen}
		>
			<NavbarBrand className="max-w-fit">
				<NextLink className="flex justify-start items-center gap-2" href="/"
					onClick={() => setIsMenuOpen(false)}>
					<Image src="/logo.svg"
						alt="Tastebuds"
						width={680}
						height={823}
						className="w-10 h-10" />
					<p className="font-bold text-inherit tracking-tight">Tastebuds</p>
				</NextLink>
			</NavbarBrand>
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<ul className="hidden sm:flex gap-4 justify-start ml-6">
					{siteConfig.navItems.map((item) => (
						<NavbarItem key={item.href}>
							<NextLink
								className={clsx(
									linkStyles({ color: "foreground" }),
									"data-[active=true]:text-primary data-[active=true]:font-medium"
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
					<NavbarItem>
						<AddRecipeButton
							size="sm"
							startContent={<PlusIcon size={20} />}
							onClick={() => setIsMenuOpen(false)}
						>
							New Recipe
						</AddRecipeButton>
					</NavbarItem>

					<ThemeSwitch />

					<UserDropdown />
				</div>
			</NavbarContent>

			<NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
				<NavbarItem>
					<AddRecipeButton
						size="sm"
						startContent={<PlusIcon size={20} />}
						onClick={() => setIsMenuOpen(false)}
					>
						Recipe
					</AddRecipeButton>
				</NavbarItem>

				<NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
			</NavbarContent>

			<NavbarMenu>
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

					<User
						className="self-start gap-4 text-foreground-600"
						name="Marco Singhof"
						avatarProps={{
							src: "https://avatars.githubusercontent.com/u/6352336?v=4",
							isBordered: true,
							size: "sm",
						}}
					/>
					<div className="ml-12 flex flex-col gap-2">
					<NavbarMenuItem>
						<Link
							color="foreground"
							href="/team-settings"
							size="sm"
						>
							Team
						</Link>
					</NavbarMenuItem>
					<NavbarMenuItem>
						<Link
							color="foreground"
							href="/settings"
							size="sm"
						>
							Settings
						</Link>
					</NavbarMenuItem>
					<NavbarMenuItem>
						<Link
							color="danger"
							href="/logout"
							size="sm"
						>
							Log out
						</Link>
					</NavbarMenuItem>
					</div>
				</div>
			</NavbarMenu>
		</NextUINavbar>
	);
};
