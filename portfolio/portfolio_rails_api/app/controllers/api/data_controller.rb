module Api
  class DataController < BaseController
    def show
      render json: SiteSetting.current.to_frontend_json
    end

    def update
      return require_admin! unless current_admin

      setting = SiteSetting.current
      payload = data_params.to_h

      setting.assign_from_frontend_payload(payload)
      setting.save!

      render json: { success: true }
    end

    private

    def data_params
      params.permit(
        :about,
        :profileImage,
        :profileImageSize,
        :featuredProjectTitle,
        skills: [],
        projects: [
          :title,
          :description,
          :image,
          :url,
          :live,
          :github,
          :category,
          :status,
          :problem,
          :solution,
          :challenges,
          :learned,
          :manualImages,
          { tech: [] },
          { features: [] },
          { images: [] }
        ]
      )
    end
  end
end
