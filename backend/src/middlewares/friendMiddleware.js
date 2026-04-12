import { messageSystemError } from "../libs/db.js";
import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";

export const pair = (a,b) => (a>b ? [a,b]: [b,a]);

export const checkFriendShip = async(req, res, next) => {
   try {
        const me = req.user._id.toString();
        const recipientId = req.body?.recipientId?.toString() ?? null;
        const memberIds = req.body?.memberIds ?? [];
        

        if(!recipientId && memberIds.length === 0) return res.status(400).json({message: "recipient id and members id are required"});
        const [ userA, userB ] = pair(me, recipientId);
        const isFriend = await Friend.findOne({userA, userB});
        const checkFriend = isFriend ? true : false;
        //if(!isFriend) return res.status(403).json({message: "Not be a friend"});
        res.checkFriend = checkFriend
        

        // check group chat middleware
        const friendChecks = memberIds.map(async(memberId)=> {
            const [userA, userB] = pair(me, memberId);
            const friend = await Friend.findOne({userA, userB});
            return friend ? null : memberId;
        });
        const result = await Promise.all(friendChecks);
        const notFriend = result.filter(Boolean);
        if(notFriend.length > 0) {
            return res.status(403).json({message: "Can not create group chat with someone not your friend", notFriend})
        }
        return next();
   } catch (error) {
        console.log("Error with friend ship middleware", error);
        return res.status(500).json({message: messageSystemError});
   }
}

export const checkGroupMemberShip = async (req, res, next) => {
    try {
        const {conversationId} = req.body;
        const userId = req.user._id;
        const conversation = await Conversation.findById(conversationId);
        if(!conversation) return res.status(404).json({message: "Conversation is not exist"});
        const isMember = conversation.participant.some((p)=>p.userId.toString() === userId.toString());
        if(!isMember) return res.status(403).json({message: "You are not a member in this group"});
        req.conversation = conversation;
        next();
    } catch (error) {
        console.log("Error with check group membership middleware", error);
        return res.status(500).json({message: messageSystemError});
    }
}