"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"
import { ChatModal } from "./chat-modal"

export const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const pathname = usePathname()

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev)
    }

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen || isChatOpen ? "hidden" : "auto"
        return () => {
            document.body.style.overflow = "auto"
        }
    }, [isMobileMenuOpen, isChatOpen])

    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    const navItems = [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Tech", path: "/tech" },
        { name: "Contact", path: "/contact" },
    ]

    const ChatIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8-1.13 0-2.21-.18-3.2-.51L3 20l1.44-3.6C3.53 15.15 3 13.63 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    )

    return (
        <>
            <header className="sticky top-0 z-[10001] border-b border-black/10 bg-white/80 backdrop-blur-lg backdrop-saturate-150 dark:border-white/10 dark:bg-black/80">
                <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold tracking-tight text-black dark:text-white"
                    >
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-black text-sm font-bold text-white dark:bg-white dark:text-black">
                            K
                        </span>
                        Kavasha
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden items-center gap-1 rounded-full border border-black/10 bg-black/[0.02] p-1 lg:flex dark:border-white/10 dark:bg-white/[0.03]">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-black text-white dark:bg-white dark:text-black"
                                            : "text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Desktop right side */}
                    <div className="hidden items-center gap-3 lg:flex">
                        <button
                            onClick={() => setIsChatOpen(true)}
                            aria-label="Buka chat"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
                        >
                            <ChatIcon />
                        </button>
                        <ThemeToggle />
                        <button className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/85">
                            Login
                        </button>
                    </div>

                    {/* Mobile controls */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <button
                            onClick={() => setIsChatOpen(true)}
                            aria-label="Buka chat"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
                        >
                            <ChatIcon />
                        </button>
                        <ThemeToggle />
                        <button
                            onClick={toggleMobileMenu}
                            type="button"
                            aria-label="Toggle menu"
                            aria-expanded={isMobileMenuOpen}
                            className="relative z-[10001] flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
                        >
                            <span className="relative block h-4 w-4">
                                {/* Top / X */}
                                <span
                                    className={`absolute left-1/2 top-1/2 h-[1.5px] w-4 -translate-x-1/2 -translate-y-1/2 bg-current origin-center transition-transform duration-300 ${
                                        isMobileMenuOpen ? "rotate-45" : "-translate-y-[6px]"
                                    }`}
                                />
                                {/* Middle */}
                                <span
                                    className={`absolute left-1/2 top-1/2 h-[1.5px] w-4 -translate-x-1/2 -translate-y-1/2 bg-current transition-opacity duration-200 ${
                                        isMobileMenuOpen ? "opacity-0" : "opacity-100"
                                    }`}
                                />
                                {/* Bottom / X */}
                                <span
                                    className={`absolute left-1/2 top-1/2 h-[1.5px] w-4 -translate-x-1/2 -translate-y-1/2 bg-current origin-center transition-transform duration-300 ${
                                        isMobileMenuOpen ? "-rotate-45" : "translate-y-[6px]"
                                    }`}
                                />
                            </span>
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile menu — overlay full screen, tanpa header/tombol close tambahan */}
            <div
                className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-2 bg-white px-6 transition-opacity duration-300 ease-out lg:hidden dark:bg-black ${
                    isMobileMenuOpen
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                }`}
            >
                {navItems.map((item, index) => {
                    const isActive = pathname === item.path
                    return (
                        <div
                            key={item.path}
                            className="w-full max-w-xs transition-all duration-300"
                            style={{
                                transitionDelay: isMobileMenuOpen ? `${index * 60}ms` : "0ms",
                                opacity: isMobileMenuOpen ? 1 : 0,
                                transform: isMobileMenuOpen ? "translateY(0)" : "translateY(12px)",
                            }}
                        >
                            <Link
                                href={item.path}
                                className={`flex w-full items-center justify-center rounded-2xl px-6 py-4 text-xl font-medium transition ${
                                    isActive
                                        ? "bg-black text-white dark:bg-white dark:text-black"
                                        : "text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
                                }`}
                            >
                                {item.name}
                            </Link>
                        </div>
                    )
                })}

                <div
                    className="mt-4 w-full max-w-xs transition-all duration-300"
                    style={{
                        transitionDelay: isMobileMenuOpen ? `${navItems.length * 60}ms` : "0ms",
                        opacity: isMobileMenuOpen ? 1 : 0,
                        transform: isMobileMenuOpen ? "translateY(0)" : "translateY(12px)",
                    }}
                >
                    <button className="w-full rounded-2xl bg-black px-6 py-4 text-lg font-medium text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/85">
                        Login
                    </button>
                </div>
            </div>

            <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
    )
}