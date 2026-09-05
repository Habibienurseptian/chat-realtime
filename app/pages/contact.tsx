"use client";

import { motion } from "framer-motion";

export function Contact() {
  return (
    <section id="contact" className="fade-section px-6 py-32">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm tracking-wide text-black/60 dark:text-white/60">Get In Touch</p>
        <h2 className="mt-5 text-4xl font-bold sm:text-5xl">
          Let&apos;s build something great together.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-black/60 dark:text-white/60">
          Have a project in mind or just want to say hello? Feel free to
          reach out.
        </p>

        <motion.a
          href="mailto:hello@example.com"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="mt-10 inline-block rounded-full bg-black px-8 py-4 font-medium text-white dark:bg-white dark:text-black"
        >
          Say Hello →
        </motion.a>
      </div>
    </section>
  );
}