import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/mailer.js';
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
                        isAdmin: user.isAdmin,
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

// ==========================
// Password Reset via OTP
// ==========================

// @desc    Request password reset OTP
// @route   POST /api/auth/password-reset/request
// @access  Public
export const requestPasswordReset = async (req, res) => {
      try {
            const { email } = req.body;
            if (!email) {
                  return res.status(400).json({ success: false, message: 'Email is required' });
            }

            const user = await User.findOne({ email });

            // Always respond with a generic message to prevent user enumeration
            const genericResponse = { success: true, message: 'If the email exists, an OTP has been sent.' };

            // If user doesn't exist, return generic success without revealing
            if (!user) {
                  return res.status(200).json(genericResponse);
            }

            // Throttle OTP sending: minimum 60 seconds between sends
            const now = new Date();
            if (user.resetOtpLastSent && (now.getTime() - user.resetOtpLastSent.getTime()) < 60_000) {
                  // Do not send again; return generic success
                  return res.status(200).json(genericResponse);
            }

            // Generate a cryptographically strong 6-digit OTP
            const otp = ('' + crypto.randomInt(100000, 1000000));

            // Hash OTP
            const salt = await bcrypt.genSalt(10);
            const otpHash = await bcrypt.hash(otp, salt);

            // Set expiry (10 minutes) and reset attempts
            user.resetOtpHash = otpHash;
            user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
            user.resetOtpAttempts = 0;
            user.resetOtpLastSent = now;
            await user.save();

            // Send OTP via email (HTML content)
            try {
                  const appName = process.env.APP_NAME || 'Voice of Rajkot';
                  const subject = `${appName} - Password Reset OTP`;
                  const html = `
                        <div style="font-family: Arial, sans-serif; color: #333;">
                              <h2>${appName} - Password Reset</h2>
                              <p>Your one-time OTP for resetting your password is:</p>
                              <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${otp}</div>
                              <p>This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
                              <p>If you did not request this, you can ignore this email.</p>
                        </div>
                  `;
                  await sendEmail(user.email, subject, html);
            } catch (mailErr) {
                  console.error('Error sending OTP email:', mailErr);
                  // Still return generic response to avoid leaking info
            }

            return res.status(200).json(genericResponse);
      } catch (error) {
            console.error('Request password reset error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Confirm OTP and reset password
// @route   POST /api/auth/password-reset/confirm
// @access  Public
export const confirmPasswordReset = async (req, res) => {
      try {
            const { email, otp, newPassword } = req.body;
            if (!email || !otp || !newPassword) {
                  return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
            }

            const user = await User.findOne({ email });
            // Use generic error to avoid enumeration
            const invalidMsg = { success: false, message: 'Invalid OTP or expired. Please request a new one.' };
            if (!user || !user.resetOtpHash || !user.resetOtpExpires) {
                  return res.status(400).json(invalidMsg);
            }

            // Check expiry
            if (new Date() > user.resetOtpExpires) {
                  // Clear stored OTP data
                  user.resetOtpHash = undefined;
                  user.resetOtpExpires = undefined;
                  user.resetOtpAttempts = 0;
                  user.resetOtpLastSent = undefined;
                  await user.save();
                  return res.status(400).json(invalidMsg);
            }

            // Limit attempts (e.g., 5)
            if ((user.resetOtpAttempts || 0) >= 5) {
                  // Clear OTP to force re-request
                  user.resetOtpHash = undefined;
                  user.resetOtpExpires = undefined;
                  user.resetOtpAttempts = 0;
                  user.resetOtpLastSent = undefined;
                  await user.save();
                  return res.status(429).json({ success: false, message: 'Too many attempts. Please request a new OTP.' });
            }

            const isOtpValid = await bcrypt.compare(otp, user.resetOtpHash);
            if (!isOtpValid) {
                  user.resetOtpAttempts = (user.resetOtpAttempts || 0) + 1;
                  await user.save();
                  return res.status(400).json(invalidMsg);
            }

            // OTP valid: reset password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;

            // Clear OTP fields
            user.resetOtpHash = undefined;
            user.resetOtpExpires = undefined;
            user.resetOtpAttempts = 0;
            user.resetOtpLastSent = undefined;
            await user.save();

            // Optional: notify user of password change (avoid if mailer unreliable)
            try {
                  const appName = process.env.APP_NAME || 'Voice of Rajkot';
                  await sendEmail(user.email, `${appName} - Password Changed`, `
                        <div style="font-family: Arial, sans-serif; color: #333;">
                              <p>Your password was successfully changed.</p>
                              <p>If this wasn’t you, please contact support immediately.</p>
                        </div>
                  `);
            } catch (mailErr) {
                  console.warn('Password change email failed:', mailErr?.message || mailErr);
            }

            return res.status(200).json({ success: true, message: 'Password reset successful' });
      } catch (error) {
            console.error('Confirm password reset error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Verify OTP only and issue short-lived reset token
// @route   POST /api/auth/password-reset/verify
// @access  Public
export const verifyPasswordReset = async (req, res) => {
      try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                  return res.status(400).json({ success: false, message: 'Email and OTP are required' });
            }

            const user = await User.findOne({ email });
            const invalidMsg = { success: false, message: 'Invalid OTP or expired. Please request a new one.' };
            if (!user || !user.resetOtpHash || !user.resetOtpExpires) {
                  return res.status(400).json(invalidMsg);
            }

            if (new Date() > user.resetOtpExpires) {
                  user.resetOtpHash = undefined;
                  user.resetOtpExpires = undefined;
                  user.resetOtpAttempts = 0;
                  user.resetOtpLastSent = undefined;
                  await user.save();
                  return res.status(400).json(invalidMsg);
            }

            if ((user.resetOtpAttempts || 0) >= 5) {
                  user.resetOtpHash = undefined;
                  user.resetOtpExpires = undefined;
                  user.resetOtpAttempts = 0;
                  user.resetOtpLastSent = undefined;
                  await user.save();
                  return res.status(429).json({ success: false, message: 'Too many attempts. Please request a new OTP.' });
            }

            const isOtpValid = await bcrypt.compare(otp, user.resetOtpHash);
            if (!isOtpValid) {
                  user.resetOtpAttempts = (user.resetOtpAttempts || 0) + 1;
                  await user.save();
                  return res.status(400).json(invalidMsg);
            }

            // OTP valid: issue short-lived JWT for password reset
            const resetToken = jwt.sign(
                  { id: user._id, purpose: 'password_reset' },
                  process.env.JWT_RESET_SECRET || (process.env.JWT_SECRET || 'fallback_secret_key_for_development'),
                  { expiresIn: '10m' }
            );

            // Clear OTP to prevent reuse
            user.resetOtpHash = undefined;
            user.resetOtpExpires = undefined;
            user.resetOtpAttempts = 0;
            user.resetOtpLastSent = undefined;
            await user.save();

            return res.status(200).json({ success: true, resetToken, message: 'OTP verified. You can now set a new password.' });
      } catch (error) {
            console.error('Verify password reset error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};

// @desc    Set new password using reset token
// @route   POST /api/auth/password-reset/set
// @access  Public
export const setNewPassword = async (req, res) => {
      try {
            const { resetToken, newPassword } = req.body;
            if (!resetToken || !newPassword) {
                  return res.status(400).json({ success: false, message: 'Reset token and new password are required' });
            }

            let decoded;
            try {
                  decoded = jwt.verify(
                        resetToken,
                        process.env.JWT_RESET_SECRET || (process.env.JWT_SECRET || 'fallback_secret_key_for_development')
                  );
            } catch (err) {
                  return res.status(401).json({ success: false, message: 'Invalid or expired reset token' });
            }

            if (!decoded || decoded.purpose !== 'password_reset' || !decoded.id) {
                  return res.status(401).json({ success: false, message: 'Invalid reset token' });
            }

            const user = await User.findById(decoded.id);
            if (!user) {
                  return res.status(404).json({ success: false, message: 'User not found' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;
            // Ensure any residual reset fields are cleared
            user.resetOtpHash = undefined;
            user.resetOtpExpires = undefined;
            user.resetOtpAttempts = 0;
            user.resetOtpLastSent = undefined;
            await user.save();

            try {
                  const appName = process.env.APP_NAME || 'Voice of Rajkot';
                  await sendEmail(user.email, `${appName} - Password Changed`, `
                        <div style="font-family: Arial, sans-serif; color: #333;">
                              <p>Your password was successfully changed.</p>
                              <p>If this wasn’t you, please contact support immediately.</p>
                        </div>
                  `);
            } catch (mailErr) {
                  console.warn('Password change email failed:', mailErr?.message || mailErr);
            }

            return res.status(200).json({ success: true, message: 'Password reset successful' });
      } catch (error) {
            console.error('Set new password error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
};