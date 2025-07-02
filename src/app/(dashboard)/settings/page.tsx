import { SettingsView } from "@/modules/settings/ui/views/settings-view";
import { authClient } from "@/lib/auth-client";

const Page = async () => {

  const sessions = await authClient.listSessions()
  return (
    <SettingsView
    
    />
  )
}

export default Page;