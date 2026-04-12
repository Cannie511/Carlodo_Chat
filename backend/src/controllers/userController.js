import { messageSystemError } from "../libs/db.js";
import { uploadAvatarImageFromBuffer } from "../middlewares/uploadMiddleware.js";
import User from '../models/User.js';
import bcrypt from 'bcrypt';
export const authMe = async(req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({user});
    } catch (error) {
        console.log("Error with auth me:", error);
        return res.status(500).json({message: messageSystemError})
    }
}

export const searchUserByDisplayName= async(req, res) => {
    try {
        const {displayName} = req.query;
        if(!displayName || displayName.trim() === "") return res.status(400).json({message: "displayName is required"});
        const user = await User.find({displayName: { $regex: displayName, $options: "i" }}).select("_id displayName avatarUrl username").limit(10);
        return res.status(200).json({user});
    } catch (error) {
        console.log("Error with search by displayName:", error);
        return res.status(500).json({message: messageSystemError})
    }
}

export const uploadAvatar = async (req, res) => {
    try {
        const file = req.file;
        const userId = req.user._id;
        if(!file) return res.status(400).json({message: "No file uploaded"})
        const result = await uploadAvatarImageFromBuffer(file.buffer);
        const updatedUser = await User.findByIdAndUpdate(userId, {
            avatarUrl: result.secure_url,
            avatarId: result.public_id
        }, { new: true }).select("avatarUrl");
        if(!updatedUser.avatarUrl) return res.status(400).json({message: "Avatar is null"});
        return res.status(200).json({avatarUrl: updatedUser.avatarUrl});
    } catch (error) {
         console.log("Error with upload avatar to cloudinary:", error);
        return res.status(500).json({message: messageSystemError})
    }
}

export const updateUser = async(req, res) => {
    try {
        const userId = req.user._id;
        const {displayName, email, phone, bio} = req.body;
        if(!userId) return res.status(400).json({message: "userId is required"});
        if(!displayName || !email) return res.status(400).json({message: "displayName or email is required"});
        const updatedUser = await User.findByIdAndUpdate(userId, {
            displayName, email, phone, bio
        }, {new: true}).select("-hashedPassword");
        if(!updatedUser) return res.status(400).json({message: "Cập nhật người dùng không thành công"});
        return res.status(200).json({user: updatedUser});
    } catch (error) {
        console.log("Error with update user:", error);
        return res.status(500).json({message: messageSystemError})
    }
}

export const changePassword = async(req, res) => {
    try {
        const userId = req.user._id;
        const {oldPassword, newPassword} = req.body;
        if(!userId) return res.status(400).json({message: "userId is required"});
        if(!oldPassword || !newPassword) return res.status(400).json({message: "oldPassword or newPassword is required"});
        if(oldPassword === newPassword) return res.status(400).json({message: "oldPassword and newPassword must be different"});
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: "User not found"});
        const isCorrectPassword = await bcrypt.compare(oldPassword, user.hashedPassword);
        if(!isCorrectPassword) return res.status(400).json({message: "oldPassword is not correct"});
        user.hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.save();
        return res.status(200).json({message: "change password successfully"});
    } catch (error) {
        console.log("Error with change password:", error);
        return res.status(500).json({message: messageSystemError})
    }
 }