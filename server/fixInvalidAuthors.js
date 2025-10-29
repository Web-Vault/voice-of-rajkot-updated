import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from './models/Post.js';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

// Connect to database
connectDB();

// Function to fix posts with invalid author references
const fixInvalidAuthors = async () => {
      try {
            console.log('🔧 Starting to fix posts with invalid author references...');

            // Get all posts
            const posts = await Post.find();
            console.log(`Found ${posts.length} posts in total`);

            // Get all valid user IDs
            const users = await User.find();
            const userIds = users.map(user => user._id.toString());
            console.log(`Found ${userIds.length} valid users in the database`);

            if (users.length === 0) {
                  console.error('❌ No users found in the database. Cannot fix posts.');
                  process.exit(1);
            }

            // Get performer IDs to assign as authors
            const performers = users.filter(user => user.isPerformer);
            console.log(`Found ${performers.length} performers to use as authors`);

            if (performers.length === 0) {
                  console.log('⚠️ No performers found. Will use regular users as authors.');
            }

            // Fix each post with an invalid author reference
            let fixedCount = 0;
            for (const post of posts) {
                  const authorId = post.author ? post.author.toString() : null;

                  // Check if author reference is valid
                  const isValidAuthor = authorId && userIds.includes(authorId);

                  if (!isValidAuthor) {
                        // Assign a random user (preferably a performer) as the author
                        const authorPool = performers.length > 0 ? performers : users;
                        const randomIndex = Math.floor(Math.random() * authorPool.length);
                        const newAuthorId = authorPool[randomIndex]._id;

                        // Update the post with the new author
                        await Post.findByIdAndUpdate(post._id, { author: newAuthorId });

                        console.log(`Fixed post: ${post._id} - Old author: ${authorId || 'null'}, New author: ${newAuthorId}`);
                        fixedCount++;
                  }
            }

            console.log(`\n✅ Successfully fixed ${fixedCount} posts with invalid author references!`);

            // Verify the fix by testing population
            console.log('\n🔍 Verifying fix by testing population of authors...');
            const populatedPosts = await Post.find().limit(3).populate('author', 'name profilePhoto');

            populatedPosts.forEach(post => {
                  console.log(`\nPost: ${post.heading}`);
                  console.log(`Author: ${post.author ? JSON.stringify(post.author) : 'null'}`);
            });

            process.exit(0);
      } catch (error) {
            console.error(`❌ Error fixing posts: ${error.message}`);
            process.exit(1);
      }
};

// Run the fix function
fixInvalidAuthors();