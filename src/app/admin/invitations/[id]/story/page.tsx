"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";
import AdminNavigationTabs from "@/components/AdminNavigationTabs";

type Story = {
    id: string;
    title: string;
    description: string;
    date: string | null;
    imageUrl: string | null;
    order: number;
    category: string;
};

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function StoryManagementPage({ params }: PageProps) {
    const router = useRouter();
    const [invitationId, setInvitationId] = useState<string>("");
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [category, setCategory] = useState("Default");

    // Upload mode: "url" or "upload"
    const [uploadMode, setUploadMode] = useState<"url" | "upload">("url");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        params.then((p) => {
            setInvitationId(p.id);
            fetchStories(p.id);
        });
    }, [params]);

    async function fetchStories(id: string) {
        try {
            const res = await fetch(`/api/invitations/${id}/story`);
            if (!res.ok) throw new Error("Failed to fetch stories");
            const data = await res.json();
            setStories(data.data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        try {
            let finalImageUrl = imageUrl;

            // If upload mode and file selected, upload to Supabase first
            if (uploadMode === "upload" && selectedFile) {
                setUploading(true);
                const formData = new FormData();
                formData.append("file", selectedFile);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!uploadRes.ok) throw new Error("Failed to upload image");

                const uploadData = await uploadRes.json();
                finalImageUrl = uploadData.data.url; // Fixed: use data.url
                setUploading(false);
            }

            const payload = {
                title,
                description,
                date: date || null,
                imageUrl: finalImageUrl || null,
                order: stories.length,
                category: category || "Default",
            };

            if (editingId) {
                // Update
                const res = await fetch(`/api/invitations/${invitationId}/story/${editingId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) throw new Error("Failed to update story");
                toast.success("Story berhasil diupdate!");
            } else {
                // Create
                const res = await fetch(`/api/invitations/${invitationId}/story`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) throw new Error("Failed to create story");
                toast.success("Story berhasil ditambahkan!");
            }

            // Reset form
            setTitle("");
            setDescription("");
            setDate("");
            setImageUrl("");
            setCategory("Default");
            setEditingId(null);
            setSelectedFile(null);
            setUploadMode("url");

            await fetchStories(invitationId);
        } catch (err: any) {
            toast.error(err.message || "Gagal menyimpan story");
        } finally {
            setSubmitting(false);
        }
    }

    function handleEdit(story: Story) {
        setEditingId(story.id);
        setTitle(story.title);
        setDescription(story.description);
        setDate(story.date ? story.date.split("T")[0] : "");
        setImageUrl(story.imageUrl || "");
        setCategory(story.category || "Default");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function cancelEdit() {
        setEditingId(null);
        setTitle("");
        setDescription("");
        setDate("");
        setImageUrl("");
        setCategory("Default");
        setSelectedFile(null);
        setUploadMode("url");
    }

    async function handleDelete(storyId: string) {
        setDeleteConfirm(null);

        try {
            const res = await fetch(`/api/invitations/${invitationId}/story/${storyId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete story");

            toast.success("Story berhasil dihapus!");
            await fetchStories(invitationId);
        } catch (err: any) {
            toast.error(err.message || "Gagal menghapus story");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen p-6">
                <div className="mx-auto max-w-4xl">
                    <p className="text-center text-neutral-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <ConfirmModal
                isOpen={deleteConfirm !== null}
                title="Hapus Story"
                message="Yakin ingin menghapus story ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus"
                cancelText="Batal"
                onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
                onCancel={() => setDeleteConfirm(null)}
                variant="danger"
            />
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
                        <h1 className="mt-2 text-2xl font-semibold text-white">Our Story</h1>
                        <p className="text-sm text-neutral-400">Kelola timeline cerita perjalanan cinta</p>
                    </div>

                    {/* Navigation Tabs */}
                    <AdminNavigationTabs invitationId={invitationId} activePage="story" />

                    {error && (
                        <div className="mb-4 rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Add/Edit Form */}
                    <div className="mb-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                        <h2 className="mb-4 text-lg font-semibold text-white">
                            {editingId ? "Edit Story" : "Tambah Story Baru"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300">
                                    Judul *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="e.g., Pertemuan Pertama"
                                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300">
                                    Deskripsi *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    rows={4}
                                    placeholder="Ceritakan momen spesial ini..."
                                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300">
                                    Tanggal (Opsional)
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300">
                                    Kategori (e.g., Awal Kenal, Lamaran)
                                </label>
                                <input
                                    type="text"
                                    list="category-suggestions"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="Default"
                                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
                                />
                                <datalist id="category-suggestions">
                                    <option value="Beginning" />
                                    <option value="First Date" />
                                    <option value="Proposal" />
                                    <option value="Our Wedding" />
                                </datalist>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300">
                                    Gambar (Opsional)
                                </label>

                                {/* Mode Toggle */}
                                <div className="mt-2 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUploadMode("url");
                                            setSelectedFile(null);
                                        }}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-medium ${uploadMode === "url"
                                            ? "bg-emerald-600 text-white"
                                            : "border border-neutral-700 bg-neutral-800 text-neutral-400"
                                            }`}
                                    >
                                        URL
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUploadMode("upload");
                                            setImageUrl("");
                                        }}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-medium ${uploadMode === "upload"
                                            ? "bg-emerald-600 text-white"
                                            : "border border-neutral-700 bg-neutral-800 text-neutral-400"
                                            }`}
                                    >
                                        Upload File
                                    </button>
                                </div>

                                {/* URL Input */}
                                {uploadMode === "url" && (
                                    <div className="mt-2">
                                        <input
                                            type="url"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            placeholder="https://..."
                                            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
                                        />
                                    </div>
                                )}

                                {/* File Upload */}
                                {uploadMode === "upload" && (
                                    <div className="mt-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setSelectedFile(file);
                                            }}
                                            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white file:mr-4 file:rounded file:border-0 file:bg-emerald-600 file:px-4 file:py-1 file:text-sm file:text-white hover:file:bg-emerald-500"
                                        />
                                        {selectedFile && (
                                            <div className="mt-2">
                                                <img
                                                    src={URL.createObjectURL(selectedFile)}
                                                    alt="Preview"
                                                    className="h-32 w-full rounded-lg object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <p className="mt-1 text-xs text-neutral-500">
                                    {uploadMode === "url"
                                        ? "Masukkan URL gambar dari sumber eksternal"
                                        : "Upload gambar dari komputer Anda (max 5MB)"}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                                >
                                    {submitting ? "Menyimpan..." : editingId ? "Update Story" : "Tambah Story"}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-white hover:bg-neutral-700"
                                    >
                                        Batal
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Stories List */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                        <h2 className="mb-4 text-lg font-semibold text-white">
                            Timeline ({stories.length})
                        </h2>

                        {stories.length === 0 ? (
                            <p className="py-8 text-center text-sm text-neutral-400">
                                Belum ada story. Tambahkan momen spesial perjalanan cinta Anda.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {stories.map((story) => (
                                    <div
                                        key={story.id}
                                        className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                {story.imageUrl && (
                                                    <img
                                                        src={story.imageUrl}
                                                        alt={story.title}
                                                        className="mb-3 h-32 w-full rounded-lg object-cover"
                                                    />
                                                )}
                                                <h3 className="font-medium text-white">{story.title}</h3>
                                                {story.date && (
                                                    <p className="mt-1 text-xs text-neutral-500">
                                                        {new Date(story.date).toLocaleDateString("id-ID", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        })}
                                                        <span className="ml-2 rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] text-emerald-400">
                                                            {story.category}
                                                        </span>
                                                    </p>
                                                )}
                                                {!story.date && (
                                                    <p className="mt-1 text-xs text-neutral-500">
                                                        <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] text-emerald-400">
                                                            {story.category}
                                                        </span>
                                                    </p>
                                                )}
                                                <p className="mt-2 text-sm text-neutral-300">
                                                    {story.description}
                                                </p>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(story)}
                                                    className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs text-white hover:bg-neutral-700"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(story.id)}
                                                    className="rounded-lg border border-red-900 bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-500"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
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
