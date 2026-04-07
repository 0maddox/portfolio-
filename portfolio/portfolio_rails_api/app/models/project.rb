class Project < ApplicationRecord
  belongs_to :site_setting

  validates :title, presence: true

  def to_frontend_json
    {
      title: title,
      description: description,
      image: image,
      images: images || [],
      url: url,
      live: live,
      github: github,
      category: category,
      status: status,
      problem: problem,
      solution: solution,
      features: features || [],
      challenges: challenges,
      learned: learned,
      tech: tech || [],
      manualImages: manual_images
    }
  end
end
