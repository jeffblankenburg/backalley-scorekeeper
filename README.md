# Back Alley Scorekeeper

A mobile-first Progressive Web App (PWA) for scoring **Back Alley**, a five-player trick-taking card game. Built for real game nights — fast entry, automatic scoring, audible standings, and full game history.

Live at **[backalleyscore.com](https://backalleyscore.com)**

---

## Screenshots

### Home Screen

<p align="center">
  <img src="public/screenshots/Screenshot%202026-02-10%20at%209.32.38%20AM.png" alt="Home screen" width="300" />
</p>

The home screen gives you quick access to everything: start a **New Game**, review **History**, check your **Stats**, or **Manage Players** (your friends list). The bottom navigation bar provides persistent access to all major sections. Dark mode is on by default.

### Scoresheet

<p align="center">
  <img src="public/screenshots/Screenshot%202026-02-10%20at%209.33.40%20AM.png" alt="Empty scoresheet" width="300" />
</p>

The scoresheet is the heart of the app. All 20 rounds are displayed in a scrollable grid, with player initials across the top and hand sizes down the left side. The current round is highlighted in blue with an **Enter Bids** button. The **# column** shows hand size for each round, the **T** column shows the trump suit, and the **&Sigma;** column shows cumulative total bids. The footer row shows each player's running score as bid/tricks. An **Announce Scores** button at the bottom reads standings aloud using your device's text-to-speech.

### Trump Suit Selection

<p align="center">
  <img src="public/screenshots/Screenshot%202026-02-10%20at%209.34.00%20AM.png" alt="Trump suit selection" width="300" />
</p>

Before bidding begins, the dealer selects the trump suit for the round. The overlay shows the round info (card count and dealer name) with a 2&times;2 grid of suit buttons: Hearts, Diamonds, Clubs, and Spades. Red suits get red borders, black suits get slate borders.

### Bid Entry

<p align="center">
  <img src="public/screenshots/Screenshot%202026-02-10%20at%209.34.12%20AM.png" alt="Bid entry" width="300" />
</p>

Each player's bid is entered one at a time using a number pad. The screen shows the player's name, how many bids have been entered so far (e.g., "Bids: 0 / 10 cards"), and progress dots for all five players. Numbers range from 0 to the hand size for that round. A **Board** button is available for players making a board bid (going for all tricks). A **Back** button lets you correct the previous player's bid.

### Round Info Panel

<p align="center">
  <img src="public/screenshots/Screenshot%202026-02-10%20at%209.34.37%20AM.png" alt="Bids entered with round info" width="300" />
</p>

After all bids are entered, the scoresheet shows each player's bid in their column. The round info panel at the bottom displays the **lead player** (the player to the left of the dealer), the **trump suit** (shown with a colored suit icon), and the **bid total** compared to the hand size. If total bids exactly equal the hand size, it's marked as **Even** in green — meaning someone at the table is going to miss their bid. Tap **Enter Tricks** when the hand is played out.

### Completed Round

<p align="center">
  <img src="public/screenshots/Screenshot%202026-02-10%20at%209.34.59%20AM.png" alt="Completed round with scores" width="300" />
</p>

After tricks are entered, the scoresheet shows bid/tricks (e.g., "3/3") and the calculated score below. The footer row updates with cumulative scores. The next round's **Enter Bids** button appears automatically. Scores are color-coded: green for made bids, red for missed bids. Board bids are prefixed with a "B" indicator, and zero bids with a "0".

---

## Rules of Back Alley

Back Alley is a trick-taking card game for exactly **5 players** using a standard 52-card deck.

### Round Structure

A full game consists of **20 rounds**. The hand sizes follow a down-and-back pattern:

```
10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
```

The deal rotates clockwise each round. Before dealing, the dealer selects a **trump suit** (Hearts, Diamonds, Clubs, or Spades) by turning over the top card from the leftover cards in the deck.

### Bidding

After looking at their cards, each player bids the number of tricks they expect to win (from 0 up to the hand size). Bids are entered in order starting with the player to the left of the dealer.

### Playing Tricks

The player that had the highest bid leads for the first hand. (In the event of a tie, it's the player that made the highest bid first.) Standard trick-taking rules apply: you must follow the lead suit if you can; otherwise, you may play any card. Trump cards beat non-trump cards. The winner of each trick leads the next.  You may not lead a trump card unless you only have trump cards in your hand, or a player has played a trump card on a trick.

### Scoring

There are several types of bids, each with different scoring:

#### Normal Bid (1 or more tricks)

| Outcome | Score |
|---------|-------|
| **Made** (took at least as many tricks as bid) | `3 x bid + overtricks` |
| **Missed** (took fewer tricks than bid) | `-3 x bid` |

*Example:* Bid 3, took 4 = 3&times;3 + 1 = **10 points**
*Example:* Bid 3, took 2 = -3&times;3 = **-9 points**

#### Zero Bid (bid 0 tricks)

| Outcome | Score |
|---------|-------|
| **Made** (took 0 tricks) | **0 points** |
| **Missed** (took any tricks) | `+1 per trick` |

*Example:* Bid 0, took 0 = **0 points**
*Example:* Bid 0, took 2 = **+2 points**

#### Board Bid (going for all tricks)

A board bid is a declaration that you will take **every trick** in the round. There are 5 levels of board bids, each with increasing risk and reward. Progressive levels can only happen if a player before you has declared board as well.

| Level | Multiplier per Trick | Made | Missed |
|-------|---------------------|------|--------|
| 1 | 6 | `6 x hand size` | `-6 x hand size` |
| 2 | 12 | `12 x hand size` | `-12 x hand size` |
| 3 | 18 | `18 x hand size` | `-18 x hand size` |
| 4 | 24 | `24 x hand size` | `-24 x hand size` |
| 5 | 30 | `30 x hand size` | `-30 x hand size` |

*Example:* Level 1 board in a 10-card round: Made = 6&times;10 = **60 points**, Missed = **-60 points**
*Example:* Level 3 board in a 5-card round: Made = 18&times;5 = **90 points**, Missed = **-90 points**

#### Rainbow Bonus

During 4-card rounds only, if a player is dealt one card of each suit (a "rainbow" hand), they receive an **+8 point bonus** added to their score for that round regardless of the outcome.

#### JoeBow Bonus

During 4-card rounds only, if a player is dealt all of the suits *except the trump suit*, this is considered a JoeBow.  There's no bonus or penalty for achieving this, but it's not a good hand.

### Winning

The player with the **highest cumulative score** after all 20 rounds wins the game.

---

## Features

### Game Management
- **New Game Setup** — Select 5 players from your friends list, choose the starting dealer, and begin
- **Live Scoresheet** — Full 20-round grid with real-time score tracking, color-coded results, and automatic cumulative totals
- **Guided Entry Flow** — Step-by-step overlays walk you through trump suit selection, bid entry, and trick entry for each round
- **Board Bids** — Full support for all 5 board bid levels with correct multiplier scoring
- **Rainbow Detection** — Toggle for 4-card round rainbow hands with automatic +8 bonus
- **Announce Scores** — Text-to-speech reads the current standings aloud after each round using the Web Speech API, with 5 themed voice styles (Default, Explicit, Military, Royalty, Pirate)
- **Auto-Save** — Games save automatically to the cloud with 300ms debounced writes; only changed rounds are updated

### Friends & Profiles
- **Friends List** — Search for existing users by name and add them as friends
- **Invite by Email** — Send email invitations to people who don't have an account yet
- **Profile Page** — Edit your display name, toggle dark mode, and choose your standings announcement theme

### History & Stats
- **Game History** — Browse all completed and in-progress games, with date, player names, and final scores
- **Game Detail** — Tap any game to see the full round-by-round scoresheet in read-only mode
- **Delete Games** — Game creators can delete invalid games (removes all associated data)
- **Personal Stats** — Your performance compared to system averages: win rate, bid accuracy, average score per round, board bid success rate
- **Score Trends** — Line chart showing your cumulative score trajectory over recent games with a rolling average
- **Performance by Hand Size** — Chart comparing your average score at each hand size versus the system average

### Account & Admin
- **Magic Link Auth** — Passwordless email login via Supabase with PKCE flow
- **Admin Panel** — Admin users can manage all accounts: edit names, grant/revoke admin status, disable/enable accounts, and see invited vs. confirmed status
- **Dark Mode** — Class-based dark mode that defaults to dark, togglable from the Profile page

### Progressive Web App
- **Installable** — Add to your home screen on iOS or Android for an app-like experience
- **Offline-Capable** — Service worker caches the app shell for fast loads
- **Mobile-First** — Designed for 400px-wide phone screens with touch-friendly inputs

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 |
| State | Zustand (persisted to localStorage) |
| Backend | Supabase (Postgres + Auth + Row-Level Security) |
| Charts | Recharts |
| PWA | vite-plugin-pwa |
| Routing | React Router v7 (HashRouter) |
| Testing | Vitest + Testing Library |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Installation

```bash
git clone https://github.com/jeffblankenburg/backalley.com.git
cd backalley.com
npm install
```

### Environment Variables

Create a `.env.local` file at the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SITE_URL=http://localhost:5173
```

For production, set `VITE_SITE_URL` to your deployed domain (e.g., `https://backalleyscore.com`).

### Database Setup

Run the migration files in `supabase/migrations/` against your Supabase project in order. These create the required tables (`profiles`, `games`, `game_players`, `rounds`, `player_rounds`), row-level security policies, and triggers (including automatic profile creation on user signup).

### Development

```bash
npm run dev       # Start dev server at localhost:5173
npm run test      # Run test suite
npm run build     # Type-check + production build
npm run preview   # Preview production build locally
```

---

## Project Structure

```
src/
  components/       # UI components organized by feature
    auth/           # AuthGuard, login flow
    game/           # Scoresheet, entry overlays, score grid
    history/        # Game history list, round table
    layout/         # AppShell, BottomNav, header
    players/        # Friends list, search, invite form
    setup/          # Game setup form, player selector
    stats/          # Stats dashboard, charts, trends
  context/          # React context (AuthContext)
  hooks/            # Custom hooks (useAuth, usePlayers, useFriends, useGames, useAdmin)
  lib/              # Pure logic (scoring, constants, standings, stats, supabase client, game service)
  pages/            # Route-level page components
  store/            # Zustand stores (gameStore, themeStore, preferencesStore)
  types/            # TypeScript types (Game, Player, Profile, Supabase DB types)
public/
  screenshots/      # App screenshots
  icons/            # PWA icons
supabase/
  migrations/       # SQL migration files (run in order)
```

---

## License

Private project. All rights reserved.
