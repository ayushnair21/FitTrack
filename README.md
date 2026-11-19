# FitTrack — Full-Stack Workout & Volume Tracker

FitTrack is a full-stack fitness tracking web application featuring daily lifted-volume analytics, interactive workout history logs, custom user profiles, and a responsive glassmorphic light/dark interface.

---

## Features

- **Authentication & Security:** Email/password registration and login with JWT session handling, Google OAuth sign-in, and password reset flow.
- **Workout Logging & Analytics:** Log exercises, sets, reps, and weights, and track daily lifted volume on an interactive dashboard.
- **Workout History Calendar:** Review past training sessions by date.
- **Profile Customization:** Choose from preset avatars and manage personal profile details.
- **Adaptive Light & Dark UI:** Glassmorphic interface with seamless theme switching (`ThemeProvider`).

---

## Tech Stack

- **Frontend (`client/`):** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend (`server/`):** Node.js, Express.js, Prisma ORM, PostgreSQL
- **Auth:** JSON Web Tokens (JWT), Google OAuth 2.0

---

## Project Structure

```text
fitness-platform/
├── client/                 # Next.js frontend application
│   ├── app/
│   │   ├── components/     # Navbar, ProtectedRoute, ThemeProvider
│   │   ├── dashboard/      # Analytics & daily volume dashboard
│   │   ├── forgot-password/# Password recovery flow
│   │   ├── log-workout/    # Workout logging interface
│   │   ├── login/          # User sign-in
│   │   ├── profile/        # User profile & avatar selection
│   │   └── register/       # User registration
│   └── public/             # Theme backgrounds & static assets
├── server/                 # Express + Prisma REST API
│   ├── prisma/             # Database schema & migrations
│   └── index.js            # API entry point
└── .gitignore
