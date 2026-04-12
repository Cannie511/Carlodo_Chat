import { Info} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ReactNode, useEffect, useState } from "react";
import { Participant } from "@/app/types/chat";
import ConversationGroupBody from "./conversationGroupBody";
import ConversationDirectBody from "./conversationDirectBody";
import { useFriendStore } from "@/app/stores/useFriendStore";
interface ConversationInfoModalProps { 
    type: "direct" | "group";
    avatarNode: ReactNode;
    name: string;
    members: Participant[];
    createdBy: string;
}   

const ConversationInfoModal = ({type, avatarNode, name, members, createdBy}: ConversationInfoModalProps) => {
  const [open, setOpen] = useState(false);
  const {friends, getFriends} = useFriendStore();
  useEffect(() => {
    if(friends.length === 0) {
      getFriends();
    }
  },[])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
            <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="size-6"/>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Thông tin cuộc trò chuyện</p>
                </TooltipContent>
              </Tooltip>
        </DialogTrigger>
        <DialogContent className="border-background p-3 glass">
            <DialogTitle className="text-xl font-bold text-center">
                Thông tin cuộc trò chuyện
            </DialogTitle>
            {type === "group" && <ConversationGroupBody setOpen={setOpen} avatarNode={avatarNode} groupName={name} members={members} createdBy={createdBy}/>}
            {type === "direct" && <ConversationDirectBody avatarNode={avatarNode} displayName={name} />}
        </DialogContent>
    </Dialog>
  )
}

export default ConversationInfoModal