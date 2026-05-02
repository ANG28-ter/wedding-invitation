"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";
import InvitationPageShell from "@/components/admin/InvitationPageShell";
import { Trash2, Download, Users, UserCheck, UserX, HelpCircle, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";

type RsvpEntry = {
    id: string;
    guestName: string;
    status: string;
    pax: number;
    message: string | null;
    createdAt: string;
};

type PageProps = { params: Promise<{ id: string }> };

export default function RsvpManagementPage({ params }: PageProps) {
    const router = useRouter();
    const [invitationId, setInvitationId] = useState<string>("");
    const [rsvps, setRsvps] = useState<RsvpEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const toast = useToast();
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.ceil(rsvps.length / ITEMS_PER_PAGE);
    const currentRsvps = rsvps.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const hadirCount = rsvps.filter((r) => r.status === "HADIR").length;
    const tidakCount = rsvps.filter((r) => r.status === "TIDAK").length;
    const raguCount = rsvps.filter((r) => r.status === "RAGU").length;
    const totalPax = rsvps.filter((r) => r.status === "HADIR").reduce((s, r) => s + r.pax, 0);

    useEffect(() => {
        params.then((p) => { setInvitationId(p.id); fetchRsvps(p.id); });
    }, [params]);

    async function fetchRsvps(id: string) {
        try {
            const res = await fetch(`/api/invitations/${id}/rsvp`);
            if (!res.ok) throw new Error("Failed to fetch RSVPs");
            const data = await res.json();
            setRsvps(data.data || []);
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    }

    async function handleDelete(rsvpId: string) {
        setDeleteConfirm(null);
        try {
            await fetch(`/api/invitations/${invitationId}/rsvp/${rsvpId}`, { method: "DELETE" });
            await fetchRsvps(invitationId);
            toast.success("RSVP berhasil dihapus!");
        } catch (err: any) { setError(err.message); }
    }

    function exportToCSV() {
        const headers = ["Nama Tamu", "Status", "Jumlah Tamu", "Pesan", "Tanggal"];
        const rows = rsvps.map((r) => [
            r.guestName, r.status, r.pax.toString(), r.message || "-",
            new Date(r.createdAt).toLocaleDateString("id-ID"),
        ]);
        const csv = [headers.join(","), ...rows.map((row) => row.map((c) => `"${c}"`).join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `rsvp-${invitationId}-${Date.now()}.csv`;
        link.click();
        toast.success("Data RSVP berhasil diexport!");
    }

    const statusConfig: Record<string, { label: string; cls: string }> = {
        HADIR: { label: "Hadir", cls: "bg-emerald-500/15 text-emerald-500" },
        TIDAK: { label: "Tidak Hadir", cls: "bg-red-500/15 text-red-500" },
        RAGU: { label: "Ragu-ragu", cls: "bg-yellow-500/15 text-yellow-500" },
    };

    if (loading) return (
        <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[rgb(var(--color-primary))] border-t-transparent"></div>
        </div>
    );

    return (
        <>
            <ConfirmModal isOpen={deleteConfirm !== null} title="Hapus RSVP"
                message="Yakin ingin menghapus RSVP ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus" cancelText="Batal"
                onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
                onCancel={() => setDeleteConfirm(null)} variant="danger" />
            <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

            <InvitationPageShell invitationId={invitationId} activePage="rsvp"
                title="RSVP" subtitle="Lihat dan kelola konfirmasi kehadiran tamu undangan." error={error}
                headerAction={
                    <button onClick={exportToCSV} disabled={rsvps.length === 0}
                        className="admin-btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </button>
                }>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="admin-card text-center py-4">
                        <Users className="h-5 w-5 mx-auto mb-2 opacity-50" />
                        <p className="text-2xl font-bold">{rsvps.length}</p>
                        <p className="text-xs opacity-50 mt-1">Total Respons</p>
                    </div>
                    <div className="admin-card text-center py-4">
                        <UserCheck className="h-5 w-5 mx-auto mb-2 text-emerald-500" />
                        <p className="text-2xl font-bold text-emerald-500">{hadirCount}</p>
                        <p className="text-xs opacity-50 mt-1">Hadir · {totalPax} org</p>
                    </div>
                    <div className="admin-card text-center py-4">
                        <UserX className="h-5 w-5 mx-auto mb-2 text-red-500" />
                        <p className="text-2xl font-bold text-red-500">{tidakCount}</p>
                        <p className="text-xs opacity-50 mt-1">Tidak Hadir</p>
                    </div>
                    <div className="admin-card text-center py-4">
                        <HelpCircle className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
                        <p className="text-2xl font-bold text-yellow-500">{raguCount}</p>
                        <p className="text-xs opacity-50 mt-1">Ragu-ragu</p>
                    </div>
                </div>

                {/* RSVP List */}
                <div className="admin-card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="admin-section-title mb-0">Daftar RSVP ({rsvps.length})</h2>
                        {totalPages > 1 && (
                            <span className="text-xs opacity-50">Hal. {currentPage}/{totalPages}</span>
                        )}
                    </div>

                    {currentRsvps.length === 0 ? (
                        <div className="py-12 text-center opacity-50">
                            <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
                            <p className="text-sm">Belum ada RSVP. Tamu akan mengisi melalui halaman undangan.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {currentRsvps.map((rsvp) => {
                                const sc = statusConfig[rsvp.status] ?? { label: rsvp.status, cls: "bg-current/10 opacity-70" };
                                return (
                                    <div key={rsvp.id} className="flex items-start justify-between rounded-xl border border-current/10 bg-current/5 p-4 hover:border-[rgb(var(--color-primary))]/20 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <span className="font-semibold text-sm">{rsvp.guestName}</span>
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sc.cls}`}>{sc.label}</span>
                                                {rsvp.status === "HADIR" && (
                                                    <span className="text-xs opacity-50">{rsvp.pax} orang</span>
                                                )}
                                            </div>
                                            {rsvp.message && (
                                                <p className="text-sm opacity-60 flex items-start gap-1.5 mt-1">
                                                    <MessageCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                                    {rsvp.message}
                                                </p>
                                            )}
                                            <p className="text-xs opacity-40 mt-1.5">
                                                {new Date(rsvp.createdAt).toLocaleDateString("id-ID", {
                                                    weekday: "long", year: "numeric", month: "long",
                                                    day: "numeric", hour: "2-digit", minute: "2-digit"
                                                })}
                                            </p>
                                        </div>
                                        <button onClick={() => setDeleteConfirm(rsvp.id)}
                                            className="ml-4 rounded-lg border border-red-500/30 p-2 text-red-500 hover:bg-red-500/10 transition-colors shrink-0" title="Hapus">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                                className="admin-btn-ghost px-3 py-2 disabled:opacity-30">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button key={page} onClick={() => setCurrentPage(page)}
                                        className={`h-9 w-9 rounded-xl text-sm font-medium transition-all ${currentPage === page
                                            ? "bg-[rgb(var(--color-primary))] text-[#1a1a1a]"
                                            : "border border-current/10 hover:border-current/30 opacity-60 hover:opacity-100"
                                        }`}>
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                className="admin-btn-ghost px-3 py-2 disabled:opacity-30">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </InvitationPageShell>
        </>
    );
}
