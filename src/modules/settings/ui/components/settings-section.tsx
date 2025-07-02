"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { parseUserAgentInfo } from "@/lib/parse-user-agent";
import { LaptopIcon, SmartphoneIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { isValidPhoneNumber } from "libphonenumber-js";
import QRCode from "react-qr-code";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useRef } from "react";
import { useRouter } from "next/navigation";

interface Session {
    id: string;
    userAgent: string;
    ipAddress?: string;
    createdAt: string;
    current?: boolean;
}

export const SettingsSection = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();
    
    const { data: userProfile, isLoading, refetch } = useQuery(
        trpc.settings.getProfile.queryOptions(),
    )
    
    const defaultValues = {
        fullName: userProfile?.name || "",
        phone: userProfile?.phone || "",
        location: userProfile?.location || "",
        twoFactorEnabled: userProfile?.twoFactorEnabled || false,
    };

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [showQRModal, setShowQRModal] = useState(false);
    const [totpURI, setTotpURI] = useState("");
    const [, setTotpCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [passwordFor2FA, setPasswordFor2FA] = useState("");
    const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    // Check for route changes and refetch data when returning from password setup
    useEffect(() => {
        const handleRouteChange = () => {
            // Refetch user profile when component mounts or route changes
            refetch();
        };

        // Listen for focus events (when user returns to the tab/page)
        window.addEventListener('focus', handleRouteChange);
        
        return () => {
            window.removeEventListener('focus', handleRouteChange);
        };
    }, [refetch]);

    // Refetch data when component mounts
    useEffect(() => {
        refetch();
    }, [refetch]);
    
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await authClient.listSessions();
                if (res?.data) {
                    const sessionList = res.data.map((s, index): Session => ({
                        id: s.token,
                        userAgent: s.userAgent ?? "Unknown",
                        ipAddress: s.ipAddress ?? "Unknown IP",
                        createdAt: new Date(s.createdAt).toLocaleString(),
                        current: index === 0, // assume first session is current
                    }));

                    setSessions(sessionList);
                }
            } catch (error) {
                console.error("Failed to fetch sessions:", error);
            }
        };

        fetchSessions();
    }, []);

    useEffect(() => {
        if (userProfile) {
            setFullName(userProfile.name || "");
            setPhone(userProfile.phone || "");
            setLocation(userProfile.location || "");
            setTwoFactorEnabled(userProfile.twoFactorEnabled ?? false);
        }
    }, [userProfile]);

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return; // Allow only single digit

        const newDigits = [...digits];
        newDigits[index] = value;
        setDigits(newDigits);

        // Auto-focus next input
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }

        // Auto-submit when all digits are filled
        if (newDigits.every(digit => digit !== "") && newDigits.join("").length === 6) {
            setTotpCode(newDigits.join(""));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const updateSettings = useMutation(
        trpc.settings.updateSettings.mutationOptions({
            onSuccess: async () => {
                toast.success("Settings updated successfully");
                await refetch(); // Refresh user profile data
            },
            onError: (error) => {
                toast.error(`Failed to update settings: ${error.message}`);
            },
        })
    );

    const handleSave = () => {
        // Validate phone number if provided
        if (phone && !isValidPhoneNumber(phone, "IN")) {
            toast.error("Please enter a valid Indian phone number.");
            return;
        }

        const values = {
            fullName,
            phone,
            location,
            twoFactorEnabled,
        };
        
        updateSettings.mutate(values);
    };

    const handleTwoFactorToggle = async (enabled: boolean) => {
        // Force refresh user profile before checking hasPassword
        await refetch();
        
        // Check if user has a password
        if (!userProfile?.hasPassword) {
            toast.info("You need to set a password first to enable 2FA.");
            router.push("/reset-password");
            return;
        }

        if (enabled) {
            setShowPasswordDialog(true);
        } else {
            await disable2FA();
        }
    };

    const confirmEnable2FA = async () => {
        try {
            const { data, error } = await authClient.twoFactor.enable({
                password: passwordFor2FA,
                issuer: "Meet-AI",
            });

            if (error) {
                toast.error("Failed to enable 2FA. Please check your password.");
                setTwoFactorEnabled(false);
                setShowPasswordDialog(false);
                return;
            }

            if (!data?.totpURI) {
                toast.error("TOTP URI not available.");
                setTwoFactorEnabled(false);
                setShowPasswordDialog(false);
                return;
            }

            setTotpURI(data.totpURI);
            setShowPasswordDialog(false);
            setShowQRModal(true);
        } catch {
            toast.error(`Failed to enable 2FA`);
            setTwoFactorEnabled(false);
            setShowPasswordDialog(false);
        }
    };

    const handleTotpVerification = async () => {
        if (digits.join("").length !== 6) {
            toast.error("Please enter a 6-digit code.");
            return;
        }

        setIsVerifying(true);
        try {
            await authClient.twoFactor.verifyTotp({ code: digits.join("") });
            toast.success("2FA enabled and verified successfully!");
            setTwoFactorEnabled(true);
            setShowQRModal(false);
            setDigits(Array(6).fill(""));
            await refetch(); // Refresh user profile
        } catch {
            toast.error("Invalid code. Please try again.");
            setDigits(Array(6).fill("")); // Clear the digits
        } finally {
            setIsVerifying(false);
        }
    };

    const disable2FA = async () => {
        try {
            const password = prompt("Enter your password to disable 2FA") || "";
            if (!password) {
                setTwoFactorEnabled(userProfile?.twoFactorEnabled ?? false);
                return;
            }
            
            await authClient.twoFactor.disable({ password });
            toast.success("2FA disabled successfully.");
            setTwoFactorEnabled(false);
            await refetch(); // Refresh user profile
        } catch {
            toast.error("Failed to disable 2FA. Please check your password.");
            setTwoFactorEnabled(userProfile?.twoFactorEnabled ?? false);
        }
    };

    const handleReset = () => {
        setFullName(defaultValues.fullName);
        setPhone(defaultValues.phone);
        setLocation(defaultValues.location);
        setTwoFactorEnabled(defaultValues.twoFactorEnabled);
    };

    const handleRevokeSession = async (id: string) => {
        try {
            await authClient.revokeSession({ token: id });
            setSessions((prev) => prev.filter((s) => s.id !== id));
            toast.success("Session revoked successfully.");
        } catch (err) {
            console.error("Failed to revoke session", err);
            toast.error("Failed to revoke session.");
        }
    };

    // Force refresh button for debugging
    const handleForceRefresh = async () => {
        await queryClient.invalidateQueries(
            trpc.settings.getProfile.queryOptions()
        );
        await refetch();
        toast.info("Profile data refreshed");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">Loading settings...</div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6">
            <Card className="shadow-md">
                {/* Profile Section */}
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-semibold">Profile Information</CardTitle>
                        <Button variant="outline" size="sm" onClick={handleForceRefresh}>
                            Refresh Data
                        </Button>
                    </div>
                    <Separator />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="fullName" className="mb-1.5">Full Name</Label>
                        <Input 
                            id="fullName" 
                            value={fullName} 
                            onChange={(e) => setFullName(e.target.value)} 
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div>
                        <Label htmlFor="phone" className="mb-1.5">Phone Number</Label>
                        <PhoneInput
                            country={'in'}
                            value={phone}
                            onChange={(phone) => setPhone(phone)}
                            inputProps={{
                                name: 'phone',
                                required: false,
                                autoFocus: false,
                            }}
                            inputClass="!pl-14 !pr-3 !py-2 !w-full !rounded-md !border !border-input dark:!bg-background dark:!text-foreground"
                            buttonClass="!border-r !border-input !bg-white dark:!bg-gray-800 !p-1"
                            containerClass="!w-full"
                            dropdownClass="!z-[100]"
                        />
                    </div>
                    <div>
                        <Label htmlFor="location" className="mb-1.5">Location</Label>
                        <Input 
                            id="location" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)} 
                            placeholder="Enter your location"
                        />
                    </div>
                </CardContent>

                {/* Security Settings */}
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Security Settings</CardTitle>
                    <Separator />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label htmlFor="2fa">Two-Factor Authentication (2FA)</Label>
                            <p className="text-sm text-muted-foreground">
                                Add an extra layer of security to your account
                            </p>
                            {!userProfile?.hasPassword && (
                                <p className="text-sm text-amber-600">
                                    You need to set a password first to enable 2FA
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="2fa"
                                checked={twoFactorEnabled}
                                onCheckedChange={handleTwoFactorToggle}
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={handleReset}>
                            Reset
                        </Button>
                        <Button onClick={handleSave} disabled={updateSettings.isPending}>
                            {updateSettings.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </CardContent>

                {/* Active Sessions */}
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Active Sessions</CardTitle>
                    <Separator />
                </CardHeader>
                <CardContent className="space-y-3">
                    {sessions.length === 0 ? (
                        <p className="text-muted-foreground">No active sessions found.</p>
                    ) : (
                        sessions.map((session) => {
                            const { browser, os, deviceType } = parseUserAgentInfo(session.userAgent);

                            return (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between border rounded-md p-3"
                                >
                                    <div>
                                        <div className="flex flex-row gap-x-4 items-center">
                                            <p className="font-medium">{browser}</p>
                                            {session.current && (
                                                <Badge className="mt-1" variant="secondary">
                                                    Current Session
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {os} · {deviceType} · {session.ipAddress || "Unknown IP"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(session.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {!session.current && (
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleRevokeSession(session.id)}
                                            >
                                                Revoke
                                            </Button>
                                        )}

                                        <div className="text-muted-foreground/65">
                                            {deviceType === "Mobile" ? (
                                                <SmartphoneIcon className="w-5 h-5" />
                                            ) : (
                                                <LaptopIcon className="w-5 h-5" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </CardContent>
            </Card>

            {/* 2FA QR Code Modal */}
            <ResponsiveDialog
                open={showQRModal}
                onOpenChange={setShowQRModal}
                title="Set up Two-Factor Authentication"
                description="Scan the QR code using your authenticator app and enter the 6-digit code to verify."
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="bg-white p-4 rounded-lg">
                        <QRCode value={totpURI} size={200} />
                    </div>
                    
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-4">
                            Use Google Authenticator, Authy, or any TOTP app to scan this QR code
                        </p>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 mt-4">
                        {digits.map((digit, index) => (
                            <div key={index} className="flex items-center">
                                {index === 3 && (
                                    <div className="text-xl text-muted-foreground/75 select-none mx-2">•</div>
                                )}
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    ref={(el) => { inputsRef.current[index] = el }}
                                    className="w-12 h-12 text-xl font-medium text-center border border-input rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
                                />
                            </div>
                        ))}
                    </div>
                    
                    <Button 
                        onClick={handleTotpVerification} 
                        disabled={isVerifying || digits.join("").length !== 6}
                        className="w-full mt-4"
                    >
                        {isVerifying ? "Verifying..." : "Verify Code"}
                    </Button>
                </div>
            </ResponsiveDialog>

            {/* Password Confirmation Modal */}
            <ResponsiveDialog
                open={showPasswordDialog}
                onOpenChange={setShowPasswordDialog}
                title="Confirm Password"
                description="Enter your password to enable Two-Factor Authentication"
            >
                <div className="flex flex-col gap-4">
                    <Input
                        placeholder="Enter your password"
                        type="password"
                        value={passwordFor2FA}
                        onChange={(e) => setPasswordFor2FA(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && passwordFor2FA) {
                                confirmEnable2FA();
                            }
                        }}
                    />
                    <div className="flex justify-end gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setShowPasswordDialog(false);
                                setTwoFactorEnabled(false);
                                setPasswordFor2FA("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={confirmEnable2FA}
                            disabled={!passwordFor2FA}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            </ResponsiveDialog>
        </div>
    );
};

