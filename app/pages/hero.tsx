"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6">
      <div
        className="absolute inset-0 -z-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl py-32">
        <p className="hero-eyebrow mb-5 text-sm font-medium tracking-wide text-black/60 dark:text-white/60">
          Full Stack Developer
        </p>

        <h1 className="hero-title max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
          Building digital experiences that make an impact.
        </h1>

        <p className="hero-desc mt-7 max-w-2xl text-lg leading-8 text-black/60 dark:text-white/60">
          Hi, I&apos;m Your Name. I&apos;m a developer focused on building
          modern, scalable, and beautiful web applications.
        </p>

        <div className="hero-cta mt-10 flex flex-wrap gap-4">
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="rounded-full bg-black px-7 py-3.5 font-medium text-white dark:bg-white dark:text-black"
          >
            View My Work
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.04, y: -2, backgroundColor: "rgba(0,0,0,0.05)" }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="rounded-full border border-black/15 px-7 py-3.5 font-medium dark:border-white/15"
          >
            Contact Me
          </motion.a>
        </div>

        <div className="hero-social mt-16 flex gap-6 text-sm text-black/50 dark:text-white/50">
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 3 }}
            className="hover:text-black dark:hover:text-white"
          >
            GitHub ↗
          </motion.a>
          <motion.a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 3 }}
            className="hover:text-black dark:hover:text-white"
          >
            LinkedIn ↗
          </motion.a>
        </div>
      </div>
    </section>
  );
}