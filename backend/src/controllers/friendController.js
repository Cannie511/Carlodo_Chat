import { messageSystemError } from "../libs/db.js";
import Friend from '../models/Friend.js';
import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';
import { pair } from "../middlewares/friendMiddleware.js";

export const sendFriendRequest = async(req, res) => {
    try {
       const {to, message} = req.body;
       const from = req.user._id;
       if(from.toString() === to.toString()) {
        return res.status(400).json({message: 'Can not send to yourself'});
       }
       const userExists = await User.findOne({_id: to});
       if(!userExists){
        return res.status(404).json({message: "User not found"});
       }
       let userA = from.toString();
       let userB = to.toString();
       if(userA > userB) {
         [userA, userB] = [userB, userA];
       }

       const [alreadyFriend, existingRequest] = await Promise.all([
        Friend.findOne({$or: [
            {userA, userB}, {userA: userB, userB: userA}
        ]}), 
        FriendRequest.findOne({
            $or: [
                {from, to}, {from: to, to: from}
            ]
        })
       ]);
       if(alreadyFriend){
         return res.status(400).json({message: "already friend"});
       }
       if(existingRequest) {
        return res.status(400).json({message: "Request is waited"})
       }
       const request = await FriendRequest.create({
        from, to, message
       })
       return res.status(201).json({message: "Friend request has been sent", request})
    } catch (error) {
        console.log("Error with add friend:", error);
        return res.status(500).json({message: messageSystemError})
    }
}

export const acceptFriendRequest = async(req, res) => {
    try {
       const { requestId } = req.params;
       const userId = req.user._id;
       const request = await FriendRequest.findById(requestId);
       if(!request) {
        return res.status(404).json({message: "Friend request not found"})
       }
       if(request.to.toString() !== userId.toString()) {
        return res.status(401).json({message: "Not your friend request"});
       }
       const [userA, userB] = pair(request.from.toString(), request.to.toString());
       const friend = await Friend.create({
        userA, userB
       })
       await FriendRequest.findByIdAndDelete(requestId);
       const from = await User.findById(request.from).select('_id displayName avatarUrl').lean();
       return res.status(200).json({message: "Accept friend request success", newFriend: {_id: from?._id, displayName: from?.displayName, avatarUrl: from?.avatarUrl}})
    } catch (error) {
        console.log("Error with accept friend request:", error);
        return res.status(500).json({message: messageSystemError})
    }
}

export const declineFriendRequest = async(req, res) => {
    try {
       const { requestId } = req.params;
       const userId = req.user._id;
       const request = await FriendRequest.findById(requestId);
       if(!request) {
        return res.status(404).json({message: "Friend request not found"})
       }
       if(request.to.toString() !== userId) {
        return res.status(403).json({message: "Not your friend request"});
       }
       await FriendRequest.findByIdAndDelete(requestId);
       return res.sendStatus(204)
    } catch (error) {
        console.log("Error with decline friend request:", error);
        return res.status(500).json({message: messageSystemError})
    }
}

export const getAllFriends = async(req, res) => {
    try {
       const userId = req.user._id;
       const friendShip = await Friend.find({
        $or: [
            {userA: userId}, {userB: userId}
        ]
       }).populate("userA", "_id displayName avatarUrl username")
       .populate("userB", "_id displayName avatarUrl username")
       .lean();
       if(!friendShip.length) return res.status(200).json({friends: []})
        const friends = friendShip.map((f)=>f.userA._id.toString()===userId.toString() ? f.userB : f.userA);
        return res.status(200).json({friends})
    } catch (error) {
        console.log("Error with get all friends:", error);
        return res.status(500).json({message: messageSystemError})
    }
}

export const getFriendRequests = async(req, res) => {
    try {
       const userId = req.user._id;
       const populateFields = '_id username displayName avatarUrl';
       const [sent, received] = await Promise.all([
        FriendRequest.find({from: userId}).populate('to',populateFields),
        FriendRequest.find({to: userId}).populate('from', populateFields)
       ]);
       return res.status(200).json({message: "get friend request successfully", sent, received});
    } catch (error) {
        console.log("Error with get friends request:", error);
        return res.status(500).json({message: messageSystemError})
    }
}