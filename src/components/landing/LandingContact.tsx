"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone, Mail } from "lucide-react";

export default function LandingContact() {
  return (
    <section id="contact" className="py-24 bg-linear-to-t from-[#1a110c] to-[#20150f] relative">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 md:p-12 text-center relative overflow-hidden border border-[rgb(var(--color-primary))]/30"
        >
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[rgb(var(--color-primary))]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[rgb(var(--color-secondary))]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-6">
              Mulai Konsultasi <span className="gold-text">Gratis</span>
            </h2>
            <p className="text-white/70 font-body text-lg mb-10 max-w-2xl mx-auto">
              Diskusikan kebutuhan undangan digital Anda dengan tim kami. Kami siap membantu mewujudkan undangan impian Anda.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href="#"
                className="flex items-center gap-3 px-8 py-4 rounded-full gold-gradient text-black font-semibold font-sans text-sm tracking-widest uppercase hover:scale-105 transition-transform w-full sm:w-auto justify-center"
              >
                <MessageCircle className="w-5 h-5" />
                Hubungi via WhatsApp
              </a>
              
              <div className="flex items-center gap-6 mt-6 sm:mt-0">
                <a href="#" className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/70 hover:text-[rgb(var(--color-primary))] hover:border-[rgb(var(--color-primary))]/50 transition-all">
                  <Phone className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/70 hover:text-[rgb(var(--color-primary))] hover:border-[rgb(var(--color-primary))]/50 transition-all">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
