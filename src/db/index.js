import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const options = {
      maxPoolSize: 20,     // 🧵 Max concurrent connections in the pool
      minPoolSize: 5,      // 🛌 Minimum connections kept alive
      serverSelectionTimeoutMS: 5000, // 🕐 Timeout if server is not responsive
    };
    await mongoose.connect(process.env.MONGO_URI,options);
    console.log("✅ MongoDB Connected");
    mongoose.set('debug', true);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit if connection fails
  }
};

export default connectDB;