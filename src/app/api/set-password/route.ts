// app/api/set-password/route.ts
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("auth_token")?.value;

    if (!token) {
      return new Response("Missing session token", { status: 401 });
    }

    const { newPassword } = await req.json();

    await auth.api.setPassword({
      body: { newPassword },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return new Response("Password set successfully");
  } catch (err) {
    console.error("Error setting password:", err);
    return new Response("Failed to set password", { status: 500 });
  }
}
