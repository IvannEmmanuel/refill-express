// firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBHBYM0DZbZmiIft8p6D-5gKNDPdlFLP74",
  authDomain: "refill-express.firebaseapp.com",
  projectId: "refill-express",
  storageBucket: "refill-express.appspot.com", // Corrected storage bucket URL
  messagingSenderId: "834003681050",
  appId: "1:834003681050:web:99b6bda86c7e5ec875f6a3",
  measurementId: "G-JJF5SQ5Z8F",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(app); // Initialize Storage (or other Firebase services)

console.log("Firebase initialized:", app.name);

export { app, storage }; // Export app and storage directly
