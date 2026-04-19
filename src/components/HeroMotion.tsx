"use client";

import { motion } from "framer-motion";

export function HeroBreath({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollHint() {
  return (
    <motion.div
      animate={{ y: [0, 8, 0], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      className="flex flex-col items-center gap-2 pt-10 opacity-80"
    >
      <span className="text-xs tracking-[0.25em] text-shadow-lg">SCROLL</span>
      <span className="text-xl text-shadow-lg">↓</span>
    </motion.div>
  );
}
