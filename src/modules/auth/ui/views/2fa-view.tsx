"use client";

import { useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TwoFactorPage() {
    const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
    const [isVerifying, setIsVerifying] = useState(false);
    const router = useRouter();

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return; // Allow only single digit

        const newDigits = [...digits];
        newDigits[index] = value;
        setDigits(newDigits);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const code = digits.join("");
        if (code.length !== 6) {
            toast.error("Please enter the full 6-digit code.");
            return;
        }

        setIsVerifying(true);
        try {
            await authClient.twoFactor.verifyTotp({ code });
            toast.success("2FA verified successfully");
            router.push("/"); // Redirect to dashboard or home
        } catch {
            toast.error("Invalid code. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="max-w-md w-full space-y-6 p-6 border rounded-md shadow-md">
                <h2 className="text-2xl font-bold text-center">Two-Factor Verification</h2>
                <p className="text-sm text-muted-foreground text-center">
                    Enter the 6-digit code from your authenticator app.
                </p>

                <div className="flex items-center justify-center gap-2 mt-4">
                    {digits.map((digit, index) => (
                        <>
                            {index === 3 && (
                                <div className="text-xl text-muted-foreground/75 select-none">•</div>
                            )}
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => { inputsRef.current[index] = el }}
                                className="w-14 h-14 text-xl font-medium text-center border border-input rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
                            />
                        </>
                    ))}
                </div>
                
                <Button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="w-full mt-4"
                >
                    {isVerifying ? "Verifying..." : "Verify"}
                </Button>
            </div>
        </div>
    );
}
