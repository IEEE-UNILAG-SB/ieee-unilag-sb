# Deployment Guide — IEEE UNILAG SB

## Prerequisites

- GitHub account (you have this)
- MongoDB Atlas account (free)
- Render account (free)
- Vercel account (free)

---

## Step 1: MongoDB Atlas (Free)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Sign up
2. Create a new project (e.g., `ieee-unilag-sb`)
3. Build a new cluster → **M0 Free Tier**
4. Choose a region closest to you (e.g., Lagos, Nigeria)
5. Create a database user (username + password)
6. Add your IP address to IP Access List (or `0.0.0.0/0` for all)
7. Click **Connect** → **Connect your application**
8. Copy the connection string — it looks like:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/ieee-unilag-sb
   ```

**Save this — you'll need it for Render.**

---

## Step 2: Merge Branches on GitHub

1. Go to [github.com/IEEE-UNILAG-SB/ieee-unilag-sb](https://github.com/IEEE-UNILAG-SB/ieee-unilag-sb)
2. Merge `chore/pre-deployment-hardening` into `dev`
3. Merge `fix/security-updates` into `dev`
4. Then merge `dev` into `main` (or just deploy from `dev`)

---

## Step 3: Deploy Backend to Render (Free)

1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Click **New** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name:** `ieee-unilag-sb-backend`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free
5. Add environment variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGODB_URI` = (your Atlas connection string from Step 1)
   - `FRONTEND_URL` = (your Vercel URL from Step 4 — set this after)
6. Click **Create Web Service**
7. Wait for deploy to finish (~2-3 minutes)
8. Copy your Render URL: `https://ieee-unilag-sb-backend.onrender.com`

---

## Step 4: Deploy Frontend to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **Add New** → **Project**
3. Import your GitHub repo
4. **Root Directory:** Set to `frontend`
5. Configure environment variables:
   - `NEXT_PUBLIC_API_URL` = `https://ieee-unilag-sb-backend.onrender.com`
   - `NEXT_PUBLIC_BASE_URL` = `https://your-vercel-url.vercel.app`
6. Click **Deploy**
7. Wait for deploy to finish (~1-2 minutes)
8. Copy your Vercel URL

---

## Step 5: Update Render CORS

1. Go back to your Render dashboard
2. Add/update `FRONTEND_URL` with your Vercel URL
3. Redeploy (or it auto-redeploys on env change)

---

## Step 6: Keep Backend Warm (GitHub Actions)

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add a new repository secret:
   - **Name:** `RENDER_APP_URL`
   - **Value:** `ieee-unilag-sb-backend.onrender.com`
3. The `.github/workflows/keep-warm.yml` will ping your backend every 10 minutes

---

## Step 7: Seed Production Database

1. Go to your Render dashboard → your backend service → **Shell**
2. Run:
   ```bash
   npm run seed
   ```
3. This populates your production database with sample events

---

## Step 8: Connect Domain (Optional)

1. Buy a domain (e.g., Namecheap, GoDaddy) or use a free subdomain
2. In Vercel: **Settings** → **Domains** → Add your domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_BASE_URL` in Vercel env vars
5. Update `FRONTEND_URL` in Render env vars

---

## Verification

| Check | URL |
|-------|-----|
| Backend health | `https://your-render-url/` |
| Backend events | `https://your-render-url/api/v1/events` |
| Frontend | `https://your-vercel-url/` |
| Frontend about | `https://your-vercel-url/about` |
| Frontend membership | `https://your-vercel-url/membership` |
| Frontend contact | `https://your-vercel-url/contact` |
