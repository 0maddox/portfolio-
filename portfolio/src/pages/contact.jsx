import React from "react";

export default function Contact() {
  return (
    <section className="section-box">
      <h2>Contact Me</h2>
      <p>Please reach out at:</p>
      <a href="mailto:email@example.com" className="btn" style={{ display: "inline-block", marginTop: "1rem" }}>
        email@example.com
      </a>
    </section>
  );
}
