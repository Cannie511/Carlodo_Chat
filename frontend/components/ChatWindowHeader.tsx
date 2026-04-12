'use client'
import { useChatStore } from "@/app/stores/useChatStore"
import { Conversation } from "@/app/types/chat"
import { SidebarTrigger } from "./ui/sidebar";
import { useAuthStore } from "@/app/stores/useAuthStore";
import { Separator } from "./ui/separator";
import UserAvatar from "./userAvatar";
import StatusBadge from "./StatusBadge";
import GroupChatAvatar from "./GroupChatAvatar";
import { useSocketStore } from "@/app/stores/useSocketStore";
import ConversationInfoModal from "./conversationInfoModal/conversationInfoModal";


const ChatWindowHeader = ({chat}: {chat?: Conversation}) => {
  const {conversations, activeConversationId} = useChatStore();
  const {onlineUsers } = useSocketStore();
  const {user} = useAuthStore();
  let ortherUser;
  chat = chat ?? conversations.find((c)=>c._id === activeConversationId);
  if(!chat) return(
    <header className="md:hidden sticky top-0 z-10 flex items-center gap-2 px-4 py-2 w-full">
      <SidebarTrigger className="-ml-1 text-foreground cursor-pointer"/>
    </header>
  )
  if(chat.type === 'direct'){
    const ortherUsers = chat.participant.filter((p)=>p._id !== user?._id);
    ortherUser = ortherUsers.length > 0 ? ortherUsers[0] : null;
  }
  if(!user) return;
  return (
    <header className="sticky top-0 z-10 px-4 py-2 flex items-center bg-background">
      <div className="flex items-center gap-2 w-full">
        <SidebarTrigger className="-ml-1 text-foreground"/>
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4"/>
        <div className="flex items-center justify-between flex-1">
          <div className="p-2 w-full flex items-center gap-3">
            {/* avatar */}
            <div className="relative">
              {chat.type === "direct" ? (
                <>
                  <UserAvatar type="sidebar" name={ortherUser?.displayName || "Carlodo"} avatarUrl={ortherUser?.avatarUrl || undefined}/>
                  <StatusBadge status={onlineUsers.includes(ortherUser?._id ?? "") ? "online" : "offline"}/>
                </>
              ): (
                <>
                  <GroupChatAvatar participants={chat.participant} type="mini"/>
                </>
              )}
            </div>
            {/* thông tin bạn bè */}
            <div>
              <h2 className="font-semibold text-foreground">
                {chat.type === "direct" ? ortherUser?.displayName : chat?.group?.name}
              </h2>
              <span className="text-sm text-muted-foreground">{onlineUsers.includes(ortherUser?._id ?? "") ? "Đang hoạt động" : "Hoạt động 8 tiếng trước"}</span>
            </div>
          </div>

          {/* nút thông tin cuộc trò chuyện */}
          <ConversationInfoModal 
            type={chat.type}
            avatarNode={<div className="relative">
              {chat.type === "direct" ? (
                <>
                  <UserAvatar type="profile" name={ortherUser?.displayName || "Carlodo"} avatarUrl={ortherUser?.avatarUrl || undefined}/>
                </>
              ) : (
                <>
                  <GroupChatAvatar participants={chat.participant} type="mini"/>
                </>
              )}
            </div>}
            name={chat.type === "direct" ? ortherUser?.displayName || "Carlodo" : chat?.group?.name || "Cuộc trò chuyện nhóm"}
            members={chat.participant}
            createdBy={chat.group?.createdBy}
          />
        </div>
        
      </div>
    </header>
  )
}

export default ChatWindowHeader