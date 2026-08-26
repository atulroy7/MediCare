import admin from 'firebase-admin';

export const initFirebase = () => {
    if (!process.env.FIREBASE_PROJECT_ID) {
        console.warn("⚠️  FIREBASE_PROJECT_ID not found. Firebase Admin initialization skipped.");
        return;
    }

    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Handle newlines in private key securely
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
        console.log("✅ Firebase Admin Initialized");
    } catch (error) {
        console.error("❌ Firebase Admin Initialization Error:", error.message);
    }
};

export default admin;
