import { FriendRequest } from "@/app/types/user"
import { ReactNode } from "react";
import UserAvatar from "../userAvatar";

interface FriendRequestItemProps {
    requestInfo: FriendRequest;
    actions: ReactNode;
    type: "sent" | "received";
}

const FriendRequestItem = ({actions,requestInfo, type}: FriendRequestItemProps) => {
    if(!requestInfo) return null;
    const info = type === 'sent' ? requestInfo.to : requestInfo.from
    if(!info) return null;
  return (
    <div className="flex items-center justify-between rounded-lg shadow-md border border-primary-foreground p-3">
        <div className="flex items-center gap-3">
            <UserAvatar type="sidebar" name={info.displayName} avatarUrl={info.avatarUrl}/>
            <div>
                <p className="font-medium">{info.displayName}</p>
                <p className="text-sm text-muted-foreground">@{info.username}</p>
            </div>
            
        </div>
        {actions}
    </div>
  )
}

export default FriendRequestItem