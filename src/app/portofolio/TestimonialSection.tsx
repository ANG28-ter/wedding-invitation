"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquareQuote, X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { submitTestimonial } from "@/app/actions/testimonial";

import Link from "next/link";

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  message: string;
  rating: number;
  createdAt: Date;
  invitation?: { slug: string } | null;
};

type AvailableInvitation = {
  id: string;
  name: string;
};

export default function TestimonialSection({ 
  initialTestimonials, 
  availableInvitations 
}: { 
  initialTestimonials: Testimonial[];
  availableInvitations: AvailableInvitation[];
}) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Form State
  const [formData, setFormData] = useState({ name: "", invitationId: "", role: "", message: "", rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto slide effect
  useEffect(() => {
    if (!mounted || testimonials.length <= 1 || isModalOpen) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000); // 5 seconds interval

    return () => clearInterval(interval);
  }, [mounted, testimonials.length, isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await submitTestimonial(formData);

    if (result.success && result.testimonial) {
      setTestimonials([result.testimonial as Testimonial, ...testimonials]);
      setIsModalOpen(false);
      setFormData({ name: "", invitationId: "", role: "", message: "", rating: 5 });
      setCurrentIndex(0); // Show the new testimonial
    } else {
      alert(result.error || "Gagal mengirim testimoni.");
    }
    setIsSubmitting(false);
  };

  if (!mounted) return null;

  return (
    <div className="mb-20">
      {/* Slider Section */}
      <div className="relative max-w-4xl mx-auto px-12">
        {testimonials.length > 0 ? (
          <div className="bg-[#1a110c] rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden group">
            <MessageSquareQuote className="absolute -top-6 -left-6 w-32 h-32 text-white/5 -rotate-12" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 text-center"
              >
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < testimonials[currentIndex].rating ? "text-[rgb(var(--color-primary))] fill-[rgb(var(--color-primary))]" : "text-white/20"}`}
                    />
                  ))}
                </div>
                <p className="text-xl md:text-2xl font-serif italic text-white/90 mb-8 leading-relaxed">
                  "{testimonials[currentIndex].message}"
                </p>
                <div>
                  {testimonials[currentIndex].invitation?.slug ? (
                    <Link href={`/${testimonials[currentIndex].invitation.slug}`} className="hover:opacity-80 transition-opacity">
                      <h4 className="font-heading text-lg text-white hover:text-[rgb(var(--color-primary))] transition-colors inline-block border-b border-transparent hover:border-[rgb(var(--color-primary))]">
                        {testimonials[currentIndex].name}
                      </h4>
                    </Link>
                  ) : (
                    <h4 className="font-heading text-lg text-white">{testimonials[currentIndex].name}</h4>
                  )}
                  
                  {testimonials[currentIndex].role && (
                    <p className="text-sm font-sans text-[rgb(var(--color-primary))]/80 uppercase tracking-widest mt-1">
                      {testimonials[currentIndex].role}
                    </p>
                  )}
                  {testimonials[currentIndex].createdAt && (
                    <p className="text-xs font-sans text-white/40 mt-2">
                      {new Date(testimonials[currentIndex].createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Controls */}
            {testimonials.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-white/20 rounded-3xl">
            <p className="text-white/50 font-body">Belum ada testimoni. Jadilah yang pertama!</p>
          </div>
        )}

        {/* Add Testimonial Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 rounded-full gold-gradient text-black font-semibold font-sans text-sm tracking-widest uppercase hover:scale-105 transition-transform shadow-lg shadow-[rgb(var(--color-primary))]/20"
          >
            Tulis Testimoni
          </button>
        </div>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#20150f] border border-white/10 rounded-3xl p-8 max-w-lg w-full relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="font-heading text-3xl text-white mb-2">Beri Ulasan</h3>
              <p className="text-white/60 font-body text-sm mb-8">Bagikan pengalaman Anda menggunakan layanan Akadev.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-sans text-white/80 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star className={`w-8 h-8 transition-colors ${star <= formData.rating ? "text-[rgb(var(--color-primary))] fill-[rgb(var(--color-primary))]" : "text-white/20 hover:text-white/40"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-sans text-white/80 mb-2">Nama Pasangan (Pilih Undangan Anda)</label>
                  <div className="relative">
                    <select
                      required
                      value={formData.invitationId}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const selectedInv = availableInvitations.find(inv => inv.id === selectedId);
                        setFormData({ 
                          ...formData, 
                          invitationId: selectedId,
                          name: selectedInv ? selectedInv.name : ""
                        });
                      }}
                      className="w-full appearance-none bg-[#1a110c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[rgb(var(--color-primary))]/50 transition-colors cursor-pointer"
                    >
                      <option value="" disabled>Pilih Nama Pasangan...</option>
                      {availableInvitations.map(inv => (
                        <option key={inv.id} value={inv.id}>{inv.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-sans text-white/80 mb-2">Pilih Kategori Klien</label>
                  <div className="relative">
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full appearance-none bg-[#1a110c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[rgb(var(--color-primary))]/50 transition-colors cursor-pointer"
                    >

                      <option value="Klien Tema Jawa Modern">Klien Tema Jawa Modern</option>
                      <option value="Klien Tema Jawa Kuno">Klien Tema Jawa Kuno</option>
                      <option value="Klien Tema Elegant">Klien Tema Elegant</option>
                      <option value="Klien Paket Basic">Klien Paket Basic</option>
                      <option value="Klien Paket Premium">Klien Paket Premium</option>
                      <option value="Klien Paket Exclusive">Klien Paket Exclusive</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-sans text-white/80 mb-2">Ulasan</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#1a110c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[rgb(var(--color-primary))]/50 transition-colors resize-none"
                    placeholder="Ceritakan kepuasan Anda terhadap desain dan pelayanan kami..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl gold-gradient text-black font-semibold font-sans tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
