"use client";

import { Home, Users, Calendar, Image, MessageSquare, Heart } from "lucide-react";
import { useEffect, useState } from "react";

const navigationItems = [
    { id: "hero", icon: Home, label: "Home" },
    { id: "couple", icon: Users, label: "Couple" },
    { id: "story", icon: Heart, label: "Story" },
    { id: "gallery", icon: Image, label: "Gallery" },
    { id: "events", icon: Calendar, label: "Events" },
    { id: "guestbook", icon: MessageSquare, label: "Wishes" },
];

export default function MobileFooterNav() {
    const [activeSection, setActiveSection] = useState("hero");

    useEffect(() => {
        const handleScroll = () => {
            const sections = navigationItems.map(item => document.getElementById(item.id));
            const scrollPosition = window.scrollY + window.innerHeight / 3;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(navigationItems[i].id);
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <nav className="mobile-footer-nav md:hidden">
            <div className="mobile-footer-nav-container">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`mobile-nav-item ${isActive ? "active" : ""}`}
                            aria-label={item.label}
                            suppressHydrationWarning={true}
                        >
                            <Icon className={`h-5 w-5 transition-all duration-300 ${isActive ? "scale-110" : ""}`} />
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
