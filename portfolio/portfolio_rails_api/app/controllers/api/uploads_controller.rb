module Api
  class UploadsController < BaseController
    include Rails.application.routes.url_helpers

    def upload_generic
      return require_admin! unless current_admin

      asset = UploadedAsset.create!(
        kind: :generic,
        project_slug: safe_slug(params[:project]),
        original_filename: upload_param&.original_filename
      )
      asset.file.attach(upload_param)

      render json: { url: blob_path(asset.file.blob) }
    end

    def upload_project_image
      return require_admin! unless current_admin

      unless upload_param&.content_type.to_s.start_with?("image/")
        return render json: { message: "Project image upload accepts image files only." }, status: :bad_request
      end

      asset = UploadedAsset.create!(
        kind: :project_image,
        project_slug: safe_slug(params[:project]),
        original_filename: upload_param.original_filename
      )
      asset.file.attach(upload_param)

      render json: { url: blob_path(asset.file.blob) }
    end

    def upload_profile_image
      return require_admin! unless current_admin

      unless upload_param&.content_type.to_s.start_with?("image/")
        return render json: { message: "Profile picture upload accepts image files only." }, status: :bad_request
      end

      asset = UploadedAsset.create!(
        kind: :profile_image,
        original_filename: upload_param.original_filename
      )
      asset.file.attach(upload_param)

      render json: { url: blob_path(asset.file.blob) }
    end

    def public_images
      urls = UploadedAsset
        .project_image
        .includes(file_attachment: :blob)
        .order(created_at: :desc)
        .filter_map { |asset| asset.file.attached? ? blob_path(asset.file.blob) : nil }

      render json: { images: urls }
    end

    private

    def upload_param
      params[:image]
    end

    def safe_slug(value)
      value.to_s.downcase.gsub(/[^a-z0-9]+/, "-").gsub(/(^-|-$)/, "")
    end

    def blob_path(blob)
      rails_blob_path(blob, only_path: true)
    end
  end
end
