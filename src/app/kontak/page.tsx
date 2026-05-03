import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LandingFooter from "@/components/landing/LandingFooter";
import KontakClient from "./KontakClient";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description: "Kontak layanan pelanggan Akadev Invitation. Konsultasikan kebutuhan undangan digital Anda bersama tim kami.",
};

export default function KontakPage() {
  return (
    <main className="min-h-screen bg-[#20150f] text-white selection:bg-[rgb(var(--color-primary))] selection:text-black">
      {/* Header */}
      <header className="bg-[#1a110c] py-6 border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-[rgb(var(--color-primary))] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-sans text-sm tracking-widest uppercase">Beranda</span>
          </Link>
          <div className="font-heading text-2xl text-white">
            Hubungi <span className="gold-text">Kami</span>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1500&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-linear-to-b from-[#20150f] via-transparent to-[#20150f]"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            Kami Siap <span className="gold-text">Membantu Anda</span>
          </h1>
          <div className="w-24 h-1 gold-gradient mx-auto mb-6" />
          <p className="text-white/70 font-body text-lg max-w-2xl mx-auto">
            Jangan ragu untuk menghubungi kami jika Anda memiliki pertanyaan, butuh konsultasi desain, atau ingin langsung memesan undangan digital impian Anda.
          </p>
        </div>
      </section>

      {/* Interactive Content */}
      <KontakClient />

      <LandingFooter />
    </main>
  );
}
