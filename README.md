# CosmicEye — Starter Scaffold

This repository contains a minimal starter for CosmicEye: a React + Three.js frontend and a Node.js Express backend that fetches TLE data from CelesTrak.

Structure:
- server: Express backend (port 4000)
- client: Vite + React frontend (port 5173 by default)

Getting started (Windows PowerShell):

1. Start the server
   cd "c:\Users\neeks\OneDrive\Desktop\project 2\nasa-sky-tracker\server"
   npm install
   npm run dev

2. Start the client
   cd "c:\Users\neeks\OneDrive\Desktop\project 2\nasa-sky-tracker\client"
   npm install
   npm run dev

Open the app at http://localhost:5173

Notes:
- The frontend fetches TLEs from the server: GET /api/tle/visual
- `earthmap.jpg` is a placeholder in `client/public`; replace with a proper Earth texture for nicer visuals.
