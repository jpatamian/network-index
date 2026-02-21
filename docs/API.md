# API Reference

All endpoints are prefixed with `/api/v1`. Protected endpoints require an `Authorization: Bearer <token>` header.

---

## Authentication

### Sign Up

```
POST /api/v1/auth/signup
```

**Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "janedoe",
  "zipcode": "10001"
}
```

**Response `201`:**

```json
{
  "token": "<jwt>",
  "user": { "id": 1, "email": "user@example.com", "username": "janedoe", ... }
}
```

---

### Log In

```
POST /api/v1/auth/login
```

**Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response `200`:** Same shape as sign up.

---

### Google OAuth

```
POST /api/v1/auth/google
```

**Body:**

```json
{
  "credential": "<google_id_token>",
  "zipcode": "10001"
}
```

`zipcode` is optional on first sign-in. If omitted, a fallback value is saved and the user can update it from their profile.

**Response `200`:** Same shape as sign up.

---

### Get Current User

```
GET /api/v1/auth/me
```

**Auth:** Required

**Response `200`:**

```json
{
  "user": { "id": 1, "email": "...", "username": "...", "zipcode": "...", ... }
}
```

---

## Posts

### List Posts

```
GET /api/v1/posts
```

**Auth:** Required

**Query parameters:**

| Parameter | Type | Description |
|---|---|---|
| `zipcode` | string | Filter by zipcode |
| `post_type` | string | `childcare`, `ride_share`, `food`, `other` |
| `status` | string | `open`, `fulfilled` |
| `q` | string | Full-text search on title/content |

**Response `200`:**

```json
{
  "posts": [
    {
      "id": 1,
      "title": "Need a ride to the airport",
      "content": "...",
      "post_type": "ride_share",
      "status": "open",
      "likes_count": 3,
      "flag_count": 0,
      "user": { "id": 2, "username": "alice", ... },
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

### Get Single Post

```
GET /api/v1/posts/:id
```

**Auth:** Required

**Response `200`:**

```json
{
  "post": { ... }
}
```

---

### Create Post

```
POST /api/v1/posts
```

**Auth:** Required

**Body:**

```json
{
  "title": "Offering childcare Saturday mornings",
  "content": "I can watch 1-2 kids aged 3-8 ...",
  "post_type": "childcare",
  "zipcode": "10001",
  "metadata": {}
}
```

`metadata` is an open JSONB field for per-category data (e.g., pickup address for ride_share).

**Response `201`:**

```json
{
  "post": { "id": 5, ... }
}
```

---

### Update Post

```
PATCH /api/v1/posts/:id
```

**Auth:** Required (must be post owner or moderator)

**Body:** Any subset of post fields.

**Response `200`:**

```json
{
  "post": { ... }
}
```

---

### Delete Post

```
DELETE /api/v1/posts/:id
```

**Auth:** Required (must be post owner or moderator)

**Response `200`:**

```json
{
  "message": "Post deleted"
}
```

---

### My Posts

```
GET /api/v1/posts/my_posts
```

**Auth:** Required

Returns all posts belonging to the current user.

**Response `200`:**

```json
{
  "posts": [ ... ]
}
```

---

## Comments

### List Comments

```
GET /api/v1/posts/:post_id/comments
```

**Auth:** Required

**Response `200`:**

```json
{
  "comments": [
    {
      "id": 1,
      "message": "I can help!",
      "user": { "id": 3, "username": "bob", ... },
      "created_at": "2024-01-16T09:00:00Z"
    }
  ]
}
```

---

### Create Comment

```
POST /api/v1/posts/:post_id/comments
```

**Auth:** Required

**Body:**

```json
{
  "message": "I can help with this!"
}
```

**Response `201`:**

```json
{
  "comment": { "id": 10, ... }
}
```

---

### Delete Comment

```
DELETE /api/v1/posts/:post_id/comments/:id
```

**Auth:** Required (must be comment owner or moderator)

**Response `200`:**

```json
{
  "message": "Comment deleted"
}
```

---

## Likes

### Like a Post

```
POST /api/v1/posts/:post_id/likes
```

**Auth:** Required

**Response `201`:**

```json
{
  "likes_count": 4
}
```

---

### Unlike a Post

```
DELETE /api/v1/posts/:post_id/likes
```

**Auth:** Required

**Response `200`:**

```json
{
  "likes_count": 3
}
```

---

## Flags (Content Moderation)

### Flag a Post

```
POST /api/v1/posts/:post_id/flags
```

**Auth:** Required

**Body:**

```json
{
  "reason": "spam",
  "description": "This post is advertising a commercial service."
}
```

**Response `201`:**

```json
{
  "flag": { "id": 2, ... }
}
```

---

### Flag a Comment

```
POST /api/v1/posts/:post_id/comments/:comment_id/flags
```

**Auth:** Required

Same body and response shape as flagging a post.

---

### List Flags

```
GET /api/v1/flags
```

**Auth:** Required — **moderators only**

Returns all pending flags across posts and comments.

**Response `200`:**

```json
{
  "flags": [
    {
      "id": 1,
      "reason": "harassment",
      "status": "pending",
      "flaggable_type": "Post",
      "flaggable_id": 7,
      ...
    }
  ]
}
```

---

### Acknowledge Flag

```
PATCH /api/v1/flags/:id
```

**Auth:** Required — **moderators only**

**Body:**

```json
{
  "status": "reviewed"
}
```

**Response `200`:**

```json
{
  "flag": { "id": 1, "status": "reviewed", "reviewed_at": "...", ... }
}
```

---

## Notifications

### List Notifications

```
GET /api/v1/notifications
```

**Auth:** Required

Returns notifications for the current user (newest first).

**Response `200`:**

```json
{
  "notifications": [
    {
      "id": 1,
      "notification_type": "comment",
      "message": "alice commented on your post",
      "read_at": null,
      "post_id": 3,
      "created_at": "2024-01-17T08:00:00Z"
    }
  ]
}
```

---

## Users

### List Users

```
GET /api/v1/users
```

**Auth:** Required

**Response `200`:**

```json
{
  "users": [ { "id": 1, "username": "alice", "zipcode": "10001", ... } ]
}
```

---

### Get User

```
GET /api/v1/users/:id
```

**Auth:** Required

**Response `200`:**

```json
{
  "user": {
    "id": 1,
    "username": "alice",
    "display_name": "Alice",
    "bio": "...",
    "zipcode": "10001",
    "average_rating": 4.8,
    "total_ratings_count": 12
  }
}
```

---

### Update User

```
PATCH /api/v1/users/:id
```

**Auth:** Required (must be current user)

Accepts multipart form data to allow avatar uploads via Active Storage.

**Body (multipart):**

```
display_name: "Alice M."
bio: "Neighbor and dog lover"
zipcode: "10001"
avatar: <file>
```

**Response `200`:**

```json
{
  "user": { ... }
}
```

---

## Error Responses

All errors follow this shape:

```json
{
  "error": "Human-readable message describing what went wrong"
}
```

| Status | Meaning |
|---|---|
| `400` | Bad request / validation failed |
| `401` | Missing or invalid JWT |
| `403` | Authenticated but not authorized (e.g., not a moderator, not owner) |
| `404` | Resource not found |
| `422` | Unprocessable entity |
| `500` | Internal server error |
