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
import { useLayoutEffect } from "react"
import { Spinner } from "./ui/spinner"

const signInSchema = z.object({
  username: z.string().min(3, 'Tên đăng nhập phải chứa ít nhất 3 ký tự'),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự")
})

type signInFormValues = z.infer<typeof signInSchema>;

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {signIn} = useAuthStore();
  const router = useRouter();
  const {accessToken} = useAuthStore();
  const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<signInFormValues>({
    resolver: zodResolver(signInSchema),
  }); 

  const onSubmit = async (data:signInFormValues) =>{
    const {username, password} = data;
    await signIn(username, password);
    //window.location.reload();
    // router.push('/');
  }

  useLayoutEffect(() => {
    if(accessToken) router.push('/');
  },[accessToken])

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
                <h1 className="text-2xl font-bold">Chào mừng quay lại <span className="text-primary">Carlodo</span></h1>
                <p className="text-muted-foreground text-balance">
                  Chào bạn! Hãy đăng nhập để bắt đầu
                </p>
              </div>

               {/* input username*/}
               <div className="flex flex-col gap-3">
                 <Label htmlFor="username" className="block text-sm">Tên đăng nhập</Label>
                  <Input type="text" id="username" placeholder="Carlodo" {...register("username")}/>
                  {errors.username && <p className="error-message">{errors.username.message}</p>}
               </div>

                 {/* input password */}
                <div className="flex flex-col gap-3">
                 <Label htmlFor="password" className="block text-sm">Mật khẩu</Label>
                  <Input type="password" id="password" placeholder="*************" {...register("password")}/>
                  {errors.password && <p className="error-message">{errors.password.message}</p>}
               </div>

               <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting && <Spinner className="size-5"/>} Đăng nhập</Button>
               <div className="text-center text-sm">Bạn chưa có tài khoản? {" "} <Link className="underline underline-offset-4" href={"/signup"}>Đăng ký ngay</Link></div>
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
