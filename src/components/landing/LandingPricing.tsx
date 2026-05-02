"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

export default function LandingPricing() {
  const plans = [
    {
      name: "Basic",
      price: "150.000",
      description: "Paket esensial untuk undangan pernikahan digital yang elegan.",
      features: [
        "Desain Tema Premium (Pilih 1)",
        "Nama Tamu Tidak Terbatas",
        "Galeri Foto (Max 5 Foto)",
        "Hitung Mundur Acara",
        "Navigasi Google Maps",
        "Masa Aktif 3 Bulan",
      ],
      isPopular: false,
    },
    {
      name: "Premium",
      price: "250.000",
      description: "Pilihan terfavorit dengan fitur lengkap dan interaktif.",
      features: [
        "Semua Fitur Basic",
        "Galeri Foto (Max 15 Foto)",
        "Buku Tamu & RSVP",
        "Musik Latar Otomatis",
        "Amplop Digital (QRIS/Transfer)",
        "Kirim Undangan Otomatis (WA)",
        "Masa Aktif 6 Bulan",
      ],
      isPopular: true,
    },
    {
      name: "Exclusive",
      price: "450.000",
      description: "Kustomisasi penuh untuk pengalaman undangan tak terlupakan.",
      features: [
        "Semua Fitur Premium",
        "Desain Tema Custom",
        "Galeri Foto Tidak Terbatas",
        "Video Pre-Wedding",
        "Story Timeline Perjalanan Cinta",
        "Bebas Request Musik Latar",
        "Masa Aktif 1 Tahun",
      ],
      isPopular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#20150f] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative rounded-3xl p-8 ${
                plan.isPopular
                  ? "bg-linear-to-b from-[rgb(var(--color-primary))]/20 to-transparent border border-[rgb(var(--color-primary))] transform md:-translate-y-4 shadow-2xl shadow-[rgb(var(--color-primary))]/10"
                  : "glass border border-white/5"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 gold-gradient text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Paling Diminati
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-heading text-white mb-2">{plan.name}</h3>
                <p className="text-white/60 font-body text-sm mb-6 h-10">{plan.description}</p>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-white/80 font-sans font-medium">Rp</span>
                  <span className="text-4xl font-heading gold-text font-bold">{plan.price}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-1 bg-[rgb(var(--color-primary))]/20 p-1 rounded-full">
                      <Check className="w-3 h-3 text-[rgb(var(--color-primary))]" />
                    </div>
                    <span className="text-white/80 font-body text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href="#contact"
                className={`block w-full py-4 rounded-full text-center font-sans text-sm tracking-widest uppercase transition-all ${
                  plan.isPopular
                    ? "gold-gradient text-black font-semibold hover:scale-105"
                    : "border border-white/20 text-white hover:bg-white/10"
                }`}
              >
                Pilih Paket
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
