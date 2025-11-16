import { Router } from 'express';
import { body } from 'express-validator';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { validate } from '../middleware/validate';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get messages for conversation
router.get('/conversation/:conversationId', async (req: AuthRequest, res, next) => {
  try {
    // Verify conversation belongs to user
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: req.params.conversationId,
        userId: req.userId,
      },
    });

    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: req.params.conversationId },
      orderBy: { createdAt: 'asc' },
    });

    res.json({
      status: 'success',
      data: { messages },
    });
  } catch (error) {
    next(error);
  }
});

// Create message (for manual message creation, real-time uses Socket.io)
router.post(
  '/',
  [
    body('conversationId').isString(),
    body('role').isIn(['user', 'assistant']),
    body('content').isString().notEmpty(),
  ],
  validate,
  async (req: AuthRequest, res, next) => {
    try {
      const { conversationId, role, content } = req.body;

      // Verify conversation belongs to user
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          userId: req.userId,
        },
      });

      if (!conversation) {
        throw new AppError('Conversation not found', 404);
      }

      const message = await prisma.message.create({
        data: {
          conversationId,
          userId: req.userId!,
          role,
          content,
        },
      });

      res.status(201).json({
        status: 'success',
        data: { message },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
