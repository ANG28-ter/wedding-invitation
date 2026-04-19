"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  slug: string;
  isOpen: boolean;
  onClose: () => void;
};

type Attendance = "HADIR" | "TIDAK";

export default function RsvpForm({ slug, isOpen, onClose }: Props) {
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [messageText, setMessageText] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("HADIR");
  const [pax, setPax] = useState<number>(1);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const canSubmit = useMemo(() => {
    return guestName.trim().length >= 2 && !loading;
  }, [guestName, loading]);

  function resetForm() {
    setGuestName("");
    setPhone("");
    setMessageText("");
    setAttendance("HADIR");
    setPax(1);
    setSuccessMsg(null);
    setErrorMsg(null);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!canSubmit) {
      setErrorMsg("Mohon isi nama lengkap (min. 2 huruf).");
      return;
    }

    // Combine phone & message into message field (Opsi A - no DB migration)
    const messageParts: string[] = [];
    if (phone.trim()) messageParts.push(`HP: ${phone.trim()}`);
    if (messageText.trim()) messageParts.push(messageText.trim());
    const combinedMessage = messageParts.join(" | ");

    setLoading(true);
    try {
      const res = await fetch(
        `/api/public/invitations/${encodeURIComponent(slug)}/rsvp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            guestName: guestName.trim(),
            status: attendance,
            pax: attendance === "HADIR" ? pax : 0,
            message: combinedMessage || undefined,
          }),
        }
      );

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        const msg =
          json?.message ||
          (res.status === 404
            ? "Undangan tidak ditemukan."
            : "Gagal mengirim konfirmasi.");
        setErrorMsg(msg);
        return;
      }

      setSuccessMsg("Terima kasih! Konfirmasi kehadiran Anda berhasil dikirim. 🎊");
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Terjadi error jaringan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-100 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-x-4 bottom-0 top-[5%] z-101 mx-auto max-w-[420px] overflow-y-auto rounded-t-3xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white px-6 pt-6 pb-4 border-b border-neutral-100">
              <button
                onClick={handleClose}
                className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 font-bold text-lg"
                aria-label="Tutup"
              >
                ✕
              </button>
              <h2 className="text-center text-[15px] font-semibold text-neutral-700 tracking-wide">
                Konfirmasi Kehadiran
              </h2>
              <div className="mt-3 h-px bg-neutral-200" />
            </div>

            {/* Body */}
            <div className="px-6 pb-8">
              {/* Envelope Icon */}
              <div className="flex justify-center py-6">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" stroke="#2d2d2d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="#2d2d2d" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>

              {successMsg ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-center">
                  <p className="text-2xl mb-2">🎊</p>
                  <p className="text-sm font-medium text-emerald-700">{successMsg}</p>
                  <button
                    onClick={handleClose}
                    className="mt-4 rounded-full bg-[#2d2d2d] px-6 py-2.5 text-sm font-semibold text-white"
                  >
                    Tutup
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  {/* Nama Lengkap */}
                  <input
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-sm text-neutral-700 outline-none focus:border-neutral-500 placeholder:text-neutral-400"
                    suppressHydrationWarning
                  />

                  {/* Pesan */}
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Pesan yang akan disampaikan ke pengantin (opsional)"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-sm text-neutral-700 outline-none focus:border-neutral-500 placeholder:text-neutral-400 min-h-[100px] resize-y"
                    suppressHydrationWarning
                  />

                  {/* Response */}
                  <div className="pt-1">
                    <p className="mb-3 text-sm font-bold text-neutral-700">Kehadiran</p>
                    <div className="space-y-3">
                      <label className="flex cursor-pointer items-center gap-3">
                        <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${attendance === "HADIR" ? "border-[#2d2d2d] bg-[#2d2d2d]" : "border-neutral-400"}`}>
                          {attendance === "HADIR" && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="attendance"
                          value="HADIR"
                          checked={attendance === "HADIR"}
                          onChange={() => setAttendance("HADIR")}
                          className="sr-only"
                        />
                        <span className="text-sm text-neutral-700">Ya, Saya akan hadir</span>
                      </label>

                      <label className="flex cursor-pointer items-center gap-3">
                        <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${attendance === "TIDAK" ? "border-[#2d2d2d] bg-[#2d2d2d]" : "border-neutral-400"}`}>
                          {attendance === "TIDAK" && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="attendance"
                          value="TIDAK"
                          checked={attendance === "TIDAK"}
                          onChange={() => setAttendance("TIDAK")}
                          className="sr-only"
                        />
                        <span className="text-sm text-neutral-700">Maaf, Saya tidak bisa hadir</span>
                      </label>
                    </div>
                  </div>

                  {/* Pax Input */}
                  <AnimatePresence>
                    {attendance === "HADIR" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-1 overflow-hidden"
                      >
                        <p className="mb-3 text-sm font-bold text-neutral-700">Jumlah Tamu Bawaan</p>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={pax || ""}
                          onChange={(e) => {
                            // Cuma boleh mengetik angka dengan filter regex
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            setPax(val === "" ? 0 : parseInt(val, 10));
                          }}
                          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-sm text-neutral-700 outline-none focus:border-neutral-500"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Error */}
                  {errorMsg && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="mt-2 w-full rounded-xl bg-[#2d2d2d] px-4 py-4 text-sm font-semibold text-white disabled:opacity-50 transition-opacity"
                    suppressHydrationWarning
                  >
                    {loading ? "Mengirim..." : "Kirim Konfirmasi"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
