import { useFriendStore } from '@/app/stores/useFriendStore';
import { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { UserPlus, Users } from 'lucide-react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Friend } from '@/app/types/user';
import { toast } from 'sonner';
import { useChatStore } from '@/app/stores/useChatStore';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import InviteInput from './newGroupChat/InviteInput';

const NewGroupChatModal = () => {
  const [groupName, setGroupName] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const {getFriends} = useFriendStore();
  const [invitedUser, setInvitedUser] = useState<Friend[]>([]);
  const {loading, createConversation} = useChatStore();

  const handleGetFriends = async () => {
    await getFriends();
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      if(invitedUser.length < 2) {
        toast.warning("Bạn phải mời ít nhất 2 thành viên để tạo nhóm");
        return;
      }
      await createConversation("group", groupName, invitedUser.map((u) => u._id));
      setGroupName("");
      setInvitedUser([]);
      setOpen(false);
    } catch (error) {
      console.log("Lỗi khi tạo nhóm chat mới", error);
      toast.error("Lỗi khi tạo nhóm chat mới");
    }
  }

  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
          <TooltipTrigger asChild>
              <DialogTrigger asChild onClick={handleGetFriends}>
                  <div className='flex justify-center items-center size-5 rounded-full hover:bg-sidebar-accent cursor-pointer z-10'>
                    <Users className='size-4'/>
                    <span className='sr-only'>Tạo nhóm chat mới</span>
                  </div>
              </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="capitalize">Tạo nhóm chat mới</p>
          </TooltipContent>
        </Tooltip>
      <DialogContent className='max-w-[425px] border-none'>
        <DialogHeader>
          <DialogTitle className='capitalize'>
            Tạo nhóm chat mới
          </DialogTitle>
        </DialogHeader>
        <form className='space-y-4' onSubmit={handleSubmit}>
          {/* Tên nhóm */}
          <div className='space-y-2'>
            <Label htmlFor='groupName' className='text-sm font-semibold' >
              Tên nhóm
            </Label>
            <Input id='groupName' placeholder='Nhập tên nhóm tại đây...' required
            className='glass border-border/50 focus:border-primary/50 transition-smooth' value={groupName} onChange={(e)=>setGroupName(e.target.value)}/>

            {/* Mời thành viên */}
            <InviteInput invitedUser={invitedUser} setInvitedUser={setInvitedUser}/>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={loading} className='flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth'>
                {
                  loading ? (
                    <span><Spinner className='size-4'/> Đang tạo...</span>
                  ) : (
                    <><UserPlus className='size-4 mr-2'/> Tạo nhóm</>
                  )
                }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewGroupChatModal