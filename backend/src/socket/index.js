import {Server} from 'socket.io';
import http from 'http';
import express from 'express';
import { socketMiddleware } from '../middlewares/socketMiddleware.js';
import { getUserConversationForSocketIO } from '../controllers/conversationController.js';

const app = express();

const server = http.createServer(app);
const onlineUser = new Map(); // [userId: socket.id]
const io = new Server(server, {
    cor: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
})

io.use(socketMiddleware);


io.on("connection", async(socket)=> {
    const user = socket.user;
    console.log(user.displayName, " has connected with id: ", socket.id)
    onlineUser.set(user._id, socket.id);
    io.emit("online-users", Array.from(onlineUser.keys())) // gửi cho client 1 array gồm các _id đã kết nối

    const conversationIds = await getUserConversationForSocketIO(user._id);
    conversationIds.forEach((id)=> {
        socket.join(id);
    })
    socket.join(user._id.toString());

    socket.on("typing", ({activeConversationId})=> {
        console.log("typing")
        io.to(activeConversationId).emit("typing", {userId: user._id, conversationId:activeConversationId});
    })
    socket.on("stop-typing", ({activeConversationId})=> {
        io.to(activeConversationId).emit("stop-typing", {userId: user._id, conversationId:activeConversationId});
    })

    socket.on("join-conversation", (conversationId)=> {
        socket.join(conversationId);
    })
    socket.on("disconnect", ()=> {
        console.log("socket disconnected: ", socket.id)
        onlineUser.delete(user._id)
        io.emit("online-users", Array.from(onlineUser.keys()))
    })
})

export {io, app, server}