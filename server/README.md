# Notey App Backend

RESTful API for notes, with user authentication and admin functionality.

---

## Technologies

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT authentication (cookie-based)
- Jest + Supertest for testing

---

## Setup

1. **Clone the repository:**

   ```
   git clone <repo-url>
   cd <repo-folder>
   ```

2. **Install dependencies:**

   ```
   npm install
   ```

3. **Create a `.env` file:**

   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/notes-app
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

4. **Start the backend server:**
   ```
   npm run dev
   ```

---

## API Endpoints

### Auth

- `POST /api/v1/auth/register` – Register a new user
- `POST /api/v1/auth/login` – User login
- `POST /api/v1/auth/logout` – User logout
- `GET /api/v1/auth/me` – Get info about the logged-in user

### Notes

- `GET /api/v1/notes` – Get all user notes (with pagination & filters)
- `POST /api/v1/notes` – Create a new note
- `GET /api/v1/notes/:id` – Get a single note by ID
- `PATCH /api/v1/notes/:id` – Update a note
- `DELETE /api/v1/notes/:id` – Delete a note
- ... (pin/unpin, sorting, searching, tags, etc.)

### Admin

- `GET /api/v1/admin/users` – (Admin) Get all users with their notes
- `DELETE /api/v1/admin/users/:userId` – (Admin) Delete any user

---

## Running Tests

- Covers authentication, user and admin routes, and edge cases.
- Test files are in the `__tests__` folder.

---

## Project Structure

```
src/
├── config/
│   └── db.js
├── controllers/
│   ├── admin.controller.js
│   ├── auth.controller.js
│   ├── note.controller.js
│   ├── searchNotes.controller.js
│   ├── sortNotes.controller.js
│   └── user.controller.js
├── middleware/
│   ├── auth.middleware.js
│   └── error.middleware.js
├── models/
│   ├── note.model.js
│   └── user.model.js
├── routes/
│   ├── admin.routes.js
│   ├── auth.routes.js
│   ├── note.routes.js
│   └── user.routes.js
├── utils/
│   └── jwt.js
└── server.js

__tests__/
├── admin.test.js
├── auth.test.js
└── note.test.js
```

---

## Notes

- Uses cookie-based JWT authentication to protect routes.
- The first registered user becomes admin automatically.
- Features: authentication, validation, admin operations, pagination, search, tags, etc.
- Clear error handling and edge case coverage.

---

## Author

[Milos Srejic](https://github.com/MilosS994)
