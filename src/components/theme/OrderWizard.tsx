"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  MessageCircle, 
  ShoppingBag, 
  User, 
  Calendar, 
  Smartphone,
  Check,
  CreditCard,
  FileText
} from "lucide-react";
import Image from "next/image";
import { ThemeItem } from "@/config/themes";

interface OrderWizardProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTheme: ThemeItem | null;
}

interface OrderData {
  name: string;
  weddingDate: string;
  phone: string;
  notes: string;
}

const steps = [
  { id: 1, title: "Pilih Tema", icon: ShoppingBag },
  { id: 2, title: "Data Pemesan", icon: User },
  { id: 3, title: "Konfirmasi", icon: FileText },
];

export default function OrderWizard({ isOpen, onClose, selectedTheme }: OrderWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OrderData>({
    name: "",
    weddingDate: "",
    phone: "",
    notes: "",
  });

  // Reset wizard when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep(1);
      }, 300);
    }
  }, [isOpen]);

  if (!selectedTheme) return null;

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const whatsappNumber = "6289615284595";
    const template = `Halo Admin Akadev! 👋

Saya ingin memesan *Undangan Digital* dengan detail sebagai berikut:

*--- 📋 DETAIL PESANAN ---*
*Tema:* ${selectedTheme.name}
*Paket:* ${selectedTheme.package}
*Harga:* Rp ${selectedTheme.price}k

*--- 👤 DATA PEMESAN ---*
*Nama:* ${formData.name}
*Tgl Acara:* ${formData.weddingDate}
*No. WhatsApp:* ${formData.phone}

*--- 💬 PESAN TAMBAHAN ---*
${formData.notes || "-"}

Mohon informasi langkah selanjutnya untuk proses pengerjaan. Terima kasih!`;

    const encodedMessage = encodeURIComponent(template);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
    onClose();
  };

  const isStepValid = () => {
    if (currentStep === 1) return true;
    if (currentStep === 2) {
      return formData.name && formData.weddingDate && formData.phone;
    }
    return true;
  };

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
            className="fixed inset-0 z-100 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-101 flex items-center justify-center p-4 md:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-4xl bg-[#1a110c] border border-white/10 rounded-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row pointer-events-auto max-h-[90vh]"
            >
              {/* Left Sidebar - Status & Progress */}
              <div className="w-full md:w-80 bg-[#20150f] p-8 border-b md:border-b-0 md:border-r border-white/5 flex flex-col">
                <div className="mb-10">
                  <h3 className="font-heading text-2xl text-white mb-1">Wizard <span className="gold-text">Cart</span></h3>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-sans">Wedding Invitation</p>
                </div>

                <div className="space-y-6 grow">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;

                    return (
                      <div key={step.id} className="flex items-center gap-4 group">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                          isActive 
                            ? "gold-gradient text-black shadow-[0_0_15px_rgba(var(--color-primary),0.3)]" 
                            : isCompleted 
                              ? "bg-green-500/20 text-green-500 border border-green-500/30"
                              : "bg-white/5 text-white/30 border border-white/10"
                        }`}>
                          {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-xs font-sans uppercase tracking-tighter ${isActive ? "text-[rgb(var(--color-primary))]" : "text-white/30"}`}>
                            Step 0{step.id}
                          </span>
                          <span className={`font-heading text-lg ${isActive ? "text-white" : "text-white/50"}`}>
                            {step.title}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Theme Preview in Sidebar (Mobile) */}
                <div className="hidden md:block mt-auto pt-8 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10">
                      <Image 
                        src={selectedTheme.image} 
                        alt={selectedTheme.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-heading">{selectedTheme.name}</p>
                      <p className="text-[rgb(var(--color-primary))] text-sm font-sans">Rp {selectedTheme.price}k</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="grow flex flex-col min-h-0">
                <div className="p-4 md:p-8 grow overflow-y-auto custom-scrollbar">
                  <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors p-2"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h4 className="text-2xl font-heading text-white">Review Tema Pilihan</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="relative aspect-video md:aspect-square rounded-2xl overflow-hidden border border-white/10">
                            <Image 
                              src={selectedTheme.image} 
                              alt={selectedTheme.name} 
                              fill 
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                               <span className="gold-gradient text-black text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                                {selectedTheme.package}
                               </span>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h5 className="text-white/50 text-sm font-sans uppercase tracking-widest mb-1">Nama Tema</h5>
                              <p className="text-2xl text-white font-heading">{selectedTheme.name}</p>
                            </div>
                            <div>
                              <h5 className="text-white/50 text-sm font-sans uppercase tracking-widest mb-1">Kategori</h5>
                              <p className="text-white/80">{selectedTheme.category}</p>
                            </div>
                            <div>
                              <h5 className="text-white/50 text-sm font-sans uppercase tracking-widest mb-1">Deskripsi</h5>
                              <p className="text-white/60 text-sm leading-relaxed">{selectedTheme.description}</p>
                            </div>
                            <div className="pt-4 border-t border-white/5">
                              <div className="flex items-center justify-between">
                                <span className="text-white/50">Estimasi Biaya</span>
                                <span className="text-3xl font-heading gold-text">Rp {selectedTheme.price}k</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div>
                          <h4 className="text-2xl font-heading text-white mb-2">Data Pemesan</h4>
                          <p className="text-white/50 text-sm">Lengkapi data berikut agar kami dapat menghubungi Anda.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm text-white/70 flex items-center gap-2">
                              <User className="w-4 h-4 text-[rgb(var(--color-primary))]" />
                              Nama Lengkap
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Contoh: Budi & Shinta"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[rgb(var(--color-primary))]/50 transition-colors"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm text-white/70 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-[rgb(var(--color-primary))]" />
                              Tanggal Acara
                            </label>
                            <input
                              type="date"
                              name="weddingDate"
                              value={formData.weddingDate}
                              onChange={handleInputChange}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[rgb(var(--color-primary))]/50 transition-colors scheme-dark"
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <label className="text-sm text-white/70 flex items-center gap-2">
                              <Smartphone className="w-4 h-4 text-[rgb(var(--color-primary))]" />
                              Nomor WhatsApp
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="Contoh: 081234567890"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[rgb(var(--color-primary))]/50 transition-colors"
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <label className="text-sm text-white/70 flex items-center gap-2">
                              Pesan Tambahan (Opsional)
                            </label>
                            <textarea
                              name="notes"
                              value={formData.notes}
                              onChange={handleInputChange}
                              rows={3}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[rgb(var(--color-primary))]/50 transition-colors resize-none"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div>
                          <h4 className="text-2xl font-heading text-white mb-2">Konfirmasi Pesanan</h4>
                          <p className="text-white/50 text-sm">Periksa kembali detail pesanan Anda sebelum dikirim.</p>
                        </div>

                        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                          <div className="p-6 border-b border-white/5">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-xs text-white/30 uppercase tracking-widest font-sans mb-1">Tema Terpilih</p>
                                <h5 className="text-xl font-heading text-white">{selectedTheme.name}</h5>
                                <p className="text-[rgb(var(--color-primary))] text-sm">{selectedTheme.package} Package</p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-heading gold-text">Rp {selectedTheme.price}k</p>
                              </div>
                            </div>
                          </div>

                          <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-white/30 uppercase tracking-widest font-sans mb-1">Atas Nama</p>
                                <p className="text-white">{formData.name}</p>
                              </div>
                              <div>
                                <p className="text-xs text-white/30 uppercase tracking-widest font-sans mb-1">Tanggal Acara</p>
                                <p className="text-white">{formData.weddingDate}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-xs text-white/30 uppercase tracking-widest font-sans mb-1">Nomor WhatsApp</p>
                                <p className="text-white">{formData.phone}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-[rgb(var(--color-primary))]/10 rounded-xl border border-[rgb(var(--color-primary))]/20 flex gap-3">
                          <MessageCircle className="w-5 h-5 text-[rgb(var(--color-primary))] shrink-0" />
                          <p className="text-xs text-white/60 leading-relaxed">
                            Klik tombol di bawah untuk mengirim data ke WhatsApp admin. Admin kami akan segera memproses pesanan Anda.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer Actions */}
                <div className="p-6 md:p-8 bg-[#20150f] border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-sans text-sm tracking-widest uppercase transition-all ${
                      currentStep === 1 
                        ? "opacity-0 pointer-events-none" 
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Kembali
                  </button>

                  {currentStep < 3 ? (
                    <button
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className={`flex items-center gap-2 px-8 py-3 rounded-full font-sans text-sm tracking-widest uppercase transition-all ${
                        isStepValid()
                          ? "gold-gradient text-black font-semibold shadow-lg shadow-[rgb(var(--color-primary))]/20 hover:scale-105"
                          : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
                      }`}
                    >
                      Lanjut
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="flex items-center gap-3 px-10 py-4 rounded-full gold-gradient text-black font-bold font-sans text-sm tracking-widest uppercase shadow-lg shadow-[rgb(var(--color-primary))]/30 hover:scale-105 active:scale-95 transition-all"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Kirim ke WhatsApp
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
