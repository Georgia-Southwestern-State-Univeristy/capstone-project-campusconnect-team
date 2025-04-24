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
  const KEYWORD_MAP = {
    hours: ["operating hours", "open", "close", "timing", "hours", "time", ],
    services: ["services", "assistance", "help", "offer", "services", "available"],
    contact: ["contact", "phone", "email", "reach"],
    location: ["where is", "located", "find", "address", "how do i get to", "directions", "where can", "location"],
    departments: ["department", "office", "team", "departments"],
    description: ["about", "info", "description", "information","details"],
};
 
 
function getAnswerFromBuilding(building, lowerCaseQuery) {
  let answer = "";
  for (const [key, keywords] of Object.entries(KEYWORD_MAP)) {
    for (const keyword of keywords) {
      if (lowerCaseQuery.includes(keyword)) {
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
              if (building.phone_num || building.email) {
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
 
          case "location":
            if (building.lat && building.lng) {
              answer = "<strong>Location: </strong>" + building.building_name;
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
 
 
const getAIResponseFromExtension = async (queryText) => {
  try {
    const docRef = await addDoc(collection(db, "extChatHistory"), {
      prompt: `${queryText} (Provide a concise response, no more than 3 sentences.)`,
      createTime: serverTimestamp(),
      max_tokens: 100,
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
    console.error("AI error:", error);
    return "There was an error processing your request.";
  }
};
 
 
export const searchBuildings = async (searchQuery) => {
  if (!searchQuery) return [];
  const buildingsRef = collection(db, "buildings");
  let results = [];
  const lowerCaseQuery = searchQuery.toLowerCase().trim().replace(/[?.,!]/g, "");
 
 
  const exactQuery = query(buildingsRef, where("search_keywords", "array-contains", lowerCaseQuery));
  const exactSnapshot = await getDocs(exactQuery);
  exactSnapshot.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));
 
 
  if (results.length === 0) {
    const queryWords = lowerCaseQuery.split(/\s+/);
    const fuzzyQuery = query(buildingsRef, where("search_keywords", "array-contains-any", queryWords.slice(0, 10)));
    const fuzzySnapshot = await getDocs(fuzzyQuery);
    fuzzySnapshot.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));
  }
 
 
  if (results.length > 0) {
    return results.map((b) => ({
      id: b.id,
      building_name: b.building_name,
      relevant_info: getAnswerFromBuilding(b, lowerCaseQuery) || "",
      isLocationQuery: false,
    }));
  }
 
 
  const aiResponse = await getAIResponseFromExtension(searchQuery);
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
 
 
  if (allEvents.length === 0) return [];
 
 
  const STOP_WORDS = new Set(["when", "does", "do", "is", "are", "a", "an", "the", "for", "to", "of"]);
 
 
  const queryWords = queryText
  .toLowerCase()
  .replace(/[?.,!]/g, "")
  .split(/\s+/)
  .filter((word) => !STOP_WORDS.has(word));
 
  let bestMatch = null;
  let highestMatchCount = 0;
 
  for (const event of allEvents) {
    let keywords = [];
 
    if (Array.isArray(event.keyword)) {
      keywords = event.keyword.map(k => k.toLowerCase());
    } else if (typeof event.keyword === 'string') {
      keywords = event.keyword.toLowerCase().split(/\s+/);
    }
 
   
    const matchCount = queryWords.reduce(
      (acc, word) => acc + (keywords.includes(word) ? 1 : 0),
      0
    );
 
    if (matchCount > highestMatchCount) {
      highestMatchCount = matchCount;
      bestMatch = {
        title: event.title,
        date: event.date,
        description: event.description || "No additional info",
        term: event.term,
        matchCount,
      };
    }
  }
  return bestMatch && highestMatchCount > 0 ? [bestMatch] : [];
   results;
};
 
 
export const generateAIExplanation = async (rawFact, contextType = "academic") => {
  const prompt = contextType === "academic"
    ? `Explain this academic event in a friendly, informative tone: ${rawFact}`
    : `Explain this campus information in a friendly, informative tone: ${rawFact}`;
 
 
  try {
    const docRef = await addDoc(collection(db, "extChatHistory"), {
      prompt,
      createTime: serverTimestamp(),
      max_tokens: 150,
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
    console.error("AI generation error:", error);
    return "";
  }
};
 