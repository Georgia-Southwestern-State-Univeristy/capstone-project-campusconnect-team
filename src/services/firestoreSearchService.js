import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

/**
 * Search buildings by user input query.
 * Matches building_name or keywords stored in search_keywords array.
 */
export const searchBuildings = async (searchQuery) => {
    if (!searchQuery) return []; // Don't search if query is empty

    const buildingsRef = collection(db, "buildings");

    // Firestore query to search by name or keywords
    const q = query(
        buildingsRef,
        where("search_keywords", "array-contains", searchQuery.toLowerCase()) // Case-insensitive search
    );

    const querySnapshot = await getDocs(q);
    let results = [];
    
    querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
    });

    // Fallback: If no results found, try searching with 'building_name' using a range query
    if (results.length === 0) {
        console.log(`🔍 No exact matches for '${searchQuery}', trying partial match...`);
        const fallbackQuery = query(
            buildingsRef,
            where("building_name", ">=", searchQuery),
            where("building_name", "<=", searchQuery + "\uf8ff")
        );
        
        const fallbackSnapshot = await getDocs(fallbackQuery);
        fallbackSnapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
        });
    }

    return results;
};
