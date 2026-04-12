import express from 'express';
import { configDotenv } from 'dotenv'
import { connectDB } from './libs/db.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import friendRoute from './routes/friendRoute.js';
import messageRoute from './routes/messageRoute.js';
import conversationRoute from './routes/conversationRoute.js';
import cookieParser from 'cookie-parser';
import { protectedRoute } from './middlewares/authMiddlewares.js';
import cors from 'cors';
import {app, server} from './socket/index.js';
import swaggerUi from 'swagger-ui-express';
import fs from "fs";
import { v2 as cloudinary } from 'cloudinary';
configDotenv();

// const app = express();
const PORT = process.env.PORT || 2204;

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: process.env.CLIENT_URL, credentials:true}))

//CLOUDINARY config
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

//swagger config


//db config
connectDB();


//public route
app.use("/api/auth",authRoute);

//private route
app.use(protectedRoute);
app.use("/api/users",userRoute);
app.use("/api/friends", friendRoute);
app.use("/api/message",  messageRoute);
app.use("/api/conversation",  conversationRoute);

server.listen(PORT, ()=>{
    console.clear();
    console.log("==========Carlodo Server 🚀==========\n")
    console.log("    Server is running on", PORT);
    console.log("\n====================================")
})