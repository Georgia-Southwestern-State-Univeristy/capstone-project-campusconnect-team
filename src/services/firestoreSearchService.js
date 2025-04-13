import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

// Function to search for buildings in Firestore based on user input
export const searchBuildings = async (searchQuery) => {
    // If searchQuery is empty, return an empty array
    if (!searchQuery) return [];

    // Debugging
    console.log(`🔎 Searching for: ${searchQuery}`);

    // Reference to the "buildings" collection in Firestore
    const buildingsRef = collection(db, "buildings");
    // Initialize an empty array to store search results
    let results = []; // Use an array instead of a Map

    //first search by name or keyword match
    const keywordQuery = query(
        buildingsRef,
        // Searches for keywords in the "search_keywords" array field
        where("search_keywords", "array-contains", searchQuery.toLowerCase())
    );

    // Fetch documents that match the keyword query
    const keywordSnapshot = await getDocs(keywordQuery);
    // Loop through retrieved documents and add them to the results array
    keywordSnapshot.forEach((doc) => { 
        if (!results.some((b) => b.id === doc.id)) { // Avoid duplicates
            results.push({ id: doc.id, ...doc.data() });
        }
    });

    //debugging 
    console.log(`📌 Found ${results.length} results for keywords.`);

    //if no results, search by services offered
    
        //search by services offered, if no results found in the first search 
        const serviceQuery = query(
            buildingsRef,
            where("services_offered", "array-contains", searchQuery)  // Searches in the "services_offered" array field
        );

        // Fetch documents that match the services query
        const serviceSnapshot = await getDocs(serviceQuery);
        // Loop through retrieved documents and add them to the results array
        serviceSnapshot.forEach((doc) => { {/*serviceSnapshot is a collection of Firestore docs retrieved from database & loops through each doc (single building)*/ }
            {/*an array of objects, each object represents a building with its id & data (fields) -> checks if doc.id exists in results array*/ }
            if (!results.some((b) => b.id === doc.id)) { // Avoid duplicates -? doc.id exists more than once, don't add it again
                results.push({ id: doc.id, ...doc.data() }); // doc.id retrieves Firestire doc ID & spreads all fields from Firestore doc-> add the building to the results array
            }        
        });
    
    //debugging
    console.log(`✅ Final Results: ${results.length}`);
    //return array of matched buildings
    return results;

    
};
