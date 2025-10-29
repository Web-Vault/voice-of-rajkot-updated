import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

// Connect to database
connectDB();

// Function to get performer IDs
const getPerformerIds = async () => {
      const performers = await User.find({ isPerformer: true }).select('_id');
      return performers.map(performer => performer._id);
};

// Import data function
const importData = async () => {
      try {
            // Get performer IDs
            const performerIds = await getPerformerIds();

            if (performerIds.length === 0) {
                  console.error('❌ No performers found in the database. Please run userSeeder.js first.');
                  process.exit(1);
            }

            // Sample event data
            const events = [
                  {
                        name: 'Rajkot Cultural Festival',
                        dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                        venue: 'Rajkot City Hall',
                        description: 'A celebration of Rajkot\'s rich cultural heritage featuring music, dance, and art performances.',
                        performers: [performerIds[0], performerIds[1]],
                        totalSeats: 200,
                        bookedSeats: 0,
                        price: 500,
                        image: 'https://example.com/images/rajkot-festival.jpg'
                  },
                  {
                        name: 'Classical Music Night',
                        dateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
                        venue: 'Rajkot Music Academy',
                        description: 'An evening of classical music performances by renowned artists from across Gujarat.',
                        performers: [performerIds[1]],
                        totalSeats: 100,
                        bookedSeats: 0,
                        price: 300,
                        image: 'https://example.com/images/classical-music.jpg'
                  },
                  {
                        name: 'Dance Extravaganza',
                        dateTime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
                        venue: 'Rajkot Community Center',
                        description: 'A showcase of various dance forms including Kathak, Garba, and contemporary styles.',
                        performers: [performerIds[2]],
                        totalSeats: 150,
                        bookedSeats: 0,
                        price: 400,
                        image: 'https://example.com/images/dance-show.jpg'
                  },
                  {
                        name: 'Youth Talent Show',
                        dateTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                        venue: 'Rajkot School Auditorium',
                        description: 'A platform for young talents to showcase their skills in music, dance, and other performing arts.',
                        performers: performerIds,
                        totalSeats: 250,
                        bookedSeats: 0,
                        price: 200,
                        image: 'https://example.com/images/youth-talent.jpg'
                  },
                  {
                        name: 'Instrumental Music Concert',
                        dateTime: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
                        venue: 'Rajkot Arts Center',
                        description: 'A concert featuring various traditional and modern musical instruments.',
                        performers: [performerIds[0], performerIds[2]],
                        totalSeats: 120,
                        bookedSeats: 0,
                        price: 350,
                        image: 'https://example.com/images/instrumental-concert.jpg'
                  }
            ];

            // Clear existing data
            await Event.deleteMany();

            // Insert new data
            const createdEvents = await Event.insertMany(events);

            console.log('✅ Events data imported successfully!');
            process.exit();
      } catch (error) {
            console.error(`❌ Error importing events data: ${error.message}`);
            process.exit(1);
      }
};

// Delete data function
const destroyData = async () => {
      try {
            await Event.deleteMany();

            console.log('✅ Events data destroyed successfully!');
            process.exit();
      } catch (error) {
            console.error(`❌ Error destroying events data: ${error.message}`);
            process.exit(1);
      }
};

// Run script based on command line argument
if (process.argv[2] === '-d') {
      destroyData();
} else {
      importData();
}