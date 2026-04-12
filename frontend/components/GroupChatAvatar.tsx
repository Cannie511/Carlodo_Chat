import { Participant } from "@/app/types/chat"
import UserAvatar from "./userAvatar";
import { Ellipsis } from "lucide-react";

interface GroupChatAvatarProps {
    participants: Participant[];
    type: "chat" | "sidebar" | "mini";
}

const GroupChatAvatar = ({participants, type}: GroupChatAvatarProps) => {
    const avatars = [];
    const limit = Math.min(participants.length, 3);
    for(let i = 0; i< limit; i++){
        const member = participants[i];
        avatars.push(
            <UserAvatar type={type} key={i} name={member.displayName} avatarUrl={member.avatarUrl ?? undefined}/>
        );

    }
  return (
    // Cash hiển thị 1
    // <div className="relative flex -space-x-3 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:ring-2">
    //     {avatars}
    //     {
    //         participants.length > limit &&
    //         <div className="flex items-center z-10 justify-center size-8 rounded-full bg-muted ring-2 ring-background text-muted-foreground">
    //             <Ellipsis className="size-4"/>
    //         </div>
    //     }
    // </div>

    //Cách hiển thị 2
    <div className="grid grid-row-2 ">
        <div className="flex items-center justify-center">
            {avatars?.[0]} {avatars?.[1]}
        </div>
        <div className="flex items-center justify-center">
            {avatars?.[2]} 
            {
                participants.length > 3 &&
                <div className="flex items-center z-10 justify-center size-6 rounded-full bg-muted-foreground ring-1 ring-background text-muted">
                    <Ellipsis className="size-4"/>
                </div>
            }
        </div>

    </div>
  )
}

export default GroupChatAvatar