import User from "./models/user.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

const seedUsers = async () => {
      try {
            console.log("🔌 Attempting to connect to MongoDB...");
            await connectDB();

            const users = [
                  {
                        name: "John Doe",
                        email: "john@example.com",
                  },
                  {
                        name: "Jane Smith",
                        email: "jane@example.com",
                  },
                  {
                        name: "Bob Johnson",
                        email: "bob@example.com",
                  }
            ];

            console.log("📝 Seeding users:", users);
            await User.insertMany(users);
            console.log("✅ Users seeded successfully");

            // Verify the data was inserted
            const count = await User.countDocuments();
            console.log(`📊 Total users in database: ${count}`);

      } catch (error) {
            console.error("❌ Error seeding users:", error.message);
            console.log("💡 Make sure MongoDB is running or check your connection string");
      }
};

seedUsers();
