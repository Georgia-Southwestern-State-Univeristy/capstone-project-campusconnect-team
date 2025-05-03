
import puppeteer from "puppeteer";
import { db } from "./firebase.js";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";


// Utility: Wait for a given number of milliseconds
const waitForTimeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));


/**
 * Save data to Firestore under WebScraperData/docId (overwrites the document)
 */
const saveToFirestore = async (docId, data) => {
  try {
    const docRef = doc(db, "WebScraperData", docId);
    await setDoc(docRef, data);
    console.log(`✅ Document written: ${docId}`);
  } catch (err) {
    console.error(`❌ Error saving ${docId}:`, err);
  }
};


/**
 * Scrape the Admissions page.
 * (This function is included for reference.)
 */
const scrapeAdmissions = async (page) => {
  try {
    console.log("🚀 Loading Admissions page...");
    await page.goto("https://www.gsw.edu/admissions/", { waitUntil: "load", timeout: 30000 });
    await waitForTimeout(10000); // Wait 10 seconds for dynamic content
    await page.screenshot({ path: "admissions_page.png", fullPage: true });
    console.log("📸 Saved: admissions_page.png");


    // Extract text blocks from the main content area
    const sections = await page.evaluate(() => {
      const mainContent = document.querySelector("main") || document.body;
      const paragraphs = Array.from(mainContent.querySelectorAll("p"));
      return paragraphs.map(p => p.textContent.trim()).filter(t => t.length > 30);
    });


    if (sections.length > 0) {
      console.log(`✅ Admissions: Found ${sections.length} text blocks.`);
      await saveToFirestore("AdmissionsPage", { sections, scrapedAt: serverTimestamp() });
    } else {
      console.log("❗ No admissions content found.");
    }
  } catch (err) {
    console.error("🔥 Admissions Scraper Error:", err);
  }
};


/**
 * Helper: Automatically scroll down the page to load lazy content.
 */
const autoScroll = async (page) => {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 300);
    });
  });
};


/**
 * Scrape the Community Events listing page.
 * First, try extracting event cards using several selectors.
 * If none are found, use a fallback method.
 * For each event, open the detail page and extract additional info.
 */
const scrapeCommunityEvents = async (browser, page) => {
  try {
    console.log("🚀 Loading Community Events listing...");
    await page.goto("https://www.gsw.edu/community/events", { waitUntil: "load", timeout: 30000 });
    await autoScroll(page);
    await waitForTimeout(5000); // Additional wait after scrolling
    await page.screenshot({ path: "events_page.png", fullPage: true });
    console.log("📸 Saved: events_page.png");


    // Try several selectors for event cards on the listing page.
    let eventCards = await page.evaluate(() => {
      let cards = Array.from(document.querySelectorAll(".event, .event-card, .columns"));
      // Fallback: try article tags if no matching elements found.
      if (!cards.length) {
        cards = Array.from(document.querySelectorAll("article"));
      }
      return cards.map(card => {
        const title = card.querySelector("h3, .event-title, .card-title")?.textContent.trim() || "";
        const link = card.querySelector("a")?.href || "";
        const shortDesc = card.querySelector("p")?.textContent.trim() || "";
        return (title && link) ? { title, shortDesc, link } : null;
      }).filter(item => item !== null);
    });


    // Fallback: if no event cards found, try extracting all anchor tags with href containing '/admissions/visit/'.
    if (!eventCards.length) {
      console.log("❗ No event cards found with primary selectors. Using fallback method...");
      eventCards = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll("a"));
        return anchors
          .filter(a => a.href && a.href.includes("/admissions/visit/"))
          .map(a => ({
            title: a.textContent.trim(),
            link: a.href,
            shortDesc: ""
          }));
      });
    }


    console.log(`✅ Found ${eventCards.length} event cards in the listing.`);
    if (!eventCards.length) {
      console.log("❗ No event cards were found. Please inspect events_page.png and adjust selectors.");
      return;
    }


    // For each event card, open the detail page and scrape additional info.
    const allEvents = [];
    for (let i = 0; i < eventCards.length; i++) {
      const { title, shortDesc, link } = eventCards[i];
      console.log(`🔎 Scraping detail page for event #${i + 1}: ${title}`);
      const detailData = await scrapeEventDetail(browser, link);
      allEvents.push({
        title,
        shortDesc,
        link,
        ...detailData,
        scrapedAt: new Date().toISOString()
      });
    }


    if (allEvents.length > 0) {
      console.log(`✅ Community Events: Extracted ${allEvents.length} events.`);
      await saveToFirestore("CommunityEvents", { events: allEvents, scrapedAt: serverTimestamp() });
    } else {
      console.log("❗ No events found after detail scraping.");
    }
  } catch (err) {
    console.error("🔥 Community Events Scraper Error:", err);
  }
};


/**
 * Scrape details from an individual event's detail page.
 * This function opens the detail page, extracts all paragraph texts,
 * and searches for a sentence that includes keywords like "campus", "location", or "located at".
 */
const scrapeEventDetail = async (browser, url) => {
  const newPage = await browser.newPage();
  const detailData = {
    date: "",
    time: "",
    location: "",
    fullDescription: ""
  };


  try {
    await newPage.goto(url, { waitUntil: "load", timeout: 30000 });
    await waitForTimeout(5000); // Wait for dynamic content


    const result = await newPage.evaluate(() => {
      // Extract all paragraphs from the page.
      const paragraphs = Array.from(document.querySelectorAll("p")).map(p => p.textContent.trim());
      const fullDesc = paragraphs.join("\n");
     
      // Search for a paragraph that contains keywords indicating a location.
      let locationText = "";
      for (const text of paragraphs) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes("campus") || lowerText.includes("location") || lowerText.includes("located at")) {
          locationText = text;
          break;
        }
      }
     
      // For date and time, attempt to extract using common selectors.
      const dateElem = document.querySelector(".date-time, .event-date, .date");
      const timeElem = document.querySelector(".time, .event-time");
     
      return {
        date: dateElem ? dateElem.textContent.trim() : "",
        time: timeElem ? timeElem.textContent.trim() : "",
        location: locationText,
        fullDescription: fullDesc
      };
    });


    detailData.date = result.date;
    detailData.time = result.time;
    detailData.location = result.location;
    detailData.fullDescription = result.fullDescription;
  } catch (err) {
    console.error(`❌ Error scraping detail page ${url}:`, err);
  } finally {
    await newPage.close();
  }
  return detailData;
};


/**
 * Main function: Launch Puppeteer and run the scrapers sequentially.
 */
const runScrapers = async () => {
  console.log("🚀 Launching headless browser with Puppeteer...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();


  // Scrape Admissions page (for reference)
  await scrapeAdmissions(page);
  // Scrape Community Events listing and detail pages
  await scrapeCommunityEvents(browser, page);


  await browser.close();
  console.log("✅ Scraping completed with Puppeteer.");
};

// Run the scrapers
runScrapers(); 



