import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code"
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";

export default function Home() {
	return (
		<section className="flex flex-col items-center justify-center gap-8 py-8 md:py-10">
			<div className="inline-block max-w-lg text-center justify-center">
				<h1 className={title()}>Cook&nbsp;</h1>
				<h1 className={title({ color: "violet" })}>creative&nbsp;</h1>
				<br />
				<h1 className={title()}>
					meals with your friends, without the hassle.
				</h1>
				<h2 className={subtitle({ class: "mt-4" })}>
					Beautiful, fast and modern React UI library.
				</h2>
			</div>

			<div className="max-w-[900px] gap- grid grid-cols-12 grid-rows-2 px-8">
				<Card className="col-span-12 sm:col-span-4 h-[300px]"
				isPressable
				isFooterBlurred>
					<Image
						removeWrapper
						alt="Card background"
						className="z-0 w-full h-full object-cover"
						src="https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					/>
					<CardFooter className="absolute z-10 bottom-0 flex-col !items-start"
					>
						<p className="text-tiny text-white/60 uppercase font-bold">Essentials</p>
						<h4 className="text-white font-medium text-large">Noodle Soup</h4>
					</CardFooter>
				</Card>
			</div>
		</section>
	);
}
