"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminNavigationTabs from "@/components/AdminNavigationTabs";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";

type Invitation = {
    id: string;
    slug: string;
    title: string | null;
    groomName: string;
    brideName: string;
    coverImage: string | null;
    coverVideo: string | null;
    theme: string;

    groomPhotoUrl: string | null;
    bridePhotoUrl: string | null;
    groomBio: string | null;
    brideBio: string | null;
    groomParents: string | null;
    brideParents: string | null;
    openingQuote: string | null;
    openingQuoteAuthor: string | null;
    heroImage: string | null;
    groomHandle: string | null;
    brideHandle: string | null;
    groomLocation: string | null;
    brideLocation: string | null;
    rsvtImage: string | null;
    musicUrl: string | null;
};

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function InvitationEditPage({ params }: PageProps) {
    const router = useRouter();
    const [invitationId, setInvitationId] = useState<string>("");
    const [invitation, setInvitation] = useState<Invitation | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Upload mode states
    const [groomPhotoMode, setGroomPhotoMode] = useState<"url" | "upload">("url");
    const [bridePhotoMode, setBridePhotoMode] = useState<"url" | "upload">("url");
    const [coverImageMode, setCoverImageMode] = useState<"url" | "upload">("url");
    const [heroImageMode, setHeroImageMode] = useState<"url" | "upload">("url");

    const [groomPhotoFile, setGroomPhotoFile] = useState<File | null>(null);
    const [bridePhotoFile, setBridePhotoFile] = useState<File | null>(null);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
    const [rsvtImageMode, setRsvtImageMode] = useState<"url" | "upload">("url");
    const [rsvtImageFile, setRsvtImageFile] = useState<File | null>(null);

    const [musicMode, setMusicMode] = useState<"url" | "upload">("url");
    const [musicFile, setMusicFile] = useState<File | null>(null);

    const [uploading, setUploading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        groomName: "",
        brideName: "",
        coverImage: "",
        coverVideo: "",
        theme: "jawa-modern",

        groomPhotoUrl: "",
        bridePhotoUrl: "",
        groomBio: "",
        brideBio: "",
        groomParents: "",
        brideParents: "",
        openingQuote: "",
        openingQuoteAuthor: "",
        heroImage: "",
        groomHandle: "",
        brideHandle: "",
        groomLocation: "",
        brideLocation: "",
        rsvtImage: "",
        musicUrl: "",
    });

    const toast = useToast();

    useEffect(() => {
        params.then((p) => {
            setInvitationId(p.id);
            fetchInvitation(p.id);
        });
    }, [params]);

    async function fetchInvitation(id: string) {
        try {
            const res = await fetch(`/api/invitations/${id}`);
            if (!res.ok) throw new Error("Failed to fetch invitation");
            const data = await res.json();
            setInvitation(data);

            // Populate form
            setFormData({
                title: data.title || "",
                groomName: data.groomName || "",
                brideName: data.brideName || "",
                coverImage: data.coverImage || "",
                coverVideo: data.coverVideo || "",
                theme: data.theme,
                groomPhotoUrl: data.groomPhotoUrl || "",
                bridePhotoUrl: data.bridePhotoUrl || "",
                groomBio: data.groomBio || "",
                brideBio: data.brideBio || "",
                groomParents: data.groomParents || "",
                brideParents: data.brideParents || "",
                openingQuote: data.openingQuote || "",
                openingQuoteAuthor: data.openingQuoteAuthor || "",
                heroImage: data.heroImage || "",
                groomHandle: data.groomHandle || "",
                brideHandle: data.brideHandle || "",
                groomLocation: data.groomLocation || "",
                brideLocation: data.brideLocation || "",
                rsvtImage: data.rsvtImage || "",
                musicUrl: data.musicUrl || "",
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            console.log('Saving invitation data:', formData);

            // Handle groom photo upload if file selected
            let finalGroomPhotoUrl = formData.groomPhotoUrl;
            if (groomPhotoMode === "upload" && groomPhotoFile) {
                setUploading(true);
                const uploadFormData = new FormData();
                uploadFormData.append("file", groomPhotoFile);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadFormData,
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    finalGroomPhotoUrl = uploadData.data.url;
                }
                setUploading(false);
            }

            // Handle bride photo upload if file selected
            let finalBridePhotoUrl = formData.bridePhotoUrl;
            if (bridePhotoMode === "upload" && bridePhotoFile) {
                setUploading(true);
                const uploadFormData = new FormData();
                uploadFormData.append("file", bridePhotoFile);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadFormData,
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    finalBridePhotoUrl = uploadData.data.url;
                }
                setUploading(false);
            }

            // Handle cover image upload if file selected
            let finalCoverImage = formData.coverImage;
            if (coverImageMode === "upload" && coverImageFile) {
                setUploading(true);
                const uploadFormData = new FormData();
                uploadFormData.append("file", coverImageFile);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadFormData,
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    finalCoverImage = uploadData.data.url;
                }
                setUploading(false);
            }

            // Handle hero image upload if file selected
            let finalHeroImage = formData.heroImage;
            if (heroImageMode === "upload" && heroImageFile) {
                setUploading(true);
                const uploadFormData = new FormData();
                uploadFormData.append("file", heroImageFile);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadFormData,
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    finalHeroImage = uploadData.data.url;
                }
                setUploading(false);
            }

            // Handle rsvt image upload if file selected
            let finalRsvtImage = formData.rsvtImage;
            if (rsvtImageMode === "upload" && rsvtImageFile) {
                setUploading(true);
                const uploadFormData = new FormData();
                uploadFormData.append("file", rsvtImageFile);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadFormData,
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    finalRsvtImage = uploadData.data.url;
                }
                setUploading(false);
            }

            // Handle music upload if file selected
            let finalMusicUrl = formData.musicUrl;
            if (musicMode === "upload" && musicFile) {
                setUploading(true);
                const uploadFormData = new FormData();
                uploadFormData.append("file", musicFile);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadFormData,
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    finalMusicUrl = uploadData.data.url;
                }
                setUploading(false);
            }

            const dataToSave = {
                ...formData,
                groomPhotoUrl: finalGroomPhotoUrl,
                bridePhotoUrl: finalBridePhotoUrl,
                coverImage: finalCoverImage,
                heroImage: finalHeroImage,
                rsvtImage: finalRsvtImage,
                musicUrl: finalMusicUrl,
            };

            const res = await fetch(`/api/invitations/${invitationId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSave),
            });

            console.log('Response status:', res.status);

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Update failed:", errorData);
                throw new Error(errorData.error || "Failed to update");
            }

            const result = await res.json();
            console.log('Update successful:', result);

            toast.success("Invitation updated successfully!");

            // Reset upload states
            setGroomPhotoFile(null);
            setBridePhotoFile(null);
            setCoverImageFile(null);
            setHeroImageFile(null);
            setRsvtImageFile(null);
            setMusicFile(null);

            // Refresh to get latest data
            await fetchInvitation(invitationId);
        } catch (err: any) {
            console.error('Save error:', err);
            setError(err.message);
            toast.error(err.message || "Failed to save");
        } finally {
            setSaving(false);
            setUploading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-100 p-6">
                <div className="mx-auto max-w-3xl">
                    <p className="text-center">Loading...</p>
                </div>
            </div>
        );
    }

    if (error && !invitation) {
        return (
            <div className="min-h-screen bg-neutral-100 p-6">
                <div className="mx-auto max-w-3xl">
                    <p className="text-center text-red-600">Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
            <div className="min-h-screen p-6">
                <div className="mx-auto max-w-3xl">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <Link
                                href="/admin"
                                className="text-sm text-neutral-400 hover:text-neutral-200"
                            >
                                ← Back to Dashboard
                            </Link>
                            <h1 className="mt-2 text-2xl font-semibold text-white">
                                Edit Invitation: {invitation?.groomName} & {invitation?.brideName}
                            </h1>
                            <p className="text-sm text-neutral-400">/{invitation?.slug}</p>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <AdminNavigationTabs invitationId={invitationId} activePage="details" />

                    {error && (
                        <div className="mb-4 rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Basic Information */}
                        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                            <h2 className="mb-4 text-lg font-semibold text-white">Basic Information</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300">
                                        Groom Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.groomName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, groomName: e.target.value })
                                        }
                                        className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300">
                                        Bride Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.brideName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, brideName: e.target.value })
                                        }
                                        className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                        placeholder="Jane"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cover Media - Updated with File Upload */}
                        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                            <h2 className="mb-4 text-lg font-semibold text-white">Theme & Desktop Cover</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300">
                                        Choose Template Theme
                                    </label>
                                    <select
                                        value={formData.theme}
                                        onChange={(e) =>
                                            setFormData({ ...formData, theme: e.target.value })
                                        }
                                        className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                    >
                                        <option value="jawa-modern">Jawa Modern</option>
                                        <option value="jawa-kuno">Jawa Kuno</option>
                                        <option value="elegant">Elegant</option>
                                    </select>
                                </div>

                                <div className="border-t border-neutral-800 pt-6">
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        Desktop Cover Image (Left Side)
                                    </label>
                                    <p className="text-xs text-neutral-500 mb-3">
                                        This image will appear on the left side when viewed on desktop (split screen layout).
                                    </p>

                                    {/* Mode Toggle */}
                                    <div className="flex gap-2 mb-3 max-w-xs">
                                        <button
                                            type="button"
                                            onClick={() => setCoverImageMode("url")}
                                            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${coverImageMode === "url"
                                                ? "bg-emerald-600 text-white"
                                                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                                                }`}
                                        >
                                            URL
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCoverImageMode("upload")}
                                            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${coverImageMode === "upload"
                                                ? "bg-emerald-600 text-white"
                                                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                                                }`}
                                        >
                                            Upload
                                        </button>
                                    </div>

                                    {coverImageMode === "url" ? (
                                        <input
                                            type="url"
                                            value={formData.coverImage}
                                            onChange={(e) =>
                                                setFormData({ ...formData, coverImage: e.target.value })
                                            }
                                            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500"
                                            placeholder="https://..."
                                        />
                                    ) : (
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setCoverImageFile(file);
                                                }}
                                                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white file:mr-3 file:rounded file:border-0 file:bg-emerald-600 file:px-3 file:py-1 file:text-xs file:text-white"
                                            />
                                            {coverImageFile && (
                                                <p className="mt-1 text-xs text-emerald-400">
                                                    Selected: {coverImageFile.name}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Preview */}
                                    {formData.coverImage && (
                                        <div className="mt-3 relative inline-block">
                                            <div className="h-32 w-auto overflow-hidden rounded-lg border border-neutral-700 bg-neutral-950">
                                                <img
                                                    src={formData.coverImage}
                                                    alt="Cover preview"
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (confirm("Remove cover image?")) {
                                                        setFormData({ ...formData, coverImage: "" });
                                                        setCoverImageFile(null);
                                                    }
                                                }}
                                                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md"
                                                title="Remove image"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-neutral-800 pt-6">
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        Hero Section Image (Mobile Portrait)
                                    </label>
                                    <p className="text-xs text-neutral-500 mb-3">
                                        This image will appear inside the torn paper section on the mobile hero. Recommended: Portrait aspect ratio.
                                    </p>

                                    {/* Mode Toggle */}
                                    <div className="flex gap-2 mb-3 max-w-xs">
                                        <button
                                            type="button"
                                            onClick={() => setHeroImageMode("url")}
                                            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${heroImageMode === "url"
                                                ? "bg-emerald-600 text-white"
                                                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                                                }`}
                                        >
                                            URL
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setHeroImageMode("upload")}
                                            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${heroImageMode === "upload"
                                                ? "bg-emerald-600 text-white"
                                                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                                                }`}
                                        >
                                            Upload
                                        </button>
                                    </div>

                                    {heroImageMode === "url" ? (
                                        <input
                                            type="url"
                                            value={formData.heroImage}
                                            onChange={(e) =>
                                                setFormData({ ...formData, heroImage: e.target.value })
                                            }
                                            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500"
                                            placeholder="https://..."
                                        />
                                    ) : (
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setHeroImageFile(file);
                                                }}
                                                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white file:mr-3 file:rounded file:border-0 file:bg-emerald-600 file:px-3 file:py-1 file:text-xs file:text-white"
                                            />
                                            {heroImageFile && (
                                                <p className="mt-1 text-xs text-emerald-400">
                                                    Selected: {heroImageFile.name}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Preview */}
                                    {formData.heroImage && (
                                        <div className="mt-3 relative inline-block">
                                            <div className="h-40 w-auto overflow-hidden rounded-lg border border-neutral-700 bg-neutral-950">
                                                <img
                                                    src={formData.heroImage}
                                                    alt="Hero preview"
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (confirm("Remove hero image?")) {
                                                        setFormData({ ...formData, heroImage: "" });
                                                        setHeroImageFile(null);
                                                    }
                                                }}
                                                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md"
                                                title="Remove image"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* RSVT Image */}
                                <div className="border-t border-neutral-800 pt-6">
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        RSVT Section Image
                                    </label>
                                    <p className="text-xs text-neutral-500 mb-3">
                                        This image will appear inside the torn paper frame on the RSVT section.
                                    </p>

                                    {/* Mode Toggle */}
                                    <div className="flex gap-2 mb-3 max-w-xs">
                                        <button
                                            type="button"
                                            onClick={() => setRsvtImageMode("url")}
                                            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${rsvtImageMode === "url"
                                                ? "bg-emerald-600 text-white"
                                                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                                                }`}
                                        >
                                            URL
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRsvtImageMode("upload")}
                                            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${rsvtImageMode === "upload"
                                                ? "bg-emerald-600 text-white"
                                                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                                                }`}
                                        >
                                            Upload
                                        </button>
                                    </div>

                                    {rsvtImageMode === "url" ? (
                                        <input
                                            type="url"
                                            value={formData.rsvtImage}
                                            onChange={(e) =>
                                                setFormData({ ...formData, rsvtImage: e.target.value })
                                            }
                                            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500"
                                            placeholder="https://..."
                                        />
                                    ) : (
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setRsvtImageFile(file);
                                                }}
                                                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white file:mr-3 file:rounded file:border-0 file:bg-emerald-600 file:px-3 file:py-1 file:text-xs file:text-white"
                                            />
                                            {rsvtImageFile && (
                                                <p className="mt-1 text-xs text-emerald-400">
                                                    Selected: {rsvtImageFile.name}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Preview */}
                                    {formData.rsvtImage && (
                                        <div className="mt-3 relative inline-block">
                                            <div className="h-40 w-auto overflow-hidden rounded-lg border border-neutral-700 bg-neutral-950">
                                                <img
                                                    src={formData.rsvtImage}
                                                    alt="rsvt preview"
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (confirm("Remove RSVT image?")) {
                                                        setFormData({ ...formData, rsvtImage: "" });
                                                        setRsvtImageFile(null);
                                                    }
                                                }}
                                                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md"
                                                title="Remove image"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Music Background */}
                                <div className="border-t border-neutral-800 pt-6">
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        Background Music
                                    </label>
                                    <p className="text-xs text-neutral-500 mb-3">
                                        Upload an MP3 file or provide a URL for the background music.
                                    </p>

                                    {/* Mode Toggle */}
                                    <div className="flex gap-2 mb-3 max-w-xs">
                                        <button
                                            type="button"
                                            onClick={() => setMusicMode("url")}
                                            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${musicMode === "url"
                                                ? "bg-emerald-600 text-white"
                                                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                                                }`}
                                        >
                                            URL
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMusicMode("upload")}
                                            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${musicMode === "upload"
                                                ? "bg-emerald-600 text-white"
                                                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                                                }`}
                                        >
                                            Upload
                                        </button>
                                    </div>

                                    {musicMode === "url" ? (
                                        <input
                                            type="url"
                                            value={formData.musicUrl}
                                            onChange={(e) =>
                                                setFormData({ ...formData, musicUrl: e.target.value })
                                            }
                                            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500"
                                            placeholder="https://... (e.g. .mp3)"
                                        />
                                    ) : (
                                        <div>
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setMusicFile(file);
                                                }}
                                                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white file:mr-3 file:rounded file:border-0 file:bg-emerald-600 file:px-3 file:py-1 file:text-xs file:text-white"
                                            />
                                            {musicFile && (
                                                <p className="mt-1 text-xs text-emerald-400">
                                                    Selected: {musicFile.name}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Preview/Active State */}
                                    {formData.musicUrl && (
                                        <div className="mt-3 relative inline-flex items-center gap-3 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-2">
                                            <audio controls src={formData.musicUrl} className="h-8 max-w-[200px]" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (confirm("Remove background music?")) {
                                                        setFormData({ ...formData, musicUrl: "" });
                                                        setMusicFile(null);
                                                    }
                                                }}
                                                className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md ml-2"
                                                title="Remove music"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Couple Details */}
                        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                            <h2 className="mb-4 text-lg font-semibold text-white">Couple Details</h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Groom Photo */}
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300">
                                            Groom Photo
                                        </label>

                                        {/* Mode Toggle */}
                                        <div className="mt-2 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setGroomPhotoMode("url")}
                                                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${groomPhotoMode === "url"
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                                                    }`}
                                            >
                                                URL
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setGroomPhotoMode("upload")}
                                                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${groomPhotoMode === "upload"
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                                                    }`}
                                            >
                                                Upload
                                            </button>
                                        </div>

                                        {groomPhotoMode === "url" ? (
                                            <input
                                                type="url"
                                                value={formData.groomPhotoUrl}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, groomPhotoUrl: e.target.value })
                                                }
                                                className="mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500"
                                                placeholder="https://..."
                                            />
                                        ) : (
                                            <div className="mt-2">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) setGroomPhotoFile(file);
                                                    }}
                                                    className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white file:mr-3 file:rounded file:border-0 file:bg-emerald-600 file:px-3 file:py-1 file:text-xs file:text-white"
                                                />
                                                {groomPhotoFile && (
                                                    <p className="mt-1 text-xs text-emerald-400">
                                                        Selected: {groomPhotoFile.name}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Preview */}
                                        {formData.groomPhotoUrl && (
                                            <div className="mt-2 relative inline-block">
                                                <img
                                                    src={formData.groomPhotoUrl}
                                                    alt="Groom preview"
                                                    className="h-20 w-20 rounded-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (confirm("Remove groom photo?")) {
                                                            setFormData({ ...formData, groomPhotoUrl: "" });
                                                            setGroomPhotoFile(null);
                                                        }
                                                    }}
                                                    className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
                                                    title="Remove photo"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bride Photo */}
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300">
                                            Bride Photo
                                        </label>

                                        {/* Mode Toggle */}
                                        <div className="mt-2 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setBridePhotoMode("url")}
                                                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${bridePhotoMode === "url"
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                                                    }`}
                                            >
                                                URL
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setBridePhotoMode("upload")}
                                                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${bridePhotoMode === "upload"
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                                                    }`}
                                            >
                                                Upload
                                            </button>
                                        </div>

                                        {bridePhotoMode === "url" ? (
                                            <input
                                                type="url"
                                                value={formData.bridePhotoUrl}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, bridePhotoUrl: e.target.value })
                                                }
                                                className="mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500"
                                                placeholder="https://..."
                                            />
                                        ) : (
                                            <div className="mt-2">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) setBridePhotoFile(file);
                                                    }}
                                                    className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white file:mr-3 file:rounded file:border-0 file:bg-emerald-600 file:px-3 file:py-1 file:text-xs file:text-white"
                                                />
                                                {bridePhotoFile && (
                                                    <p className="mt-1 text-xs text-emerald-400">
                                                        Selected: {bridePhotoFile.name}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Preview */}
                                        {formData.bridePhotoUrl && (
                                            <div className="mt-2 relative inline-block">
                                                <img
                                                    src={formData.bridePhotoUrl}
                                                    alt="Bride preview"
                                                    className="h-20 w-20 rounded-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (confirm("Remove bride photo?")) {
                                                            setFormData({ ...formData, bridePhotoUrl: "" });
                                                            setBridePhotoFile(null);
                                                        }
                                                    }}
                                                    className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
                                                    title="Remove photo"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300">
                                            Groom Bio
                                        </label>
                                        <textarea
                                            value={formData.groomBio}
                                            onChange={(e) =>
                                                setFormData({ ...formData, groomBio: e.target.value })
                                            }
                                            rows={3}
                                            className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                            placeholder="Short bio about the groom..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300">
                                            Bride Bio
                                        </label>
                                        <textarea
                                            value={formData.brideBio}
                                            onChange={(e) =>
                                                setFormData({ ...formData, brideBio: e.target.value })
                                            }
                                            rows={3}
                                            className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                            placeholder="Short bio about the bride..."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300">
                                            Groom Parents
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.groomParents}
                                            onChange={(e) =>
                                                setFormData({ ...formData, groomParents: e.target.value })
                                            }
                                            className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                            placeholder="Mr. & Mrs. John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300">
                                            Bride Parents
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.brideParents}
                                            onChange={(e) =>
                                                setFormData({ ...formData, brideParents: e.target.value })
                                            }
                                            className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                            placeholder="Mr. & Mrs. Jane Smith"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300">
                                            Groom Handle (@username)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.groomHandle}
                                            onChange={(e) =>
                                                setFormData({ ...formData, groomHandle: e.target.value })
                                            }
                                            className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                            placeholder="@groom_handle"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300">
                                            Bride Handle (@username)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.brideHandle}
                                            onChange={(e) =>
                                                setFormData({ ...formData, brideHandle: e.target.value })
                                            }
                                            className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                            placeholder="@bride_handle"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300">
                                            Groom Location
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.groomLocation}
                                            onChange={(e) =>
                                                setFormData({ ...formData, groomLocation: e.target.value })
                                            }
                                            className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                            placeholder="City, Province"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300">
                                            Bride Location
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.brideLocation}
                                            onChange={(e) =>
                                                setFormData({ ...formData, brideLocation: e.target.value })
                                            }
                                            className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                            placeholder="City, Province"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Opening Quote Section */}
                        <div className="rounded-2xl bg-neutral-900 p-6 shadow">
                            <h2 className="mb-4 text-lg font-semibold text-white">Opening Quote (Optional)</h2>
                            <p className="mb-4 text-sm text-neutral-400">
                                Tambahkan ayat atau quote pembuka untuk undangan Anda
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300">
                                        Quote Text
                                    </label>
                                    <textarea
                                        value={formData.openingQuote}
                                        onChange={(e) =>
                                            setFormData({ ...formData, openingQuote: e.target.value })
                                        }
                                        rows={3}
                                        className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                        placeholder='e.g., "Dan di antara tanda-tanda (kebesaran)-Nya ialah..."'
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300">
                                        Quote Author/Source
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.openingQuoteAuthor}
                                        onChange={(e) =>
                                            setFormData({ ...formData, openingQuoteAuthor: e.target.value })
                                        }
                                        className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                        placeholder="e.g., QS. Ar-Rum: 21"
                                    />
                                </div>
                            </div>
                        </div>


                        {/* Actions */}
                        <div className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                            <Link
                                href="/admin"
                                className="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={saving || uploading}
                                className="w-full rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {uploading ? "Uploading..." : saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

