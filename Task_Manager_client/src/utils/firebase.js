// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLhAD6znJFp9nDaRpaBxsnIeJW0hdflRM",
  authDomain: "task-manager-7d732.firebaseapp.com",
  projectId: "task-manager-7d732",
  storageBucket: "task-manager-7d732.firebasestorage.app",
  messagingSenderId: "516798434164",
  appId: "1:516798434164:web:089b18eaf658e657e5fa21",
  measurementId: "G-LNM0T0835P"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

