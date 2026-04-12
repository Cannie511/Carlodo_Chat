'use client'
import { useChatStore } from '@/app/stores/useChatStore'
import ChatWelcomeScreen from './ChatWelcomeScreen';
import ChatWindowSkeleton from './ChatWindowSkeleton';
import { SidebarInset } from './ui/sidebar';
import ChatWindowHeader from './ChatWindowHeader';
import ChatWindowBody from './ChatWindowBody';
import MessageInput from './MessageInput';
import { useEffect } from 'react';
import { useAuthStore } from '@/app/stores/useAuthStore';
import { useSocketStore } from '@/app/stores/useSocketStore';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const ChatWindowLayout = () => {
  const {activeConversationId, conversations, messageLoading: loading, markAsSeen } = useChatStore();
  const {accessToken} = useAuthStore();
  const {connectSocket, disconnectSocket} = useSocketStore();
  const selectedConvo = conversations.find((c)=>c._id === activeConversationId) ?? null;

  useEffect(()=> {
    if(accessToken) connectSocket();
    return ()=>disconnectSocket();
  },[accessToken])

  useEffect(()=> {
    if(!selectedConvo){
      return;
    }
    const markSeen = async() => {
      try {
        await markAsSeen();
      } catch (error) {
        console.log("Lỗi khi đánh dấu đã xem", error);
        toast.error("Lỗi khi đánh dấu đã xem")
      }
    }
    markSeen();
  },[markAsSeen, selectedConvo]);

  if(!selectedConvo) {
    return <ChatWelcomeScreen/>
  }
 
  if(loading) return <ChatWindowSkeleton/>;
  return (
    <SidebarInset className='flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md'>
      {/* Header */}
      <ChatWindowHeader chat={selectedConvo}/>

      {/* body */}
      <div className="flex1-1 overflow-y-auto h-full bg-primary-foreground">
        <ChatWindowBody/>
      </div>
      {/* footer */}
      <MessageInput selectedConvo={selectedConvo}/>
    </SidebarInset>
  )
}

export default ChatWindowLayout