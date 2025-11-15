import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true,
      },
      email: {
            type: String,
            required: true,
            unique: true,
      },
      password: {
            type: String,
            required: true,
      },
      mobileNumber: {
            type: String,
            required: false,
      },
      isPerformer: {
            type: Boolean,
            default: false,
      },
      isAdmin: {
            type: Boolean,
            default: false,
      },
      profileTags: [{
            type: String,
      }],
      oneLineDesc: {
            type: String,
      },
      workDescription: {
            type: String,
      },
      profilePhoto: {
            type: String,
      },
      isSampleAdded: {
            type: Boolean,
            default: false,
      },
      sample: {
            type: String,
      },
      // Secure password reset via OTP fields
      resetOtpHash: {
            type: String,
            required: false,
      },
      resetOtpExpires: {
            type: Date,
            required: false,
      },
      resetOtpAttempts: {
            type: Number,
            default: 0,
      },
      resetOtpLastSent: {
            type: Date,
            required: false,
      },
}, {
      timestamps: true,
});

export default mongoose.model("User", userSchema);