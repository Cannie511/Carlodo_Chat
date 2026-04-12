import Image from 'next/image'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='flex flex-col items-center relative z-10 min-h-screen text-center'>
      <Image width={600} height={360} src="/404_NotFound.png" alt="Not Found" className='max-w-full mt-5 mb-6 rounded-xl' />
      <p className='text-2xl text-muted font-bold'>
        Kiếm gì ở đâyy ⁉️ <br />
      </p>
      <Link href="/" className='inline-block px-6 py-3 mt-6 font-medium text-white transition shadow-md bg-gradient-chat rounded-2xl hover:bg-teal-600/80'>
        Quay về trang chủ
      </Link>
    </div>
  )
}