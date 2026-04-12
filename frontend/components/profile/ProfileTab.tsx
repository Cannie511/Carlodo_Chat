import React, { ChangeEvent } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { File, Heart } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { useAuthStore } from '@/app/stores/useAuthStore'
import z, { email } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Spinner } from '../ui/spinner'
import { useUserStore } from '@/app/stores/useUserStore'
import { toast } from 'sonner'

const profileSchema = z.object({
    displayName: z.string().min(2, "Tên phải chứa ít nhất 2 ký tự"),
    username: z.string().min(3, 'Tên đăng nhập phải chứa ít nhất 3 ký tự'),
    email: z.email("Không đúng định dạng email"),
    phone: z.string(),
    bio: z.string()
})

type profileFormValues = z.infer<typeof profileSchema>;

const ProfileTab = () => {
    const {user} = useAuthStore();
    const {updateUser} = useUserStore();
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<profileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            displayName: user?.displayName,
            username: user?.username,
            email: user?.email,
            phone: user?.phone,
            bio: user?.bio
        }
    });
    const onSubmit = async (data:profileFormValues) => {
        const {displayName, username, email, phone, bio} = data;
        if(!displayName || !username || !email) return;
        if(displayName === user?.displayName && email === user?.email && phone === user.phone && bio === user.bio){
            toast.error("Chưa có thay đổi mới để cập nhật!");
            return;
        }
        await updateUser(displayName, email, phone, bio);
    }
    
    if(!user) return;
    
  return (
    <Card className='p-3 border-accent-foreground shadow-lg'>
        <CardHeader className='p-0'>
            <div className="flex items-center space-x-2">
                <Heart className='size-5 text-primary'/>
                <span className='text-md capitalize font-semibold'> Thông tin cá nhân</span>
            </div>
            <p className='text-muted-foreground text-sm'>Cập nhật chi tiết thông tin cá nhân và thông tin hồ sơ của bạn</p>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <CardContent className='p-0 space-y-4'>
                <div className="grid grid-cols-2 space-x-4">
                    <div className="space-y-2">
                        <Label htmlFor='displayName'>Tên hiển thị</Label>
                        <Input {...register("displayName")} disabled={isSubmitting} id='displayName' maxLength={100} required/>
                        {errors.displayName && <p className="error-message">{errors.displayName.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor='username'>Tên người dùng</Label>
                        <Input id='username' disabled {...register("username")} maxLength={50} required />
                        {errors.username && <p className="error-message">{errors.username.message}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-2 space-x-4">
                    <div className="space-y-2">
                        <Label htmlFor='email'>Email</Label>
                        <Input id='email' disabled={isSubmitting}  {...register("email")} type='email' required/>
                        {errors.email && <p className="error-message">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor='phone'>Số điện thoại</Label>
                        <Input id='phone' disabled={isSubmitting}  {...register("phone")}  maxLength={10} placeholder=''/>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor='bio'>Giới thiệu</Label>
                    <Textarea id='bio' disabled={isSubmitting}  {...register("bio")} rows={5} className='resize-none min-h-[100px]'/>
                </div>
            </CardContent>
            <CardFooter className='p-0 flex justify-end'>
                <Button size={'lg'} type='submit' disabled={isSubmitting} variant={'outline'} className='bg-gradient-chat'>
                    {
                        isSubmitting ? (
                            <>
                                <Spinner className='size-4 text-white'/> Đang cập nhật...
                            </>
                        ) : (
                            <><File className='size-4'/> Cập nhật</>
                        )
                    }
                </Button>
            </CardFooter>
        </form>
    </Card>
  )
}

export default ProfileTab