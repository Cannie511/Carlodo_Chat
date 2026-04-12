import mongoose from "mongoose";

export const messageSystemError = "System Error";

export const connectDB = async () => {
    console.log("Connecting...");
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log('Connect to DB successfully');
    } catch (error) {
        console.log('Error connect to db: ', error);
        process.exit(1);
    }
}