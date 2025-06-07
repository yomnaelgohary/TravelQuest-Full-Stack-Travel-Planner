# TravelQuest: Full-Stack Travel Planner

## Overview

TravelQuest is a modern full-stack web application built to help users plan their travels effortlessly. Inspired by the project requirements described in the provided specification, this platform allows users to create accounts, explore diverse travel destinations across categories, maintain personalized "Want-to-Go" lists, and search for destinations dynamically.

---

## Features

- **User Authentication**
  - Secure registration and login system.
  - Validation checks to prevent duplicate usernames or empty fields.
  
- **Home Page**
  - Displays destination categories like Beaches, Mountains, etc.
  - Quick access button to view the user’s personalized Want-to-Go list.
  
- **Category Pages**
  - Showcases all destinations within a chosen category.
  - Easy navigation to individual destination pages.

- **Destination Pages**
  - Detailed descriptions for each destination.
  - Embedded video links for immersive previews.
  - "Add to Want-to-Go List" button that prevents duplicates and shows appropriate feedback.
  
- **Want-to-Go List**
  - Displays all destinations a user has saved.
  - Easy access from the home page.

- **Search Functionality**
  - Global search bar (accessible from all main pages except login/registration).
  - Searches by destination names, supporting partial matches.
  - Results are clickable and lead to the relevant destination page.
  - Clear feedback when no results are found.

---

## Design & User Experience

- Clean and elegant interface with a light background and generous white space.
- Bold headlines with modern typography for clear visual hierarchy.
- Neutral gray body text for easy readability.
- Subtle rounded corners and soft shadows on cards and sections to provide depth and separation.
- Responsive full-width layout capped at a centered max width for optimal reading experience.
- Smooth transitions and hover effects on navigation items and buttons.
- Minimalistic forms with clear labels and well-structured spacing.
- Consistent and modern interactive elements throughout the site.

---

## Technologies Used

- **Frontend:**
  - HTML, CSS (with modern styling)
  - Embedded JavaScript (EJS) for dynamic content rendering
  
- **Backend:**
  - Node.js with Express.js for server-side API and routing
  - Express-session for managing user sessions and securing user data
  
- **Database:**
  - MongoDB for storing user credentials, destinations, and Want-to-Go lists
  
---

## Running the Project Locally

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up MongoDB locally or connect to a MongoDB Atlas cluster.
4. Configure environment variables as needed for database connection and session secrets.
5. Run the development server using `npm start` or `npm run dev`.
6. Open `http://localhost:3000` in your browser to explore the app.

---

## Project Structure

- **Views:** Contains EJS templates for the frontend pages (Login, Registration, Home, Categories, Destination, Want-to-Go List).
- **Routes:** Defined API endpoints and page routes handled by Express.
- **Models:** MongoDB schema definitions for Users and Destinations.
- **Public:** Static assets including stylesheets, scripts, and images.
- **Middleware:** Session management and authentication checks.
  
---

## Notes

- Designed for seamless user experience with simple navigation and minimalistic design.
- User sessions isolate data securely across multiple logged-in users.
- The "Want-to-Go List" prevents duplicate entries and maintains data integrity.
- Search functionality is optimized for quick and relevant results.
- Embedded videos are linked, not stored locally, saving storage and improving load times.


---

Thank you for exploring TravelQuest — your companion for planning memorable journeys!

