"use client";

import { motion } from "framer-motion";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiTailwindcss,
  SiPhp,
  SiLaravel,
  SiMysql,
  SiGit,
  SiDocker,
} from "react-icons/si";

const skills = [
  { name: "React", icon: <SiReact className="h-4 w-4 md:h-5 md:w-5" /> },
  { name: "Next.js", icon: <SiNextdotjs className="h-4 w-4 md:h-5 md:w-5" /> },
  { name: "TypeScript", icon: <SiTypescript className="h-4 w-4 md:h-5 md:w-5" /> },
  { name: "JavaScript", icon: <SiJavascript className="h-4 w-4 md:h-5 md:w-5" /> },
  { name: "Node.js", icon: <SiNodedotjs className="h-4 w-4 md:h-5 md:w-5" /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss className="h-4 w-4 md:h-5 md:w-5" /> },
  { name: "PHP", icon: <SiPhp className="h-4 w-4 md:h-5 md:w-5" /> },
  { name: "Laravel", icon: <SiLaravel className="h-4 w-4 md:h-5 md:w-5" /> },
  { name: "MySQL", icon: <SiMysql className="h-4 w-4 md:h-5 md:w-5" /> },
  { name: "Git", icon: <SiGit className="h-4 w-4 md:h-5 md:w-5" /> },
  { name: "Docker", icon: <SiDocker className="h-4 w-4 md:h-5 md:w-5" /> },
];

const tripledSkills = [...skills, ...skills, ...skills];

export function Skills() {
  return (
    <section id="skills" className="fade-section px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm tracking-wide text-black/60 dark:text-white/60">Skills</p>
        <h2 className="mt-4 text-4xl font-bold">Technologies I use.</h2>
      </div>

      <div className="relative mt-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent dark:from-black sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent dark:from-black sm:w-32" />

        <motion.div
          className="flex w-max shrink-0 gap-4"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
        >
          {tripledSkills.map((skill, index) => (
            <motion.div
              key={`${skill.name}-${index}`}
              whileHover={{ y: -4, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="skill-item flex shrink-0 items-center gap-2 whitespace-nowrap rounded-2xl border border-black/10 px-6 py-4 text-sm font-medium dark:border-white/10"
            >
              {skill.icon}
              {skill.name}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}