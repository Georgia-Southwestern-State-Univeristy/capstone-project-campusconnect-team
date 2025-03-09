// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDA89ysQ-L37eusY2iVLqKREuBUklHAG7U",
  authDomain: "campusconnect-capstone.firebaseapp.com",
  projectId: "campusconnect-capstone",
  storageBucket: "campusconnect-capstone.appspot.com",
  messagingSenderId: "652800235257",
  appId: "1:652800235257:web:0009df955367fca89d3428",
  measurementId: "G-QXTTR3C0SN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
