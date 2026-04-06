import React from "react";

const skills = [
  { name: "React", level: 90 },
  { name: "JavaScript", level: 85 },
  { name: "Node.js", level: 75 },
  { name: "CSS", level: 80 },
];

export default function Skills() {
  return (
    <section className="section-box">
      <h2>Skills</h2>
      <p>Core technologies and tools used in my projects.</p>

      <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
        {skills.map((skill) => (
          <div key={skill.name}>
            <strong>{skill.name}</strong>
            <div className="skill-bar" style={{ marginTop: "0.5rem" }}>
              <div className="skill-fill" style={{ width: `${skill.level}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
