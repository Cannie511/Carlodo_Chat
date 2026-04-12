import { useAuthStore } from '@/app/stores/useAuthStore';
import { Conversation, Participant } from '@/app/types/chat'
import React, { useState } from 'react'
import UserAvatar from './userAvatar';
import { Card } from './ui/card';
import { useSocketStore } from '@/app/stores/useSocketStore';
import { isTypedArray } from 'util/types';
import { useChatStore } from '@/app/stores/useChatStore';

const TypingItem = ({selectedConvo}: {selectedConvo: Conversation}) => {
    const {user} = useAuthStore();
    const {socket} = useSocketStore();
    const {activeConversationId} = useChatStore();
    const [isTyping, setIsTyping] = useState(false);
    let userTyping:Participant|undefined; 
    socket?.on("typing", ({userId, conversationId})=> {
        userTyping = selectedConvo.participant.find((p)=>p._id === userId);
        setIsTyping( userId !== user?._id && userId === userTyping?._id && conversationId === activeConversationId);
    })
    socket?.on("stop-typing", ({userId, conversationId})=> {
        setIsTyping(false);
    })
    if(isTyping) {
        return (
            <>
                <div className="absolute bottom-12 -left-3 z-10 flex gap-2 justify-start">
                    <div className="flex-1 animate-pulse lg:max-w-md flex flex-col items-start">
                        <Card className="px-10 py-1 border-background w-fit rounded-tr-4xl rounded-br-none bg-chat-bubble-received">
                            <p className='text-sm font-semibold '>
                                {userTyping?.displayName} Đang nhập...
                            </p>
                        </Card>
                    </div>
                </div>
            </>
        )
    }
    return null;
}

export default TypingItem