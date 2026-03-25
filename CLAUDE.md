# Layoff-Chess - AI Chess Application

## Role
Act as a **mentor and code reviewer**, not a code generator. Guide Rahul through building this project with best practices. Teach concepts, point out mistakes, suggest improvements, and track progress.

---

## Tech Stack
- **Frontend:** React 19 + TypeScript, TanStack Router, Zustand, Chess.js, React-Chessboard, Tailwind CSS, Shadcn UI, Vite
- **Backend:** Express 5 + TypeScript, WebSocket (ws), Prisma 7, PostgreSQL (Neon), Clerk Auth, JWT
- **Auth:** Clerk (OAuth) + Guest mode (JWT)
- **Planned:** Redis (pub/sub, caching), Stockfish (AI engine), BullMQ (job queue), MongoDB (puzzles)

## Project Structure
```
client/src/
  routes/          # TanStack file-based routing
  components/ui/   # Shadcn components
  hooks/           # useSocket custom hook
  store/           # Zustand auth store
  lib/             # Utilities

server/src/
  Game.ts          # Single game logic (chess.js, move validation, timers, DB persistence)
  GameManager.ts   # Multi-game orchestration, matchmaking queue, message routing
  SocketManager.ts # WebSocket singleton, room management, broadcasting
  routes/          # Express API routes
  controllers/     # Request handlers
  config/          # App configuration
  prisma/          # Database schema & migrations
```

## Key Commands
```bash
# Client
cd client && npm run dev        # Start frontend (port 5173)

# Server
cd server && npm run dev        # Start backend (port 3000)
cd server && npx prisma studio  # Database GUI
cd server && npx prisma generate # Regenerate Prisma client
```

## Database
- PostgreSQL hosted on Neon
- 3 models: User, Game, Move
- Enums: Role, GameStatus, GameResult, TimeControl

---

## User Stories

### 1. Authentication & User System
- [x] 1a. Sign up using email or OAuth (Clerk integration done)
- [x] 1b. Log in securely (Clerk + Guest JWT done)
- [ ] 1c. Log out securely on shared devices
- [ ] 1d. Profile page with rating, games played, win/loss stats
- [ ] 1e. Upload profile picture

### 2. Matchmaking & Lobby System
- [x] 2a. Create a new online game
- [ ] 2b. Join game using link or code (invite friends)
- [x] 2c. See when another player joins (INIT_GAME broadcast)
- [ ] 2d. Matched with random opponent of similar skill (Elo-based)
- [ ] 2e. Choose time controls (blitz, rapid, classical)

### 3. Core Gameplay (Non-Negotiable)
- [x] 3a. Move pieces on the board (drag-and-drop + click-to-move)
- [x] 3b. Opponent moves appear instantly (WebSocket real-time sync working)
- [x] 3c. Illegal moves blocked (chess.js validation done)
- [x] 3d. See whose turn it is (border highlight on active player)
- [x] 3e. Game ends on checkmate/stalemate/draw (toast notifications)
- [ ] 3f. Move history panel
- [ ] 3g. Undo moves in practice mode
- [x] 3h. Visual highlights for legal moves (dot indicators on valid squares)

### 4. Human vs AI Mode
- [ ] 4a. Play against AI (Stockfish)
- [ ] 4b. AI responds automatically after player move
- [ ] 4c. Choose AI difficulty level
- [ ] 4d. AI plays different styles (aggressive, defensive)

### 5. AI Suggestion / Co-Pilot Mode (Differentiator)
- [ ] 5a. Request a suggested move
- [ ] 5b. Suggested move highlighted on board (arrow)
- [ ] 5c. Confidence score / evaluation for suggestion
- [ ] 5d. Short explanation of why the move is good

### 6. AI vs AI (Spectator Mode)
- [ ] 6a. Watch two AIs play against each other
- [ ] 6b. Control speed of AI vs AI games
- [ ] 6c. Pause and resume AI games

### 7. Spectator Mode
- [ ] 7a. Watch ongoing games
- [ ] 7b. See player names, ratings, timers
- [ ] 7c. Chat or reactions while spectating

### 8. Chat & Social
- [ ] 8a. Chat with opponent during game
- [ ] 8b. Emojis / reactions
- [ ] 8c. Mute chat

### 9. Game History & Analysis
- [ ] 9a. Completed games saved and revisitable
- [ ] 9b. Replay games move by move
- [ ] 9c. AI points out blunders and best moves post-game
- [ ] 9d. Summary of strengths and weaknesses

### 10. Core Puzzle Experience
- [ ] 10a. List of chess puzzles
- [ ] 10b. Puzzle difficulty/rating shown
- [ ] 10c. Attempt puzzle by making moves
- [ ] 10d. Immediate correct/incorrect feedback
- [ ] 10e. Auto-play opponent response in puzzle
- [ ] 10f. Puzzle ends on correct solution

### 11. AI-Generated Puzzles
- [ ] 11a. Puzzles generated from real game positions
- [ ] 11b. Puzzles based on player skill level
- [ ] 11c. Unique puzzles (no repeats)
- [ ] 11d. Puzzles tagged by tactic (fork, pin, mate in 2, etc.)

### 12. Difficulty, Rating & Progression
- [ ] 12a. Puzzles have ratings
- [ ] 12b. Puzzle-solving rating tracks performance
- [ ] 12c. Puzzle streak tracking
- [ ] 12d. Unlock harder puzzles with improvement

### 13. Learning & Explanation Layer
- [ ] 13a. AI explains why correct move is best
- [ ] 13b. AI explains why wrong move is bad
- [ ] 13c. Show alternative lines

### 14. Custom Puzzle Modes
- [ ] 14a. Checkmate-only puzzles
- [ ] 14b. Endgame-only puzzles
- [ ] 14c. Puzzles from player's own games

### 15. Daily Challenges & Engagement
- [ ] 15a. Daily puzzle
- [ ] 15b. Notification when daily puzzle available
- [ ] 15c. Compare performance with others

### 16. Performance & Reliability
- [x] 16a. Moves reflected instantly
- [ ] 16b. Game recovers on internet drop
- [x] 16c. Rejoin ongoing game after refresh (game state restored from DB)

### 17. Admin / System
- [ ] 17a. Monitor active games
- [ ] 17b. See connected users
- [ ] 17c. Ban abusive users
- [ ] 17d. Review AI-generated puzzles
- [ ] 17e. Disable bad puzzles
- [ ] 17f. See most-failed puzzles

---

## Version Roadmap

### v0.1 — "Skeleton Alive" (COMPLETED)
> Goal: The system breathes. Nothing fancy. But it is alive.

- [x] Initialize Node + TS project
- [x] Setup Express server
- [x] Setup WebSocket server
- [x] Setup JWT middleware
- [x] Verify token on WS connect
- [x] Log "user connected" on connect
- [x] Setup Postgres (Neon) + Prisma
- [x] Create React app (Vite)
- [x] Add login page (Clerk + Guest)
- [x] Add JWT storage (Zustand + localStorage)
- [x] Connect WebSocket from client
- **Acceptance:** Open browser → login → WebSocket connected. **PASSED.**

### v0.2 — "Playable Chess (Human vs Human)" (IN PROGRESS)
> Goal: Two tabs can play chess in real-time.

**Backend (Done):**
- [x] Create games table (Prisma)
- [x] Create moves table (Prisma)
- [x] Install chess.js
- [x] Build GameManager class
- [x] Implement INIT_GAME event
- [x] Implement MOVE event
- [x] Validate moves using chess.js
- [x] Save move in Postgres
- [x] Broadcast move to opponent
- [x] Guest user matchmaking (pending queue)

**Frontend (Done):**
- [x] Render chessboard with react-chessboard
- [x] Handle piece drag-and-drop → send MOVE via WebSocket
- [x] Update board on opponent's move (MOVE message handler)
- [x] Show whose turn it is (border highlight)
- [ ] Render move history list
- [x] Handle game end (checkmate/stalemate toast notifications)
- [ ] Add game timer display (countdown clocks)
- [ ] Add pawn promotion piece selection UI

**Bugs fixed during v0.2:**
- [x] Fix `message.playload` typo in GameManager.ts → `message.payload`
- [x] Fix player 2 time tracking bug in Game.ts (makeMove + getPlayer2TimeConsumed)
- [x] Add `expiresIn` to JWT tokens (using Number(JWT_EXPIRES_IN) from appConfig)

**Acceptance:** Two browsers, same gameId, real-time sync, legal move enforcement. Play a full game to completion. **PASSED.**

**Remaining v0.2 cleanup (before moving to v0.3):**
- [ ] Fix: click-to-move doesn't send move to server (onSquareClick missing socket.send)
- [ ] Fix: isPromoting uses chess.history() instead of chess.moves() on client
- [ ] Remove nested try/catch and commented-out code in onPieceDrop
- [ ] Remove debug console.logs before committing
- [ ] Use gameAdded state to show "Waiting for opponent..." or remove unused state

### v0.3 — "Robust Realtime (No Jank)"
> Goal: It doesn't break when users behave like users.

- [ ] Handle disconnect event gracefully
- [ ] Handle reconnect → send current game state
- [ ] On browser refresh → rejoin game automatically
- [ ] Rehydrate board state from server
- [ ] Show "Reconnecting..." indicator
- [ ] Add WebSocket heartbeat/ping-pong
- [ ] Input validation on all WebSocket messages
- [ ] Error handling on socket.send()
- [ ] Add Redis pub/sub per game (scaling prep)
- [ ] Redis lock to prevent double move processing
- **Acceptance:** Refresh mid-game and continue without corruption.

### v0.4 — "AI Comes Alive"
> Goal: You are now playing against a machine.

- [ ] Create separate ai-worker service
- [ ] Install and spawn Stockfish process
- [ ] Send FEN to Stockfish, parse best move
- [ ] Create job queue (BullMQ) for AI move requests
- [ ] Receive AI result, apply via GameManager
- [ ] Add "Play vs AI" button in UI
- [ ] Handle AI move updates on board
- [ ] AI difficulty selection
- **Acceptance:** You move → AI responds. That's the magic moment.

### v0.5 — "AI Co-Pilot (Suggestion Mode)"
> Goal: AI helps you think, not just play.

- [ ] Implement AI_SUGGEST_REQUEST event
- [ ] Send FEN to Stockfish worker, get best move + evaluation
- [ ] Integrate Gemini/Claude for move explanation text
- [ ] Add "Suggest Move" button in UI
- [ ] Draw suggestion arrow on board
- [ ] Show explanation panel with confidence score
- **Acceptance:** Click suggest → see arrow + explanation text.

### v0.6 — "Puzzle System"
> Goal: You are now a learning platform.

- [ ] Setup MongoDB for puzzles collection
- [ ] Insert sample puzzles
- [ ] Implement PUZZLE_REQUEST / PUZZLE_MOVE events
- [ ] Validate puzzle moves server-side
- [ ] Create puzzle page with board
- [ ] Handle move submission + correct/incorrect feedback
- [ ] Puzzle difficulty ratings
- **Acceptance:** Solve a puzzle and get feedback.

### v0.7 — "AI Puzzle Generation"
> Goal: The system generates its own content.

- [ ] Feed game positions to Stockfish to detect tactical moments
- [ ] Generate solution lines
- [ ] Call AI for explanation text
- [ ] Save generated puzzles to MongoDB
- [ ] Background job scheduler for periodic generation
- **Acceptance:** New puzzles appear without manual insertion.

### v1.0 — "Polish & Stability"
> Goal: Feels like a product, not a project.

- [ ] Loading states everywhere
- [ ] Error states and user feedback (toasts)
- [ ] Disable illegal interactions in UI
- [ ] Responsive design (mobile)
- [ ] Profile page with stats
- [ ] Game history page
- [ ] Spectator mode
- [ ] Chat system
- [ ] Admin dashboard
- [ ] Tests (unit + integration)
- [ ] CI/CD pipeline
- [ ] Deploy to production

---

## Known Bugs
1. ~~**Typo in GameManager.ts**: `message.playload` should be `message.payload`~~ — FIXED
2. ~~**Time tracking bug in Game.ts**: Player 2 time consumption copies player 1 logic~~ — FIXED
3. ~~**JWT tokens have no expiration**: Guest tokens live forever~~ — FIXED (uses Number(JWT_EXPIRES_IN) from appConfig)
4. **Token in WebSocket URL**: Visible in server logs — consider subprotocol auth instead

## Code Quality Issues to Address
- No input validation on WebSocket messages
- No error handling on socket.send() calls
- No heartbeat/ping-pong for stale connection detection
- Rate limiting is commented out
- Hardcoded URLs (localhost) — use env vars
- `dist/` folder is tracked in git — add to .gitignore
- No tests anywhere in the project

---

## Mentoring Notes

### What Rahul Is Doing Well
- Clean separation of concerns (Game / GameManager / SocketManager)
- Good use of TypeScript enums for game states
- Prisma schema is well-designed with proper indexes
- Using modern, industry-standard tools (TanStack Router, Zustand, Shadcn)
- Atomic DB operations with Prisma transactions
- Thinks in systems, not just features — asks the right architectural questions
- Extracted constants/types to shared `consts/` folder — clean imports
- Root route is thin (providers only) — layout routes handle UI
- Uses `useRef` for Chess instance to avoid re-creation on re-renders
- Asks "why" before using tools (cookies, axios, env vars) — learns concepts, not just syntax

### Areas to Grow
- **Error handling**: Senior devs handle every failure path. What if DB write fails? What if socket.send throws?
- **Input validation**: Never trust data from the client. Validate every WebSocket message shape.
- **Security mindset**: Token expiration, rate limiting, input sanitization
- **Testing**: Even basic unit tests for Game.ts would catch bugs early
- **Git hygiene**: Don't commit `dist/`, `.env`, or `node_modules`. Use `.gitignore` properly.
- **Code comments**: Not every line — but complex logic (timer math, matchmaking flow) deserves a brief explanation of "why"

---

## Daily Practice Rule
Every session:
1. Pick the current version
2. Pick 3-5 checkboxes
3. Do only those
4. Stop

checkbox → checkbox → checkbox = momentum = project gets finished.
