"use client";

import Link from "next/link";
import {
    SlidersHorizontal,
    CalendarDays,
    BookHeart,
    Images,
    BookOpen,
    ClipboardCheck,
    Share2,
    Gift
} from "lucide-react";

type AdminNavigationTabsProps = {
    invitationId: string;
    activePage: "details" | "events" | "story" | "media" | "guestbook" | "rsvp" | "socials" | "gifts";
};

export default function AdminNavigationTabs({ invitationId, activePage }: AdminNavigationTabsProps) {
    const tabs = [
        { id: "details",   label: "Details",       icon: SlidersHorizontal, href: `/admin/invitations/${invitationId}` },
        { id: "events",    label: "Events",         icon: CalendarDays,       href: `/admin/invitations/${invitationId}/events` },
        { id: "story",     label: "Our Story",      icon: BookHeart,          href: `/admin/invitations/${invitationId}/story` },
        { id: "media",     label: "Media",          icon: Images,             href: `/admin/invitations/${invitationId}/media` },
        { id: "guestbook", label: "Guestbook",      icon: BookOpen,           href: `/admin/invitations/${invitationId}/guestbook` },
        { id: "rsvp",      label: "RSVP",           icon: ClipboardCheck,     href: `/admin/invitations/${invitationId}/rsvp` },
        { id: "socials",   label: "Socials",        icon: Share2,             href: `/admin/invitations/${invitationId}/socials` },
        { id: "gifts",     label: "Gifts",          icon: Gift,               href: `/admin/invitations/${invitationId}/gifts` },
    ];

    return (
        <div className="mb-8 -mx-1">
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {tabs.map((tab) => {
                    const isActive = activePage === tab.id;
                    const Icon = tab.icon;
                    return (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            className={`
                                flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 shrink-0
                                ${isActive
                                    ? "bg-[rgb(var(--color-primary))] text-white shadow-lg shadow-[rgb(var(--color-primary))]/20"
                                    : "text-current/50 hover:text-current/80 hover:bg-current/8 border border-current/10"
                                }
                            `}
                        >
                            <Icon className={`h-4 w-4 shrink-0 ${isActive ? "opacity-100" : "opacity-60"}`} />
                            {tab.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
