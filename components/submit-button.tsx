"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@nextui-org/button"
import { Spinner } from "@nextui-org/spinner"

export function SubmitButton({ children }: { children: React.ReactNode }) {
    const { pending } = useFormStatus()

    return (
        <Button
            type="submit"
            color="primary"
            size="lg"
            radius="md"
            fullWidth
            disabled={pending}
            endContent={pending ? (<Spinner color="white" size="sm" />) : undefined}
        >
            { children }
        </Button>
    )
}