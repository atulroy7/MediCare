import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.warn("⚠️  MONGO_URI not found in environment variables. Running in in-memory fallback mode.");
            return;
        }
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        console.warn("⚠️  Server will continue running with in-memory fallback handlers.");
    }
};
