# Artists for Humanity

AFH Digital Artwork Archive and Portfolio platform.

## What This App Does

- Public gallery of approved student artwork
- Student accounts with profile pages
- Artwork upload flow for guests and logged-in users
- Admin moderation queue for approve, reject, and assignment

## Stack

- Next.js 14 + TypeScript + Tailwind CSS
- NextAuth for authentication
- Prisma + Neon Postgres for data
- Cloudinary for media storage
- Vercel for deployment

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Add required environment variables in `.env.local`.

3. Generate Prisma client:

```bash
npm run db:generate
```

4. Run locally:

```bash
npm run dev
```

Open http://localhost:3000.

## Useful Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:generate
npm run db:push
npm run db:studio
```
