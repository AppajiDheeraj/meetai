import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { DashboardNav } from "@/modules/dashboard/ui/components/dashboard-navbar";

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        <div>
            <SidebarProvider>
                <DashboardSidebar />
                <main className="flex flex-col min-h-screen w-screen bg-muted">
                    <DashboardNav />
                    {children}
                </main>
            </SidebarProvider>
        </div>
    );
}

export default Layout;