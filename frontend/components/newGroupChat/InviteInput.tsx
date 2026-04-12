import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import InviteSuggestionList from './InviteSuggestionList';
import SelectedUsersList from './SelectedUsersList';
import { Friend } from '@/app/types/user';
import { useFriendStore } from '@/app/stores/useFriendStore';

interface InviteInputProps {
    invitedUser: Friend[];
    setInvitedUser: React.Dispatch<React.SetStateAction<Friend[]>>;
}

const InviteInput = ({ invitedUser, setInvitedUser }: InviteInputProps) => {
    const {friends} = useFriendStore();
    
    const [search, setSearch] = useState<string>('');
    const handleSelectFriend = (friend: Friend) => {
        setInvitedUser([...invitedUser, friend]);
        setSearch('');
    }

    const handleRemoveFriend = (friend: Friend) => {
        setInvitedUser(invitedUser.filter((u)=> u._id !== friend._id));
    }
    const filteredFriends = friends.filter((f) => f.displayName.toLowerCase().includes(search.toLocaleLowerCase()) && !invitedUser.some((u)=>u._id === f._id ) && search.trim() !== '');
  return (
    <div className='space-y-2'>
        <Label htmlFor='invite' className='text-sm font-semibold' >
            Mời thành viên
        </Label>
        <Input id='invite' placeholder='Tìm tên người dùng...'
        className='glass border-border/50 focus:border-primary/50 transition-smooth' 
        value={search} onChange={(e)=>setSearch(e.target.value)}/>

        {/* Danh sách gợi ý theo từ khóa tìm kiếm */}
        <InviteSuggestionList filterFriend={filteredFriends} onSelect={handleSelectFriend}/>
        {/* Danh sách đã thêm  */}
        <SelectedUsersList invitedUser={invitedUser} onRemove={handleRemoveFriend}/>
    </div>
  )
}

export default InviteInput