import React, { Dispatch, SetStateAction } from 'react'
import { Button } from '../ui/button'
import { SquareArrowRightExit } from 'lucide-react'
import { useChatStore } from '@/app/stores/useChatStore';
import { useAuthStore } from '@/app/stores/useAuthStore';
import { toast } from 'sonner';

interface ConfirmDeleteGroupComponentProps { 
    openDialog: Dispatch<SetStateAction<boolean>>;
    setOpen: Dispatch<SetStateAction<boolean>>;
    createdBy: string;
}

const ConfirmDeleteGroupComponent = ({setOpen, createdBy, openDialog} : ConfirmDeleteGroupComponentProps) => {
    const { activeConversationId, deleteConversation} = useChatStore();
    const { user } = useAuthStore();
    const handleDeleteGroup = async () => { 
        if(!activeConversationId) return;
        if(createdBy !== user?._id) {
            toast.error("Chỉ trưởng nhóm mới có quyền giải tán nhóm chat này");
            return;
        }
        await deleteConversation(activeConversationId!);
        setOpen(false);
        openDialog(false);
        toast.success("Nhóm chat đã được giải tán thành công");
    }
  return (
    <div className="space-y-3 mt-2 max-h-[400px] overflow-y-auto beautiful-scrollbar">
        <div className="flex items-center justify-center py-1 ">
            <h1 className='text-xl font-bold text-center tracking-wide'>Bạn có chắc chắn muốn giải tán nhóm chat này? Hành động này không thể hoàn tác.</h1>    
        </div>
        <div className='grid grid-cols-2 space-x-2'>
            <div>
                <Button variant={'outline'} className="w-full" onClick={()=>setOpen(false)}>
                    Hủy
                </Button>
            </div>
            <div>
                <Button onClick={handleDeleteGroup} className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    <SquareArrowRightExit className="size-4"/> Giải tán nhóm chat
                </Button>
            </div>
            
        </div>
    </div>
  )
}

export default ConfirmDeleteGroupComponent