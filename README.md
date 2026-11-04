# TiQ-TaQ-ToQ

A tic-tac-toe quiz game for primary pupils. Tap a square, answer the question, and win the square.
The first player to make a line wins, and play continues until the board is full.

- **Pupils**: open a ready-made topic or type the game code from their teacher. Play with a friend on one device,
  or against the computer (Easy, Medium, Hard).
- **Teachers**: continue with their Google account, make question sets (multiple choice or typed answer, optional
  picture for each question), choose a timer and an end-of-game answer review, and share the game code or link.
- Interface in English, Bahasa Melayu and Chinese.

## Run it

```bash
npm install
npm run dev
```

`npm run build` makes the `dist/` folder that Vercel serves.

## Where things are

| Path | What it does |
|---|---|
| `src/main.js` | Pages for pupils (home, set-up) and the page router |
| `src/game.js` | The game: board, questions, computer opponent, timer, end page and review |
| `src/teacher.js` | Teacher log in, list of sets, question editor, picture upload |
| `src/bank.js` | Ready-made topics (Habitats, Addition, Get Dressed, General Quiz) |
| `src/i18n.js` | All interface text in English, BM and Chinese |
| `src/supabase.js` | Database connection, game codes, picture upload |
| `api/keepalive.js` | Daily call (Vercel Cron) so the free Supabase project never pauses |
| `habitat.html.html` etc. | The original single-file games, kept for reference |

## Data

Supabase project `tiqtaqtoq` (Singapore). Table `question_sets` is private to each teacher (row-level security);
pupils read one set by its code through the function `get_set_by_code`. Pictures go to the public bucket
`question-images`, each teacher in their own folder, at most 2 MB each. The app shrinks them to 800 px WebP (JPEG on Safari), names them by content so a
repeated picture is stored once, and lets devices cache them for a year.
