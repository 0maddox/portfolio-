class CreateSiteSettingsAndProjects < ActiveRecord::Migration[7.1]
  def change
    create_table :site_settings do |t|
      t.text :about
      t.string :profile_image
      t.integer :profile_image_size, default: 180, null: false
      t.string :featured_project_title
      t.jsonb :skills, default: [], null: false
      t.timestamps
    end

    create_table :projects do |t|
      t.references :site_setting, null: false, foreign_key: true
      t.string :title, null: false
      t.text :description
      t.string :image
      t.jsonb :images, default: [], null: false
      t.string :url
      t.string :live
      t.string :github
      t.string :category
      t.string :status
      t.text :problem
      t.text :solution
      t.jsonb :features, default: [], null: false
      t.text :challenges
      t.text :learned
      t.jsonb :tech, default: [], null: false
      t.boolean :manual_images, default: false, null: false
      t.timestamps
    end
  end
end
