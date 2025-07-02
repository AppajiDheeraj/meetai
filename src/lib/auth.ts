import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { magicLink } from "better-auth/plugins";
import {
  polar,
  checkout,
  portal,
} from "@polar-sh/better-auth";
import { polarClient } from "./polar";
import { sendMagicLinkEmail } from "@/lib/email";
import { twoFactor } from "better-auth/plugins"

export const auth = betterAuth({
  emailAndPassword: {
    // Enable email and password authentication
    enabled: true,
  },
  socialProviders: {
    // Enable social login providers
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: drizzleAdapter(db, {
    // Use the Drizzle adapter to interact with the database
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  trustedOrigins: [
    "http://localhost:3000",
    "https://fun-cattle-normally.ngrok-free.app", // Replace with your actual production URL
  ],
  appName: "MeetAI",
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          authenticatedUsersOnly: true, // Only authenticated users can access the checkout
          successUrl: "/upgrade",
        }),
        portal(),
      ],
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        console.log("📩 Sending BetterAuth magic link:", url);
        await sendMagicLinkEmail({
          to: email,
          magicLink: url,
        });
      },
    }),
    twoFactor() 
  ],
});
