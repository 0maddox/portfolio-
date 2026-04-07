class AdminCredential < ApplicationRecord
  has_secure_password
  has_many :password_reset_tokens, dependent: :delete_all

  validates :email, presence: true, uniqueness: true
end
