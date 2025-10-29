import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

// Connect to database
connectDB();

// Sample user data
const users = [
      {
            name: 'John Smith',
            email: 'john@example.com',
            password: bcrypt.hashSync('123456', 10),
            mobileNumber: '9876543210',
            isPerformer: false,
            profileTags: ['music lover', 'event enthusiast'],
            oneLineDesc: 'Passionate about local arts and culture',
            workDescription: 'Regular attendee at cultural events in Rajkot',
            profilePhoto: 'https://randomuser.me/api/portraits/men/1.jpg',
            isSampleAdded: false,
            sample: ''
      },
      {
            name: 'Priya Patel',
            email: 'priya@example.com',
            password: bcrypt.hashSync('123456', 10),
            mobileNumber: '9876543211',
            isPerformer: true,
            profileTags: ['Classical Singer', 'Hindustani Music', 'Vocal Artist'],
            oneLineDesc: 'Classical vocalist specializing in Hindustani music',
            workDescription: 'Professional classical singer with 8 years of experience in Hindustani classical music. Trained under renowned gurus and performed at various cultural events across Gujarat.',
            profilePhoto: 'https://randomuser.me/api/portraits/women/2.jpg',
            isSampleAdded: true,
            sample: 'https://example.com/priya-classical-performance.mp3'
      },
      {
            name: 'Raj Mehta',
            email: 'raj@example.com',
            password: bcrypt.hashSync('123456', 10),
            mobileNumber: '9876543212',
            isPerformer: true,
            profileTags: ['Folk Singer', 'Gujarati Folk', 'Live Performer'],
            oneLineDesc: 'Folk singer bringing Gujarati traditions to life',
            workDescription: 'Specializing in Gujarati folk music with a modern twist. Regular performer at cultural festivals and private events. Known for energetic performances of traditional folk songs.',
            profilePhoto: 'https://randomuser.me/api/portraits/men/3.jpg',
            isSampleAdded: true,
            sample: 'https://example.com/raj-folk-performance.mp3'
      },
      {
            name: 'Meera Shah',
            email: 'meera@example.com',
            password: bcrypt.hashSync('123456', 10),
            mobileNumber: '9876543213',
            isPerformer: true,
            profileTags: ['Kathak Dancer', 'Classical Dance', 'Choreographer'],
            oneLineDesc: 'Kathak dancer and choreographer',
            workDescription: 'Professional Kathak dancer with 10 years of experience. Trained at prestigious dance academies and performed at national level events. Also runs a dance academy in Rajkot.',
            profilePhoto: 'https://randomuser.me/api/portraits/women/4.jpg',
            isSampleAdded: true,
            sample: 'https://example.com/meera-kathak-performance.mp4'
      }
];

// Import data function
const importData = async () => {
      try {
            // Clear existing data
            await User.deleteMany();

            // Insert new data
            const createdUsers = await User.insertMany(users);

            console.log('✅ Users data imported successfully!');
            process.exit();
      } catch (error) {
            console.error(`❌ Error importing users data: ${error.message}`);
            process.exit(1);
      }
};

// Delete data function
const destroyData = async () => {
      try {
            await User.deleteMany();

            console.log('✅ Users data destroyed successfully!');
            process.exit();
      } catch (error) {
            console.error(`❌ Error destroying users data: ${error.message}`);
            process.exit(1);
      }
};

// Run script based on command line argument
if (process.argv[2] === '-d') {
      destroyData();
} else {
      importData();
}