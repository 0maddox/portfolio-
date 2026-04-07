import React, { useState } from "react";
import { motion } from "framer-motion";
import AdminUploadPanel from "../components/AdminUploadPanel";
import { Link } from "react-router-dom";

const stacks = [
  {
    title: "Frontend",
    items: [
      { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
      { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
      { name: "HTML", icon: "https://cdn.simpleicons.org/html5/E34F26" },
      { name: "CSS", icon: "https://cdn.simpleicons.org/css/1572B6" },
    ],
  },
  {
    title: "Backend",
    items: [{ name: "Ruby on Rails", icon: "https://cdn.simpleicons.org/rubyonrails/D30001" }],
  },
  {
    title: "Database",
    items: [
      { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
      { name: "SQL", icon: "https://cdn.simpleicons.org/mysql/4479A1" },
    ],
  },
  {
    title: "Tools",
    items: [
      { name: "Git", icon: "https://cdn.simpleicons.org/git/F05032" },
      { name: "GitHub", icon: "https://cdn.simpleicons.org/github/FFFFFF" },
      { name: "Vite", icon: "https://cdn.simpleicons.org/vite/646CFF" },
    ],
  },
];

const milestones = [
  "Started with Psychology",
  "Discovered tech",
  "Transitioned into development",
];

const numbers = [
  { label: "Projects Built", value: "5+" },
  { label: "Technologies Used", value: "6+" },
  { label: "Years Learning", value: "2+" },
];

const personality = [
  "Interested in gaming & digital experiences",
  "Passionate about community building",
  "Enjoy learning new tech",
];

const timeline = [
  {
    year: "2021",
    event: "Studied Psychology",
    detail:
      "University of Nairobi, 4-year Bachelor's degree (2021 to 2025), graduated with Second Class Upper.",
  },
  {
    year: "2023",
    event: "Moringa School (Software Engineering)",
    detail: "Completed Moringa School Software Engineering certificate in 2023.",
  },
  {
    year: "2024",
    event: "Building React Projects",
    detail: "Building projects from 2023 to now, improving practical product development skills.",
  },
  {
    year: "2025",
    event: "Portfolio + Real-world apps",
    detail: "Portfolio and real apps with production-style workflows and user-first UX decisions.",
    linkToProjects: true,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export default function About() {
  const [activeTimeline, setActiveTimeline] = useState(timeline[0]);

  return (
    <>
      <AdminUploadPanel
        title="Upload profile/resume asset"
        accept="image/*,.pdf,.txt,.md,.doc,.docx,.rtf"
      />

      <motion.section
        className="about-shell"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.1, duration: 0.45 }}
      >
        <div className="about-split-bg" aria-hidden="true" />

        <motion.div variants={fadeUp} className="about-panel">
          <p className="about-kicker">Intro</p>
          <h2>Hi, I&apos;m Nicholas Musau Kioko. I build meaningful digital experiences.</h2>
          <p className="about-intro">
            I am a 23-year-old developer living in Nairobi, and I combine
            psychology, technology, and creativity to create products that users
            enjoy and remember.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="about-panel">
          <p className="about-kicker">What makes me different</p>
          <h3>Designing with psychology, building with technology.</h3>
          <p className="about-intro">
            My background in psychology shapes how I approach development. I
            don&apos;t just build interfaces, I design experiences that consider
            user behavior, engagement, and interaction patterns.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="about-journey-card"
          transition={{ duration: 0.45 }}
        >
          <h3>My Journey</h3>
          <div className="about-timeline">
            {timeline.map((item, index) => (
              <motion.button
                key={item.year}
                className="timeline-row"
                type="button"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ y: -3, scale: 1.01 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                onClick={() => setActiveTimeline(item)}
              >
                <span className="timeline-year">{item.year}</span>
                <span className="timeline-dot" aria-hidden="true" />
                <p>{item.event}</p>
              </motion.button>
            ))}
          </div>

          {activeTimeline && (
            <motion.article
              className="journey-popup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
            >
              <div className="journey-popup-head">
                <h4>{activeTimeline.event}</h4>
                <span>{activeTimeline.year}</span>
              </div>
              <p>{activeTimeline.detail}</p>
              {activeTimeline.linkToProjects && (
                <Link to="/projects" className="journey-project-link">
                  View Projects
                </Link>
              )}
            </motion.article>
          )}
        </motion.div>

        <motion.div variants={fadeUp} className="about-current-card">
          <h3>Current Work</h3>
          <p className="about-focus">
            Currently building a gaming platform and exploring interactive web
            experiences using React.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="about-tech-grid">
          <h3 className="about-grid-title">Tech Stack</h3>
          {stacks.map((stack) => (
            <article key={stack.title} className="about-tech-card">
              <h3>{stack.title}</h3>
              <div className="about-badges">
                {stack.items.map((item) => (
                  <span key={item.name} className="about-badge">
                    <img src={item.icon} alt="" aria-hidden="true" />
                    {item.name}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="about-numbers">
          <h3>My Numbers</h3>
          <div className="about-numbers-grid">
            {numbers.map((num) => (
              <article key={num.label} className="about-number-card">
                <strong>{num.value}</strong>
                <span>{num.label}</span>
              </article>
            ))}
          </div>
        </motion.div>

        <motion.section variants={fadeUp} className="about-mission">
          <h3>Your Mission / Vision</h3>
          <p>
            I aim to build interactive platforms that connect people through
            shared experiences, combining technology, psychology, and
            creativity.
          </p>
        </motion.section>

        <motion.section variants={fadeUp} className="about-personality">
          <h3>Personality</h3>
          <ul>
            {personality.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </motion.section>

        <motion.section variants={fadeUp} className="about-cta">
          <h3>Let&apos;s build something impactful together.</h3>
          <Link to="/contact">
            <button type="button" className="btn">Contact Me</button>
          </Link>
        </motion.section>
      </motion.section>
    </>
  );
}
