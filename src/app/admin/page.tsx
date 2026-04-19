"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ConfirmModal";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";

type Invitation = {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  updatedAt: Date;
};

export default function AdminDashboardPage() {
  const [items, setItems] = useState<Invitation[]>([]);
  const [filteredItems, setFilteredItems] = useState<Invitation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    fetchInvitations();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = items.filter(
        (item) =>
          item.groomName.toLowerCase().includes(query) ||
          item.brideName.toLowerCase().includes(query) ||
          item.slug.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  async function fetchInvitations() {
    try {
      const res = await fetch("/api/invitations");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      // Handle both array and object response formats
      const invitationsList = Array.isArray(data) ? data : (data.data || []);

      setItems(invitationsList);
      setFilteredItems(invitationsList);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      setItems([]);
      setFilteredItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(invitationId: string) {
    setDeleteConfirm(null);

    try {
      const res = await fetch(`/api/invitations/${invitationId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete invitation");

      toast.success("Undangan berhasil dihapus!");
      await fetchInvitations(); // Refresh list
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus undangan");
    }
  }

  const monthAgoCount = items.filter((i) => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return new Date(i.updatedAt) > monthAgo;
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Hapus Undangan"
        message="Yakin ingin menghapus undangan ini? Semua data terkait (events, RSVP, guestbook, media, social links) akan ikut terhapus. Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
        variant="danger"
      />
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Dashboard Admin</h1>
              <p className="mt-1 text-sm text-neutral-400">Kelola undangan pernikahan Anda</p>
            </div>

            <form action="/api/admin/logout" method="post">
              <button className="rounded-xl bg-neutral-800 px-4 py-2 text-sm text-white transition hover:bg-neutral-700">
                Logout
              </button>
            </form>
          </div>

          {/* Stats Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <p className="text-sm text-neutral-400">Total Undangan</p>
              <p className="mt-2 text-3xl font-semibold text-white">{items.length}</p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <p className="text-sm text-neutral-400">Aktif</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-400">{items.length}</p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <p className="text-sm text-neutral-400">Bulan Ini</p>
              <p className="mt-2 text-3xl font-semibold text-blue-400">{monthAgoCount}</p>
            </div>
          </div>

          {/* Invitations List */}
          <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-white">Daftar Undangan</h2>

              <div className="flex gap-3">
                {/* Search Input */}
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama atau slug..."
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 pl-10 text-sm text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <svg
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <Link
                  href="/admin/new"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
                >
                  + Baru
                </Link>
              </div>
            </div>

            {/* Search Results Info */}
            {searchQuery && (
              <p className="mt-4 text-sm text-neutral-400">
                Menampilkan {filteredItems.length} dari {items.length} undangan
              </p>
            )}

            <div className="mt-6 space-y-2">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center">
                  {searchQuery ? (
                    <>
                      <p className="text-neutral-400">
                        Tidak ada hasil untuk "{searchQuery}"
                      </p>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="mt-4 text-sm text-emerald-400 hover:text-emerald-300"
                      >
                        Hapus filter
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-neutral-400">Belum ada undangan.</p>
                      <Link
                        href="/admin/new"
                        className="mt-4 inline-block text-sm text-emerald-400 hover:text-emerald-300"
                      >
                        Buat undangan pertama →
                      </Link>
                    </>
                  )}
                </div>
              ) : (
                filteredItems.map((it) => (
                  <div
                    key={it.id}
                    className="block rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 transition hover:border-neutral-700"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <Link
                        href={`/admin/invitations/${it.id}`}
                        className="flex-1 hover:opacity-80"
                      >
                        <div>
                          <p className="font-medium text-white">
                            {it.groomName} & {it.brideName}
                          </p>
                          <p className="mt-1 text-sm text-neutral-400">/{it.slug}</p>
                        </div>
                      </Link>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs text-neutral-500">
                            {new Date(it.updatedAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <span className="mt-1 inline-block text-xs text-emerald-400">
                            Edit →
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setDeleteConfirm(it.id);
                          }}
                          className="rounded-lg border border-red-900 bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
