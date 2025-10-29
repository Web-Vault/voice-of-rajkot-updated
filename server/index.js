import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const app = express();

// Serve QR codes statically
app.use("/qrcodes", express.static(path.join(process.cwd(), "public", "qrcodes")));

connectDB();

// Middleware
app.use(cors({
      origin: ['http://localhost:3000', 'https://rhythm-of-heart-app.onrender.com'],
      credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
      .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log("✅ MongoDB Connected Successfully!"))
      .catch((err) => {
            console.error("❌ MongoDB Connection Error:", err);
            process.exit(1);
      });


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/posts', postRoutes);

// Default Route
app.get("/", (req, res) => {
      res.status(200).json({ message: "🚀 API is running..." });
});

// 404 Error Handling Middleware
app.use((req, res, next) => {
      res.status(404).json({ success: false, message: "❌ Route Not Found!" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
