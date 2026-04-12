import React, { ReactNode } from 'react'

interface SettingItemsProps {
    icon: ReactNode;
    title: string;
    optional: ReactNode;
    description: string;
}
const SettingItems = ({icon, optional, title, description}: SettingItemsProps) => {
  return (
    <div className=' p-3 rounded-xl flex items-center justify-between'>
        <div className='flex items-center font-medium space-x-2'>
            <h3>
                {icon}
            </h3>
            <div>
                <span>{title}</span>
                <p className='text-sm text-muted-foreground'>{description}</p>
            </div>
        </div>
        <div className="flex items-center gap-2 ml-3">
            {optional}
        </div>
    </div>
  )
}

export default SettingItems