Polling Web App with Real-Time Voting and User Authentication

Project Overview

This is a Polling Web Application that allows users to:

    •	Create polls with multiple options.
    •	Vote in polls through a shareable link.
    •	View real-time updates of poll results using WebSockets.
    •	Manage polls (create, view previous polls, track live results).
    •	Authenticate users with a secure login and registration system.

The frontend is built using HTML, Tailwind CSS, and JavaScript, while the backend is powered by Node.js, Express, MongoDB, and Socket.io.

Features

    •	User Authentication: Users must log in to create or vote on polls.
    •	Poll Management: After logging in, users can create polls, view their previous polls, and track live voting results.
    •	Real-Time Voting: Poll creators can see votes and percentages update in real time.
    •	Shareable Poll Links: Polls can be shared with other users.
    •	Responsive Design: Accessible and optimized for both desktop and mobile views.
    •	WCAG Accessibility: Compliant with accessibility guidelines, designed keeping colorblind users in mind.

Tech Stack

Frontend:

    •	HTML
    •	Tailwind CSS
    •	JavaScript

Backend:

    •	Node.js
    •	Express.js
    •	Socket.io (for real-time updates)
    •	MongoDB (for data storage)

Installation

Prerequisites:

Make sure you have the following installed:

    •	Node.js (version 14 or later)
    •	MongoDB (local or cloud instance)

Steps:

    1.	Clone the repository:

git clone https://github.com/your-username/your-repo-name.git

    2.	Navigate to the project directory:

cd your-repo-name

    3.	Install backend dependencies:

npm install

    4.	Start the MongoDB server:

Make sure MongoDB is running either locally or connect to a cloud instance. 5. Set up environment variables:
Create a .env file in the project root with the following variables:

DATABASE_URL=your_database_url

    6.	Start the backend server:

npm run dev

    7.	Run frontend:

Ensure the frontend is running separately, served by your chosen method (e.g., serve, live server, Vite, etc.).

Usage

    1.	Register a new user or log in.
    2.	Once logged in, you will be redirected to the dashboard, where you can:
    •	Create new polls.
    •	View and manage polls you have previously created.
    3.	Poll creation: Create a new poll by entering a question and options.
    4.	Shareable Poll Link: Generate a link to allow other users to vote.
    5.	Vote: When another user clicks the link, they can cast a vote for one option. Only one vote can be cast per user, but they can change their vote while the link is active.
    6.	Live Voting Results: The poll creator can see voting results and percentages in real time as users vote.

Accessibility (WCAG Compliance)

This project follows WCAG 2.1 guidelines for accessibility:

    •	Color contrast: High-contrast blue on white for ease of readability.
    •	Keyboard navigation: All interactive elements are accessible using keyboard navigation.
    •	ARIA attributes: ARIA landmarks and roles are used to improve screen reader compatibility.

Future Improvements

    •	Poll Analytics: Display more detailed analytics such as vote trends over time.
    •	Multiple Vote Types: Add different types of polls (e.g., ranked choice voting).
    •	Notifications: Allow users to receive notifications when their poll receives votes.

Contributing

Feel free to submit pull requests or create issues to improve the project. Contributions are welcome!

    1.	Fork the repository.
    2.	Create a new branch.
    3.	Make your changes.
    4.	Submit a pull request.

License

This project is licensed under the MIT License. See the LICENSE file for details.

Contact

For questions or support, feel free to reach out to [shubham3901@gmail.com].

This README provides an overview of the project and its features, instructions for setup, and a guide for future development. You can modify sections as needed to reflect your specific project and goals!
