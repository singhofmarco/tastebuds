import Breadcrumbs from "@/components/breadcrumbs";
import BreadcrumbItem from "@/components/breadcrumb-item";
import { subtitle, title } from "@/components/primitives";
import Image from "next/image";
import { Skeleton } from "@nextui-org/skeleton";
import { Chip } from "@nextui-org/chip";
import { ClockIcon, GearIcon, GlobeIcon } from "@/components/icons";
import { Button } from "@nextui-org/button";

export default function Loading() {
  return (
    <>
      <Breadcrumbs className="hidden md:block">
        <BreadcrumbItem href="/recipes">Recipes</BreadcrumbItem>
        <BreadcrumbItem href="#" current>
          Loading...
        </BreadcrumbItem>
      </Breadcrumbs>

      <div className="md:mt-8 lg:grid lg:grid-cols-5 lg:items-start lg:gap-x-8">
        <div className="col-span-2">
          <Skeleton>
            <div className="aspect-h-1 aspect-w-1 w-full">
              <div className="max-h-full max-w-full object-cover object-center sm:rounded-lg">
                <Image
                  alt="Card background"
                  className="z-0 w-full h-full object-cover sm:group-hover:scale-110 transition-transform"
                  src=""
                  width={1024}
                  height={1024}
                />
              </div>
            </div>
          </Skeleton>
        </div>

        <div className="col-span-3 mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <div className="flex justify-between">
            <div>
              <Skeleton>
                <h1 className={title()}>Mediterranean Chicken Pasta</h1>
              </Skeleton>

              <div className="mt-4 flex items-center gap-4">
                <Chip
                  aria-label="Cuisine Type"
                  color="primary"
                  variant="flat"
                  startContent={<GlobeIcon />}
                >
                  <div className="w-20" />
                </Chip>
                <Chip
                  startContent={<ClockIcon />}
                  color="success"
                  variant="flat"
                >
                  <div className="w-20" />
                </Chip>
              </div>
            </div>

            <Button
              className="ml-4 flex items-center gap-2"
              color="default"
              variant="faded"
              disabled
            >
              <GearIcon size={20} />
              <span className="hidden sm:block">Actions</span>
            </Button>
          </div>

          <Skeleton className="mt-6 w-full h-28 rounded-md" />

          <section aria-labelledby="details-heading" className="mt-12">
            <h2 id="details-heading" className="sr-only">
              Additional details
            </h2>

            <div>
              <h3 className={subtitle()}>Ingredients</h3>

              <div className="mt-4">
                <div className="space-y-2 text-sm">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-96" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-52" />
                  <Skeleton className="h-4 w-72" />
                  <Skeleton className="h-4 w-80" />
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h2 className={subtitle()}>Steps</h2>

              <div className="mt-4">
                <div className="space-y-2 text-sm">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-96" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-52" />
                  <Skeleton className="h-4 w-72" />
                  <Skeleton className="h-4 w-80" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}