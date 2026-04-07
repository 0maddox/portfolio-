import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const githubUsername = "0maddox";

const projects = [
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

export default function Projects() {
  const [selected, setSelected] = useState("All");
  const [activeProject, setActiveProject] = useState(null);
  const [githubProjects, setGithubProjects] = useState([]);

  useEffect(() => {
    const fetchGithubProjects = async () => {
      try {
        const res = await fetch(
          `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=12`
        );
        if (!res.ok) return;

        const data = await res.json();
        const mapped = Array.isArray(data)
          ? data.filter((repo) => !repo.fork).map((repo) => ({
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
      } catch {
        setGithubProjects([]);
      }
    };

    fetchGithubProjects();
  }, []);

  const allProjects = useMemo(() => {
    return [...projects, ...githubProjects];
  }, [githubProjects]);

  const filteredProjects = useMemo(() => {
    return selected === "All"
      ? allProjects
      : allProjects.filter((p) => p.category === selected);
  }, [allProjects, selected]);

  const featuredProject = projects[0];

  return (
    <section className="projects-premium-page">
      <h2>My Projects</h2>

      <motion.article
        className="featured-project"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="project-eyebrow">Featured Project</p>
        <img src={featuredProject.image} alt={featuredProject.title} />
        <h3>{featuredProject.title}</h3>
        <p>{featuredProject.description}</p>
      </motion.article>

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
            onClick={() => setActiveProject(project)}
          >
            <div className="project-media-wrap">
              <img src={project.image} alt={project.title} />
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
        <div className="project-modal-backdrop" onClick={() => setActiveProject(null)}>
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