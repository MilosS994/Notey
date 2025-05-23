# 🗒️ Notey

**Notey** is a light, modern note-taking web application with user authentication, protected routes, and a clean React-based frontend. It communicates with a REST API backend and supports session management and route guarding for a secure user experience.

---

## Features

- Authentication (Login, Register, Logout)
- Protected Routes using React Router
- Axios instance with token handling
- REST API integration
- Session persistence (via localStorage)
- Auto-redirect on session expiration
- 404 Not Found page handling

---

## 🛠 Tech Stack - MERN

- **Frontend:** React
- **Backend:** Node, Express, MongoDB
- **Styling:** Tailwind CSS
- **Backend API:** RESTful endpoints

---

## How to run app locally

### Clone the repository

- git clone https://github.com/MilosS994/Notey.git
- cd notey

### Setup backend

- cd server
- npm install

### Create a .env file inside the server/ folder with the following content:

- PORT=5500
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- CLIENT_URL=http://localhost:5173

### Start the backend server

- npm run dev

### Setup frontend

- cd client
- npm install

### Create a .env file inside the client/ folder with the following content:

- VITE_API_BASE_URL=http://localhost:5500/api/v1

### Start the frontend

- npm run dev

## Access the app

- **_Open your browser and navigate to http://localhost:5173_**
- **_Register a new user or log in to an existing one_**
- **_You can now use the protected features of the app_**
