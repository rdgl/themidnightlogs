import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.dbUrl) {
      console.error("DB URL missing: set 'dbUrl' in your .env file");
    }
    await mongoose.connect(process.env.dbUrl);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;