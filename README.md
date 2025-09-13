# VolunteerConnect Platform



A full-stack MERN web application connecting volunteers with organizations offering meaningful opportunities. Features role-based access, intelligent matching, and real-time communication.

---

## Table of Contents
- [Live Demo](#%F0%9F%9A%80-live-demo)
- [Features](#%E2%9C%A8-features)
  - [For Volunteers](#for-volunteers)
  - [For Organizations](#for-organizations)
- [Tech Stack](#%F0%9F%9B%A0-tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Deployment](#deployment)
- [Installation & Local Setup](#%F0%9F%92%A6-installation--local-setup)
  - [Prerequisites](#prerequisites)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. Access the Application](#4-access-the-application)
- [Deployment](#%F0%9F%8C%90-deployment)
  - [Backend Deployment on Render](#backend-deployment-on-render)
  - [Frontend Deployment on Vercel](#frontend-deployment-on-vercel)
- [Environment Variables](#%F0%9F%94%91-environment-variables)
  - [Backend (.env)](#backend-env)
  - [Frontend (.env)](#frontend-env)
- [API Documentation](#%F0%9F%93%8B-api-documentation)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Profile Endpoints](#profile-endpoints)
  - [Opportunity Endpoints](#opportunity-endpoints)
  - [Matching Endpoint](#matching-endpoint)
  - [Example Request: User Registration](#example-request-user-registration)
  - [Example Response](#example-response)
- [Test Accounts](#%F0%9F%91%A5-test-accounts)
  - [Volunteer Accounts](#volunteer-accounts)
  - [Organizer Accounts](#organizer-accounts)
- [Support](#%F0%9F%93%9E-support)
- [License](#%F0%9F%93%84-license)
- [Acknowledgments](#%F0%9F%99%8F-acknowledgments)

---

## 🚀 Live Demo
- **Frontend:** https://volunteer-connect-platform.vercel.app  
- **Backend API:** https://volunteer-platform-backend.onrender.com

---

## ✨ Features

### For Volunteers
- 🔐 Secure authentication and profile management  
- 🎯 Smart opportunity matching based on skills and location  
- 📍 Interactive map view of nearby opportunities  
- 📋 Application tracking system  
- 💬 Real-time chat with organizers  

### For Organizations
- 🏢 Opportunity creation and management  
- 👥 Application review and volunteer management  
- 📊 Dashboard with analytics  
- 📍 Geographic reach expansion  
- 💬 Direct communication with volunteers  

---

## 🛠️ Tech Stack

### Frontend
- React 18+ (functional components & hooks)  
- Vite for fast development and builds  
- Tailwind CSS for responsive styling  
- React Router for navigation  
- Context API for state management  
- Axios for API communication  

### Backend
- Node.js (16+) with Express.js  
- MongoDB with Mongoose ODM  
- JWT for authentication  
- bcryptjs for password hashing  
- CORS for cross-origin requests  

### Deployment
- Frontend: Vercel  
- Backend: Render  
- Database: MongoDB Atlas

---

## 📦 Installation & Local Setup

### Prerequisites
- Node.js **16+** installed  
- MongoDB Atlas account or local MongoDB instance  
- Git installed

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/volunteer-connect-platform.git
cd volunteer-connect-platform

```
### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
echo "PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secure_jwt_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development" 

# Start the development server
npm run dev
```
### 3. Frontend Setup
```bash
# Open a new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Create environment file
echo "VITE_API_BASE_URL=http://localhost:5001/api"

# Start the development server
npm run dev
## 🌐 Deployment

### Backend Deployment on Render
1. Push your code to GitHub.  
2. Connect your repository to Render.  
3. Set build command: `npm install`  
4. Set start command: `npm start`  
5. Add environment variables in Render dashboard (same as your `.env`).  

### Frontend Deployment on Vercel
1. Connect your repository to Vercel.  
2. Set root directory to `client`.  
3. Set build command: `npm run build`  
4. Set output directory: `dist`  
5. Add environment variable:  

```
VITE_API_BASE_URL=your-render-backend-url
```


