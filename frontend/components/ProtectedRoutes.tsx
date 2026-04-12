'use client'
import Loading from '@/app/Loading'
import { useAuthStore } from '@/app/stores/useAuthStore'
import React, { useEffect } from 'react'

interface ProtectedRoutesProps { 
  children: React.ReactNode
}

const ProtectedRoutes = ({ children }: ProtectedRoutesProps) => {
  const {accessToken, user, loading, refresh, fetchMe} = useAuthStore();
  const [starting, setStarting] = React.useState(true);
  const init = () => {
    if(!accessToken) {
      refresh();
    }

    if(accessToken && !user) {
      fetchMe();
    }
  }

  useEffect(() => {
    init();
  }, [])

  // if(starting || loading) {
  //   return <Loading/>;
  // }
  return (
    <>
      {children}
    </>
  )
}

export default ProtectedRoutes