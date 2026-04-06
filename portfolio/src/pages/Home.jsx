import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="section-box">
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Hi, I'm a Software Developer</h1>
        <p>
          I build modern web applications using React, JavaScript, and modern UI
          design.
        </p>
        <div style={{ marginTop: "1.5rem" }}>
          <Link to="/projects" className="btn" style={{ marginRight: "1rem" }}>
            View Projects
          </Link>
          <Link to="/contact" className="btn">
            Contact Me
          </Link>
        </div>
      </motion.section>

      <section style={{ marginTop: "2rem", display: "grid", gap: "1rem" }}>
        <div className="card">
          <h2>Fullstack Web Apps</h2>
          <p>Responsive portfolio sites, dashboards, and SaaS frontends.</p>
        </div>
        <div className="card">
          <h2>UI / UX Design</h2>
          <p>Clean, modern layouts with a polished gold and grey theme.</p>
        </div>
      </section>
    </main>
  );
}