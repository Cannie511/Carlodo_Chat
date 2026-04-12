import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

export const upload = multer({
    storage: multer.memoryStorage(), // lưu file trên ram => gửi lên cloud (tốc độ tối ưu hơn là lưu trực tiếp file raw trong cloud)
    limits: {
        fileSize: 1024 * 1024 * 2 //2MB
    },
})

export const uploadAvatarImageFromBuffer = (buffer, options) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: 'carlodo_chat/avatars',
            resource_type: "image",
            transformation: [{width: 200, height: 200, crop: 'fill'}],
            ...options
        },
        (error, result) => {
                if(error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            }
        )
        uploadStream.end(buffer);
    });
};

export const uploadImageConversationFromBuffer = (buffer, options) =>{
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: 'carlodo_chat/chats',
            resource_type: "image",
            transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
            ...options
        },
        (error, result) => {
                if(error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            }
        )
        uploadStream.end(buffer);
    });
}
