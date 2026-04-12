import { messageSystemError } from "../libs/db.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { io } from "../socket/index.js";
import { emitAddNewParticipant, emitDeleteConversation, emitOutGroup, emitRemoveParticipant } from "../utils/conversationHelper.js";

export const createConversation = async(req, res) => {
    try {
        const {type, name, memberIds} = req.body;
        const userId = req.user._id;
      
        if(!type || (type === 'group' && !name) || !memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
            return res.status(400).json({message: "Group name and member list are required"});
        }
        let conversation;
        if(type === 'direct'){
            const participantId = memberIds[0];
            conversation = await Conversation.findOne({
                type: 'direct',
                "participant.userId" : {$all: [userId, participantId]}
            }) 
            if(!conversation) {
                conversation = new Conversation({
                    type: 'direct',
                    participant: [
                        {userId}, {userId: participantId}
                    ],
                    lastMessage: new Date(),

                })
                await conversation.save();
            }
        }
        if(type === 'group'){
            conversation = new Conversation({
                type: "group",
                participant: [
                    {userId}, ...memberIds.map((id)=>({userId: id}))
                ],
                group: {
                    name, createdBy: userId
                },
                lastMessageAt: new Date(), 
            });

            await conversation.save();
        }

        if(!conversation) return res.status(400).json({message: "Conversation type is invalid"});
        await conversation.populate([
            {path: 'participant.userId', select: 'displayName avatarUrl'},
            {path: 'seenBy', select: 'displayName avatarUrl'},
            {path: 'lastMessage.senderId', select: 'displayName avatarUrl'}
        ])
        const participant = (conversation.participant || []).map((p)=>({
            _id: p.userId?._id,
            displayName: p.userId?.displayName,
            avatarUrl: p.userId?.avatarUrl ?? null,
            joinAt: p.joinAt
        }))
        
        const formatted = {...conversation.toObject(), participant};
        if(type === 'group') {
            memberIds.forEach((userId) => {
                io.to(userId).emit('new-group', (formatted))
            })
        }
        return res.status(201).json({conversation: formatted});
    } catch (error) {
        console.log("Error with create conservation", error);
        return res.status(500).json({message: messageSystemError});
    }
}

export const getConversation = async(req, res) => {
    try {
        const userId = req.user._id;
        const conservation = await Conversation.find({
            "participant.userId": userId,
        }).sort({lastMessageAt: -1, updateAt: -1})
        .populate({path: "participant.userId", select: "displayName avatarUrl"})
        .populate({path: "lastMessage.senderId", select: "displayName avatarUrl"})
        .populate({path: "seenBy", select: "displayName avatarUrl"});

        const formatted = conservation.map((c)=>{
            const participant = (c.participant || []).map((p)=>({
                _id: p.userId?._id,
                displayName: p.userId?.displayName,
                avatarUrl: p.userId?.avatarUrl ?? null,
                joinAt: p.joinAt
            }))
            return {...c.toObject(), unreadCount: c.unreadCount || {}, participant};
        })
        return res.status(200).json({conversation: formatted})
    } catch (error) {
        console.log("Error with get conservation", error);
        return res.status(500).json({message: messageSystemError});
    }
}

export const getMessages = async(req, res) => {
    try {
        const {conversationId} = req.params;
        const {limit = 50, cursor} = req.query;
        const query = {conversationId};
        if(cursor) {
            query.createdAt = {$lt: new Date(cursor)};
        }
        let messages = await Message.find(query).populate([
            {path: 'senderId', select: '_id displayName avatarUrl'}
        ]).sort({createdAt: -1}).limit(Number(limit) + 1);
        let nextCursor = null;
        if(messages.length > Number(limit)){
            const nextMessages = messages[messages.length - 1];
            nextCursor = nextMessages.createdAt.toISOString()
            messages.pop();
        }
        messages = messages.reverse();
        return res.status(200).json({
            messages, nextCursor
        })
    } catch (error) {
        console.log("Error with get messages", error);
        return res.status(500).json({message: messageSystemError});
    }
}

export const getUserConversationForSocketIO = async (userId) => {
    try {
        const conversation = await Conversation.find(
            {"participant.userId": userId},
            {_id: 1}
        )
        return conversation.map((c)=> c._id.toString());
    } catch (error) {
        console.log("Error with get user conversation for socket io");
        return [];
    }
}

export const deleteConversation = async(req, res) => { 
    try {
        const conversationId = req.params.conversationId;
        const userId = req.user._id;
        if(!conversationId) {
            return res.status(400).json({message: "Conversation id is required"});
        }
        const conversation = await Conversation.findById(conversationId);
        emitDeleteConversation(io, conversationId, conversation.group?.name);
        if(!conversation) {
            return res.status(404).json({message: "Conversation not found"});
        }
        if(conversation.type === 'group' && conversation.group.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({message: "Only group creator can delete the conversation"});
        }
        await Conversation.deleteOne({ _id: conversationId });
        await Message.deleteMany({conversationId});
        return res.sendStatus(204);
    } catch (error) {
        console.log("Error with delete conversation", error);
        return res.status(500).json({message: messageSystemError});
    }
}

export const addNewParticipant = async(req, res) => {
    try {
        const {conversationId} = req.params;
        const {memberIds} = req.body;
        const userId = req.user._id;
        if(!conversationId || !memberIds || !Array.isArray(memberIds) || memberIds.length === 0 || !userId) {
            return res.status(400).json({message: "Conversation id and member list and user id are required"});
        }
        const conversation = await Conversation.findById(conversationId);
        if(!conversation) {
            return res.status(404).json({message: "Conversation not found"});
        }
        if(conversation.group?.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({message: "Only group creator can add new participant"});
        }
        const existingParticipantIds = conversation.participant.map((p) => p.userId.toString());
        const newParticipants = memberIds.filter((id) => !existingParticipantIds.includes(id.toString()));
        const updatedConversation = await Conversation.findByIdAndUpdate({_id: conversationId}, {
            $push: {
                participant: {
                    $each: newParticipants.map(id => ({
                        userId: id
                    }))
                }
            }
        }, {new: true}).populate([
            {path: 'participant.userId', select: 'displayName avatarUrl'},
            {path: 'seenBy', select: 'displayName avatarUrl'},
            {path: 'lastMessage.senderId', select: 'displayName avatarUrl'}
        ])
        if (!updatedConversation) {
            return res.status(404).json({message: "Conversation not found"});
        }
        const participant = (updatedConversation.participant || []).map((p)=>({
            _id: p.userId?._id,
            displayName: p.userId?.displayName,
            avatarUrl: p.userId?.avatarUrl ?? null,
            joinAt: p.joinAt
        }))
        console.log(participant)
        const formatted = {...updatedConversation.toObject(), participant};
        emitAddNewParticipant(io, conversationId, participant);
        memberIds.forEach((userId) => {
            io.to(userId).emit('new-group', (formatted))
        })
        return res.sendStatus(200);
    } catch (error) {
        console.log("Error with add new participant", error);
        return res.status(500).json({message: messageSystemError});
    }
}

export const deleteParticipant = async(req, res) => {
    try {
        const {conversationId, participantId} = req.params;
        const userId = req.user._id;
        const userDisplayName = req.user.displayName
        if(!conversationId || !participantId) {
            return res.status(400).json({message: "Conversation id and participant id are required"});
        }
        const conversation = await Conversation.findById(conversationId);
        if(!conversation) {
            return res.status(404).json({message: "Conversation not found"});
        }
        if(userId !== participantId && userId.toString() === conversation.group?.createdBy.toString()) emitRemoveParticipant(io, conversationId, conversation.group?.name, participantId);
        console.log(userId.toString() === participantId.toString())
        if(userId.toString() === participantId.toString()) emitOutGroup(io, conversationId, conversation?.group.name, userId, userDisplayName);
        if(conversation.group?.createdBy.toString() !== userId.toString() && userId.toString() !== participantId.toString()) {
            return res.status(403).json({message: "Do not have permission"});
        }
        await Conversation.findByIdAndUpdate({_id: conversationId}, {
            $pull: {
                participant: {userId: participantId}
            },
            $unset: {
                [`unreadCount.${participantId}`]: ""
             }
         }, {new:true}).populate([
            {path: 'participant.userId', select: 'displayName avatarUrl'},
            {path: 'seenBy', select: 'displayName avatarUrl'},
            {path: 'lastMessage.senderId', select: 'displayName avatarUrl'}
        ]);
        return res.sendStatus(204);
    } catch (error) {
        console.log("Error with delete participant", error);
        return res.status(500).json({message: messageSystemError});
    }
}

export const renameGroup = async(req, res) => {
    try {
        const {conversationId} = req.params;
        const {name} = req.body;
        if(!conversationId) return res.status(400).json({message: "Conversation id is required"});
        if(name.trim() === '') return res.status(400).json({message: "Group name must not be empty"});
        await Conversation.findByIdAndUpdate({_id: conversationId}, {
            "group.name": name
        });
        return res.sendStatus(204);
    } catch (error) {
        console.log("Error with rename group", error);
        return res.status(500).json({message: messageSystemError});
    }
}

