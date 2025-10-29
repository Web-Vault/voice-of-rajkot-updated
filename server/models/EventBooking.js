import mongoose from "mongoose";

const eventBookingSchema = new mongoose.Schema({
      event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
      },
      user: {  // Add this field
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
      },
      ticketId: {
            type: String,
            required: true,
            unique: true,
      },
      username: {
            type: String,
            required: true,
      },
      email: {
            type: String,
            required: true,
      },
      mobileNumber: {
            type: String,
            required: true,
      },
      numberOfSeats: {
            type: Number,
            required: true,
      },
      membersName: [{
            type: String,
      }],
      isPerformer: {
            type: Boolean,
            default: false,
      },
      artType: {
            type: String,
      },
      duration: {
            type: Number,
            default: 5,
            max: 5,
      },
      totalAmount: {
            type: Number,
            required: true,
      },
      createdAt: {
            type: Date,
            default: Date.now,
      },
      updatedAt: {
            type: Date,
            default: Date.now,
      },
      paymentScreenshot: {
            public_id: {
                  type: String,
            },
            url: {
                  type: String,
            },
      },
      paymentStatus: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending',
      },
      rejectionReason: {
            type: String,
      },
});

// Generate a custom ticket ID before saving
eventBookingSchema.pre('save', function (next) {
      if (!this.ticketId) {
            // Format: VOR-EVENT-{eventId first 4 chars}-{random 6 digit number}
            const eventIdPrefix = this.event.toString().substring(0, 4);
            const randomNum = Math.floor(100000 + Math.random() * 900000);
            this.ticketId = `VOR-EVENT-${eventIdPrefix}-${randomNum}`;
      }
      next();
});

export default mongoose.model("EventBooking", eventBookingSchema); 