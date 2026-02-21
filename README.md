# Network Index — Mutual Aid Club

A neighborhood mutual aid platform where community members can request and offer help across categories like childcare, rides, food, and more. Built with Rails 8 (API) + React 19 (SPA).

---

## Table of Contents

- [How the App Works](#how-the-app-works)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running the App](#running-the-app)
- [Environment Variables](#environment-variables)
- [Test Accounts](#test-accounts)
- [Further Reading](#further-reading)

---

## How the App Works

Users sign up with an email/password or Google account and are associated with a zipcode. Once authenticated, they can:

- **Browse posts** in their neighborhood feed, filtered by category (childcare, ride share, food, other) or zipcode
- **Create posts** requesting or offering help
- **Comment** on posts and send direct messages to other users
- **Like** posts and receive notifications when others engage with theirs
- **Rate and review** other users after interactions
- **Flag** inappropriate posts or comments for moderator review

Moderators have additional access to a queue of flagged content and user safety reports.

The backend serves a versioned REST API (`/api/v1`). The frontend is a single-page React app that communicates exclusively through that API using JWT bearer tokens.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Ruby on Rails 8.0, PostgreSQL |
| Authentication | JWT + BCrypt, Google OAuth 2.0 |
| Frontend | React 19, TypeScript, Vite |
| UI | Chakra UI, Tailwind CSS, Framer Motion |
| Routing | React Router DOM 7 |
| Testing | RSpec, FactoryBot (backend) · Jest, React Testing Library (frontend) |
| Deployment | Kamal (Docker), Heroku |

---

## Prerequisites

Make sure the following are installed before proceeding:

- **Ruby 3.3.0** — use [rbenv](https://github.com/rbenv/rbenv) or [rvm](https://rvm.io/)
- **Node.js** (LTS) and **npm**
- **PostgreSQL** (running locally)
- **Bundler** (`gem install bundler`)

---

## Setup

### 1. Clone and enter the project

```bash
git clone <repo-url>
cd network-index
```

### 2. Install dependencies

```bash
bundle install   # Ruby gems
npm install      # Node packages
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in the required values. See [Environment Variables](#environment-variables) below.

### 4. Set up the database

```bash
bin/rails db:prepare   # creates, migrates, and seeds
```

Or step by step:

```bash
bin/rails db:create
bin/rails db:migrate
bin/rails db:seed      # optional — loads demo users, posts, comments, etc.
```

---

## Running the App

```bash
bin/dev
```

This starts both the Rails server and the Vite dev server via `Procfile.dev`.

| Service | URL |
|---|---|
| React frontend | http://localhost:5173 |
| Rails API | http://localhost:3000/api/v1 |
| Health check | http://localhost:3000/up |

To start servers individually:

```bash
bin/rails server    # Rails only (port 3000)
bin/vite dev        # Vite only (port 5173)
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GOOGLE_CLIENT_ID` | For Google OAuth | Google Web Client ID (backend verification) |
| `VITE_GOOGLE_CLIENT_ID` | For Google OAuth | Same Google Client ID (frontend button) |
| `DATABASE_NAME` | Production only | PostgreSQL database name |
| `DATABASE_USER` | Production only | PostgreSQL user |
| `DATABASE_PASSWORD` | Production only | PostgreSQL password |
| `DATABASE_HOST` | Production only | PostgreSQL host |
| `DATABASE_PORT` | Production only | PostgreSQL port (default: 5432) |

### Google OAuth Setup

1. Create a **Web Client** in [Google Cloud Console](https://console.cloud.google.com/) under APIs & Services → Credentials.
2. Add the following **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - `http://localhost:5173`
   - `http://127.0.0.1:3000`
   - `http://127.0.0.1:5173`
3. Copy the Client ID into both `GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_ID` in your `.env`.
4. Restart both servers after changing environment variables.

> The `zipcode` field is optional on first Google sign-in. Users can update it in their profile later.

---

## Test Accounts

After running `bin/rails db:seed`, these accounts are available:

| Role | Email | Password |
|---|---|---|
| Moderator | `moderator@networkindex.org` | `password123` |
| User | `alice.helper@example.com` | `password123` |
| User | `bob.gardener@example.com` | `password123` |

---

## Further Reading

| Document | Description |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Backend and frontend architecture, data models, key patterns |
| [docs/API.md](docs/API.md) | All API endpoints with request/response shapes |
| [docs/TESTING.md](docs/TESTING.md) | How to run and write tests |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Production deployment with Kamal and Heroku |
