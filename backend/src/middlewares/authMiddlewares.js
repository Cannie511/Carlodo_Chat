import jwt from 'jsonwebtoken';
import User from '../models/User.js'
import { messageSystemError } from '../libs/db.js';
import { ACCESS_TOKEN_TTL, accessTime, accessTokenCookie } from '../controllers/authController.js';
import Session from '../models/Session.js';

export const protectedRoute = async (req, res, next) => {
    try {
        //lấy access token từ cookie
        const accessToken = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
        const refreshToken = req.cookies?.refreshToken;
        if(!accessToken){
            return res.status(401).json({message: "Access token not found"})
        }

        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async(err, decodedUser)=>{
            if(err) {
                // if(err.name === "TokenExpiredError"){
                //     if(!refreshToken) {
                //         return res.status(401).json({message: "Access token not found"})
                //     }
                //     const session = await Session.findOne({refreshToken});
                //     if(!session || session.expiresAt < new Date()) return res.status(403).json({message: 'Token is expired'})
            
                //     //tạo access token
                //     const accessToken = jwt.sign({userId: session.userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_TTL});
                //     const user = await User.findById({_id: session.userId}).select("-hashedPassword");
                //     res.cookie('accessToken', accessToken, {
                //         secure: true,
                //         sameSite: 'none',
                //         maxAge: accessTokenCookie
                //     });
                //     req.user = user;
                //     return next();
                // }
                // else {
                //     return res.status(403).json({message: "Token is invalid"});
                // }
                console.error("Token verification error:", err);
                return res.status(403).json({message: "TokenExpiredError"});
            }
            const user = await User.findById({_id: decodedUser.userId}).select("-hashedPassword");
            if(!user) {
                return res.status(404).json({message: "User not found"});
            }
            req.user = user;
            next();
        });

        
    } catch (error) {
        console.log("Error with auth middleware:", error);
        return res.status(500).json({message: messageSystemError})
    }
}

