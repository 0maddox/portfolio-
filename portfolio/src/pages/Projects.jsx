import React from "react";

export default function Projects() {
  return (
    <div className="py-20 max-w-5xl mx-auto px-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold">Project One</h3>
          <p className="text-gray-400 text-sm">Task management app</p>
        </div>

        <div className="border border-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold">Project Two</h3>
          <p className="text-gray-400 text-sm">E-commerce UI</p>
        </div>
      </div>
    </div>
  );
}