import React from "react";

export default function Contact() {
  const whatsappNumber = "+254748376744";
  const email = "nickkiim 7@gmail.com";
  const tiktokUrl = "https://tiktok.com/@_.mad_dox.__?_r=1&_t=ZS-95Kj3aVcH9Z";
  const instagramUrl = "https://www.instagram.com/_.mad_dox._?igsh=bmI2azF6MHJvaG40";
  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}`;
  const emailHref = `mailto:${email.replace(/\s+/g, "")}`;

  return (
    <section className="section-box contact-section">
      <h2>Contact Me</h2>
      <p>Reach out directly through your favorite platform.</p>

      <div className="contact-buttons">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          <img src="https://cdn.simpleicons.org/whatsapp/25D366" alt="" aria-hidden="true" />
          WhatsApp
        </a>
        <a href={emailHref} className="btn">
          <img src="https://cdn.simpleicons.org/gmail/EA4335" alt="" aria-hidden="true" />
          Email
        </a>
        <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="btn">
          <img src="https://cdn.simpleicons.org/tiktok/FFFFFF" alt="" aria-hidden="true" />
          TikTok
        </a>
        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="btn">
          <img src="https://cdn.simpleicons.org/instagram/E4405F" alt="" aria-hidden="true" />
          Instagram
        </a>
      </div>
    </section>
  );
}
