# Portfolio Rails API

Production-ready Rails API scaffold that mirrors the existing frontend contract used by the React app.

## Quick start

```bash
cd portfolio_rails_api
bundle install
bin/rails active_storage:install
bin/rails db:create db:migrate db:seed
bin/rails s -p 5000
```

## Contract test

```bash
bin/rails test test/integration/api_contract_test.rb
```

## Frontend connection

Set in Netlify:

- `VITE_API_BASE_URL=https://your-rails-api-domain`

## Deployment

See `DEPLOY.md` for Render/Railway one-click deployment paths and required env vars.
