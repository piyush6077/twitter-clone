import express from 'express'
import { protectedRoute } from '../middleware/protectedRoute';

const router = express.Router();

router.get('/', protectedRoute, getNotifications )
router.delete('/', protectedRoute, deleteNotification )

export default router;

