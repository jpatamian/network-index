Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # API routes
  namespace :api do
    namespace :v1 do
      # Authentication routes
      post 'auth/signup', to: 'authentication#signup'
      post 'auth/login', to: 'authentication#login'
      get 'auth/me', to: 'authentication#me'

      # User routes
      resources :users, only: [:index, :show]

      # Post routes
      resources :posts do
        resources :comments, only: [:index, :create, :destroy]
      end
    end
  end

  # Root path for React SPA
  root "pages#index"

  # Catch-all route for client-side routing (must be last)
  get '*path', to: 'pages#index', constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end
