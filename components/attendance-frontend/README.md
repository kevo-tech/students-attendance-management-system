# Attendance Frontend

A minimal React + TypeScript frontend for student attendance management. Includes:
- Routing (login, lecturer, student)
- Auth context (token stored in localStorage)
- API service (axios) with mock fallbacks
- Components for students table and attendance chart

Install dependencies and run in development (PowerShell):

```powershell
cd "c:\Users\kevin\components\attendance-frontend"
npm install
npm run dev -- --host    # expose on LAN for phone testing
```

Build and run the production server (serves built `dist/` and the demo API):

```powershell
cd "c:\Users\kevin\components\attendance-frontend"
npm install
npm run build
npm start
# server listens on PORT (default 4000) and serves static assets from ../dist
```

Configuration:

- Copy `.env.example` to `.env` to change `PORT` or `DIST_DIR` before running `npm start`.

Security notes:

- This demo server accepts any POSTed attendance payloads and stores them in-memory. Before using in production you should:
	- Add authentication or signed QR payloads so only valid lecturer-generated sessions are accepted.
	- Add rate-limiting and input validation (server validation is present for required fields but further checks are recommended).
	- Do not use in-memory storage for production; use a persistent database.

