import { create } from "zustand";
import { friendService } from "../services/friendService";
import { FriendState } from "../types/store";
import { toast } from "sonner";

export const useFriendStore = create<FriendState>((set, get) => ({
    friends: [],
    loading: false,
    receivedList: [],
    sentList: [],
    searchByDisplayName: async(displayName) => {
        try {
            set({loading: true});
            const user = await friendService.searchByDisplayName(displayName);
            return user;
        } catch (error) {
            console.log("Error with search friend by display name", error);
            toast.error("Lỗi khi tìm kiếm bạn bè");
        } finally {
            set({loading: false})
        }
    },
    addFriend: async(to, message) => {
        try {
            set({loading: true});
            const resultMessage = await friendService.sendFriendRequest(to, message);
            return resultMessage;
        } catch (error) {
            console.log("Error with add friend", error);
            toast.error("Lỗi khi thêm bạn bè");
        } finally {
            set({loading:false})
        }
    },
    getAllFriendRequest: async() => {
        try {
            set({loading: true});
            const result = await friendService.getAllFriendRequest();
            if(!result) return;
            const {sent, received} = result;
            set({
                sentList: sent,
                receivedList: received
            })
        } catch (error) {
             console.log("Error with get all friend request", error);
            toast.error("Lỗi khi lấy danh sách lời mời kết bạn");
        } finally {
            set({loading: false})
        }
    },
    acceptRequest: async(requestId)=> {
        try {
            set({loading: true});
            await friendService.acceptRequest(requestId);
            set((state) => ({
                receivedList: state.receivedList.filter((r) => r._id !== requestId)
            }))
        } catch (error) {
            console.log("Error with accept friend request", error);
            toast.error("Lỗi khi đồng ý lời mời kết bạn");
        } finally {
            set({loading: false})
        }
    },
    declineRequest: async (requestId) => {
        try {
            set({loading: true});
            await friendService.declineRequest(requestId);
            set((state) => ({
                receivedList: state.receivedList.filter((r) => r._id !== requestId)
            }))
        } catch (error) {
            console.log("Error with decline friend request", error);
            toast.error("Lỗi khi từ chối lời mời kết bạn");
        } finally {
            set({loading: false})
        }
    },
    getFriends: async() => {
        try {
            set({loading: true});
            const friends = await friendService.getFriendList();
            set({friends});
        } catch (error) {
            console.log("Error with get friends", error);
            toast.error("Lỗi khi lấy danh sách bạn bè");
        } finally {
            set({loading: false})
        }
    }
}))