# Handoff

_Last update: 2026-11-04_

## Where we are
- Version 1 built: pupil games (topics and game codes, friend or computer), teacher accounts, question editor with
  pictures, timer and review options, three interface languages.
- Supabase project `tiqtaqtoq` (ref `dtomacgviokomomwqagr`, org "ihaiswey-collab's"), Vercel project `tiqtaqtoq`
  (team haisweys-projects), GitHub `Haiswey/tiqtaqtoq` (main). Every push to main redeploys.

## Next steps
- Teacher must switch off **Confirm email** in Supabase (Authentication, Sign In / Providers, Email) or sign-ups fail.
- Teacher to test sign-up, a set with pictures, and play on a real phone.

## Cautions
- Supabase's built-in email only reaches members of the organisation, so no email features (login links,
  password reset). A forgotten password is reset by the admin in the Supabase dashboard (Authentication, Users).
- Keep-alive: `api/keepalive.js` runs daily via Vercel Cron (`vercel.json`). If it stops, the free project pauses after a week.
