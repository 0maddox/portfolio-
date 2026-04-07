class UploadedAsset < ApplicationRecord
  enum :kind, {
    generic: "generic",
    project_image: "project_image",
    profile_image: "profile_image"
  }

  has_one_attached :file
end
