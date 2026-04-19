"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";
import AdminNavigationTabs from "@/components/AdminNavigationTabs";

type SocialLink = {
    id: string;
    platform: string;
    username: string | null;
    url: string;
    order: number;
    createdAt: string;
};

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function SocialLinksPage({ params }: PageProps) {
    const router = useRouter();
    const [invitationId, setInvitationId] = useState<string>("");
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [platform, setPlatform] = useState("");
    const [username, setUsername] = useState("");
    const [url, setUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const toast = useToast();
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        params.then((p) => {
            setInvitationId(p.id);
            fetchSocialLinks(p.id);
        });
    }, [params]);

    async function fetchSocialLinks(id: string) {
        try {
            const res = await fetch(`/api/invitations/${id}/socials`);
            if (!res.ok) throw new Error("Failed to fetch social links");
            const data = await res.json();
            setSocialLinks(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddLink(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch(`/api/invitations/${invitationId}/socials`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    platform,
                    username: username || null,
                    url,
                    order: socialLinks.length,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to add social link");
            }

            // Reset form
            setPlatform("");
            setUsername("");
            setUrl("");

            // Refresh list
            await fetchSocialLinks(invitationId);

            toast.success("Link sosial berhasil ditambahkan!");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(socialId: string) {
        if (!confirm("Are you sure you want to delete this social link?")) return;

        try {
            const res = await fetch(`/api/invitations/${invitationId}/socials/${socialId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete social link");

            // Refresh list
            await fetchSocialLinks(invitationId);

            toast.success("Link sosial berhasil dihapus!");
        } catch (err: any) {
            setError(err.message);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen p-6">
                <div className="mx-auto max-w-4xl">
                    <p className="text-center">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
            <div className="min-h-screen p-6">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={`/admin/invitations/${invitationId}`}
                            className="text-sm text-neutral-400 hover:text-neutral-200"
                        >
                            ← Back to Invitation Details
                        </Link>
                        <h1 className="mt-2 text-2xl font-semibold text-white">Social Media Links</h1>
                        <p className="text-sm text-neutral-400">Manage Instagram, TikTok, and other social links</p>
                    </div>

                    {/* Navigation Tabs */}
                    <AdminNavigationTabs invitationId={invitationId} activePage="socials" />

                    {error && (
                        <div className="mb-4 rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Add New Link Form */}
                    <div className="mb-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                        <h2 className="mb-4 text-lg font-semibold text-white">Add New Social Link</h2>

                        <form onSubmit={handleAddLink} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300">
                                    Platform *
                                </label>
                                <input
                                    type="text"
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    required
                                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                    placeholder="Instagram, TikTok, YouTube, etc."
                                    maxLength={30}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300">
                                    Username (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                    placeholder="@username"
                                    maxLength={60}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300">
                                    URL *
                                </label>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                    placeholder="https://instagram.com/username"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-lg bg-emerald-600 px-6 py-2 text-sm text-white hover:bg-emerald-500 disabled:opacity-50 cursor-pointer"
                            >
                                {submitting ? "Adding..." : "+ Add Social Link"}
                            </button>
                        </form>
                    </div>

                    {/* Social Links List */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                        <h2 className="mb-4 text-lg font-semibold text-white">
                            Existing Links ({socialLinks.length})
                        </h2>

                        {socialLinks.length === 0 ? (
                            <p className="py-8 text-center text-sm text-neutral-400">
                                No social links yet. Add your first link above.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {socialLinks.map((link) => (
                                    <div
                                        key={link.id}
                                        className="flex items-center justify-between rounded-lg border border-neutral-200 p-4"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="rounded bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700">
                                                    {link.platform}
                                                </span>
                                                {link.username && (
                                                    <span className="text-sm text-neutral-600">
                                                        {link.username}
                                                    </span>
                                                )}
                                            </div>
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-1 block text-sm text-blue-600 hover:underline"
                                            >
                                                {link.url}
                                            </a>
                                            <p className="mt-1 text-xs text-neutral-400">
                                                Order: {link.order}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(link.id)}
                                            className="ml-4 rounded-lg border border-red-300 bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500 cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

