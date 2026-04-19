"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
            // Prepare data - remove slug if empty (let backend generate)
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

            // Redirect to edit page
            router.push(`/admin/invitations/${data.data.id}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen p-6">
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/admin"
                        className="text-sm text-neutral-400 hover:text-neutral-200"
                    >
                        ← Back to Dashboard
                    </Link>
                    <h1 className="mt-2 text-2xl font-semibold text-white">
                        Buat Undangan Baru
                    </h1>
                    <p className="text-sm text-neutral-400">
                        Isi informasi dasar untuk membuat undangan pernikahan
                    </p>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                        <h2 className="mb-4 text-lg font-semibold text-white">
                            Informasi Dasar
                        </h2>

                        <div className="space-y-4">
                            {/* Groom Name */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-300">
                                    Nama Mempelai Pria *
                                </label>
                                <input
                                    type="text"
                                    value={formData.groomName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, groomName: e.target.value })
                                    }
                                    required
                                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                    placeholder="Andika"
                                />
                            </div>

                            {/* Bride Name */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-300">
                                    Nama Mempelai Wanita *
                                </label>
                                <input
                                    type="text"
                                    value={formData.brideName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, brideName: e.target.value })
                                    }
                                    required
                                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                    placeholder="Rani"
                                />
                            </div>

                            {/* Slug - Optional */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-300">
                                    Slug URL (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) =>
                                        setFormData({ ...formData, slug: e.target.value.toLowerCase() })
                                    }
                                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                    placeholder="andika-rani (kosongkan untuk auto-generate)"
                                />
                                <p className="mt-1 text-xs text-neutral-500">
                                    URL: /{formData.slug || "akan-dibuat-otomatis"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Theme Selection */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                        <h2 className="mb-4 text-lg font-semibold text-white">
                            Tema Template
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-neutral-300">
                                Pilih Tema
                            </label>
                            <select
                                value={formData.theme}
                                onChange={(e) =>
                                    setFormData({ ...formData, theme: e.target.value })
                                }
                                className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
                            >
                                <option value="jawa-modern">Jawa Modern</option>
                                <option value="jawa-kuno">Jawa Kuno</option>
                                <option value="elegant">Elegant</option>
                            </select>
                        </div>
                    </div>


                    {/* Actions */}
                    <div className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                        <Link
                            href="/admin"
                            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-emerald-600 px-6 py-2 text-sm text-white hover:bg-emerald-500 disabled:opacity-50"
                        >
                            {loading ? "Membuat..." : "Buat Undangan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
