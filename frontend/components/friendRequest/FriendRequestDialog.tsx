import { useFriendStore } from "@/app/stores/useFriendStore";
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import SentRequests from "./SentRequests";
import ReceivedRequests from "./ReceivedRequests";


interface FriendRequestDialogProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
}

const FriendRequestDialog = ({open, setOpen}: FriendRequestDialogProps) => {
    const [tab, setTab] = useState<string>('received');
    const { getAllFriendRequest } = useFriendStore();
    useEffect(()=> {
        const loadRequest = async () => {
            try {
                await getAllFriendRequest();
            } catch (error) {
                console.log(error);
            }
        }
        loadRequest();
    },[])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>Lời mời kết bạn</DialogTitle>
            </DialogHeader>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="received">
                        Đã nhận
                    </TabsTrigger>
                    <TabsTrigger value="sent">
                        Đã gửi
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="received">
                    <ReceivedRequests/>
                </TabsContent>

                <TabsContent value="sent">
                    <SentRequests/>
                </TabsContent>
            </Tabs>
        </DialogContent>
    </Dialog>
  )
}

export default FriendRequestDialog