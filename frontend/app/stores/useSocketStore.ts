import {create} from 'zustand';
import {io, type Socket} from 'socket.io-client';
import { SocketState } from '../types/store';
import { useAuthStore } from './useAuthStore';
import { useChatStore } from './useChatStore';
import { toast } from 'sonner';

const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
export const useSocketStore = create<SocketState>((set, get)=>({
    socket: null,
    onlineUsers: [],
    connectSocket: () => {
        const accessToken = useAuthStore.getState().accessToken;
        const existingSocket = get().socket;
        
        if(existingSocket) return;
        const socket: Socket = io(baseUrl, {auth: {token: accessToken}, transports: ['websocket']});
        set({socket});
        //socket lắng nghe sự kiện từ backend
        socket.on("connect", ()=> console.log("Kết nối socket thành công!"));
        // các sự kiện socket
        // tin nhắn mới
        socket.on("new-message", ({message, conversation, unreadCount})=>{
            if(Array.isArray(message)) useChatStore.getState().addImageChat(message);
            else useChatStore.getState().addMessage(message);
            console.log(message)
            
            const lastMessage = {
                _id: conversation?.lastMessage?._id,
                content: conversation.lastMessage.content,
                createdAt: conversation.lastMessage.createdAt,
                sender: {
                    _id: conversation.lastMessage.senderId._id,
                    displayName: "",
                    avatarUrl: null
                }
            }
            const updatedConversation = {
                ...conversation,
                lastMessage,
                unreadCount,
            }

            if(useChatStore.getState().activeConversationId === message.conversationId){
                //đánh dấu đã đọc
                useChatStore.getState().markAsSeen()
            }

            useChatStore.getState().updateConversation(updatedConversation)
        })

        // người dùng đọc tin nhắn
        socket.on("read-message", ({conversation, lastMessage}) => {
            const updated = {
                _id: conversation._id,
                lastMessageAt: conversation.lastMessageAt,
                lastMessage,
                unreadCount: conversation.unreadCount,
                seenBy: conversation.seenBy
            };
            useChatStore.getState().updateConversation(updated);
        })

        // nhóm chat giải tán
        socket.on("conversation-deleted", ({conversationId, conversationName}) => { 
            const updatedConversations = useChatStore.getState().conversations.filter((c)=> c._id !== conversationId);
            useChatStore.setState({conversations: updatedConversations, activeConversationId: null});
            toast.info(`Nhóm chat "${conversationName}" đã bị giải tán`);
        })

        //thành viên mới được thêm vào nhóm
        socket.on("participant-added", ({conversationId, participant}) => {
            console.log('thành viên mới được thêm vào', participant)
            const {conversations, updateConversation, activeConversationId} = useChatStore.getState();
            const selectedConvo = conversations.find(c => c._id === conversationId)
            if(activeConversationId === conversationId && selectedConvo) {
                let participantNames:string|undefined = "";
                for(let i = selectedConvo?.participant.length; i < participant.length; i++) {
                    if(i === participant.length -1) {
                        participantNames += participant[i].displayName + ' '
                    } else {
                        participantNames += participant[i].displayName + ', '
                    }
                }
                toast.info(
                   participantNames +  "đã được thêm vào nhóm"
                );
            }
            const existingIds = new Set(selectedConvo?.participant.map(p => p._id));
            const newParticipants = participant
                .filter(p => !existingIds.has(p._id))
                .map(p => ({
                    _id: p._id,
                    displayName: p.displayName,
                    avatarUrl: p.avatarUrl || null,
                    joinAt: new Date()
                }));
            const updatedConvo = {
                ...selectedConvo,
                participant: [...selectedConvo?.participant || [], ...newParticipants]
            }
            updateConversation(updatedConvo)
        })

        // xóa thành viên khỏi nhóm
        socket.on("participant-removed", ({conversationId, conversationName, participantId}) => {
            const {user} = useAuthStore.getState();
            const {conversations, updateConversation, activeConversationId} = useChatStore.getState();
            if(user?._id.toString() === participantId.toString()) {
                //nếu người dùng hiện tại bị xóa khỏi nhóm, cập nhật lại danh sách cuộc hội thoại và active conversation
                const updatedConversations = conversations.filter((c)=> c._id !== conversationId);
                useChatStore.setState({conversations: updatedConversations, activeConversationId: null});
                toast.info(`Bạn đã bị xóa khỏi nhóm chat "${conversationName}"`);
            } else {
                //thông báo cho những người dùng trong nhóm và cập nhật lại participant trong nhóm
                if(activeConversationId === conversationId) {
                    toast.info("1 Thành viên đã bị xóa khỏi nhóm")
                }
                const convo = conversations.find(c => c._id === conversationId);
                const updatedConvo = {
                    ...convo, 
                    participant: convo?.participant.filter(p => p._id.toString() !== participantId.toString())
                }
                updateConversation(updatedConvo);
            }
        })

        socket.on("out-group", ({conversationId, conversationName, participantId, participantName})=> {
            if(useAuthStore.getState().user?._id.toString() === participantId.toString()) {
                const updatedConvo = useChatStore.getState().conversations.filter((c) => c._id !== conversationId)
                useChatStore.setState({conversations: updatedConvo});
                useChatStore.getState().setActiveConversation(null);
                toast.success("Bạn đã rời Nhóm: " + conversationName);
            } else {
                const selectedConvo = useChatStore.getState().conversations.find(c => c._id === conversationId);
                if(selectedConvo) {
                    const newParticipant = selectedConvo.participant.filter(p => p._id !== participantId);
                    const updatedConvo = {
                        ...selectedConvo, 
                        participant: [...newParticipant]
                    }
                    useChatStore.getState().updateConversation(updatedConvo)
                    toast.info(participantName + " đã rời khỏi nhóm");
                }
            }
        })

        // nhóm mới
        socket.on("new-group", (conversation)=> {
            useChatStore.getState().addConvo(conversation);
            socket.emit('join-conversation', conversation._id)
        })
        // listen online-users
        socket.on("online-users", (userIds)=> {
            set({onlineUsers: userIds})
        })
    },
    disconnectSocket:() => {
        const socket = get().socket;
        if(socket){
            socket.disconnect();
            set({socket: null})
        }
    },
}))