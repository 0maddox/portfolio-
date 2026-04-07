# Portfolio Project

A full-stack personal portfolio built with React + Vite on the frontend and Express on the backend.

The project includes:
- Multi-page portfolio sections (Home, About, Skills, Projects, Contact)
- Admin login with session-based authentication
- Profile image editing with crop/zoom and live preview
- Project media upload and carousel interactions
- Resume and asset uploads (images, PDF, text/doc formats)
- GitHub API integration for dynamic content

## Tech Stack

Frontend:
- React 19
- Vite 8
- Framer Motion
- React Router
- react-easy-crop

Backend:
- Express 5
- express-session
- multer
- bcryptjs
- cors

## Project Structure

- src/: React app source (pages, components, styles, context)
- public/: static public assets
- uploads/: runtime uploaded files
- server.js: Express API + static hosting for production build
- vite.config.js: local dev proxy for /api and /uploads

## Requirements

- Node.js 20+ (22+ recommended)
- npm 10+

## Getting Started

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Start frontend dev server:

```bash
npm run dev
```

4. Start backend server in a second terminal:

```bash
npm run server
```

Local URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

Notes:
- Vite proxies /api and /uploads to the backend in development.
- Keep both frontend and backend running during local development.

## Available Scripts

- npm run dev: starts Vite development server
- npm run server: starts Express backend
- npm run build: builds production frontend into dist/
- npm run preview: previews built frontend locally
- npm run lint: runs ESLint

## How Build Works

For production, this project serves a built React app from Express.

Build command:

```bash
npm run build
```

This generates the dist/ folder, and server.js serves dist/index.html for SPA routing.

## Run in Production Locally

1. Build the app:

```bash
npm run build
```

2. Start server:

```bash
npm run server
```

3. Open:

- http://localhost:5000

## Deployment Guide

This project can be deployed as a single Node service (recommended for current setup).

### Option A: Render / Railway / Fly.io (Single Service)

Set these commands:

- Build Command:

```bash
npm install && npm run build
```

- Start Command:

```bash
npm run server
```

Environment:
- PORT is usually provided by host automatically.

Important:
- uploads/ is local disk storage. On many cloud platforms this is ephemeral.
- If you need permanent uploads, move files to cloud object storage (for example S3, Cloudinary, Supabase Storage, etc.).

### Option B: Frontend + Backend Split

You can also deploy:
- Frontend to Vercel/Netlify (static dist output)
- Backend to Render/Railway/Fly.io

If split deployment is used:
- Update frontend API calls to point to backend domain.
- Configure CORS securely for your deployed frontend origin.

## Security Checklist Before Production

- Replace hardcoded session secret in server.js with an environment variable.
- Move admin credentials to a secure database or auth provider.
- Set secure cookie options for HTTPS:
	- cookie.secure = true
	- sameSite and domain settings as needed
- Add request rate limiting on auth endpoints.
- Validate and sanitize uploaded files and set file size limits.

## API Endpoints (Current)

Auth/session:
- POST /api/login
- POST /api/logout
- GET /api/check-session
- POST /api/forgot-password
- POST /api/reset-password

Data:
- GET /api/data
- POST /api/data

Uploads:
- POST /api/upload
- GET /uploads/:filename

## Troubleshooting

If login/upload fails:
- Make sure backend is running on port 5000.
- Confirm you are calling frontend on the Vite dev URL in development.
- Check server logs for multer validation errors.

If page appears blank in production:
- Ensure npm run build completed successfully.
- Ensure dist/ exists and server starts without errors.

If uploaded files disappear after redeploy:
- Your host likely has ephemeral storage.
- Use persistent object storage for uploads.

## Future Improvements

- Move persistence from in-memory data to PostgreSQL
- Add Rails backend migration path if needed
- Add CI pipeline for lint/build/test/deploy
- Add environment-based config and secrets management
