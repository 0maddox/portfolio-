class CreateUploadedAssets < ActiveRecord::Migration[7.1]
  def change
    create_table :uploaded_assets do |t|
      t.string :kind, null: false
      t.string :project_slug
      t.string :original_filename
      t.timestamps
    end

    add_index :uploaded_assets, :kind
    add_index :uploaded_assets, :project_slug
  end
end
