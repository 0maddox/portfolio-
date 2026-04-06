import React, { useState } from "react";
import { motion } from "framer-motion";

const projects = [
  { id: 1, name: "Game App", category: "fullstack" },
  { id: 2, name: "Portfolio", category: "frontend" },
  { id: 3, name: "Dashboard", category: "react" },
];

export default function Projects() {
  const [filter, setFilter] = useState("all");

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <section className="section-box">
      <h2>Projects</h2>
      <p>Filtered project cards built with the main theme styles.</p>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => setFilter("all")} className="btn">
          All
        </button>
        <button onClick={() => setFilter("frontend")} className="btn" style={{ marginLeft: "0.75rem" }}>
          Frontend
        </button>
        <button onClick={() => setFilter("react")} className="btn" style={{ marginLeft: "0.75rem" }}>
          React
        </button>
      </div>

      <motion.div layout style={{ marginTop: "2rem", display: "grid", gap: "1.5rem" }}>
        {filteredProjects.map((project) => (
          <motion.div
            layout
            key={project.id}
            whileHover={{ scale: 1.03 }}
            className="card"
          >
            <h3>{project.name}</h3>
            <p>{project.category} project featuring modern UI and functionality.</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}