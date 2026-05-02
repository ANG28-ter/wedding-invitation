"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type LandingPortfolioProps = {
  invitationsCount: number;
};

export default function LandingPortfolio({ invitationsCount }: LandingPortfolioProps) {
  // Array of placeholder images for the grid
  const portfolioImages = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop",
  ];

  return (
    <section className="py-24 bg-[#20150f] relative overflow-hidden flex items-center min-h-[80vh]">
      {/* Background/Left Image */}
      <div className="absolute left-0 top-0 bottom-0 w-full md:w-1/2 h-full z-0 opacity-30 md:opacity-100">
        <div className="relative w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1500&auto=format&fit=crop"
            alt="Wedding Couple"
            fill
            className="object-cover object-center"
          />
          {/* Gradient to blend image with background */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#20150f]/80 to-[#20150f]"></div>
          <div className="absolute inset-0 bg-linear-to-t from-[#20150f] via-transparent to-[#20150f]"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-end">
          {/* Right Content */}
          <div className="w-full md:w-[60%] lg:w-[55%]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 text-center md:text-left"
            >
              <h2 className="font-heading text-4xl md:text-5xl text-white mb-4 leading-tight">
                <span className="gold-text text-5xl md:text-6xl font-bold">{invitationsCount}+</span> <br className="md:hidden" />
                Pasangan Berbahagia
              </h2>
              <p className="text-white/70 font-body text-lg">
                Dari berbagai daerah telah mempercayakan momen bahagianya bersama kami. Kini giliran Anda untuk mewujudkan undangan impian.
              </p>
            </motion.div>

            {/* Grid Portofolio */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-10"
            >
              {portfolioImages.map((src, idx) => (
                <div key={idx} className="relative aspect-3/4 rounded-xl overflow-hidden group">
                  <Image
                    src={src}
                    alt={`Portofolio ${idx + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <Link
                href="/portofolio"
                className="px-8 py-3 rounded-full gold-gradient text-black font-semibold font-sans text-sm tracking-widest uppercase hover:scale-105 transition-transform text-center"
              >
                Lihat Portofolio
              </Link>
              <Link
                href="#contact"
                className="px-8 py-3 rounded-full glass text-white font-semibold font-sans text-sm tracking-widest uppercase hover:bg-white/10 transition-colors border border-[rgb(var(--color-primary))]/30 text-center"
              >
                Buat Sekarang
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
