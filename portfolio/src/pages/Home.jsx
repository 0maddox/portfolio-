import React from "react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <section className="text-center py-24 px-6">
        <h2 className="text-5xl font-bold mb-4">Hi, I'm a Software Developer</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          I build modern web applications using React and JavaScript.
        </p>
      </section>
    </motion.div>
  );
}