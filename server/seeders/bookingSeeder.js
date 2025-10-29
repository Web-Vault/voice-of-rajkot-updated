import mongoose from 'mongoose';
import dotenv from 'dotenv';
import EventBooking from '../models/EventBooking.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import connectDB from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// Connect to database
connectDB();

// Function to get event IDs
const getEventIds = async () => {
      const events = await Event.find().select('_id price');
      return events;
};

// Function to get user IDs
const getUserIds = async () => {
      const users = await User.find({ isPerformer: false }).select('_id name email mobileNumber');
      return users;
};

// Function to get performer IDs
const getPerformerIds = async () => {
      const performers = await User.find({ isPerformer: true }).select('_id name email mobileNumber performerDetails');
      return performers;
};

// Import data function
const importData = async () => {
      try {
            // Get IDs
            const events = await getEventIds();
            const users = await getUserIds();
            const performers = await getPerformerIds();

            if (events.length === 0) {
                  console.error('❌ No events found in the database. Please run eventSeeder.js first.');
                  process.exit(1);
            }

            if (users.length === 0 && performers.length === 0) {
                  console.error('❌ No users found in the database. Please run userSeeder.js first.');
                  process.exit(1);
            }

            // Sample booking data
            const bookings = [
                  // Regular user bookings
                  {
                        event: events[0]._id,
                        ticketId: uuidv4(),
                        username: users[0].name,
                        email: users[0].email,
                        mobileNumber: users[0].mobileNumber,
                        numberOfSeats: 2,
                        membersName: ['Guest 1', 'Guest 2'],
                        isPerformer: false,
                        totalAmount: events[0].price * 2,
                  },
                  {
                        event: events[1]._id,
                        ticketId: uuidv4(),
                        username: users[1].name,
                        email: users[1].email,
                        mobileNumber: users[1].mobileNumber,
                        numberOfSeats: 3,
                        membersName: ['Guest 1', 'Guest 2', 'Guest 3'],
                        isPerformer: false,
                        totalAmount: events[1].price * 3,
                  },
                  // Performer bookings
                  {
                        event: events[2]._id,
                        ticketId: uuidv4(),
                        username: performers[0].name,
                        email: performers[0].email,
                        mobileNumber: performers[0].mobileNumber,
                        numberOfSeats: 1,
                        membersName: [],
                        isPerformer: true,
                        artType: performers[0].performerDetails?.artType || 'Singer',
                        duration: 30,
                        totalAmount: 0, // Performers don't pay
                  },
                  {
                        event: events[3]._id,
                        ticketId: uuidv4(),
                        username: performers[1].name,
                        email: performers[1].email,
                        mobileNumber: performers[1].mobileNumber,
                        numberOfSeats: 1,
                        membersName: [],
                        isPerformer: true,
                        artType: performers[1].performerDetails?.artType || 'Dancer',
                        duration: 45,
                        totalAmount: 0, // Performers don't pay
                  }
            ];

            // Update event booked seats
            for (const booking of bookings) {
                  await Event.findByIdAndUpdate(
                        booking.event,
                        { $inc: { bookedSeats: booking.numberOfSeats } }
                  );
            }

            // Clear existing data
            await EventBooking.deleteMany();

            // Insert new data
            const createdBookings = await EventBooking.insertMany(bookings);

            console.log('✅ Bookings data imported successfully!');
            process.exit();
      } catch (error) {
            console.error(`❌ Error importing bookings data: ${error.message}`);
            process.exit(1);
      }
};

// Delete data function
const destroyData = async () => {
      try {
            // Reset booked seats in events
            await Event.updateMany({}, { bookedSeats: 0 });

            // Delete bookings
            await EventBooking.deleteMany();

            console.log('✅ Bookings data destroyed successfully!');
            process.exit();
      } catch (error) {
            console.error(`❌ Error destroying bookings data: ${error.message}`);
            process.exit(1);
      }
};

// Run script based on command line argument
if (process.argv[2] === '-d') {
      destroyData();
} else {
      importData();
}