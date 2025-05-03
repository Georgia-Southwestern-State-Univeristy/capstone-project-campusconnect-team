import { db } from "../services/firebase"; // Import the Firestore database instance
import { collection, getDocs } from "firebase/firestore";// Import Firestore functions

export const testFirestoreConnection = async () => {// Function to test Firestore connection
    try {
        const buildingsRef = collection(db, "buildings"); // Reference to Firestore collection
        const snapshot = await getDocs(buildingsRef);
        console.log("✅ Firestore is connected! Documents:", snapshot.docs.map(doc => doc.data()));
    } catch (error) {
        console.error("❌ Firestore connection failed:", error);
    }
};
