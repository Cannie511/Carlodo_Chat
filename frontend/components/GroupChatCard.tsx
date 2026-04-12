import { useAuthStore } from '@/app/stores/useAuthStore';
import { useChatStore } from '@/app/stores/useChatStore';
import { Conversation } from '@/app/types/chat'
import ChatCard from './ChatCard';
import UnreadCountBadge from './UnreadCountBadge';
import GroupChatAvatar from './GroupChatAvatar';

const GroupChatCard = ({conversation}: {conversation: Conversation}) => {
    const {user} = useAuthStore();
    const {activeConversationId, setActiveConversation, messages, fetchMessages} = useChatStore();
     if(!user) return null;
     const unreadCount = conversation.unreadCount[user._id];
     const name = conversation.group?.name ?? "";
     const handleSelectConversation = async (id: string) =>{
        setActiveConversation(id);
        if(!messages[id]){
             await fetchMessages(id);
        }
     }
   return (
    <ChatCard
        key={conversation._id}
        conversationId={conversation._id}
        name={conversation.type === "group" ? "Nhóm: " + name : name}
        timestamp={conversation.lastMessage?.createdAt ? new Date(conversation.lastMessage?.createdAt) : undefined}
        isActive={activeConversationId === conversation._id}
        onSelect={handleSelectConversation}
        unreadCount={unreadCount}
        leftSection={<>
            {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount}/>}
            <GroupChatAvatar participants={conversation.participant} type='mini'/>
        </>}
        subtitle={ <p className="text-sm truncate text-muted-foreground">Bạn và {conversation.participant.length - 1} người khác</p> }
    />
  )
}

export default GroupChatCard