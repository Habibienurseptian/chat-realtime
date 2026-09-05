export function About() {
  return (
    <section
      id="about"
      className="fade-section border-t border-black/10 px-6 py-28 dark:border-white/10"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
        <div>
          <p className="text-sm tracking-wide text-black/60 dark:text-white/60">About Me</p>
          <h2 className="mt-4 text-4xl font-bold">A little about me.</h2>
        </div>
        <div className="space-y-5 text-lg leading-8 text-black/60 dark:text-white/60">
          <p>
            I enjoy turning ideas into functional and engaging digital
            products. I care about clean code, thoughtful design, and
            creating experiences that are easy to use.
          </p>
          <p>
            Currently, I&apos;m focused on modern web technologies,
            especially React, Next.js, TypeScript, and Node.js.
          </p>
        </div>
      </div>
    </section>
  );
}