import { Card, CardContent, CardHeader } from '../ui/card'
import { Lock, LockOpen, ShieldAlert } from 'lucide-react'
import { ChangePasswordCollapse } from './ChangePassswordCollapse'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import ChangePasswordForm from './ChangePasswordForm'

const SecureTabsList = [
  {
    icon: <LockOpen className='size-4 text-muted-foreground'/>,
    title: "Đổi mật khẩu",
    section: (
      <ChangePasswordForm/>
    )
  },
  {
    icon: <ShieldAlert className='size-4 text-muted-foreground'/>,
    title: "Danh sách chặn",
    section: (
      <p>Quản lý danh sách người dùng mà bạn đã chặn</p>
    )
  }
]

const SecureTab = () => {
  return (
    <Card className='p-3 border-accent-foreground shadow-lg'>
        <CardHeader className='p-0'>
            <div className="flex items-center space-x-2">
                <Lock className='size-5 text-primary'/>
                <span className='text-md capitalize font-semibold'> quyền riêng tư & bảo mật</span>
            </div>
            <p className='text-muted-foreground text-sm'>Quản lý cài đặt quyền riêng tư của bạn</p>
        </CardHeader>
        <CardContent className='p-0 space-y-2 '>
          <div className='max-h-[325px] space-y-2 overflow-y-auto beautiful-scrollbar'>
            {SecureTabsList.length > 0 && SecureTabsList.map((item, index) => (
              <ChangePasswordCollapse icon={item.icon} key={index} title={item.title} section={item.section}/>
            ))}
          </div>
          <Separator/>
          <Button variant={'destructive'} className='w-full'>
            Xóa tài khoản
          </Button>
        </CardContent>
    </Card>
  )
}

export default SecureTab