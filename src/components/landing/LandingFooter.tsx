"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, MapPin, Mail, Phone } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="bg-[#1a110c] pt-20 pb-10 border-t border-[rgb(var(--color-primary))]/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-22 mb-16">
          <div className="md:col-span-2">
            <Link href="#home" className="inline-block mb-6">
              <Image
                src="/logo/logo-akadev.png"
                alt="Akadev Logo"
                width={150}
                height={50}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-white/60 font-body text-sm leading-relaxed max-w-md mb-8">
              Akadev juga penyedia layanan undangan digital premium yang berdedikasi untuk membuat momen spesial Anda menjadi lebih berkesan, elegan, dan abadi.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/akadev.invitation" className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-[rgb(var(--color-primary))] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-xl text-white mb-6">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/60 font-body text-sm">
                <MapPin className="w-5 h-5 text-[rgb(var(--color-primary))] shrink-0" />
                <span>Kota Kediri, Jawa Timur Indonesia</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 font-body text-sm">
                <Phone className="w-5 h-5 text-[rgb(var(--color-primary))] shrink-0" />
                <span>+62 896-1528-4595</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 font-body text-sm">
                <Mail className="w-5 h-5 text-[rgb(var(--color-primary))] shrink-0" />
                <span>invitationakadev@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 font-body text-xs">
            © {new Date().getFullYear()} Akadev. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
