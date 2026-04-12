import {create} from 'zustand'
import {toast} from 'sonner'
import { authService } from '../services/authService'
import { AuthState } from '../types/store'
import { useChatStore } from './useChatStore'
import { persist } from 'zustand/middleware'


export const useAuthStore = create<AuthState>()(
    persist(
        (set, get)=>({
            accessToken: null,
            refreshToken: null,
            user: null,
            loading: false,
            clearState: ()=> {
                set({
                    accessToken: null,
                    refreshToken: null,
                    user: null,
                    loading: false, 
                })
                useChatStore.getState().reset();
                localStorage.removeItem("auth-storage");
                sessionStorage.clear();
            },
            //function store
            signUp: async(username, password, email, firstname, lastname)=>{
                try {
                    set({loading: true})
                    const resStatus = await authService.signUp({username, password, email, firstname, lastname});
                    
                    toast.success("Đăng ký tài khoản thành công");
                    return resStatus;
                } catch (error:any) {
                    console.log("Lỗi signUp: ", error);
                    if(error?.status === 409) {
                        toast.error("Tên đăng nhập hoặc email đã tồn tại, Vui lòng chọn tên khác");
                        return 409;
                    }
                    toast.error("Đăng ký không thành công!");
                } finally {
                    set({loading: false})
                }
            },

            signIn: async(username, password)=>{
                try {
                    get().clearState();
                    set({loading: true})
                    const {accessToken, refreshToken} = await authService.signIn({username, password});
                    set({accessToken, refreshToken});
                    useChatStore.getState().reset();
                    await get().fetchMe()
                    useChatStore.getState().fetchConversation();
                    toast.success("Chào mừng bạn quay trở lại");
                } catch (error:any) {
                    if(error?.status === 401) {
                        toast.error("Tài khoản hoặc mật khẩu không đúng");
                        return;
                    }
                    toast.error("Đã có lỗi xảy ra khi đăng nhập, Vui lòng thử lại");
                } finally {
                    set({loading: false})
                }
            },

            signOut: async()=> {
                try {
                    get().clearState();
                    await authService.signOut();
                    toast.success("Đăng xuất thành công");
                } catch (error) {
                    console.log("Lỗi signOut: ", error);
                    toast.error("Đăng xuất không thành công! vui lòng thử lại");
                } 
            },

            fetchMe: async()=> {
                try {
                    set({loading: true})
                    const user = await authService.fetchMe();
                    set({user});
                } catch (error) {
                    console.log("Lỗi fetchMe: ", error);
                    toast.error("Lỗi khi load dữ liệu người dùng");
                }finally {
                    set({loading: false})
                }
            },

            refresh: async() => {
                try {
                    const {user, fetchMe} = get();
                    const accessToken = await authService.refreshToken();
                    set({accessToken});
                    if(!user) {
                        await fetchMe();
                    }
                } catch (error) {
                    console.log("Lỗi refresh token: ", error);
                    toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
                    get().clearState();
            
                }
            },
            setBioUser: (bio) => {
                set((state) => ({
                    user: {...state.user!, bio}
                }))
            },
            setUser: (user) => {
                set({user})
            }
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({user: state.user, accessToken: state.accessToken, refreshToken: state.refreshToken})
        } 
    )
)