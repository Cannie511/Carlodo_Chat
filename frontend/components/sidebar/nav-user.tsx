"use client"

import {
  ChevronsUpDown,
  Settings,
  UserIcon,
  Users,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { User } from "@/app/types/user"
import Logout from "./logout"
import { useState } from "react"
import FriendRequestDialog from "../friendRequest/FriendRequestDialog"
import ProfileDialog from "../profile/ProfileDialog"
import SettingModal from "../settingModal/settingModal"
import { useAuthStore } from "@/app/stores/useAuthStore"

export function NavUser({
  user,
}: {
  user: User
}) {
  const { isMobile } = useSidebar()
  const [friendRequestOpen, setFriendRequestOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [settingOpen, setSettingOpen] = useState<boolean>(false);
  const avatarClass = "rounded-lg bg-linear-to-br from-blue-400 to-purple-400/70 text-white font-semibold";
  return (
    <>
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                <AvatarFallback className={avatarClass}>{user.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.displayName}</span>
                <span className="truncate text-xs">{user.username}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg border-background"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0  font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                  <AvatarFallback className={avatarClass}>{user.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.displayName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={()=> setProfileOpen(true)} className="dark:hover:bg-primary dark:text-white transition-colors">
                <UserIcon className="text-muted-foreground dark:group-focus:text-accent-foreground" />
                Tài khoản
              </DropdownMenuItem>
              <DropdownMenuItem onClick={()=>setFriendRequestOpen(true)} className="dark:hover:bg-primary dark:text-white transition-colors">
                <Users className="text-muted-foreground dark:group-focus:text-accent-foreground" />
                Lời mời kết bạn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={()=>setSettingOpen(true)} className="dark:hover:bg-primary dark:text-white transition-colors">
                <Settings className="text-muted-foreground dark:group-focus:text-accent-foreground " />
                Cài đặt
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" variant="destructive">
              <Logout/>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>

    <FriendRequestDialog open={friendRequestOpen} setOpen={setFriendRequestOpen}/>
    <ProfileDialog open={profileOpen} setOpen={setProfileOpen}/>
    <SettingModal open={settingOpen} setOpen={setSettingOpen}/>
    </>
  )
}
