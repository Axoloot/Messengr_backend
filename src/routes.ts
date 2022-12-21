import express from 'express';


import authRoutes from './components/auth/routes';
import usersRoutes from './components/users/routes';
import MessagesRoutes from './components/messages/routes';
import ConversationsRoutes from './components/conversations/routes';

const router = express.Router();

// COMPONENTS
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/messages', MessagesRoutes);
router.use('/conversations', ConversationsRoutes);

export default router;
