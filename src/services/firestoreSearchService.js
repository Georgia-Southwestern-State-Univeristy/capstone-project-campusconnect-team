import { db } from "./firebase";
import { collection, getDocs, query, where, addDoc,
    serverTimestamp,
    onSnapshot, } from "firebase/firestore";

// Define keyword mappings for different query topics
const KEYWORD_MAP = {
    "hours": ["operating hours", "open", "close", "timing", "hours"],
    "services": ["services", "assistance", "help", "offer"],
    "contact": ["contact", "phone", "email", "reach"],
    "location": ["where is", "located", "find", "address", "how do i get to", "directions"],
    "departments": ["department", "office", "team"],
    "description": ["about", "info", "description"],
  };

  // Helper to extract a formatted answer from a building document based on the query
function getAnswerFromBuilding(building, lowerCaseQuery) {
    let answer = "";
    for (const [key, keywords] of Object.entries(KEYWORD_MAP)) {
      for (const keyword of keywords) {
        if (lowerCaseQuery.includes(keyword)) {
          switch (key) {
            case "hours":
              if (Array.isArray(building.operating_hours) && building.operating_hours.length > 0) {
                answer = "Operating Hours: " + building.operating_hours.join(", ");
              }
              break;
            case "services":
              if (building.services_offered) {
                answer = "Available Services: " + building.services_offered.join(", ");
              }
              break;
            case "contact":
              if (building.phone_num || building.email) {
                answer = "Contact Information:";
                if (building.phone_num) {
                  answer += " Phone: " + (Array.isArray(building.phone_num) ? building.phone_num.join(", ") : building.phone_num);
                }
                if (building.email) {
                  answer += " Email: " + (Array.isArray(building.email) ? building.email.join(", ") : building.email);
                }
              }
              break;
            case "location":
              if (building.lat && building.lng) {
                answer = "Location: " + building.building_name;
              }
              break;
            case "departments":
              if (building.departments) {
                answer = building.departments.map(dept => `${dept.name}: ${dept.description}`).join("\n");
              }
              break;
            case "description":
              if (building.description) {
                answer = building.description;
              }
              break;
            default:
              break;
          }
          if (answer) return answer;
        }
      }
    }
    return answer;
  }

  // Writes a prompt document to extChatHistory and waits for the Gemini AI extension to add a response.
const getAIResponseFromExtension = async (query) => {
    try {
      // Write the prompt document.
      const docRef = await addDoc(collection(db, "extChatHistory"), {
        prompt: `${query} (Provide a concise response, no more than 3 sentences.)`,
        createTime: serverTimestamp(),
        max_tokens: 100,
      });
      // Return a promise that resolves when the document gets a response.
      return new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(
          docRef,
          (docSnapshot) => {
            const data = docSnapshot.data();
            if (data && data.response) {
              resolve(data.response);
              unsubscribe();
            }
          },
          (error) => {
            reject(error);
          }
        );
      });
    } catch (error) {
      console.error("Error generating AI response:", error);
      return "There was an error processing your request. Please try again later.";
    }
  };

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
    let isLocationQuery = false;

    const lowerCaseQuery = searchQuery.toLowerCase().trim().replace(/[?.,!]/g, "");

    // Check if the query contains any keyword from KEYWORD_MAP
    for (const [category, keywords] of Object.entries(KEYWORD_MAP)) {
      if (keywords.some(keyword => lowerCaseQuery.includes(keyword))) {
          isLocationQuery = true;
          break; // Stop checking once a match is found
      }
  }

  // 1. Search by exact match on search_keywords field. NAVIGATES TO 2nd pg IF 1 MATCH FOUND ✅
    const exactQuery = query(
        buildingsRef,
        // Searches for keywords in the "search_keywords" array field
        where("search_keywords", "array-contains", lowerCaseQuery) //ADD exact services_offered!
    );

    // Fetch documents that match the keyword query
    const exactSnapshot = await getDocs(exactQuery);
    // Loop through retrieved documents and add them to the results array
    exactSnapshot.forEach((doc) => { {/*exactSnapshot is a collection of Firestore docs retrieved from database & loops through each doc (single building)*/ }
        if (!results.some((b) => b.id === doc.id)) { // Avoid duplicates
            results.push({ id: doc.id, ...doc.data() });
        }
    });

    //debugging 
    console.log(`📌 Exact keyword match results: ${results.length}`);

    // 2. If no exact match, perform fuzzy search using array-contains-any. SHOWS DROPDOWN FOR ALL MATCHES (1 or more) ✅
    if (results.length === 0) {
        const queryWords = lowerCaseQuery.split(/\s+/);
        if (queryWords.length > 0) {
            const fuzzyQuery = query(
                buildingsRef,
                where("search_keywords", "array-contains-any", queryWords.slice(0, 10))
            );
            const fuzzySnapshot = await getDocs(fuzzyQuery);
            fuzzySnapshot.forEach((doc) => {
                if (!results.some(b => b.id === doc.id)) {
                    results.push({ id: doc.id, ...doc.data() });
                }
            });
            console.log(`🔦 Fuzzy keyword match results: ${results.length}`);
        }
    }

    // 3. If still no results, try matching the services_offered field though fuzzy search. 
    //Where is testing? shows dropdown (1 or more matches) ✅
    if (results.length === 0) {
        const queryWords = lowerCaseQuery.split(/\s+/);
        if (queryWords.length > 0) {
            const serviceQuery = query(
                buildingsRef,
                where("services_offered", "array-contains-any", queryWords.slice(0, 10))
            );
            const serviceSnapshot = await getDocs(serviceQuery);
            serviceSnapshot.forEach((doc) => {
                if (!results.some(b => b.id === doc.id)) {
                    results.push({ id: doc.id, ...doc.data() });
                }
            });
            console.log(`💡 Fuzzy service match results: ${results.length}`);
        }
    }

    // 4. If results found, try to derive an answer using KEYWORD_MAP. ✅
    if (results.length > 0) {
        let derivedResults = results.map((building) => ({
            id: building.id,
            building_name: building.building_name,
            relevant_info: getAnswerFromBuilding(building, lowerCaseQuery) || "", 
            isLocationQuery,  // Ensure location flag is included
        }));

        // Log the number of final results
        console.log(`✅ Final Results (derived answer): ${derivedResults.length}`);

        return derivedResults;
    }

    // 5. If no building data is found, use the Gemini extension to generate an AI response.
    const aiResponse = await getAIResponseFromExtension(searchQuery);
    console.log(`✅ Final Results (AI response): 1`);
    return [
        {
        id: "ai-response",
        building_name: "AI Response",
        relevant_info: aiResponse,
        isLocationQuery, // Return the flag with AI response as well
        },
    ];
};