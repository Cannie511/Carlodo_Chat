import { Socket } from "socket.io-client";
import { Conversation, Message } from "./chat";
import { Friend, FriendRequest, User } from "./user";

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    loading: boolean;
    clearState: ()=>void;
    setBioUser: (bio: string) => void;
    setUser: (user: User)=>void;
    signUp: (username: string, password: string, email: string, firstname: string, lastname: string)=>Promise<number | undefined>;
    signIn: (username: string, password: string) => Promise<void>;
    signOut: ()=>Promise<void>;
    fetchMe: ()=>Promise<void>;
    refresh: ()=>Promise<void>;
}

export interface ThemeState {
    isDark: boolean;
    toggleTheme: ()=>void;
    setTheme: (dark:boolean) => void;
}

export interface ChatState {
    conversations: Conversation[];
    //messages: chứa tất cả các cuộc hội thoại của user hiện tại
    messages: Record<string, {
        items: Message[], //mảng chứa tin nhắn trong từng đoạn hội thoại được phân dựa theo conversationId
        hasMore: boolean, // kiểm tra để cuộn
        nextCursor?: string | null, //phân trang
    }>;
    activeConversationId: string | null;
    convoLoading: boolean;
    messageLoading: boolean;
    loading: boolean;
    reset: ()=>void;
    setActiveConversation: (id:string|null) => void;
    fetchConversation: () => Promise<void>;
    fetchMessages: (conversationId?: string) => Promise<void>;
    sendDirectMessage: (recipientId: string, content: string, imgUrl?: string) => Promise<void>;
    sendGroupMessage: (conversationId: string, content: string, imgUrl?: string) => Promise<void>;
    addMessage: (message: Message) => Promise<void>;
    updateConversation: (conversation: any) => void; 
    markAsSeen: () => Promise<void>;
    addConvo: (convo: Conversation) => void;
    createConversation: (type: "direct" | "group", name: string, memberIds: string[])=>Promise<void>;
    deleteConversation: (conversationId: string) => Promise<void>;
    removeParticipant: (conversationId: string, participantId: string) => Promise<void>;
    addParticipant: (memberIds: string[]) => Promise<void>;
    renameGroup: (name: string) => Promise<void>;
    uploadImageConversation: (formData: FormData) => Promise<void>;
    addImageChat: (message: any) => Promise<void>;
}

export interface SocketState {
    socket: Socket | null;
    onlineUsers: string[];
    connectSocket: ()=>void;
    disconnectSocket: ()=>void;
}

export interface FriendState {
    friends: Friend[];
    loading: boolean;
    receivedList: FriendRequest[];
    sentList: FriendRequest[];
    searchByDisplayName: (displayName: string) => Promise<User[] | null>;
    addFriend: (to:string, message?: string) => Promise<string>;
    getAllFriendRequest: () => Promise<void>;
    acceptRequest: (requestId: string) => Promise<void>;
    declineRequest: (requestId: string) => Promise<void>;
    getFriends: () => Promise<void>;
}

export interface UserState {
    avatarLoading: boolean;
    updateLoading: boolean;
    updateAvatarUrl: (formData: FormData) => Promise<void>;
    updateUser: (displayName:string, email: string, phone: string, bio:string) => Promise<void>;
    changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}