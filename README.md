This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Supabase Database Setup

1. [Create a Supabase project](https://supabase.com/dashboard/projects) and enable the built-in Postgres database.
2. In the Database settings, copy both the **Connection Pooling** string and the **Direct connection** string.
3. Duplicate `.env.example` to `.env` and paste the values:
	- `DATABASE_URL` → use the pooler string (works well on Vercel serverless functions).
	- `DIRECT_URL` → use the direct connection string for Prisma migrations/seeding.
4. (Optional) Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` if you plan to call Supabase services directly from the client/server.
5. Run `npm run prisma:generate` and `npm run db:push` (or `npm run prisma:seed`) to sync the schema with your Supabase database.

After the variables are set you can deploy to Vercel safely—the pooled URL keeps the connection count serverless-friendly while migrations still use the direct URL locally.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# ProjectMe
# Projrct1aku
