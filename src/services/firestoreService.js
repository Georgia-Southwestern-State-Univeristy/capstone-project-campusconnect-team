// This function `updateDocumentsWithId` updates all documents in the "buildings" collection of a Firestore database.
// It adds an `id` field to each document, setting its value to the document's ID.
// This is done using a batch operation for efficiency, which allows multiple updates to be committed at once.


import { db } from "./firebase"; 
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
// Function to update all documents in the "buildings" collection by adding an "id" field
export const updateDocumentsWithId = async () => {
    // Reference to the "buildings" collection in Firestore
    const buildingsRef = collection(db, "buildings"); 
    // Fetch all documents from the "buildings" collection
    const snapshot = await getDocs(buildingsRef);

    // Create a Firestore batch operation (used to update multiple documents efficiently)
    const batch = writeBatch(db); 

    //Iterate through each document in the collection
    snapshot.forEach((document) => {
        // Create a document reference for the current document
        const docRef = doc(db, "buildings", document.id);
        // Add an "id" field to the document, setting it to its document ID
        batch.update(docRef, { id: document.id }); // Update in batch
    });

    // Execute all updates in a single commit (efficient bulk update)
    await batch.commit(); 
    // Log a success message to the console
    console.log("✅ All buildings updated with 'id' field.");
};
