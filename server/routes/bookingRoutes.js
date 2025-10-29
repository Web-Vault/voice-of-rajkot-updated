import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
      createBooking,
      getBookings,
      getBookingById,
      getUserBookings,
      getVerifiedUserBookings,
      getEventBookings,
      cancelBooking,
      uploadPaymentScreenshot,
      upload,
      verifyBooking,
      rejectBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

// Protected routes
router.post("/", protect, createBooking);
router.get("/", getBookings);
router.get("/user", protect, getUserBookings);
router.get("/user/verified", protect, getVerifiedUserBookings);
router.get("/:id", protect, getBookingById);
router.get("/event/:id", protect, getEventBookings);
router.delete("/:id", protect, cancelBooking);
// Add this route
router.post(
      "/:id/upload-payment",
      protect,
      upload.single("paymentScreenshot"),
      uploadPaymentScreenshot
);

// Admin actions: verify/reject booking
router.post("/:id/verify", protect, admin, verifyBooking);
router.post("/:id/reject", protect, admin, rejectBooking);

export default router;
