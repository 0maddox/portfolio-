import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
      <h1 className="text-xl font-bold">My Portfolio</h1>

      <nav className="space-x-6 text-sm text-gray-300">
        <Link to="/" className="hover:text-white">Home</Link>
        <Link to="/about" className="hover:text-white">About</Link>
        <Link to="/skills" className="hover:text-white">Skills</Link>
        <Link to="/projects" className="hover:text-white">Projects</Link>
        <Link to="/contact" className="hover:text-white">Contact</Link>
      </nav>
    </header>
  );
}