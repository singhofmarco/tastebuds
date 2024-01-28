import { validateRequest } from "@/auth";
import { SignUpForm } from "@/components/signup-form";
import { Link } from "@nextui-org/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { title } from "@/components/primitives";

export default async function SignUp() {
  const { user } = await validateRequest();
  if (user) redirect("/");

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Image
            className="mx-auto h-16 w-auto"
            src="/logo.svg"
            alt="Tastebuds"
            width={680}
            height={823}
          />
          <h2
            className={title({
              size: "sm",
              className: "mt-6 block text-center",
            })}
          >
            Create an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-foreground-50 px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <SignUpForm />
          </div>

          <p className="mt-10 text-center text-sm text-foreground-500">
            Already a member?{" "}
            <Link href="/auth/signin" size="sm">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
  );
}
