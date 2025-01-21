[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/GnDC3TyK)


Campus Connect is a user-friendly web application designed to help navigate campus buildings. The website objectives to make navigating campus more convenient, and accessible. Its primary audience includes students, particularly freshmen and transfer students, new faculty and staff members, and parents or guardians visiting. By providing clear guidance and enhancing accessibility, Campus Connect ensures that students, faculty, staff, and visitors alike can easily discover and navigate a wide range of campus resources tailored to student ,faculty, and parentals needs. 



Technology Stack: 
# Frontend
      ~ React.js: Used for building the web app's user interface (UI). React's component-based structure allows us to create reusable components for the homepage, map navigation, building information, and destination pages.
      ~ Google Maps API: Powers the interactive map that displays campus buildings, navigation routes, and clickable markers. It also provides features like route direction and location sharing for a seamless user experience.
      ~ Tailwind CSS:Enables rapid UI styling with utility-first CSS classes, ensuring the app looks modern, is responsive, and adapts well to different screen sizes and devices.
  # Backend
      ~ Express.js:Acts as the backend framework to handle API requests from the frontend. It facilitates communication between the Google Maps API, Firebase Firestore, and the app, ensuring data is delivered securely and efficiently.
      ~ Firebase Firestore:Used to store data related to campus buildings, such as names, descriptions, contact information, and office hours. Firestore's real-time syncing allows updates (e.g., parking availability or building status) to reflect instantly in the app.
      ~ Firebase Authentication: Ensures secure access to the app by managing user authentication. This feature allows students, faculty, and guests to log in and access personalized services, if necessary, during future expansions.  
  # Tools
      ~ Git/GitHub:Used for version control and collaborative development. The team tracks progress, organizes sprints, and manages codebase updates efficiently using GitHub's project boards and branching features.
      ~ Visual Studio Code: The primary development environment, enhanced by extensions for React, Tailwind, and Firebase to streamline the coding process.
      ~ ClickUp:A project management tool used to divide tasks, assign roles, and ensure timely completion of sprints as outlined in the Work Breakdown Structure (WBS).
  # Programming Languages
      JavaScript: The core language for both frontend and backend development. It powers the dynamic user interface (React.js) and handles backend logic (Express.js), ensuring a seamless integration of features like map navigation and real-time data updates.


       
How the Tools Work Together: 
  # Frontend Workflow
      ~ React.js: React builds the app's user interface. Each page (home, navigation/building info, map, destination) is a React component.
      React interacts with the backend to fetch and display dynamic data, such as building descriptions and navigation routes.
      It handles user input (e.g., searches, button clicks) and sends requests to the backend for processing.
      ~ Google Maps API: Embedded within the React app, Google Maps provides the interactive map interface.
      It displays campus locations as markers, highlights routes for walking or driving, and dynamically updates navigation paths based on the user’s current location.
      ~Tailwind CSS: Tailwind handles the app’s styling and layout. Its utility-first classes ensure the app is responsive (mobile-friendly) and visually appealing. The styling is tightly integrated with React components to ensure consistency.
  # Backend Workflow
      ~ Express.js: The backend serves as the bridge between the frontend and the database.It defines RESTful APIs that the frontend calls to fetch building information, navigation details, or parking availability. Example: When a user searches for a building, React sends a request to an API route in Express. Express processes this request and fetches data from Firebase.
      ~ Firebase Firestore: The Firestore database stores campus-related data, such as building names, descriptions, office hours, and locations.Express retrieves data from Firestore and sends it to the frontend in JSON format.Firestore’s real-time features allow data (e.g., traffic updates, parking availability) to reflect instantly in the app without requiring a page reload.
      ~ Firebase Authentication: Manages user login and authentication securely.Provides role-based access if needed in the future (e.g., faculty-specific features).Example: During an expansion phase, authentication could personalize navigation or grant access to restricted data.



    
Development and Collaboration Tools: 
  # Git/GitHub:
Git tracks code changes, and GitHub acts as the repository for collaboration.Team members work on different features in separate branches, merge completed work into the main branch, and resolve conflicts efficiently. The project board in GitHub organizes tasks and tracks sprint progress.
  # Visual Studio Code
      VS Code is the primary development environment. Developers write code, debug issues, and use extensions for React, Tailwind, and Firebase to speed up development.
  # Lucidchart
      Used during the planning phase to create wireframes, database schemas, and user flow diagrams.Provides a clear blueprint for developers, reducing confusion during implementation.
  # ClickUp
      ClickUp is the team’s project management tool.Tasks from the Work Breakdown Structure (WBS) are tracked here, ensuring clear assignments and deadlines.





Features and Functionality:
 
# Real-Time Updates:
 Provides up-to-date information about abnormal operations such as blockages in traffic and parking availability using color-coded areas. Integrates real-time data from campus services to ensure accuracy.
 
# Smart Search and Recommendations:
Search bar allows users to find buildings based on their needs.Recommendation buttons on the Welcome Screen suggest commonly searched locations.
 
# Interactive Map Features:
Clickable markers for campus buildings displayed as icons. Interactive map view with highlighted routes and directional arrows for easy navigation.
 
# Detailed Building Information:
 Navigation Bar displaying building pictures, descriptions, office hours, and contact details (phone number, email, services offered). Distance to the selected building shown in feet for driving and footsteps for walking.
 
# Navigation Assistance:
"Get Directions" button to initiate navigation guidance.Direction Navigation Bar with options for driving or walking, highlighted upon selection. "Go" button to start the route with turn-by-turn instructions in a bubble format.
 
# Location Sharing Services:
 Pop-up prompt for enabling location sharing to provide accurate routing. Destination Reached pop-up notification with options to return to the Welcome Screen or initiate a new search.
 
# Secure User Access:
 Firebase Authentication for secure login/signup.


       
