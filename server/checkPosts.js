import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from './models/Post.js';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

// Connect to database
connectDB();

// Function to check posts and their authors
const checkPosts = async () => {
      try {
            console.log('🔍 Checking posts and their authors...');

            // Get all posts
            const posts = await Post.find().lean();
            console.log(`Found ${posts.length} posts in total`);

            // Check for posts with null authors
            const postsWithNullAuthors = posts.filter(post => post.author === null);
            console.log(`Posts with null authors: ${postsWithNullAuthors.length}`);

            if (postsWithNullAuthors.length > 0) {
                  console.log('\nSample posts with null authors:');
                  postsWithNullAuthors.slice(0, 3).forEach(post => {
                        console.log(`- Post ID: ${post._id}, Heading: ${post.heading}`);
                  });
            }

            // Check for posts with invalid author references
            const postsWithAuthors = posts.filter(post => post.author !== null);
            console.log(`\nPosts with author references: ${postsWithAuthors.length}`);

            // Get all user IDs
            const userIds = (await User.find().select('_id')).map(user => user._id.toString());
            console.log(`Found ${userIds.length} users in the database`);

            // Check for posts with invalid author references
            const postsWithInvalidAuthors = postsWithAuthors.filter(post =>
                  !userIds.includes(post.author.toString())
            );

            console.log(`Posts with invalid author references: ${postsWithInvalidAuthors.length}`);

            if (postsWithInvalidAuthors.length > 0) {
                  console.log('\nSample posts with invalid author references:');
                  postsWithInvalidAuthors.slice(0, 3).forEach(post => {
                        console.log(`- Post ID: ${post._id}, Author ID: ${post.author}, Heading: ${post.heading}`);
                  });
            }

            // Test population
            console.log('\n🔍 Testing population of authors...');
            const populatedPosts = await Post.find().limit(3).populate('author', 'name profilePhoto');

            populatedPosts.forEach(post => {
                  console.log(`\nPost: ${post.heading}`);
                  console.log(`Author: ${post.author ? JSON.stringify(post.author) : 'null'}`);
            });

            process.exit(0);
      } catch (error) {
            console.error(`❌ Error checking posts: ${error.message}`);
            process.exit(1);
      }
};

// Run the check function
checkPosts();