# 🎬 Screens & Playlists System

A full-stack app built with **Express**, **MongoDB**, and **React** that manages Screens and Playlists.  
It features authentication, validation, pagination, and a polished Tailwind UI.

---

## 🚀 Tech Stack

| Layer | Tech |
|-------|------|
| Backend | Node.js + Express + MongoDB + JWT |
| Frontend | React + Vite + Tailwind CSS |
| State Management | React Context (useContext Hook) |
| Auth | JWT + bcrypt |
| Validation | Joi / express-validator |
| Database | MongoDB with Mongoose |

---

## 🧭 Setup Steps

## Install Dependencies
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

## Seed the Database
Run the seed script to populate your MongoDB with one ADMIN/EDITOR user, some screens, and playlists.
cd backend
npm run seed

## Run the App
# Backend
npm run dev

# Frontend
cd ../frontend
npm run dev


## Data Model Diagram
User
 ├─ email: string
 ├─ passwordHash: string
 ├─ role: enum("ADMIN", "EDITOR")

Screen
 ├─ name: string
 ├─ description: string
 ├─ isActive: boolean

Playlist
 ├─ name: string
 ├─ itemUrls: [string]
 ├─ itemCount: number (virtual)
 ├─ createdBy: ObjectId (User)

## Environment Variables
SEED_ADMIN_EMAIL=adminganesh@gmail.com
SEED_ADMIN_PASSWORD=Ganesh@123

### 1. Clone the Repository
```bash
git clone https://github.com/ganesh23101979/screens-playlists.git
cd screens-playlists-system
