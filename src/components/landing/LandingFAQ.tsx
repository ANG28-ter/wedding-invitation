"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function LandingFAQ() {
  const faqs = [
    {
      question: "Berapa lama proses pembuatan undangan digital?",
      answer: "Proses pembuatan memakan waktu sekitar 1-2 hari kerja setelah seluruh data (foto, teks, dan detail acara) kami terima dengan lengkap.",
    },
    {
      question: "Apakah saya bisa mengubah data setelah undangan selesai?",
      answer: "Tentu! Anda mendapatkan kesempatan revisi minor sebanyak 2 kali (seperti typo atau perubahan jam/lokasi).",
    },
    {
      question: "Apakah bisa request lagu atau musik latar sendiri?",
      answer: "Sangat bisa. Anda dapat mengirimkan tautan YouTube atau file MP3 lagu yang Anda inginkan untuk dijadikan musik latar undangan.",
    },
    {
      question: "Berapa lama masa aktif undangan digital?",
      answer: "Masa aktif bergantung pada paket yang Anda pilih. Paket Basic aktif selama 3 bulan, Premium 6 bulan, dan Exclusive aktif hingga 1 tahun sejak hari H acara.",
    },
    {
      question: "Apakah aman menampilkan informasi nomor rekening untuk amplop digital?",
      answer: "Kami menjamin keamanan data Anda. Anda juga bisa mengatur agar fitur Amplop Digital hanya bisa diakses oleh tamu-tamu tertentu jika diinginkan.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-[#20150f] relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl md:text-5xl text-white mb-4"
          >
            Pertanyaan <span className="gold-text">Umum</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-24 h-1 gold-gradient mx-auto mb-6"
          />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl overflow-hidden border border-white/5"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <h3 className={`font-heading text-lg transition-colors ${activeIndex === index ? "text-[rgb(var(--color-primary))]" : "text-white"}`}>
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-white/50 transition-transform duration-300 ${activeIndex === index ? "rotate-180" : ""}`}
                />
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-white/60 font-body text-sm leading-relaxed border-t border-white/5 pt-4 mt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
