# Architecture

This document covers the technical structure of the application — how the backend and frontend are organized, key patterns used, and how data flows through the system.

---

## Table of Contents

- [High-Level Overview](#high-level-overview)
- [Backend](#backend)
  - [Directory Structure](#backend-directory-structure)
  - [API Design](#api-design)
  - [Authentication](#authentication)
  - [Models and Associations](#models-and-associations)
  - [Key Patterns](#backend-key-patterns)
- [Frontend](#frontend)
  - [Directory Structure](#frontend-directory-structure)
  - [Routing](#routing)
  - [State Management](#state-management)
  - [API Client](#api-client)
  - [Key Patterns](#frontend-key-patterns)
- [Database Schema](#database-schema)

---

## High-Level Overview

```
Browser
  └── React SPA (Vite, port 5173 in dev)
        └── API requests (JWT bearer token)
              └── Rails API (port 3000)
                    └── PostgreSQL
```

Rails serves two roles:
1. **API server** — all business logic and data access under `/api/v1`
2. **SPA host** — a catch-all route delivers the React app shell for any non-API, non-XHR HTML request

In production a single Puma process handles both. In development, Vite runs its own server with HMR and proxies API calls to Rails.

---

## Backend

### Backend Directory Structure

```
app/
├── controllers/
│   ├── api/
│   │   └── v1/
│   │       ├── authentication_controller.rb
│   │       ├── posts_controller.rb
│   │       ├── comments_controller.rb
│   │       ├── flags_controller.rb
│   │       ├── post_likes_controller.rb
│   │       ├── notifications_controller.rb
│   │       └── users_controller.rb
│   ├── concerns/
│   │   ├── authenticable.rb       # JWT auth for protected actions
│   │   └── response_serializable.rb  # Standardized JSON response helpers
│   └── pages_controller.rb        # SPA shell
├── models/
│   ├── user.rb
│   ├── post.rb
│   ├── comment.rb
│   ├── flag.rb
│   ├── post_like.rb
│   ├── notification.rb
│   ├── direct_message.rb
│   ├── rating.rb
│   ├── user_safety_report.rb
│   └── comment_history.rb
lib/
└── json_web_token.rb              # JWT encode/decode utility
config/
├── routes.rb
├── database.yml
└── initializers/
    └── cors.rb
db/
├── schema.rb
├── migrate/
└── seeds/
```

### API Design

All API routes live under `/api/v1`. The API is RESTful and responds exclusively with JSON.

**Route file:** `config/routes.rb`

```ruby
namespace :api do
  namespace :v1 do
    post "auth/signup"
    post "auth/login"
    post "auth/google"
    get  "auth/me"

    resources :users,         only: [:index, :show, :update]
    resources :flags,         only: [:index, :update]         # moderation
    resources :notifications, only: [:index]

    resources :posts do
      get "my_posts", on: :collection
      resources :comments, only: [:index, :create, :destroy] do
        resources :flags, only: [:create]
      end
      resources :flags,  only: [:create]
      resource  :likes,  only: [:create, :destroy], controller: "post_likes"
    end
  end
end
```

The catch-all at the bottom of routes.rb sends all non-API HTML requests to the React SPA shell:

```ruby
get "*path", to: "pages#index", constraints: ->(req) { !req.xhr? && req.format.html? }
```

### Authentication

**Mechanism:** JWT (JSON Web Tokens) with a 24-hour expiration.

**Flow:**
1. Client sends credentials to `POST /api/v1/auth/login` (or `/signup`, `/google`)
2. Server returns `{ token: "<jwt>", user: { ... } }`
3. Client stores the token and attaches it as `Authorization: Bearer <token>` on subsequent requests
4. Protected controllers include the `Authenticable` concern which decodes the token and sets `@current_user`

**Key files:**
- `lib/json_web_token.rb` — encodes/decodes tokens using `JWT` gem
- `app/controllers/concerns/authenticable.rb` — `before_action :authenticate_user!` macro
- `app/controllers/api/v1/authentication_controller.rb` — signup, login, Google OAuth, `me`

**Google OAuth:**
- Frontend receives a Google ID token via `@react-oauth/google`
- ID token is sent to `POST /api/v1/auth/google`
- Backend verifies it with the `google-id-token` gem using `GOOGLE_CLIENT_ID`
- If the Google account email matches an existing user, they are logged in; otherwise a new account is created

### Models and Associations

```
User
├── has_many :posts
├── has_many :comments
├── has_many :post_likes
├── has_many :notifications
├── has_many :ratings (received)
├── has_many :user_safety_reports
├── has_one_attached :avatar          (Active Storage)

Post
├── belongs_to :user
├── has_many :comments
├── has_many :post_likes
├── has_many :flags, as: :flaggable   (polymorphic)
├── has_many :notifications
├── enum post_type: { childcare:0, ride_share:1, food:2, other:3 }
├── enum status: { open:0, fulfilled:1 }

Comment
├── belongs_to :post
├── belongs_to :user
├── has_many :flags, as: :flaggable   (polymorphic)
├── has_many :comment_histories

Flag                                  (polymorphic)
├── belongs_to :flaggable, polymorphic: true  (Post or Comment)
├── belongs_to :user

PostLike
├── belongs_to :post
├── belongs_to :user
├── unique index on (user_id, post_id)

Notification
├── belongs_to :user
├── belongs_to :post (optional)

DirectMessage
├── belongs_to :sender (User)
├── belongs_to :recipient (User)

Rating
├── belongs_to :rater (User)
├── belongs_to :rated_user (User)

UserSafetyReport
├── belongs_to :reporter (User)
├── belongs_to :reported_user (User)
```

**JSONB metadata on posts** allows flexible per-category data (e.g., pickup location for ride share posts) without extra columns.

### Backend Key Patterns

**Concerns**

`Authenticable` — added as a concern to any controller that needs authentication:
```ruby
include Authenticable
before_action :authenticate_user!
```

`ResponseSerializable` — provides `render_success` / `render_error` helpers for consistent JSON response shapes.

**Service object**

`lib/json_web_token.rb` handles all JWT logic in one place, keeping controllers thin.

**Versioned API**

The `Api::V1` namespace means a future `Api::V2` can be added without breaking existing clients.

---

## Frontend

### Frontend Directory Structure

```
app/frontend/
├── entrypoints/
│   └── application.tsx          # Vite entry point
├── components/                  # Shared/reusable UI components
│   ├── Layout.tsx
│   ├── Navigation.tsx
│   └── ...
├── features/                    # Feature-based modules
│   ├── auth/                    # Login, Signup, Google button
│   ├── posts/                   # Feed, PostCard, CreatePost, filters
│   ├── profile/                 # Profile page, edit form
│   ├── home/                    # Landing page
│   └── neighborhood/            # Neighborhood-scoped views
├── contexts/
│   └── AuthContext.tsx          # Global auth state
├── hooks/                       # Custom React hooks
├── lib/
│   └── api.ts                   # Axios/fetch API client + per-resource modules
├── types/
│   └── index.ts                 # TypeScript interfaces (User, Post, Comment, etc.)
└── __tests__/                   # Jest test files
```

### Routing

React Router DOM 7 handles client-side routing. All routes render inside the main `Layout` component (navigation bar, footer).

```
/                  → Home (landing)
/login             → Login page
/signup            → Signup page
/posts             → Community feed
/posts/new         → Create post
/posts/:id         → Single post + comments
/profile           → Current user's profile
/profile/:id       → Another user's public profile
```

Rails serves the SPA shell for any of these URLs so direct navigation and page refresh work correctly.

### State Management

The app uses **React Context** rather than an external state library.

`AuthContext` (contexts/AuthContext.tsx):
- Stores the current user object and JWT token
- Persists the token in `localStorage`
- Exposes `login()`, `logout()`, and `updateUser()` functions
- Exposes the `useAuth()` hook consumed by components and the API client

No other global state is needed — component-local state and props handle the rest.

### API Client

`app/frontend/lib/api.ts` exports per-resource API modules:

```typescript
authApi      // signup, login, google, me
postsApi     // CRUD, myPosts, filter/search
commentsApi  // list, create, destroy
flagsApi     // create flag, list flags (moderator), acknowledge
likesApi     // create, destroy
usersApi     // show, update profile/avatar
notificationsApi  // list
```

Each function makes a `fetch` call with `Authorization: Bearer <token>` from `localStorage`. Errors are surfaced as thrown exceptions with the server's error message attached.

### Frontend Key Patterns

**Feature-based folders** — code for a feature (components, hooks, types, pages) lives together rather than split by type. This keeps related code co-located and makes features easy to isolate.

**TypeScript throughout** — all API response shapes are typed via interfaces in `types/index.ts`, catching shape mismatches at compile time.

**Path alias** — `@/` maps to `app/frontend/` so imports don't require deep relative paths:
```typescript
import { useAuth } from "@/contexts/AuthContext";
```

---

## Database Schema

### Core Tables

| Table | Purpose | Notable Columns |
|---|---|---|
| `users` | Accounts | `email`, `password_digest`, `username`, `zipcode`, `is_moderator`, `average_rating` |
| `posts` | Community requests/offers | `title`, `content`, `post_type` (enum), `status` (enum), `metadata` (JSONB), `likes_count`, `flag_count` |
| `comments` | Post responses | `message`, `is_flagged`, `is_hidden`, `flag_count` |
| `flags` | Content moderation | `flaggable_type`, `flaggable_id` (polymorphic), `reason`, `status` |
| `post_likes` | Like tracking | unique `(user_id, post_id)` |
| `notifications` | User alerts | `notification_type`, `message`, `read_at` |
| `direct_messages` | Private messaging | `sender_id`, `recipient_id`, `message`, `read_at` |
| `ratings` | User reviews | `rating_value`, `review_text` |
| `user_safety_reports` | Safety incidents | `incident_type`, `description`, `status` |
| `comment_histories` | Edit audit trail | `previous_message` |

### Enums

**Post type** (`post_type` column, integer-backed):

| Value | Integer |
|---|---|
| `childcare` | 0 |
| `ride_share` | 1 |
| `food` | 2 |
| `other` | 3 |

**Post status** (`status` column, integer-backed):

| Value | Integer |
|---|---|
| `open` | 0 |
| `fulfilled` | 1 |
