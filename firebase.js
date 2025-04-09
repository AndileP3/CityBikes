// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNL43XZofpLfWlnWW-0suoLbYL4QzD0CA",
  authDomain: "bike-system-bb362.firebaseapp.com",
  projectId: "bike-system-bb362",
  storageBucket: "bike-system-bb362.firebasestorage.app",
  messagingSenderId: "910355578427",
  appId: "1:910355578427:web:ca8a4931dc89b9664ce61e",
  measurementId: "G-XNRSFGYYGX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);