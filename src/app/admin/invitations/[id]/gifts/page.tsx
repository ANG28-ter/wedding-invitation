"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";
import AdminNavigationTabs from "@/components/AdminNavigationTabs";

type GiftAccount = {
    id: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    qrCodeUrl: string | null;
    order: number;
    createdAt: string;
};

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function GiftAccountsPage({ params }: PageProps) {
    const router = useRouter();
    const [invitationId, setInvitationId] = useState<string>("");
    const [giftAccounts, setGiftAccounts] = useState<GiftAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
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
        params.then((p) => {
            setInvitationId(p.id);
            fetchGiftAccounts(p.id);
        });
    }, [params]);

    async function fetchGiftAccounts(id: string) {
        try {
            const res = await fetch(`/api/invitations/${id}/gifts`);
            if (!res.ok) throw new Error("Failed to fetch gift accounts");
            const data = await res.json();
            setGiftAccounts(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
            setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
    }

    async function handleAddAccount(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            let qrCodeUrl = null;

            // Upload QR code if file selected
            if (file) {
                setUploading(true);
                const formData = new FormData();
                formData.append("file", file);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!uploadRes.ok) {
                    const errorData = await uploadRes.json();
                    throw new Error(errorData.error || "Upload QR code failed");
                }

                const uploadData = await uploadRes.json();
                qrCodeUrl = uploadData.data.url;
                setUploading(false);
            }

            const res = await fetch(`/api/invitations/${invitationId}/gifts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bankName,
                    accountNumber,
                    accountHolder,
                    qrCodeUrl,
                    order: giftAccounts.length,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to add gift account");
            }

            // Reset form
            setBankName("");
            setAccountNumber("");
            setAccountHolder("");
            setFile(null);
            setFilePreview(null);

            // Refresh list
            await fetchGiftAccounts(invitationId);

            toast.success("Rekening berhasil ditambahkan!");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
            setUploading(false);
        }
    }

    async function handleDelete(giftId: string) {
        setDeleteConfirm(null);

        try {
            const res = await fetch(`/api/invitations/${invitationId}/gifts/${giftId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete gift account");

            // Refresh list
            await fetchGiftAccounts(invitationId);

            toast.success("Rekening berhasil dihapus!");
        } catch (err: any) {
            setError(err.message);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen p-6">
                <div className="mx-auto max-w-4xl">
                    <p className="text-center">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <ConfirmModal
                isOpen={deleteConfirm !== null}
                title="Hapus Rekening"
                message="Yakin ingin menghapus rekening ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus"
                cancelText="Batal"
                onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
                onCancel={() => setDeleteConfirm(null)}
                variant="danger"
            />
            <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
            <div className="min-h-screen p-6">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={`/admin/invitations/${invitationId}`}
                            className="text-sm text-neutral-400 hover:text-neutral-200"
                        >
                            ← Back to Invitation Details
                        </Link>
                        <h1 className="mt-2 text-2xl font-semibold text-white">Gift Accounts (Amplop Online)</h1>
                        <p className="text-sm text-neutral-400">Manage bank accounts and QR codes for digital gifts</p>
                    </div>

                    {/* Navigation Tabs */}
                    <AdminNavigationTabs invitationId={invitationId} activePage="gifts" />

                    {error && (
                        <div className="mb-4 rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Add New Form */}
                    <div className="mb-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                        <h2 className="mb-4 text-lg font-semibold text-white">Add New Account</h2>

                        <form onSubmit={handleAddAccount} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300">
                                        Bank / Wallet Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        required
                                        className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
                                        placeholder="e.g. BCA, Mandiri, Dana"
                                        maxLength={100}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-300">
                                        Account Number *
                                    </label>
                                    <input
                                        type="text"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                        required
                                        className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
                                        placeholder="e.g. 1234567890"
                                        maxLength={50}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300">
                                    Account Holder (Atas Nama) *
                                </label>
                                <input
                                    type="text"
                                    value={accountHolder}
                                    onChange={(e) => setAccountHolder(e.target.value)}
                                    required
                                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
                                    placeholder="e.g. Rizky Ananda Saputra"
                                    maxLength={100}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300">
                                    QR Code (Optional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
                                />
                                {filePreview && (
                                    <div className="mt-2 rounded-lg border border-neutral-700 p-2 w-32">
                                        <img src={filePreview} alt="QR Preview" className="w-full h-auto" />
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || uploading}
                                className="rounded-lg bg-emerald-600 px-6 py-2 text-sm text-white hover:bg-emerald-500 disabled:opacity-50"
                            >
                                {uploading ? "Uploading QR..." : submitting ? "Adding..." : "+ Add Account"}
                            </button>
                        </form>
                    </div>

                    {/* List */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                        <h2 className="mb-4 text-lg font-semibold text-white">
                            Existing Accounts ({giftAccounts.length})
                        </h2>

                        {giftAccounts.length === 0 ? (
                            <p className="py-8 text-center text-sm text-neutral-400">
                                No gift accounts yet. Add your first bank account above.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {giftAccounts.map((account) => (
                                    <div
                                        key={account.id}
                                        className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/50 p-4"
                                    >
                                        <div className="flex gap-4">
                                            {account.qrCodeUrl && (
                                                <div className="h-16 w-16 shrink-0 rounded border border-neutral-700 p-1 bg-white">
                                                    <img src={account.qrCodeUrl} alt="QR" className="h-full w-full object-contain" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white">{account.bankName}</span>
                                                </div>
                                                <p className="text-sm text-white">{account.accountNumber}</p>
                                                <p className="text-xs text-neutral-400">a/n {account.accountHolder}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setDeleteConfirm(account.id)}
                                            className="ml-4 rounded-lg bg-red-600/10 px-4 py-2 text-sm text-red-500 hover:bg-red-600/20"
                                        >
                                            Delete
                                        </button>
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
