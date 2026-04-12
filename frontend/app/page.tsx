import ChatWindowLayout from "@/components/ChatWindowLayout";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {

  return (
    <SidebarProvider>
      <AppSidebar/>
      <div className="flex h-screen w-full p-0 sm:p-2">
        <ChatWindowLayout/>
      </div>
    </SidebarProvider>
  );
}
