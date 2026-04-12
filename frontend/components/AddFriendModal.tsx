import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { UserPlus } from 'lucide-react';
import { User } from '@/app/types/user';
import { useFriendStore } from '@/app/stores/useFriendStore';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import SearchFom from './addFriendModal/SearchFom';
import SendFriendRequestForm from './addFriendModal/SendFriendRequestForm';
import { Card } from './ui/card';
import SearchFriendCard from './addFriendModal/SearchFriendCard';
import { useAuthStore } from '@/app/stores/useAuthStore';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export interface IFormValue {
  displayName: string;
  message: string;
}

const AddFriendModal = () => {
  const {user} = useAuthStore();
  const [isFound, setIsFound] = useState<boolean | null>(null);
  const [searchUser, setSearchUser] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [searchedDisplayName, setSearchedDisplayName] = useState<string>("");
  const {loading, searchByDisplayName, addFriend} = useFriendStore();

  const {
    register, handleSubmit, watch, reset, formState: {errors}
  } = useForm<IFormValue>({defaultValues: {displayName: "", message: ""}});

  const displayNameValue = watch("displayName");

  const handleSearch = handleSubmit(async (data)=> {
    const displayName = data.displayName.trim();
    if(!displayName) return;
    setIsFound(null);
    setSearchedDisplayName(displayName);
    try {
      const foundUser = await searchByDisplayName(displayName);
      if(foundUser) {
        const searchUserWithoutMe = foundUser.filter((u) => u._id !== user?._id)
        if(searchUserWithoutMe.length === 0) {
          setIsFound(false);
          return;
        }
        setSearchUser(searchUserWithoutMe);
      }
      // else {
      //   setIsFound(false)
      // }
    } catch (error) {
      console.log("Lỗi khi tìm kiếm bạn bè",error);
      setIsFound(false);
    }
  })

  const handleSelected = (user: User) => {
    setSelectedUser(user);
    setSearchUser([]);
    setIsFound(true);
  }

  const handleSend = handleSubmit(async(data)=> {
    if(!selectedUser) return;
    try {
      const message = await addFriend(selectedUser._id, data.message.trim());
      toast.success(message);
      handleCancel();
    } catch (error) {
      console.log("Lỗi khi gửi lời mời kết bạn: ", error);
      
    }
  })

  const handleCancel = () => {
    reset();
    setSearchedDisplayName("");
    setIsFound(null);
  }

  return (
    <Dialog>
      <Tooltip>
          <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <div className='flex justify-center items-center size-5 rounded-full hover:bg-sidebar-accent cursor-pointer z-10'>
                  <UserPlus className='size-4'/>
                  <span className='sr-only'>Kết bạn</span>
                </div>
              </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="capitalize">thêm bạn mới</p>
          </TooltipContent>
        </Tooltip>
      

      <DialogContent className='sm:max-w-[425px] border-none'>  
        <DialogTitle>  

          Tìm kiếm bạn bè
        </DialogTitle>
        <DialogHeader>
          Danh sách tìm kiếm {searchUser.length > 0 && <>: {searchUser.length} kết quả.</>}
        </DialogHeader>
        <div className='max-h-50 overflow-auto beautiful-scrollbar'>
           {
              searchUser.length > 0 && searchUser.map((u, i)=> (
                <SearchFriendCard displayName={u.displayName} key={u._id} username={u.username} avatarUrl={u.avatarUrl} onClick={()=>handleSelected(u)}/>
              ))
            }
        </div>
       
        {!isFound && (
          <SearchFom
            register={register}
            errors={errors}
            displayNameValue={displayNameValue}
            loading={loading}
            isFound={isFound}
            searchedDisplayName={searchedDisplayName}
            onSubmit={handleSearch}
            onCancel={handleCancel}
          />
        )}

        {isFound && (
          <SendFriendRequestForm
            register={register}
            displayNameValue={displayNameValue}
            loading={loading}
            searchedDisplayName={selectedUser?.displayName}
            onSubmit={handleSend}
            onBack={()=>setIsFound(null)}
          />
        )}

      </DialogContent>
    </Dialog>
  )
}

export default AddFriendModal