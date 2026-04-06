import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <h1>My Portfolio</h1>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/skills">Skills</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
}