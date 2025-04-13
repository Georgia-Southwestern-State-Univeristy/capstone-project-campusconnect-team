Campus Connect is a user-friendly web application designed to help navigate campus buildings. The website objectives to make navigating campus more convenient, and accessible. Its primary audience includes students, particularly freshmen and transfer students, new faculty and staff members, and parents or guardians visiting. By providing clear guidance and enhancing accessibility, Campus Connect ensures that students, faculty, staff, and visitors alike can easily discover and navigate a wide range of campus resources tailored to student ,faculty, and parentals needs. 



# Technology Stack: 
## Frontend
  * React.js: Used for building the web app's user interface (UI). React's component-based structure allows us to create reusable components for the homepage, map navigation, building information, and destination pages.
  * Google Maps API: Powers the interactive map that displays campus buildings, navigation routes, and clickable markers. It also provides features like route direction and location sharing for a seamless user experience.
  * Tailwind CSS:Enables rapid UI styling with utility-first CSS classes, ensuring the app looks modern, is responsive, and adapts well to different screen sizes and devices.
    
## Backend
  * Firebase Firestore:Used to store data related to campus buildings, such as names, descriptions, contact information, and office hours. Firestore's real-time syncing allows updates (e.g., parking availability or building status) to reflect instantly in the app.
  * Firebase Authentication: Ensures secure access to the app by managing user authentication. This feature allows students, faculty, and guests to log in and access personalized services, if necessary, during future expansions. 
      
## Tools
  * Git/GitHub:Used for version control and collaborative development. The team tracks progress, organizes sprints, and manages codebase updates efficiently using GitHub's project boards and branching features.
  * Visual Studio Code: The primary development environment, enhanced by extensions for React, Tailwind, and Firebase to streamline the coding process.
  * Github projects:A project management tool used to divide tasks, assign roles, and ensures timely completion of sprints.

      
# Programming Languages:
  * JavaScript: The core language for both frontend and backend development. It powers the dynamic user interface (React.js) and handles backend logic (Express.js), ensuring a seamless integration of features like map navigation and real-time data updates.


       
# How the Tools Work Together: 
## Frontend Workflow
  * React.js: React builds the app's user interface. Each page (home, navigation/building info, map, destination) is a React component. React interacts with the backend to fetch and display dynamic data, such as building descriptions and navigation routes. It handles user input (e.g., searches, button clicks) and sends requests to the backend for processing.
    
  * Google Maps API: Embedded within the React app, Google Maps provides the interactive map interface. It displays campus locations as markers, highlights routes for walking or driving, and dynamically updates navigation paths based on the user’s current location.
    
  * Tailwind CSS: Tailwind handles the app’s styling and layout. Its utility-first classes ensure the app is responsive (mobile-friendly) and visually appealing. The styling is tightly integrated with React components to ensure consistency.
      
## Backend Workflow      
  * Firebase Firestore: The Firestore database stores campus-related data, such as building names, descriptions, office hours, and locations.Express retrieves data from Firestore and sends it to the frontend in JSON format.Firestore’s real-time features allow data (e.g., traffic updates, parking availability) to reflect instantly in the app without requiring a page reload.
      
  * Firebase Authentication: Manages user login and authentication securely.Provides role-based access if needed in the future (e.g., faculty-specific features).Example: During an expansion phase, authentication could personalize navigation or grant access to restricted data.



    
# Development and Collaboration Tools: 
  ## Git/GitHub:
   * Git tracks code changes, and GitHub acts as the repository for collaboration.Team members work on different features in separate branches, merge completed work into the main branch, and resolve conflicts efficiently. The project board in GitHub organizes tasks and tracks sprint progress.
  ## Visual Studio Code:
   * VS Code is the primary development environment. Developers write code, debug issues, and use extensions for React, Tailwind, and Firebase to speed up development.
  ## Lucidchart:
   * Used during the planning phase to create wireframes, database schemas, and user flow diagrams.Provides a clear blueprint for developers, reducing confusion during implementation.
 




# Features and Functionality:
 
## Real-Time Updates:
   * Provides up-to-date information about abnormal operations such as blockages in traffic and parking availability using color-coded areas. Integrates real-time data from campus services to ensure accuracy.
 
## Smart Search and Recommendations:
   * Search bar allows users to find buildings based on their needs.Recommendation buttons on the Welcome Screen suggest commonly searched locations.
 
## Interactive Map Features:
   * Clickable markers for campus buildings displayed as icons. Interactive map view with highlighted routes and directional arrows for easy navigation.
 
## Detailed Building Information:
   * Navigation Bar displaying building pictures, descriptions, office hours, and contact details (phone number, email, services offered). Distance to the selected building shown in feet for driving and footsteps for walking.
 
## Navigation Assistance:
   * "Get Directions" button to initiate navigation guidance.Direction Navigation Bar with options for driving or walking, highlighted upon selection. "Go" button to start the route with turn-by-turn instructions in a bubble format.
 
## Location Sharing Services:
   * Pop-up prompt for enabling location sharing to provide accurate routing. Destination Reached pop-up notification with options to return to the Welcome Screen or initiate a new search.
 
## Secure User Access:
   * Firebase Authentication for secure login/signup.


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
   * Responsible for rendering detailed information about a specific building when a user navigates to its page. This includes displaying its name, image, description, contact information, operating hours, services offered, and embedding a Google Maps location for navigation.
   * Features:
     - Connects with Firestore to fetch building data.
     - Uses React Router for page navigation.
     - Handles search functionality using `firestoreSearchService.js`.
     - Integrates Google Maps API for location visualization.

## `/src/services`:

### `firestoreSearchService.js`:
   * Handles search functionality for the CampusConnect application. It queries the Firestore database to find buildings that match the user's search input.
   * Features:
     - Searches using two approaches:
       - **Keyword Matching**: Searches for the user's query in the "search_keywords" field of each building document.
       - **Services Offered Matching**: Searches the "services_offered" field if no keyword match is found.
     - The Welcome Page (`Welcome.js`) or Building Page (`Building.js`) calls `searchBuildings(query)`.
     - The function queries Firestore:
       - First by keyword (e.g., searching "library" might match "Library", "Learning Center", etc.).
       - Then by services offered (e.g., searching "printing" finds buildings offering that service).
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










