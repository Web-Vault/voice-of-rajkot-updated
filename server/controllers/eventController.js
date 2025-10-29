import Event from '../models/Event.js';
import User from '../models/User.js';

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Only performers)
export const createEvent = async (req, res) => {
      try {
            const { name, dateTime, venue, description, totalSeats, price, image } = req.body;

            // Check if user is a performer
            if (!req.user.isAdmin) {
                  return res.status(403).json({ success: false, message: 'Only Admins can create events' });
            }

            const event = await Event.create({
                  name,
                  dateTime,
                  venue,
                  description,
                  performers: [req.user._id], // Add current user as performer
                  totalSeats,
                  price,
                  image
            });

            res.status(201).json({
                  success: true,
                  message: 'Event created successfully',
                  event
            });
      } catch (error) {
            console.error('Create event error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
      try {
            const events = await Event.find().populate('performers', 'name email profilePhoto');
            console.log("events", events);
            res.status(200).json({
                  success: true,
                  count: events.length,
                  events
            });
      } catch (error) {
            console.error('Get events error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
      try {
            const event = await Event.findById(req.params.id).populate('performers', 'name email profilePhoto');

            if (!event) {
                  return res.status(404).json({ success: false, message: 'Event not found' });
            }

            res.status(200).json({
                  success: true,
                  event
            });
      } catch (error) {
            console.error('Get event error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Only event creators)
export const updateEvent = async (req, res) => {
      try {
            let event = await Event.findById(req.params.id);

            if (!event) {
                  return res.status(404).json({ success: false, message: 'Event not found' });
            }

            // Check if user is a performer in this event
            if (!event.performers.includes(req.user._id)) {
                  return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
            }

            event = await Event.findByIdAndUpdate(req.params.id, req.body, {
                  new: true,
                  runValidators: true
            }).populate('performers', 'name');

            res.status(200).json({
                  success: true,
                  message: 'Event updated successfully',
                  event
            });
      } catch (error) {
            console.error('Update event error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Only event creators)
export const deleteEvent = async (req, res) => {
      try {
            const event = await Event.findById(req.params.id);

            if (!event) {
                  return res.status(404).json({ success: false, message: 'Event not found' });
            }

            // Check if user is a performer in this event
            if (!event.performers.includes(req.user._id)) {
                  return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
            }

            await event.remove();

            res.status(200).json({
                  success: true,
                  message: 'Event deleted successfully'
            });
      } catch (error) {
            console.error('Delete event error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Get events by performer
// @route   GET /api/events/performer/:id
// @access  Public
export const getEventsByPerformer = async (req, res) => {
      try {
            const events = await Event.find({ performers: req.params.id }).populate('performers', 'name');

            res.status(200).json({
                  success: true,
                  count: events.length,
                  events
            });
      } catch (error) {
            console.error('Get performer events error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Add performer to event
// @route   PUT /api/events/:id/performers
// @access  Private (Only event creators)
export const addPerformerToEvent = async (req, res) => {
      try {
            const { performerId } = req.body;

            // Check if performer exists and is a performer
            const performer = await User.findById(performerId);
            if (!performer || !performer.isPerformer) {
                  return res.status(400).json({ success: false, message: 'Invalid performer' });
            }

            const event = await Event.findById(req.params.id);
            if (!event) {
                  return res.status(404).json({ success: false, message: 'Event not found' });
            }

            // Check if user is a performer in this event
            if (!event.performers.includes(req.user._id)) {
                  return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
            }

            // Check if performer is already added
            if (event.performers.includes(performerId)) {
                  return res.status(400).json({ success: false, message: 'Performer already added to this event' });
            }

            event.performers.push(performerId);
            await event.save();

            const updatedEvent = await Event.findById(req.params.id).populate('performers', 'name email profilePhoto');

            res.status(200).json({
                  success: true,
                  message: 'Performer added to event successfully',
                  event: updatedEvent
            });
      } catch (error) {
            console.error('Add performer error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};