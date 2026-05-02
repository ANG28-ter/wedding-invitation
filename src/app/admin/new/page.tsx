"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";

export default function NewInvitationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        slug: "",
        groomName: "",
        brideName: "",
        theme: "jawa-modern",
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const submitData = {
                ...formData,
                slug: formData.slug.trim() || undefined,
            };

            const res = await fetch("/api/invitations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submitData),
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                throw new Error(data.message || "Failed to create invitation");
            }

            router.push(`/admin/invitations/${data.data.id}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="rounded-2xl border border-current/10 bg-current/5 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm mb-4 opacity-60">
                    <Link href="/admin" className="hover:opacity-100 transition-opacity">Dashboard</Link>
                    <span>/</span>
                    <Link href="/admin/invitations" className="hover:opacity-100 transition-opacity">Undangan</Link>
                    <span>/</span>
                    <span className="opacity-80">Buat Baru</span>
                </div>
                <div className="flex items-start gap-3">
                    <Link
                        href="/admin/invitations"
                        className="mt-1 flex h-8 w-8 items-center justify-center rounded-xl border border-current/10 bg-current/5 hover:bg-current/10 transition-colors shrink-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold font-heading">Buat Undangan Baru</h1>
                        <p className="mt-1 text-sm opacity-60">Isi informasi dasar untuk memulai undangan pernikahan</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Information */}
                <div className="admin-card">
                    <h2 className="admin-section-title">Informasi Mempelai</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="admin-label">Nama Mempelai Pria *</label>
                            <input
                                type="text"
                                value={formData.groomName}
                                onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                                required
                                className="admin-input"
                                placeholder="Andika"
                            />
                        </div>
                        <div>
                            <label className="admin-label">Nama Mempelai Wanita *</label>
                            <input
                                type="text"
                                value={formData.brideName}
                                onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                                required
                                className="admin-input"
                                placeholder="Rani"
                            />
                        </div>
                    </div>
                </div>

                {/* Theme & Slug */}
                <div className="admin-card">
                    <h2 className="admin-section-title">Tema & URL</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="admin-label">Tema Template</label>
                            <select
                                value={formData.theme}
                                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                className="admin-input"
                            >
                                <option value="jawa-modern">Jawa Modern</option>
                                <option value="jawa-kuno">Jawa Kuno</option>
                                <option value="elegant">Elegant</option>
                            </select>
                        </div>
                        <div>
                            <label className="admin-label">Slug URL (Opsional)</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                                className="admin-input"
                                placeholder="andika-rani"
                            />
                            <p className="mt-1.5 text-xs opacity-50">
                                Preview: /{formData.slug || "akan-dibuat-otomatis"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="admin-card flex items-center justify-between gap-4">
                    <Link href="/admin/invitations" className="admin-btn-ghost">
                        Batal
                    </Link>
                    <button type="submit" disabled={loading} className="admin-btn-primary">
                        <Plus className="h-4 w-4" />
                        {loading ? "Membuat..." : "Buat Undangan"}
                    </button>
                </div>
            </form>
        </div>
    );
}
