Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Development: Allow requests from Vite dev server
    origins ENV.fetch("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")

    resource "/api/*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ],
      credentials: true
  end
end
