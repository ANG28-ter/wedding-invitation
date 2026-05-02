import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LandingFooter from "@/components/landing/LandingFooter";
import PortofolioClient from "./PortofolioClient";
import TestimonialSection from "./TestimonialSection";

export const metadata: Metadata = {
  title: "Portofolio",
  description: "Lihat koleksi undangan digital premium yang telah kami buat untuk berbagai pasangan bahagia.",
};

export default async function PortofolioPage() {
  const invitations = await prisma.invitation.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      groomName: true,
      brideName: true,
      theme: true,
      package: true,
      rating: true,
      coverImage: true,
      createdAt: true,
    },
  });

  const testimonials = await prisma.testimonial.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      role: true,
      message: true,
      rating: true,
      createdAt: true,
      invitation: {
        select: { slug: true }
      }
    },
  });

  const availableInvitations = invitations.map(inv => ({
    id: inv.id,
    name: `${inv.groomName} & ${inv.brideName}`
  }));

  return (
    <main className="min-h-screen bg-[#20150f] text-white">
      {/* Simple Header for Portfolio Page */}
      <header className="bg-[#1a110c] py-6 border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-[rgb(var(--color-primary))] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-sans text-sm tracking-widest uppercase">Kembali</span>
          </Link>
          <div className="font-heading text-2xl text-white">
            Portofolio <span className="gold-text">Akadev</span>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </header>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">
              Karya <span className="gold-text">Terbaik Kami</span>
            </h1>
            <div className="w-24 h-1 gold-gradient mx-auto mb-6" />
            <p className="text-white/70 font-body text-lg max-w-2xl mx-auto mb-8">
              Berbagai pasangan telah mempercayakan momen bahagia mereka kepada kami. Berikut adalah beberapa hasil desain undangan digital yang telah kami buat.
            </p>
          </div>

          <TestimonialSection initialTestimonials={testimonials} availableInvitations={availableInvitations} />

          <PortofolioClient initialData={invitations} />
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
