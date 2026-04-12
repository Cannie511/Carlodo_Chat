import { Friend } from '@/app/types/user'
import React from 'react'
import UserAvatar from '../userAvatar';
import { X } from 'lucide-react';

interface SelectedUsersListProps {
    invitedUser: Friend[];
    onRemove: (friend: Friend) => void;
}

const SelectedUsersList = ({invitedUser, onRemove}: SelectedUsersListProps) => {
    if(invitedUser.length === 0) return;

  return (
    <div className='flex flex-wrap gap-2 pt-2'>
        {
            invitedUser.map((user) => (
                <div className='flex items-center gap-1 bg-muted text-sm rounded-full px-3 py-1' key={user._id}>
                    <UserAvatar type='chat' name={user.displayName} avatarUrl={user.avatarUrl}/>
                    <span>{user.displayName}</span>
                    <X className='size-3 cursor-pointer hover:text-destructive' onClick={()=>onRemove(user)}/>
                </div>
            
            ))
        }
    </div>
  )
}

export default SelectedUsersList