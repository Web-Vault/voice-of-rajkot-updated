import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from '../models/Post.js';
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

// Function to get user IDs for likes
const getUserIds = async () => {
      const users = await User.find().select('_id');
      return users.map(user => user._id);
};

// Import data function
const importData = async () => {
      try {
            // Get performer IDs
            const performerIds = await getPerformerIds();
            const userIds = await getUserIds();

            if (performerIds.length === 0) {
                  console.error('❌ No performers found in the database. Please run userSeeder.js first.');
                  process.exit(1);
            }

            // Sample post data
            const posts = [
                  {
                        heading: 'My Journey as a Singer',
                        content: 'I started singing when I was just 5 years old. My journey has been full of ups and downs, but I\'ve loved every moment of it. I\'m excited to share my experiences with all of you through this platform.',
                        tags: ['singing', 'music', 'journey'],
                        likes: [userIds[0], userIds[1]],
                        author: performerIds[0],
                        image: 'https://example.com/images/singer-journey.jpg'
                  },
                  {
                        heading: 'Upcoming Dance Workshop',
                        content: 'I\'m thrilled to announce that I\'ll be conducting a dance workshop next month. We\'ll be covering various dance forms including Kathak and contemporary styles. Stay tuned for more details!',
                        tags: ['dance', 'workshop', 'kathak'],
                        likes: [userIds[2]],
                        author: performerIds[1],
                        image: 'https://example.com/images/dance-workshop.jpg'
                  },
                  {
                        heading: 'The Art of Percussion',
                        content: 'Percussion instruments form the backbone of any musical composition. In this post, I want to share my thoughts on how percussion can elevate a musical piece and create a unique rhythm that resonates with the audience.',
                        tags: ['music', 'percussion', 'rhythm'],
                        likes: [userIds[0], userIds[3], userIds[4]],
                        author: performerIds[2],
                        image: 'https://example.com/images/percussion-art.jpg'
                  },
                  {
                        heading: 'My Recent Performance at Rajkot Cultural Festival',
                        content: 'I had the honor of performing at the Rajkot Cultural Festival last week. The energy of the crowd was amazing, and I\'m grateful for the opportunity to showcase my talent on such a prestigious platform.',
                        tags: ['performance', 'festival', 'rajkot'],
                        likes: [userIds[1], userIds[2]],
                        author: performerIds[0],
                        image: 'https://example.com/images/festival-performance.jpg'
                  },
                  {
                        heading: 'The Evolution of Classical Music',
                        content: 'Classical music has evolved significantly over the centuries. From the ancient ragas to modern interpretations, the journey has been fascinating. In this post, I explore the key milestones in the evolution of classical music in India.',
                        tags: ['classical', 'music', 'evolution'],
                        likes: [userIds[3]],
                        author: performerIds[2],
                        image: 'https://example.com/images/classical-evolution.jpg'
                  }
            ];

            // Clear existing data
            await Post.deleteMany();

            // Insert new data
            const createdPosts = await Post.insertMany(posts);

            console.log('✅ Posts data imported successfully!');
            process.exit();
      } catch (error) {
            console.error(`❌ Error importing posts data: ${error.message}`);
            process.exit(1);
      }
};

// Delete data function
const destroyData = async () => {
      try {
            await Post.deleteMany();

            console.log('✅ Posts data destroyed successfully!');
            process.exit();
      } catch (error) {
            console.error(`❌ Error destroying posts data: ${error.message}`);
            process.exit(1);
      }
};

// Run script based on command line argument
if (process.argv[2] === '-d') {
      destroyData();
} else {
      importData();
}