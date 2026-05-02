"use client";

import { motion } from "framer-motion";
import { MessageCircle, Palette, FileText, Send } from "lucide-react";

export default function LandingHowItWorks() {
  const steps = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "1. Hubungi Kami",
      description: "Konsultasikan kebutuhan Anda langsung via WhatsApp. Kami siap membantu.",
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "2. Pilih Tema",
      description: "Pilih desain undangan premium yang paling sesuai dengan gaya Anda.",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "3. Kirim Data",
      description: "Berikan informasi detail acara, foto galeri, dan data yang diperlukan.",
    },
    {
      icon: <Send className="w-8 h-8" />,
      title: "4. Siap Disebar",
      description: "Undangan digital Anda selesai dibuat dan siap dibagikan ke tamu undangan.",
    },
  ];

  return (
    <section className="py-24 bg-linear-to-b from-[#1a110c] to-[#20150f] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl md:text-5xl text-white mb-4"
          >
            Cara <span className="gold-text">Pemesanan</span>
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
            Hanya butuh beberapa langkah mudah untuk mendapatkan undangan pernikahan impian Anda.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-white/10 -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-full glass border border-[rgb(var(--color-primary))]/30 flex items-center justify-center text-[rgb(var(--color-primary))] mb-6 group-hover:scale-110 transition-transform bg-[#20150f]">
                  {step.icon}
                </div>
                <h3 className="text-xl font-heading text-white mb-3">{step.title}</h3>
                <p className="text-white/60 font-body text-sm px-4">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
