import express from 'express'
import { sendDirectMessage, sendGroupMessage, uploadImageChat } from '../controllers/messageController.js';
import { checkFriendShip, checkGroupMemberShip } from '../middlewares/friendMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/direct', checkFriendShip, sendDirectMessage);
router.post('/group', checkGroupMemberShip, sendGroupMessage);
router.post('/uploadImages', upload.array('files'), uploadImageChat);

export default router;