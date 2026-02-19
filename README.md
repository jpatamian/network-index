# README

## Google OAuth Setup

1. Create a Google OAuth Web Client in Google Cloud Console.
2. In that OAuth client, set **Authorized JavaScript origins** to include every local origin you use, for example:
   - `http://localhost:3000`
   - `http://127.0.0.1:3000`
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
3. Copy `.env.example` to `.env` and set both values to the same Google Web client ID:
   - `GOOGLE_CLIENT_ID`
   - `VITE_GOOGLE_CLIENT_ID`
4. Restart Rails and Vite after setting environment variables.

### Notes

- Backend endpoint: `POST /api/v1/auth/google`
- Request body: `{ "credential": "<google_id_token>", "zipcode": "12345" }`
- `zipcode` is optional for Google auth; if omitted on first-time Google signup, a fallback zipcode is saved and users can update it later.

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

- Ruby version

- System dependencies

- Configuration

- Database creation

- Database initialization

- How to run the test suite

- Services (job queues, cache servers, search engines, etc.)

- Deployment instructions

- ...
