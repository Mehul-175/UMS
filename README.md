# User Management System

A full-stack **User Management System** built with **MERN stack**, featuring secure authentication, role-based access control, admin user management, and pagination.  
The project demonstrates **production-ready backend practices** with a minimal but functional frontend.

---

## 🔗 Live Demo

- **Frontend (Vercel)**: https://user-management-system-mu-five.vercel.app  
- **Backend (Render)**: https://user-management-system-pl0i.onrender.com

---

## ✨ Features

### Authentication & Authorization
- User **Signup / Login / Logout**
- **JWT-based authentication** stored in **HTTP-only cookies**
- Secure cookie handling with `SameSite=None` and `Secure` in production
- Protected routes using middleware
- Role-based access (`user`, `admin`)

### User Features
- View own profile
- Update profile name
- Change password with validation
- Session persistence across refresh

### Admin Features
- View all users (paginated)
- Activate / Deactivate users
- Prevent admin from modifying own account status
- Pagination synced with URL query params (`?page=`)

### Security & Production Practices
- Password hashing using `bcryptjs`
- Environment-based configuration
- Proper CORS handling for cross-origin cookies
- `trust proxy` enabled for secure cookies behind reverse proxy
- Clean separation of routes, controllers, and middleware

---

## 🧱 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- bcryptjs
- cookie-parser
- cors

### Frontend
- React (Vite)
- React Router DOM
- Tailwind CSS
- Fetch API (with credentials)

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

---

## 📂 Project Structure

### Backend
```text
server/
├─ src/
│ ├─ controllers/
│ ├─ models/
│ ├─ routes/
│ ├─ middleware/
│ ├─ utils/
│ └─ index.js
├─ package.json
```
### Frontend
```text
client/
├─ src/
│ ├─ pages/
│ ├─ api.js
│ ├─ App.jsx
│ └─ main.jsx
├─ package.json
└─ vercel.json
```


---

## 🔐 Authentication Flow

1. User logs in or registers
2. Backend issues a JWT
3. JWT is stored in an **HTTP-only cookie**
4. Browser automatically sends cookie on subsequent requests
5. Backend verifies token on protected routes
6. Role middleware restricts admin-only endpoints

---

## 🌐 CORS Strategy (Important)

- CORS is **restricted to the production frontend domain**
- Cookies are allowed using `credentials: true`
- CORS is enforced **only by browsers**, not tools like Postman

## Example production configuration:
```js
app.use(cors({
  origin: "https://user-management-system-mu-five.vercel.app",
  credentials: true
}));
```

## 🧪 Pagination Strategy

- Backend pagination using skip and limit

- Frontend disables navigation beyond the last page

- Pagination state synced with URL query parameters

## Environment Variables
### Backend (.env)
- PORT=8000
- MONGO_URI=your_mongodb_uri
- JWT_SECRET=your_jwt_secret

### Frontend (Vercel Environment Variables)
- VITE_API_URL=https://your-backend.onrender.com/api

- Frontend .env is not committed to GitHub.
- Production environment variables are configured directly in Vercel.

## 🚀 Deployment Overview

- Backend deployed first on Render

- Frontend deployed on Vercel

- CORS locked to production frontend URL

- Client-side routing handled using Vercel rewrites

vercel.json:
```json

{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```


## 🧠 Key Learnings

- Secure handling of HTTP-only cookies in cross-origin setups

- Difference between CORS and authentication

- Git case-sensitivity issues on Linux deployments

- URL-based pagination handling

- Production-grade deployment workflow

## 📄 License

- This project is for educational and demonstration purposes.
