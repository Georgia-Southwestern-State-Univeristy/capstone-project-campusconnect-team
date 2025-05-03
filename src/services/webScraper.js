import axios from "axios";
import * as cheerio from "cheerio";
import { db } from "./firebase.js"; // Assuming firebase.js is properly configured
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";


// URL to scrape (modify this if you want to scrape a different page)
const url = "https://www.gsw.edu/academics/calendars/academic";


// Function to scrape data from the page
const scrapeData = async () => {
  try {
    // Fetch HTML from the URL
    const { data } = await axios.get(url);
    // Load the HTML using cheerio
    const $ = cheerio.load(data);


    // Array to store all academic events
    const academicEvents = [];


    // Loop through each table for Spring, Summer, and Fall terms
    $("table").each((element) => {
      const captionText = $(element).find("caption").text().trim();
      // Only target tables with specific term headers (e.g., Spring 2025, Summer 2025, etc.)
      if (captionText.includes("Spring") || captionText.includes("Summer") || captionText.includes("Fall")) {
        const termName = captionText;
        $(element).find("tr").each((i, row) => {
          const eventTitle = $(row).find("td:first-child").text().trim();   // Get the event title from the first column
          const eventDate = $(row).find("td:nth-child(2)").text().trim();// Get the event date from the second column
          const eventDetails = $(row).find("td:nth-child(3)").text().trim();// Get the event details from the third column
          if (eventTitle && eventDate) {
            academicEvents.push({
              title: eventTitle,
              date: eventDate,
              //description: eventDetails || "No additional info",
             // term: termName,
              timestamp: serverTimestamp(),
            });
          }
        });
      }
    });


    if (academicEvents.length > 0) {  // Check if any events were found
      await saveScrapedData(academicEvents);
    } else {
      console.log("No events found to scrape.");
    }
  } catch (error) {
    console.error("Error scraping data:", error);
  }
};


// Function to save scraped data to Firestore
const saveScrapedData = async (data) => {
  try {
    const scraperDocRef = doc(db, "WebScraperData", "AcademicCalendar");
    const docSnap = await getDoc(scraperDocRef);
    if (docSnap.exists()) {
      await updateDoc(scraperDocRef, {
        events: data,
      });
      console.log("✅ Scraped data updated in Firestore successfully!");
    } else {
      await setDoc(scraperDocRef, {
        events: data,
      });
      console.log("✅ Scraped data saved to Firestore successfully!");
    }
  } catch (error) {
    console.error("Error saving data to Firestore:", error);
  }
};


// Run the scraper function
scrapeData();

