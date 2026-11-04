# Decisions (not visible in the code)

- One Vercel link replaces the four separate single-file games (Habitat, Maths Addition, Get Dressed, General Quiz).
- Win rule: the first player to make a line wins; play continues until the board is full (teacher's choice).
- Wrong answer or time up: the square stays empty and the turn passes. The answer is not revealed during the game;
  the optional end-of-game review shows it.
- Teacher login: email and password, no confirmation email (Supabase free email cannot reach other teachers).
  Login links were the first choice and were dropped for that reason.
- Any teacher can sign up and make sets. Pupils never log in. No pupil names or results are stored online;
  names stay in the browser only.
- No read-aloud button: the game tests pupils' reading.
- Timer (off, 10 to 60 s) and end-of-game review are per set, chosen by the teacher. Ready-made topics: no timer, review on.
- Pictures are optional, uploaded by teachers (for picture-naming questions); no generated pictures for the bank.
- Two players on one device; online play on two devices was discussed and left out of version 1.
- Habitat questions are kept word for word (Super Minds). The General Quiz questions were rewritten as full
  sentences with British spelling ("What colour is the sky?"), and "4"/"four", "10"/"ten" are both accepted.
- Interface: English, BM, Chinese; question text stays as the teacher writes it.
- No emoji anywhere (teacher's standing rule); hand-drawn vector icons; Azim font.
