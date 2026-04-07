import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const githubUsername = "0maddox";
const GITHUB_CACHE_KEY = "portfolio_projects_github_cache_v1";
const GITHUB_CACHE_TTL_MS = 10 * 60 * 1000;

const baseProjects = [
  {
    title: "CODM Tournament Platform",
    description:
      "A platform for organizing and managing Call of Duty Mobile tournaments, including player registration and match tracking.",
    image: "/images/codm.png",
    tech: ["React", "CSS", "Ruby on Rails", "PostgreSQL"],
    live: "https://your-live-link.com",
    github: "https://github.com/your-repo",
    category: "Gaming",
    status: "In Progress",
    problem: "No easy way to manage tournament registration and match flow in one place.",
    solution: "Built a structured platform for registrations, brackets, and match tracking.",
    features: ["Player registration", "Match tracking", "Tournament board"],
    challenges: "Designing reliable tournament progression and clear UX for competitive players.",
    learned: "Improved full-stack planning, component architecture, and product-first thinking.",
  },
  {
    title: "Couples Game App",
    description:
      "An interactive web app designed for couples and social settings with engaging and dynamic gameplay features.",
    image: "/images/game.png",
    tech: ["React", "JavaScript", "CSS"],
    live: "https://your-live-link.com",
    github: "https://github.com/your-repo",
    category: "Interactive",
    status: "Live",
    problem: "Many social/couples games lack polished digital interaction and flow.",
    solution: "Created an interactive game interface with dynamic rounds and smooth transitions.",
    features: ["Dynamic prompts", "Session flow", "Mobile-friendly UI"],
    challenges: "Balancing playful UX with responsive performance across devices.",
    learned: "Strengthened animation timing and interaction design decisions.",
  },
];

const categories = ["All", "Web App", "Interactive", "Gaming"];

const techIcons = {
  React: "https://cdn.simpleicons.org/react/61DAFB",
  JavaScript: "https://cdn.simpleicons.org/javascript/F7DF1E",
  HTML: "https://cdn.simpleicons.org/html5/E34F26",
  CSS: "https://cdn.simpleicons.org/css/1572B6",
  "Ruby on Rails": "https://cdn.simpleicons.org/rubyonrails/D30001",
  PostgreSQL: "https://cdn.simpleicons.org/postgresql/4169E1",
  SQL: "https://cdn.simpleicons.org/mysql/4479A1",
  Codebase: "https://cdn.simpleicons.org/github/FFFFFF",
};

function statusClass(status) {
  if (status === "Live") return "live";
  if (status === "In Progress") return "progress";
  return "soon";
}

function normalizeProject(project) {
  const normalizedTitle = (project?.title || "Untitled Project").toString();
  const normalizedDescription = (project?.description || "Project details coming soon.").toString();
  const normalizedCategory = (project?.category || "Web App").toString();
  const normalizedStatus = (project?.status || "In Progress").toString();
  const normalizedProblem = (project?.problem || "Problem statement not provided yet.").toString();
  const normalizedSolution = (project?.solution || "Solution details will be added soon.").toString();
  const normalizedChallenges = (project?.challenges || "Challenges to be documented.").toString();
  const normalizedLearned = (project?.learned || "Learning outcomes to be added.").toString();
  const normalizedLive = (project?.live || project?.url || "").toString();
  const normalizedGithub = (project?.github || project?.url || "https://github.com/0maddox").toString();

  const images = Array.isArray(project?.images)
    ? project.images.filter(Boolean)
    : [];
  const fallbackImage = project?.image || "/images/portfolio.png";
  const normalizedTech = Array.isArray(project?.tech) && project.tech.length > 0
    ? project.tech.filter(Boolean).map((item) => item.toString())
    : ["Codebase"];
  const normalizedFeatures = Array.isArray(project?.features) && project.features.length > 0
    ? project.features.filter(Boolean).map((item) => item.toString())
    : ["Details in progress"];

  return {
    ...project,
    title: normalizedTitle,
    description: normalizedDescription,
    category: normalizedCategory,
    status: normalizedStatus,
    problem: normalizedProblem,
    solution: normalizedSolution,
    challenges: normalizedChallenges,
    learned: normalizedLearned,
    live: normalizedLive,
    github: normalizedGithub,
    tech: normalizedTech,
    features: normalizedFeatures,
    image: fallbackImage,
    images: images.length > 0 ? images : [fallbackImage],
  };
}

export default function Projects() {
  const [selected, setSelected] = useState("All");
  const [activeProject, setActiveProject] = useState(null);
  const [githubProjects, setGithubProjects] = useState([]);
  const [editableProjects, setEditableProjects] = useState(baseProjects.map(normalizeProject));
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState(baseProjects[0]?.title || "");
  const [editorMessage, setEditorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageIndexes, setImageIndexes] = useState({});
  const [maximizedMedia, setMaximizedMedia] = useState({});
  const [ignoreBackdropUntil, setIgnoreBackdropUntil] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const loadLocalPageData = async () => {
      try {
        const [sessionRes, dataRes] = await Promise.all([
          fetch("/api/check-session", { credentials: "include" }),
          fetch("/api/data", { credentials: "include" }),
        ]);

        if (cancelled) return;

        const sessionData = await sessionRes.json();
        setIsAdmin(Boolean(sessionData.loggedIn));

        if (dataRes.ok) {
          const siteData = await dataRes.json();
          const storedProjects = Array.isArray(siteData?.projects) && siteData.projects.length > 0
            ? siteData.projects
            : baseProjects;
          const normalizedStored = storedProjects.map(normalizeProject);
          setEditableProjects(normalizedStored);
          setSelectedProjectTitle(normalizedStored[0]?.title || "");
        }
      } catch {
        if (cancelled) return;
        setIsAdmin(false);
      }
    };

    const loadGithubProjects = async () => {
      try {
        const cachedRaw = sessionStorage.getItem(GITHUB_CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (
            cached &&
            Array.isArray(cached.items) &&
            typeof cached.savedAt === "number" &&
            Date.now() - cached.savedAt < GITHUB_CACHE_TTL_MS
          ) {
            setGithubProjects(cached.items);
            return;
          }
        }
      } catch {
        // If cache parsing fails, continue with network fetch.
      }

      try {
        const githubRes = await fetch(
          `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=12`,
          { signal: controller.signal }
        );

        if (!githubRes.ok || cancelled) return;

        const data = await githubRes.json();
        const mapped = Array.isArray(data)
          ? data.filter((repo) => !repo.fork).map((repo) => normalizeProject({
              title: repo.name,
              description: repo.description || "Repository synced from GitHub.",
              image: "/images/portfolio.png",
              tech: [repo.language || "Codebase"],
              live: repo.homepage || "",
              github: repo.html_url,
              category: "Web App",
              status: repo.homepage ? "Live" : "In Progress",
              problem: "Need a maintainable project structure and clear implementation path.",
              solution: "Implemented and iterated features directly from real project requirements.",
              features: ["Version controlled", "Ongoing iteration", "Practical architecture"],
              challenges: "Managing scope and technical trade-offs while improving quality.",
              learned: "Better workflow discipline, debugging approach, and delivery speed.",
            }))
          : [];

        setGithubProjects(mapped);
        try {
          sessionStorage.setItem(
            GITHUB_CACHE_KEY,
            JSON.stringify({ items: mapped, savedAt: Date.now() })
          );
        } catch {
          // Ignore cache write failures.
        }
      } catch {
        if (!cancelled) {
          setGithubProjects([]);
        }
      }
    };

    loadLocalPageData();
    loadGithubProjects();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const allProjects = useMemo(() => {
    return [...editableProjects, ...githubProjects];
  }, [editableProjects, githubProjects]);

  const filteredProjects = useMemo(() => {
    return selected === "All"
      ? allProjects
      : allProjects.filter((p) => p.category === selected);
  }, [allProjects, selected]);

  const featuredProject = editableProjects[0] || allProjects[0] || null;

  const cycleProjectImage = (projectKey, totalImages, direction) => {
    if (totalImages <= 1) return;
    setImageIndexes((prev) => {
      const current = prev[projectKey] || 0;
      const next = (current + direction + totalImages) % totalImages;
      return { ...prev, [projectKey]: next };
    });
  };

  const toggleMediaSize = (projectKey) => {
    setMaximizedMedia((prev) => ({ ...prev, [projectKey]: !prev[projectKey] }));
  };

  const handleUploadProjectImages = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!selectedProjectTitle || files.length === 0) return;

    setEditorMessage("");
    setIsUploading(true);

    try {
      const uploadedUrls = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.url) {
          setEditorMessage(data.message || "Failed to upload one or more images.");
          setIsUploading(false);
          return;
        }

        uploadedUrls.push(data.url);
      }

      setEditableProjects((prev) => prev.map((project) => {
        if (project.title !== selectedProjectTitle) return project;

        const nextImages = [...(project.images || []), ...uploadedUrls].filter(Boolean);
        return {
          ...project,
          image: nextImages[0] || project.image,
          images: nextImages,
        };
      }));

      setEditorMessage(`${uploadedUrls.length} image(s) uploaded. Click Save Project Media to persist.`);
    } catch {
      setEditorMessage("Unable to upload images right now.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProjectMedia = async () => {
    setEditorMessage("");
    setIsSaving(true);

    try {
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ projects: editableProjects }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setEditorMessage(data.message || "Could not save project media.");
        return;
      }

      setEditorMessage("Project media saved successfully.");
    } catch {
      setEditorMessage("Unable to save project media right now.");
    } finally {
      setIsSaving(false);
    }
  };

  const openProjectModal = (project) => {
    // Guard against the opening click being interpreted as a backdrop close.
    setIgnoreBackdropUntil(Date.now() + 220);
    window.setTimeout(() => {
      setActiveProject(project);
    }, 0);
  };

  const handleBackdropClose = (event) => {
    if (event.target !== event.currentTarget) return;
    if (Date.now() < ignoreBackdropUntil) return;
    setActiveProject(null);
  };

  return (
    <section className="projects-premium-page">
      <h2>My Projects</h2>

      {isAdmin && (
        <div className="projects-admin-controls">
          <button
            type="button"
            className="btn"
            onClick={() => {
              setShowEditor((prev) => !prev);
              setEditorMessage("");
            }}
          >
            {showEditor ? "Close Edit Projects" : "Edit Projects"}
          </button>

          {showEditor && (
            <div className="add-project-card projects-editor-panel">
              <label htmlFor="project-picker">Select project</label>
              <select
                id="project-picker"
                value={selectedProjectTitle}
                onChange={(e) => setSelectedProjectTitle(e.target.value)}
              >
                {editableProjects.map((project) => (
                  <option key={project.title} value={project.title}>
                    {project.title}
                  </option>
                ))}
              </select>

              <label className="project-upload-label" htmlFor="project-images-input">
                Upload Project Images
                <input
                  id="project-images-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUploadProjectImages}
                  disabled={isUploading}
                />
              </label>

              <button
                type="button"
                onClick={handleSaveProjectMedia}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Project Media"}
              </button>

              {editorMessage && <p className="project-form-message">{editorMessage}</p>}
            </div>
          )}
        </div>
      )}

      {featuredProject && (
        <motion.article
          className="featured-project"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="project-eyebrow">Featured Project</p>
          <img
            src={(featuredProject.images && featuredProject.images[0]) || featuredProject.image}
            alt={featuredProject.title}
            loading="eager"
            decoding="async"
          />
          <h3>{featuredProject.title}</h3>
          <p>{featuredProject.description}</p>
        </motion.article>
      )}

      <div className="project-filter-row">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`project-filter-chip ${selected === category ? "active" : ""}`}
            onClick={() => setSelected(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="projects-premium-grid">
        {filteredProjects.map((project, index) => (
          <motion.article
            key={`${project.title}-${index}`}
            className="project-premium-card"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -5, scale: 1.01 }}
            onClick={() => openProjectModal(project)}
          >
            {(() => {
              const projectKey = `${project.title}-${index}`;
              const images = Array.isArray(project.images) && project.images.length > 0
                ? project.images
                : [project.image || "/images/portfolio.png"];
              const currentIndex = imageIndexes[projectKey] || 0;
              const safeIndex = currentIndex >= images.length ? 0 : currentIndex;

              return (
                <div className={`project-media-wrap ${maximizedMedia[projectKey] ? "media-maximized" : ""}`}>
                  <img
                    src={images[safeIndex]}
                    alt={`${project.title} screenshot ${safeIndex + 1}`}
                    loading="lazy"
                    decoding="async"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="project-media-arrow arrow-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          cycleProjectImage(projectKey, images.length, -1);
                        }}
                        aria-label="Previous project image"
                      >
                        &#8249;
                      </button>
                      <button
                        type="button"
                        className="project-media-arrow arrow-right"
                        onClick={(e) => {
                          e.stopPropagation();
                          cycleProjectImage(projectKey, images.length, 1);
                        }}
                        aria-label="Next project image"
                      >
                        &#8250;
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="project-media-size-toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMediaSize(projectKey);
                    }}
                    aria-label={maximizedMedia[projectKey] ? "Minimize project image" : "Maximize project image"}
                  >
                    {maximizedMedia[projectKey] ? "-" : "+"}
                  </button>
                  {images.length > 1 && (
                    <span className="project-image-count">
                      {safeIndex + 1}/{images.length}
                    </span>
                  )}

                  <span className={`status-badge ${statusClass(project.status)}`}>{project.status}</span>
                  <div className="project-hover-overlay">
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <img src="https://cdn.simpleicons.org/googlechrome/FFFFFF" alt="" aria-hidden="true" />
                        Live Demo
                      </a>
                    )}
                    <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <img src="https://cdn.simpleicons.org/github/FFFFFF" alt="" aria-hidden="true" />
                      GitHub
                    </a>
                  </div>
                </div>
              );
            })()}

            <div className="project-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tech-stack">
                {project.tech.map((tech) => (
                  <span key={tech}>
                    <img src={techIcons[tech] || techIcons.Codebase} alt="" aria-hidden="true" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {activeProject && (
        <div className="project-modal-backdrop" onClick={handleBackdropClose}>
          <motion.div
            className="project-modal"
            initial={{ opacity: 0, y: 25, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="modal-close" onClick={() => setActiveProject(null)}>
              Close
            </button>
            <h3>{activeProject.title}</h3>
            <p><strong>What is it?</strong> {activeProject.description}</p>
            <p><strong>What problem does it solve?</strong> {activeProject.problem}</p>
            <p><strong>Solution:</strong> {activeProject.solution}</p>
            <p><strong>Key Features:</strong> {activeProject.features.join(", ")}</p>
            <p><strong>Challenges faced:</strong> {activeProject.challenges}</p>
            <p><strong>What I learned:</strong> {activeProject.learned}</p>
            <p><strong>Tech used:</strong> {activeProject.tech.join(", ")}</p>
            <div className="project-modal-links">
              {activeProject.live && (
                <a href={activeProject.live} target="_blank" rel="noopener noreferrer">
                  <img src="https://cdn.simpleicons.org/googlechrome/FFFFFF" alt="" aria-hidden="true" />
                  Can I see it live?
                </a>
              )}
              <a href={activeProject.github} target="_blank" rel="noopener noreferrer">
                <img src="https://cdn.simpleicons.org/github/FFFFFF" alt="" aria-hidden="true" />
                Can I view the code?
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}