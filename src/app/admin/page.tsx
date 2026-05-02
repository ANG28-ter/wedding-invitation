"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, Calendar, Activity, ArrowRight } from "lucide-react";

type Invitation = {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  updatedAt: Date;
  createdAt: Date;
};

export default function AdminDashboardPage() {
  const [items, setItems] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  async function fetchInvitations() {
    try {
      const res = await fetch("/api/invitations");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const invitationsList = Array.isArray(data) ? data : (data.data || []);
      setItems(invitationsList);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  const monthAgoCount = items.filter((i) => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return new Date(i.createdAt) > monthAgo;
  }).length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[rgb(var(--color-primary))] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading">Overview Dashboard</h1>
        <p className="opacity-70 text-sm mt-1">Selamat datang kembali! Berikut ringkasan aplikasi Anda.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-current/10 bg-[rgb(var(--color-primary))]/5 p-6 backdrop-blur-sm relative overflow-hidden group">
          <Users className="absolute right-4 top-4 h-12 w-12 opacity-10 group-hover:scale-110 transition-transform text-[rgb(var(--color-primary))]" />
          <p className="text-sm opacity-70 font-medium">Total Undangan</p>
          <p className="mt-2 text-4xl font-bold text-[rgb(var(--color-primary))]">{items.length}</p>
        </div>
        
        <div className="rounded-2xl border border-current/10 bg-emerald-500/5 p-6 backdrop-blur-sm relative overflow-hidden group">
          <Activity className="absolute right-4 top-4 h-12 w-12 opacity-10 group-hover:scale-110 transition-transform text-emerald-500" />
          <p className="text-sm opacity-70 font-medium">Aktif</p>
          <p className="mt-2 text-4xl font-bold text-emerald-500">{items.length}</p>
        </div>
        
        <div className="rounded-2xl border border-current/10 bg-blue-500/5 p-6 backdrop-blur-sm relative overflow-hidden group">
          <Calendar className="absolute right-4 top-4 h-12 w-12 opacity-10 group-hover:scale-110 transition-transform text-blue-500" />
          <p className="text-sm opacity-70 font-medium">Bulan Ini</p>
          <p className="mt-2 text-4xl font-bold text-blue-500">{monthAgoCount}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-current/10 bg-current/5 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold font-heading">Undangan Terbaru</h2>
          <Link href="/admin/invitations" className="text-sm text-[rgb(var(--color-primary))] hover:underline flex items-center">
            Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {items.slice(0, 5).map((it) => (
            <Link 
              key={it.id} 
              href={`/admin/invitations/${it.id}`}
              className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-current/10 hover:bg-current/5 transition-all"
            >
              <div>
                <p className="font-semibold">{it.groomName} & {it.brideName}</p>
                <p className="text-xs opacity-50 mt-1">/{it.slug}</p>
              </div>
              <div className="text-xs opacity-50 text-right uppercase tracking-wider">
                {new Date(it.updatedAt).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}
              </div>
            </Link>
          ))}
          
          {items.length === 0 && (
            <div className="text-center py-8 opacity-50 text-sm">
              Belum ada undangan yang dibuat.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
