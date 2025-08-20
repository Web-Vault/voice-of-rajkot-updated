import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {     createBooking,
    getBookings,
    getBookingById,
    getUserBookings,
    getEventBookings,
    cancelBooking,
    uploadPaymentScreenshot,
    upload } from '../controllers/bookingController.js';

const router = express.Router();

// Protected routes
router.post('/', protect, createBooking);
router.get('/', getBookings);
router.get('/user', protect, getUserBookings);
router.get('/:id', protect, getBookingById);
router.get('/event/:id', protect, getEventBookings);
router.delete('/:id', protect, cancelBooking);
// Add this route
router.post('/:id/upload-payment', protect, upload.single('paymentScreenshot'), uploadPaymentScreenshot);

export default router;