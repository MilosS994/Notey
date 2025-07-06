# Notey App Frontend

Modern React app for Notey – notes with priorities, search, tags, and user profiles.

---

## Technologies

- React (Vite)
- Tailwind CSS
- Context API
- Axios
- React Router
- Lucide Icons
- date-fns
- Toast notifications
- Vite, ESLint, Prettier
- Vitest + Testing Library

---

## Setup

1. **Navigate to client folder:**

```
cd client
```

2. **Install dependencies:**

```
npm install
```

3. **Environment config:**

- Make a `.env` file

  ```
  VITE_API_URL=http://localhost:5001
  ```

> By default, API is expected at `localhost:5001`. Change as needed for production.

4. **Run the frontend app:**

```
npm run dev
```

---

## Features

- Login/Register (with strong validation)
- JWT Auth (cookie-based)
- Add, edit, delete, and pin notes
- Priority labels & filters
- Tags, search, and sorting (priority/date/title)
- User profile editing (username, email, password)
- Responsive UI (Tailwind)
- Global toast notifications

---

## Project Structure

```
src/
├── components/
│ ├── notes/
│ └── ...
├── context/
├── layouts/
├── pages/
├── utils/
├── main.jsx
├── app.jsx
└── index.css
```

---

## Testing

- Vitest + Testing Library
- Run all tests:

```
npm run test
```

---

## Author

[Milos Srejic](https://github.com/MilosS994)
