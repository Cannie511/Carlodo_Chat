import React from 'react'
import { Card } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface SearchFriendCardProps {
    avatarUrl?: string;
    displayName:string;
    username: string;
    onClick: ()=>void;
}

const SearchFriendCard = ({displayName,username,avatarUrl, onClick}:SearchFriendCardProps) => {
    const bgColor = !avatarUrl ? "bg-linear-to-br from-blue-400 to-purple-400/70" : "";
  return (
    <Card className='border-none mb-1 p-3 cursor-pointer transition-all glass hover:bg-muted/30' onClick={onClick}>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Avatar className="size-12 text-2xl">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback className={`${bgColor} text-white font-semibold`}> {displayName.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center">
                    <h2 className={"font-semibold text-md truncate"}>
                        {displayName}
                    </h2>
                </div>
                <div className="flex items-center">
                    <div className="flex items-center gap-1 flex-1 min-w-0">{username}</div>
                </div>
            </div>
        </div>
    </Card>
  )
}

export default SearchFriendCard