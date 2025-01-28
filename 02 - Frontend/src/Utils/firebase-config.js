/*firebase configuration*/ 
/* Import the functions you need from the SDKs you need */
import { initializeApp } from "firebase/app";
/* TODO: Add SDKs for Firebase products that you want to use */
/* https://firebase.google.com/docs/web/setup#available-libraries */

/* Your web app's Firebase configuration */
const firebaseConfig = {
  apiKey: "AIzaSyD6u_-cOmxCLyBw1Rhj__2sAPkkPywrqWY",
  authDomain: "campusconnect-a4d7c.firebaseapp.com",
  projectId: "campusconnect-a4d7c",
  storageBucket: "campusconnect-a4d7c.firebasestorage.app",
  messagingSenderId: "719672593192",
  appId: "1:719672593192:web:4577ce3be6550228ee5e1d"
};

/* Initialize Firebase */
const app = initializeApp(firebaseConfig);

export default app;
