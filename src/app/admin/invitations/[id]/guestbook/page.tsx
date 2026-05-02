"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";
import InvitationPageShell from "@/components/admin/InvitationPageShell";
import { CheckCircle2, XCircle, Trash2, MessageSquare, Users, Clock } from "lucide-react";

type GuestbookEntry = {
    id: string;
    name: string;
    message: string;
    isApproved: boolean;
    createdAt: string;
};

type PageProps = { params: Promise<{ id: string }> };

export default function GuestbookManagementPage({ params }: PageProps) {
    const router = useRouter();
    const [invitationId, setInvitationId] = useState<string>("");
    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");
    const toast = useToast();
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const filteredEntries = entries.filter((e) =>
        filter === "approved" ? e.isApproved : filter === "pending" ? !e.isApproved : true
    );
    const approvedCount = entries.filter((e) => e.isApproved).length;
    const pendingCount = entries.filter((e) => !e.isApproved).length;

    useEffect(() => {
        params.then((p) => { setInvitationId(p.id); fetchEntries(p.id); });
    }, [params]);

    async function fetchEntries(id: string) {
        try {
            const res = await fetch(`/api/invitations/${id}/guestbook`);
            if (!res.ok) throw new Error("Failed to fetch guestbook");
            const data = await res.json();
            setEntries(data.data || []);
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    }

    async function handleApprove(entryId: string) {
        try {
            await fetch(`/api/invitations/${invitationId}/guestbook/${entryId}`, {
                method: "PATCH", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isApproved: true }),
            });
            await fetchEntries(invitationId);
            toast.success("Pesan berhasil disetujui!");
        } catch (err: any) { setError(err.message); }
    }

    async function handleReject(entryId: string) {
        try {
            await fetch(`/api/invitations/${invitationId}/guestbook/${entryId}`, {
                method: "PATCH", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isApproved: false }),
            });
            await fetchEntries(invitationId);
            toast.success("Pesan berhasil ditolak!");
        } catch (err: any) { setError(err.message); }
    }

    async function handleDelete(entryId: string) {
        setDeleteConfirm(null);
        try {
            await fetch(`/api/invitations/${invitationId}/guestbook/${entryId}`, { method: "DELETE" });
            await fetchEntries(invitationId);
            toast.success("Pesan berhasil dihapus!");
        } catch (err: any) { setError(err.message); }
    }

    if (loading) return (
        <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[rgb(var(--color-primary))] border-t-transparent"></div>
        </div>
    );

    return (
        <>
            <ConfirmModal isOpen={deleteConfirm !== null} title="Hapus Pesan"
                message="Yakin ingin menghapus pesan ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus" cancelText="Batal"
                onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
                onCancel={() => setDeleteConfirm(null)} variant="danger" />
            <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

            <InvitationPageShell invitationId={invitationId} activePage="guestbook"
                title="Guestbook" subtitle="Kelola ucapan dan doa dari tamu undangan." error={error}>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="admin-card text-center py-4">
                        <Users className="h-5 w-5 mx-auto mb-2 opacity-50" />
                        <p className="text-2xl font-bold">{entries.length}</p>
                        <p className="text-xs opacity-50 mt-1">Total Pesan</p>
                    </div>
                    <div className="admin-card text-center py-4 border-emerald-500/20">
                        <CheckCircle2 className="h-5 w-5 mx-auto mb-2 text-emerald-500" />
                        <p className="text-2xl font-bold text-emerald-500">{approvedCount}</p>
                        <p className="text-xs opacity-50 mt-1">Disetujui</p>
                    </div>
                    <div className="admin-card text-center py-4 border-yellow-500/20">
                        <Clock className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
                        <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
                        <p className="text-xs opacity-50 mt-1">Menunggu</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                    {(["all", "approved", "pending"] as const).map((f) => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f
                                ? "bg-[rgb(var(--color-primary))] text-[#1a1a1a] shadow-md"
                                : "border border-current/10 opacity-60 hover:opacity-90"
                            }`}>
                            {f === "all" ? "Semua" : f === "approved" ? "Disetujui" : "Menunggu"}
                        </button>
                    ))}
                </div>

                {/* Guestbook List */}
                <div className="admin-card">
                    <h2 className="admin-section-title">Pesan ({filteredEntries.length})</h2>
                    {filteredEntries.length === 0 ? (
                        <div className="py-12 text-center opacity-50">
                            <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-40" />
                            <p className="text-sm">
                                {filter === "all" ? "Belum ada pesan." : `Tidak ada pesan ${filter === "approved" ? "yang disetujui" : "menunggu"}.`}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredEntries.map((entry) => (
                                <div key={entry.id} className="rounded-xl border border-current/10 bg-current/5 p-4 hover:border-[rgb(var(--color-primary))]/20 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className="font-semibold text-sm">{entry.name}</span>
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${entry.isApproved
                                                    ? "bg-emerald-500/15 text-emerald-500"
                                                    : "bg-yellow-500/15 text-yellow-500"
                                                }`}>
                                                    {entry.isApproved ? "Disetujui" : "Menunggu"}
                                                </span>
                                            </div>
                                            <p className="text-sm opacity-70 leading-relaxed">{entry.message}</p>
                                            <p className="mt-2 text-xs opacity-40">
                                                {new Date(entry.createdAt).toLocaleDateString("id-ID", {
                                                    weekday: "long", year: "numeric", month: "long",
                                                    day: "numeric", hour: "2-digit", minute: "2-digit"
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {!entry.isApproved ? (
                                                <button onClick={() => handleApprove(entry.id)}
                                                    className="rounded-lg border border-emerald-500/30 p-2 text-emerald-500 hover:bg-emerald-500/10 transition-colors" title="Setujui">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </button>
                                            ) : (
                                                <button onClick={() => handleReject(entry.id)}
                                                    className="rounded-lg border border-yellow-500/30 p-2 text-yellow-500 hover:bg-yellow-500/10 transition-colors" title="Tolak">
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button onClick={() => setDeleteConfirm(entry.id)}
                                                className="rounded-lg border border-red-500/30 p-2 text-red-500 hover:bg-red-500/10 transition-colors" title="Hapus">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
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
