import { db } from "../services/firebase"; 
import { collection, getDocs } from "firebase/firestore";

export const testFirestoreConnection = async () => {
    try {
        const buildingsRef = collection(db, "buildings"); // Reference to Firestore collection
        const snapshot = await getDocs(buildingsRef);
        console.log("✅ Firestore is connected! Documents:", snapshot.docs.map(doc => doc.data()));
    } catch (error) {
        console.error("❌ Firestore connection failed:", error);
    }
};
