# One-Click Deployment (Render / Railway)

## Required environment variables

- `RAILS_ENV=production`
- `SECRET_KEY_BASE` (generate secure random value)
- `DATABASE_URL` (managed Postgres URL)
- `FRONTEND_ORIGIN=https://portfolio-0maddox.netlify.app`
- `RAILS_SERVE_STATIC_FILES=true`
- `RAILS_LOG_TO_STDOUT=true`

## Render (one-click)

1. Push `portfolio_rails_api` to GitHub.
2. In Render dashboard choose Blueprint and point to repository root containing `render.yaml`.
3. Render provisions web + Postgres and deploys automatically.

Direct one-click URL template:

`https://render.com/deploy?repo=https://github.com/<your-user>/<your-repo>`

Render blueprint file: `render.yaml`

## Railway (one-click-ish)

1. Push `portfolio_rails_api` to GitHub.
2. In Railway: New Project -> Deploy from GitHub repo.
3. Railway detects `railway.json` and deploy command automatically.
4. Add Postgres plugin and set `DATABASE_URL`.
5. Set `FRONTEND_ORIGIN` to your Netlify URL.

Direct deploy URL template:

`https://railway.com/new/template?template=https://github.com/<your-user>/<your-repo>`

Railway config file: `railway.json`

## Connect frontend

Set Netlify env var:

- `VITE_API_BASE_URL=https://<your-rails-domain>`

Then redeploy frontend.
