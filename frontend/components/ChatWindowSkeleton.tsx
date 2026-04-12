import React from 'react'
import { SidebarInset, SidebarTrigger } from './ui/sidebar'
import { Separator } from './ui/separator'
import { Skeleton } from './ui/skeleton'
import { Spinner } from './ui/spinner'


const ChatWindowSkeleton = () => {
  return (
    <SidebarInset className='flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md'>
      {/* Header */}
     <header className="sticky top-0 z-10 px-4 py-2 flex items-center bg-background">
      <div className="flex items-center gap-2 w-full">
        <SidebarTrigger className="-ml-1 text-foreground"/>
         <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4"/>
        <div className="p-2 w-full flex items-center gap-3">
          {/* avatar */}
          <div className="flex w-fit items-center gap-4">
            <Skeleton className="size-10 shrink-0 rounded-full bg-muted-foreground" />
            <div className="grid gap-2">
              <Skeleton className="h-4 w-[150px] bg-muted-foreground" />
              <Skeleton className="h-4 w-[100px] bg-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
     </header>
      <div className="flex1-1 overflow-y-auto h-full bg-primary-foreground">
        <div className='p-4 bg-primary-foreground h-full flex items-center justify-center'>
          <Spinner className='size-24 text-primary'/>
        </div>
      </div>
    </SidebarInset>
  )
}

export default ChatWindowSkeleton