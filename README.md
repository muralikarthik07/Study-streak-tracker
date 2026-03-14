# 🎯 Daily Learning Streak Tracker

A full-stack web application built with **Next.js**, **TypeScript**, and **Tailwind CSS** that helps students maintain daily learning habits by tracking their study streaks.

## 🚀 Live Demo

> Add your Vercel URL here after deployment: `https://your-project.vercel.app`

---

## 📋 Project Description

Students often lose consistency in studying. This **Learning Streak Tracker** motivates students to maintain daily learning habits by:

- Letting them mark "I Studied Today" with one click
- Showing their current study streak
- Displaying total days studied
- Keeping a full history of study dates

---

## 🛠️ Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | Next.js 14 (App Router) |
| Backend   | Next.js API Routes      |
| Language  | TypeScript              |
| Styling   | Tailwind CSS            |
| Storage   | Browser localStorage    |
| Hosting   | Vercel                  |

---

## 📁 Project Structure

```
streak-tracker/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Redirects to /dashboard
│   ├── globals.css
│   ├── dashboard/
│   │   └── page.tsx        # Main dashboard UI
│   ├── history/
│   │   └── page.tsx        # Study history page
│   └── api/
│       ├── study/
│       │   └── route.ts    # POST /api/study
│       ├── streak/
│       │   └── route.ts    # GET /api/streak
│       └── history/
│           └── route.ts    # GET /api/history
├── components/
│   ├── StreakCard.tsx       # Stats display card
│   ├── StudyButton.tsx     # Mark study button
│   └── HistoryList.tsx     # Study history list
└── lib/
    └── streakLogic.ts      # Core streak computation logic
```

---

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/streak-tracker.git
cd streak-tracker

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev

# 4. Open in browser
# Visit http://localhost:3000
```

---

## 🔥 How Streak Logic Works

The streak logic lives in `lib/streakLogic.ts` and follows these rules:

### Rules
1. **No duplicate entries** — A user can only mark study once per day.
2. **Streak continues** if the user studied on consecutive days ending on today or yesterday.
3. **Streak resets to 0** if the most recent study date was 2+ days ago.
4. **Each new study** after a gap starts a fresh streak of 1.

### Example

```
10 March → studied ✅
11 March → studied ✅
12 March → studied ✅
→ Streak = 3

13 March → missed ❌
14 March → studied ✅
→ Streak resets to 1
```

### Key Functions

| Function | Description |
|---|---|
| `getTodayString()` | Returns today as `YYYY-MM-DD` |
| `computeStreak(dates)` | Returns `currentStreak`, `totalDays`, `lastStudied` |
| `markStudied(dates)` | Validates & adds today; prevents duplicates |
| `getSortedHistory(dates)` | Returns dates sorted newest first |
| `formatDate(dateStr)` | Converts `YYYY-MM-DD` → `14 March 2026` |

---

## 🌐 API Endpoints

### `POST /api/study`
Mark today as studied.

**Request body:**
```json
{ "dates": ["2026-03-10", "2026-03-11"] }
```

**Response:**
```json
{
  "success": true,
  "message": "Great job! Study logged for today. 🎉",
  "updatedDates": ["2026-03-10", "2026-03-11", "2026-03-14"]
}
```

---

### `GET /api/streak?dates=2026-03-10,2026-03-11`
Get current streak stats.

**Response:**
```json
{
  "currentStreak": 2,
  "totalDays": 2,
  "lastStudied": "2026-03-11"
}
```

---

### `GET /api/history?dates=2026-03-10,2026-03-11`
Get sorted study history.

**Response:**
```json
{
  "dates": ["2026-03-11", "2026-03-10"]
}
```

---

## 🚢 Deployment (Vercel)

See the step-by-step deployment guide below, or follow the quick steps:

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repository
4. Click **Deploy**
5. Your app is live! 🎉

---

## 📝 License

MIT — free to use and modify.
