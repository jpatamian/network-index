# Deployment

The app supports two deployment targets: **Kamal** (Docker-based, self-hosted) and **Heroku**. Kamal is the primary path for Rails 8 apps. Heroku is a simpler alternative.

---

## Table of Contents

- [Production Build](#production-build)
- [Environment Variables](#environment-variables)
- [Kamal (Docker)](#kamal-docker)
- [Heroku](#heroku)
- [Database Migrations in Production](#database-migrations-in-production)

---

## Production Build

Before deploying via either path, verify that a production build succeeds locally:

```bash
RAILS_ENV=production bundle exec rails assets:precompile
```

Vite compiles and fingerprints all frontend assets into `public/assets/`. Rails then serves them through Puma.

---

## Environment Variables

Set these on the production server/platform before deploying:

| Variable | Description |
|---|---|
| `RAILS_MASTER_KEY` | Used to decrypt `config/credentials.yml.enc`. Found in `config/master.key` (never commit this file). |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (backend token verification) |
| `VITE_GOOGLE_CLIENT_ID` | Same value — read by Vite at build time for the frontend Google button |
| `DATABASE_NAME` | PostgreSQL database name |
| `DATABASE_USER` | PostgreSQL user |
| `DATABASE_PASSWORD` | PostgreSQL password |
| `DATABASE_HOST` | PostgreSQL host |
| `DATABASE_PORT` | PostgreSQL port (default `5432`) |
| `RAILS_ENV` | Set to `production` |

> `VITE_GOOGLE_CLIENT_ID` must be available at **build time** (when `assets:precompile` runs), not just runtime.

---

## Kamal (Docker)

Kamal ships the app as a Docker container to your server(s). Configuration lives in `config/deploy.yml`.

### Prerequisites

- [Kamal](https://kamal-deploy.org/) installed: `gem install kamal`
- Docker running on the target server(s)
- SSH access to the server(s)
- A Docker registry (Docker Hub, GHCR, DigitalOcean, etc.) or a local registry

### Configure deploy.yml

Update `config/deploy.yml` with your values:

```yaml
service: network_index
image: your-registry-user/network_index

servers:
  web:
    - YOUR_SERVER_IP

registry:
  server: registry.hub.docker.com   # or ghcr.io, etc.
  username: your-registry-username
  password:
    - KAMAL_REGISTRY_PASSWORD        # read from .kamal/secrets

env:
  secret:
    - RAILS_MASTER_KEY
    - DATABASE_PASSWORD
    - GOOGLE_CLIENT_ID
  clear:
    DATABASE_HOST: your-db-host
    DATABASE_NAME: network_index_production
    DATABASE_USER: your-db-user
    DATABASE_PORT: "5432"
```

Create `.kamal/secrets` (not committed to git) and add:

```
KAMAL_REGISTRY_PASSWORD=your_registry_token
RAILS_MASTER_KEY=your_master_key
DATABASE_PASSWORD=your_db_password
GOOGLE_CLIENT_ID=your_google_client_id
```

### Deploy

```bash
# First deploy (sets up server, pushes image, starts containers)
kamal setup

# Subsequent deploys
kamal deploy

# Useful aliases (defined in deploy.yml)
kamal console       # Rails console on the server
kamal shell         # Bash shell inside the container
kamal logs          # Tail production logs
kamal dbc           # PostgreSQL console
```

### Architecture Target

The builder is configured for `amd64`. On an Apple Silicon (arm64) Mac, Kamal will cross-compile. If builds are slow, configure a remote amd64 build server in `deploy.yml`.

---

## Heroku

The `Procfile` is configured for Heroku:

```
release: bundle exec rake assets:precompile
web: bundle exec puma -t 5:5 -p ${PORT:-3000} -e ${RACK_ENV:-production}
```

### Deploy to Heroku

```bash
# Install Heroku CLI and log in
heroku login

# Create the app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set RAILS_MASTER_KEY=$(cat config/master.key)
heroku config:set GOOGLE_CLIENT_ID=your_google_client_id
heroku config:set VITE_GOOGLE_CLIENT_ID=your_google_client_id
heroku config:set RAILS_ENV=production

# Push and deploy
git push heroku main

# Run migrations
heroku run bin/rails db:migrate
```

---

## Database Migrations in Production

Always run migrations as a separate step — never let deployments auto-migrate.

**Kamal:**

```bash
kamal app exec "bin/rails db:migrate"
```

**Heroku:**

```bash
heroku run bin/rails db:migrate
```

### Rolling Back a Migration

```bash
bin/rails db:rollback STEP=1
```

Check `db/migrate/` and test the rollback locally before running it in production.
