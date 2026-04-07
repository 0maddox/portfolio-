Rails.application.config.session_store :cookie_store,
  key: "_portfolio_admin_session",
  httponly: true,
  secure: Rails.env.production?,
  same_site: (Rails.env.production? ? :none : :lax)
