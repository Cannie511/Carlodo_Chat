import { Dispatch, SetStateAction, useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { UserPlus, X } from "lucide-react";
import { useFriendStore } from "@/app/stores/useFriendStore";
import { Participant } from "@/app/types/chat";
import UserAvatar from "../userAvatar";
import { Friend } from "@/app/types/user";
import SelectedUsersList from "../newGroupChat/SelectedUsersList";
import { Separator } from "../ui/separator";
import { useChatStore } from "@/app/stores/useChatStore";


interface AddMemberProps { 
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    members: Participant[];
}

const AddMember = ({ setOpen, members }:AddMemberProps) => {
    const [invitedFriends, setInvitedFriends] = useState<Friend[]>([]);
    const {friends} = useFriendStore();
    const {conversations, addParticipant, activeConversationId, updateConversation} = useChatStore();
    const notAFriend = friends.filter((f) => !members.some((m) => m._id === f._id || invitedFriends.some((i) => i._id === f._id)));
    const handleInviteFriend = (friend: Friend) => { 
        if(invitedFriends.some((f) => f._id === friend._id)) {
            return;
        }
        const updatedNotAFriend = notAFriend.filter((f) => f._id !== friend._id);
        notAFriend.splice(0, notAFriend.length, ...updatedNotAFriend);
        setInvitedFriends((prev) => [...prev, friend]);
    }
    const handleRemoveInvitedFriend = (friend: Friend) => { 
        const updatedInvitedFriends = invitedFriends.filter((f) => f._id !== friend._id);
        setInvitedFriends(updatedInvitedFriends);
    }
    const handleAddParticipant = async() => {
        await addParticipant(invitedFriends.map((i) => i._id));
        const activeConvo = conversations.find(c => c._id === activeConversationId);
        const updatedConvo = {
            ...activeConvo,
            participant: [...(activeConvo?.participant || []), ...invitedFriends .filter(i => i !== null).map(i => ({
                _id: i._id,
                displayName: i.displayName,
                avatarUrl: i.avatarUrl || null,
                joinAt: new Date()
            }))]
        }
        updateConversation(updatedConvo);
        setOpen(false);
        setInvitedFriends([]);
    }
  return (
    <Card className="border-background shadow-lg p-3">
        <CardContent className="px-2 space-y-2">
            <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">Thêm thành viên khác</h3>
            </div>
            <div>
                {notAFriend.map((f) => (
                    <div key={f._id} onClick={()=> {handleInviteFriend(f)}} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary cursor-pointer">
                        <div className="flex items-center space-x-2">
                            <UserAvatar name={f.displayName} type="mini" avatarUrl={f.avatarUrl || undefined} />
                            <span className="text-md font-medium">{f.displayName}</span>
                        </div>
                    </div>
                ))}
                <Separator className="my-2" />
                <SelectedUsersList invitedUser={invitedFriends} onRemove={(friend) => handleRemoveInvitedFriend(friend)}/>
            </div>
        </CardContent>
        <CardFooter className="px-2 space-x-2">
            <Button variant={'destructive'} onClick={()=>setOpen(false)} className="flex flex-1 items-center text-white transition-colors gap-2" size={'sm'}>
                <X className="size-4"/> Đóng
            </Button>
            {invitedFriends.length > 0 && 
                <Button variant={'primary'} onClick={handleAddParticipant} className="flex flex-1 items-center text-white transition-colors gap-2" size={'sm'}>
                    <UserPlus className="size-4"/> Thêm thành viên
                </Button>
            }
        </CardFooter>
    </Card>
  )
}

export default AddMember