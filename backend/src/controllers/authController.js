import bcrypt from 'bcrypt';
import User from "../models/User.js"
import jwt from 'jsonwebtoken'
import crypto from 'crypto';
import Session from '../models/Session.js';
import { messageSystemError } from '../libs/db.js';

// biến token
export const accessTokenCookie = 5 * 24 * 60 * 60 * 1000;
export const accessTime = 15;
export const ACCESS_TOKEN_TTL =  accessTime + 'm';
const REFRESH_TOKEN_TTL = 14*24*60*60*1000 // 14 ngày


export const signUp = async(req, res) => {
    try {
        const {username, password, email, firstname, lastname} = req.body;
        
        //kiểm tra các field đã truyền
        if(!username || !password || !email || !firstname || !lastname){
            return res.status(400).json({
                message: "username, password, email, first name, last name is required"
            })
        }

        //kiểm tra user đã tồn tại chưa
        const duplicate = await User.findOne({$or: [{username}, {email}]});
        if(duplicate){
            return res.status(409).json({
                message: "user is existed!"
            })
        }

        //hash password, salt = 10
        const hashedPassword = await bcrypt.hash(password, 10);

        //tạo user mới
        await User.create({
            username, hashedPassword, email, displayName: lastname + ' ' + firstname
        })
        return res.status(204).json({message: "sign up successfully"});
    } catch (error) {
        console.error("Error with sign up", error);
        return res.status(500).json({message: messageSystemError});
    }
}

export const signIn = async (req, res) => {
    try {
        const {username, password} = req.body;
        if(!username || !password){
            return res.status(400).json({message: "username and password is required"});
        }

        //so sánh password với hashedPassword
        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({message: "username or password is not correct"});
        }
        const isCorrectPassword = await bcrypt.compare(password, user.hashedPassword);
        // logic khi sai
        if(!isCorrectPassword){
            return res.status(401).json({message: "username or password is not correct"});
        }
        // logic khi đúng
        const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_TTL}); 

        //tạo refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');
        
        // lưu vào session
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL), 
        })

        //lưu refreshToken và accessToken vào cookie
        // res.cookie('accessToken', accessToken, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'none', //be và fe chạy trên 2 domain khác nhau, cùng domain là strict
        //     path: '/',
        //     maxAge: accessTokenCookie
        // });
        // res.cookie('refreshToken', refreshToken, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'none', //be và fe chạy trên 2 domain khác nhau, cùng domain là strict
        //     path: '/',
        //     maxAge: REFRESH_TOKEN_TTL
        // });

        res.status(200).json({
            message: `User ${user.displayName} has been logged in`,
            accessToken,
            refreshToken
        })

    } catch (error) {
        console.error("error with sign up: ", error);
        return res.status(500).json({message: messageSystemError})
    }
}

export const signOut = async(req, res) =>{
    try {
        //lấy refresh token trong cookie
        const refreshToken = req.cookies?.refreshToken;
        if(refreshToken){
             //xóa refresh token trong session
            await Session.deleteOne({refreshToken});
             //xóa cookie khỏi client
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
        }
        return res.sendStatus(204);
    } catch (error) {
        console.log("error with sign out: ", error);
        return res.status(500).json({message: messageSystemError})
    }
}

export const refreshToken = async (req, res) => {
    try {
        // lấy refresh token từ cookie
        const refreshToken = req.cookies?.refreshToken;
        if(!refreshToken) {
            return res.status(401).json({message: "Token not found"})
        }

        // so sánh với token trong db
        const session = await Session.findOne({refreshToken});
        if(!session || session.expiresAt < new Date()) return res.status(403).json({message: 'Token is expired'})

        //tạo access token
        const accessToken = jwt.sign({userId: session.userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_TTL});
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none', //be và fe chạy trên 2 domain khác nhau, cùng domain là strict
            path: '/',
            maxAge: accessTokenCookie
        });
        res.status(200).json({ accessToken })
    } catch (error) {
        console.log("error with refresh token: ", error);
        return res.status(500).json({message: messageSystemError})
    }
}