"use client";

import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";
import AdminNavigationTabs from "@/components/AdminNavigationTabs";

type ActivePage = "details" | "events" | "story" | "media" | "guestbook" | "rsvp" | "socials" | "gifts";

interface InvitationPageShellProps {
    invitationId: string;
    activePage: ActivePage;
    groomName?: string;
    brideName?: string;
    slug?: string;
    title: string;
    subtitle?: string;
    headerAction?: React.ReactNode;
    error?: string | null;
    children: React.ReactNode;
}

export default function InvitationPageShell({
    invitationId,
    activePage,
    groomName,
    brideName,
    slug,
    title,
    subtitle,
    headerAction,
    error,
    children,
}: InvitationPageShellProps) {
    const coupleName = groomName && brideName ? `${groomName} & ${brideName}` : null;

    return (
        <div className="space-y-6">
            {/* Breadcrumb & Header */}
            <div className="rounded-2xl border border-current/10 bg-current/5 p-6 backdrop-blur-sm">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm mb-4 opacity-60">
                    <Link href="/admin" className="hover:opacity-100 transition-opacity">
                        Dashboard
                    </Link>
                    <span>/</span>
                    <Link href="/admin/invitations" className="hover:opacity-100 transition-opacity">
                        Undangan
                    </Link>
                    {coupleName && (
                        <>
                            <span>/</span>
                            <span className="opacity-80 truncate max-w-[180px]">{coupleName}</span>
                        </>
                    )}
                </div>

                {/* Title Row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <Link
                            href="/admin/invitations"
                            className="mt-1 flex h-8 w-8 items-center justify-center rounded-xl border border-current/10 bg-current/5 hover:bg-current/10 transition-colors shrink-0"
                            title="Kembali ke daftar"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            {coupleName && (
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs uppercase tracking-widest font-medium opacity-50">{coupleName}</span>
                                    {slug && (
                                        <Link
                                            href={`/${slug}`}
                                            target="_blank"
                                            className="inline-flex items-center gap-1 text-xs text-[rgb(var(--color-primary))] hover:underline"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            /{slug}
                                        </Link>
                                    )}
                                </div>
                            )}
                            <h1 className="text-2xl font-bold font-heading leading-tight">{title}</h1>
                            {subtitle && <p className="mt-1 text-sm opacity-60">{subtitle}</p>}
                        </div>
                    </div>

                    {/* Header Action Slot (e.g. Save button) */}
                    {headerAction && (
                        <div className="shrink-0">
                            {headerAction}
                        </div>
                    )}
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                    {error}
                </div>
            )}

            {/* Navigation Tabs */}
            <AdminNavigationTabs invitationId={invitationId} activePage={activePage} />

            {/* Page Content */}
            {children}
        </div>
    );
}
