import { Conversation, Message } from '@/app/types/chat'
import { cn, formatMessageTime } from '@/lib/utils';
import UserAvatar from './userAvatar';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCheck, Eye } from 'lucide-react';
import Image from 'next/image';

interface MessageItemProps {
    message: Message;
    index: number;
    messages: Message[];
    selectedConvo: Conversation;
    lastMessageStatus: "delivered" | "seen";
}

const MessageItem = ({message, index, messages, selectedConvo, lastMessageStatus}: MessageItemProps) => {
    
    const prev = +index + 1 < messages.length ? messages[index+1] : undefined;
    const next = messages[+index-1];
    const isShowTime = index === 0 || (new Date(message?.createdAt).getTime() - new Date(prev?.createdAt || 0).getTime() > 600000 && (message.senderId._id !== next.senderId._id || !next)) // 10 phút
    const isGroupBreak = isShowTime|| message.senderId._id !== prev?.senderId._id;
    //const participant = selectedConvo.participant.find((p)=> p._id.toString() === message.senderId._id.toString());
  return (
    <>
        
        {/* trạng thái tin nhắn (seen | delivered) */}
        <div className={cn("flex flex-1", message.isOwn && "justify-end")}>
            {message.isOwn && message._id === selectedConvo.lastMessage?._id && (
                <Badge variant={'ghost'} className={cn("text-xs px-1.5 py-0.5 border-0", lastMessageStatus === 'seen' ? 
                'bg-primary/20 text-primary' : "bg-muted text-muted-foreground")}>
                    {lastMessageStatus === 'delivered' ? <><CheckCheck/> Đã gửi</>:<><Eye/> Đã xem</>}
                </Badge>
            )}
        </div>
        <div className={cn("flex gap-2 message-bounce", message.isOwn ? "justify-end" : "justify-start")}>
            {/* avatar */}
            {
                !message.isOwn && (
                    <div className="w-8">
                        {isGroupBreak && <UserAvatar type='chat' name={message.senderId?.displayName ?? "Z"} 
                        avatarUrl={message.senderId?.avatarUrl ?? undefined}/>}
                    </div>
                )
            }
            {/* tin nhắn */}
            <div className={cn('max-w-xs lg:max-w-md space-y-3 flex flex-col',
                message?.isOwn ? "items-end" : "items-start"
            )}>
                <Card className={cn("p-3 gap-2 border-background", message.type === 'image' ? "bg-transparent border-0" : message?.isOwn ? "chat-bubble-sent border-0" : "bg-chat-bubble-received")}>
                    {message?.type !== "image" ? (
                        <p className='text-sm leading-relaxed wrap-break-word'>
                            {message.content}
                        </p>
                    ): (
                        <div className='relative w-[300px] h-auto aspect-square'>
                            <Image
                                src={message.imgUrl!}
                                alt="chat image"
                                fill
                                className='object-contain'
                            />
                        </div>
                    )
                    }
                   
                    {isShowTime && 
                    <span className={cn("text-xs px-1 ", message.isOwn ? 
                        "text-left text-white": "text-right text-muted-foreground")}>
                        {formatMessageTime(new Date(message?.createdAt))}
                    </span>}
                </Card>
            </div>
        </div>
        {isShowTime && 
        <span className={"text-xs text-center px-1 text-muted-foreground"}>
            - {formatMessageTime(new Date(message?.createdAt))} -
        </span>}
        
    </>
    
  )
}

export default MessageItem