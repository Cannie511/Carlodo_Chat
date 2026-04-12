import { Conversation } from '@/app/types/chat'
import React from 'react'
import ChatCard from './ChatCard'
import { useAuthStore } from '@/app/stores/useAuthStore'
import { useChatStore } from '@/app/stores/useChatStore'
import { cn } from '@/lib/utils'
import UserAvatar from './userAvatar'
import StatusBadge from './StatusBadge'
import UnreadCountBadge from './UnreadCountBadge'
import { useSocketStore } from '@/app/stores/useSocketStore'

const DirectMessageCard = ({conversation}: {conversation: Conversation}) => {
    const {user} = useAuthStore();
    const {activeConversationId, setActiveConversation, messages, fetchMessages} = useChatStore();
    const {onlineUsers} = useSocketStore();
    if(!user) return null;
    const otherUser = conversation.participant.find((p)=>p._id !== user._id);
    
    if(!otherUser) return null;

    const unreadCount = conversation.unreadCount[user._id];
    const lastMessage = conversation.lastMessage?.sender?._id === user?._id ? "Bạn: " + conversation.lastMessage?.content : conversation.lastMessage?.content;
    const handleSelectConversation = async(id: string) => {
        setActiveConversation(id);
        if(!messages[id]){
            // fetch message
            await fetchMessages(id);
        }
    }
  return (
    <ChatCard
        conversationId={conversation._id}
        name={otherUser.displayName}
        timestamp={conversation.lastMessage?.createdAt ? new Date(conversation.lastMessage?.createdAt) : undefined}
        isActive={activeConversationId === conversation._id}
        onSelect={handleSelectConversation}
        unreadCount={unreadCount}
        leftSection={<>
          <UserAvatar type='sidebar' name={otherUser.displayName ?? ""} avatarUrl={otherUser.avatarUrl ?? undefined}/>  
          <StatusBadge status={onlineUsers.includes(otherUser?._id ?? "") ? "online" : "offline"} /> 
          {
            unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount}/>
          }
        </>}
        subtitle={ <p className={cn("text-sm truncate", unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground")}>{lastMessage}</p> }
    />
  )
}

export default DirectMessageCard