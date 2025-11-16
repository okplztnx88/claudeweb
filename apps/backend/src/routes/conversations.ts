import { Router } from 'express';
import { body } from 'express-validator';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { validate } from '../middleware/validate';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all conversations for user
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId: req.userId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({
      status: 'success',
      data: { conversations },
    });
  } catch (error) {
    next(error);
  }
});

// Get single conversation
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    res.json({
      status: 'success',
      data: { conversation },
    });
  } catch (error) {
    next(error);
  }
});

// Create conversation
router.post(
  '/',
  [body('title').optional().isString().trim()],
  validate,
  async (req: AuthRequest, res, next) => {
    try {
      const conversation = await prisma.conversation.create({
        data: {
          title: req.body.title || 'New Conversation',
          userId: req.userId!,
        },
      });

      res.status(201).json({
        status: 'success',
        data: { conversation },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update conversation
router.patch(
  '/:id',
  [body('title').isString().trim()],
  validate,
  async (req: AuthRequest, res, next) => {
    try {
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: req.params.id,
          userId: req.userId,
        },
      });

      if (!conversation) {
        throw new AppError('Conversation not found', 404);
      }

      const updated = await prisma.conversation.update({
        where: { id: req.params.id },
        data: { title: req.body.title },
      });

      res.json({
        status: 'success',
        data: { conversation: updated },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete conversation
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    await prisma.conversation.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
