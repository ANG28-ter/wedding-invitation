"use client";

import { useState } from "react";
import { toggleTestimonialApproval, deleteTestimonial } from "@/app/actions/testimonial";
import { Check, X, Trash2, Star } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  message: string;
  rating: number;
  isApproved: boolean;
  createdAt: Date;
  invitation?: { slug: string } | null;
};

export default function TestimonialClient({ initialData }: { initialData: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialData);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const toast = useToast();

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setIsProcessing(id);
    const result = await toggleTestimonialApproval(id, !currentStatus);
    
    if (result.success && result.testimonial) {
      setTestimonials(testimonials.map(t => t.id === id ? { ...t, isApproved: !currentStatus } : t));
      toast.success(currentStatus ? "Testimoni disembunyikan" : "Testimoni ditampilkan");
    } else {
      toast.error(result.error || "Gagal mengubah status");
    }
    setIsProcessing(null);
  };

  const handleDelete = async (id: string) => {
    setDeleteConfirm(null);
    setIsProcessing(id);
    
    const result = await deleteTestimonial(id);
    
    if (result.success) {
      setTestimonials(testimonials.filter(t => t.id !== id));
      toast.success("Testimoni berhasil dihapus");
    } else {
      toast.error(result.error || "Gagal menghapus testimoni");
    }
    setIsProcessing(null);
  };

  return (
    <>
      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Hapus Testimoni"
        message="Yakin ingin menghapus testimoni ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
        variant="danger"
      />
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading">Kelola Testimoni</h1>
        <p className="opacity-70 text-sm mt-1">Setujui testimoni untuk menampilkannya di halaman portofolio.</p>
      </div>

      <div className="space-y-4">
        {testimonials.length === 0 ? (
          <div className="rounded-2xl border border-current/10 bg-current/5 p-12 text-center backdrop-blur-sm opacity-60">
            Belum ada testimoni yang masuk.
          </div>
        ) : (
          testimonials.map((t) => (
            <div 
              key={t.id} 
              className={`rounded-2xl border p-6 transition-all backdrop-blur-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between
                ${t.isApproved ? "border-emerald-500/30 bg-emerald-500/5" : "border-current/10 bg-current/5"}
                ${isProcessing === t.id ? "opacity-50 pointer-events-none" : ""}
              `}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-heading text-lg font-bold">{t.name}</h3>
                  <div className="flex bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded text-xs items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{t.rating}</span>
                  </div>
                  {t.isApproved && (
                    <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs px-2 py-0.5 rounded font-medium">Ditampilkan</span>
                  )}
                  {!t.isApproved && (
                    <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs px-2 py-0.5 rounded font-medium">Menunggu</span>
                  )}
                </div>
                <p className="opacity-80 italic text-sm mb-3">"{t.message}"</p>
                <div className="text-xs opacity-50 flex flex-wrap gap-3">
                  <span>{new Date(t.createdAt).toLocaleDateString("id-ID", { dateStyle: "long" })}</span>
                  {t.invitation?.slug && <span>Link: /{t.invitation.slug}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-current/10">
                <button
                  onClick={() => handleToggle(t.id, t.isApproved)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors border
                    ${t.isApproved 
                      ? "border-current/20 hover:bg-current/10" 
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                    }
                  `}
                >
                  {t.isApproved ? (
                    <><X className="w-4 h-4" /> Sembunyikan</>
                  ) : (
                    <><Check className="w-4 h-4" /> Tampilkan</>
                  )}
                </button>
                <button
                  onClick={() => setDeleteConfirm(t.id)}
                  className="flex items-center justify-center p-2 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
