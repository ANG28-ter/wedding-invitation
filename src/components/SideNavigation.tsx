"use client";

import { Home, Users, Calendar, Image, MessageSquare, Heart, BookOpen, Gift } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const navigationItems = [
    { id: "hero", icon: Home, label: "Home" },
    { id: "couple", icon: Users, label: "Couple" },
    { id: "story", icon: Heart, label: "Story" },
    { id: "gallery", icon: Image, label: "Gallery" },
    { id: "events", icon: Calendar, label: "Events" },
    { id: "rsvp", icon: BookOpen, label: "RSVP" },
    { id: "gift", icon: Gift, label: "Gift" },
    { id: "guestbook", icon: MessageSquare, label: "Guestbook" },
];

export default function SideNavigation() {
    const [activeSection, setActiveSection] = useState("hero");
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        // The invitation content is inside a max-w container.
        // We track via IntersectionObserver so it works regardless of who scrolls.
        const options: IntersectionObserverInit = {
            root: null, // viewport
            rootMargin: "0px 0px -55% 0px", // trigger when section is in top 45% of screen
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, options);

        const sectionEls = navigationItems
            .map((item) => document.getElementById(item.id))
            .filter(Boolean) as HTMLElement[];

        sectionEls.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <nav className="side-navigation hidden md:flex z-50">
            {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                    <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`side-nav-item ${activeSection === item.id ? "active" : ""}`}
                        title={item.label}
                        aria-label={item.label}
                    >
                        <Icon className="h-5 w-5" />
                    </button>
                );
            })}
        </nav>
    );
}
