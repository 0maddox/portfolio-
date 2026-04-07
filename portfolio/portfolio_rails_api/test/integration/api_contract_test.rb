require "test_helper"

class ApiContractTest < ActionDispatch::IntegrationTest
  setup do
    @admin = AdminCredential.create!(email: "nickkiim7@gmail.com", password: "Maddox@311")
    setting = SiteSetting.current
    setting.update!(
      about: "Contract about",
      profile_image: "/images/profile-default.png",
      profile_image_size: 180,
      featured_project_title: "Spicy Game App",
      skills: []
    )
  end

  test "check-session logged out matches frontend contract" do
    get "/api/check-session"
    assert_response :success
    assert_equal({ "loggedIn" => false }, JSON.parse(response.body))
  end

  test "login and check-session logged in contract" do
    post "/api/login", params: { email: "nickkiim7@gmail.com", password: "Maddox@311" }
    assert_response :success
    assert_equal({ "success" => true }, JSON.parse(response.body))

    get "/api/check-session"
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal true, body["loggedIn"]
    assert_equal "nickkiim7@gmail.com", body["email"]
  end

  test "invalid login contract" do
    post "/api/login", params: { email: "nickkiim7@gmail.com", password: "badpass" }
    assert_response :unauthorized
    assert_equal(
      { "success" => false, "message" => "Invalid credentials" },
      JSON.parse(response.body)
    )
  end

  test "data payload shape contract" do
    get "/api/data"
    assert_response :success
    body = JSON.parse(response.body)

    assert body.key?("projects")
    assert body.key?("about")
    assert body.key?("profileImage")
    assert body.key?("profileImageSize")
    assert body.key?("skills")
    assert body.key?("featuredProjectTitle")
  end

  test "update data unauthorized contract" do
    post "/api/data", params: { about: "New" }
    assert_response :forbidden
    assert_equal({ "message" => "Not authorized" }, JSON.parse(response.body))
  end

  test "forgot and reset password contract" do
    post "/api/forgot-password", params: { email: "nickkiim7@gmail.com" }
    assert_response :success
    forgot = JSON.parse(response.body)

    assert_equal true, forgot["success"]
    assert forgot["resetToken"].present?

    post "/api/reset-password", params: { token: forgot["resetToken"], newPassword: "NewPass@123" }
    assert_response :success
    assert_equal(
      { "success" => true, "message" => "Password reset successfully" },
      JSON.parse(response.body)
    )
  end
end
