export const emitDeleteConversation = (io, conversationId, conversationName) => { 
    io.to(conversationId).emit("conversation-deleted", {
        conversationId, 
        conversationName
    })
}

export const emitAddNewParticipant = (io, conversationId, participant) => {
    io.to(conversationId).emit("participant-added", {
        conversationId,
        participant
    })
}

export const emitRemoveParticipant = (io, conversationId, conversationName, participantId) => {
    io.to(conversationId).emit("participant-removed", {
        conversationId,
        conversationName,
        participantId
    })
}

export const emitOutGroup = (io, conversationId, conversationName, participantId, participantName) => {
    io.to(conversationId).emit("out-group", {
        conversationId,
        conversationName,
        participantId, 
        participantName
    })
}