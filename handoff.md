# Handoff

_Last update: 2026-11-04_

## Where we are
- Version 1 built: pupil games (topics and game codes, friend or computer), teacher accounts, question editor with
  pictures, timer and review options, three interface languages.
- Supabase project `tiqtaqtoq` (ref `dtomacgviokomomwqagr`, org "ihaiswey-collab's"), Vercel project `tiqtaqtoq`
  (team haisweys-projects), GitHub `Haiswey/tiqtaqtoq` (main). Every push to main redeploys.

## Next steps
- Teacher sets up Google log in: a Google Cloud OAuth client (redirect URI
  `https://dtomacgviokomomwqagr.supabase.co/auth/v1/callback`), its ID and secret pasted into Supabase
  (Authentication, Sign In / Providers, Google), consent screen published, and Supabase URL Configuration with
  Site URL `https://tiqtaqtoq.vercel.app` and redirect URLs `https://tiqtaqtoq.vercel.app/**`, `http://localhost:5174/**`.
  Until then the button says "Google log in is not ready yet".
- Teacher to test log in, a set with pictures, and play on a real phone.

## Cautions
- Supabase's built-in email only reaches members of the organisation, so no email features; Google log in avoids them.
- DELIMa (school Google Workspace) admins can block outside apps; if a DELIMa account is refused, use a Gmail account.
- Keep-alive: `api/keepalive.js` runs daily via Vercel Cron (`vercel.json`). If it stops, the free project pauses after a week.
