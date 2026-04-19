"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";
import AdminNavigationTabs from "@/components/AdminNavigationTabs";

type Event = {
    id: string;
    type: string;
    date: string;
    startTime: string | null;
    endDate: string | null;
    endTime: string | null;
    venueName: string;
    address: string;
    mapsUrl: string | null;
    order: number;
};

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function EventsManagementPage({ params }: PageProps) {
    const router = useRouter();
    const [invitationId, setInvitationId] = useState<string>("");
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    // Form state
    const [type, setType] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [venueName, setVenueName] = useState("");
    const [address, setAddress] = useState("");
    const [mapsUrl, setMapsUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        params.then((p) => {
            setInvitationId(p.id);
            fetchEvents(p.id);
        });
    }, [params]);

    async function fetchEvents(id: string) {
        try {
            const res = await fetch(`/api/invitations/${id}/events`);
            if (!res.ok) throw new Error("Failed to fetch events");
            const data = await res.json();
            setEvents(data.data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddEvent(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch(`/api/invitations/${invitationId}/events`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type,
                    date,
                    startTime: startTime || null,
                    endTime: endTime || null,
                    venueName,
                    address,
                    mapsUrl: mapsUrl || null,
                    order: events.length,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to add event");
            }

            // Reset form
            setType("");
            setDate("");
            setStartTime("");
            setEndTime("");
            setVenueName("");
            setAddress("");
            setMapsUrl("");

            // Refresh list
            await fetchEvents(invitationId);

            toast.success("Acara berhasil ditambahkan!");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(eventId: string) {
        setDeleteConfirm(null);

        try {
            const res = await fetch(`/api/invitations/${invitationId}/events/${eventId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete event");

            // Refresh list
            await fetchEvents(invitationId);

            toast.success("Acara berhasil dihapus!");
        } catch (err: any) {
            setError(err.message);
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
                title="Hapus Acara"
                message="Yakin ingin menghapus acara ini? Tindakan ini tidak dapat dibatalkan."
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
                        <h1 className="mt-2 text-2xl font-semibold text-white">Kelola Acara</h1>
                        <p className="text-sm text-neutral-400">Tambah dan kelola acara pernikahan</p>
                    </div>

                    {/* Navigation Tabs */}
                    <AdminNavigationTabs invitationId={invitationId} activePage="events" />

                    {error && (
                        <div className="mb-4 rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Add New Event Form */}
                    <div className="mb-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                        <h2 className="mb-4 text-lg font-semibold text-white">Tambah Acara Baru</h2>

                        <form onSubmit={handleAddEvent} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300">
                                        Jenis Acara *
                                    </label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        required
                                        className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
                                    >
                                        <option value="">Pilih Jenis Acara</option>
                                        <option value="AKAD">Akad Nikah</option>
                                        <option value="RESEPSI">Resepsi</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-300">
                                        Tanggal *
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                        className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300">
                                        Jam Mulai (Opsional)
                                    </label>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-300">
                                        Jam Selesai (Opsional)
                                    </label>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300">
                                    Nama Tempat *
                                </label>
                                <input
                                    type="text"
                                    value={venueName}
                                    onChange={(e) => setVenueName(e.target.value)}
                                    required
                                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                    placeholder="Gedung Serbaguna, Masjid, dll"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300">
                                    Alamat Lengkap *
                                </label>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                    rows={2}
                                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                    placeholder="Jl. Contoh No. 123, Jakarta"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300">
                                    Link Google Maps (Opsional)
                                </label>
                                <input
                                    type="url"
                                    value={mapsUrl}
                                    onChange={(e) => setMapsUrl(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
                                    placeholder="https://maps.google.com/..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-lg bg-emerald-600 px-6 py-2 text-sm text-white hover:bg-emerald-500 disabled:opacity-50"
                            >
                                {submitting ? "Menambahkan..." : "+ Tambah Acara"}
                            </button>
                        </form>
                    </div>

                    {/* Events List */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                        <h2 className="mb-4 text-lg font-semibold text-white">
                            Daftar Acara ({events.length})
                        </h2>

                        {events.length === 0 ? (
                            <p className="py-8 text-center text-sm text-neutral-400">
                                Belum ada acara. Tambahkan acara pertama di atas.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {events.map((event) => (
                                    <div
                                        key={event.id}
                                        className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-white">
                                                    {event.type === "AKAD" ? "Akad Nikah" : "Resepsi"}
                                                </h3>
                                                <p className="mt-1 text-sm text-neutral-400">
                                                    📅 {new Date(event.date).toLocaleDateString("id-ID", {
                                                        weekday: "long",
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </p>
                                                {event.startTime && (
                                                    <p className="mt-1 text-sm text-neutral-400">
                                                        🕐 {event.startTime}
                                                        {event.endTime && ` - ${event.endTime}`}
                                                    </p>
                                                )}
                                                <p className="mt-1 text-sm text-neutral-400">
                                                    📍 {event.venueName}
                                                </p>
                                                <p className="mt-1 text-xs text-neutral-500">
                                                    {event.address}
                                                </p>
                                                {event.mapsUrl && (
                                                    <a
                                                        href={event.mapsUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-2 inline-block text-xs text-emerald-400 hover:text-emerald-300"
                                                    >
                                                        Lihat di Maps →
                                                    </a>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => setDeleteConfirm(event.id)}
                                                className="ml-4 rounded-lg border border-red-900 bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
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
