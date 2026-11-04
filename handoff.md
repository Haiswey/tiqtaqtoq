# Handoff

_Last update: 2026-11-04_

## Where we are
- Version 1 built: pupil games (topics and game codes, friend or computer), teacher accounts, question editor with
  pictures, timer and review options, three interface languages.
- Supabase project `tiqtaqtoq` (ref `dtomacgviokomomwqagr`, org "ihaiswey-collab's"), Vercel project `tiqtaqtoq`
  (team haisweys-projects), GitHub `Haiswey/tiqtaqtoq` (main). Every push to main redeploys.

## Next steps
- Google log in is set up (2026-11-04): Google Cloud project `tiq-taq-toq` (account iyewsiah@gmail.com), consent
  screen External and In production, OAuth client "TiQ-TaQ-ToQ Supabase"; Supabase Google provider on, Site URL
  `https://tiqtaqtoq.vercel.app`, redirect URLs `https://tiqtaqtoq.vercel.app/**` and `http://localhost:5174/**`.
  Authorized JavaScript origins: https://tiqtaqtoq.vercel.app, http://localhost:5174, http://localhost (for the
  Google sign-in button). The fallback redirect log in still names dtomacgviokomomwqagr.supabase.co.
- Teacher to test log in, a set with pictures, and play on a real phone.

## Cautions
- Supabase's built-in email only reaches members of the organisation, so no email features; Google log in avoids them.
- DELIMa (school Google Workspace) admins can block outside apps; if a DELIMa account is refused, use a Gmail account.
- Keep-alive: `api/keepalive.js` runs daily via Vercel Cron (`vercel.json`). If it stops, the free project pauses after a week.
