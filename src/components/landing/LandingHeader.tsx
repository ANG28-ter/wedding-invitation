"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import OrderModal from "./OrderModal";

export default function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Fitur", href: "#features" },
    { name: "Tema", href: "#themes" },
    { name: "Harga", href: "#pricing" },
    { name: "Kontak", href: "/kontak" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-[#20150f]/90 backdrop-blur-md shadow-lg py-3" : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo/logo-akadev.png"
            alt="Akadev Logo"
            width={120}
            height={40}
            className="h-18 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-white/80 hover:text-[rgb(var(--color-primary))] transition-colors font-sans text-sm tracking-widest uppercase"
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 rounded-full border border-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))] hover:text-black transition-all font-sans text-sm tracking-widest uppercase"
          >
            Pesan Sekarang
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <motion.div
        initial={false}
        animate={{ height: isMobileMenuOpen ? "auto" : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
        className="md:hidden overflow-hidden bg-[#20150f] border-t border-white/10"
      >
        <div className="flex flex-col items-center py-6 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white/80 hover:text-[rgb(var(--color-primary))] transition-colors font-sans text-sm tracking-widest uppercase"
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsModalOpen(true);
            }}
            className="px-8 py-3 mt-2 rounded-full gold-gradient text-black font-semibold font-sans text-sm tracking-widest uppercase"
          >
            Pesan Sekarang
          </button>
        </div>
      </motion.div>

      <OrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        preselectedPackage="Premium" 
      />
    </header>
  );
}
