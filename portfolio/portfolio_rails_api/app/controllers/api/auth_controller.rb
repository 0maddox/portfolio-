module Api
  class AuthController < BaseController
    def login
      credential = AdminCredential.find_by(email: normalized_email)

      if credential&.authenticate(params[:password].to_s)
        session[:admin_user_id] = credential.id
        session[:email] = credential.email
        render json: { success: true }
      else
        render json: { success: false, message: "Invalid credentials" }, status: :unauthorized
      end
    end

    def logout
      reset_session
      render json: { success: true }
    end

    def check_session
      if current_admin
        render json: { loggedIn: true, email: current_admin.email }
      else
        render json: { loggedIn: false }
      end
    end

    private

    def normalized_email
      params[:email].to_s.downcase.gsub(/\s+/, "")
    end
  end
end
