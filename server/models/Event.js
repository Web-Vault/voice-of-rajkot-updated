import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true,
      },
      dateTime: {
            type: Date,
            required: true,
      },
      venue: {
            type: String,
            required: true,
      },
      description: {
            type: String,
            required: true,
      },
      performers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
      }],
      totalSeats: {
            type: Number,
            required: true,
      },
      bookedSeats: {
            type: Number,
            default: 0,
      },
      price: {
            type: Number,
            required: true,
      },
      image: {
            type: String,
      },
      createdAt: {
            type: Date,
            default: Date.now,
      },
      updatedAt: {
            type: Date,
            default: Date.now,
      },
});

export default mongoose.model("Event", eventSchema);