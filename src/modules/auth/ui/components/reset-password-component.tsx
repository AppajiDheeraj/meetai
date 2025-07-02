// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Alert, AlertTitle } from "@/components/ui/alert"
// import { Card, CardContent } from "@/components/ui/card"
// import { OctagonAlertIcon } from "lucide-react";

// const formSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(1, { message: "Password is required" }),
//   confirmPassword: z.string().min(1, { message: "Confirm Password is required" }),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"],
// });

// export function ResetPasswordView({ userProfile }: { userProfile: { email: string } }) {
//   const [error, setError] = useState<string | null>(null);
//   const [pending, setPending] = useState(false);
//   const router = useRouter();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: userProfile.email,
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   const onSubmit = async (data: z.infer<typeof formSchema>) => {
//     setError(null);
//     setPending(true);
//     try {
//       const res = await fetch("/api/set-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ newPassword: data.password }),
//       });

//       if (!res.ok) {
//         const json = await res.json();
//         throw new Error(json.message || "Failed to set password");
//       }

//       toast.success("Password set successfully.");
//       router.push("/settings");
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setPending(false);
//     }
//   };

//     return (
//         <div className="flex flex-col gap-6">
//             <Card className="overflow-hidden p-0">
//                 <CardContent className="grid p-0 md:grid-cols-2" >
//                     <Form {...form}>
//                         <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
//                             <div className="flex flex-col gap-6">
//                                 <div className="flex flex-col items-center text-center">
//                                     <h1 className="text-2xl font-bold">
//                                         Reset Password
//                                     </h1>
//                                 </div>
//                                 <div className="grid gap-3">
//                                     <FormField
//                                         control={form.control}
//                                         name="email"
//                                         disabled={true}
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel>Email</FormLabel>
//                                                 <FormControl>
//                                                     <Input placeholder="m@gmail.com" {...field} />
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                     <FormField
//                                         control={form.control}
//                                         name="password"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel>Password</FormLabel>
//                                                 <FormControl>
//                                                     <Input type="password" placeholder="********" {...field} />
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                     <FormField
//                                         control={form.control}
//                                         name="confirmPassword"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel>Confirm Password</FormLabel>
//                                                 <FormControl>
//                                                     <Input type="password" placeholder="********" {...field} />
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                 </div>
//                                 {!!error && (
//                                     <Alert className="bg-destructive/10 border-none ">
//                                         <OctagonAlertIcon className="h-4 w-4 !text-destructive " />
//                                         <AlertTitle>{error}</AlertTitle>
//                                     </Alert>
//                                 )}
//                                 <Button disabled={pending} className="w-full" type="submit">
//                                     Reset Password
//                                 </Button>
//                             </div>
//                         </form>
//                     </Form>

//                     <div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center">
//                         <img src={"/logo.svg"} alt="Meet.AI Logo" className="w-[92px] h-[92px]" />
//                         <p className="text-2xl font-semibold text-white">
//                             Meet.AI
//                         </p>
//                     </div>
//                 </CardContent>
//             </Card>
//             <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-sm text-balance *:[a]:underline *:[a]:underline-offset-4">
//                 By clicking continue, you agree to our{" "}
//                 <a href="/terms">Terms of Service</a> and{" "}
//                 <a href="/privacy">Privacy Policy</a>.
//             </div>
//         </div>
//     )
// }
