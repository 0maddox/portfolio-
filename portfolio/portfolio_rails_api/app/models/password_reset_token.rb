class PasswordResetToken < ApplicationRecord
  belongs_to :admin_credential

  validates :token_digest, presence: true, uniqueness: true
  validates :expires_at, presence: true
end
