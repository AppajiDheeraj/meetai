import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        <div>
            <SidebarProvider>
                <DashboardSidebar />
                <main className="flex flex-col h-screen w-screen bg-muted">
                    {children}
                </main>
            </SidebarProvider>
        </div>
    );
}

export default Layout;