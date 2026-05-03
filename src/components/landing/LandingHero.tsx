"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

export default function LandingHero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-[#20150f] via-[#20150f]/80 to-[#20150f] z-10" />
        <div
          className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center"
        />
        {/* Decorative Circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgb(var(--color-primary))]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgb(var(--color-secondary))]/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4"
        >
          <span className="font-sans text-[rgb(var(--color-primary))] tracking-[0.2em] text-sm uppercase">
            Undangan Digital Premium
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-heading text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight"
        >
          Momen Spesial Anda, <br />
          <span className="font-decorative gold-text text-6xl md:text-8xl lg:text-9xl">
            Abadi Selamanya
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/70 font-body text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Bagikan kebahagiaan Anda dengan undangan digital eksklusif yang dirancang khusus untuk memukau setiap tamu undangan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="#themes"
            className="w-full sm:w-auto px-8 py-4 rounded-full gold-gradient text-black font-semibold font-sans text-sm tracking-widest uppercase hover:scale-105 transition-transform"
          >
            Lihat Tema
          </Link>
          <Link
            href="https://wa.me/6289615284595"
            className="w-full sm:w-auto px-8 py-4 rounded-full glass text-white font-semibold font-sans text-sm tracking-widest uppercase hover:bg-white/10 transition-colors border border-[rgb(var(--color-primary))]/30"
          >
            Konsultasi Gratis
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce"
      >
        <Link href="#features" className="text-white/50 hover:text-[rgb(var(--color-primary))] transition-colors">
          <ArrowDown size={32} />
        </Link>
      </motion.div>
    </section>
  );
}
