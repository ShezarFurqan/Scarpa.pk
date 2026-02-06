import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC3OeOimJCINO8kWQuStwL7Cp8hrOXxU10",
  authDomain: "rock-climb-studio.firebaseapp.com",
  projectId: "rock-climb-studio",
  storageBucket: "rock-climb-studio.firebasestorage.app",
  messagingSenderId: "690638916055",
  appId: "1:690638916055:web:9ad441700b31eb80942392"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
