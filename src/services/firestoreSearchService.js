import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
 
 
// ------------------------
// Building Collection Support
// ------------------------
  const KEYWORD_MAP = { // Mapping keywords to building attributes
    hours: ["operating hours", "open", "close", "timing", "hours", "time", ],
    services: ["services", "assistance", "help", "offer", "service", "available"],
    contact: ["contact", "phone", "email", "reach"],
    location: ["where is", "located", "find", "address", "how do i get to", "directions", "where can", "location"],
    departments: ["department", "office", "team", "departments"],
    description: ["about", "info", "description", "information","details"],
};
 
 
function getAnswerFromBuilding(building, lowerCaseQuery) { // Function to extract relevant information from a building object based on the query
  let answer = "";
  for (const [key, keywords] of Object.entries(KEYWORD_MAP)) {    // Loop through each keyword category
    for (const keyword of keywords) {
      if (lowerCaseQuery.includes(keyword)) { // Check if the query contains any of the keywords
        switch (key) {
          case "hours":
            if (Array.isArray(building.operating_hours) && building.operating_hours.length > 0) {
              answer = "<strong>Operating Hours:</strong><br/>"; // Start with the header
 
              // Loop through each operating hour and format it with line breaks
              building.operating_hours.forEach((hour) => {
              answer += `${hour}<br/>`; // Add each hour on a new line
              });
            }
            break;
            case "services":
              if (building.services_offered) {
                answer = "<strong>Available Services:</strong><br/>"; // Start with the header
               
                // Loop through each service and add it with bullet points and line breaks
                building.services_offered.forEach((service) => {
                  answer += `• ${service}<br/>`; // Add bullet point and line break for each service
                });
              }
              break;
            case "contact": 
              if (building.phone_num || building.email) {// Check if either phone number or email exists
                answer = "<strong>Contact Information:</strong><br/>";
 
                // Open a div with left padding for indentation
                answer += `<div style="padding-left: 15px;">`;
 
                // Check if there are multiple phone numbers
                if (building.phone_num) {
                  answer += `Phone:<br/>`;
 
                // If phone_num is an array, loop through each number
                if (Array.isArray(building.phone_num)) {
                  building.phone_num.forEach((phone) => {
                  answer += `• ${phone}<br/>`; // line break for each phone number
                  });
                } else {
                  answer += `${building.phone_num}<br/>`; // single phone number
                }
                }
                answer += `<br/>`;
                // Check for email addresses
                if (building.email) {
                  answer += `Email:<br/>`;
 
                // If email is an array, loop through each email
                if (Array.isArray(building.email)) {
                  building.email.forEach((email) => {
                  answer += `${email}<br/>`; // line break for each email
                  });
                } else {
                  answer += `${building.email}<br/>`; // single email
                }
              }
              // Close the div
              answer += `</div>`;
            }
            break;
 
          case "location":// Check if the query is about location
            if (building.lat && building.lng) {
              answer = "<strong>Location: </strong>" + building.building_name;// Start with the building name
            }
            break;
            case "departments":
              if (building.departments) {
                answer = "Departments:<br/>"; // Start with the header
               
                // Loop through each department and format it nicely
                building.departments.forEach((dept) => {
                  answer += `<strong>${dept.name}:</strong><br/>${dept.description}<br/><br/>`; // Department name in bold and description with line breaks
                });
              }
              break;
          case "description":
            if (building.description) {
              answer = `<strong> Description:</strong>\n${building.description}`;
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
 
 
const getAIResponseFromExtension = async (queryText) => { // Function to get AI-generated response from Firestore
  try {
    const docRef = await addDoc(collection(db, "extChatHistory"), {// Add a new document to the extChatHistory collection
      prompt: `${queryText} (Provide a concise response, no more than 3 sentences.)`,// Prompt for the AI
      createTime: serverTimestamp(),// Timestamp for when the document was created
      max_tokens: 100,// Maximum tokens for the AI response
    });
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(
        docRef,
        (docSnapshot) => {
          const data = docSnapshot.data();
          if (data && data.response) {
            const cleanResponse = data.response
            .replace(/\*\*(.*?)\*\*/g, "$1")              // Remove Markdown bold
            .replace(/<\/?[^>]+(>|$)/g, "")                // Strip HTML tags
            .replace(/^[•*]\s?/gm, "")                     // Remove bullets
            .replace(/\n{2,}/g, "\n")                      // Normalize multiple newlines
            .trim();                                       // Trim whitespace
            resolve(cleanResponse);
            
            unsubscribe();
          }
        },
        (error) => reject(error)
      );
    });
  } catch (error) {
    console.error("AI error:", error);// Log any errors that occur
    return "There was an error processing your request.";// Return a default error message
  }
};
 
 
export const searchBuildings = async (searchQuery) => {// Function to search for buildings based on the query
  if (!searchQuery) return [];// If no query, return empty array
  const buildingsRef = collection(db, "buildings"); // Reference to the buildings collection
  let results = [];
  const lowerCaseQuery = searchQuery.toLowerCase().trim().replace(/[?.,!]/g, "");
 
 
  const exactQuery = query(buildingsRef, where("search_keywords", "array-contains", lowerCaseQuery));// Query for exact matches
  const exactSnapshot = await getDocs(exactQuery);// Execute the query
  exactSnapshot.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));
 
 
  if (results.length === 0) {// If no exact matches found, perform a fuzzy search
    const queryWords = lowerCaseQuery.split(/\s+/);// Split the query into words
    const fuzzyQuery = query(buildingsRef, where("search_keywords", "array-contains-any", queryWords.slice(0, 10)));// Query for fuzzy matches (up to 10 words)
    const fuzzySnapshot = await getDocs(fuzzyQuery);
    fuzzySnapshot.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));
  }
 
 
  if (results.length > 0) {// If results found, filter them based on the query
    return results.map((b) => ({// Map the results to a specific format
      id: b.id,
      building_name: b.building_name,// Building name
      relevant_info: getAnswerFromBuilding(b, lowerCaseQuery) || "",// Relevant information based on the query
      isLocationQuery: false,
    }));
  }
 
 
  const aiResponse = await getAIResponseFromExtension(searchQuery);// Get AI-generated response if no results found
  return [{ id: "ai-response", building_name: "AI Response", relevant_info: aiResponse }];
};
 
 
// ------------------------
// Academic Calendar Support
// ------------------------
export const searchAcademicData = async (queryText) => {
  const ref = doc(db, "WebScraperData", "AcademicCalendar");
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];
 
 
  const data = snap.data();
  const allEvents = [];
 
 
  // Aggregate all events from terms like Fall-2025, Spring-2025, etc.
  Object.entries(data).forEach(([term, events]) => {
    if (Array.isArray(events)) {
      events.forEach((event) => {
        allEvents.push({ ...event, term });
      });
    }
  });
 
 
  if (allEvents.length === 0) return [];// If no events found, return empty array
 
 
  const STOP_WORDS = new Set(["when", "does", "do", "is", "are", "a", "an", "the", "for", "to", "of"]);// Set of stop words to ignore in the query
 
 
  const queryWords = queryText  // Process the query text
  .toLowerCase()
  .replace(/[?.,!]/g, "")
  .split(/\s+/)
  .filter((word) => !STOP_WORDS.has(word));
 
  let bestMatch = null;
  let highestMatchCount = 0;
 
  for (const event of allEvents) {
    let keywords = [];
 
    if (Array.isArray(event.keyword)) {// Check if keywords are in an array
      keywords = event.keyword.map(k => k.toLowerCase());
    } else if (typeof event.keyword === 'string') {
      keywords = event.keyword.toLowerCase().split(/\s+/);
    }
 
   
    const matchCount = queryWords.reduce(
      (acc, word) => acc + (keywords.includes(word) ? 1 : 0),
      0
    );
 
    if (matchCount > highestMatchCount) {// If the current match count is higher than the previous highest
      highestMatchCount = matchCount;
      bestMatch = {
        title: event.title,
        date: event.date,
        description: event.description || "No additional info",// Description of the event
        term: event.term,
        matchCount,
      };
    }
  }
  return bestMatch && highestMatchCount > 0 ? [bestMatch] : [];// Return the best match if found, otherwise return empty array
};
 
 
export const generateAIExplanation = async (rawFact, contextType = "academic") => {   // Function to generate AI explanation based on the raw fact and context type (academic or building)
  const prompt = contextType === "academic"
    ? `Explain this academic event in a friendly, informative tone: ${rawFact}`
    : `Explain this campus information in a friendly, informative tone: ${rawFact}`;
 
 
  try {
    const docRef = await addDoc(collection(db, "extChatHistory"), {// Add a new document to the extChatHistory collection
      prompt,
      createTime: serverTimestamp(),
      max_tokens: 150,
    });
 
 
    return new Promise((resolve, reject) => {// Create a new promise to handle the AI response
      const unsubscribe = onSnapshot(
        docRef,
        (docSnapshot) => {
          const data = docSnapshot.data();
          if (data && data.response) {
            const cleanResponse = data.response
            .replace(/\*\*(.*?)\*\*/g, "$1")              // Remove Markdown bold
            .replace(/<\/?[^>]+(>|$)/g, "")                // Strip HTML tags
            .replace(/^[•*]\s?/gm, "")                     // Remove bullets
            .replace(/\n{2,}/g, "\n")                      // Normalize multiple newlines
            .trim();                                       // Trim whitespace             
            resolve(cleanResponse);
            unsubscribe();
          }
        },
        (error) => reject(error)// Handle any errors that occur during the snapshot
      );
    });
  } catch (error) {
    console.error("AI generation error:", error);// Log any errors that occur
    return "";
  }
};// Function to generate AI explanation based on the raw fact and context type (academic or building)
 