
import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useUserStore } from '@/app/stores/useUserStore'

const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Mật khẩu cũ phải có ít nhất 6 ký tự").max(100),
  newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự").max(100),
  confirmPassword: z.string().min(6, "Xác nhận mật khẩu mới phải có ít nhất 6 ký tự").max(100),
}).refine((data) => data.newPassword === data.confirmPassword, { //refine để kiểm tra tính hợp lệ của 1 field dựa trên giá trị của field khác
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"], // gán lỗi cho confirmPassword
}).refine((data) => data.oldPassword !== data.newPassword, {
  message: "Mật khẩu mới không được trùng với mật khẩu cũ",
  path: ["newPassword"]
});

type changePasswordFormValues = z.infer<typeof changePasswordSchema>;

const ChangePasswordForm = () => {
    const { changePassword} = useUserStore();
    const {register, handleSubmit, formState: {errors, isSubmitting}, reset} = useForm<changePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema)
    })
    const onSubmit = async (data: changePasswordFormValues) => { 
        const {oldPassword, newPassword, confirmPassword} = data;
        if(newPassword !== confirmPassword){
            toast.error("Mật khẩu mới và xác nhận mật khẩu mới không khớp!");
            return;
        }
        await changePassword(oldPassword, newPassword);
        reset();
    }
  return (
    <form className='space-y-4 w-full' onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-2'>
            <Label htmlFor='oldPassword' className='px-2'>Mật khẩu cũ</Label>
            <Input id='oldPassword' type='password' {...register('oldPassword')}/>
        </div>
        <div className='space-y-2'>
            <Label htmlFor='newPassword' className='px-2'>Mật khẩu mới</Label>
            <Input id='newPassword' type='password' {...register('newPassword')}/>
            {errors.newPassword && <p className='error-message'>{errors.newPassword.message}</p>}
        </div>
        <div className='space-y-2'>
            <Label htmlFor='confirmPassword' className='px-2'>Xác nhận mật khẩu mới</Label>
            <Input id='confirmPassword' type='password' {...register('confirmPassword')}/>
            {errors.confirmPassword && <p className='error-message'>{errors.confirmPassword.message}</p>}
        </div>
        <div className='flex items-center justify-end'>
             <Button type='submit' disabled={isSubmitting} >Đổi mật khẩu</Button>
        </div>
       
    </form>
  )
}

export default ChangePasswordForm