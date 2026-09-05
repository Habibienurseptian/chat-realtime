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
        document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto"
        return () => {
            document.body.style.overflow = "auto"
        }
    }, [isMobileMenuOpen])

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
            <header className="sticky top-0 z-[9999] border-b border-black/10 bg-white/80 backdrop-blur-lg backdrop-saturate-150 dark:border-white/10 dark:bg-black/80">
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
                            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
                        >
                            <span className="relative block h-4 w-4">
                                <span
                                    className={`absolute left-0 top-0.5 h-[1.5px] w-4 bg-current transition-all duration-300 ${
                                        isMobileMenuOpen ? "top-[7px] rotate-45" : ""
                                    }`}
                                />
                                <span
                                    className={`absolute left-0 top-[7px] h-[1.5px] w-4 bg-current transition-all duration-300 ${
                                        isMobileMenuOpen ? "opacity-0" : "opacity-100"
                                    }`}
                                />
                                <span
                                    className={`absolute left-0 top-[13px] h-[1.5px] w-4 bg-current transition-all duration-300 ${
                                        isMobileMenuOpen ? "top-[7px] -rotate-45" : ""
                                    }`}
                                />
                            </span>
                        </button>
                    </div>
                </nav>

                {/* Mobile menu panel */}
                <div
                    className={`fixed inset-x-0 top-[73px] z-[9998] origin-top border-b border-black/10 bg-white/95 backdrop-blur-lg transition-all duration-300 ease-out lg:hidden dark:border-white/10 dark:bg-black/95 ${
                        isMobileMenuOpen
                            ? "translate-y-0 opacity-100"
                            : "pointer-events-none -translate-y-4 opacity-0"
                    }`}
                >
                    <ul className="flex flex-col gap-1 p-4">
                        {navItems.map((item, index) => {
                            const isActive = pathname === item.path
                            return (
                                <li
                                    key={item.path}
                                    className="transition-all duration-300"
                                    style={{
                                        transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
                                        opacity: isMobileMenuOpen ? 1 : 0,
                                        transform: isMobileMenuOpen ? "translateY(0)" : "translateY(-8px)",
                                    }}
                                >
                                    <Link
                                        href={item.path}
                                        className={`flex w-full items-center rounded-xl px-4 py-3 text-base font-medium transition ${
                                            isActive
                                                ? "bg-black text-white dark:bg-white dark:text-black"
                                                : "text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            )
                        })}
                        <li className="mt-2 px-4">
                            <button className="w-full rounded-xl bg-black px-4 py-3 text-base font-medium text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/85">
                                Login
                            </button>
                        </li>
                    </ul>
                </div>
            </header>

            <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
    )
}