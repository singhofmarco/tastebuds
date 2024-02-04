import { title, subtitle } from "@/components/primitives";
import { Image } from "@nextui-org/image";

export default function Home() {
	return (
		<section className="flex flex-col items-center justify-center h-full gap-8 ">
			<Image src="/logo.svg"
						 alt="Tastebuds AI"
						 width={680}
						 height={823}
						  className="w-48 h-48" />
			<div className="inline-block max-w-lg text-center justify-center">
				<h1 className={title()}>Tastebuds&nbsp;</h1>
				<h1 className={title({ color: "yellow" })}>AI&nbsp;</h1>
			</div>

			<div className="max-w-[900px]">
				Coming soon...
			</div>
		</section>
	);
}
