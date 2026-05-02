"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";
import InvitationPageShell from "@/components/admin/InvitationPageShell";
import { Plus, Trash2, CreditCard, QrCode } from "lucide-react";

type GiftAccount = {
    id: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    qrCodeUrl: string | null;
    order: number;
    createdAt: string;
};

type PageProps = { params: Promise<{ id: string }> };

export default function GiftAccountsPage({ params }: PageProps) {
    const router = useRouter();
    const [invitationId, setInvitationId] = useState<string>("");
    const [giftAccounts, setGiftAccounts] = useState<GiftAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountHolder, setAccountHolder] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const toast = useToast();
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        params.then((p) => { setInvitationId(p.id); fetchGiftAccounts(p.id); });
    }, [params]);

    async function fetchGiftAccounts(id: string) {
        try {
            const res = await fetch(`/api/invitations/${id}/gifts`);
            if (!res.ok) throw new Error("Failed to fetch gift accounts");
            const data = await res.json();
            setGiftAccounts(data);
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    }

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result as string);
        reader.readAsDataURL(selectedFile);
    }

    async function handleAddAccount(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true); setError(null);
        try {
            let qrCodeUrl = null;
            if (file) {
                setUploading(true);
                const formData = new FormData();
                formData.append("file", file);
                const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
                if (!uploadRes.ok) throw new Error("Upload QR code failed");
                const uploadData = await uploadRes.json();
                qrCodeUrl = uploadData.data.url;
                setUploading(false);
            }
            const res = await fetch(`/api/invitations/${invitationId}/gifts`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bankName, accountNumber, accountHolder, qrCodeUrl, order: giftAccounts.length }),
            });
            if (!res.ok) throw new Error("Failed to add gift account");
            setBankName(""); setAccountNumber(""); setAccountHolder(""); setFile(null); setFilePreview(null);
            await fetchGiftAccounts(invitationId);
            toast.success("Rekening berhasil ditambahkan!");
        } catch (err: any) { setError(err.message); }
        finally { setSubmitting(false); setUploading(false); }
    }

    async function handleDelete(giftId: string) {
        setDeleteConfirm(null);
        try {
            const res = await fetch(`/api/invitations/${invitationId}/gifts/${giftId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete gift account");
            await fetchGiftAccounts(invitationId);
            toast.success("Rekening berhasil dihapus!");
        } catch (err: any) { setError(err.message); }
    }

    if (loading) return (
        <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[rgb(var(--color-primary))] border-t-transparent"></div>
        </div>
    );

    return (
        <>
            <ConfirmModal isOpen={deleteConfirm !== null} title="Hapus Rekening"
                message="Yakin ingin menghapus rekening ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus" cancelText="Batal"
                onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
                onCancel={() => setDeleteConfirm(null)} variant="danger" />
            <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

            <InvitationPageShell invitationId={invitationId} activePage="gifts"
                title="Amplop Digital" subtitle="Kelola rekening bank dan QRIS untuk hadiah digital." error={error}>

                {/* Add New Form */}
                <div className="admin-card">
                    <h2 className="admin-section-title">Tambah Rekening Baru</h2>
                    <form onSubmit={handleAddAccount} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="admin-label">Nama Bank / Dompet Digital *</label>
                                <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)}
                                    required className="admin-input" placeholder="BCA, Mandiri, Dana, GoPay..." maxLength={100} />
                            </div>
                            <div>
                                <label className="admin-label">Nomor Rekening *</label>
                                <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)}
                                    required className="admin-input" placeholder="1234567890" maxLength={50} />
                            </div>
                        </div>
                        <div>
                            <label className="admin-label">Atas Nama *</label>
                            <input type="text" value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)}
                                required className="admin-input" placeholder="Nama pemilik rekening" maxLength={100} />
                        </div>
                        <div>
                            <label className="admin-label">Upload QR Code (Opsional)</label>
                            <input type="file" accept="image/*" onChange={handleFileSelect}
                                className="admin-input cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[rgb(var(--color-primary))]/20 file:text-[rgb(var(--color-primary))] file:text-xs file:font-semibold" />
                            {filePreview && (
                                <div className="mt-3 inline-block rounded-xl border border-current/10 bg-current/5 p-2">
                                    <img src={filePreview} alt="QR Preview" className="h-24 w-24 object-contain" />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" disabled={submitting || uploading} className="admin-btn-primary">
                                <Plus className="h-4 w-4" />
                                {uploading ? "Upload QR..." : submitting ? "Menyimpan..." : "Tambah Rekening"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* List */}
                <div className="admin-card">
                    <h2 className="admin-section-title">Daftar Rekening ({giftAccounts.length})</h2>
                    {giftAccounts.length === 0 ? (
                        <div className="py-12 text-center opacity-50">
                            <CreditCard className="h-10 w-10 mx-auto mb-3 opacity-40" />
                            <p className="text-sm">Belum ada rekening. Tambahkan di atas.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {giftAccounts.map((account) => (
                                <div key={account.id} className="flex items-center justify-between rounded-xl border border-current/10 bg-current/5 p-4 hover:border-[rgb(var(--color-primary))]/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        {account.qrCodeUrl ? (
                                            <div className="h-14 w-14 shrink-0 rounded-xl bg-white p-1.5 shadow">
                                                <img src={account.qrCodeUrl} alt="QR" className="h-full w-full object-contain" />
                                            </div>
                                        ) : (
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[rgb(var(--color-primary))]/10">
                                                <QrCode className="h-6 w-6 text-[rgb(var(--color-primary))]" />
                                            </div>
                                        )}
                                        <div>
                                            <span className="inline-block mb-1 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-[rgb(var(--color-primary))]/15 text-[rgb(var(--color-primary))]">
                                                {account.bankName}
                                            </span>
                                            <p className="font-semibold text-sm">{account.accountNumber}</p>
                                            <p className="text-xs opacity-50">a/n {account.accountHolder}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setDeleteConfirm(account.id)}
                                        className="ml-4 rounded-lg border border-red-500/30 p-2 text-red-500 hover:bg-red-500/10 transition-colors" title="Hapus">
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
