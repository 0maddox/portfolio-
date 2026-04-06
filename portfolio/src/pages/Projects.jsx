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
    <div className="py-20 max-w-5xl mx-auto px-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>

      <div className="flex justify-center gap-3 mb-8">
        <button onClick={() => setFilter("all")} className="px-4 py-2 rounded bg-gray-800 text-white">
          All
        </button>
        <button onClick={() => setFilter("frontend")} className="px-4 py-2 rounded bg-gray-800 text-white">
          Frontend
        </button>
        <button onClick={() => setFilter("react")} className="px-4 py-2 rounded bg-gray-800 text-white">
          React
        </button>
      </div>

      <motion.div layout className="grid md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <motion.div
            layout
            key={project.id}
            whileHover={{ scale: 1.05 }}
            className="border border-gray-800 p-4 rounded-lg"
          >
            <h3 className="font-semibold">{project.name}</h3>
            <p className="text-gray-400 text-sm">{project.category}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}