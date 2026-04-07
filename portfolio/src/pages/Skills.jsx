import React from "react";

const skills = [
  { name: "React.js", percent: 85 },
  { name: "JavaScript", percent: 90 },
  { name: "CSS/HTML", percent: 80 },
  { name: "Ruby", percent: 70 },
];

export default function Skills() {
  return (
    <div className="skills-container">
      {skills.map((skill, index) => (
        <div key={index} className="skill-card">
          <h4>{skill.name}</h4>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${skill.percent}%` }}
            ></div>
          </div>
          <span>{skill.percent}%</span>
        </div>
      ))}
    </div>
  );
}
