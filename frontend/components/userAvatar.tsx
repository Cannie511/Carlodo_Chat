import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface IUserAvatar {
    type: "sidebar" | "chat" | "profile" | "mini";
    name: string;
    avatarUrl?: string;
    className?: string;
}
const UserAvatar = ({type, className, name, avatarUrl}: IUserAvatar) => {
    const bgColor = !avatarUrl ? "bg-linear-to-br from-blue-400 to-purple-400/70" : "";
    if(!name) name = "Carlodo";
  return (
    <Avatar className={cn(className ?? "", 
    type === "sidebar" && "size-12 text-base",
    type === "chat" && "size-8 text-sm",
    type === "profile" && "size-24 text-3xl shadow-md",
    type === "mini" && "size-6 text-sm")}>
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback className={cn(`${bgColor} text-white font-semibold`, 
          type === "sidebar" && "text-base",
          type === "chat" && "text-sm",
          type === "profile" && "text-3xl shadow-md",
          type === "mini" && "size-6 text-sm"
        )}> {name.charAt(0)}</AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar