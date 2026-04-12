import { User } from "@/app/types/user"
import { Card, CardContent } from "../ui/card";
import UserAvatar from "../userAvatar";

import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useSocketStore } from "@/app/stores/useSocketStore";
import AvatarUploader from "./AvatarUploader";
import { useUserStore } from "@/app/stores/useUserStore";
import { Spinner } from "../ui/spinner";
import { useAuthStore } from "@/app/stores/useAuthStore";
import { useEffect } from "react";

interface ProfileCardProps {
    user: User | null;
}

const ProfileCard = ({user}: ProfileCardProps) => {
    const {setBioUser} = useAuthStore();
    const {onlineUsers} = useSocketStore();
    const {avatarLoading} = useUserStore();
    useEffect(() => {
        if (!user?.bio) {
            setBioUser("Build quietly, win loudly 🚀");
        }
    }, [user]);

    if(!user) return;
   
    const isOnline = onlineUsers.includes(user._id) ? true : false;
  return (
    <Card className="border-none overflow-hidden p-0 h-52 bg-linear-to-r from-blue-400 via-purple-500 to-pink-500">
        <CardContent className="mt-20 mb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="relative">
                {avatarLoading ? <>
                     <div className="size-24 bg-muted-foreground rounded-full flex items-center justify-center">
                        <Spinner className="size-12"/>
                    </div>
                </> : <>
                    <UserAvatar type="profile" name={user.displayName} avatarUrl={user.avatarUrl ?? undefined}
                    className="ring-4 ring-white shadow-lg"/>
                    {/* nút upload ảnh */}
                    <AvatarUploader/>
                </>}
            </div>

            {/* user information */}
            <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl font-semibold tracking-tight text-white">{user.displayName}</h1>
                {user.bio && (
                    <p className="text-white/70 text-sm mt-2 max-w-lg line-clamp-2">{user.bio}</p>
                )}
            </div>

            {/* trạng thái hoạt động */}
            <Badge className={cn("flex items-center gap-1 capitalize", isOnline ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700")}>
                <div className={cn("size-2 rounded-full animate-pulse", isOnline ? "bg-green-500" : "bg-slate-500")}></div>
                {isOnline ? "hoạt động" : "Ngoại tuyến"}
            </Badge>
        </CardContent>
    </Card>
  )
}

export default ProfileCard