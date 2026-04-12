import api from "@/lib/axios";

interface signUpDto {
    username: string,
    password: string,
    email: string,
    firstname: string,
    lastname: string
}

interface signInDto {
    username: string,
    password: string,
}

export const authService = {
    signUp: async ({username, password, email, firstname, lastname}:signUpDto)=>{
        const res = await api.post('/auth/signup',{username, password, email, firstname, lastname}, {withCredentials: true});
        return res.data.status ?? res.status;
    },

    signIn: async({username, password}:signInDto) => {
        const res = await api.post('/auth/signin',{username, password}, {withCredentials: true});
        return res.data;
    },

    signOut: async()=>{
        return api.post('auth/signout', {}, {withCredentials:true});
    },

    fetchMe: async() => {
        const res = await api.get('/users/me', {withCredentials: true})
        return res.data.user
    },
    refreshToken: async()=>{ 
        const res = await api.post('/auth/refresh', {}, {withCredentials: true});
        return res.data.accessToken;
    }
}