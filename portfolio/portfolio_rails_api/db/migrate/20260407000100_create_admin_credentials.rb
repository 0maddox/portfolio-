class CreateAdminCredentials < ActiveRecord::Migration[7.1]
  def change
    create_table :admin_credentials do |t|
      t.string :email, null: false
      t.string :password_digest, null: false
      t.timestamps
    end

    add_index :admin_credentials, :email, unique: true
  end
end
