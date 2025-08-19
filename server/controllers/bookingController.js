import EventBooking from '../models/EventBooking.js';
import Event from '../models/Event.js';
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
            duration 
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
        
        // Check if user is a performer in this event
        if (!event.performers.includes(req.user._id)) {
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