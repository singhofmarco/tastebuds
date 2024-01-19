import { Card, CardBody, CardFooter } from "@nextui-org/card";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { Recipe } from "@prisma/client";

export const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
    return (
        <Link
          href={`/recipes/${recipe.id}`}
          className="col-span-12 sm:col-span-3 h-[300px]"
        >
          <Card
              className="h-full group"
              isFooterBlurred>
                {recipe.image ? (
              <Image
                  alt="Card background"
                  className="z-0 w-full h-full object-cover sm:group-hover:scale-110 transition-transform"
                  src={recipe.image}
                  width={500}
                  height={625}
              />
              ) : (
                <CardBody className="p-4 flex space-y-5">
                  <div className="flex justify-between">
                    <div className="h-24 w-24 rounded-lg bg-default-200/50"></div>
                    <div className="space-y-3">
                      <div className="h-3 w-32 rounded-lg bg-default-100"></div>
                      <div className="h-3 w-12 rounded-lg bg-default-100"></div>
                      <div className="flex space-x-2">
                        <div className="h-3 w-7 rounded-md bg-default-200/70"></div>
                        <div className="h-3 w-7 rounded-md bg-default-200/70"></div>
                      </div>

                      <div className="h-6 w-full rounded-lg bg-default-100"></div>
                    </div>
                  </div>
                  <div className="space-y-3 flex flex-col items-end">
                      <div className="h-3 w-32 rounded-lg bg-default-100"></div>
                      <div className="h-3 w-32 rounded-lg bg-default-100"></div>
                      <div className="h-3 w-32 rounded-lg bg-default-100"></div>
                  </div>
                </CardBody>
              )}
              <CardFooter className="absolute z-10 bottom-0 flex-col !items-start">
                  <p className={clsx(recipe.image ? "text-white/60" : "text-foreground-500", "text-tiny uppercase font-bold")}>{ recipe.cuisineType }</p>
                  <h4 className={clsx(recipe.image ? "text-white" : "text-foreground",  "font-medium text-large")}>{ recipe.title }</h4>
              </CardFooter>
          </Card>
        </Link>
    )
}