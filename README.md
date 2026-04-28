# PM Agent

AI-powered SaaS for Product Managers — roadmaps, specs, metrics, research, sprint planning, and stakeholder updates, all in one place.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript strict) |
| Styling | Tailwind CSS v4 + custom shadcn/ui primitives |
| Auth + DB | Supabase (email/password, Google OAuth, PostgreSQL) |
| Server state | TanStack Query v5 |
| Client state | Zustand |
| AI | Anthropic Claude (`claude-sonnet-4-20250514`) |
| Deployment | Vercel |

## Project Structure

```
/app
  /(auth)          → login, signup, forgot-password
  /(dashboard)     → authenticated PM workflow pages
  /api             → API route handlers
  /auth/callback   → OAuth callback
/components
  /ui              → shadcn-style primitives (Button, Card, Input…)
  /shared          → Sidebar, Header, ComingSoon, FeatureCard, QueryProvider
/modules           → one folder per PM workflow (future implementations)
/lib
  /supabase        → browser, server, and middleware clients
  /auth            → server actions for sign-in, sign-up, sign-out
  /db              → typed database query helpers
  /agents          → Claude tool-use agent chains (future)
  anthropic.ts     → callClaude() and callClaudeStream() helpers
  store.ts         → Zustand global store
  utils.ts         → cn(), formatDate(), withRetry()…
/hooks             → custom React hooks
/types             → shared TypeScript types (database + app)
/config            → app config, nav config, feature flags
/supabase
  /migrations      → SQL migration files
```

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/git00385/productmanager
cd productmanager
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
# Fill in all values — see comments in the file
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your project URL and keys into `.env.local`
3. Run the migration in the Supabase SQL editor:
   ```sql
   -- paste contents of supabase/migrations/001_initial_schema.sql
   ```
4. Enable Google OAuth in Supabase Dashboard → Authentication → Providers

### 4. Run locally

```bash
npm run dev
# http://localhost:3000
```

### 5. Deploy to Vercel

```bash
vercel --prod
```

Add all `.env.local` keys as environment variables in the Vercel project dashboard.

## Feature Flags

Toggle modules on/off in [`config/features.ts`](config/features.ts). Set a flag to `false` to hide that module from the nav.

## Adding a New Module

1. Create `/modules/your-module/` with your component logic
2. Create `/app/(dashboard)/your-module/page.tsx`
3. Add a nav entry in `config/nav.ts`
4. Add a feature flag in `config/features.ts`
5. Add the module type to the `ModuleType` union in `types/database.ts`
