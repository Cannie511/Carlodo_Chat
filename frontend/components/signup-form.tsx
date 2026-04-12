'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { Label } from "./ui/label"
import { z } from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "@/app/stores/useAuthStore"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useLayoutEffect } from "react"

const signUpSchema = z.object({
  firstname: z.string().min(1, 'Tên không được để trống'),
  lastname: z.string().min(1, 'Họ không được để trống'),
  username: z.string().min(3, 'Tên đăng nhập phải chứa ít nhất 3 ký tự'),
  email: z.email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự")
})

type signUpFormValues = z.infer<typeof signUpSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const {accessToken} = useAuthStore();
  const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<signUpFormValues>({
    resolver: zodResolver(signUpSchema),
  }); 

  const {signUp} = useAuthStore();

  const onSubmit = async (data:signUpFormValues) =>{
    const {email, firstname, lastname, password, username} = data;
    
    const resStatus = await signUp(username, password, email, firstname, lastname);
    if(resStatus === 204){
      router.push('/signin');
    }
  }
  useLayoutEffect(() => {
    if(accessToken) router.push('/');
  },[])

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3">
              {/* header & logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <Link href={"/"} className="mx-auto block w-fit text-center">
                  <Image className="rounded-xl" width={80} height={80} alt="Logo" src="/logo.png"/>
                </Link>
                <h1 className="text-2xl font-bold">Tạo tài khoản <span className="text-primary">Carlodo</span></h1>
                <p className="text-muted-foreground text-balance">
                  Chào bạn! Hãy đăng ký để bắt đầu
                </p>
              </div>

               {/* input họ tên */}
               <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="lastname">Họ</Label>
                  <Input type="text" id="lastname" placeholder="Nguyễn" {...register("lastname")}/>
                  {errors.lastname && <p className="error-message">{errors.lastname.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstname">Tên</Label>
                  <Input type="text" id="firstname" placeholder="Cảnh" {...register("firstname")}/>
                  {errors.firstname && <p className="error-message">{errors.firstname.message}</p>}
                </div>
               </div>

               {/* input username*/}
               <div className="flex flex-col gap-3">
                 <Label htmlFor="username" className="block text-sm">Tên đăng nhập</Label>
                  <Input type="text" id="username" placeholder="Carlodo" {...register("username")}/>
                  {errors.username && <p className="error-message">{errors.username.message}</p>}
               </div>

                {/* input email */}
                <div className="flex flex-col gap-3">
                 <Label htmlFor="email" className="block text-sm">Email</Label>
                  <Input type="email" id="email" placeholder="canhnguyen@carlodo.com" {...register("email")}/>
                  {errors.email && <p className="error-message">{errors.email.message}</p>}
               </div>

                 {/* input password */}
                <div className="flex flex-col gap-3">
                 <Label htmlFor="password" className="block text-sm">Mật khẩu</Label>
                  <Input type="password" id="password" placeholder="" {...register("password")}/>
                  {errors.password && <p className="error-message">{errors.password.message}</p>}
               </div>

               <Button type="submit" className="w-full" disabled={isSubmitting}>Tạo tài khoản</Button>
               <div className="text-center text-sm">Bạn đã có tài khoản? {" "} <Link className="underline underline-offset-4" href={"/signin"}>Đăng nhập</Link></div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="./placeholderSignup.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offset-4">
        Để tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a>{" "}
        và <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  )
}
