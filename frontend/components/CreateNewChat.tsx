import { useFriendStore } from "@/app/stores/useFriendStore"
import { Card } from "./ui/card";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { MessageCirclePlus } from "lucide-react";
import FriendListModal from "./createNewChat/FriendListModal";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const CreateNewChat = () => {
  const [open , setOpen] = useState<boolean>(false);

  const {getFriends} = useFriendStore();
  const handleGetFriends = async() => {
    await getFriends()
  }
  return (
    <div className="flex gap-2 ">
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
              <DialogTrigger onClick={handleGetFriends} className="cursor-pointer">
                <div className="flex items-center gap-4 ">
                  <div className="size-8 bg-gradient-chat rounded-full flex items-center 
                  justify-center group-hover/card:scale-110 transition-bounce">
                    <MessageCirclePlus className="size-4 text-white"/>
                  </div>

                  <span className="sr-only capitalize">
                    Gửi tin nhắn mới
                  </span>
                </div>
              </DialogTrigger>
            
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="capitalize">gửi tin nhắn mới</p>
          </TooltipContent>
        </Tooltip>
        <FriendListModal setOpen={setOpen}/>
      </Dialog>
    </div>
  )
}

export default CreateNewChat