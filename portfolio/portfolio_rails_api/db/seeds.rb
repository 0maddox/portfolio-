admin_email = "nickkiim7@gmail.com"
admin_password = "Maddox@311"

admin = AdminCredential.find_or_initialize_by(email: admin_email)
admin.password = admin_password
admin.save!

setting = SiteSetting.current

if setting.projects.empty?
  setting.projects.create!(
    title: "Spicy Game App",
    description: "A spicy, game-focused web app with custom interactions.",
    image: "/images/spicy-game.png",
    images: ["/images/spicy-game.png"],
    url: "https://spicygame.example.com",
    live: "https://spicygame.example.com",
    github: "https://github.com/0maddox",
    category: "Gaming",
    status: "In Progress",
    problem: "No easy way to manage tournament registration and match flow in one place.",
    solution: "Built a structured platform for registrations, brackets, and match tracking.",
    features: ["Player registration", "Match tracking", "Tournament board"],
    challenges: "Designing reliable tournament progression and clear UX for competitive players.",
    learned: "Improved full-stack planning, component architecture, and product-first thinking.",
    tech: ["React", "CSS", "Ruby on Rails", "PostgreSQL"],
    manual_images: false
  )
end
