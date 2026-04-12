import jwt from "jsonwebtoken";
import User from "../models/User.js";
import cookie from "cookie";
import Session from "../models/Session.js";

export const socketMiddleware = async(socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if(!token) return next(new Error("Unauthorized - Token not found"));
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded?.userId).select("-hashedPassword");
        if(!user) return next(new Error("User not found"));
        socket.user = user;
        next();
    } catch (error) {
        console.log("Error with socket middleware:", error);
        const cookies = cookie.parse(socket.handshake.headers.cookie || "");
        const refreshToken = cookies.refreshToken;
        if (error.name === "TokenExpiredError") {
           if(!refreshToken) {
                return next(new Error("Unauthorized"))
            }
            // sử dụng tạm thời refresh token để kết nối socket
            const session = await Session.findOne({refreshToken});
            if(!session || session.expiresAt < new Date()) return next(new Error("token is expired"));
            const user = await User.findById(session?.userId).select("-hashedPassword");
            if(!user) return next(new Error("User not found"));
            socket.user = user;
            return next();
        }
        return next(new Error("Unauthorized"))
    }
}