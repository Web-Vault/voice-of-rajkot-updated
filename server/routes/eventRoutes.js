import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
      createEvent,
      getEvents,
      getEventById,
      updateEvent,
      deleteEvent,
      getEventsByPerformer,
      addPerformerToEvent
} from '../controllers/eventController.js';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);
router.get('/performer/:id', getEventsByPerformer);

// Protected routes
router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.put('/:id/performer', protect, addPerformerToEvent);

export default router;