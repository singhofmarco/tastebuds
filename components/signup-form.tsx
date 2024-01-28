"use client"

import { SubmitButton } from "./submit-button";
import { Input } from "@nextui-org/input";
import { useFormState } from "react-dom";
import { signUp } from "@/app/actions";

const initialState = {
    errors: {
        name: undefined,
        email: undefined,
        password: undefined,
    },
}

export function SignUpForm() {
    const [state, formAction] = useFormState(signUp, initialState)

    return (
        <form action={formAction}>
              <div className="space-y-6">
                <div className="space-y-12">
                <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    label="Full name"
                    labelPlacement="outside"
                    placeholder="Enter your name"
                    isInvalid={state?.errors?.name !== undefined}
                    errorMessage={state?.errors?.name}
                    isRequired
                  />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    label="Email address"
                    labelPlacement="outside"
                    placeholder="Enter your email"
                    isInvalid={state?.errors?.email !== undefined}
                    errorMessage={state?.errors?.email}
                    isRequired
                  />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    label="Password"
                    labelPlacement="outside"
                    placeholder="Enter your password"
                    isInvalid={state?.errors?.password !== undefined}
                    errorMessage={state?.errors?.password}
                    isRequired
                  />
                </div>

                <SubmitButton>
                    Sign up
                </SubmitButton>
              </div>
            </form>
    )
}