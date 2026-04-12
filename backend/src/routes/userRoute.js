import express from 'express';
import { authMe, changePassword, searchUserByDisplayName, updateUser, uploadAvatar } from '../controllers/userController.js';
import { upload } from '../middlewares/uploadMiddleware.js';
const router = express.Router();

router.get('/me', authMe);
router.post('/search', searchUserByDisplayName);
router.post('/uploadAvatar', upload.single('file'), uploadAvatar);
router.patch('/update', updateUser);
router.patch('/changePassword', changePassword);

export default router;