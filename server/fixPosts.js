import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from './models/Post.js';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

// Connect to database
connectDB();

// Function to fix posts with null authors
const fixPosts = async () => {
      try {
            console.log('🔧 Starting to fix posts with null authors...');

            // Find all posts with null authors
            const postsWithNullAuthors = await Post.find({ author: null });
            console.log(`Found ${postsWithNullAuthors.length} posts with null authors`);

            if (postsWithNullAuthors.length === 0) {
                  console.log('✅ No posts with null authors found. All posts are good!');
                  process.exit(0);
            }

            // Get performer IDs to assign as authors
            const performers = await User.find({ isPerformer: true }).select('_id');

            if (performers.length === 0) {
                  console.error('❌ No performers found in the database. Cannot fix posts.');
                  process.exit(1);
            }

            console.log(`Found ${performers.length} performers to use as authors`);

            // Fix each post with a null author
            let fixedCount = 0;
            for (const post of postsWithNullAuthors) {
                  // Assign a random performer as the author
                  const randomPerformerIndex = Math.floor(Math.random() * performers.length);
                  const performerId = performers[randomPerformerIndex]._id;

                  await Post.findByIdAndUpdate(post._id, { author: performerId });
                  fixedCount++;

                  console.log(`Fixed post: ${post._id} - Assigned author: ${performerId}`);
            }

            console.log(`✅ Successfully fixed ${fixedCount} posts with null authors!`);
            process.exit(0);
      } catch (error) {
            console.error(`❌ Error fixing posts: ${error.message}`);
            process.exit(1);
      }
};

// Run the fix function
fixPosts();