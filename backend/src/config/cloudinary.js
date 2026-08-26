import { v2 as cloudinary } from 'cloudinary';

export const connectCloudinary = () => {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
        console.warn("⚠️  Cloudinary config missing.");
        return;
    }
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log("✅ Cloudinary Configured");
};

export default cloudinary;
