"use client"

import * as React from "react"
import {
  Command,
  Moon,
  Settings,
  Sun,
} from "lucide-react"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Switch } from "../ui/switch"
import CreateNewChat from "../CreateNewChat"
import NewGroupChatModal from "../NewGroupChatModal"
import GroupChatList from "../GroupChatList"
import AddFriendModal from "../AddFriendModal"
import DirectMessageList from "../DirectMessageList"
import { useThemeStore } from "@/app/stores/useThemeStore"
import { useTheme } from "next-themes"
import { useAuthStore } from "@/app/stores/useAuthStore"
import { Button } from "../ui/button"
import SettingModal from "../settingModal/settingModal"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [mounted, setMounted] = React.useState(false)
  const {user} = useAuthStore();
   React.useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null
  return (
    <Sidebar className="shadow-md" variant="inset" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="bg-gradient-primary">
              <Link href={"#"}>
                <div className="flex w-full items-center px-2 justify-between">
                  <h1 className="text-xl font-bold text-white">Carlodo</h1>
                  <CreateNewChat/>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* Content */}
      <SidebarContent className="beautiful-scrollbar">
        {/* Tin nhắn mới */}
        

        {/* Nhóm chat */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">
            Nhóm chat
          </SidebarGroupLabel>
          <SidebarGroupAction title="Tạo nhóm chat mới" className="cursor-pointer">
            <NewGroupChatModal/>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <GroupChatList/>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Tin nhắn trực tiếp */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">
            bạn bè
          </SidebarGroupLabel>

          <SidebarGroupAction title="Tin nhắn mới" className="cursor-pointer">
            <AddFriendModal/>
          </SidebarGroupAction>
          
          <SidebarGroupContent>
            <DirectMessageList/>
          </SidebarGroupContent>

        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  )
}
