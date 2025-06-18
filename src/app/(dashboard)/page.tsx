import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { HomeView } from "@/modules/home/ui/views/home-view"
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session) {
    redirect('/sign-in');
  }
  return <HomeView />
}

export default Page;