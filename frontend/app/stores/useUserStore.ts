import { create } from "zustand";
import { UserState } from "../types/store";
import { userService } from "../services/userService";
import { useAuthStore } from "./useAuthStore";
import { toast } from "sonner";
import { useChatStore } from "./useChatStore";

export const useUserStore = create<UserState>((set, get) => ({
    avatarLoading: false,
    updateLoading: false,
    updateAvatarUrl: async(formData) => {
        const {user, setUser} = useAuthStore.getState();
        try {
            set({avatarLoading: true});
            const data = await userService.uploadAvatar(formData);
            if(user) {
                setUser({
                    ...user, avatarUrl: data.avatarUrl
                })
            }
            useChatStore.getState().fetchConversation();
        } catch (error) {
            console.log("Lỗi khi cập nhật avatar", error);
            toast.error("Hình ảnh không được vượt quá 2MB")
        } finally { set({avatarLoading: false})}
    },
    updateUser: async(displayName, email, phone, bio) => {
        try {
            set({updateLoading: true});
            if(!displayName || !email) return;
            const updatedUser = await userService.updateUser(displayName, email, phone, bio);
            toast.success("Cập nhật thông tin thành công")
            if(updatedUser) {
                useAuthStore.getState().setUser(updatedUser);
            }
        } catch (error) {
            console.log("Lỗi khi cập nhật thông tin người dùng", error);
            toast.error("Lỗi khi cập nhật thông tin người dùng")
        } finally {
            set({updateLoading:false})
        }
    },
    changePassword: async(oldPassword, newPassword) => {
        try {
            set({updateLoading: true});
            await userService.changePassword(oldPassword, newPassword);
            toast.success("Đổi mật khẩu thành công");
        } catch (error: any) {
            console.log("Lỗi khi đổi mật khẩu", error?.status);
            if(error?.status === 400) {
                toast.error("Mật khẩu không đúng");
            } else {
                toast.error("Lỗi khi đổi mật khẩu");
            }
        } finally {
            set({updateLoading: false});
        }
    }
}))