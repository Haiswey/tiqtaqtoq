# Decisions (not visible in the code)

- One Vercel link replaces the four separate single-file games (Habitat, Maths Addition, Get Dressed, General Quiz).
- Win rule: the first player to make a line wins; play continues until the board is full (teacher's choice).
- Wrong answer or time up: the square stays empty and the turn passes. The answer is not revealed during the game;
  the optional end-of-game review shows it.
- Teacher login: "Continue with Google" only (teacher's choice, 2026-11-04); the first log in creates the account.
  Email login links were dropped because Supabase's free email cannot reach other teachers; email + password was
  used briefly and replaced by Google before any teacher signed up.
- The login uses Google's own sign-in button on our page (Google Identity Services + Supabase signInWithIdToken), so
  Google names tiqtaqtoq.vercel.app instead of the Supabase address, which the teacher feared would look untrustworthy.
  The redirect log in stays as a fallback if Google's script cannot load. A custom domain (about RM40-60 a year)
  would let Google show the app name later; Supabase's paid custom domain was rejected as too costly.
- Any teacher can sign up and make sets. Pupils never log in. No pupil names or results are stored online;
  names stay in the browser only.
- No read-aloud button: the game tests pupils' reading.
- Timer (off, 10 to 60 s) and end-of-game review are per set, chosen by the teacher. Ready-made topics: no timer, review on.
- Pictures are optional, uploaded by teachers (for picture-naming questions); no generated pictures for the bank.
- To save the free Supabase storage and download allowance (2026-11-04): pictures are shrunk to 800 px (WebP 0.75,
  JPEG 0.8 on Safari), named by their content so a repeated picture is stored once, and cached by devices for a year.
  A picture is deleted only when none of the teacher's saved sets uses it. Per-set and per-teacher picture limits were
  suggested and left for later, until many teachers use the app.
- Two players on one device; online play on two devices was discussed and left out of version 1.
- Habitat questions are kept word for word (Super Minds). The General Quiz questions were rewritten as full
  sentences with British spelling ("What colour is the sky?"), and "4"/"four", "10"/"ten" are both accepted.
- Interface: English, BM, Chinese; question text stays as the teacher writes it.
- No emoji anywhere (teacher's standing rule); hand-drawn vector icons; Azim font.
- Ready-made textbook sets use only the language of the one unit that teaches the point (teacher, 2026-11-08:
  "don't mix units"). First one: "a or an", Super Minds 1 Unit 2 (p.25), 16 two-button questions, 8 a / 8 an,
  built only from Unit 2 toys, the p.25 adjectives and colours. Reading only, no pictures.
