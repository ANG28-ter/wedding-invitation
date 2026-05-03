"use client";

import { motion } from "framer-motion";
import { MessageCircle, Mail, Instagram, ChevronDown } from "lucide-react";
import { useState } from "react";

// TikTok Icon SVG
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const faqs = [
  {
    question: "Bagaimana cara melakukan pemesanan undangan digital?",
    answer: "Anda dapat menghubungi kami via WhatsApp dengan menekan tombol 'Chat WhatsApp' di atas. Tim kami akan memandu Anda untuk memilih tema, mengisi form data mempelai, dan memproses pembuatan undangan."
  },
  {
    question: "Berapa lama proses pembuatan undangan digital?",
    answer: "Proses pembuatan memakan waktu 1-3 hari kerja terhitung setelah seluruh data (foto, nama, lokasi, dll) kami terima secara lengkap."
  },
  {
    question: "Apakah bisa request custom lagu atau backsound?",
    answer: "Tentu bisa! Terutama untuk paket Premium dan Exclusive, Anda bebas menentukan lagu latar yang ingin diputar pada undangan digital Anda."
  },
  {
    question: "Apakah undangan digital ini memiliki batas masa aktif?",
    answer: "Ya, masa aktif undangan disesuaikan dengan paket yang Anda pilih, mulai dari 1 bulan hingga 6 bulan sejak undangan diterbitkan."
  }
];

export default function KontakClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const waMessage = encodeURIComponent("Halo Admin Akadev, saya ingin konsultasi mengenai pembuatan undangan digital. Bisa dibantu?");

  const contactMethods = [
    {
      title: "WhatsApp",
      description: "Respon tercepat untuk konsultasi dan pemesanan.",
      icon: <MessageCircle className="w-8 h-8 text-[rgb(var(--color-primary))]" />,
      actionText: "Chat WhatsApp",
      link: `https://wa.me/6289615284595?text=${waMessage}`,
      bgClass: "from-[#20150f] to-[#2a1d15]",
    },
    {
      title: "Instagram",
      description: "Lihat inspirasi desain dan testimoni pelanggan kami.",
      icon: <Instagram className="w-8 h-8 text-pink-500" />,
      actionText: "@akadev.invitation",
      link: "https://instagram.com/akadev.invitation",
      bgClass: "from-[#20150f] to-[#2a1d15]",
    },
    {
      title: "TikTok",
      description: "Video menarik seputar tren undangan digital terbaru.",
      icon: <TikTokIcon className="w-8 h-8 text-white" />,
      actionText: "@akadev.invitation",
      link: "https://tiktok.com/@akadev.invitation",
      bgClass: "from-[#20150f] to-[#1a110c]",
    },
    {
      title: "Email",
      description: "Untuk kerjasama bisnis, kolaborasi, atau pertanyaan teknis.",
      icon: <Mail className="w-8 h-8 text-blue-400" />,
      actionText: "Kirim Email",
      link: "mailto:invitationaka@gmail.com",
      bgClass: "from-[#20150f] to-[#1a110c]",
    }
  ];

  return (
    <div className="container mx-auto px-6 relative z-10 -mt-10">
      {/* Contact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
        {contactMethods.map((method, index) => (
          <motion.a
            href={method.link}
            target="_blank"
            rel="noopener noreferrer"
            key={method.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`block group rounded-3xl p-8 bg-linear-to-b ${method.bgClass} border border-white/5 hover:border-[rgb(var(--color-primary))]/50 transition-all shadow-xl hover:-translate-y-2`}
          >
            <div className="bg-black/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {method.icon}
            </div>
            <h3 className="font-heading text-2xl text-white mb-3">{method.title}</h3>
            <p className="text-white/60 font-body text-sm mb-6">{method.description}</p>
            <div className="flex items-center text-[rgb(var(--color-primary))] font-sans text-sm font-semibold uppercase tracking-wider group-hover:underline underline-offset-4">
              {method.actionText}
            </div>
          </motion.a>
        ))}
      </div>

      {/* Operational Hours Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto rounded-3xl glass border border-[rgb(var(--color-primary))]/20 p-8 md:p-12 mb-24 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[rgb(var(--color-primary))]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[rgb(var(--color-primary))]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <h3 className="font-heading text-3xl md:text-4xl text-white mb-4 relative z-10">Jam Operasional Layanan</h3>
        <div className="w-16 h-1 gold-gradient mx-auto mb-6 relative z-10" />
        <p className="text-white/70 font-body text-lg relative z-10 max-w-2xl mx-auto mb-6">
          Kami siap melayani Anda dan memastikan pesanan undangan digital Anda selesai tepat waktu.
        </p>
        <div className="inline-block bg-black/40 px-8 py-4 rounded-2xl border border-white/10 relative z-10">
          <p className="text-xl font-heading text-[rgb(var(--color-primary))]">Senin - Minggu</p>
          <p className="text-white/80 font-sans tracking-widest mt-1">09.00 - 21.00 WIB</p>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mb-24">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
            Pertanyaan yang Sering <span className="gold-text">Diajukan</span>
          </h2>
          <p className="text-white/60 font-body text-lg">
            Temukan jawaban cepat untuk pertanyaan umum seputar layanan kami.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className={`font-heading text-base md:text-lg transition-colors pr-4 ${openFaq === index ? "text-[rgb(var(--color-primary))]" : "text-white"}`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-white/50 transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`} 
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="p-6 pt-0 text-white/70 font-body text-sm leading-relaxed border-t border-white/5">
                  {faq.answer}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
