"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";
import InvitationPageShell from "@/components/admin/InvitationPageShell";
import { Plus, Trash2, MapPin, Clock, Calendar } from "lucide-react";

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
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[rgb(var(--color-primary))] border-t-transparent"></div>
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

            <InvitationPageShell
                invitationId={invitationId}
                activePage="events"
                title="Kelola Acara"
                subtitle="Tambah dan kelola jadwal acara pernikahan."
                error={error}
            >
                {/* Add New Event Form */}
                <div className="admin-card">
                    <h2 className="admin-section-title">Tambah Acara Baru</h2>

                    <form onSubmit={handleAddEvent} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="admin-label">Jenis Acara *</label>
                                <select value={type} onChange={(e) => setType(e.target.value)} required className="admin-input">
                                    <option value="">Pilih Jenis Acara</option>
                                    <option value="AKAD">Akad Nikah</option>
                                    <option value="RESEPSI">Resepsi</option>
                                </select>
                            </div>
                            <div>
                                <label className="admin-label">Tanggal *</label>
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="admin-input" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="admin-label">Jam Mulai (Opsional)</label>
                                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="admin-input" />
                            </div>
                            <div>
                                <label className="admin-label">Jam Selesai (Opsional)</label>
                                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="admin-input" />
                            </div>
                        </div>

                        <div>
                            <label className="admin-label">Nama Tempat *</label>
                            <input type="text" value={venueName} onChange={(e) => setVenueName(e.target.value)} required className="admin-input" placeholder="Gedung Serbaguna, Masjid, dll" />
                        </div>

                        <div>
                            <label className="admin-label">Alamat Lengkap *</label>
                            <textarea value={address} onChange={(e) => setAddress(e.target.value)} required rows={2} className="admin-input" placeholder="Jl. Contoh No. 123, Jakarta" />
                        </div>

                        <div>
                            <label className="admin-label">Link Google Maps (Opsional)</label>
                            <input type="url" value={mapsUrl} onChange={(e) => setMapsUrl(e.target.value)} className="admin-input" placeholder="https://maps.google.com/..." />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button type="submit" disabled={submitting} className="admin-btn-primary">
                                <Plus className="h-4 w-4" />
                                {submitting ? "Menambahkan..." : "Tambah Acara"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Events List */}
                <div className="admin-card">
                    <h2 className="admin-section-title">Daftar Acara ({events.length})</h2>

                    {events.length === 0 ? (
                        <p className="py-8 text-center text-sm opacity-50">Belum ada acara. Tambahkan acara pertama di atas.</p>
                    ) : (
                        <div className="space-y-3">
                            {events.map((event) => (
                                <div key={event.id} className="group flex items-start justify-between rounded-xl border border-current/10 bg-current/5 p-4 hover:border-[rgb(var(--color-primary))]/30 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                                                event.type === "AKAD"
                                                    ? "bg-[rgb(var(--color-primary))]/15 text-[rgb(var(--color-primary))]"
                                                    : "bg-blue-500/15 text-blue-400"
                                            }`}>
                                                {event.type === "AKAD" ? "Akad Nikah" : "Resepsi"}
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-sm opacity-70">
                                            <p className="flex items-center gap-2">
                                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                                {new Date(event.date).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                                            </p>
                                            {event.startTime && (
                                                <p className="flex items-center gap-2">
                                                    <Clock className="h-3.5 w-3.5 shrink-0" />
                                                    {event.startTime}{event.endTime && ` – ${event.endTime}`} WIB
                                                </p>
                                            )}
                                            <p className="flex items-center gap-2">
                                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                <span className="font-medium opacity-100">{event.venueName}</span>
                                            </p>
                                            <p className="pl-5 text-xs opacity-60">{event.address}</p>
                                            {event.mapsUrl && (
                                                <a href={event.mapsUrl} target="_blank" rel="noopener noreferrer" className="pl-5 text-xs text-[rgb(var(--color-primary))] hover:underline">
                                                    Lihat di Google Maps ↗
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setDeleteConfirm(event.id)}
                                        className="ml-4 rounded-lg border border-red-500/30 p-2 text-red-500 hover:bg-red-500/10 transition-colors"
                                        title="Hapus"
                                    >
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
