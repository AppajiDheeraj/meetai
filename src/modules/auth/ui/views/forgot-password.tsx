"use client"

import { Card, CardContent } from "@/components/ui/card"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { OctagonAlertIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { toast } from "sonner"

const formSchema = z.object({
    email: z.string().email(),
})

export const ForgotPasswordView = () => {
    const [error] = useState<string | null>(null)
    const [pending] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (formData: z.infer<typeof formSchema>) => {
        const response = await authClient.signIn.magicLink({
            email: formData.email,
            callbackURL: "/meetings", //redirect after successful login (optional)
        });
        if (response.error) {
            toast.error("Failed to send magic link: " + response.error.message);
        }
        console.log(formData.email);
    }


    return (
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2" >
                    <Form {...form}>
                        <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">
                                        Login via Magic Link
                                    </h1>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        We&apos;ll send a login link to your email. No password needed.
                                    </p>
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="m@gmail.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex justify-end text-xs">
                                        <Link href="/forgot-password" className="text-muted-foreground hover:text-primary underline underline-offset-4">
                                            Try another way?
                                        </Link>
                                    </div>
                                </div>
                                {!!error && (
                                    <Alert className="bg-destructive/10 border-none ">
                                        <OctagonAlertIcon className="h-4 w-4 !text-destructive " />
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                )}
                                <Button disabled={pending} onClick={form.handleSubmit(onSubmit)} className="w-full" type="submit">
                                    Send Magic Link
                                </Button>
                                <div className="after:border-border relative text-center text-sm after:absolute 
                after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                                        Or continue with
                                    </span>
                                </div>
                                
                                <div className="text-center text-sm text-accent-foreground">
                                     Already remember your password?{" "} <Link href={"/sign-in"} className="underline underline-offset-4">
                                        Sign in
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>

                    <div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center">
                        <img src={"/logo.svg"} alt="Meet.AI Logo" className="w-[92px] h-[92px]" />
                        <p className="text-2xl font-semibold text-white">
                            Meet.AI
                        </p>
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-sm text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our{" "}
                <a href="/terms">Terms of Service</a> and{" "}
                <a href="/privacy">Privacy Policy</a>.
            </div>
        </div>
    )
}