Campus Connect is an interactive, AI-assisted user-friendly web application designed to help navigate campus buildings. The website objectives to make navigating campus more convenient, and accessible. Its primary audience includes students, particularly freshmen and transfer students, new faculty and staff members, and parents or guardians visiting. By providing clear guidance and enhancing accessibility, such as merging live location tracking, dynamic building info, and smart search tools into a seamless experience tailored to students, faculty, staff, and visitors alike that can easily discover and navigate a wide range of campus resources. 



# Technology Stack: 
## Frontend
  * React.js: Used for building the web app's user interface (UI). React's component-based structure allows us to create reusable components for the homepage, map navigation, building information, and destination pages.
  * Google Maps API: Powers the interactive map that displays campus buildings, navigation routes, and clickable markers. It also provides features like route direction and location sharing for a seamless user experience.
  * Tailwind CSS:Enables rapid UI styling with utility-first CSS classes, ensuring the app looks modern, is responsive, and adapts well to different screen sizes and devices.
    
## Backend
  * Firebase Firestore:Used to store data related to campus buildings, such as names, descriptions, contact information, and office hours. Firestore's real-time syncing allows updates (e.g., parking availability or building status) to reflect instantly in the app. 
      
## Tools
  * Git/GitHub:Used for version control and collaborative development. The team tracks progress, organizes sprints, and manages codebase updates efficiently using GitHub's project boards and branching features.
  * Visual Studio Code: The primary development environment, enhanced by extensions for React, Tailwind, and Firebase to streamline the coding process.
  * Github projects:A project management tool used to divide tasks, assign roles, and ensures timely completion of sprints.
  * Google Cloud Console: Interface to manage Firebase services like Firestore, Authentication, and Hosting. Also used for API key management and monitoring analytics.
  * Git Bash: Command-line tool used to run Git commands, push/pull changes, and manage branches in Windows environments.

      
# Programming Languages:
  * JavaScript: TThe primary language used for both frontend interface logic and direct database communication. React handles the dynamic user interface, while Firebase’s JavaScript SDK allows the app to read/write Firestore data, handle authentication, and interact with AI services — all securely from the client side.


       
# How the Tools Work Together: 
## Frontend Workflow
  * React.js: React builds the app's user interface. Each page (home, navigation/building info, map, destination) is a React component. React interacts with the backend to fetch and display dynamic data, such as building descriptions and navigation routes. It handles user input (e.g., searches, button clicks) and sends requests to the backend for processing.
    
  * Google Maps API: Embedded within the React app, Google Maps provides the interactive map interface. It displays campus locations as markers, highlights routes for walking or driving, and dynamically updates navigation paths based on the user’s current location.
    
  * Tailwind CSS: Tailwind handles the app’s styling and layout. Its utility-first classes ensure the app is responsive (mobile-friendly) and visually appealing. The styling is tightly integrated with React components to ensure consistency.
      
## Backend Workflow      
  * Firebase Firestore: CampusConnect uses Firestore as a real-time NoSQL database to store data related to campus buildings, including names, descriptions, operating hours, services, and geographical coordinates. The frontend (React) communicates directly with Firestore using the Firebase SDK — no backend server is required. This allows seamless and secure data retrieval in JSON format. Firestore’s real-time syncing ensures that updates, such as changes to department hours or location info, are immediately reflected in the UI without requiring a manual page refresh.
          
  * FirestoreSearchService: handles keyword and service-based search queries.

  * Gemini AI via Firestore: AI-powered answers are generated through a Firestore collection (extChatHistory) that triggers external processing via Gemini. The frontend writes a user query to the collection, and when a response is generated, it’s synced back to the app in real-time using onSnapshot() listeners.



    
# Development and Collaboration Tools: 
  ## Git/GitHub:
   * Git tracks code changes, and GitHub acts as the repository for collaboration.Team members work on different features in separate branches, merge completed work into the main branch, and resolve conflicts efficiently. The project board in GitHub organizes tasks and tracks sprint progress.
   * Git **Bash** used for local Git commands.
   * GitHub Projects organizes sprints and tasks.
  ## Visual Studio Code:
   * VS Code is the primary development environment. Developers write code, debug issues, and use extensions for React, Tailwind, and Firebase to speed up development.
  ## Lucidchart:
   * Used during the planning phase to create wireframes, database schemas, and user flow diagrams.Provides a clear blueprint for developers, reducing confusion during implementation.
  ## Google Cloud Console:
   * Generate API keys for Google Maps, monitor database access, and review analytics.
 




# Features and Functionality:
 
## Real-Time Updates:
   * Provides up-to-date information about abnormal operations such as blockages in traffic and parking availability using color-coded areas. Integrates real-time data from campus services to ensure accuracy.
   * Syncs with Firestore for real-time data updates
 
## Smart Search and Recommendations:
   * Intelligently matches keywords to buildings, services, and departments using a custom Firestore search service. Falls back to Gemini AI if no matches found.

## AI Assistant: 
  * A chatbot and search fallback powered by Gemini. Helps users find answers using natural language, even if building names aren't known.
 
## Detailed Building Information:
   * Side Bar displaying building pictures, descriptions, office hours, and contact details (phone number, email, services offered). Distance to the selected building shown in feet for driving and footsteps for walking.
   * Department information/details is shown with services, hours, & contact info. 
 
## Navigation Assistance:
   * "Get Directions" button launches travel options.
   * Travel mode toggle (Walking/Driving).
   * "Go" button triggers turn-by-turn Google route..
 
## Location Sharing Services:
   * Pop-up prompt for enabling location sharing to provide accurate routing. Destination Reached pop-up notification with options to return to the Welcome Screen or initiate a new search.

## Responsive Design	Mobile-first layouts:  
   * Clean collapsible UI, smaller buttons on mobile, and adaptive components for all screen sizes.
     
## Chatbox Support: 
   * Always-available assistant for live help. Chatbot responds to queries and guides users through location services.
     
## Department & Pricing Info: 
   * Includes toggles to view internal department details. Dining hall pricing and custom formatting supported.


# Project Directory Structure

├── node_modules/              # Node.js dependencies (auto-generated)
├── public/                    # Public assets
│   ├── index.html             # Main HTML file
│   └── sophia-aparicio-malacara.JPG # Public image asset
├── src/                       # Source code for the React app
│   ├── pages/                 # Page components
|   |   |── App.css            # Global styles for map container layout and mobile responsiveness
│   │   ├── About.js           # About the CampusConnect app
│   │   ├── Building.js        # Detailed building info with map, hours, services, and department toggles
│   │   ├── chatbox.js         # AI-powered chatbot with Firestore + Gemini response support
│   │   ├── Contact.js         # Contact information page
│   │   ├── MapNavigation.js   # Reusable component for showing user-to-building navigation with directions
│   │   ├── NotFound.js        # 404 page for invalid routes
│   │   └── Welcome.js         # Landing page with search input and intro to the app
│   ├── services/              # Services for backend integration
│   │   ├── auth.js            # Authentication service (if used)
│   │   ├── firebase.js        # Firebase configuration and setup
│   │   ├── firestore.js       # Firestore database read/write functions
│   │   ├── firestoreSearchService.js # Main building search logic and keyword matching
│   │   └── firestoreService.js # Utility functions for Firestore (e.g., AI querying)
│   ├── utils/                 # Utility functions and helpers
│   │   └── firestoreTest.js   # Testing utilities for Firestore integration
│   ├── App.js                 # Main React app layout with routing
│   └── index.js              # Entry point for the React app (root rendering)
├── .gitignore                 # Files and directories to ignore in Git
├── package-lock.json          # Lock file for exact dependency versions
├── package.json               # Project dependencies, scripts, and metadata
└── README.md                  # Project documentation and setup instructions


### Key Features:
- The `src/` folder contains the main React application code.
- The `pages/` directory includes components for the **Welcome**, **Building**, **About**, **Contact**, and **NotFound** pages.
- The `services/` directory houses all backend-related services, such as Firebase integration, authentication, and Firestore operations.
- The `utils/` folder contains utility functions, including testing utilities for Firestore.
- Fully mobile responsive UI:
   - Departments collapse cleanly on mobile.
   - Navigation, buttons, and map layouts adjust to screen size.
- Google Maps integration with:
   - Live directions from user location.
   - Travel mode switching (walking/driving).
   - External link to Google Maps app/site.
- AI Assistance built-in:
   - If a user query doesn’t match any building, Gemini AI provides a helpful summary.
   - Chatbot combines search and AI for real-time help.


# Installation and Setup Instructions
### 1. Set up GitHub Environment

 ```sh
 git config --global user.name "Your Name"
 git config --global user.email "your.email@example.com"
 
 git clone https://github.com/Georgia-Southwestern-State-Univeristy/capstone-project-campusconnect-team.git
 
 cd capstone-project-campusconnect-team
 git pull origin main
 git checkout -b branch_name
 git branch
```
### 2.Intialize Git 
 ```sh
git init
git checkout -b branch_name
git branch

git add .
git commit -m "Initial project structure"
git push -u origin branch_name
```
### 3. Set up Dependencies
```sh
npm init -y
npm install react
npm install react-dom
npm install react-router-dom
npm install firebase
```
ensure package.json contains: 
```sh
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test"
}
```
Implement Tailwind CSS by adding it as a CDN in the <head> section of index.html.

Run the application:
```sh
npm start
```

# Description of Pages:

## `/src/pages`:

### `Welcome.js`:
   * A landing page of the CampusConnect web application. It provides users with an entry point to search for buildings and services on campus efficiently. This page is designed to be user-friendly and intuitive, allowing students, faculty, and visitors to quickly find important locations using the search bar or predefined recommendation buttons.
   * Features:
     - Displays a welcoming message with the application's name and purpose.
     - Connects to the search system and retrieves data from Firebase Firestore.
     - Implements real-time search functionality:
       - Queries Firestore for matching building names.
       - Displays search results in a dropdown list.
       - Redirects users to a building’s page if only one match is found.
     - Offers recommendation buttons for commonly searched places (Library, Gym, Cafe, etc.).
     - Enhances user experience with a responsive UI and smooth navigation.

### `Building.js`:
   * Dynamically renders detailed information about a selected campus building based on the URL parameter. Displays slideshow images, operating hours, services, departments, and includes Google Maps navigation with walking/driving routes from the user’s live location.
   * Features:
     - Connects with Firestore to fetch building data.
     - Uses React Router for page navigation.
     - Handles search functionality using `firestoreSearchService.js`.
     - Integrates Google Maps API for location visualization.
     
### `Contact.js`:
   * Provides users with direct communication channels for reaching the CampusConnect development team. Rather than serving general university contact info, this page is specifically designed for gathering user feedback, support requests, suggestions, or bug reports related to the app itself. It's meant to promote transparency, encourage engagement, and ensure continuous improvement of the platform based on real user input.
   * Features:
     - Displays an inviting, clearly branded section encouraging users to connect with the CampusConnect team.
     - Includes contact methods such as:
        - Developer support email
        - Optional integration points for forms, live chat, or feedback collection
    
### `About.js`:
   * Highlights the student developers who built CampusConnect as part of their capstone project. It introduces the team members, their roles, and contributions, providing transparency and a personal touch to the platform. This fosters trust and gives credit to the individuals responsible for bringing the project to life.
   * Features:
     - Displays a responsive "Meet the Team" section.
     - Presents developer names, roles, bios, emails, and photos.
     - Uses the team array to dynamically render profile cards for each contributor.
     - Offers clickable mailto: links for direct contact with the developers.
     - Styled with Tailwind CSS for a modern, responsive design.
     - Emphasizes the project's student-led and collaborative nature.
    
### `MapNavigation.js`:
   * Renders the interactive Google Maps preview for CampusConnect. It dynamically generates walking or driving directions between the user's current location and a selected building on campus, using the Google Maps Directions API. Designed for performance and user clarity, it handles map rendering, route drawing, distance/duration updates, and debounced API requests — all while visually signaling load progress to the user.
   * Features:
     - Google Maps Integration: Displays a live interactive map via Google Maps API with real-time route rendering.
     - Debounced Routing: Uses a custom-built debounce function to avoid excessive Directions API calls when inputs (like travel mode or destination) change.
     - Route Caching: Implements route caching using unique cache keys to prevent repeated API calls for the same route.
     - Dynamic Marker Placement: Adds custom markers (A for user, B for destination) using AdvancedMarkerElement when available, falling back to default markers for compatibility.
     - Auto-Resizing & Fit Bounds: Automatically adjusts map bounds to fit the full route for better mobile and desktop experience.
     - Distance & Duration Calculation: Extracts and sends distance/duration data (e.g., "0.4 mi", "5 mins") to parent components for display alongside navigation options.
     - Loading Overlay: Visually indicates route and map tile loading status before displaying the map, improving UX on slower networks.
     - Map Initialization Guarding: Ensures the map and renderer only initialize once, avoiding unnecessary rerenders.
     - Responsive Layout: Styled with Tailwind and custom CSS to fit flexibly inside containers across screen sizes.
     - Minimal External Dependencies: Purely relies on native Google Maps APIs and minimal utility functions for performance and clarity.
    
### `App.css`:
   * Contains essential map-related styles used by the MapNavigation component. It ensures that the Google Maps container occupies the full height and width of its parent while avoiding rendering issues, especially on smaller screens.
   * Features:
     - Full Map Coverage: Ensures the map fills its container using width: 100% and height: 100%.
     - Absolute Positioning: Uses position: absolute with top: 0 and left: 0 to layer the map correctly inside its wrapper.
     - Min-Height Safeguard: Applies a minimum height (400px) to prevent rendering issues where the map may appear blank due to no vertical space being allocated — especially useful for mobile views or when containers collapse.
       
### `chatbox.js`:
   * A floating chatbot that assists users by combining Firestore search and Gemini AI responses to provide answers about campus resources.
   * Features:
     - Opens as a chat bubble in the corner of the screen.
     - Responds to user queries about buildings, directions, services, etc.
     - First checks Firestore for matches; if none, it defers to Gemini AI.
     - Maintains chat history per session, styled with Tailwind.
     - Offers clear buttons to send messages, clear history, and toggle visibility.


## `/src/services`:

### `firestoreSearchService.js`:
   * Handles search functionality for the CampusConnect application. It queries the Firestore database to find buildings that match the user's search input.
   * Features:
     - Searches using three approaches:
       - **Keyword Matching**: Searches for the user's query in the "search_keywords" field of each building document.
       - **Services Offered Matching**: Searches the "services_offered" field if no keyword match is found.
       - **Departments/Building Available**: Searches for departments available within a building or the general name of the building. 
     - The Welcome Page (`Welcome.js`) or Building Page (`Building.js`) calls `searchBuildings(query)`.
     - The function queries Firestore:
       - First by keyword (e.g., searching "library" might match "Library", "Learning Center", etc.).
       - Then by services offered (e.g., searching "printing" finds buildings offering that service).
       - Finally by building name or department (e.g., "Sandford Hall" or "IT support" offerred in Sanford Hall). 
     - The matching buildings are returned as an array to the frontend.
     - The UI dynamically displays matching results to the user.
     - Users can click on a result to navigate to a building’s detailed page (`Building.js`).

### `firestoreService.js`:
   * Contains a function called `updateDocumentsWithId`, which updates every document in the "buildings" collection of Firestore by adding an `id` field that matches the document’s unique Firestore ID.
   * Features:
     - Retrieves all documents from the "buildings" collection.
     - Creates a Firestore batch operation to improve performance by committing multiple updates at once.
     - Iterates through each document in the collection:
       - Generates a reference to that document.
       - Updates the document to include an "id" field with the document’s Firestore ID.
     - Commits the batch operation, applying all updates efficiently in one transaction.
     - Logs a confirmation message once all documents are updated.

## `/src`:

### `App.js`:
   * Entry point of the CampusConnect application.
   * Features:
     - Sets up React Router to enable smooth navigation between pages without reloading.
     - Defines routes for different pages:
       - Welcome Page (`/`) → Main landing page for searching buildings.
       - Building Page (`/building/:id`) → Displays detailed building information.
       - NotFound Page (`*`) → Handles unmatched routes (404 page).
     - Tests Firestore Connection when the app starts to ensure the database is accessible.
     - Applies a Global Background Style to maintain UI consistency.

### `Index.js`:
   * The entry point for rendering the CampusConnect React application.
   * Features:
     - Initializes the React app using `ReactDOM.createRoot()` for React 18+ compatibility.
     - Renders the `App` component inside the `<div id="root">` in `index.html`.
     - Uses `React.StrictMode` to detect potential issues and ensure best practices in development mode.

### `Index.html`:
   * The core HTML structure for the CampusConnect web application.
   * Features:
     - Provides a container (`<div id="root">`) where the React app is rendered.
     - Sets up metadata (`<meta>` tags) for character encoding and responsive design.
     - Loads Tailwind CSS via CDN for styling.
     - Defines a custom Tailwind theme with navy and gold brand colors.
     - Applies a global background (`bg-navy text-white`) to maintain consistent UI styling.

# Contributor Guidelines:

## 1. Branching Strategy:
   * Follow the **feature branch workflow**.
   * Create a new branch for each feature or bug fix.
   * **Branch naming convention**:
     - `feature/<feature-name>` for new features.
     - `bugfix/<issue-description>` for bug fixes.

## 2. Commit Messages:
   * Use the following format:
     ```txt
     [Feature] Implemented <feature-name>
     [Bugfix] Fixed issue with <describe-fix>
     ```
   * Examples:
     - `[Feature] Implemented real-time search functionality`
     - `[Bugfix] Fixed issue with Firebase query performance`

## 3. Code Standards:
   * Use **consistent coding styles** across the project.
   * Follow best practices for:
     - **React**: Use functional components, hooks, and proper state management.
     - **Firebase**: Optimize queries and adhere to security rules.

## 4. Pull Requests:
   * Create pull requests (PRs) before merging into the `main` branch.
   * Include a **brief description** of the changes in the PR.
   * Ensure the PR is linked to the relevant issue or feature.

## 5. Testing:
   * Test all features **before pushing** to the repository.
   * Run `npm start` to check for UI issues and ensure the application runs smoothly.
   * Verify **Firebase integration** and test database queries for accuracy and performance.










