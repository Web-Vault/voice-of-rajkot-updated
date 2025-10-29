import Post from '../models/Post.js';
import User from '../models/User.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private (Only performers)
export const createPost = async (req, res) => {
      try {
            const { heading, content, tags, image } = req.body;

            // Check if user is a performer
            if (!req.user.isPerformer) {
                  return res.status(403).json({ success: false, message: 'Only performers can create posts' });
            }

            const post = await Post.create({
                  heading,
                  content,
                  tags: tags || [],
                  author: req.user._id,
                  image
            });

            const populatedPost = await Post.findById(post._id).populate('author', 'name profilePhoto');

            res.status(201).json({
                  success: true,
                  message: 'Post created successfully',
                  post: populatedPost
            });
      } catch (error) {
            console.error('Create post error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Get all posts with pagination
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
      try {
            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const skip = (page - 1) * limit;

            // Query with pagination
            const posts = await Post.find()
                  .populate('author', 'name profilePhoto')
                  .sort({ createdAt: -1 })
                  .skip(skip)
                  .limit(limit);

            // Get total count for pagination info
            const totalPosts = await Post.countDocuments();

            res.status(200).json({
                  success: true,
                  count: posts.length,
                  totalPages: Math.ceil(totalPosts / limit),
                  currentPage: page,
                  hasMore: skip + posts.length < totalPosts,
                  posts
            });
      } catch (error) {
            console.error('Get posts error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res) => {
      try {
            const post = await Post.findById(req.params.id)
                  .populate('author', 'name profilePhoto')
                  .populate('likes', 'name');

            if (!post) {
                  return res.status(404).json({ success: false, message: 'Post not found' });
            }

            res.status(200).json({
                  success: true,
                  post
            });
      } catch (error) {
            console.error('Get post error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Only post author)
export const updatePost = async (req, res) => {
      try {
            let post = await Post.findById(req.params.id);

            if (!post) {
                  return res.status(404).json({ success: false, message: 'Post not found' });
            }

            // Check if user is the author
            if (post.author.toString() !== req.user._id.toString()) {
                  return res.status(403).json({ success: false, message: 'Not authorized to update this post' });
            }

            post = await Post.findByIdAndUpdate(
                  req.params.id,
                  { ...req.body, updatedAt: Date.now() },
                  { new: true, runValidators: true }
            ).populate('author', 'name profilePhoto');

            res.status(200).json({
                  success: true,
                  message: 'Post updated successfully',
                  post
            });
      } catch (error) {
            console.error('Update post error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Only post author)
export const deletePost = async (req, res) => {
      try {
            const post = await Post.findById(req.params.id);

            if (!post) {
                  return res.status(404).json({ success: false, message: 'Post not found' });
            }

            // Check if user is the author
            if (post.author.toString() !== req.user._id.toString()) {
                  return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
            }

            await post.remove();

            res.status(200).json({
                  success: true,
                  message: 'Post deleted successfully'
            });
      } catch (error) {
            console.error('Delete post error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
export const likePost = async (req, res) => {
      try {
            const post = await Post.findById(req.params.id);

            if (!post) {
                  return res.status(404).json({ success: false, message: 'Post not found' });
            }

            // Check if post has already been liked by this user
            const alreadyLiked = post.likes.includes(req.user._id);

            if (alreadyLiked) {
                  // Unlike the post
                  post.likes = post.likes.filter(like => like.toString() !== req.user._id.toString());
            } else {
                  // Like the post
                  post.likes.push(req.user._id);
            }

            await post.save();

            const updatedPost = await Post.findById(req.params.id)
                  .populate('author', 'name profilePhoto')
                  .populate('likes', 'name');

            res.status(200).json({
                  success: true,
                  message: alreadyLiked ? 'Post unliked' : 'Post liked',
                  post: updatedPost
            });
      } catch (error) {
            console.error('Like post error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Get posts by author
// @route   GET /api/posts/author/:id
// @access  Public
export const getPostsByAuthor = async (req, res) => {
      try {
            const posts = await Post.find({ author: req.params.id })
                  .populate('author', 'name profilePhoto')
                  .sort({ createdAt: -1 });

            res.status(200).json({
                  success: true,
                  count: posts.length,
                  posts
            });
      } catch (error) {
            console.error('Get author posts error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Get posts by tag
// @route   GET /api/posts/tag/:tag
// @access  Public
export const getPostsByTag = async (req, res) => {
      try {
            const posts = await Post.find({ tags: req.params.tag })
                  .populate('author', 'name profilePhoto')
                  .sort({ createdAt: -1 });

            res.status(200).json({
                  success: true,
                  count: posts.length,
                  posts
            });
      } catch (error) {
            console.error('Get tagged posts error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};