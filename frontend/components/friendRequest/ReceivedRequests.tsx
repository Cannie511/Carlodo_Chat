import { useFriendStore } from '@/app/stores/useFriendStore'
import React from 'react'
import FriendRequestItem from './FriendRequestItem';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const ReceivedRequests = () => {
    const {acceptRequest, declineRequest, loading, receivedList} = useFriendStore();
    const handleAccept = async(requestId:string) => {
        try {
            await acceptRequest(requestId);
            toast.success("Đã đồng ý kết bạn")
        } catch (error) {
            console.log(error);
        }
    }
    const handleDecline = async(requestId:string) => {
        try {
            await declineRequest(requestId);
            toast.success("Đã từ chối kết bạn")
        } catch (error) {
            console.log(error);
        }
    }
    if(!receivedList || receivedList.length === 0) { 
        return (
            <p className='text-sm text-muted-foreground'>
                Bạn chưa có lời mời kết bạn nào
            </p>
        )
    }
  return (
    <div className='space-y-3 mt-4'>
        {
            receivedList.map((req) => (
                <FriendRequestItem requestInfo={req} type='received' key={req._id} actions={
                    <div className='flex gap-2'>
                        <Button size={'sm'} variant={'primary'} onClick={()=>handleAccept(req._id)} disabled={loading}>
                            Chấp nhận
                        </Button>
                        <Button size={'sm'} variant={'destructiveOutline'} onClick={()=>handleDecline(req._id)} disabled={loading}>
                            Từ chối
                        </Button>   
                    </div>
                }/>
            ))
        }
    </div>
  )
}

export default ReceivedRequests