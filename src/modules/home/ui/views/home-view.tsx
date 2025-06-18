"use client"

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export const HomeView = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  if (!session) {
    return (
      <p>Logging in ...</p>
    )
  }
        return (
        <div className="flex flex-col items-center justify-center h-screen">
          <p>Logged in as {session.user.name}</p>
          <Button onClick={() => authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/sign-in');
                }
            }
          }) }
            className="mt-4"
            variant="outline"
            size="lg"
          >
            Sign Out
          </Button>
        </div>
      )
}