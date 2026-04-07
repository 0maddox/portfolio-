module Api
  class BaseController < ApplicationController
    private

    def current_admin
      return nil unless session[:admin_user_id]

      @current_admin ||= AdminCredential.find_by(id: session[:admin_user_id])
    end

    def require_admin!
      return if current_admin.present?

      render json: { message: "Not authorized" }, status: :forbidden
    end
  end
end
