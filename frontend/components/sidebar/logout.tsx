'use client'
import { Button } from '../ui/button'
import { useAuthStore } from '@/app/stores/useAuthStore'
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

const Logout = () => {
    const {signOut, fetchMe} = useAuthStore();
    const router = useRouter();
    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/signin');
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi khi đăng xuất");
        }
    }
    useEffect(()=>{
        fetchMe();
    },[])
  return (
    <>
        <Button className='' variant={'completeGhost'} onClick={handleLogout}>
           <LogOut className='text-destructive'/> Đăng xuất
        </Button>
    </>
    
  )
}

export default Logout