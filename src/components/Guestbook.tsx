"use client";

import { useEffect, useState, useRef } from "react";

type GuestbookItem = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

export default function Guestbook({ slug }: { slug: string }) {
  const [items, setItems] = useState<GuestbookItem[]>([]);
  const [name, setName] = useState("");
  const [asal, setAsal] = useState("");
  const [message, setMessage] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/public/invitations/${encodeURIComponent(slug)}/guestbook`
      );
      const json = await res.json();
      if (json?.ok) setItems(json.data);
    } catch {
      setError("Gagal memuat ucapan.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [slug]);

  // Auto-scroll loop
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || items.length <= 3) return;

    let animationFrameId: number;

    const step = () => {
      if (el && !isHovered.current) {
        el.scrollTop += 0.5; // slow speed
        // Jika sudah mentok batas bawah, kembalikan ke atas
        if (el.scrollTop >= el.scrollHeight - el.clientHeight) {
          el.scrollTop = 0;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [items]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2 || message.trim().length < 2) {
      setError("Nama dan harapan minimal 2 karakter.");
      return;
    }

    const finalName = asal.trim() ? `${name.trim()}|${asal.trim()}` : name.trim();

    try {
      setSending(true);
      const res = await fetch(
        `/api/public/invitations/${encodeURIComponent(slug)}/guestbook`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: finalName,
            message: message.trim(),
          }),
        }
      );

      const json = await res.json();
      if (!res.ok || !json?.ok) {
        setError(json?.message || "Gagal mengirim ucapan.");
        return;
      }

      setName("");
      setAsal("");
      setMessage("");
      load(); // reload list
    } catch {
      setError("Terjadi error jaringan.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="relative w-full z-10 text-[#e8dcc4] font-sans">
      <div className="mx-auto w-full max-w-md px-6 pb-20">
        <h2
          className="text-center text-[38px] md:text-[42px] tracking-wide mb-8"
          style={{ fontFamily: "'Upakarti', cursive", textShadow: "1px 1px 4px rgba(0,0,0,0.5)" }}
        >
          harapan dan doa
        </h2>

        {/* LIST WITH AUTO SCROLL & OPACITY FADE */}
        <div
          className="relative max-h-[350px] overflow-y-auto"
          ref={scrollRef}
          onMouseEnter={() => isHovered.current = true}
          onMouseLeave={() => isHovered.current = false}
          onTouchStart={() => isHovered.current = true}
          onTouchEnd={() => isHovered.current = false}
          style={{
            maskImage: "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 5%, black 90%, transparent)",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>

          <div className="space-y-5 py-10 px-2 pl-4">
            {loading ? (
              <p className="text-center text-sm text-[#e8dcc4]/60">
                Memuat ucapan...
              </p>
            ) : items.length === 0 ? (
              <p className="text-center text-sm text-[#e8dcc4]/60">
                Belum ada harapan dan doa.
              </p>
            ) : (
              items.map((it, idx) => {
                const parts = it.name.split("|");
                const displayName = parts[0];
                const displayOrigin = parts.length > 1 ? parts[1] : "";

                return (
                  <div
                    key={`${it.id}-${idx}`}
                    className="flex gap-4 items-start"
                  >
                    {/* Avatar Circle */}
                    <div className="w-11 h-11 rounded-full bg-[#d8e0aa] flex items-center justify-center font-bold text-[#1f1a14] shrink-0 z-10 shadow-md">
                      {displayName[0]?.toUpperCase() || "A"}
                    </div>

                    {/* Speech Bubble */}
                    <div className="relative bg-[#ecdcc5] text-[#2c1c11] rounded-[20px] rounded-tl-[4px] p-4 w-full shadow-md">
                      {/* Left pointer triangle trick */}
                      <div className="absolute top-[10px] -left-[8px] w-0 h-0 border-t-[6px] border-t-transparent border-r-10 border-r-[#ecdcc5] border-b-[6px] border-b-transparent"></div>

                      <p className="font-bold text-[14px] leading-none mb-1">{displayName}</p>
                      {displayOrigin && (
                        <p className="text-[11px] opacity-60 leading-tight mb-2 uppercase tracking-wide">
                          {displayOrigin}
                        </p>
                      )}
                      <p className="text-[13px] leading-relaxed italic text-[#3e2c1e]">
                        "{it.message}"
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* FORM */}
        <div className="mt-8">
          <h3 className="text-[#e8dcc4] text-[15px] font-bold mb-4 ml-1">Kirim Harapan Anda</h3>
          <form
            onSubmit={submit}
            className="flex flex-col gap-3"
          >
            <input
              placeholder="Nama Kamu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border-0 bg-[#6d5e4b] text-[#e8dcc4] px-4 py-3 text-sm outline-none placeholder:text-[#e8dcc4]/60 placeholder:font-light focus:bg-[#7a6b57] transition-all"
              suppressHydrationWarning
            />

            <input
              placeholder="Asal Kamu"
              value={asal}
              onChange={(e) => setAsal(e.target.value)}
              className="w-full rounded-2xl border-0 bg-[#6d5e4b] text-[#e8dcc4] px-4 py-3 text-sm outline-none placeholder:text-[#e8dcc4]/60 placeholder:font-light focus:bg-[#7a6b57] transition-all"
              suppressHydrationWarning
            />

            <textarea
              placeholder="Ucapan Harapan"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full rounded-2xl border-0 bg-[#6d5e4b] text-[#e8dcc4] px-4 py-3 text-sm outline-none placeholder:text-[#e8dcc4]/60 placeholder:font-light focus:bg-[#7a6b57] transition-all"
            />

            {error ? (
              <div className="rounded-md bg-red-900/50 px-4 py-2 text-sm text-red-200 mt-1">
                {error}
              </div>
            ) : null}

            <button
              disabled={sending}
              className="mt-6 w-full rounded-2xl bg-[#1a110d] border border-[#e8dcc4]/30 py-4 text-sm font-bold tracking-wide text-[#e8dcc4] disabled:opacity-60 transition-all hover:bg-[#2a1c15] shadow-lg"
              suppressHydrationWarning
            >
              {sending ? "Mengirim..." : "Kirim"}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
