import React, { Dispatch, SetStateAction, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import ProfileCard from './ProfileCard';
import { useAuthStore } from '@/app/stores/useAuthStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ProfileTab from './ProfileTab';
import SecureTab from './SecureTab';

interface ProfileDialogProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
}


const ProfileDialog = ({open, setOpen}: ProfileDialogProps) => {
    const [tab, setTab] = useState<string>('profile');
    const {user} = useAuthStore();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='overflow-y-auto p-0 bg-transparent border-0 shadow-2xl'>
            <div className='bg-gradient-glass'>
                <div className='max-w-4xl mx-auto p-4'>
                    {/* heading */}
                    <DialogTitle  className="mb-6">
                        <span className='text-xl font-bold text-foreground'>Thông Tin Tài Khoản</span>
                    </DialogTitle>
                    <ProfileCard user={user}/>
                     <Tabs value={tab} onValueChange={setTab} className='w-full mt-2'>
                        <TabsList className='grid w-full grid-cols-2'>
                            <TabsTrigger value='profile'>
                                Tài khoản
                            </TabsTrigger>
                            <TabsTrigger value='secure'>
                                Bảo mật
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="profile">
                           <ProfileTab/>
                        </TabsContent>
                          
                        <TabsContent value="secure">
                            <SecureTab/>
                        </TabsContent>
                    </Tabs>
                </div>
               
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default ProfileDialog