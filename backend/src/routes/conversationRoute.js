import express from 'express'
import { addNewParticipant, createConversation, deleteConversation, deleteParticipant, getConversation, getMessages, renameGroup } from '../controllers/conversationController.js';
import { checkFriendShip } from '../middlewares/friendMiddleware.js';
import { markAsSeen } from '../controllers/messageController.js';

const router = express.Router();

router.get('/', getConversation);
router.post('/', checkFriendShip, createConversation);
router.get('/:conversationId/messages', getMessages);
router.patch("/:conversationId/seen", markAsSeen);
router.delete("/:conversationId", deleteConversation);
router.delete("/:conversationId/participants/:participantId", deleteParticipant);
router.patch("/:conversationId/addMember", addNewParticipant);
router.patch("/:conversationId/rename", renameGroup);

export default router;