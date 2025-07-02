import { createAuthClient } from "better-auth/react"
import { magicLinkClient, twoFactorClient } from "better-auth/client/plugins";
import { polarClient } from "@polar-sh/better-auth"

export const authClient = createAuthClient({
  plugins: [
    polarClient(),
    magicLinkClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = "/2fa";
      },
    }),
  ],
});