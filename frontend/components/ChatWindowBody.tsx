'use client'
import { useChatStore } from '@/app/stores/useChatStore'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ChatWelcomeScreen from './ChatWelcomeScreen';
import MessageItem from './MessageItem';
import TypingItem from './TypingItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'sonner';
import { Spinner } from './ui/spinner';
import { useAuthStore } from '@/app/stores/useAuthStore';
const ChatWindowBody = () => {
  const { activeConversationId, conversations, messages:allMessages, fetchMessages} = useChatStore();
  const {accessToken} = useAuthStore();
  const [lastMessageStatus, setLastMessageStatus] = useState<"delivered" | "seen">("delivered");
  //ref
  const calledRef = useRef(false);//flag tắt mount 2 lần;
  const messageEndRef = useRef<HTMLDivElement>(null); // lấy div cuối cùng để scroll
  const containerRef = useRef<HTMLDivElement>(null); //lấy vị trí đã cuộn ở hiện tại 

  const messages = allMessages[activeConversationId!]?.items ?? [];
  const hasMore = allMessages[activeConversationId!]?.hasMore ?? false;
  const selectedConvo = conversations.find((c)=> c._id === activeConversationId);
  const reversedMessages = [...messages].reverse();
  const key = `chat-scroll-${activeConversationId}`;

  const scrollToEnd = () => {
    if(!messageEndRef.current) {
      return;
    }
    messageEndRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end"
    })
  }

  const handleScrollSave = () => {
    const container = containerRef.current;
    if(!container || !activeConversationId) return;
    
    sessionStorage.setItem(key, JSON.stringify({
      scrollTop: container.scrollTop,  // vị trí cuộn hiện tại
      scrollHeight: container.scrollHeight  // tổng chiều cao có thể cuộn
    }))
  }

  const fetchMoreMessages = async() => {
    if(!activeConversationId) return;
    try {
      await fetchMessages(activeConversationId);
    } catch (error) {
      console.log("Lỗi xảy ra khi tải thêm tin nhắn")
      toast.error("Đã có lỗi xảy ra! Vui lòng thử lại")
    }
  }

  useEffect(()=>{
     if (!activeConversationId) return;
    if (calledRef.current) return;
     const activeConvo = activeConversationId;
     const messageList = messages.length;
    if(activeConvo && !messageList && accessToken){
      calledRef.current = true;
      fetchMessages(activeConvo)
    }
      
  },[activeConversationId, accessToken])

  useEffect(()=> {
    const lastMessage = selectedConvo?.lastMessage;
    if(!lastMessage) return;
    const seenBy = selectedConvo?.seenBy ?? [];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLastMessageStatus(seenBy.length > 0 ? "seen" : "delivered");

  },[selectedConvo])
  
  //useLayoutEffect sẽ chạy trước DOM, dùng để tính toán vị trí, hoặc tạo sự kiện cuộn/...
  //cuộn tới cuối khi mở 1 cuộc hội thoại
  useLayoutEffect(()=>{
    scrollToEnd()
  },[activeConversationId, messages])

  useLayoutEffect(()=> {
    const container = containerRef.current;
    if(!container) return;
    const item = sessionStorage.getItem(key);
    if(item){
      const {scrollTop} = JSON.parse(item);
      requestAnimationFrame(()=> {
        container.scrollTop = scrollTop;
      })
    }
  }, [messages.length])
  //render UI
  if(!selectedConvo) return <ChatWelcomeScreen/>
  
  if(!messages?.length) {
    return (
      <div className='flex flex-col space-y-6 h-full items-center justify-center text-muted-foreground'>
        <h3 className='text-7xl'>👋🏻</h3>
        <span className='text-xl'>Hãy bắt đầu bằng cách nói <b>{'"Xin chào"'}</b></span>
      </div>
    )
  }
  return (
    <div className='p-4 bg-primary-foreground h-full flex flex-col overflow-hidden'>
      <div id='scrollableDiv' ref={containerRef} onScroll={handleScrollSave} className="flex flex-col-reverse overflow-y-auto overflow-x-hidden beautiful-scrollbar">
        
        <InfiniteScroll 
          className='space-y-1.5'
          style={{overflow: 'visible', display:"flex", flexDirection: "column-reverse"}}
          dataLength={messages.length} 
          next={fetchMoreMessages} 
          hasMore={hasMore} 
          scrollableTarget="scrollableDiv" // ID của phần tử cha bọc danh sách tin nhắn
          loader={<div className='flex flex-1 items-center justify-center'><Spinner className='size-12' color='pink'/></div>}
          inverse={true}
          > 
          <div ref={messageEndRef}></div>
          {reversedMessages.map((m, index) => (
            
            <MessageItem 
            index={Number(index)} 
            lastMessageStatus={lastMessageStatus} 
            message={m} 
            messages={reversedMessages} 
            selectedConvo={selectedConvo} 
            key={index}/>
          )) }
          <TypingItem selectedConvo={selectedConvo}/>
        </InfiniteScroll>
        
      </div>
    </div>
  )
}

export default ChatWindowBody