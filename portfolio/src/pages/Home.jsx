import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const learnedLanguageIcons = [
  { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
  { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
  { name: "HTML", icon: "https://cdn.simpleicons.org/html5/E34F26" },
  { name: "CSS", icon: "https://cdn.simpleicons.org/css/1572B6" },
  { name: "Ruby", icon: "https://cdn.simpleicons.org/ruby/CC342D" },
  { name: "Rails", icon: "https://cdn.simpleicons.org/rubyonrails/D30001" },
  { name: "SQL", icon: "https://cdn.simpleicons.org/mysql/4479A1" },
  { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
];

const stats = [
  { value: "12+", label: "Production Projects" },
  { value: "4+", label: "Years Learning & Building" },
  { value: "99%", label: "Focus On Performance" },
];

const highlights = [
  "React, JavaScript, HTML, and CSS front-end development",
  "Ruby on Rails backend architecture",
  "SQL and PostgreSQL database design",
  "Animation-focused interfaces with Framer Motion",
];

const githubProfileUrl = "https://github.com/0maddox";

export default function Home() {
  const [repos, setRepos] = useState([]);
  const [reposVisible, setReposVisible] = useState(false);
  const [reposLoading, setReposLoading] = useState(false);
  const [repoError, setRepoError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [profileImage, setProfileImage] = useState("/images/me.jpg");
  const [heroDescription, setHeroDescription] = useState(
    "I am Nicholas Musau Kioko, a 23-year-old developer based in Nairobi. I work with React, JavaScript, HTML, CSS, Ruby on Rails, SQL, and PostgreSQL to design and ship scalable web products with strong UX, clean code, and meaningful motion."
  );
  const [editDescription, setEditDescription] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [centerIconIndex, setCenterIconIndex] = useState(0);
  const [centerIconVisible, setCenterIconVisible] = useState(false);
  const [currentRepo, setCurrentRepo] = useState(null);
  const [currentRepoLoading, setCurrentRepoLoading] = useState(true);

  const githubUsername = useMemo(() => {
    try {
      const url = new URL(githubProfileUrl);
      return url.pathname.replace(/^\//, "").trim();
    } catch {
      return "";
    }
  }, []);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [sessionRes, dataRes] = await Promise.all([
          fetch("/api/check-session", { credentials: "include" }),
          fetch("/api/data", { credentials: "include" }),
        ]);

        const sessionData = await sessionRes.json();
        setIsAdmin(Boolean(sessionData.loggedIn));

        const data = await dataRes.json();
        const nextDescription = (data.about || "").trim();
        const nextImage = (data.profileImage || "").trim();

        if (nextDescription) {
          setHeroDescription(nextDescription);
          setEditDescription(nextDescription);
        } else {
          setEditDescription(heroDescription);
        }

        if (nextImage) {
          setProfileImage(nextImage);
        }
      } catch {
        setIsAdmin(false);
      }
    };

    loadHomeData();

    const onSessionChanged = () => {
      loadHomeData();
    };

    window.addEventListener("admin-session-changed", onSessionChanged);
    return () => {
      window.removeEventListener("admin-session-changed", onSessionChanged);
    };
  }, []);

  useEffect(() => {
    const fetchCurrentWorkingRepo = async () => {
      if (!githubUsername) {
        setCurrentRepoLoading(false);
        return;
      }

      try {
        setCurrentRepoLoading(true);
        const res = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=24`);
        if (!res.ok) {
          setCurrentRepoLoading(false);
          return;
        }

        const repos = await res.json();
        const candidates = Array.isArray(repos)
          ? repos.filter((repo) => !repo.fork && repo.pushed_at)
          : [];

        if (candidates.length === 0) {
          setCurrentRepoLoading(false);
          return;
        }

        candidates.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
        const selected = candidates[0];

        setCurrentRepo({
          name: selected.name,
          description: selected.description || "Actively improving this project.",
          image: selected.owner?.avatar_url || "/images/portfolio.png",
          url: selected.html_url,
          lastCommit: selected.pushed_at,
        });
      } catch {
        setCurrentRepo(null);
      } finally {
        setCurrentRepoLoading(false);
      }
    };

    fetchCurrentWorkingRepo();
  }, [githubUsername]);

  const featuredProject = {
    name: "Maddox Gaming Supplies Page",
    description: "Top featured project with product-focused UI and conversion-first layout.",
    image: "/images/portfolio.png",
    url: "https://github.com/0maddox",
  };

  const formatCommitDate = (isoDate) => {
    if (!isoDate) return "Unknown";
    const d = new Date(isoDate);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCenterIconIndex((prev) => (prev + 1) % learnedLanguageIcons.length);
      setCenterIconVisible(true);

      window.setTimeout(() => {
        setCenterIconVisible(false);
      }, 10000);
    }, 12000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileMessage("");
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setProfileMessage(data.message || "Could not upload image");
        return;
      }

      setProfileImage(data.url || profileImage);
      setProfileMessage("Image uploaded. Save profile to apply.");
    } catch {
      setProfileMessage("Unable to upload image right now.");
    } finally {
      e.target.value = "";
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMessage("");

    const about = editDescription.trim();
    if (!about) {
      setProfileMessage("Please type a description.");
      return;
    }

    try {
      setSavingProfile(true);
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          about,
          profileImage,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setProfileMessage(data.message || "Could not save profile changes.");
        return;
      }

      setHeroDescription(about);
      setShowProfileEditor(false);
      setProfileMessage("Profile updated successfully.");
    } catch {
      setProfileMessage("Unable to save profile right now.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDisplayRepositories = async () => {
    const nextVisible = !reposVisible;
    setReposVisible(nextVisible);

    if (!nextVisible || repos.length > 0 || reposLoading) {
      return;
    }

    if (!githubUsername) {
      setRepoError("Invalid GitHub profile link.");
      return;
    }

    setReposLoading(true);
    setRepoError("");

    try {
      const res = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=12`);
      if (!res.ok) {
        setRepoError("Could not load repositories from GitHub.");
        return;
      }

      const data = await res.json();
      const normalized = Array.isArray(data)
        ? data.map((repo) => ({
            id: repo.id,
            name: repo.name,
            description: repo.description || "No description provided.",
            language: repo.language || "Not specified",
            stars: repo.stargazers_count || 0,
            url: repo.html_url,
          }))
        : [];

      setRepos(normalized);
    } catch {
      setRepoError("Unable to fetch repositories right now.");
    } finally {
      setReposLoading(false);
    }
  };

  return (
    <main className="home-hero section-box">
      <motion.section
        className="hero-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="hero-copy">
          <motion.div variants={itemVariants} className="hero-avatar-wrap">
            <img src={profileImage} alt="Nicholas Musau Kioko profile" className="hero-avatar" />
            {isAdmin && (
              <button
                type="button"
                className="btn hero-btn-secondary hero-avatar-edit-btn"
                onClick={() => {
                  setShowProfileEditor((prev) => !prev);
                  setEditDescription(heroDescription);
                  setProfileMessage("");
                }}
              >
                {showProfileEditor ? "Close Edit Profile" : "Edit Profile"}
              </button>
            )}
          </motion.div>

          <motion.p variants={itemVariants} className="hero-kicker">
            Available For Freelance & Full-Time Roles
          </motion.p>

          <motion.h1 variants={itemVariants}>
            Hi, I&apos;m Nicholas Musau Kioko. I&apos;m a 23-year-old developer in Nairobi building fast, beautiful web experiences.
          </motion.h1>

          <motion.p variants={itemVariants} className="hero-description">
            {heroDescription}
          </motion.p>

          <motion.div variants={itemVariants} className="hero-actions">
            <Link to="/projects" className="btn">
              Explore Projects
            </Link>
            <Link to="/contact" className="btn">
              Let&apos;s Work Together
            </Link>
            <button
              type="button"
              className="btn"
              onClick={handleDisplayRepositories}
            >
              {reposVisible ? "Hide Repositories" : "Display Repositories"}
            </button>
          </motion.div>

          {isAdmin && showProfileEditor && (
            <motion.form
              className="hero-profile-editor"
              onSubmit={handleSaveProfile}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <label className="hero-upload-label">
                <span>Upload Profile Picture</span>
                <input type="file" accept="image/*" onChange={handleProfileImageUpload} />
              </label>
              <textarea
                rows={4}
                placeholder="Type a new hero description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                required
              />
              <button type="submit" className="btn" disabled={savingProfile}>
                {savingProfile ? "Saving..." : "Save Profile"}
              </button>
              {profileMessage && <p className="profile-message">{profileMessage}</p>}
            </motion.form>
          )}

          <motion.ul variants={itemVariants} className="hero-highlights">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </motion.ul>
        </div>

        <motion.aside variants={itemVariants} className="hero-panel">
          <p className="hero-panel-title">Current Focus</p>
          <h2>Crafting portfolio-grade products with measurable results.</h2>
          <p className="hero-panel-copy">
            My recent work centers on responsive dashboards, dynamic admin tools,
            and conversion-optimized pages that blend performance with elegant UI.
          </p>

          <div className="hero-stats">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                className="hero-stat-card"
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.22 }}
              >
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </motion.div>
            ))}
          </div>

          <div className="language-orbit-panel">
            <p className="hero-panel-title">Languages Learnt</p>

            <div className="language-orbit-wrap">
              <div className="language-orbit-track">
                {learnedLanguageIcons.map((item, index) => {
                  const angle = (index / learnedLanguageIcons.length) * Math.PI * 2;
                  const radius = 112;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  const movingToCenter = centerIconVisible && centerIconIndex === index;

                  return (
                    <div
                      key={item.name}
                      className={`language-orbit-item ${movingToCenter ? "orbit-item-hidden" : ""}`}
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                      title={item.name}
                    >
                      <img src={item.icon} alt={item.name} />
                    </div>
                  );
                })}
              </div>

              {centerIconVisible && (
                <motion.div
                  className="language-center-jump"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.8, 1.06, 1], opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                  title={learnedLanguageIcons[centerIconIndex].name}
                >
                  <img
                    src={learnedLanguageIcons[centerIconIndex].icon}
                    alt={learnedLanguageIcons[centerIconIndex].name}
                  />
                  <span className="language-center-name">
                    {learnedLanguageIcons[centerIconIndex].name}
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.aside>
      </motion.section>

      {reposVisible && (
        <motion.section
          className="repo-section"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div className="repo-header-row">
            <h2>GitHub Repositories</h2>
            <a href={githubProfileUrl} target="_blank" rel="noopener noreferrer" className="btn hero-btn-secondary">
              View Profile
            </a>
          </div>

          {reposLoading && <p>Loading repositories...</p>}
          {repoError && <p className="repo-error">{repoError}</p>}

          {!reposLoading && !repoError && (
            <div className="repo-grid">
              {repos.map((repo) => (
                <article key={repo.id} className="repo-card">
                  <h3>{repo.name}</h3>
                  <p>{repo.description}</p>
                  <div className="repo-meta">
                    <span>{repo.language}</span>
                    <span>{repo.stars} stars</span>
                  </div>
                  <a href={repo.url} target="_blank" rel="noopener noreferrer">
                    Open Repository
                  </a>
                </article>
              ))}
            </div>
          )}
        </motion.section>
      )}

      <section className="home-projects-row">
        <a
          className="home-project-card"
          href={currentRepo?.url || `https://github.com/${githubUsername}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="home-project-label">Currently Working On</p>
          <img
            src={currentRepo?.image || "/images/portfolio.png"}
            alt={currentRepo?.name || "Current project"}
          />
          <h3>{currentRepoLoading ? "Loading project..." : (currentRepo?.name || "No recent project found")}</h3>
          <p>{currentRepo?.description || "Link your latest active work from GitHub."}</p>
          <span className="home-project-meta">
            Last commit: {currentRepoLoading ? "Loading..." : formatCommitDate(currentRepo?.lastCommit)}
          </span>
        </a>

        <a
          className="home-project-card"
          href={featuredProject.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="home-project-label">Top Featured</p>
          <img src={featuredProject.image} alt={featuredProject.name} />
          <h3>{featuredProject.name}</h3>
          <p>{featuredProject.description}</p>
          <span className="home-project-meta">Open project</span>
        </a>
      </section>
    </main>
  );
}