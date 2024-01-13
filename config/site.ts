export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Tastebuds",
	description: "Cook together without the hassle.",
	navItems: [
		{
			label: "Home",
			href: "/",
		},
    {
      label: "Recipes",
      href: "/recipes",
    },
	],
	navMenuItems: [
		{
			label: "Profile",
			href: "/profile",
		},
		{
			label: "Dashboard",
			href: "/dashboard",
		},
		{
			label: "Projects",
			href: "/projects",
		},
		{
			label: "Team",
			href: "/team",
		},
		{
			label: "Calendar",
			href: "/calendar",
		},
		{
			label: "Settings",
			href: "/settings",
		},
		{
			label: "Help & Feedback",
			href: "/help-feedback",
		},
		{
			label: "Logout",
			href: "/logout",
		},
	],
};