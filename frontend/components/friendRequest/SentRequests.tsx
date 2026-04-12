import { useFriendStore } from '@/app/stores/useFriendStore'
import React from 'react'
import FriendRequestItem from './FriendRequestItem';

const SentRequests = () => {
    const {sentList} = useFriendStore();

    if(!sentList || sentList.length === 0) {
        return (
            <p className='text-sm text-muted-foreground'>
                Bạn chưa gửi lời mời kết bạn nào
            </p>
        )
    }
  return (
    <div className='space-y-3 mt-4'>
       <>{sentList && sentList.map((req) => (
        <FriendRequestItem key={req._id} requestInfo={req} type='sent' actions={
            <p className='text-muted-foreground'>
                Đã gửi lời mời kết bạn  
            </p>
        }/>
       ))}</> 
    </div>
  )
}

export default SentRequests