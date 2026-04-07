class SiteSetting < ApplicationRecord
  has_many :projects, dependent: :delete_all

  def self.current
    first_or_create!(
      about: "I am familiar with React, JavaScript, HTML, CSS, Ruby on Rails, SQL, and PostgreSQL. I design and ship scalable web products with strong UX, clean code, and meaningful motion.",
      profile_image: "/images/profile-default.png",
      profile_image_size: 180,
      skills: []
    )
  end

  def assign_from_frontend_payload(payload)
    self.about = payload["about"] if payload.key?("about")
    self.profile_image = payload["profileImage"] if payload.key?("profileImage")
    self.profile_image_size = payload["profileImageSize"] if payload.key?("profileImageSize")
    self.featured_project_title = payload["featuredProjectTitle"] if payload.key?("featuredProjectTitle")
    self.skills = payload["skills"] if payload.key?("skills")

    return unless payload.key?("projects") && payload["projects"].is_a?(Array)

    projects.delete_all
    payload["projects"].each do |item|
      projects.create!(
        title: item["title"],
        description: item["description"],
        image: item["image"],
        images: item["images"] || [],
        url: item["url"],
        live: item["live"],
        github: item["github"],
        category: item["category"],
        status: item["status"],
        problem: item["problem"],
        solution: item["solution"],
        features: item["features"] || [],
        challenges: item["challenges"],
        learned: item["learned"],
        tech: item["tech"] || [],
        manual_images: item["manualImages"] == true
      )
    end
  end

  def to_frontend_json
    {
      projects: projects.order(:id).map(&:to_frontend_json),
      about: about.to_s,
      profileImage: profile_image.to_s,
      profileImageSize: profile_image_size,
      featuredProjectTitle: featured_project_title.to_s,
      skills: skills || []
    }
  end
end
