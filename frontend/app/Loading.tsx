import { Spinner } from "@/components/ui/spinner"

const Loading = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <span className="flex items-center space-x-2 text-4xl p-6  font-bold bg-gradient-chat bg-clip-text text-transparent animate-pulse">
        <div><Spinner className="size-10 font-semibold text-primary" /></div>  
        <div>Đang tải dữ liệu, vui lòng đợi...</div>
      </span>
    </div>
  )
}

export default Loading