# Frontend Railway Deployment Guide

## Setup Instructions

1. **Create a new service in Railway:**
   - Go to your Railway project
   - Click "New Service" → "GitHub Repo"
   - Select your repository
   - Choose the `frontend` branch

2. **Configure the service:**
   - Set the **Root Directory** to `frontend`
   - Railway will automatically detect Node.js and use the `nixpacks.toml` configuration

3. **Set Environment Variables:**
   - Go to the service's Variables tab
   - Add: `VITE_API_URL=https://ced-production-ca5c.up.railway.app/api`
   - (Replace with your actual backend URL)

4. **Deploy:**
   - Railway will automatically build and deploy when you push to the `frontend` branch
   - The build process will:
     - Install dependencies
     - Run TypeScript compilation
     - Build the Vite app
     - Start the preview server

## Build Process

- **Install:** `npm install`
- **Build:** `npm run build` (compiles TypeScript and builds with Vite)
- **Start:** `npm start` (serves the built files using `vite preview`)

## Notes

- The frontend runs on port 3000 by default (or Railway's assigned PORT)
- Make sure your backend CORS settings allow requests from the frontend domain
- The frontend is configured to use the backend API URL from environment variables

