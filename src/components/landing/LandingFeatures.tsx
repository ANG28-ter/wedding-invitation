"use client";

import { motion } from "framer-motion";
import { BookOpen, CalendarHeart, Image as ImageIcon, Music, MapPin, Mail, Gift, Smartphone, Bell, Globe, Clock, Layers } from "lucide-react";

export default function LandingFeatures() {
  const features = [
    {
      icon: <CalendarHeart className="w-8 h-8" />,
      title: "Hitung Mundur",
      description: "Pengingat waktu menuju momen bahagia Anda agar tamu tidak terlewat.",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Buku Tamu & RSVP",
      description: "Kelola kehadiran tamu dan terima ucapan doa secara langsung dan terorganisir.",
    },
    {
      icon: <ImageIcon className="w-8 h-8" />,
      title: "Galeri Foto",
      description: "Tampilkan momen pre-wedding terbaik Anda dalam balutan frame yang elegan.",
    },
    {
      icon: <Music className="w-8 h-8" />,
      title: "Musik Latar",
      description: "Hadirkan nuansa romantis dengan lagu pilihan yang otomatis berputar.",
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Navigasi Lokasi",
      description: "Terintegrasi dengan Google Maps untuk memudahkan tamu menemukan lokasi acara.",
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Amplop Digital",
      description: "Fitur cashless (transfer bank & QRIS) untuk tamu yang ingin memberikan hadiah.",
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Kirim Otomatis",
      description: "Kemudahan menyebarkan undangan melalui WhatsApp dengan nama tamu tercetak.",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Responsif & Cepat",
      description: "Desain yang menyesuaikan layar HP tamu Anda, ringan dan tanpa loading lama.",
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Notifikasi Realtime",
      description: "Dapatkan informasi aktivitas undangan (RSVP & ucapan) secara langsung.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Custom Domain",
      description: "Gunakan nama domain Anda sendiri (contoh: romeojuliet.com) agar lebih eksklusif.",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Custom Time Zone",
      description: "Informasi waktu yang otomatis menyesuaikan zona waktu tamu Anda.",
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Versi Undangan",
      description: "Buat versi undangan berbeda untuk VIP, keluarga, atau teman dengan mudah.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="features" className="py-24 bg-[#20150f] relative overflow-hidden">
      {/* Background Ornament */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full border border-[rgb(var(--color-primary))]"></div>
        <div className="absolute top-1/2 -right-20 w-[600px] h-[600px] rounded-full border border-[rgb(var(--color-primary))]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl md:text-5xl text-white mb-4"
          >
            Fitur <span className="gold-text">Lengkap & Eksklusif</span>
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
            Segala kebutuhan untuk undangan digital yang sempurna telah kami siapkan untuk Anda.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 group border-t border-l border-[rgb(var(--color-primary))]/20"
            >
              <div className="mb-6 text-[rgb(var(--color-secondary))] group-hover:text-[rgb(var(--color-primary))] transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-heading text-white mb-3">{feature.title}</h3>
              <p className="text-white/60 font-body leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
