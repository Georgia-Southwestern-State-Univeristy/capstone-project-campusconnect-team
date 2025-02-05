import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const searchBuildings = async (searchQuery) => {
    if (!searchQuery) return [];

    const buildingsRef = collection(db, "buildings");
    let results = [];

    const keywordQuery = query(
        buildingsRef,
        where("search_keywords", "array-contains", searchQuery.toLowerCase())
    );

    const keywordSnapshot = await getDocs(keywordQuery);
    keywordSnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
    });

    if (results.length === 0) {
        const serviceQuery = query(
            buildingsRef,
            where("services_offered", "array-contains", searchQuery)
        );

        const serviceSnapshot = await getDocs(serviceQuery);
        serviceSnapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
        });
    }

    return results;
};
