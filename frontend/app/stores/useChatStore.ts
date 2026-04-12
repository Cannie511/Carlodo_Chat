import { create } from "zustand";
import { ChatState } from "../types/store";
import { persist } from "zustand/middleware";
import { chatService } from "../services/chatService";
import { toast } from "sonner";
import { useAuthStore } from "./useAuthStore";
import { useSocketStore } from "./useSocketStore";
import { group } from "console";
import { Message } from "../types/chat";


export const useChatStore = create<ChatState>()(
    persist(
        (set, get)=>({
            conversations: [],
            messages: {},
            activeConversationId: null,
            convoLoading: false,
            messageLoading: false,
            loading: false,
            setActiveConversation: (id) => set({activeConversationId: id}),
            reset: () => {
                set({
                    conversations: [],
                    messages: {},
                    activeConversationId: null,
                    convoLoading: false,
                    messageLoading: false
                })
            },
            fetchConversation: async() => {
                try {
                    set({convoLoading: true});
                    const {conversation} = await chatService.fetchConversation();
                    set({conversations: conversation, convoLoading: false});
                } catch (error) {
                    console.log("Error with fetch conversation");
                    toast.error("Lỗi khi lấy thông tin đoạn chat");
                    set({convoLoading: false});
                }
            },
            fetchMessages: async(conversationId) => {
                try {
                    const {activeConversationId, messages} = get();
                    const {user} = useAuthStore.getState();
                    const convoId = conversationId ?? activeConversationId;
                    if(!convoId) return;
                    const current = messages?.[convoId];
                    const nextCursor = current?.nextCursor === undefined ? "" : current?.nextCursor;
                    if(nextCursor === null) return;
                    set({messageLoading: true});
                    const {messages: fetched, cursor} = await chatService.fetchMessages(convoId, nextCursor);
                    const processed = fetched.map((m)=>({...m, isOwn: m.senderId._id === user?._id}));
                    set((state)=> {
                        const prev = state.messages[convoId]?.items ?? [];
                        const merged = prev.length > 0 ? [...processed, ...prev] : processed;
                        return {
                            messages: {
                                ...state.messages,
                                [convoId]: {
                                    items: merged,
                                    hasMore: !!cursor,
                                    nextCursor: cursor ?? null
                                }
                            },
                            
                        }
                    })
                } catch (error) {
                    console.log("Error with fetch messages");
                    //toast.error("Lỗi khi tải tin nhắn");
                } finally {
                    set({convoLoading: false, messageLoading: false});
                }
            },
            sendDirectMessage: async(recipientId, content, imgUrl) => {
                try {
                    const {activeConversationId} = get();
                    await chatService.senDirectMessage(recipientId, content, imgUrl, activeConversationId || undefined);
                    set((state)=> ({
                        conversations: state.conversations.map((c)=>c._id === activeConversationId ? {...c, seenBy: []} : c),
                    }))
                } catch (error) {
                    console.log("Error with send direct message");
                    toast.error("Lỗi khi gửi tin nhắn");
                }
            },
            sendGroupMessage: async(conversationId, content, imgUrl) => {
                try {
                    const {activeConversationId} = get();
                    await chatService.sendGroupMessage(conversationId, content, imgUrl);
                    set((state)=> ({
                        conversations: state.conversations.map((c)=>c._id === activeConversationId ? {...c, seenBy:[]} : c)
                    }))
                } catch (error) {
                    console.log("Error with send group message");
                    toast.error("Lỗi khi gửi tin nhắn nhóm");
                }
            },
            addMessage: async(message) => {
                try {
                    const {user} = useAuthStore.getState();
                    const {fetchMessages} = get();
                    message.isOwn = message.senderId._id === user?._id;
                    const convoId = message.conversationId;
                    let prevItems = get().messages[convoId]?.items ?? [];
                    if(prevItems.length === 0) {
                        await fetchMessages(message.conversationId);
                        prevItems = get().messages[convoId]?.items;
                    }
                    set((state)=>
                        {
                            if(prevItems.some((m)=>m._id === message._id)){
                                return state;
                            }

                            return {
                                messages: {
                                    ...state.messages, 
                                    [convoId]: {
                                        items: [...prevItems, message],
                                        hasMore: state.messages[convoId].hasMore,
                                        nextCursor: state.messages[convoId].nextCursor ?? undefined
                                    }
                                }
                            }
                        }
                    )
                } catch (error) {
                    console.log("Error with add message", error);
                    toast.error("Lỗi khi thêm tin nhắn");
                }
            },
            updateConversation: (conversation) => {
                set((state)=> ({
                    conversations: state.conversations.map((c)=> c._id === conversation._id ? {...c, ...conversation} : c)
                }))
            },
            markAsSeen: async() => {
                try {
                    const {user} = useAuthStore.getState();
                    const {activeConversationId, conversations} = get();
                    if(!activeConversationId || !user) return
                    const convo = conversations.find((c)=> c._id === activeConversationId);
                    if(!convo) return;
                    if((convo.unreadCount?.[user._id] ?? 0) === 0) {
                        return;
                    }
                    await chatService.markAsSeen(activeConversationId);
                    set((state) => ({
                        conversations: state.conversations.map((c)=> c._id === activeConversationId && c.lastMessage ? {
                            ...c, unreadCount: { ...c?.unreadCount, [user._id]: 0 }
                        }: c)
                    }));
                    
                } catch (error) {
                    console.log("Error with mark as seen", error);
                    toast.error("Lỗi khi đánh dấu đã đọc tin nhắn");
                }
            },
            addConvo: (convo) => {
                set((state) => {
                    const exists = state.conversations.some((c) => c._id.toString() === convo._id.toString());

                    return {
                        conversations: exists ? state.conversations : [convo, ...state.conversations]
                    }
                })
            },
            createConversation: async (type, name, memberIds) => {
                try {
                    set({loading: true})
                    const conversation = await chatService.createConversation(type, name, memberIds);
                    get().addConvo(conversation);
                    useSocketStore.getState().socket?.emit('join-conversation', conversation._id);

                } catch (error) {
                    console.log("Error with create conversation", error);
                    toast.error("Lỗi khi tạo hội thoại mới");
                } finally {
                    set({loading: false})
                }
            },
            deleteConversation: async (conversationId) => {
                try {
                    set({loading: true});
                    await chatService.deleteConversation(conversationId);
                    set((state)=> ({
                        conversations: state.conversations.filter((c)=> c._id !== conversationId),
                        activeConversationId: state.activeConversationId === conversationId ? null : state.activeConversationId
                    }))
                } catch (error) {  
                    console.log("Error with delete conversation", error);
                    toast.error("Lỗi khi xóa hội thoại");
                } finally {
                    set({loading: false});
                }
            },
            removeParticipant: async (conversationId, participantId) => {
                try {
                    set({loading: true});
                    await chatService.removeParticipant(conversationId, participantId);
                    const selectdedConvo = get().conversations.find((c)=> c._id === conversationId);
                    if(!selectdedConvo) return;
                    const updatedParticipants = selectdedConvo.participant.filter((p)=> p._id !== participantId);
                    const updatedConvo = {...selectdedConvo, participant: updatedParticipants};
                    set((state)=> ({
                        conversations: state.conversations.map((c)=> c._id === conversationId ? updatedConvo : c)
                    }));
                    if(participantId.toString() !== useAuthStore.getState().user?._id.toString())
                        toast.success("Thành viên đã bị xóa khỏi nhóm chat");
                } catch (error) {
                    console.log("Error with remove participant", error);
                    toast.error("Lỗi khi xóa thành viên khỏi nhóm chat");
                } finally {
                    set({loading: false});
                }
            },
            addParticipant: async(memberIds) => {
                try {
                    set({loading: true});
                    await chatService.addParticipants(get().activeConversationId!, memberIds);
                    toast.success("Thêm thành viên thành công");
                } catch (error) {
                    console.log("Error with add participant", error);
                    toast.error("Lỗi khi xóa thêm thành viên vào nhóm chat");
                } finally {
                    set({loading: false});
                }
            },
            renameGroup: async(name) => {
                try {
                    set({loading: true});
                    await chatService.renameGroup(get().activeConversationId!, name);
                    const selectedConvo = get().conversations.find((c) => c._id === get().activeConversationId);
                    if(selectedConvo) selectedConvo.group.name = name;
                    const updatedConvo = {
                        ...selectedConvo, 
                    }
                    get().updateConversation(updatedConvo);
                    toast.success("Đổi tên nhóm thành công");
                } catch (error) {
                    console.log("Error with rename group", error);
                    toast.error("Lỗi khi đổi tên nhóm chat");
                } finally {
                    set({loading: false});
                }
            },
            uploadImageConversation: async(formData) => {
                try {
                    
                    const {user} = useAuthStore.getState();
                    const {activeConversationId} = get();
                    formData.append("conversationId", activeConversationId!);
                    const message = await chatService.uploadImageConversation(formData);
                    
                    
                   
                    
                     console.log("image", get().messages);
                    
                } catch (error) {
                    console.log("Lỗi khi cập nhật avatar", error);
                    toast.error("Hình ảnh không được vượt quá 2MB")
                }
            },
            addImageChat: async (message) => {
                const {user} = useAuthStore.getState();
                const {fetchMessages} = get();
                const convoId = message[0].conversationId;
                let prevItems = get().messages[convoId]?.items ?? [];
                message.map((mes:Message) => {
                    mes.isOwn = message[0].senderId._id === user?._id;
                });
                if(prevItems.length === 0) {
                    await fetchMessages(message[0].conversationId);
                    prevItems = get().messages[convoId]?.items;
                }
                set((state)=>
                    {   
                        message.map((mes:Message) => {
                            if(prevItems.some((m)=>m._id === mes._id)){
                                return state;
                            }
                        });

                        return {
                            messages: {
                                ...state.messages, 
                                [convoId]: {
                                    items: [...prevItems, ...message],
                                    hasMore: state.messages[convoId].hasMore,
                                    nextCursor: state.messages[convoId].nextCursor ?? undefined
                                }
                            }
                        }
                    }
                )
            }
        }),
        {
            name: "chat-storage",
            partialize: (state) => ({conversations: state.conversations, activeConversationId: state.activeConversationId})
        } 
    )
)