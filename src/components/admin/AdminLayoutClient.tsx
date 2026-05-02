"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Files,
    MessageSquareQuote,
    Settings,
    Menu,
    X,
    LogOut,
    Sun,
    Moon
} from "lucide-react";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const pathname = usePathname();

    useEffect(() => {
        const savedTheme = localStorage.getItem("admin-theme") as "light" | "dark";
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("admin-theme", newTheme);
    };

    const navigation = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Undangan", href: "/admin/invitations", icon: Files },
        { name: "Testimoni", href: "/admin/testimonials", icon: MessageSquareQuote },
    ];

    // Close sidebar when navigating on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === "dark" ? "bg-neutral-950 text-white" : "bg-neutral-50 text-neutral-900"}`}>
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:translate-x-0 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } ${theme === "dark" ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"} border-r flex flex-col`}
            >
                {/* Logo & Close Button */}
                <div className="flex h-16 shrink-0 items-center justify-between px-6">
                    <span className={`text-xl font-heading font-bold ${theme === "dark" ? "text-[rgb(var(--color-primary))]" : "text-amber-600"}`}>
                        Akadev Admin
                    </span>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className={`lg:hidden ${theme === "dark" ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-neutral-900"}`}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 space-y-1 px-4 py-4">
                    {navigation.map((item) => {
                        // Strict exact match for /admin to prevent highlighting on /admin/invitations
                        const isActive = item.href === "/admin" 
                            ? pathname === "/admin" 
                            : pathname.startsWith(item.href);
                        
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                                    isActive
                                        ? (theme === "dark" ? "bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]" : "bg-amber-50 text-amber-600")
                                        : (theme === "dark" ? "text-neutral-400 hover:bg-neutral-800 hover:text-white" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900")
                                }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 shrink-0 transition-colors ${
                                        isActive 
                                            ? (theme === "dark" ? "text-[rgb(var(--color-primary))]" : "text-amber-600") 
                                            : (theme === "dark" ? "text-neutral-500 group-hover:text-white" : "text-neutral-400 group-hover:text-neutral-900")
                                    }`}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className={`border-t p-4 space-y-2 ${theme === "dark" ? "border-neutral-800" : "border-neutral-200"}`}>
                    <button
                        onClick={toggleTheme}
                        className={`flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                            theme === "dark" ? "text-neutral-400 hover:bg-neutral-800 hover:text-white" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                        }`}
                    >
                    </button>
                    
                    <form action="/api/admin/logout" method="post">
                        <button
                            type="submit"
                            className={`flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                                theme === "dark" ? "text-red-400 hover:bg-red-950/50 hover:text-red-300" : "text-red-600 hover:bg-red-50 hover:text-red-700"
                            }`}
                        >
                            <LogOut className="mr-3 h-5 w-5 shrink-0" />
                            Logout
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <div className={`sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden ${
                    theme === "dark" ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"
                }`}>
                    <button
                        type="button"
                        className={`-m-2.5 p-2.5 ${theme === "dark" ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-neutral-900"}`}
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <span className="sr-only">Buka sidebar</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <div className={`flex-1 text-sm font-semibold font-heading ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
                        Akadev Admin
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1">
                    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
                        {/* We pass the theme down as a prop if children need it, but using CSS classes is easier. We will wrap children in a context if necessary, but tailwind inheritance is fine */}
                        <div className={`admin-content-wrapper ${theme}`}>
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
