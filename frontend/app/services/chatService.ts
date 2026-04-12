import api from "@/lib/axios";
import type { ConversationResponse, Message } from "../types/chat";

interface FetchMessagesProps {
    messages: Message[];
    cursor: string;
}

const pageLimit = 50;

export const chatService = {
    
    async fetchConversation(): Promise<ConversationResponse> {
        const res = await api.get('/conversation');
        return res.data;
    },
    
    async fetchMessages(id: string, cursor?: string): Promise<FetchMessagesProps> {
        const res = await api.get(`/conversation/${id}/messages?limit=${pageLimit}&cursor=${cursor}`);
        return { messages: res.data.messages, cursor: res.data.nextCursor}
    },

    async senDirectMessage(recipientId:string, content: string = "", imgUrl?:string, conversationId?:string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res:any = await api.post('/message/direct', {recipientId, content, imgUrl, conversationId});
        return {
            checkFriend: res?.checkFriend,
            messages: res.data.message
        }
    },

    async sendGroupMessage(conversationId?:string, content: string = "", imgUrl?:string) {
        const res = await api.post('/message/group', {content, imgUrl, conversationId});
        return res.data.message
    },

    async markAsSeen(conversationId: string) {
        const res = await api.patch(`/conversation/${conversationId}/seen`);
        return res.data
    },

    async createConversation(type: "direct" | "group", name: string, memberIds: string[]) {
        const res = await api.post('/conversation', {type, name, memberIds});
        return res.data.conversation;
    },

    async deleteConversation(conversationId: string) {
        const res = await api.delete(`/conversation/${conversationId}`);    
        return res.data;
    },

    async removeParticipant(conversationId: string, participantId: string) {
        const res = await api.delete(`/conversation/${conversationId}/participants/${participantId}`);
        return res.data;
    },

    async addParticipants(conversationId: string, memberIds: string[]) {
        const res = await api.patch(`/conversation/${conversationId}/addMember`, {memberIds});
        return res.status;
    },

    async renameGroup(conversationId: string, name: string) {
        const res = await api.patch(`/conversation/${conversationId}/rename`, {name});
        return res.status;
    },
    uploadImageConversation: async (formData: FormData) => {
        const res = await api.post("/message/uploadImages", formData, {
            headers: {"Content-Type": "multipart/form-data"},
        });
        if(res.status === 400) throw new Error(res.data.message);
        return res.data;
    },
}