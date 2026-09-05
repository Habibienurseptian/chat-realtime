"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const projects = [
  {
    title: "E-Commerce Platform",
    description:
      "Modern e-commerce platform with product management, shopping cart, and responsive UI.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: "/projects/ecommerce.jpg",
  },
  {
    title: "Dashboard Analytics",
    description:
      "Interactive analytics dashboard designed to visualize business data in a simple way.",
    tech: ["React", "TypeScript", "Chart.js"],
    image: "/projects/dashboard.jpg",
  },
  {
    title: "Company Landing Page",
    description:
      "Professional landing page with modern animations and responsive design.",
    tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
    image: "/projects/landing.jpg",
  },
];

export function Projects() {
  return (
    <section
      id="projects"
      className="border-t border-black/10 px-6 py-28 dark:border-white/10"
    >
      <div className="mx-auto max-w-6xl">
        <p className="fade-section text-sm tracking-wide text-black/60 dark:text-white/60">
          Selected Work
        </p>
        <h2 className="fade-section mt-4 text-4xl font-bold">Featured projects.</h2>

        <div className="projects-grid mt-12 grid gap-8 md:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="project-card group overflow-hidden rounded-3xl border border-black/10 dark:border-white/10"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="project-image scale-125 object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <div className="p-6">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl border border-black/15 text-sm dark:border-white/15">
                  0{index + 1}
                </div>

                <h3 className="text-xl font-semibold">{project.title}</h3>

                <p className="mt-3 min-h-20 text-sm leading-6 text-black/60 dark:text-white/60">
                  {project.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-black/10 px-3 py-1 text-xs text-black/60 dark:border-white/10 dark:text-white/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <motion.a
                  href="#"
                  className="mt-8 inline-flex items-center gap-1 text-sm font-medium"
                  initial={{ gap: "0.25rem" }}
                  whileHover={{ gap: "0.5rem" }}
                >
                  View Project <span>→</span>
                </motion.a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}