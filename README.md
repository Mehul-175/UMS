# User Management System
### Backend Developer Intern Assessment

A full-stack **User Management System** built with the **MERN stack**, featuring secure authentication, role-based access control (RBAC), admin user management, and server-side pagination. This project demonstrates production-ready backend practices including secure cookie handling, input validation, and clean architecture.

---

## 🔗 Live Deployment
- **Frontend (Vercel)**: https://user-management-system-mu-five.vercel.app
- **Backend (Render)**: https://user-management-system-pl0i.onrender.com

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas) + Mongoose
- **Authentication**: JWT (JSON Web Tokens) stored in HTTP-Only Cookies
- **Security**: bcryptjs (Password Hashing), cors

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **State/Notifications**: React Hot Toast
- **Icons**: Lucide React

---

## ⚙️ Getting Started
### 1. Clone the Repository
```bash
git clone https://github.com/Mehul-175/UMS.git

cd UMS 
````

### 2. Backend Setup

```bash
cd server
npm install
```

### 3\. Create Environment Variables

Create a **`.env`** file inside the `backend` folder and add the following:

```
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET="your_secret_key"
```

*(Replace the placeholder values with your actual MongoDB URI and secret key.)*

### 4\. Run the Server

```bash
npm run dev
# Server runs at http://localhost:8000
```

### 5. Setup Frontend
```bash
cd ../frontend
npm install
```
### 6. Frontend env
```bash
VITE_API_URL=http://localhost:8000
```

### 7. Run the Server

```bash
npm run dev
# Client runs on http://localhost:5173
```
-----

## 🧩 API Documentations

**Auth Routes** → `/api/auth`
*/register, /login, /logout*

**User Routes (Protected)** → `/api/user`
*/me, /profile, /change-password*

**Admin Routes (Protected- Role: Admin)** → `/api/admin`
*/users?page=1, /user/:id/activate, /user/:id/deactivate*

-----

## 🔐 Security & Architecture Features
### 1. Authentication Flow
- Login/Signup: Backend issues a JWT signed with a secret.

- Storage: JWT is sent as an httpOnly cookie. This prevents XSS attacks from stealing the token.

- Verification: Middleware verifies the token on every protected request.

### 2. Role-Based Access Control (RBAC)
- Custom middleware checks user.role before allowing access to Admin routes.

- Frontend protects routes using a wrapper component that redirects unauthorized users.

3. CORS & Production Config
- CORS: Restricted to the specific production frontend domain.

- Cookies: Configured with SameSite=None and Secure=true for cross-site usage in production.

## 🚀 Deployment Strategy
### Backend (Render)
- Deployed as a Web Service.

- Environment variables configured in Render Dashboard.

- trust proxy enabled in Express to handle cookies behind Render's load balancer.

### Frontend (Vercel)
- Deployed via GitHub integration.

- vercel.json configured to handle client-side routing rewrites:

  * Backend MVP (Users, Items, Requests)
  * Frontend (React + Tailwind)
  * Admin dashboard & analytics
  * Deployment (Render / Vercel)

  ```json
  {
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
  }
  ```

-----


## 📜 License

This project is for educational and assessment purposes.