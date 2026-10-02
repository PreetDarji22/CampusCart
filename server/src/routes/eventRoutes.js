import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  registerForEvent,
  deleteEvent
} from '../controllers/eventController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, authorize('admin'), createEvent);

router.route('/:id')
  .get(getEventById)
  .delete(protect, authorize('admin'), deleteEvent);

router.route('/:id/register')
  .post(registerForEvent);

export default router;
