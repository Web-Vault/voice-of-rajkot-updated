import EventBooking from '../models/EventBooking.js';
import Event from '../models/Event.js';
import { sendEmail } from '../utils/mailer.js';
import { v4 as uuidv4 } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Configure Cloudinary with explicit values to avoid environment variable issues
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dwk4vt9ao';
const apiKey = process.env.CLOUDINARY_API_KEY || '783396415861444';
const apiSecret = process.env.CLOUDINARY_API_SECRET || 'bAokawHbmVPKLCoqKvUpS9OztTE';

cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
});

console.log('Cloudinary configured with:', {
      cloud_name: cloudName,
      api_key: apiKey ? 'Set' : 'Not Set',
      api_secret: apiSecret ? 'Set' : 'Not Set'
});

// Configure multer
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Add this new endpoint
export const uploadPaymentScreenshot = async (req, res) => {
      try {
            const { id } = req.params;

            if (!req.file) {
                  return res.status(400).json({ success: false, message: 'No file uploaded' });
            }

            const booking = await EventBooking.findById(id);
            if (!booking) {
                  return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            if (booking.user.toString() !== req.user._id.toString()) {
                  return res.status(403).json({ success: false, message: 'Not authorized' });
            }

            // Log Cloudinary configuration for debugging
            console.log('Cloudinary Config:', {
                  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                  api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set',
                  api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set'
            });

            // Log file details
            console.log('File details:', {
                  mimetype: req.file.mimetype,
                  size: req.file.size,
                  buffer_length: req.file.buffer.length
            });

            // Upload to Cloudinary with better error handling and explicit configuration
            const uploadResult = await new Promise((resolve, reject) => {
                  try {
                        // Create upload options with explicit credentials
                        const uploadOptions = {
                              resource_type: 'image',
                              folder: 'payment_screenshots',
                              public_id: `payment_${booking.ticketId}_${Date.now()}`,
                              api_key: apiKey,
                              api_secret: apiSecret,
                              cloud_name: cloudName
                        };

                        console.log('Creating upload stream with options:', {
                              resource_type: uploadOptions.resource_type,
                              folder: uploadOptions.folder,
                              public_id: uploadOptions.public_id,
                              // Don't log sensitive credentials
                              credentials_provided: !!(uploadOptions.api_key && uploadOptions.api_secret && uploadOptions.cloud_name)
                        });

                        const uploadStream = cloudinary.uploader.upload_stream(
                              uploadOptions,
                              (error, result) => {
                                    if (error) {
                                          console.error('Cloudinary upload error:', error);
                                          reject(error);
                                    } else {
                                          console.log('Cloudinary upload success:', result.public_id);
                                          resolve(result);
                                    }
                              }
                        );

                        uploadStream.end(req.file.buffer);
                  } catch (uploadError) {
                        console.error('Error during upload stream creation:', uploadError);
                        reject(uploadError);
                  }
            });

            // Update booking
            booking.paymentScreenshot = {
                  public_id: uploadResult.public_id,
                  url: uploadResult.secure_url,
            };
            booking.paymentStatus = 'pending';
            await booking.save();

            res.status(200).json({
                  success: true,
                  message: 'Payment screenshot uploaded successfully',
                  booking,
            });
      } catch (error) {
            console.error('Upload error details:', {
                  message: error.message,
                  stack: error.stack,
                  name: error.name,
                  code: error.code
            });
            res.status(500).json({
                  success: false,
                  message: 'Server error during payment screenshot upload',
                  error: error.message,
                  errorCode: error.code || 'UNKNOWN'
            });
      }
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
      try {
            const {
                  event,
                  username,
                  email,
                  mobileNumber,
                  numberOfSeats,
                  membersName,
                  isPerformer,
                  artType,
                  duration,
                  paymentId
            } = req.body;

            // Check if event exists
            const eventData = await Event.findById(event);
            if (!eventData) {
                  return res.status(404).json({ success: false, message: 'Event not found' });
            }

            // Check if enough seats are available
            if (eventData.bookedSeats + numberOfSeats > eventData.totalSeats) {
                  return res.status(400).json({ success: false, message: 'Not enough seats available' });
            }

            // Calculate total amount
            const totalAmount = numberOfSeats * eventData.price;

            // Generate unique ticket ID
            const ticketId = `TKT-${uuidv4().substring(0, 8)}`;

            // Create booking
            const booking = await EventBooking.create({
                  event,
                  ticketId,
                  username,
                  email,
                  mobileNumber,
                  numberOfSeats,
                  membersName: membersName || [],
                  isPerformer: isPerformer || false,
                  artType: isPerformer ? artType : undefined,
                  duration: isPerformer ? duration : undefined,
                  totalAmount,
                  paymentId,
                  paymentStatus: paymentId ? 'verified' : 'pending',
                  user: req.user._id
            });

            // Update event booked seats
            eventData.bookedSeats += numberOfSeats;
            await eventData.save();

            if (isPerformer) {
                  // Add performer to event if they are a performer
                  if (!eventData.performers.includes(req.user._id)) {
                        eventData.performers.push(req.user._id);
                  }
            }

            await eventData.save();

            res.status(201).json({
                  success: true,
                  message: 'Booking created successfully',
                  booking
            });
            try {
                  const eventDate = eventData.dateTime ? new Date(eventData.dateTime).toLocaleString() : '';
                  const subject = paymentId ? `Booking Confirmed: ${eventData.name}` : `Booking Created: ${eventData.name}`;
                  const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: ${paymentId ? '#16a34a' : '#2563eb'};">${paymentId ? 'Your booking is confirmed! 🎉' : 'Your booking has been created'}</h2>
          <p>Dear ${booking.username},</p>
          <ul>
            <li><strong>Event:</strong> ${eventData.name || '-'}</li>
            <li><strong>Date & Time:</strong> ${eventDate}</li>
            <li><strong>Venue:</strong> ${eventData.venue || '-'}</li>
            <li><strong>Ticket ID:</strong> ${booking.ticketId}</li>
            <li><strong>Seats:</strong> ${booking.numberOfSeats}</li>
            <li><strong>Total Amount:</strong> ₹${booking.totalAmount}</li>
            ${paymentId ? `<li><strong>Payment ID:</strong> ${paymentId}</li>` : ''}
          </ul>
          ${paymentId
                        ? '<p>Your payment has been verified and your booking is confirmed for the event.</p>'
                        : '<p>Your booking is pending payment verification. Please complete payment to confirm your ticket.</p>'}
          <p style="color:#555">— Voice of Rajkot Team</p>
        </div>
      `;
                  await sendEmail(booking.email, subject, html);
            } catch (mailErr) {
                  console.error('Error sending booking email:', mailErr);
            }
      } catch (error) {
            console.error('Create booking error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin only)
export const getBookings = async (req, res) => {
      try {
            const bookings = await EventBooking.find().populate('event', 'name dateTime venue');
            res.status(200).json({
                  success: true,
                  count: bookings.length,
                  bookings
            });
      } catch (error) {
            console.error('Get bookings error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user
// @access  Private
export const getUserBookings = async (req, res) => {
      try {
            const bookings = await EventBooking.find({ user: req.user._id })
                  .populate('event', 'name dateTime venue image price');
            // console.log('User Bookings:', bookings);
            res.status(200).json({
                  success: true,
                  count: bookings.length,
                  bookings
            });
      } catch (error) {
            console.error('Get user bookings error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

export const getVerifiedUserBookings = async (req, res) => {
      try {
            const bookings = await EventBooking.find({ user: req.user._id, paymentStatus: 'verified' })
                  .populate('event', 'name dateTime venue image price');
            res.status(200).json({
                  success: true,
                  count: bookings.length,
                  bookings
            });
      } catch (error) {
            console.error('Get verified user bookings error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
      try {
            const booking = await EventBooking.findById(req.params.id)
                  .populate('event', 'name dateTime venue image price');

            if (!booking) {
                  return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            // Check if booking belongs to user
            if (booking.user.toString() !== req.user._id.toString()) {
                  return res.status(403).json({ success: false, message: 'Not authorized to access this booking' });
            }

            res.status(200).json({
                  success: true,
                  booking
            });
      } catch (error) {
            console.error('Get booking error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Get bookings by event
// @route   GET /api/bookings/event/:id
// @access  Private (Event creators only)
export const getEventBookings = async (req, res) => {
      try {
            const event = await Event.findById(req.params.id);

            if (!event) {
                  return res.status(404).json({ success: false, message: 'Event not found' });
            }

            // Check if user is an admin or a performer in this event
            const isAdmin = req.user.isAdmin;
            const isPerformer = event.performers.some(performer =>
                  performer._id ? performer._id.toString() === req.user._id.toString() : performer.toString() === req.user._id.toString()
            );

            if (!isAdmin && !isPerformer) {
                  return res.status(403).json({ success: false, message: 'Not authorized to view these bookings' });
            }

            const bookings = await EventBooking.find({ event: req.params.id });

            res.status(200).json({
                  success: true,
                  count: bookings.length,
                  bookings
            });
      } catch (error) {
            console.error('Get event bookings error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = async (req, res) => {
      try {
            const booking = await EventBooking.findById(req.params.id);

            if (!booking) {
                  return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            // Check if booking belongs to user
            if (booking.user.toString() !== req.user._id.toString()) {
                  return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
            }

            // Update event booked seats
            const event = await Event.findById(booking.event);
            if (event) {
                  event.bookedSeats -= booking.numberOfSeats;
                  await event.save();
            }

            await booking.remove();

            res.status(200).json({
                  success: true,
                  message: 'Booking cancelled successfully'
            });
      } catch (error) {
            console.error('Cancel booking error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Verify booking payment (Admin)
// @route   POST /api/bookings/:id/verify
// @access  Private (Admin)
export const verifyBooking = async (req, res) => {
      try {
            const { id } = req.params;
            const booking = await EventBooking.findById(id).populate('event', 'name dateTime venue price');

            if (!booking) {
                  return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            if (booking.paymentStatus === 'verified') {
                  return res.status(400).json({ success: false, message: 'Booking already verified' });
            }

            if (booking.paymentStatus === "rejected") {
                  const performerUser = booking.user;

                  // add performer from event performers
                  const eventBooked = await Event.findById(booking.event);
                  if (eventBooked) {
                        if (booking.isPerformer) {
                              eventBooked.performers.push(performerUser._id);
                              eventBooked.bookedSeats += booking.numberOfSeats;
                              await eventBooked.save();
                        }
                  }
            }

            booking.paymentStatus = 'verified';
            booking.updatedAt = Date.now();
            await booking.save();

            // Send confirmation email to user
            try {
                  const subject = `Booking Confirmed: ${booking.event?.name || 'Event'}`;
                  const eventDate = booking.event?.dateTime ? new Date(booking.event.dateTime).toLocaleString() : '';
                  const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #16a34a;">Your booking is confirmed! 🎉</h2>
          <p>Dear ${booking.username},</p>
          <p>Your payment has been verified and your booking is confirmed for the event.</p>
          <ul>
            <li><strong>Event:</strong> ${booking.event?.name || '-'}</li>
            <li><strong>Date & Time:</strong> ${eventDate}</li>
            <li><strong>Venue:</strong> ${booking.event?.venue || '-'}</li>
            <li><strong>Ticket ID:</strong> ${booking.ticketId}</li>
            <li><strong>Seats:</strong> ${booking.numberOfSeats}</li>
            <li><strong>Total Amount:</strong> ₹${booking.totalAmount}</li>
          </ul>
          <p>We look forward to welcoming you to the event!</p>
          <p style="color:#555">— Voice of Rajkot Team</p>
        </div>
      `;
                  await sendEmail(booking.email, subject, html);
            } catch (mailErr) {
                  console.error('Error sending verification email:', mailErr);
                  // Do not fail the API on email errors
            }

            return res.status(200).json({ success: true, message: 'Booking verified successfully', booking });
      } catch (error) {
            console.error('Verify booking error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Reject booking payment (Admin)
// @route   POST /api/bookings/:id/reject
// @access  Private (Admin)
export const rejectBooking = async (req, res) => {
      try {
            const { id } = req.params;
            const { reason } = req.body;

            const booking = await EventBooking.findById(id);
            if (!booking) {
                  return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            if (booking.paymentStatus === 'rejected') {
                  return res.status(400).json({ success: false, message: 'Booking already rejected' });
            }

            const performerUser = booking.user;
            booking.paymentStatus = 'rejected';
            booking.rejectionReason = reason || 'No reason provided';
            // Remove performer from event performers
            const eventBooked = await Event.findById(booking.event);
            if (eventBooked) {
                  eventBooked.performers.forEach(performer => {
                        if (performer.toString() === performerUser._id.toString()) {
                              eventBooked.performers.pull(performerUser._id);
                        }
                  });
            }
            booking.updatedAt = Date.now();
            await booking.save();

            // Free all seats reserved by this booking
            if (eventBooked) {
                  const seatsToFree = booking.numberOfSeats || 0;
                  eventBooked.bookedSeats = Math.max(0, (eventBooked.bookedSeats || 0) - seatsToFree);
                  await eventBooked.save();
            }

            // Send rejection email to user
            try {
                  const subject = `Booking Not Confirmed: ${eventBooked?.name || 'Event'}`;
                  const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #dc2626;">Your booking was not confirmed</h2>
          <p>Dear ${booking.username},</p>
          <p>We’re sorry to inform you that your booking could not be confirmed.</p>
          <ul>
            <li><strong>Ticket ID:</strong> ${booking.ticketId}</li>
            <li><strong>Seats requested:</strong> ${booking.numberOfSeats}</li>
          </ul>
          <p><strong>Reason:</strong> ${booking.rejectionReason}</p>
          <p>If you believe this is a mistake, please contact support.</p>
          <p style="color:#555">— Voice of Rajkot Team</p>
        </div>
      `;
                  await sendEmail(booking.email, subject, html);
            } catch (mailErr) {
                  console.error('Error sending rejection email:', mailErr);
                  // Continue without failing the request
            }

            return res.status(200).json({ success: true, message: 'Booking rejected successfully', booking, eventBooked });
      } catch (error) {
            console.error('Reject booking error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};