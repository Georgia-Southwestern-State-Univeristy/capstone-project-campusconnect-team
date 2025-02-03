// This function `updateDocumentsWithId` updates all documents in the "buildings" collection of a Firestore database.
// It adds an `id` field to each document, setting its value to the document's ID.
// This is done using a batch operation for efficiency, which allows multiple updates to be committed at once.
import { db } from "./firebase"; 
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";

export const updateDocumentsWithId = async () => {
    const buildingsRef = collection(db, "buildings"); 
    const snapshot = await getDocs(buildingsRef);

    const batch = writeBatch(db); // Batch operation for efficiency

    snapshot.forEach((document) => {
        const docRef = doc(db, "buildings", document.id);
        batch.update(docRef, { id: document.id }); // Update in batch
    });

    await batch.commit(); // Execute all updates at once
    console.log("✅ All buildings updated with 'id' field.");
};
