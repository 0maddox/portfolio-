module Api
  class PasswordResetsController < BaseController
    TOKEN_TTL = 15.minutes

    def create
      credential = AdminCredential.find_by(email: normalized_email)
      return render json: { success: false, message: "Email not found" }, status: :not_found unless credential

      raw_token = SecureRandom.hex(24)
      digest = Digest::SHA256.hexdigest(raw_token)

      PasswordResetToken.where(admin_credential_id: credential.id).delete_all
      PasswordResetToken.create!(
        admin_credential_id: credential.id,
        token_digest: digest,
        expires_at: TOKEN_TTL.from_now
      )

      render json: {
        success: true,
        message: "Reset token generated. Use it below to set a new password.",
        resetToken: raw_token
      }
    end

    def update
      token = params[:token].to_s
      new_password = params[:newPassword].to_s

      if new_password.length < 8
        return render json: { success: false, message: "Password must be at least 8 characters" }, status: :bad_request
      end

      token_record = PasswordResetToken.find_by(token_digest: Digest::SHA256.hexdigest(token))
      return render json: { success: false, message: "Invalid reset token" }, status: :bad_request unless token_record

      if token_record.expires_at < Time.current
        token_record.destroy
        return render json: { success: false, message: "Reset token expired" }, status: :bad_request
      end

      credential = token_record.admin_credential
      credential.update!(password: new_password)
      token_record.destroy
      reset_session

      render json: { success: true, message: "Password reset successfully" }
    end

    private

    def normalized_email
      params[:email].to_s.downcase.gsub(/\s+/, "")
    end
  end
end
