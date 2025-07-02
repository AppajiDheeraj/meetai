"use client"

import { Card, CardContent } from "@/components/ui/card"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { OctagonAlertIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { FaGithub, FaGoogle } from "react-icons/fa"
import { useSearchParams } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z.string().min(1, { message: "Confirm Password is required" }),
}).refine((data => data.password === data.confirmPassword), {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const SignUpView = () => {
    const [error, setError] = useState<string | null>(null)
    const [pending, setPending] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const ref = searchParams.get("ref") ?? "";
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setError(null);
        setPending(true);
        authClient.signUp.email({
            name: data.name,
            email: data.email,
            password: data.password,
            callbackURL: "/"
        },
            {
                onSuccess: async () => {
                    setPending(false);
                    if (ref) {
                        await fetch("/api/referral", {
                            method: "POST",
                            body: JSON.stringify({ ref }),
                        });
                    }
                    await fetch("/api/send-welcome", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: data.email, name: data.name }),
                    });
                    router.push("/");
                },

                onError: ({ error }) => {
                    setPending(false);
                    setError(error.message);
                }
            });
    }

    const onSocial = (provider: "github" | "google") => {
        setError(null);
        setPending(true);
        authClient.signIn.social({
            provider: provider,
            callbackURL: "/"
        },
            {
                onSuccess: async () => {
                    setPending(false);
                    // if (ref) {
                    //     const decodedRef = decodeURIComponent(ref);
                    //     const [referrer] = await db
                    //         .select()
                    //         .from(user)
                    //         .where(eq(user.email, decodedRef));

                    //     if (referrer) {
                    //         await db.update(user)
                    //             .set({ referralCount: sql`${user.referralCount} + 1` })
                    //             .where(eq(user.id, referrer.id));
                    //     }
                    // }
                },

                onError: ({ error }) => {
                    setPending(false);
                    setError(error.message);
                }
            });
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
                                        Let&apos;s get started
                                    </h1>
                                    <p className="text-muted-foreground text-balance">
                                        Create your account
                                    </p>
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="John Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="********"
                                                            {...field}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                                        >
                                                            {showPassword ? (
                                                                <EyeOffIcon className="w-4 h-4" />
                                                            ) : (
                                                                <EyeIcon className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="********"
                                                            {...field}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                                        >
                                                            {showPassword ? (
                                                                <EyeOffIcon className="w-4 h-4" />
                                                            ) : (
                                                                <EyeIcon className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {!!error && (
                                    <Alert className="bg-destructive/10 border-none ">
                                        <OctagonAlertIcon className="h-4 w-4 !text-destructive " />
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                )}
                                <Button disabled={pending} className="w-full" type="submit">
                                    Sign Up
                                </Button>
                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                                        Or continue with
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant={"outline"}
                                        type="button"
                                        className="w-full"
                                        disabled={pending}
                                        onClick={() => { onSocial("google") }}>
                                        <FaGoogle />
                                    </Button>
                                    <Button variant={"outline"}
                                        type="button"
                                        className="w-full"
                                        disabled={pending}
                                        onClick={() => { onSocial("github") }}                                        >
                                        <FaGithub />
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Already have an account?{" "} <Link href={"/sign-in"} className="underline underline-offset-4">
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