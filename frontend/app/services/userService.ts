import api from "@/lib/axios";

export const userService = {
    uploadAvatar: async (formData: FormData) => {
        const res = await api.post("/users/uploadAvatar", formData, {
            headers: {"Content-Type": "multipart/form-data"}
        });
        if(res.status === 400) throw new Error(res.data.message);
        return res.data;
    },

    updateUser: async(displayName: string, email: string, phone: string, bio:string) => {
        const res = await api.patch('/users/update', {displayName, email, phone, bio});
        return res.data.user;
    },

    changePassword: async(oldPassword: string, newPassword: string) => { 
        const res = await api.patch('/users/changePassword', {oldPassword, newPassword});
        if(res.status === 400) throw new Error(res.data.message);
        return res.data;
    }
}