"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

const projects = [
  {
    title: "Pelatihan Online",
    description:
      "Online learning platform for managing training programs, participants, instructors, and learning activities through a centralized and responsive system.",
    tech: ["Laravel", "Blade", "Bootstrap"],
    images: [
      "/assets/projects/magang/login.png",
      "/assets/projects/magang/dashboard.png",
      "/assets/projects/magang/dashboard-instruktur.png",
    ],
  },
  {
    title: "Maktab",
    description:
      "Integrated management platform designed to simplify data management, monitor activities, and provide a clear dashboard for operational needs.",
    tech: ["Laravel", "Blade", "Tailwind CSS"],
    images: [
      "/assets/projects/maktab/login.png",
      "/assets/projects/maktab/home.png",
      "/assets/projects/maktab/dashboard.png",
    ],
  },
  {
    title: "Poliklinik",
    description:
      "Clinic management system for handling patient data, medical services, and daily operations through a simple and intuitive dashboard.",
    tech: ["Laravel", "Blade", "Bootstrap"],
    images: [
      "/assets/projects/poliklinik/login.png",
      "/assets/projects/poliklinik/dashboard.png",
    ],
  },
  {
    title: "Penilaian Esai Otomatis",
    description:
      "Automated essay assessment system that analyzes and evaluates student responses using Python-based processing, with a dashboard for input, assessment results, and score management.",
    tech: ["Python", "FastAPI", "Laravel", "Blade", "Tailwind CSS"],
    images: [
      "/assets/projects/aeg/dashboard.png",
      "/assets/projects/aeg/input.png",
      "/assets/projects/aeg/hasil.png",
    ],
  },
];

export function Projects() {
  const [activeImages, setActiveImages] = useState<Record<string, number>>({});

  const nextImage = (title: string, total: number) => {
    setActiveImages((prev) => {
      const current = prev[title] ?? 0;

      return {
        ...prev,
        [title]: (current + 1) % total,
      };
    });
  };

  const previousImage = (title: string, total: number) => {
    setActiveImages((prev) => {
      const current = prev[title] ?? 0;

      return {
        ...prev,
        [title]: (current - 1 + total) % total,
      };
    });
  };

  const selectImage = (title: string, index: number) => {
    setActiveImages((prev) => ({
      ...prev,
      [title]: index,
    }));
  };

  return (
    <section
      id="projects"
      className="border-t border-black/10 px-6 py-28 dark:border-white/10"
    >
      <div className="mx-auto max-w-6xl">
        <p className="fade-section text-sm tracking-wide text-black/60 dark:text-white/60">
          Selected Work
        </p>

        <h2 className="fade-section mt-4 text-4xl font-bold">
          Featured projects.
        </h2>

        <div className="projects-grid mt-12 grid gap-8 md:grid-cols-3">
          {projects.map((project, index) => {
            const activeIndex = activeImages[project.title] ?? 0;

            return (
              <motion.article
                key={project.title}
                whileHover={{ y: -10 }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 20,
                }}
                className="project-card group overflow-hidden rounded-3xl border border-black/10 dark:border-white/10"
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={project.images[activeIndex]}
                    alt={`${project.title} - Image ${activeIndex + 1}`}
                    fill
                    className="project-image object-cover transition-all duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />

                  {/* Gradient */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                  {/* Navigation */}
                  {project.images.length > 1 && (
                    <>
                      {/* Previous */}
                      <button
                        type="button"
                        onClick={() =>
                          previousImage(
                            project.title,
                            project.images.length
                          )
                        }
                        aria-label="Previous image"
                        className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/70 group-hover:opacity-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>

                      {/* Next */}
                      <button
                        type="button"
                        onClick={() =>
                          nextImage(
                            project.title,
                            project.images.length
                          )
                        }
                        aria-label="Next image"
                        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/70 group-hover:opacity-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>

                      {/* Dots */}
                      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                        {project.images.map((_, imageIndex) => (
                          <button
                            key={imageIndex}
                            type="button"
                            onClick={() =>
                              selectImage(
                                project.title,
                                imageIndex
                              )
                            }
                            aria-label={`Image ${imageIndex + 1}`}
                            className={`h-1.5 rounded-full transition-all ${
                              imageIndex === activeIndex
                                ? "w-5 bg-white"
                                : "w-1.5 bg-white/50 hover:bg-white/80"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Counter */}
                      <div className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                        {activeIndex + 1}/{project.images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl border border-black/15 text-sm dark:border-white/15">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <h3 className="text-xl font-semibold">
                    {project.title}
                  </h3>

                  <p className="mt-3 min-h-20 text-sm leading-6 text-black/60 dark:text-white/60">
                    {project.description}
                  </p>

                  {/* Tech */}
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

                  {/* View Project */}
                  <motion.a
                    href="#"
                    className="mt-8 inline-flex items-center gap-1 text-sm font-medium"
                    initial={{ gap: "0.25rem" }}
                    whileHover={{ gap: "0.5rem" }}
                  >
                    View Project
                    <span>→</span>
                  </motion.a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
