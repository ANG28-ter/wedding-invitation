"use client";

import Link from "next/link";

type AdminNavigationTabsProps = {
    invitationId: string;
    activePage: "details" | "events" | "story" | "media" | "guestbook" | "rsvp" | "socials" | "gifts";
};

export default function AdminNavigationTabs({ invitationId, activePage }: AdminNavigationTabsProps) {
    const tabs = [
        { id: "details", label: "Details", href: `/admin/invitations/${invitationId}` },
        { id: "events", label: "Events", href: `/admin/invitations/${invitationId}/events` },
        { id: "story", label: "Our Story", href: `/admin/invitations/${invitationId}/story` },
        { id: "media", label: "Media Gallery", href: `/admin/invitations/${invitationId}/media` },
        { id: "guestbook", label: "Guestbook", href: `/admin/invitations/${invitationId}/guestbook` },
        { id: "rsvp", label: "RSVP", href: `/admin/invitations/${invitationId}/rsvp` },
        { id: "socials", label: "Social Links", href: `/admin/invitations/${invitationId}/socials` },
        { id: "gifts", label: "Gifts", href: `/admin/invitations/${invitationId}/gifts` },
    ];

    return (
        <div className="mb-6 flex gap-2 overflow-x-auto border-b border-neutral-800">
            {tabs.map((tab) => (
                <Link
                    key={tab.id}
                    href={tab.href}
                    className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium ${activePage === tab.id
                            ? "border-emerald-500 text-emerald-400"
                            : "border-transparent text-neutral-400 hover:text-neutral-200"
                        }`}
                >
                    {tab.label}
                </Link>
            ))}
        </div>
    );
}
