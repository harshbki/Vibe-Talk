# MERN Chat App

A full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js).  
Supports user authentication, private and group chats, image/video sharing, and live video calls.

---

## Features

- User Signup, Login & Profile Management (JWT authentication)
- Real-time Messaging with Socket.IO
- File uploads (images, videos) using Multer & Cloudinary
- Live video/audio calls powered by WebRTC
- Responsive and modern UI built with React & Tailwind CSS
- Chat typing indicators and message status

---

## Technologies Used

### Frontend

- React.js
- React Router DOM
- Context API
- Axios
- Socket.IO Client
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB & Mongoose
- Socket.IO
- Multer (for file uploads)
- Cloudinary (media hosting)
- JWT & bcrypt (authentication)
- WebRTC (live calls)

---

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB instance (local or cloud)
- Cloudinary account (for file uploads)

### Local MongoDB Setup

1. Download and install [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
2. Create the data directory:
   - **Windows:** `C:\data\db`
   - **Mac (Homebrew):** `/usr/local/var/mongodb`
   - **Mac/Linux (manual install):** `/data/db`
3. Start the MongoDB server: `mongod`
4. Open another terminal and run: `mongosh`
5. Create the database and a dedicated user:
   ```js
   use vibetalk
   db.createUser({
     user: "app_user",
     pwd: "your_password",
     roles: ["readWrite"]
   })
   ```
6. In your `.env` file (copy from `.env.example`), set:
   ```
   MONGO_URI=mongodb://app_user:your_password@localhost:27017/vibetalk?authSource=vibetalk
   ```

### Installation

1. Clone the repository

## Setup Backend
- cd server
- npm install

## Setup Frontend
- cd ../client
- npm install
- npm start
##  Start the backend server
- cd ../server
- npm start
## Developed by **M.Hasnain Muawia**— feel free to reach out!
## hasainalvi@gamil.com
## github.com/alvi597
