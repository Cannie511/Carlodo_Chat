import { useAuthStore } from '@/app/stores/useAuthStore'
import { Conversation } from '@/app/types/chat';
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Button } from './ui/button';
import { ImagePlus, Send } from 'lucide-react';
import { Input } from './ui/input';
import EmojiPickerMesage from './EmojiPicker';
import { useChatStore } from '@/app/stores/useChatStore';
import { toast } from 'sonner';
import { useSocketStore } from '@/app/stores/useSocketStore';

const MessageInput = ({selectedConvo}:{selectedConvo: Conversation}) => {
  const {user} = useAuthStore();
  const inputFocusRef = useRef<HTMLInputElement | null>(null);
  const uploaderRef = useRef<HTMLInputElement | null>(null);
  const {sendDirectMessage, sendGroupMessage, activeConversationId, uploadImageConversation} = useChatStore();
  const [value, setValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const {socket} = useSocketStore();

  const sendMessage = async() => {
    const currentValue = value;
    if(!currentValue.trim()) return;
    setValue("");
    try {
      if(selectedConvo.type === 'direct'){
        const participants = selectedConvo.participant;
        const ortherUser = participants.filter((p)=>p._id !== user?._id)[0];
        await sendDirectMessage(ortherUser._id, currentValue.trim())
      } else {
        await sendGroupMessage(selectedConvo._id, currentValue);
      }
    } catch (error) {
      console.log("Lỗi khi gửi tin nhắn");
      toast.error("Đã có lỗi xảy ra khi gửi tin nhắn! Vui lòng thử lại")
    }
  }

  const handleKeyDown = (e:React.KeyboardEvent) => {
    if(e.key === "Enter"){
      e.preventDefault();
      sendMessage();
    }
  }

  const handleOnChange = (e:ChangeEvent<HTMLInputElement>) => {
    let typingTimeout;
    if(socket){
      if(!isTyping) {
        socket.emit("typing", {
          activeConversationId
        });
        setIsTyping(true);
      }
      clearTimeout(typingTimeout);

      typingTimeout = setTimeout(() => {
        socket.emit("stop-typing", { activeConversationId });
        setIsTyping(false);
      }, 20000);
    }
    
    setValue(e.target.value);
  }

  const handleOpenUploader = () => {
    if(uploaderRef.current) {
      uploaderRef.current?.click();
    }
  }

  const handleSendImageConversation = async(e:ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
      const files = e.target.files;
      if(!files) return;
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append("files", file);
      });
      await uploadImageConversation(formData);
  }

  useEffect(()=> {
    if(!value && isTyping) {
        socket?.emit("stop-typing", {
        activeConversationId,
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsTyping(false);
    }
  },[value, isTyping])

  useEffect(() => {
     if (activeConversationId) {
      setTimeout(() => {
        inputFocusRef.current?.focus();
      }, 50);
  }
  },[activeConversationId])

  if(!user) return
  return (
    <div className='flex items-center gap-2 p-3 min-h-[56] bg-background'>
      {/* nút gửi hình ảnh */}
      <Button onClick={handleOpenUploader} variant={'ghost'} size={'icon'} className='hover:bg-primary/10 transition-smooth'>
        <ImagePlus className='size-4'/>
      </Button>
      <input type="file" onChange={(e)=>handleSendImageConversation(e)} multiple hidden ref={uploaderRef} accept="image/*"/>
      
      {/* input nhập tin nhắn */}
      <div className="flex-1 relative">
        <Input ref={inputFocusRef} value={value} onKeyPress={handleKeyDown} onChange={(e:ChangeEvent<HTMLInputElement>)=>handleOnChange(e)}
          placeholder='Nhập tin nhắn...' className='pr-20 h-9 bg-white border-border/50 focus:border-primary/50 transition-smooth resize-none'/>
          
         <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <Button asChild variant={'ghost'} size={'icon'} className='size-8 hover: bg-primary/10 transition-smooth'>
              {/* emoji picker */}
              <EmojiPickerMesage onChange={(emoji:any)=>setValue(`${value} ${emoji}`)}/>
            </Button>
          </div>
      </div>
      {/* nút gửi tin */}
      <Button onClick={sendMessage} className='bg-gradient-chat hover:shadow-glow transition-smooth hover:scale-105' disabled={!value.trim()}>
        <Send className='size-4 text-white'/>
      </Button>
    </div>
  )
}

export default MessageInput