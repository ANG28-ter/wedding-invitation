"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";

type OrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  preselectedPackage: string;
};

export default function OrderModal({ isOpen, onClose, preselectedPackage }: OrderModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    package: preselectedPackage,
  });

  // Reset package if preselectedPackage changes when opening
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({ ...prev, package: preselectedPackage || "Premium" }));
    }
  }, [isOpen, preselectedPackage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format text message for WhatsApp
    const message = `Halo Admin Akadev! 👋\n\nSaya ingin memesan undangan digital dengan detail berikut:\n\n*Nama:* ${formData.name}\n*Tgl Pernikahan:* ${formData.date}\n*Paket Pilihan:* ${formData.package}\n\nMohon informasi langkah selanjutnya. Terima kasih!`;
    
    // Encode to URL component
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "6289615284595";
    
    // Open WhatsApp in new tab
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
    
    // Close Modal after submitting
    onClose();
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-101 w-full max-w-lg p-6"
          >
            <div className="bg-[#1a110c] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[rgb(var(--color-primary))]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-8">
                <h3 className="font-heading text-3xl text-white mb-2">Form <span className="gold-text">Pemesanan</span></h3>
                <p className="text-white/60 font-body text-sm">
                  Isi data singkat berikut untuk memudahkan admin melayani Anda dengan lebih cepat.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div>
                  <label htmlFor="name" className="block text-sm font-sans text-white/80 mb-2">Nama Anda (atau Pasangan)</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#20150f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[rgb(var(--color-primary))]/50 transition-colors font-body"
                    placeholder="Contoh: Romeo & Juliet"
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-sans text-white/80 mb-2">Perkiraan Tanggal Acara</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-[#20150f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[rgb(var(--color-primary))]/50 transition-colors font-body scheme-dark"
                  />
                </div>

                <div>
                  <label htmlFor="package" className="block text-sm font-sans text-white/80 mb-2">Pilihan Paket</label>
                  <select
                    id="package"
                    name="package"
                    value={formData.package}
                    onChange={handleChange}
                    className="w-full bg-[#20150f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[rgb(var(--color-primary))]/50 transition-colors font-body appearance-none cursor-pointer"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                    <option value="Exclusive">Exclusive</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 flex items-center justify-center gap-3 px-8 py-4 rounded-full gold-gradient text-black font-semibold font-sans text-sm tracking-widest uppercase hover:scale-105 transition-transform"
                >
                  <MessageCircle className="w-5 h-5" />
                  Lanjut ke WhatsApp
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
