import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/socketAuth';
import prisma from '../utils/prisma';
import { sendMessageToClaude } from '../services/claude';
import { logger } from '../utils/logger';

interface ChatMessageData {
  conversationId: string;
  content: string;
}

export const handleChatMessage = async (
  io: Server,
  socket: AuthenticatedSocket,
  data: ChatMessageData,
  callback?: (response: any) => void
) => {
  try {
    const { conversationId, content } = data;

    // Verify conversation belongs to user
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: socket.userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 50, // Last 50 messages for context
        },
      },
    });

    if (!conversation) {
      const error = { error: 'Conversation not found' };
      if (callback) callback(error);
      return;
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        conversationId,
        userId: socket.userId!,
        role: 'user',
        content,
      },
    });

    // Emit user message to conversation room
    io.to(`conversation:${conversationId}`).emit('chat:message', {
      message: userMessage,
    });

    // Prepare message history for Claude
    const messageHistory = [
      ...conversation.messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      {
        role: 'user' as const,
        content,
      },
    ];

    // Create placeholder for assistant message
    const assistantMessage = await prisma.message.create({
      data: {
        conversationId,
        userId: socket.userId!,
        role: 'assistant',
        content: '',
      },
    });

    // Emit initial assistant message
    io.to(`conversation:${conversationId}`).emit('chat:message', {
      message: assistantMessage,
    });

    // Stream Claude's response
    let fullResponse = '';
    const response = await sendMessageToClaude(messageHistory, (chunk) => {
      fullResponse += chunk;
      io.to(`conversation:${conversationId}`).emit('chat:stream', {
        messageId: assistantMessage.id,
        chunk,
        content: fullResponse,
      });
    });

    // Update assistant message with full response
    const updatedMessage = await prisma.message.update({
      where: { id: assistantMessage.id },
      data: {
        content: response.content,
        tokens: response.tokens,
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Emit completion
    io.to(`conversation:${conversationId}`).emit('chat:complete', {
      message: updatedMessage,
    });

    if (callback) {
      callback({ success: true, messageId: updatedMessage.id });
    }
  } catch (error) {
    logger.error('Error handling chat message:', error);
    const errorResponse = {
      error: error instanceof Error ? error.message : 'Failed to process message',
    };

    if (callback) callback(errorResponse);

    socket.emit('chat:error', errorResponse);
  }
};
