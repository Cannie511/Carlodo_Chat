import React from 'react'
import { SidebarInset, SidebarTrigger } from './ui/sidebar'
import ChatWindowHeader from './ChatWindowHeader'
import { Button } from './ui/button'

const ChatWelcomeScreen = () => {
  return (
    <SidebarInset className='flex w-full h-full bg-transparent'>
        <ChatWindowHeader/>
        <div className="flex bg-primary-foreground rounded-2xl flex-1 items-center justify-center">
            <div className="text-center">
                <div className="size-48 mx-auto mb-6 bg-gradient-chat rounded-full flex items-center justify-center shadow-glow pulse-ring">
                    <span className='text-7xl'>💬</span>
                </div>
                <h2 className='text-3xl font-bold mb-2 bg-gradient-chat bg-clip-text text-transparent'>Chào mừng bạn đến Carlodo!</h2>
                <p className='text-muted-foreground'>Chọn một cuộc hội thoại để bắt đầu</p>
                <p className='block sm:hidden text-muted-foreground flex items-center justify-center space-x-2'><span>Nhấn vào đây để Bắt đầu </span><SidebarTrigger className='bg-primary text-white' /></p>
            </div>
        </div>
    </SidebarInset>
  )
}

export default ChatWelcomeScreen