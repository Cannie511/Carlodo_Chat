
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Bug, CircleCheckBig, MessageCircleOff, Moon, Paintbrush, Settings, Settings2, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Switch } from '../ui/switch'
import SettingItems from './settingItems'
import { toast } from 'sonner'
import { Dispatch, SetStateAction } from 'react'

interface SettingModalProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const SettingModal = ({open, setOpen}: SettingModalProps) => {
    const {theme, setTheme} = useTheme();
    const handleReport = () => {
        const id = toast.loading("Đang gửi báo cáo lỗi");
        setTimeout(()=>{
            toast.dismiss(id); // đóng loading
            toast.success("Gửi báo cáo lỗi thành công");
        }, 2000)
    }
    const settingItemsList = [
        {
            id: 'st1',
            icon: <Paintbrush className='size-5'/>,
            title: "Giao diện",
            description: "Chọn giao diện sáng hoặc tối",
            optional: 
            <>
                <Sun className="size-4 dark:text-white/80 text-muted-foreground"/>
                <Switch checked={theme === 'dark'} onCheckedChange={()=>{setTheme(theme === 'light' ? 'dark':'light')}} className="data-[state=checked]:bg-white"/>
                <Moon className="size-4 dark:text-white/80 text-muted-foreground"/>
            </>
        },
        {
            id: "st3",
            icon: <CircleCheckBig className='size-5'/>,
            title: 'Trạng thái hoạt động',
            description: "Người khác sẽ không thấy hoạt động của bạn",
            optional:
            <>
                <Switch checked={true} onCheckedChange={()=>{toast.warning("Tính năng đang phát triển")}} className="data-[state=checked]:bg-primary"/>
            </>
        },
        {
            id: 'st2',
            icon: <Bug className='size-5'/>,
            title: "Báo cáo",
            description: "Gửi báo cáo lỗi cho đội ngũ phát triển",
            optional: 
            <Button variant={'completeGhost'} onClick={handleReport} className='text-destructive'>
                Gửi báo cáo lỗi
            </Button>
        },
        {
            id: 'st4',
            icon: <MessageCircleOff className='size-5'/>,
            title: "Nhận tin nhắn từ người lạ",
            description: "Không nhận tin nhắn từ người dùng không phải bạn bè",
            optional: 
            <Switch checked={true} onCheckedChange={()=>{toast.warning("Tính năng đang phát triển")}} className="data-[state=checked]:bg-primary"/>
        }
    ]
    
   
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className='text-right'>
        </DialogTrigger>
        <DialogContent  className='border-border px-3'>
            <DialogHeader>
                <DialogTitle className='text-2xl flex items-center space-x-2'>
                   <Settings2 className='size-6'/> 
                   <span>Cài đặt</span>
                </DialogTitle>
            </DialogHeader>
            <div className='bg-muted rounded-xl'>
                {
                    settingItemsList.map((st) => (
                        <SettingItems icon={st.icon} description={st.description} title={st.title} optional={st.optional} key={st.id}/>
                    ))
                }
           </div>
            <DialogFooter>
                <div className='flex items-center justify-between w-full p-2'>
                    <span className='text-sm text-muted-foreground italic'>
                        version
                    </span>
                    <span className='text-sm text-muted-foreground italic'>
                        v-1.0.11 Beta
                    </span>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default SettingModal