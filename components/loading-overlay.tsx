"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"

export default function LoadingOverlay() {
    const [progress, setProgress] = useState(0)
    const [isDone, setIsDone] = useState(false)

    useEffect(() => {
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setTimeout(() => {
                        setIsDone(true)
                    }, 500)

                    return 100
                }
                const increment =
                    prev < 70
                        ? Math.random() * 5 + 1
                        : Math.random() * 2 + 0.5
                return Math.min(prev + increment, 100)
            })
        }, 100)

        return () => {
            clearInterval(interval)
            document.body.style.overflow = previousOverflow
        }
    }, [])

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{
                opacity: isDone ? 0 : 1,
            }}
            transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            }}
            style={{
                pointerEvents: isDone ? "none" : "auto",
            }}
            onAnimationComplete={() => {
                if (isDone) {
                    document.body.style.overflow = ""
                }
            }}
            className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-[#050505] px-6"
        >
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/[0.035] blur-[140px]" />
            </div>

            {/* Grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Terminal */}
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                    filter: "blur(8px)",
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                }}
                transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="relative w-full max-w-xl"
            >
                <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.025] shadow-2xl backdrop-blur-xl">

                    {/* Header */}
                    <div className="flex items-center border-b border-white/[0.06] px-5 py-3.5">
                        <div className="flex gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                            <span className="h-2.5 w-2.5 rounded-full bg-green-400/40" />
                        </div>

                        <span className="ml-4 font-mono text-[10px] text-white/25">
                            system@portfolio
                        </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8">
                        <div className="font-mono text-xs">
                            <span className="text-green-400/40">
                                $
                            </span>

                            <span className="ml-2 text-white/50">
                                initializing portfolio
                            </span>

                            <motion.span
                                animate={{
                                    opacity: [0, 1, 0],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                }}
                                className="ml-1 text-green-400"
                            >
                                _
                            </motion.span>
                        </div>

                        {/* Presentation */}
                        <div className="mt-8">
                            <p className="font-mono text-xl tracking-tight text-white/90 sm:text-2xl">
                                Hello, I'm a{" "}
                                <span className="text-green-400">
                                    creative developer
                                </span>
                                .
                            </p>

                            <p className="mt-3 max-w-md font-mono text-xs leading-6 text-white/30">
                                Crafting digital experiences through
                                code, interaction and motion.
                            </p>
                        </div>

                        {/* Progress */}
                        <div className="mt-10">
                            <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
                                <span className="text-white/25">
                                    Loading
                                </span>

                                <span className="text-green-400/60">
                                    {Math.round(progress)}%
                                </span>
                            </div>

                            <div className="mt-3 h-[2px] overflow-hidden rounded-full bg-white/[0.06]">
                                <motion.div
                                    className="h-full rounded-full bg-green-400"
                                    style={{
                                        boxShadow:
                                            "0 0 12px rgba(74,222,128,0.5)",
                                    }}
                                    animate={{
                                        width: `${progress}%`,
                                    }}
                                    transition={{
                                        duration: 0.35,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                />
                            </div>
                        </div>

                        <p className="mt-5 font-mono text-[10px] text-white/20">
                            {progress < 30 &&
                                "Preparing environment..."}
                            {progress >= 30 &&
                                progress < 60 &&
                                "Loading components..."}
                            {progress >= 60 &&
                                progress < 90 &&
                                "Building experience..."}
                            {progress >= 90 &&
                                progress < 100 &&
                                "Almost ready..."}
                            {progress >= 100 &&
                                "System ready."}
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
