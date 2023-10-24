// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "property-experts-9c7e3.firebaseapp.com",
  projectId: "property-experts-9c7e3",
  storageBucket: "property-experts-9c7e3.appspot.com",
  messagingSenderId: "1002329532249",
  appId: "1:1002329532249:web:21930df07e1c6f9eecce48"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);