import React, { useEffect, useState } from "react";

const defaultProjects = [
  {
    title: "Spicy Game App",
    description: "A spicy, game-focused web app with custom interactions.",
    image: "/images/spicy-game.png",
    url: "https://spicygame.example.com",
  },
  {
    title: "Portfolio Website",
    description: "My personal portfolio showcasing projects and skills.",
    image: "/images/portfolio.png",
    url: "https://portfolio.example.com",
  },
];

export default function Projects() {
  const [projects, setProjects] = useState(defaultProjects);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    image: "",
    url: "",
  });

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        const [sessionRes, dataRes] = await Promise.all([
          fetch("/api/check-session", { credentials: "include" }),
          fetch("/api/data", { credentials: "include" }),
        ]);

        const sessionData = await sessionRes.json();
        setIsLoggedIn(Boolean(sessionData.loggedIn));

        const data = await dataRes.json();
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
        }
      } catch {
        setProjects(defaultProjects);
      }
    };

    loadProjectData();
  }, []);

  const handleNewProjectChange = (field, value) => {
    setNewProject((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormMessage("");
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
        setFormMessage(data.message || "Image upload failed");
        return;
      }

      setNewProject((prev) => ({ ...prev, image: data.url || "" }));
      setFormMessage("Image uploaded. You can save the project now.");
    } catch {
      setFormMessage("Unable to upload image right now.");
    } finally {
      e.target.value = "";
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setFormMessage("");

    const title = newProject.title.trim();
    const description = newProject.description.trim();
    const image = newProject.image.trim();
    const url = newProject.url.trim();

    if (!title || !description || !image || !url) {
      setFormMessage("Please fill in project name, description, image, and link.");
      return;
    }

    const updatedProjects = [{ title, description, image, url }, ...projects];

    try {
      setSaving(true);
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ projects: updatedProjects }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setFormMessage(data.message || "Could not save project");
        return;
      }

      setProjects(updatedProjects);
      setNewProject({ title: "", description: "", image: "", url: "" });
      setFormMessage("Project saved and now visible.");
    } catch {
      setFormMessage("Unable to save project right now.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="projects-page">
      {isLoggedIn && (
        <form className="project-card add-project-card" onSubmit={handleAddProject}>
          <h3>Add New Project</h3>
          <input
            type="text"
            placeholder="Project name"
            value={newProject.title}
            onChange={(e) => handleNewProjectChange("title", e.target.value)}
            required
          />
          <textarea
            placeholder="Project description"
            value={newProject.description}
            onChange={(e) => handleNewProjectChange("description", e.target.value)}
            rows={3}
            required
          />
          <input
            type="url"
            placeholder="Project link (https://...)"
            value={newProject.url}
            onChange={(e) => handleNewProjectChange("url", e.target.value)}
            required
          />
          <input
            type="url"
            placeholder="Image URL or upload below"
            value={newProject.image}
            onChange={(e) => handleNewProjectChange("image", e.target.value)}
            required
          />
          <label className="project-upload-label">
            <span>Upload Image</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Project"}
          </button>
          {formMessage && <p className="project-form-message">{formMessage}</p>}
        </form>
      )}

      <div className="projects-container">
        {projects.map((project, index) => (
          <div key={`${project.title}-${index}`} className="project-card">
            <img src={project.image} alt={project.title} />
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              View Live
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}