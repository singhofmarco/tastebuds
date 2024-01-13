import { title, subtitle } from "@/components/primitives";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";

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
				<Button variant="solid" size="lg" radius="sm"
					className="bg-gradient-to-tr from-pink-600 to-yellow-500 text-white"
				 	endContent={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
					</svg>
				}>
					Create a new recipe
				</Button>
				<Button variant="ghost" radius="sm" color="default" size="lg">
					Sign up
				</Button>
			</div>
		</section>
	);
}
