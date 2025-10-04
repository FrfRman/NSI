# CosmicEye — NSI Project

This repository contains a minimal starter for CosmicEye: a React + Three.js frontend and a Node.js Express backend that fetches TLE data from CelesTrak.

Structure:
- server: Express backend (port 4000)
- client: Vite + React frontend (port 5173 by default)

Requirements:
- NPM
- In windows 11, we recommend to use this command in the terminal:
  ```bash
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
before running npm command to ensure proper permission for npm.

Getting started (Windows PowerShell):

1. Start the server
   ```bash
   cd ".\server"
   npm install
   npm run dev

2. Start the client
   ```bash
   cd ".\client"
   npm install
   npm run dev

Open the app at http://localhost:5173

Notes:
- This is a developmental server.
- The current max capacity of number of satellites shown is 149 and minimum is 1.
- Both the client and server should be running for the webpage to load
- If the website doesnt show satellite we recommend 

