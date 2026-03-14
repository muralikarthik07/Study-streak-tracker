# 🔥 StreakTracker

A full-stack **Daily Learning Streak Tracker** built with Next.js , TypeScript, and Tailwind CSS. Features user authentication, streak logic, and study history — deployed on Vercel.

## 🚀 Live Demo
> `https://study-streak-tracker-22ij.vercel.app/`

---

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Frontend + Backend | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom CSS variables |
| Auth & Storage | Browser localStorage |
| Deployment | Vercel |

---

## 📁 Structure
```
app/
  login/         # Login page
  signup/        # Signup page
  dashboard/     # Main dashboard
  history/       # Study history
  api/study|streak|history/  # API routes
components/
  Navbar.tsx
  StreakCard.tsx
  StudyButton.tsx
  HistoryList.tsx
hooks/
  useAuth.ts     # Auth session hook
lib/
  streakLogic.ts # Core logic + auth helpers
```

---

## ⚙️ Local Setup
```bash
git clone https://github.com/muralikarthik07/Study-streak-tracker
cd streak-tracker
npm install
npm run dev
# Visit http://localhost:3000
```

---

## 🔥 Streak Logic
- Consecutive days studied = streak count increases
- Miss a day = streak resets to 0
- Can only mark study once per day
- Data stored per user in localStorage

---

## 🌐 API Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/study` | Mark today as studied |
| GET | `/api/streak?dates=...` | Get streak stats |
| GET | `/api/history?dates=...` | Get sorted history |

---

## 🚢 Deploy to Vercel
1. Push to GitHub
2. Import repo at vercel.com
3. Click Deploy — done!
