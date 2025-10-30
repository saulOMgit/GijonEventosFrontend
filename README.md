# Gijón Eventos Project

Gijón Eventos is a modern, responsive web application designed to manage local events in the city of Gijón. Developed as a showcase project, it allows users to register, log in, create events, and participate in activities organized by others. The application is built with a focus on a clean, intuitive user experience and a robust frontend architecture.

The frontend is built with React and styled with Tailwind CSS, providing a sleek and responsive interface. The backend is powered by a Java Spring Boot application (not included in this repository), which handles business logic and data persistence. User authentication is managed through API calls to ensure a secure environment for event management.

### Key features include:
- **User Authentication:** Secure registration and login functionality allows users to create and manage their accounts.
- **Event Dashboard:** An interactive dashboard where users can view all upcoming events.
- **Event Filtering:** Users can easily filter events to see all events, only the ones they are attending, or only the ones they have organized.
- **Event Management (CRUD):** Authenticated users can create, edit, and delete their own events through an intuitive modal form.
- **Event Participation:** Users can join and leave events with a single click, with real-time updates to attendee counts.
- **Responsive Design:** The interface is fully responsive, ensuring a seamless experience on desktops, tablets, and smartphones.
- **Dark Mode:** A theme toggle allows users to switch between light and dark modes for comfortable viewing.

By combining modern frontend technologies like React and Tailwind CSS, Gijón Eventos offers a comprehensive, secure, and user-friendly platform for discovering and managing local happenings in Gijón.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Setup](#project-setup)
- [Project Structure](#project-structure)
- [Running the Application](#running-the-application)
- [Tools](#tools)
- [Future improvements](#future-improvements)
- [Contributors](#contributors)
- [Disclaimer](#disclaimer)

## Prerequisites
Before running this project, ensure you have the following installed on your machine:

- **Node.js and npm:** [Download Node.js](https://nodejs.org/) (npm is included).
- **Backend Server:** A running instance of the corresponding [Gijón Eventos Backend](https://github.com/saulOMgit/gijon-eventos-backend) application.

## Installation
Follow these instructions to set up the project locally.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/saulOMgit/gijon-eventos-frontend.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd gijon-eventos-frontend
    ```
3.  **Backend Configuration:**
    This frontend application is designed to communicate with a backend API. The API endpoint is hardcoded in `src/services/api.ts` to `http://localhost:8080/api/v1`. Please ensure the backend server is running and accessible at this address before starting the frontend.

## Project Setup
1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Compile and Hot-Reload for Development:**
    ```bash
    npm run dev
    ```
    This command will start the Vite development server, and you can view the application in your browser at the provided local URL (usually `http://localhost:3000`).

## Project Structure
Below is an overview of the main directories and files in the Gijón Eventos project:

```
.
├── public/                  # Public assets
├── src/                     # Main application source code
│   ├── components/          # React components
│   │   ├── auth/            # Authentication components (Login, Register)
│   │   ├── events/          # Event-related components (Dashboard, List, Card, Form)
│   │   ├── icons/           # Custom SVG icon components
│   │   ├── layout/          # Layout components (Header, Footer)
│   │   └── shared/          # Reusable shared components (Button, Modal, Spinner)
│   ├── hooks/               # Custom React hooks (useAuth, useTheme)
│   ├── services/            # API communication layer (api.ts)
│   ├── types.ts             # TypeScript type definitions
│   ├── App.tsx              # Root React component
│   └── index.tsx            # Application entry point
├── .gitignore               # Files and directories to ignore in git
├── index.html               # Main HTML file
├── metadata.json            # Project metadata for the hosting environment
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation
```

## Running the Application
To run the application in a development environment, use the following command:
```bash
npm run dev
```
This will start the development server. Ensure your backend server is running simultaneously for the application to function correctly.

## Tools
- **React:** A JavaScript library for building user interfaces.
- **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **React Hook Form:** A library for managing form state and validation.
- **Vite:** A fast and modern frontend build tool.

## Future improvements
Here are some planned features or improvements for future versions of the project:

- **Event Categories & Search:** Implement functionality to categorize events and allow users to search for specific events.
- **User Profiles:** Add a dedicated user profile page where users can view their organized/attended events and update their information.
- **Real-time Notifications:** Use WebSockets to provide real-time notifications (e.g., when an event is updated or canceled).
- **Image Uploads:** Allow event organizers to upload cover images for their events.

## Contributors
- **Saúl Otero Melchor:** [GitHub](https://github.com/saulOMgit/) | [LinkedIn](https://www.linkedin.com/in/sa%C3%BAl-otero-melchor-84b752282/)

## Disclaimer
This project is developed as part of a personal portfolio and is intended for educational and demonstration purposes only. The creator is not responsible for any issues, damages, or losses that may occur from using this code.

This project is not meant for commercial use. By using this code, you acknowledge that it is a demonstration project and comes without warranties or guarantees of any kind. Use at your own discretion and risk.
