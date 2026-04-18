# Guitar Trainer

An open source, browser-based practice tool for beginner guitar players who want to memorize note positions on the fretboard. No login, no backend, no data stored — just practice.

---

## Features

- **Visual fretboard** — 6 strings, frets 1–12 plus an open string column, standard tuning E A D G B e
- **Two quiz modes:**
  - *Find the Note* — a note name and target string are shown; click the correct fret
  - *Name the Note* — a fret is highlighted; pick the correct note from four choices
- **Correct/incorrect feedback** after every answer with note reveal
- **Session score tracker** with accuracy percentage and reset
- **Free string selection** — toggle any of the 6 strings in or out of the quiz rotation at any time; at least one must stay active
- **Show Notes toggle** — reveal all note labels on the fretboard for reference, or hide them to practice from memory
- **Responsive layout** — works on phones and desktops

---

## Running Locally

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/<your-github-username>/guitar-trainer.git
cd guitar-trainer
npm install
npm run dev
```

Open `http://localhost:5173/guitar-trainer/` in your browser.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## Deploying to GitHub Pages

1. Push the repo to GitHub with the name `guitar-trainer`.
2. Go to **Settings → Pages** and set the source to **GitHub Actions**.
3. Push to `main` — the workflow in `.github/workflows/deploy.yml` will build and deploy automatically.

> The `base` in `vite.config.ts` is set to `/guitar-trainer/`. If your repo has a different name, update that value before deploying.

---

## Project Structure

```
src/
  components/     UI components (Fretboard, Quiz, ScoreDisplay, etc.)
  hooks/          useQuiz, useProgress
  types/          Shared TypeScript interfaces
  utils/          noteUtils.ts — fretboard logic and note calculations
  App.tsx
  main.tsx
```

---

## Contributing

Contributions are welcome! Some ideas for future improvements:

- Sharps vs. flats preference toggle
- Timed challenge mode
- Power chord practice mode

To contribute:

1. Fork the repo
2. Create a feature branch: `git checkout -b my-feature`
3. Commit your changes and open a Pull Request

Please keep PRs focused and TypeScript strict — no `any` types.

---

## License

MIT
