"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";
import AdminNavigationTabs from "@/components/AdminNavigationTabs";

type GuestbookEntry = {
    id: string;
    name: string;
    message: string;
    isApproved: boolean;
    createdAt: string;
};

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function GuestbookManagementPage({ params }: PageProps) {
    const router = useRouter();
    const [invitationId, setInvitationId] = useState<string>("");
    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");
    const toast = useToast();
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const filteredEntries = entries.filter((entry) => {
        if (filter === "approved") return entry.isApproved;
        if (filter === "pending") return !entry.isApproved;
        return true;
    });

    const approvedCount = entries.filter((e) => e.isApproved).length;
    const pendingCount = entries.filter((e) => !e.isApproved).length;

    useEffect(() => {
        params.then((p) => {
            setInvitationId(p.id);
            fetchEntries(p.id);
        });
    }, [params]);

    async function fetchEntries(id: string) {
        try {
            const res = await fetch(`/api/invitations/${id}/guestbook`);
            if (!res.ok) throw new Error("Failed to fetch guestbook");
            const data = await res.json();
            setEntries(data.data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleApprove(entryId: string) {
        try {
            const res = await fetch(`/api/invitations/${invitationId}/guestbook/${entryId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isApproved: true }),
            });

            if (!res.ok) throw new Error("Failed to approve entry");

            await fetchEntries(invitationId);
            toast.success("Pesan berhasil disetujui!");
        } catch (err: any) {
            setError(err.message);
        }
    }

    async function handleReject(entryId: string) {
        try {
            const res = await fetch(`/api/invitations/${invitationId}/guestbook/${entryId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isApproved: false }),
            });

            if (!res.ok) throw new Error("Failed to reject entry");

            await fetchEntries(invitationId);
            toast.success("Pesan berhasil ditolak!");
        } catch (err: any) {
            setError(err.message);
        }
    }

    async function handleDelete(entryId: string) {
        setDeleteConfirm(null);

        try {
            const res = await fetch(`/api/invitations/${invitationId}/guestbook/${entryId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete entry");

            await fetchEntries(invitationId);
            toast.success("Pesan berhasil dihapus!");
        } catch (err: any) {
            setError(err.message);
        }
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
                title="Hapus Pesan"
                message="Yakin ingin menghapus pesan ini? Tindakan ini tidak dapat dibatalkan."
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
                    <div className="mb-6">
                        <Link
                            href={`/admin/invitations/${invitationId}`}
                            className="text-sm text-neutral-400 hover:text-neutral-200"
                        >
                            ← Back to Invitation Details
                        </Link>
                        <h1 className="mt-2 text-2xl font-semibold text-white">Guestbook</h1>
                        <p className="text-sm text-neutral-400">Kelola ucapan dan doa dari tamu</p>
                    </div>

                    {/* Navigation Tabs */}
                    <AdminNavigationTabs invitationId={invitationId} activePage="guestbook" />

                    {error && (
                        <div className="mb-4 rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Stats & Filter */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex gap-4">
                            <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2">
                                <p className="text-xs text-neutral-400">Total</p>
                                <p className="text-lg font-semibold text-white">{entries.length}</p>
                            </div>
                            <div className="rounded-xl border border-emerald-900 bg-emerald-950/50 px-4 py-2">
                                <p className="text-xs text-emerald-400">Approved</p>
                                <p className="text-lg font-semibold text-emerald-300">{approvedCount}</p>
                            </div>
                            <div className="rounded-xl border border-yellow-900 bg-yellow-950/50 px-4 py-2">
                                <p className="text-xs text-yellow-400">Pending</p>
                                <p className="text-lg font-semibold text-yellow-300">{pendingCount}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter("all")}
                                className={`rounded-lg px-4 py-2 text-sm ${filter === "all"
                                    ? "bg-emerald-600 text-white"
                                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter("approved")}
                                className={`rounded-lg px-4 py-2 text-sm ${filter === "approved"
                                    ? "bg-emerald-600 text-white"
                                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                                    }`}
                            >
                                Approved
                            </button>
                            <button
                                onClick={() => setFilter("pending")}
                                className={`rounded-lg px-4 py-2 text-sm ${filter === "pending"
                                    ? "bg-emerald-600 text-white"
                                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                                    }`}
                            >
                                Pending
                            </button>
                        </div>
                    </div>

                    {/* Guestbook List */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                        <h2 className="mb-4 text-lg font-semibold text-white">
                            Pesan ({filteredEntries.length})
                        </h2>

                        {filteredEntries.length === 0 ? (
                            <p className="py-8 text-center text-sm text-neutral-400">
                                {filter === "all"
                                    ? "Belum ada pesan. Tamu akan menulis melalui halaman undangan."
                                    : `Tidak ada pesan ${filter === "approved" ? "yang disetujui" : "pending"}.`}
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {filteredEntries.map((entry) => (
                                    <div
                                        key={entry.id}
                                        className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-medium text-white">{entry.name}</h3>
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-xs font-medium ${entry.isApproved
                                                            ? "bg-emerald-950 text-emerald-400"
                                                            : "bg-yellow-950 text-yellow-400"
                                                            }`}
                                                    >
                                                        {entry.isApproved ? "Approved" : "Pending"}
                                                    </span>
                                                </div>
                                                <p className="mt-2 text-sm text-neutral-300">{entry.message}</p>
                                                <p className="mt-1 text-xs text-neutral-500">
                                                    {new Date(entry.createdAt).toLocaleDateString("id-ID", {
                                                        weekday: "long",
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>

                                            <div className="ml-4 flex gap-2">
                                                {!entry.isApproved && (
                                                    <button
                                                        onClick={() => handleApprove(entry.id)}
                                                        className="rounded-lg border border-emerald-900 bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-500"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                {entry.isApproved && (
                                                    <button
                                                        onClick={() => handleReject(entry.id)}
                                                        className="rounded-lg border border-yellow-900 bg-yellow-600 px-4 py-2 text-sm text-white hover:bg-yellow-500"
                                                    >
                                                        Reject
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setDeleteConfirm(entry.id)}
                                                    className="rounded-lg border border-red-900 bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
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
