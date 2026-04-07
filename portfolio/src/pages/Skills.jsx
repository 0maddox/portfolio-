import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const githubUsername = "0maddox";

const coreSkills = [
  {
    name: "React.js",
    percent: 85,
    icon: "https://cdn.simpleicons.org/react/61DAFB",
    match: ["react", "jsx"],
  },
  {
    name: "JavaScript",
    percent: 90,
    icon: "https://cdn.simpleicons.org/javascript/F7DF1E",
    match: ["javascript", "js"],
  },
  {
    name: "HTML",
    percent: 95,
    icon: "https://cdn.simpleicons.org/html5/E34F26",
    match: ["html"],
  },
  {
    name: "CSS",
    percent: 85,
    icon: "https://cdn.simpleicons.org/css/1572B6",
    match: ["css", "scss"],
  },
  {
    name: "Ruby on Rails",
    percent: 70,
    icon: "https://cdn.simpleicons.org/rubyonrails/D30001",
    match: ["ruby", "rails"],
  },
  {
    name: "SQL",
    percent: 75,
    icon: "https://cdn.simpleicons.org/mysql/4479A1",
    match: ["sql", "mysql"],
  },
  {
    name: "PostgreSQL",
    percent: 75,
    icon: "https://cdn.simpleicons.org/postgresql/4169E1",
    match: ["postgresql", "postgres"],
  },
];

const focus = [
  "Frontend Development (React + UI/UX)",
  "Interactive Web Applications",
  "User-Centered Design (Psychology-driven)",
  "Responsive and Mobile-First Design",
  "Building Scalable Web Apps",
];

const tools = [
  { name: "Git", icon: "https://cdn.simpleicons.org/git/F05032" },
  { name: "GitHub", icon: "https://cdn.simpleicons.org/github/FFFFFF" },
  { name: "Vite", icon: "https://cdn.simpleicons.org/vite/646CFF" },
  { name: "VS Code", icon: "https://cdn.simpleicons.org/visualstudiocode/007ACC" },
  { name: "Figma", icon: "https://cdn.simpleicons.org/figma/F24E1E" },
  { name: "DevTools", icon: "https://cdn.simpleicons.org/googlechrome/4285F4" },
];

const learning = [
  "Advanced React Patterns",
  "Framer Motion Animations",
  "Full-stack Integration (React + Ruby)",
  "API Integration",
  "Performance Optimization",
];

function includesAny(text, targets) {
  const source = (text || "").toLowerCase();
  return targets.some((t) => source.includes(t));
}

export default function Skills() {
  const [repos, setRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [repoError, setRepoError] = useState("");
  const [selectedSkill, setSelectedSkill] = useState(coreSkills[0].name);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoadingRepos(true);
        setRepoError("");

        const res = await fetch(
          `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`
        );

        if (!res.ok) {
          setRepoError("Unable to load GitHub stats right now.");
          return;
        }

        const data = await res.json();
        const normalized = Array.isArray(data)
          ? data
              .filter((repo) => !repo.fork)
              .map((repo) => ({
                id: repo.id,
                name: repo.name,
                description: repo.description || "No description provided.",
                language: (repo.language || "").toLowerCase(),
                stars: repo.stargazers_count || 0,
                url: repo.html_url,
                pushedAt: repo.pushed_at,
              }))
          : [];

        setRepos(normalized);
      } catch {
        setRepoError("Unable to load GitHub stats right now.");
      } finally {
        setLoadingRepos(false);
      }
    };

    fetchRepos();
  }, []);

  const skillUsage = useMemo(() => {
    const usage = {};

    coreSkills.forEach((skill) => {
      usage[skill.name] = repos.filter((repo) => {
        return (
          includesAny(repo.language, skill.match) ||
          includesAny(repo.name, skill.match) ||
          includesAny(repo.description, skill.match)
        );
      }).length;
    });

    return usage;
  }, [repos]);

  const filteredProjects = useMemo(() => {
    const skill = coreSkills.find((s) => s.name === selectedSkill);
    if (!skill) return [];

    return repos
      .filter((repo) => {
        return (
          includesAny(repo.language, skill.match) ||
          includesAny(repo.name, skill.match) ||
          includesAny(repo.description, skill.match)
        );
      })
      .slice(0, 8);
  }, [repos, selectedSkill]);

  const githubStats = useMemo(() => {
    const totalStars = repos.reduce((sum, repo) => sum + repo.stars, 0);
    const latestCommit = repos
      .map((repo) => repo.pushedAt)
      .filter(Boolean)
      .sort((a, b) => new Date(b) - new Date(a))[0];

    return {
      totalRepos: repos.length,
      totalStars,
      latestCommit: latestCommit
        ? new Date(latestCommit).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A",
    };
  }, [repos]);

  return (
    <section className="skills-page">
      <h2>My Skills</h2>
      <p className="skills-intro">
        I&apos;m Nicholas Musau Kioko, a 23-year-old developer living in Nairobi. These
        are my levels, workflow, focus areas, and growth powered by real GitHub repo data.
      </p>

      <div className="skills-stats-grid">
        <article className="skills-stat-card">
          <strong>{loadingRepos ? "..." : githubStats.totalRepos}</strong>
          <span>GitHub Repositories</span>
        </article>
        <article className="skills-stat-card">
          <strong>{loadingRepos ? "..." : githubStats.totalStars}</strong>
          <span>Total Stars</span>
        </article>
        <article className="skills-stat-card">
          <strong>{loadingRepos ? "..." : githubStats.latestCommit}</strong>
          <span>Latest Commit</span>
        </article>
      </div>

      <h3>Core Technologies</h3>
      <div className="skills-core-grid">
        {coreSkills.map((skill) => (
          <motion.article
            key={skill.name}
            className={`skill-card skill-card-advanced ${selectedSkill === skill.name ? "skill-active" : ""}`}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedSkill(skill.name)}
          >
            <div className="skill-head-row">
              <img src={skill.icon} alt="" aria-hidden="true" />
              <h4>{skill.name}</h4>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress"
                initial={{ width: 0 }}
                animate={{ width: `${skill.percent}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <span>{skill.percent}%</span>
            <small>{loadingRepos ? "Loading usage..." : `Used in ${skillUsage[skill.name] || 0} repo(s)`}</small>
          </motion.article>
        ))}
      </div>

      <div className="skills-section-grid">
        <article className="skills-section-card">
          <h3>Development Focus</h3>
          <div className="skills-badges">
            {focus.map((item) => (
              <span key={item} className="skills-badge tooltip-chip">
                {item}
                <span className="tooltip-text">Focus area</span>
              </span>
            ))}
          </div>
        </article>

        <article className="skills-section-card">
          <h3>Tools & Workflow</h3>
          <div className="skills-badges">
            {tools.map((tool) => (
              <span key={tool.name} className="skills-badge tooltip-chip">
                <img src={tool.icon} alt="" aria-hidden="true" />
                {tool.name}
                <span className="tooltip-text">Workflow tool</span>
              </span>
            ))}
          </div>
        </article>

        <article className="skills-section-card skills-full-width">
          <h3>What I’m Currently Learning</h3>
          <div className="skills-badges">
            {learning.map((item) => (
              <span key={item} className="skills-badge tooltip-chip">
                {item}
                <span className="tooltip-text">Growth path</span>
              </span>
            ))}
          </div>
        </article>
      </div>

      <h3>Projects using this skill</h3>
      <div className="skills-filter-row">
        {coreSkills.map((skill) => (
          <button
            key={skill.name}
            type="button"
            className={`skills-filter-btn ${selectedSkill === skill.name ? "active" : ""}`}
            onClick={() => setSelectedSkill(skill.name)}
          >
            {skill.name}
          </button>
        ))}
      </div>

      {repoError && <p className="repo-error">{repoError}</p>}
      {loadingRepos && <p>Loading projects...</p>}

      {!loadingRepos && !repoError && (
        <div className="skills-projects-grid">
          {filteredProjects.length === 0 && <p>No matching projects found yet.</p>}
          {filteredProjects.map((project) => (
            <a
              key={project.id}
              className="skills-project-card"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h4>{project.name}</h4>
              <p>{project.description}</p>
              <span>{project.language || "n/a"}</span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
