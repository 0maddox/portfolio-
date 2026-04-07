Rails.application.routes.draw do
  namespace :api do
    post "login", to: "auth#login"
    post "logout", to: "auth#logout"
    get "check-session", to: "auth#check_session"

    post "forgot-password", to: "password_resets#create"
    post "reset-password", to: "password_resets#update"

    get "data", to: "data#show"
    post "data", to: "data#update"

    post "upload", to: "uploads#upload_generic"
    post "upload-project-image", to: "uploads#upload_project_image"
    post "upload-profile-image", to: "uploads#upload_profile_image"
    get "public-images", to: "uploads#public_images"
  end
end
