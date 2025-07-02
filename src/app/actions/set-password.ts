// app/actions/set-password.ts
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setPasswordAction(newPassword: string): Promise<{ success: boolean; message?: string }> {
  try {
    // Get the session from the current request
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, message: "Unauthorized – no valid session found" };
    }

    // Use the setPassword API endpoint with the session
    await auth.api.setPassword({
      body: { newPassword },
      headers: await headers(), // Pass the original headers which contain the session
    });

    await auth.api.getSession({
      headers: await headers(),
    });

    // Revalidate the settings page and any related paths
    revalidatePath("/settings");
    revalidatePath("/reset-password");
    
    // Also revalidate any API routes that might cache user data
    revalidatePath("/api/trpc/settings.getProfile");

    return { success: true };
} catch (err: unknown) {
  const error = err as { status?: number; statusCode?: number; message?: string };

  if (error.status === 401 || error.statusCode === 401) {
    return {
      success: false,
      message: "Session expired. Please sign out and sign back in to set your password.",
    };
  }

  return {
    success: false,
    message: error.message || "Failed to set password. Please try again.",
  };
}
}

