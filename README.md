# ieee-unilag-sb

Repository for IEEE Unilag Student Branch website and APIs.

## Team

This project is built and maintained by the IEEE UNILAG Student Branch web team.

**Project Lead**
- Webmaster — Otitodilichukwu Osakwe ([@tito-osakwe](https://github.com/tito-osakwe))

**Frontend Developers**
- Eyitayo Obembe
- Femi Oyetade
- Fortune Uchegbu
- Adedamola Adeyemi
- Demilade Ayeku

**Backend Developers**
- Truelife Agada
- Joshua Ike
- Semilore Omotade-Michaels

**UI/UX Design**
- Afolabi Olanrewaju

**Repository Maintainer**
- [@kxng0109](https://github.com/kxng0109)

## Structure

- `backend/` — Node/Express API (TypeScript)
- `frontend/` — Next.js app

## Backend — Quick Start

Requirements: Node 18+ and a MongoDB instance.

1. Install dependencies

```bash
cd backend
npm install
```

2. Copy environment template and update values

```bash
cp .env.example .env
# edit .env and set MONGODB_URI, PORT, NODE_ENV
```

3. Development

```bash
npm run dev
```

4. Build & start (production)

```bash
npm run build
npm start
```

### Useful scripts (in `backend/package.json`)

- `dev` — Run using `ts-node-dev` for fast reloads
- `build` — Compile TypeScript to `dist/`
- `start` — Run compiled `dist/server.js`
- `lint` — Run ESLint over TypeScript files
- `seed` — Seed the database with sample events

## Environment variables

Create `backend/.env` from `backend/.env.example`. Required variables:

- `MONGODB_URI` — MongoDB connection string
- `PORT` — server port (default: `5000`)
- `NODE_ENV` — `development` | `production`
- `FRONTEND_URL` — Comma-separated list of allowed frontend origins (production only)

See `backend/.env.example` for a template.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/api/v1/newsletter/signup` | Subscribe to newsletter |
| GET | `/api/v1/events` | Get latest 3 events |
| GET | `/api/v1/events/all` | Get all events (paginated) |
| POST | `/api/v1/events` | Create a new event |
| PUT | `/api/v1/events/:id` | Update an event |
| DELETE | `/api/v1/events/:id` | Delete an event |

## Deployment

### Backend (Render)

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your repository
4. Set build command: `npm install && npm run build`
5. Set start command: `npm start`
6. Add environment variables in the Render dashboard:
   - `MONGODB_URI` — Your MongoDB Atlas connection string
   - `PORT` — 5000
   - `NODE_ENV` — production
   - `FRONTEND_URL` — Your Vercel domain (e.g., `https://your-app.vercel.app`)
7. Deploy

### Frontend (Vercel)

1. Push your code to GitHub
2. Import the `frontend/` directory as a new project on Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` — Your Render backend URL (e.g., `https://your-app.onrender.com`)
   - `NEXT_PUBLIC_BASE_URL` — Your production domain
4. Deploy

## Contribution Workflow

Follow the existing branch/PR workflow:

```bash
git checkout dev
git pull origin dev
git checkout -b feat/your-feature
# work, commit, and push
git push origin feat/your-feature
```

Open a Pull Request targeting `dev` and include a clear description.

## Additional notes

- `.gitignore` in `backend/` now includes common lockfiles (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`) so contributors can use their preferred package manager.
- If you need help running the project locally, open an issue or ping the maintainers in the repo.
