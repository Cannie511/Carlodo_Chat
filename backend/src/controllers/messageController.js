import { messageSystemError } from "../libs/db.js";
import { pair } from "../middlewares/friendMiddleware.js";
import { uploadImageConversationFromBuffer } from "../middlewares/uploadMiddleware.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { io } from "../socket/index.js";
import { emitNewMessage, updateConversationAfterCreateMessage } from "../utils/messageHelper.js";
export const sendDirectMessage = async (req, res) => {
    try {
        const {recipientId, content, conversationId} = req.body;
        const senderId = req.user._id;
        let conversation;
        if(!content) {
            return res.status(400).json({message: 'content is required'});
        }
        if(conversationId) conversation = await Conversation.findById(conversationId);
        else {
            conversation = await Conversation.create({
                type: 'direct', 
                participant: [
                    {userId: senderId, joinAt: new Date()},
                    {userId: recipientId, joinAt: new Date()}
                ],
                lastMessageAt: new Date(),
                unreadCount: new Map(),
            })
        }
        const [userA, userB] = pair(senderId.toString(), recipientId.toString());
        const message = await Message.create({
            conversationId: conversation._id,
            content, senderId
        })
        await message.populate({
            path: 'senderId',
            select: '_id displayName avatarUrl'
        });

        updateConversationAfterCreateMessage(conversation, message, senderId);
        await conversation.save();
        emitNewMessage(io, conversation, message); //socket thông báo cho client
        return res.status(201).json({message});
    } catch (error) {
        console.log("Error with send direct message", error);
        res.status(500).json({message: messageSystemError});
    }
}

export const sendGroupMessage = async (req, res) => {
    try {
        const {conversationId, content} = req.body;
        const senderId = req.user._id;

        const conversation = req.conversation;
        if(!content) return res.status(400).json({message: "content is required"});
        const message = await Message.create({
            conversationId, content, senderId
        })
        await message.populate({
            path: 'senderId',
            select: '_id displayName avatarUrl'
        });
        updateConversationAfterCreateMessage(conversation, message, senderId);
        await conversation.save();

        emitNewMessage(io, conversation, message); //socket thông báo cho client

        return res.status(201).json({message});
        
    } catch (error) {
        console.log("Error with send group message", error);
        res.status(500).json({message: messageSystemError});
    }
}

export const markAsSeen = async(req, res) => {
    try {
        const {conversationId} = req.params;
        const userId = req.user._id.toString();
        const conversation = await Conversation.findById(conversationId);
        if(!conversation) return res.status(404).json({message: "Conversation not found"});
        const last = conversation.lastMessage;
        if(!last) return res.status(200).json({message: "No message to mark as seen"});
        if(last.senderId.toString() === userId) return res.status(200).json({message: "you are sender"});
        const updated = await Conversation.findByIdAndUpdate(conversationId, {
            // $addToSet: hàm thêm vào nhưng không trùng lặp
            $addToSet: { seenBy: userId}, // thêm người dùng khác với user đang đăng nhập vào mảng seenby để đánh dấu đã đọc
            // $set: hàm để set 1 giá trị cho 1 field trong db
            $set: {[`unreadCount.${userId}`]: 0}
         }, { new: true}
        )
        io.to(conversationId).emit("read-message", {
            conversation: updated,
            lastMessage: {
                _id: updated?.lastMessage._id,
                content: updated?.lastMessage.content,
                createdAt: updated?.lastMessage.createdAt,
                sender: {
                    _id: updated?.lastMessage.senderId
                }
            }
        })
        return res.status(200).json({
            message: "Mark as seen successfully", 
            seenBy: updated?.seenBy || [], 
            myUnreadCount: updated?.unreadCount[userId]}
        )
    } catch (error) {
        console.log("Error with mark as seen", error);
        res.status(500).json({message: messageSystemError});
    }
}

export const uploadImageChat = async(req, res) => {
    try {
        const files = req.files;
        const userId = req.user._id;
        const {conversationId} = req.body;
        if(!conversationId) return res.status(400).json({message: "Conversation Id is required"});
        if(!files) return res.status(400).json({message: "No file uploaded"})
        
        const result = await Promise.all(
            files.map(file =>
                uploadImageConversationFromBuffer(file.buffer)
            )
        );
        const imageList = result.map(r => ({
            conversationId,
            senderId: userId,
            imgUrl: r.secure_url,
            content: "[Hình ảnh]",
            type: "image"
        }));
        const message = await Message.insertMany(imageList);
        await Message.populate(message, {
            path: "senderId",
            select: "_id displayName avatarUrl"
        });
        console.log(message);
        if(!message) return res.status(400).json({message: "Create message failed"});
        const conversation = await Conversation.findById(conversationId);
        updateConversationAfterCreateMessage(conversation, message, userId);
        emitNewMessage(io, conversation, message); //socket thông báo cho client
        return res.status(200).json({message});
    } catch (error) {
         console.log("Error with upload image chat to cloudinary:", error);
        return res.status(500).json({message: messageSystemError})
    }
}