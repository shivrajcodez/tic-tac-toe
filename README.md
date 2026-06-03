# 🎮 TicTacToe — Premium Edition

A fully-featured, production-ready Tic Tac Toe game built with clean JavaScript OOP architecture and a stunning glassmorphism dark UI.

---

## ✨ Features

- **Single Player vs Computer** with 3 AI difficulty levels
  - Easy — random moves
  - Medium — strategic hybrid (block/win + 40% random)
  - Hard — **unbeatable Minimax algorithm** with alpha-beta pruning
- **Multiplayer (Player vs Player)**
- **Live Scoreboard** tracking wins and draws across rounds
- **Turn indicators** with active card highlighting
- **Win detection** with animated cell highlighting
- **Draw detection**
- **Sound effects** via Web Audio API (zero external files)
- **Smooth animations** — pop-in marks, winner pulse glow, result overlay
- **Responsive & mobile-friendly**
- **Mute toggle**

---

## 📁 Project Structure

```
tictactoe/
├── index.html                    ← Main HTML (single-page)
├── vercel.json                   ← Vercel deployment config
├── package.json                  ← Dev server scripts
├── .gitignore
├── README.md
└── src/
    ├── css/
    │   └── style.css             ← All styles (glassmorphism dark theme)
    └── js/
        ├── App.js                ← Entry point — wires everything together
        ├── config/
        │   └── AppConfig.js      ← Central constants
        ├── model/
        │   ├── Board.js          ← Board state + win/draw logic
        │   ├── Player.js         ← Player data model
        │   └── GameState.js      ← Game status tracking
        ├── service/
        │   ├── AIService.js      ← Easy/Medium/Hard AI (Minimax + alpha-beta)
        │   └── SoundService.js   ← Web Audio API sound effects
        └── controller/
            ├── GameController.js ← Game flow orchestrator
            └── UIRenderer.js     ← All DOM updates
```

---

## 🚀 Local Development

### Prerequisites
- Node.js 16+ (only needed for local dev server)
- A modern browser (Chrome, Firefox, Safari, Edge)

### Run Locally

```bash
# Install dev dependency (serve)
npm install

# Start dev server on http://localhost:3000
npm run dev
```

Or use any static file server:

```bash
# Python
python3 -m http.server 3000

# VS Code: use Live Server extension
```

> ⚠️ Must use a local server (not `file://`) because ES modules require HTTP.

---

## ☁️ Vercel Deployment

### Option A — Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy (from project root)
vercel

# Follow prompts:
#   Set up and deploy → Yes
#   Which scope? → your account
#   Link to existing project? → No
#   Project name → tictactoe-premium (or any name)
#   Directory → ./ (current)
#   Override settings? → No

# 4. Deploy to production
vercel --prod
```

Your game will be live at `https://tictactoe-premium.vercel.app` (or similar).

### Option B — GitHub + Vercel Dashboard

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit — TicTacToe Premium"
git remote add origin https://github.com/YOUR_USERNAME/tictactoe-premium.git
git push -u origin main
```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Settings:
   - **Framework Preset**: `Other`
   - **Root Directory**: `./`
   - **Build Command**: _(leave empty)_
   - **Output Directory**: `./`
5. Click **Deploy**

---

## ✅ Verification Checklist

- [ ] Game loads without errors in browser console
- [ ] Setup screen shows on load
- [ ] Mode toggle switches between `vs Computer` and `vs Player`
- [ ] P2 name input hides in vs Computer mode
- [ ] Difficulty section hides in vs Player mode
- [ ] Start button launches the game
- [ ] Cells are clickable on human turns
- [ ] Computer plays after ~650ms delay
- [ ] Win detection highlights winning cells
- [ ] Draw detection works (fill board with no winner)
- [ ] Result overlay appears on win/draw
- [ ] Scoreboard updates correctly
- [ ] "Play Again" restarts with same scores
- [ ] "New Match" resets all scores
- [ ] Sound effects play on moves/win/draw
- [ ] Mute toggle works
- [ ] Back button returns to setup
- [ ] Minimax is unbeatable on Hard
- [ ] Mobile layout works on 375px viewport
- [ ] No 404 errors for JS/CSS assets on Vercel

---

## 🏗️ Architecture Notes

The project follows a clean layered architecture:

| Layer | Files | Responsibility |
|---|---|---|
| **Model** | `Board`, `Player`, `GameState` | Pure data — no UI, no side effects |
| **Service** | `AIService`, `SoundService` | Stateless logic and side-effect services |
| **Controller** | `GameController` | Orchestrates game flow, owns model instances |
| **View** | `UIRenderer` | DOM manipulation only — receives snapshot, renders |
| **Entry** | `App.js` | Wires everything, handles user events |

---

## 🛠️ Tech Stack

- **Vanilla JS (ES Modules)** — zero dependencies, no build step needed
- **HTML5 + CSS3** — glassmorphism, CSS variables, keyframe animations
- **Web Audio API** — programmatic sound effects
- **Vercel Static Hosting** — instant global CDN deployment
