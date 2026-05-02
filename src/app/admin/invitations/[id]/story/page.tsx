"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";
import InvitationPageShell from "@/components/admin/InvitationPageShell";
import { Plus, Trash2, Pencil, X, Upload, Link2, BookHeart, Calendar, Tag } from "lucide-react";

type Story = {
    id: string;
    title: string;
    description: string;
    date: string | null;
    imageUrl: string | null;
    order: number;
    category: string;
};

type PageProps = { params: Promise<{ id: string }> };

export default function StoryManagementPage({ params }: PageProps) {
    const router = useRouter();
    const [invitationId, setInvitationId] = useState<string>("");
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [category, setCategory] = useState("Default");

    const [uploadMode, setUploadMode] = useState<"url" | "upload">("url");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        params.then((p) => { setInvitationId(p.id); fetchStories(p.id); });
    }, [params]);

    async function fetchStories(id: string) {
        try {
            const res = await fetch(`/api/invitations/${id}/story`);
            if (!res.ok) throw new Error("Failed to fetch stories");
            const data = await res.json();
            setStories(data.data || []);
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setSubmitting(true);
        try {
            let finalImageUrl = imageUrl;
            if (uploadMode === "upload" && selectedFile) {
                setUploading(true);
                const formData = new FormData();
                formData.append("file", selectedFile);
                const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
                if (!uploadRes.ok) throw new Error("Failed to upload image");
                const uploadData = await uploadRes.json();
                finalImageUrl = uploadData.data.url;
                setUploading(false);
            }

            const payload = { title, description, date: date || null, imageUrl: finalImageUrl || null, order: stories.length, category: category || "Default" };

            if (editingId) {
                const res = await fetch(`/api/invitations/${invitationId}/story/${editingId}`, {
                    method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error("Failed to update story");
                toast.success("Story berhasil diupdate!");
            } else {
                const res = await fetch(`/api/invitations/${invitationId}/story`, {
                    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error("Failed to create story");
                toast.success("Story berhasil ditambahkan!");
            }

            setTitle(""); setDescription(""); setDate(""); setImageUrl(""); setCategory("Default");
            setEditingId(null); setSelectedFile(null); setUploadMode("url");
            await fetchStories(invitationId);
        } catch (err: any) { toast.error(err.message || "Gagal menyimpan story"); }
        finally { setSubmitting(false); }
    }

    function handleEdit(story: Story) {
        setEditingId(story.id); setTitle(story.title); setDescription(story.description);
        setDate(story.date ? story.date.split("T")[0] : "");
        setImageUrl(story.imageUrl || ""); setCategory(story.category || "Default");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function cancelEdit() {
        setEditingId(null); setTitle(""); setDescription(""); setDate("");
        setImageUrl(""); setCategory("Default"); setSelectedFile(null); setUploadMode("url");
    }

    async function handleDelete(storyId: string) {
        setDeleteConfirm(null);
        try {
            const res = await fetch(`/api/invitations/${invitationId}/story/${storyId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete story");
            toast.success("Story berhasil dihapus!");
            await fetchStories(invitationId);
        } catch (err: any) { toast.error(err.message || "Gagal menghapus story"); }
    }

    if (loading) return (
        <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[rgb(var(--color-primary))] border-t-transparent"></div>
        </div>
    );

    return (
        <>
            <ConfirmModal isOpen={deleteConfirm !== null} title="Hapus Story"
                message="Yakin ingin menghapus story ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus" cancelText="Batal"
                onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
                onCancel={() => setDeleteConfirm(null)} variant="danger" />
            <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

            <InvitationPageShell invitationId={invitationId} activePage="story"
                title="Our Story" subtitle="Kelola timeline perjalanan cinta yang ditampilkan di undangan." error={error}>

                {/* Add/Edit Form */}
                <div className={`admin-card ${editingId ? "border-[rgb(var(--color-primary))]/40" : ""}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="admin-section-title mb-0">
                            {editingId ? "Edit Cerita" : "Tambah Cerita Baru"}
                        </h2>
                        {editingId && (
                            <button onClick={cancelEdit} className="flex items-center gap-1.5 text-xs opacity-60 hover:opacity-100 transition-opacity">
                                <X className="h-3.5 w-3.5" /> Batal Edit
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="admin-label">Judul *</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                                    className="admin-input" placeholder="Pertemuan Pertama" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="admin-label">Tanggal</label>
                                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="admin-input" />
                                </div>
                                <div>
                                    <label className="admin-label">Kategori</label>
                                    <input type="text" list="category-suggestions" value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="admin-input" placeholder="Default" />
                                    <datalist id="category-suggestions">
                                        <option value="Beginning" />
                                        <option value="First Date" />
                                        <option value="Proposal" />
                                        <option value="Our Wedding" />
                                    </datalist>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="admin-label">Deskripsi *</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required
                                rows={3} className="admin-input resize-none" placeholder="Ceritakan momen spesial ini..." />
                        </div>

                        <div>
                            <label className="admin-label">Gambar (Opsional)</label>
                            <div className="flex gap-2 mt-2 mb-3 p-1 rounded-xl border border-current/10 bg-current/5 w-fit">
                                <button type="button" onClick={() => { setUploadMode("url"); setSelectedFile(null); }}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${uploadMode === "url"
                                        ? "bg-[rgb(var(--color-primary))] text-[#1a1a1a] shadow"
                                        : "opacity-50 hover:opacity-80"
                                    }`}>
                                    <Link2 className="h-3.5 w-3.5" /> URL
                                </button>
                                <button type="button" onClick={() => { setUploadMode("upload"); setImageUrl(""); }}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${uploadMode === "upload"
                                        ? "bg-[rgb(var(--color-primary))] text-[#1a1a1a] shadow"
                                        : "opacity-50 hover:opacity-80"
                                    }`}>
                                    <Upload className="h-3.5 w-3.5" /> Upload
                                </button>
                            </div>

                            {uploadMode === "url" ? (
                                <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                                    className="admin-input" placeholder="https://..." />
                            ) : (
                                <div>
                                    <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setSelectedFile(f); }}
                                        className="admin-input cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[rgb(var(--color-primary))]/20 file:text-[rgb(var(--color-primary))] file:text-xs file:font-semibold" />
                                    {selectedFile && (
                                        <div className="mt-3 rounded-xl overflow-hidden border border-current/10 max-w-xs">
                                            <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-36 object-cover" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 justify-end pt-2">
                            {editingId && (
                                <button type="button" onClick={cancelEdit} className="admin-btn-ghost">
                                    <X className="h-4 w-4" /> Batal
                                </button>
                            )}
                            <button type="submit" disabled={submitting || uploading} className="admin-btn-primary">
                                {editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                {uploading ? "Mengupload..." : submitting ? "Menyimpan..." : editingId ? "Update Cerita" : "Tambah Cerita"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Stories Timeline */}
                <div className="admin-card">
                    <h2 className="admin-section-title">Timeline ({stories.length} Cerita)</h2>

                    {stories.length === 0 ? (
                        <div className="py-12 text-center opacity-50">
                            <BookHeart className="h-10 w-10 mx-auto mb-3 opacity-40" />
                            <p className="text-sm">Belum ada cerita. Tambahkan momen spesial di atas.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {stories.map((story) => (
                                <div key={story.id} className="rounded-xl border border-current/10 bg-current/5 overflow-hidden hover:border-[rgb(var(--color-primary))]/20 transition-colors">
                                    {story.imageUrl && (
                                        <img src={story.imageUrl} alt={story.title} className="w-full h-40 object-cover" />
                                    )}
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold mb-1">{story.title}</h3>
                                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                                    {story.date && (
                                                        <span className="flex items-center gap-1 text-xs opacity-50">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(story.date).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg bg-[rgb(var(--color-primary))]/15 text-[rgb(var(--color-primary))]">
                                                        <Tag className="h-3 w-3" />
                                                        {story.category}
                                                    </span>
                                                </div>
                                                <p className="text-sm opacity-60 leading-relaxed line-clamp-3">{story.description}</p>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <button onClick={() => handleEdit(story)}
                                                    className="rounded-lg border border-current/15 p-2 opacity-60 hover:opacity-100 hover:border-[rgb(var(--color-primary))]/40 transition-all" title="Edit">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => setDeleteConfirm(story.id)}
                                                    className="rounded-lg border border-red-500/30 p-2 text-red-500 hover:bg-red-500/10 transition-colors" title="Hapus">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </InvitationPageShell>
        </>
    );
}
