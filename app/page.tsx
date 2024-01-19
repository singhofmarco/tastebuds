import { title, subtitle } from "@/components/primitives";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import AddRecipeButton from "@/components/add-recipe-button";

export default function Home() {
	return (
		<section className="flex flex-col items-center justify-center gap-8 py-8 md:py-10">
			<Image src="/logo.svg"
						 alt="Tastebuds"
						 width={680}
						 height={823}
						  className="w-48 h-48" />
			<div className="inline-block max-w-lg text-center justify-center">
				<h1 className={title()}>Cook&nbsp;</h1>
				<h1 className={title({ color: "yellow" })}>creative&nbsp;</h1>
				<br />
				<h1 className={title()}>
					meals with your friends, without the hassle.
				</h1>
				<h2 className={subtitle({ class: "mt-4" })}>
					With Tastebuds, and <mark className="bg-gradient-to-br from-50% from-red-600/75 to-orange-600/75 rounded-sm px-1 shadow-md text-white">the power of AI</mark>, there&apos;s no need to put fun cooking nights on the back-burner.
				</h2>
			</div>

			<div className="max-w-[900px] gap-4 flex px-8">
				<AddRecipeButton size="lg" />
				<Button variant="ghost" radius="sm" color="default" size="lg">
					Sign up
				</Button>
			</div>
		</section>
	);
}
