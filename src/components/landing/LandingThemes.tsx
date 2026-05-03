"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { availableThemes } from "@/config/themes";

export default function LandingThemes() {
  // Hanya tampilkan maksimal 3 tema di beranda
  const themes = availableThemes.slice(0, 3);

  return (
    <section id="themes" className="py-24 bg-linear-to-b from-[#20150f] to-[#1a110c] relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading text-4xl md:text-5xl text-white mb-4"
            >
              Koleksi <span className="gold-text">Tema Premium</span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-24 h-1 gold-gradient mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-white/70 font-body text-lg"
            >
              Pilih desain yang paling mencerminkan kepribadian dan tema pernikahan Anda.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="#contact"
              className="flex items-center gap-2 text-[rgb(var(--color-primary))] hover:text-white transition-colors font-sans text-sm tracking-widest uppercase group"
            >
              Request Tema Custom
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {themes.map((theme, index) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group rounded-2xl overflow-hidden glass border border-white/5"
            >
              <div className="relative aspect-3/4 overflow-hidden">
                {theme.badge && (
                  <div className="absolute top-4 right-4 z-20 gold-gradient text-black text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                    {theme.badge}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <Image
                  src={theme.image}
                  alt={theme.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
                  <Link
                    href={theme.link}
                    className="px-8 py-3 rounded-full border border-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))] hover:text-black transition-all font-sans text-sm tracking-widest uppercase transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 duration-300"
                  >
                    Lihat Demo
                  </Link>
                </div>
              </div>
              
              <div className="p-6 relative z-30 bg-[#20150f]/80 backdrop-blur-sm border-t border-white/5">
                <h3 className="text-2xl font-heading text-white mb-2">{theme.name}</h3>
                <p className="text-white/60 font-body text-sm line-clamp-2">
                  {theme.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex justify-center"
        >
          <Link
            href="/tema"
            className="px-8 py-3 rounded-full border border-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))] hover:text-black transition-all font-sans text-sm tracking-widest uppercase group flex items-center gap-2"
          >
            Lihat Lebih Banyak
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
