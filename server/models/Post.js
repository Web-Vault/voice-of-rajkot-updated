import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
      heading: {
            type: String,
            required: true,
      },
      content: {
            type: String,
            required: true,
      },
      tags: [{
            type: String,
      }],
      likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
      }],
      author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
});

export default mongoose.model("Post", postSchema);