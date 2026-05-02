"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import { Search, Plus, Trash2, Edit } from "lucide-react";

type Invitation = {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  updatedAt: Date;
};

export default function AdminInvitationsPage() {
  const [items, setItems] = useState<Invitation[]>([]);
  const [filteredItems, setFilteredItems] = useState<Invitation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
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
        title="Hapus Undangan"
        message="Yakin ingin menghapus undangan ini? Semua data terkait (events, RSVP, guestbook, media, social links) akan ikut terhapus. Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
        variant="danger"
      />
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Data Undangan</h1>
          <p className="opacity-70 text-sm mt-1">Kelola semua undangan klien Anda di sini.</p>
        </div>
        
        <Link
          href="/admin/new"
          className="inline-flex items-center justify-center rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[rgb(var(--color-secondary))] transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Buat Undangan
        </Link>
      </div>

      <div className="rounded-2xl border border-current/10 bg-current/5 p-6 backdrop-blur-sm">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau slug..."
              className="w-full rounded-xl border border-current/10 bg-transparent py-2.5 pl-10 pr-4 outline-none focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))] transition-all"
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-xs opacity-60">
              Menampilkan {filteredItems.length} hasil
            </p>
          )}
        </div>

        {/* List Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center opacity-60">
            {searchQuery ? "Tidak ada undangan yang cocok dengan pencarian." : "Belum ada undangan yang dibuat."}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((it) => (
              <div
                key={it.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-current/10 bg-current/5 p-5 transition-all hover:border-[rgb(var(--color-primary))]/50 hover:bg-current/10 hover:shadow-lg hover:shadow-[rgb(var(--color-primary))]/5"
              >
                <div className="mb-4">
                  <h3 className="font-heading text-lg font-bold leading-tight line-clamp-1">
                    {it.groomName} & {it.brideName}
                  </h3>
                  <Link 
                    href={`/${it.slug}`} 
                    target="_blank" 
                    className="text-xs opacity-60 hover:text-[rgb(var(--color-primary))] hover:opacity-100 transition-colors mt-1 inline-block"
                  >
                    /{it.slug} ↗
                  </Link>
                </div>
                
                <div className="mt-auto flex items-end justify-between pt-4 border-t border-current/10">
                  <p className="text-[10px] uppercase tracking-wider opacity-50">
                    {new Date(it.updatedAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeleteConfirm(it.id)}
                      className="rounded-lg bg-red-500/10 p-2 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Link
                      href={`/admin/invitations/${it.id}`}
                      className="rounded-lg bg-[rgb(var(--color-primary))]/10 p-2 text-[rgb(var(--color-primary))] transition-colors hover:bg-[rgb(var(--color-primary))] hover:text-white"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
