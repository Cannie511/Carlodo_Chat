import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Flag, UserRoundX } from 'lucide-react';

interface ConversationDirectBodyProps {
    avatarNode: React.ReactNode;
    displayName: string;
 }


const ConversationDirectBody = ({avatarNode, displayName}: ConversationDirectBodyProps) => {
  return (
    <>
        <Card className="border-none overflow-hidden p-0 glass">
            <CardHeader className='border-none overflow-hidden p-0 rounded-lg h-52 bg-linear-to-r from-blue-400 via-purple-500 to-pink-500'>
                <div className='flex w-full justify-start items-end space-x-3 mt-20 mb-8 ml-5'>
                    {avatarNode}
                    {/* user information */}
                    <h1 className="text-2xl mb-4 font-semibold tracking-tight text-white">{displayName}</h1>
                </div>
            </CardHeader>
            <CardContent className="p-0 mt-0">
                <div className='grid'>
                    <div className='p-2'>
                        <Button className='w-full' variant={'primary'}><Flag className='size-4'/>Báo cáo vi phạm</Button>
                    </div>
                    {/* <div className='p-2'>
                        <Button className='w-full' variant={'destructive'}><UserRoundX className='size-4'/>Xóa bạn bè</Button>
                    </div> */}
                </div>
                
            </CardContent>
        </Card>
    </>
  )
}

export default ConversationDirectBody