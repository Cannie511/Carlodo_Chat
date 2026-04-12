'use client'
import { useAuthStore } from '@/app/stores/useAuthStore'
import { usePathname, useRouter } from 'next/navigation';
import React, { ReactNode, useLayoutEffect } from 'react'

const ProtectedRoute = ({children}: {children:ReactNode}) => {
    const {accessToken} = useAuthStore();
    const pathname = usePathname();
    const router = useRouter();
    useLayoutEffect(() => {
        if(pathname !== '/') {
            if(accessToken ) {
                router.push('/')
            } else {
                router.push('/signin')
            }
        }
    },[accessToken])
  return (
    <>{children}</>
  )
}

export default ProtectedRoute