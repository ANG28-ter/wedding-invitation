"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";
import InvitationPageShell from "@/components/admin/InvitationPageShell";
import { Plus, Trash2, Upload, Link2, Pencil, X, Film, Image as ImageIcon } from "lucide-react";

type MediaItem = {
    id: string;
    type: "IMAGE" | "VIDEO";
    url: string;
    caption: string | null;
    order: number;
    createdAt: string;
};

type PageProps = { params: Promise<{ id: string }> };

export default function MediaGalleryPage({ params }: PageProps) {
    const router = useRouter();
    const [invitationId, setInvitationId] = useState<string>("");
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
    const [type, setType] = useState<"IMAGE" | "VIDEO">("IMAGE");
    const [url, setUrl] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [caption, setCaption] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const toast = useToast();
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        params.then((p) => { setInvitationId(p.id); fetchMedia(p.id); });
    }, [params]);

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        setFile(selectedFile);
        if (selectedFile.type.startsWith("image/")) {
            setType("IMAGE");
            const reader = new FileReader();
            reader.onloadend = () => setFilePreview(reader.result as string);
            reader.readAsDataURL(selectedFile);
        } else if (selectedFile.type.startsWith("video/")) {
            setType("VIDEO"); setFilePreview(null);
        }
    }

    async function fetchMedia(id: string) {
        try {
            const res = await fetch(`/api/invitations/${id}/media`);
            if (!res.ok) throw new Error("Failed to fetch media");
            const data = await res.json();
            setMediaItems(data);
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    }

    async function handleAddMedia(e: React.FormEvent) {
        e.preventDefault(); setSubmitting(true); setError(null);
        try {
            let finalUrl = url;
            if (uploadMode === "file" && file) {
                setUploading(true);
                const formData = new FormData();
                formData.append("file", file);
                try {
                    const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
                    if (!uploadRes.ok) throw new Error("Upload failed");
                    const uploadData = await uploadRes.json();
                    finalUrl = uploadData.data.url;
                } finally { setUploading(false); }
            }
            if (!finalUrl) throw new Error("Tidak ada URL tersedia. Upload file atau masukkan URL.");

            const res = await fetch(`/api/invitations/${invitationId}/media`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, url: finalUrl, caption: caption.trim() || undefined, order: mediaItems.length }),
            });
            if (!res.ok) throw new Error("Failed to add media");
            setUrl(""); setFile(null); setFilePreview(null); setCaption("");
            await fetchMedia(invitationId);
            toast.success("Media berhasil ditambahkan!");
        } catch (err: any) { setError(err.message); }
        finally { setSubmitting(false); setUploading(false); }
    }

    async function handleDelete(mediaId: string) {
        setDeleteConfirm(null);
        try {
            await fetch(`/api/invitations/${invitationId}/media/${mediaId}`, { method: "DELETE" });
            await fetchMedia(invitationId);
            toast.success("Media berhasil dihapus!");
        } catch (err: any) { setError(err.message); }
    }

    if (loading) return (
        <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[rgb(var(--color-primary))] border-t-transparent"></div>
        </div>
    );

    return (
        <>
            <ConfirmModal isOpen={deleteConfirm !== null} title="Hapus Media"
                message="Yakin ingin menghapus media ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus" cancelText="Batal"
                onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
                onCancel={() => setDeleteConfirm(null)} variant="danger" />
            <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

            <InvitationPageShell invitationId={invitationId} activePage="media"
                title="Galeri Media" subtitle="Kelola foto dan video yang ditampilkan di undangan." error={error}>

                {/* Add New Media Form */}
                <div className="admin-card">
                    <h2 className="admin-section-title">Tambah Media Baru</h2>

                    {/* Mode Toggle */}
                    <div className="flex gap-2 mb-5 p-1 rounded-xl border border-current/10 bg-current/5 w-fit">
                        <button type="button" onClick={() => setUploadMode("file")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${uploadMode === "file"
                                ? "bg-[rgb(var(--color-primary))] text-[#1a1a1a] shadow"
                                : "opacity-50 hover:opacity-80"
                            }`}>
                            <Upload className="h-4 w-4" />
                            Upload File
                        </button>
                        <button type="button" onClick={() => setUploadMode("url")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${uploadMode === "url"
                                ? "bg-[rgb(var(--color-primary))] text-[#1a1a1a] shadow"
                                : "opacity-50 hover:opacity-80"
                            }`}>
                            <Link2 className="h-4 w-4" />
                            Dari URL
                        </button>
                    </div>

                    <form onSubmit={handleAddMedia} className="space-y-4">
                        {uploadMode === "file" ? (
                            <div>
                                <label className="admin-label">Pilih File *</label>
                                <input type="file" accept="image/*,video/*" onChange={handleFileSelect} required
                                    className="admin-input cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[rgb(var(--color-primary))]/20 file:text-[rgb(var(--color-primary))] file:text-xs file:font-semibold" />
                                <p className="mt-1.5 text-xs opacity-40">Maks: 10MB untuk gambar, 30MB untuk video</p>
                                {filePreview && (
                                    <div className="mt-3 rounded-xl overflow-hidden border border-current/10 max-w-xs">
                                        <img src={filePreview} alt="Preview" className="w-full h-40 object-cover" />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="admin-label">Tipe Media</label>
                                    <select value={type} onChange={(e) => setType(e.target.value as "IMAGE" | "VIDEO")} className="admin-input">
                                        <option value="IMAGE">Gambar</option>
                                        <option value="VIDEO">Video</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="admin-label">URL *</label>
                                    <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} required
                                        className="admin-input" placeholder="https://example.com/photo.jpg" />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="admin-label">Caption (Opsional)</label>
                            <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)}
                                className="admin-input" placeholder="Deskripsi foto..." maxLength={200} />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button type="submit" disabled={submitting || uploading} className="admin-btn-primary">
                                <Plus className="h-4 w-4" />
                                {uploading ? "Mengupload..." : submitting ? "Menyimpan..." : uploadMode === "file" ? "Upload & Simpan" : "Tambah Media"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Media Grid */}
                <div className="admin-card">
                    <h2 className="admin-section-title">Galeri ({mediaItems.length} item)</h2>
                    {mediaItems.length === 0 ? (
                        <div className="py-12 text-center opacity-50">
                            <ImageIcon className="h-10 w-10 mx-auto mb-3 opacity-40" />
                            <p className="text-sm">Belum ada media. Tambahkan foto atau video di atas.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {mediaItems.map((item) => (
                                <div key={item.id} className="group relative overflow-hidden rounded-xl border border-current/10 bg-current/5 hover:border-[rgb(var(--color-primary))]/30 transition-colors">
                                    {/* Thumbnail */}
                                    <div className="aspect-video bg-current/5 flex items-center justify-center overflow-hidden">
                                        {item.type === "IMAGE" ? (
                                            <img src={item.url} alt={item.caption || "Media"} className="h-full w-full object-cover"
                                                onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }} />
                                        ) : (
                                            <div className="text-center opacity-50">
                                                <Film className="h-8 w-8 mx-auto mb-1" />
                                                <p className="text-xs font-medium">VIDEO</p>
                                            </div>
                                        )}
                                        {/* Type badge */}
                                        <div className="absolute top-2 left-2">
                                            <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-black/50 text-white backdrop-blur-sm">
                                                {item.type === "IMAGE" ? "IMG" : "VID"}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Info */}
                                    <div className="p-3">
                                        <p className="text-xs font-medium truncate opacity-70">{item.caption || "—"}</p>
                                        <button onClick={() => setDeleteConfirm(item.id)}
                                            className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-lg border border-red-500/30 py-1.5 text-xs text-red-500 hover:bg-red-500/10 transition-colors">
                                            <Trash2 className="h-3.5 w-3.5" />
                                            Hapus
                                        </button>
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
