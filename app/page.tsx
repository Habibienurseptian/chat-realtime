"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LoadingOverlay from "@/components/loading-overlay";
import { Hero } from "@/app/pages/hero";
import { About } from "@/app/pages/about";
import { Skills } from "@/app/pages/skills";
import { Projects } from "@/app/pages/projects";
import { Contact } from "@/app/pages/contact";
import { SiteFooter } from "@/app/pages/footer";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.6 })
        .from(".hero-title", { y: 40, opacity: 0, duration: 0.9 }, "-=0.35")
        .from(".hero-desc", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(".hero-cta > *", { y: 16, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.3")
        .from(".hero-social > *", { y: 10, opacity: 0, duration: 0.4, stagger: 0.08 }, "-=0.2");

      gsap.utils.toArray<HTMLElement>(".fade-section").forEach((section) => {
        gsap.from(section, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 82%" },
        });
      });

      gsap.from(".skill-item", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.06,
        scrollTrigger: { trigger: ".skills-grid", start: "top 85%" },
      });

      gsap.from(".project-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: { trigger: ".projects-grid", start: "top 80%" },
      });

      gsap.utils.toArray<HTMLElement>(".project-image").forEach((img) => {
        gsap.to(img, {
          yPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <LoadingOverlay />
      <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
        <SiteFooter />
      </main>
    </div>
  );
}