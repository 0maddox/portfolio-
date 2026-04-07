import React from "react";
import AdminUploadPanel from "../components/AdminUploadPanel";
// import myPicture from "../images/me.jpg"; // place your picture in /src/images

export default function About() {
  return (
    <>
      <AdminUploadPanel title="Upload profile/resume asset" />
      <div className="resume-card">
        <img src="/images/me.jpg" alt="My Portrait" />
        <div className="resume-info">
          <h3>Download My Resume</h3>
          <a href="/resume.pdf" download>
            <button>Download</button>
          </a>
        </div>
      </div>
    </>
  );
}
