import { Friend } from "@/app/types/user"
import UserAvatar from "../userAvatar";

interface InviteSuggestionListProps {
    filterFriend: Friend[];
    onSelect: (friend: Friend) => void;
}
const InviteSuggestionList = ({filterFriend, onSelect}:InviteSuggestionListProps) => {
    if(filterFriend.length === 0) return;
  return (
    <div className="border rounded-lg mt-2 h-[400px] overflow-y-auto divide-y">
        {
            filterFriend.map((f) => (
                <div key={f._id} className="overflow-y-auto flex items-center gap-3 p-2 cursor-pointer hover:bg-muted transition" onClick={() => onSelect(f)}>
                    <UserAvatar type="chat" name={f.displayName} avatarUrl={f.avatarUrl}/>
                    <span className="font-medium ">{f.displayName}</span>
                </div>
            ))
        }
    </div>
  )
}

export default InviteSuggestionList