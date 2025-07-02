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
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { setPasswordAction } from "@/app/actions/set-password"

const formSchema = z.object({
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
            message: "Password must contain at least one uppercase letter, one lowercase letter, and one number" 
        }),
    confirmPassword: z.string().min(1, { message: "Confirm Password is required" }),
}).refine((data => data.password === data.confirmPassword), {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const ResetPasswordView = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null)
    const [pending, setPending] = useState(false);
    const router = useRouter();
    
    const { data: userProfile, isLoading } = useQuery(
        trpc.settings.getProfile.queryOptions()
    )
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setError(null);
        setPending(true);

        try {
            const res = await setPasswordAction(data.password);

            if (!res.success) {
                throw new Error(res.message || "Failed to set password");
            }

            // Invalidate and refetch the user profile data
            await queryClient.invalidateQueries(
                trpc.settings.getProfile.queryOptions()
            );

            // Also invalidate any other related queries
            await queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey.some(key => 
                        typeof key === 'string' && 
                        (key.includes('settings') || key.includes('profile') || key.includes('user'))
                    );
                }
            });

            // Force a refetch of the profile data
            await queryClient.refetchQueries(
                trpc.settings.getProfile.queryOptions()
            );

            toast.success("Password set successfully. You can now enable 2FA.");
            
            // Small delay to ensure data is updated before navigation
            setTimeout(() => {
                router.push("/settings");
            }, 500);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong");
            }
        } finally {
            setPending(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-md mx-auto mt-8">
            <Card className="overflow-hidden p-0">
                <CardContent className="p-6 md:p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">
                                        Set Password
                                    </h1>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Set a password for your account to enable Two-Factor Authentication
                                    </p>
                                </div>
                                
                                <div className="grid gap-3">
                                    <div>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            value={userProfile?.email || ""}
                                            disabled
                                            readOnly
                                            placeholder="user@example.com"
                                            className="bg-muted"
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="password" 
                                                        placeholder="Enter your new password" 
                                                        {...field} 
                                                    />
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
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="password" 
                                                        placeholder="Confirm your new password" 
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                
                                {!!error && (
                                    <Alert className="bg-destructive/10 border-destructive/20">
                                        <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                                        <AlertTitle className="text-destructive">{error}</AlertTitle>
                                    </Alert>
                                )}
                                
                                <div className="flex gap-2">
                                    <Button 
                                        type="button"
                                        variant="outline" 
                                        onClick={() => router.push("/settings")}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        disabled={pending} 
                                        className="flex-1" 
                                        type="submit"
                                    >
                                        {pending ? "Setting Password..." : "Set Password"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            
            <div className="text-muted-foreground text-center text-sm text-balance">
                <p>
                    By setting a password, you agree to our{" "}
                    <a href="/terms" className="underline underline-offset-4 hover:text-primary">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
                        Privacy Policy
                    </a>.
                </p>
            </div>
        </div>
    )
}

