"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";
import AdminNavigationTabs from "@/components/AdminNavigationTabs";

type RsvpEntry = {
    id: string;
    guestName: string;
    status: string;
    pax: number;
    message: string | null;
    createdAt: string;
};

type PageProps = {
    params: Promise<{ id: string }>;
};

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

    // Pagination
    const totalPages = Math.ceil(rsvps.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentRsvps = rsvps.slice(startIndex, endIndex);

    // Stats
    const hadirCount = rsvps.filter((r) => r.status === "HADIR").length;
    const tidakCount = rsvps.filter((r) => r.status === "TIDAK").length;
    const raguCount = rsvps.filter((r) => r.status === "RAGU").length;
    const totalPax = rsvps
        .filter((r) => r.status === "HADIR")
        .reduce((sum, r) => sum + r.pax, 0);

    useEffect(() => {
        params.then((p) => {
            setInvitationId(p.id);
            fetchRsvps(p.id);
        });
    }, [params]);

    async function fetchRsvps(id: string) {
        try {
            const res = await fetch(`/api/invitations/${id}/rsvp`);
            if (!res.ok) throw new Error("Failed to fetch RSVPs");
            const data = await res.json();
            setRsvps(data.data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(rsvpId: string) {
        setDeleteConfirm(null);

        try {
            const res = await fetch(`/api/invitations/${invitationId}/rsvp/${rsvpId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete RSVP");

            await fetchRsvps(invitationId);
            toast.success("RSVP berhasil dihapus!");
        } catch (err: any) {
            setError(err.message);
        }
    }

    function exportToCSV() {
        // Create CSV content
        const headers = ["Nama Tamu", "Status", "Jumlah Tamu", "Pesan", "Tanggal"];
        const rows = rsvps.map((rsvp) => [
            rsvp.guestName,
            rsvp.status,
            rsvp.pax.toString(),
            rsvp.message || "-",
            new Date(rsvp.createdAt).toLocaleDateString("id-ID"),
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ].join("\n");

        // Create download link
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `rsvp-${invitationId}-${Date.now()}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Data RSVP berhasil diexport!");
    }


    if (loading) {
        return (
            <div className="min-h-screen p-6">
                <div className="mx-auto max-w-6xl">
                    <p className="text-center text-neutral-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <ConfirmModal
                isOpen={deleteConfirm !== null}
                title="Hapus RSVP"
                message="Yakin ingin menghapus RSVP ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus"
                cancelText="Batal"
                onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
                onCancel={() => setDeleteConfirm(null)}
                variant="danger"
            />
            <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
            <div className="min-h-screen p-6">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-6 flex items-end justify-between">
                        <div>
                            <Link
                                href={`/admin/invitations/${invitationId}`}
                                className="text-sm text-neutral-400 hover:text-neutral-200"
                            >
                                ← Back to Invitation Details
                            </Link>
                            <h1 className="mt-2 text-2xl font-semibold text-white">RSVP Responses</h1>
                            <p className="text-sm text-neutral-400">Lihat dan kelola konfirmasi kehadiran tamu</p>
                        </div>
                        <button
                            onClick={exportToCSV}
                            disabled={rsvps.length === 0}
                            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export CSV
                        </button>
                    </div>

                    {/* Navigation Tabs */}
                    <AdminNavigationTabs invitationId={invitationId} activePage="rsvp" />

                    {error && (
                        <div className="mb-4 rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="mb-6 grid grid-cols-4 gap-4">
                        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                            <p className="text-sm text-neutral-400">Total Responses</p>
                            <p className="mt-1 text-2xl font-semibold text-white">{rsvps.length}</p>
                        </div>
                        <div className="rounded-xl border border-emerald-900 bg-emerald-950/50 p-4">
                            <p className="text-sm text-emerald-400">Hadir</p>
                            <p className="mt-1 text-2xl font-semibold text-emerald-300">{hadirCount}</p>
                            <p className="text-xs text-emerald-500">{totalPax} orang</p>
                        </div>
                        <div className="rounded-xl border border-red-900 bg-red-950/50 p-4">
                            <p className="text-sm text-red-400">Tidak Hadir</p>
                            <p className="mt-1 text-2xl font-semibold text-red-300">{tidakCount}</p>
                        </div>
                        <div className="rounded-xl border border-yellow-900 bg-yellow-950/50 p-4">
                            <p className="text-sm text-yellow-400">Ragu-ragu</p>
                            <p className="mt-1 text-2xl font-semibold text-yellow-300">{raguCount}</p>
                        </div>
                    </div>

                    {/* RSVP List */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">
                                Daftar RSVP ({rsvps.length})
                            </h2>
                            {totalPages > 1 && (
                                <p className="text-sm text-neutral-400">
                                    Halaman {currentPage} dari {totalPages}
                                </p>
                            )}
                        </div>

                        {currentRsvps.length === 0 ? (
                            <p className="py-8 text-center text-sm text-neutral-400">
                                {rsvps.length === 0
                                    ? "Belum ada RSVP. Tamu akan mengisi melalui halaman undangan."
                                    : "Tidak ada RSVP di halaman ini."}
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {currentRsvps.map((rsvp) => (
                                    <div
                                        key={rsvp.id}
                                        className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-medium text-white">{rsvp.guestName}</h3>
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-xs font-medium ${rsvp.status === "HADIR"
                                                            ? "bg-emerald-950 text-emerald-400"
                                                            : rsvp.status === "TIDAK"
                                                                ? "bg-red-950 text-red-400"
                                                                : "bg-yellow-950 text-yellow-400"
                                                            }`}
                                                    >
                                                        {rsvp.status}
                                                    </span>
                                                    {rsvp.status === "HADIR" && (
                                                        <span className="text-xs text-neutral-500">
                                                            {rsvp.pax} orang
                                                        </span>
                                                    )}
                                                </div>
                                                {rsvp.message && (
                                                    <p className="mt-2 text-sm text-neutral-400">
                                                        💬 {rsvp.message}
                                                    </p>
                                                )}
                                                <p className="mt-1 text-xs text-neutral-500">
                                                    {new Date(rsvp.createdAt).toLocaleDateString("id-ID", {
                                                        weekday: "long",
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => setDeleteConfirm(rsvp.id)}
                                                className="ml-4 rounded-lg border border-red-900 bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-white hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ← Previous
                                </button>

                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`h-10 w-10 rounded-lg text-sm font-medium ${currentPage === page
                                                ? "bg-emerald-600 text-white"
                                                : "border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-white hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
