# Mentat Commons — Vercel-ready Next.js site (App Router + Tailwind)

## What this repo contains
- Next.js App Router site for Mentat Commons (Mentat Commons is the canonical brand).
- Tailwind CSS integrated.
- Serverless contact API (app/api/contact/route.js) using Nodemailer — requires SMTP env vars.
- Sitemap and robots.
- Placeholder OG images in `public/images/` (replace with final art).
- GitHub Action to deploy via Vercel CLI (optional).

## Setup
1. `npm install`
2. Create environment variables in Vercel or local `.env.local`:
   - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TO_EMAIL
3. `npm run dev` to run locally.

## Deploy
- Link repository to Vercel (recommended) and set environment variables on Vercel.
- Or use the provided GitHub Action (set `VERCEL_TOKEN` in GitHub Secrets).

 


