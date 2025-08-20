import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Post from '../models/Post.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password, mobileNumber, isPerformer } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            mobileNumber,
            isPerformer: isPerformer || false,
            // If user is a performer, set isSampleAdded to false by default
            ...(isPerformer ? { isSampleAdded: false } : {}),
        });

        if (user) {
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    mobileNumber: user.mobileNumber,
                    isPerformer: user.isPerformer,
                    isSampleAdded: user.isSampleAdded,
                    token: generateToken(user._id),
                },
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                isPerformer: user.isPerformer,
                profilePhoto: user.profilePhoto,
                isSampleAdded: user.isSampleAdded,
                token: generateToken(user._id),
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.status(200).json({
                success: true,
                user,
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get all performers
// @route   GET /api/auth/performers
// @access  Public
export const getAllPerformers = async (req, res) => {
    try {
        const performers = await User.find({ isPerformer: true });
        
        res.status(200).json({
            success: true,
            performers
        });
    } catch (error) {
        console.error('Get performers error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/auth/users/:id
// @access  Public
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.status(200).json({
                success: true,
                user
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private (Admin only)
export const getAllUsers = async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Not authorized as admin' });
        }
        
        const users = await User.find().select('-password');
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.mobileNumber = req.body.mobileNumber || user.mobileNumber;
            user.isPerformer = req.body.isPerformer || user.isPerformer;
            
            // Update performer-specific fields if they exist in request
            if (user.isPerformer) {
                user.profileTags = req.body.profileTags || user.profileTags;
                user.oneLineDesc = req.body.oneLineDesc || user.oneLineDesc;
                user.workDescription = req.body.workDescription || user.workDescription;
                user.profilePhoto = req.body.profilePhoto || user.profilePhoto;
                user.isSampleAdded = req.body.isSampleAdded || user.isSampleAdded;
                user.sample = req.body.sample || user.sample;
            }

            const updatedUser = await user.save();
            res.status(200).json({
                success: true,
                user: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    mobileNumber: updatedUser.mobileNumber,
                    isPerformer: updatedUser.isPerformer,
                    profileTags: updatedUser.profileTags,
                    oneLineDesc: updatedUser.oneLineDesc,
                    workDescription: updatedUser.workDescription,
                    profilePhoto: updatedUser.profilePhoto,
                    isSampleAdded: updatedUser.isSampleAdded,
                    sample: updatedUser.sample
                }
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Artist onboarding - Add sample poetry
// @route   POST /api/auth/artist-onboarding
// @access  Private (Only performers)
export const artistOnboarding = async (req, res) => {
    try {
        const { samplePoetryHeading, samplePoetryContent, tags } = req.body;
        
        // Check if user is a performer
        if (!req.user.isPerformer) {
            return res.status(403).json({ success: false, message: 'Only performers can complete artist onboarding' });
        }
        
        // Get the user
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        // Create a sample poetry post
        const post = await Post.create({
            heading: samplePoetryHeading,
            content: samplePoetryContent,
            tags: tags || [],
            author: req.user._id,
        });
        
        // Update user to mark sample as added
        user.isSampleAdded = true;
        await user.save();
        
        const populatedPost = await Post.findById(post._id).populate('author', 'name profilePhoto');
        
        res.status(201).json({
            success: true,
            message: 'Artist onboarding completed successfully',
            post: populatedPost,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                isPerformer: user.isPerformer,
                isSampleAdded: user.isSampleAdded
            }
        });
    } catch (error) {
        console.error('Artist onboarding error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_for_development', {
        expiresIn: '30d',
    });
};