import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

/**
 * Search buildings by user input query.
 * Matches building_name, search_keywords, or services_offered.
 */
export const searchBuildings = async (searchQuery) => {
    if (!searchQuery) return []; // Don't search if query is empty

    const buildingsRef = collection(db, "buildings");
    let results = [];

    // First, search by name or keywords
    const keywordQuery = query(
        buildingsRef,
        where("search_keywords", "array-contains", searchQuery.toLowerCase())
    );

    const keywordSnapshot = await getDocs(keywordQuery);
    keywordSnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
    });

    // If only one result, return immediately
    if (results.length === 1) {
        return results;
    }

    // If no results found, try searching by services_offered
    if (results.length === 0) {
        console.log(`🔍 No name matches for '${searchQuery}', searching by services...`);
        const serviceQuery = query(
            buildingsRef,
            where("services_offered", "array-contains", searchQuery)
        );

        const serviceSnapshot = await getDocs(serviceQuery);
        serviceSnapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
        });
    }

    // If still only one result, return it
    return results;
};
