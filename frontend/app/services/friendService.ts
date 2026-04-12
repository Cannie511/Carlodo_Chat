import api from "@/lib/axios"

export const friendService = {
    async searchByDisplayName (displayName: string) {
        const res = await api.post(`/users/search?displayName=${displayName}`);
        return res.data.user;
    },

    async sendFriendRequest (to: string, message?: string) {
        const res = await api.post('/friends/request', {to, message})
        return res.data.message;
    },

    async getAllFriendRequest () {
        try {
            const res = await api.get('friends/request');
            const {sent, received} = res.data;
            return {sent, received}
        } catch (error) {
            console.log("Lỗi khi lấy danh sách kết bạn", error);
        }
    },

    async acceptRequest(requestId:string) {
        try {
            const res = await api.post(`/friends/request/${requestId}/accept`);
            return res.data.newFriend
        } catch (error) {
            console.log("Lỗi khi đồng ý kết bạn", error);
        }
    },

    async declineRequest(requestId: string) {
        try {
            await api.post(`/friends/request/${requestId}/decline`);
        } catch (error) {
            console.log("Lỗi khi từ chối kết bạn", error);
        }
    },

    async getFriendList() {
        const res = await api.get("/friends");
        return res.data.friends;
    }
}