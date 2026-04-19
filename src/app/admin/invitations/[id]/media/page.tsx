"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";
import AdminNavigationTabs from "@/components/AdminNavigationTabs";

type MediaItem = {
    id: string;
    type: "IMAGE" | "VIDEO";
    url: string;
    caption: string | null;
    order: number;
    createdAt: string;
};

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function MediaGalleryPage({ params }: PageProps) {
    const router = useRouter();
    const [invitationId, setInvitationId] = useState<string>("");
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
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
        params.then((p) => {
            setInvitationId(p.id);
            fetchMedia(p.id);
        });
    }, [params]);

    // Handle file selection
    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        // Auto-detect type
        if (selectedFile.type.startsWith("image/")) {
            setType("IMAGE");
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        } else if (selectedFile.type.startsWith("video/")) {
            setType("VIDEO");
            setFilePreview(null);
        }
    }

    async function fetchMedia(id: string) {
        try {
            const res = await fetch(`/api/invitations/${id}/media`);
            if (!res.ok) throw new Error("Failed to fetch media");
            const data = await res.json();
            setMediaItems(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddMedia(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            let finalUrl = url;

            // If file mode, upload file first
            if (uploadMode === "file" && file) {
                setUploading(true);
                const formData = new FormData();
                formData.append("file", file);

                try {
                    const uploadRes = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                    });

                    if (!uploadRes.ok) {
                        const errorData = await uploadRes.json();
                        throw new Error(errorData.error || "Upload failed");
                    }

                    const uploadData = await uploadRes.json();
                    finalUrl = uploadData.data.url;
                } catch (uploadErr: any) {
                    console.error("Upload error:", uploadErr);

                    // If it's a network error but file might be uploaded, 
                    // let user know they can try URL mode with the uploaded file
                    if (uploadErr.message?.includes("fetch") || uploadErr.name === "TypeError") {
                        throw new Error(
                            "Upload connection interrupted. File may have been uploaded to Supabase. " +
                            "Please check Supabase Storage or try using URL mode instead."
                        );
                    }

                    throw uploadErr;
                } finally {
                    setUploading(false);
                }
            }

            // Validate we have a URL
            if (!finalUrl) {
                throw new Error("No URL available. Please upload a file or enter a URL.");
            }

            // Add media to database
            const res = await fetch(`/api/invitations/${invitationId}/media`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type,
                    url: finalUrl,
                    caption: caption.trim() || undefined,
                    order: mediaItems.length,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to add media");
            }

            // Reset form
            setUrl("");
            setFile(null);
            setFilePreview(null);
            setCaption("");

            // Refresh list
            await fetchMedia(invitationId);

            toast.success("Media berhasil ditambahkan!");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
            setUploading(false);
        }
    }

    async function handleDelete(mediaId: string) {
        setDeleteConfirm(null);

        try {
            const res = await fetch(`/api/invitations/${invitationId}/media/${mediaId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete media");

            // Refresh list
            await fetchMedia(invitationId);

            toast.success("Media berhasil dihapus!");
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
            <ConfirmModal
                isOpen={deleteConfirm !== null}
                title="Hapus Media"
                message="Yakin ingin menghapus media ini? Tindakan ini tidak dapat dibatalkan."
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
                        <h1 className="mt-2 text-2xl font-semibold text-white">Media Gallery</h1>
                        <p className="text-sm text-neutral-400">Manage photos and videos</p>
                    </div>

                    {/* Navigation Tabs */}
                    <AdminNavigationTabs invitationId={invitationId} activePage="media" />

                    {error && (
                        <div className="mb-4 rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Add New Media Form */}
                    <div className="mb-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                        <h2 className="mb-4 text-lg font-semibold text-white">Add New Media</h2>

                        {/* Mode Toggle */}
                        <div className="mb-4 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setUploadMode("file")}
                                className={`rounded-lg px-4 py-2 text-sm font-medium ${uploadMode === "file"
                                    ? "bg-emerald-600 text-white"
                                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                                    }`}
                            >
                                Upload File
                            </button>
                            <button
                                type="button"
                                onClick={() => setUploadMode("url")}
                                className={`rounded-lg px-4 py-2 text-sm font-medium ${uploadMode === "url"
                                    ? "bg-black text-white"
                                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                                    }`}
                            >
                                Enter URL
                            </button>
                        </div>

                        <form onSubmit={handleAddMedia} className="space-y-4">
                            {uploadMode === "file" ? (
                                <>
                                    {/* File Upload Mode */}
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300">
                                            Select File *
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*,video/*"
                                            onChange={handleFileSelect}
                                            required
                                            className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                        />
                                        <p className="mt-1 text-xs text-neutral-500">
                                            Max: 10MB for images, 30MB for videos
                                        </p>
                                    </div>

                                    {/* File Preview */}
                                    {filePreview && (
                                        <div className="rounded-lg border border-neutral-200 p-2">
                                            <img
                                                src={filePreview}
                                                alt="Preview"
                                                className="h-32 w-full object-contain"
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {/* URL Mode */}
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700">
                                            Type
                                        </label>
                                        <select
                                            value={type}
                                            onChange={(e) => setType(e.target.value as "IMAGE" | "VIDEO")}
                                            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
                                        >
                                            <option value="IMAGE">Image</option>
                                            <option value="VIDEO">Video</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700">
                                            URL *
                                        </label>
                                        <input
                                            type="url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            required
                                            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
                                            placeholder="https://example.com/photo.jpg"
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-neutral-700">
                                    Caption
                                </label>
                                <input
                                    type="text"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
                                    placeholder="Photo description..."
                                    maxLength={200}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || uploading}
                                className="rounded-lg bg-emerald-600 px-6 py-2 text-sm text-white hover:bg-emerald-500 disabled:opacity-50 cursor-pointer"
                            >
                                {uploading
                                    ? "Uploading..."
                                    : submitting
                                        ? "Adding..."
                                        : uploadMode === "file"
                                            ? "Upload & Add Media"
                                            : "+ Add Media"}
                            </button>
                        </form>
                    </div>

                    {/* Media List */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                        <h2 className="mb-4 text-lg font-semibold text-white">
                            Existing Media ({mediaItems.length} items)
                        </h2>

                        {mediaItems.length === 0 ? (
                            <p className="py-8 text-center text-sm text-neutral-400">
                                No media items yet. Add your first photo or video above.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {mediaItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="overflow-hidden rounded-lg border border-neutral-200"
                                    >
                                        {/* Media Preview */}
                                        <div className="aspect-video bg-neutral-100 flex items-center justify-center">
                                            {item.type === "IMAGE" ? (
                                                <img
                                                    src={item.url}
                                                    alt={item.caption || "Media"}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3EImage%3C/text%3E%3C/svg%3E";
                                                    }}
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    <svg
                                                        className="mx-auto h-12 w-12 text-neutral-400"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    <p className="mt-2 text-xs text-neutral-500">VIDEO</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Media Info */}
                                        <div className="p-3">
                                            <p className="text-sm font-medium text-neutral-900">
                                                {item.caption || "No caption"}
                                            </p>
                                            <p className="mt-1 text-xs text-neutral-500">
                                                Order: {item.order}
                                            </p>

                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="mt-3 w-full rounded-lg border border-red-300 bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-500 cursor-pointer"
                                            >
                                                Delete
                                            </button>
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

