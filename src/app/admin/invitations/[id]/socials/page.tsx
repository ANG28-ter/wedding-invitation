"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import InvitationPageShell from "@/components/admin/InvitationPageShell";
import { Plus, Trash2, ExternalLink, Instagram, Youtube, Link2 } from "lucide-react";

type SocialLink = {
    id: string;
    platform: string;
    username: string | null;
    url: string;
    order: number;
    createdAt: string;
};

type PageProps = { params: Promise<{ id: string }> };

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
    instagram: <Instagram className="h-4 w-4" />,
    youtube: <Youtube className="h-4 w-4" />,
};

function getPlatformIcon(platform: string) {
    return PLATFORM_ICONS[platform.toLowerCase()] ?? <Link2 className="h-4 w-4" />;
}

export default function SocialLinksPage({ params }: PageProps) {
    const router = useRouter();
    const [invitationId, setInvitationId] = useState<string>("");
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [platform, setPlatform] = useState("");
    const [username, setUsername] = useState("");
    const [url, setUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const toast = useToast();

    useEffect(() => {
        params.then((p) => { setInvitationId(p.id); fetchSocialLinks(p.id); });
    }, [params]);

    async function fetchSocialLinks(id: string) {
        try {
            const res = await fetch(`/api/invitations/${id}/socials`);
            if (!res.ok) throw new Error("Failed to fetch social links");
            const data = await res.json();
            setSocialLinks(data);
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    }

    async function handleAddLink(e: React.FormEvent) {
        e.preventDefault(); setSubmitting(true); setError(null);
        try {
            const res = await fetch(`/api/invitations/${invitationId}/socials`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ platform, username: username || null, url, order: socialLinks.length }),
            });
            if (!res.ok) throw new Error("Failed to add social link");
            setPlatform(""); setUsername(""); setUrl("");
            await fetchSocialLinks(invitationId);
            toast.success("Link sosial berhasil ditambahkan!");
        } catch (err: any) { setError(err.message); }
        finally { setSubmitting(false); }
    }

    async function handleDelete(socialId: string) {
        if (!confirm("Hapus link sosial ini?")) return;
        try {
            await fetch(`/api/invitations/${invitationId}/socials/${socialId}`, { method: "DELETE" });
            await fetchSocialLinks(invitationId);
            toast.success("Link sosial berhasil dihapus!");
        } catch (err: any) { setError(err.message); }
    }

    if (loading) return (
        <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[rgb(var(--color-primary))] border-t-transparent"></div>
        </div>
    );

    return (
        <>
            <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

            <InvitationPageShell invitationId={invitationId} activePage="socials"
                title="Social Media Links" subtitle="Tambahkan Instagram, TikTok, YouTube, dan platform lainnya." error={error}>

                {/* Add New Form */}
                <div className="admin-card">
                    <h2 className="admin-section-title">Tambah Link Baru</h2>
                    <form onSubmit={handleAddLink} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="admin-label">Platform *</label>
                                <input type="text" value={platform} onChange={(e) => setPlatform(e.target.value)}
                                    required className="admin-input" placeholder="Instagram, TikTok, YouTube..." maxLength={30} />
                            </div>
                            <div>
                                <label className="admin-label">Username (Opsional)</label>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                                    className="admin-input" placeholder="@namaakun" maxLength={60} />
                            </div>
                        </div>
                        <div>
                            <label className="admin-label">URL *</label>
                            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                                required className="admin-input" placeholder="https://instagram.com/namaakun" />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" disabled={submitting} className="admin-btn-primary">
                                <Plus className="h-4 w-4" />
                                {submitting ? "Menyimpan..." : "Tambah Link"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Links List */}
                <div className="admin-card">
                    <h2 className="admin-section-title">Daftar Link ({socialLinks.length})</h2>
                    {socialLinks.length === 0 ? (
                        <div className="py-12 text-center opacity-50">
                            <Link2 className="h-10 w-10 mx-auto mb-3 opacity-40" />
                            <p className="text-sm">Belum ada link sosial. Tambahkan di atas.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {socialLinks.map((link) => (
                                <div key={link.id} className="flex items-center justify-between rounded-xl border border-current/10 bg-current/5 p-4 hover:border-[rgb(var(--color-primary))]/20 transition-colors">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--color-primary))]/15 text-[rgb(var(--color-primary))] shrink-0">
                                            {getPlatformIcon(link.platform)}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-sm font-semibold">{link.platform}</span>
                                                {link.username && (
                                                    <span className="text-xs opacity-50">{link.username}</span>
                                                )}
                                            </div>
                                            <a href={link.url} target="_blank" rel="noopener noreferrer"
                                                className="text-xs text-[rgb(var(--color-primary))] hover:underline truncate flex items-center gap-1">
                                                <ExternalLink className="h-3 w-3 shrink-0" />
                                                <span className="truncate">{link.url}</span>
                                            </a>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(link.id)}
                                        className="ml-4 rounded-lg border border-red-500/30 p-2 text-red-500 hover:bg-red-500/10 transition-colors shrink-0" title="Hapus">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </InvitationPageShell>
        </>
    );
}
