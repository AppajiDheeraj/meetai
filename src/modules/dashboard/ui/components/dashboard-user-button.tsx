import { authClient } from "@/lib/auth-client";
import { DropdownMenu, DropdownMenuLabel, DropdownMenuItem, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GeneratedAvatar } from "@/components/generated-avtar";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export const DashboardUserButton = () => {
    const { data, isPending } = authClient.useSession();
    const isMobile = useIsMobile();
    const router = useRouter();

    if (isPending || !data?.user) {
        return null;
    }

    const onLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in");
                }
            }
        });
    }

    if(isMobile) {
        return (
            <Drawer>
                <DrawerTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-1/2">
                {data.user.image ? (
                    <Avatar className="size-9 mr-3">
                        <AvatarImage src={data.user.image} />
                    </Avatar>
                ) : (<GeneratedAvatar
                    seed={data.user.name}
                    variant="initials"
                    className="size-9 mr-3"
                />)}
                <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                    <p className="text-sm truncate w-full">
                        {data.user.name}
                    </p>
                    <p className="text-xs truncate w-full">
                        {data.user.email}
                    </p>
                </div>
                <ChevronDownIcon className="size-4 shrink-0" />
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>
                            {data.user.name}
                        </DrawerTitle>
                        <DrawerDescription>
                            {data.user.email}
                        </DrawerDescription>
                        <DrawerFooter>
                            <Button variant="outline" onClick={() => {
                                authClient.customer.portal()
                            }} >
                                <CreditCardIcon className="size-4 text-black" />
                                Billing
                            </Button>
                            <Button onClick={onLogout}>
                                <LogOutIcon className="size-4 text-white" />
                                Logout
                            </Button>
                        </DrawerFooter>
                    </DrawerHeader>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2">
                {data.user.image ? (
                    <Avatar className="size-9 mr-3">
                        <AvatarImage src={data.user.image} />
                    </Avatar>
                ) : (<GeneratedAvatar
                    seed={data.user.name}
                    variant="initials"
                    className="size-9 mr-3"
                />)}
                <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                    <p className="text-sm truncate w-full">
                        {data.user.name}
                    </p>
                    <p className="text-xs truncate w-full">
                        {data.user.email}
                    </p>
                </div>
                <ChevronDownIcon className="size-4 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" className="w-72 p-2 m-2">
                <div className="flex flex-col gap-1">
                    <span className="font-medium truncate">{data.user.name}</span>
                    <span className="text-sm font-normal text-muted-foreground truncate">{data.user.email}</span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                onClick={() => {
                    authClient.customer.portal()
                }}
                className="cursor-pointer flex items-center justify-between">
                    Billing
                    <CreditCardIcon className="size-4" />
                </DropdownMenuItem>
                <DropdownMenuItem
                className="cursor-pointer flex items-center justify-between"
                onClick={onLogout}>
                    Logout
                    <LogOutIcon className="size-4"/>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}