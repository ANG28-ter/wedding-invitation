"use client";

import { motion } from "framer-motion";
import { Check, ArrowLeft, MessageCircle, ImageIcon, Sparkles } from "lucide-react";
import { useState } from "react";
import ThemePickerModal from "./ThemePickerModal";

export default function LandingPricing() {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);

  const [orderData, setOrderData] = useState({
    name: "",
    date: "",
    theme: "",
  });

  const handleFlip = (pkgName: string) => {
    setFlippedCard(pkgName);
    setOrderData({ name: "", date: "", theme: "" });
  };

  const handleCloseFlip = () => {
    setFlippedCard(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handleSubmitWA = (pkgName: string, skipTheme: boolean = false) => {
    const themeText = skipTheme ? "Akan didiskusikan via WA" : (orderData.theme || "Belum Menentukan");
    const message = `Halo Admin Akadev! 👋\n\nSaya ingin memesan undangan digital dengan detail berikut:\n\n*Nama:* ${orderData.name}\n*Tgl Pernikahan:* ${orderData.date || "Belum Ditentukan"}\n*Paket Pilihan:* ${pkgName}\n*Tema Pilihan:* ${themeText}\n\nMohon informasi langkah selanjutnya. Terima kasih!`;
    window.open(`https://wa.me/6289615284595?text=${encodeURIComponent(message)}`, "_blank");
  };

  const getAllowedPackages = (pkgName: string) => {
    if (pkgName === "Exclusive") return ["Basic", "Premium", "Exclusive"];
    if (pkgName === "Premium") return ["Basic", "Premium"];
    return ["Basic"];
  };

  const plans = [
    {
      name: "Basic",
      price: "45.000",
      description: "Paket esensial untuk undangan pernikahan digital yang elegan.",
      features: [
        "Nama Tamu Tidak Terbatas",
        "Galeri Foto (Max 3 Foto)",
        "Hitung Mundur Acara",
        "Navigasi Google Maps",
        "Masa Aktif 1 Bulan",
      ],
      isPopular: false,
      accentColor: "border-white/10",
      backBg: "bg-[#1a110c] border border-white/10",
    },
    {
      name: "Premium",
      price: "75.000",
      description: "Pilihan terfavorit dengan fitur lengkap dan interaktif.",
      features: [
        "Semua Fitur Basic",
        "Galeri Foto (Max 10 Foto)",
        "Buku Tamu & RSVP",
        "Musik Latar Otomatis",
        "Amplop Digital (QRIS/Transfer)",
        "Bebas Request Musik Latar",
        "Story Timeline Perjalanan Cinta",
        "Masa Aktif 3 Bulan",
      ],
      isPopular: true,
      accentColor: "border-[rgb(var(--color-primary))]",
      backBg: "bg-[#251912] border border-[rgb(var(--color-primary))]/40",
    },
    {
      name: "Exclusive",
      price: "100.000",
      description: "Kustomisasi penuh untuk pengalaman undangan tak terlupakan.",
      features: [
        "Semua Fitur Premium",
        "Desain Exclusive",
        "Desain Tema Custom",
        "Galeri Foto Tidak Terbatas",
        "Video Pre-Wedding",
        "Masa Aktif 6 Bulan",
      ],
      isPopular: false,
      accentColor: "border-white/10",
      backBg: "bg-[#1a110c] border border-white/10",
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#20150f] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[rgb(var(--color-primary))]/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl md:text-5xl text-white mb-4"
          >
            Investasi <span className="gold-text">Terbaik Anda</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-24 h-1 gold-gradient mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white/70 max-w-2xl mx-auto font-body text-lg"
          >
            Pilih paket yang sesuai dengan kebutuhan pernikahan Anda. Transparan, tanpa biaya tersembunyi.
          </motion.p>
        </div>

        {/* Card Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start"
          style={{ perspective: "1200px" }}
        >
          {plans.map((plan, index) => {
            const isFlipped = flippedCard === plan.name;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
                style={{ minHeight: "520px" }}
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.55, type: "spring", stiffness: 280, damping: 22 }}
                  style={{ transformStyle: "preserve-3d", position: "relative", width: "100%", height: "100%", minHeight: "520px" }}
                >
                  {/* ── FRONT SIDE ── */}
                  <div
                    className={`absolute inset-0 rounded-3xl p-8 flex flex-col ${
                      plan.isPopular
                        ? "bg-linear-to-b from-[rgb(var(--color-primary))]/15 to-[#20150f]/50 border border-[rgb(var(--color-primary))] shadow-2xl shadow-[rgb(var(--color-primary))]/10"
                        : "bg-[#1a110c]/80 border border-white/8 shadow-xl"
                    }`}
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    {/* Popular badge */}
                    {plan.isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 gold-gradient text-black px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                        <Sparkles className="w-3 h-3" /> Paling Diminati
                      </div>
                    )}

                    {/* Header */}
                    <div className="text-center mb-7">
                      <p className="font-sans text-xs uppercase tracking-[0.3em] text-white/40 mb-2">{plan.name}</p>
                      <div className="flex items-baseline justify-center gap-1 mb-3">
                        <span className="text-white/60 font-sans text-base">Rp</span>
                        <span className="text-5xl font-heading gold-text font-bold leading-none">{plan.price}</span>
                      </div>
                      <p className="text-white/50 font-body text-sm leading-relaxed px-2">{plan.description}</p>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-white/8 mb-6" />

                    {/* Features */}
                    <div className="space-y-3 flex-1 mb-8">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="shrink-0 w-5 h-5 bg-[rgb(var(--color-primary))]/15 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-[rgb(var(--color-primary))]" />
                          </div>
                          <span className="text-white/75 font-body text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleFlip(plan.name)}
                      className={`w-full py-4 rounded-2xl font-sans text-sm tracking-widest uppercase font-semibold transition-all duration-300 ${
                        plan.isPopular
                          ? "gold-gradient text-black hover:scale-[1.03] hover:shadow-lg hover:shadow-[rgb(var(--color-primary))]/20"
                          : "border border-white/15 text-white hover:border-white/40 hover:bg-white/5"
                      }`}
                    >
                      Pilih Paket Ini
                    </button>
                  </div>

                  {/* ── BACK SIDE (Order Form) ── */}
                  <div
                    className={`absolute inset-0 rounded-3xl p-5 md:p-7 flex flex-col ${plan.backBg}`}
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    {/* Back header */}
                    <div className="flex items-center justify-between mb-6">
                      <button
                        onClick={handleCloseFlip}
                        className="flex items-center gap-1.5 text-white/40 hover:text-white/80 transition-colors font-sans text-xs uppercase tracking-wider"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                      </button>
                      <div className="text-right">
                        <p className="font-sans text-[10px] uppercase tracking-widest text-white/40">Memesan</p>
                        <p className="font-heading text-lg gold-text">{plan.name}</p>
                      </div>
                    </div>

                    {/* Price reminder */}
                    <div className="bg-[rgb(var(--color-primary))]/8 border border-[rgb(var(--color-primary))]/20 rounded-2xl px-5 py-4 mb-6 flex items-center justify-between">
                      <div>
                        <p className="font-sans text-[10px] uppercase tracking-widest text-white/40 mb-0.5">Total Paket</p>
                        <p className="font-heading text-2xl gold-text font-bold">Rp {plan.price}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[rgb(var(--color-primary))]/15 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-[rgb(var(--color-primary))]" />
                      </div>
                    </div>

                    {/* Form inputs */}
                    <div className="space-y-3 flex-1">
                      <div>
                        <label className="block font-sans text-[10px] uppercase tracking-widest text-white/40 mb-1.5">Nama Pasangan *</label>
                        <input
                          type="text"
                          name="name"
                          value={orderData.name}
                          onChange={handleChange}
                          placeholder="Contoh: Budi & Susi"
                          className="w-full bg-[#130c08] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[rgb(var(--color-primary))]/40 transition-colors font-body placeholder:text-white/25"
                        />
                      </div>

                      <div>
                        <label className="block font-sans text-[10px] uppercase tracking-widest text-white/40 mb-1.5">Tanggal Acara</label>
                        <input
                          type="date"
                          name="date"
                          value={orderData.date}
                          onChange={handleChange}
                          className="w-full bg-[#130c08] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[rgb(var(--color-primary))]/40 transition-colors font-body scheme-dark"
                        />
                      </div>

                      {/* Theme picker section */}
                      <div>
                        <label className="block font-sans text-[10px] uppercase tracking-widest text-white/40 mb-1.5">Tema (Opsional)</label>

                        {orderData.theme ? (
                          <div className="bg-[rgb(var(--color-primary))]/10 border border-[rgb(var(--color-primary))]/25 rounded-xl px-4 py-3 flex justify-between items-center">
                            <div>
                              <p className="text-white/40 text-[10px] font-sans uppercase tracking-wider">Terpilih</p>
                              <p className="text-[rgb(var(--color-primary))] font-heading text-base leading-tight">{orderData.theme}</p>
                            </div>
                            <button
                              onClick={() => setIsThemePickerOpen(true)}
                              className="text-[10px] font-sans text-white/40 hover:text-white/80 transition-colors uppercase tracking-wider underline underline-offset-2"
                            >
                              Ganti
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setIsThemePickerOpen(true)}
                            className="w-full flex items-center justify-center gap-2 bg-white/4 border border-dashed border-white/15 hover:border-[rgb(var(--color-primary))]/40 hover:bg-[rgb(var(--color-primary))]/5 rounded-xl px-4 py-3 text-white/50 hover:text-white/80 text-sm font-sans transition-all"
                          >
                            <ImageIcon className="w-4 h-4" />
                            <span>Lihat & Pilih Tema Visual</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-5 space-y-2.5">
                      <button
                        onClick={() => handleSubmitWA(plan.name, false)}
                        disabled={!orderData.name}
                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-sans text-sm tracking-widest uppercase font-semibold transition-all ${
                          orderData.name
                            ? "gold-gradient text-black hover:scale-[1.02] hover:shadow-lg hover:shadow-[rgb(var(--color-primary))]/20"
                            : "bg-white/5 text-white/25 cursor-not-allowed border border-white/5"
                        }`}
                      >
                        <MessageCircle className="w-4 h-4" /> Kirim ke WhatsApp
                      </button>
                      <button
                        onClick={() => handleSubmitWA(plan.name, true)}
                        className="w-full text-center text-white/35 hover:text-white/70 text-xs font-sans transition-colors py-1"
                      >
                        Lewati pilihan tema, diskusi langsung via WA →
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ThemePickerModal — rendered once outside the cards */}
      {flippedCard && (
        <ThemePickerModal
          isOpen={isThemePickerOpen}
          onClose={() => setIsThemePickerOpen(false)}
          allowedPackages={getAllowedPackages(flippedCard)}
          onSelectTheme={(themeName) => setOrderData({ ...orderData, theme: themeName })}
        />
      )}
    </section>
  );
}
