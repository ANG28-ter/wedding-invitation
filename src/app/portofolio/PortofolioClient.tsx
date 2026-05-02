"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronDown, Filter } from "lucide-react";
import { submitRating } from "@/app/actions/rating";

type InvitationItem = {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  theme: string;
  package: string;
  rating: number;
  coverImage: string | null;
  createdAt: Date;
};

export default function PortofolioClient({ initialData }: { initialData: InvitationItem[] }) {
  const [data, setData] = useState<InvitationItem[]>(initialData);
  const [selectedTheme, setSelectedTheme] = useState<string>("All");
  const [selectedPackage, setSelectedPackage] = useState<string>("All");
  const [isPopularOnly, setIsPopularOnly] = useState<boolean>(false);
  const [submittingRating, setSubmittingRating] = useState<string | null>(null);

  // Extract unique themes and packages for filter options
  const uniqueThemes = ["All", ...Array.from(new Set(initialData.map((inv) => inv.theme)))];
  const uniquePackages = ["All", ...Array.from(new Set(initialData.map((inv) => inv.package)))];

  // Filtered data logic
  const filteredData = data.filter((inv) => {
    const matchTheme = selectedTheme === "All" || inv.theme === selectedTheme;
    const matchPackage = selectedPackage === "All" || inv.package === selectedPackage;
    const matchPopular = !isPopularOnly || inv.rating >= 4.5;
    return matchTheme && matchPackage && matchPopular;
  });

  const handleRate = async (id: string, newRating: number) => {
    setSubmittingRating(id);
    const result = await submitRating(id, newRating);
    if (result.success && result.newRating) {
      setData((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, rating: result.newRating as number } : inv))
      );
    } else {
      alert(result.error || "Gagal memberi rating");
    }
    setSubmittingRating(null);
  };

  return (
    <>
      {/* Filter Options Bar */}
      <div className="bg-[#1a110c] p-6 rounded-2xl border border-white/10 mb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-3 text-white/80">
          <Filter className="w-5 h-5 text-[rgb(var(--color-primary))]" />
          <span className="font-heading text-lg">Filter Portofolio</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Theme Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full sm:w-48 appearance-none bg-[#2a1d15] border border-white/10 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[rgb(var(--color-primary))]/50 transition-colors cursor-pointer text-sm font-sans"
            >
              <option value="All">Semua Tema</option>
              {uniqueThemes.filter(t => t !== "All").map(theme => (
                <option key={theme} value={theme}>Tema: {theme.replace("-", " ")}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
          </div>

          {/* Package Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="w-full sm:w-48 appearance-none bg-[#2a1d15] border border-white/10 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[rgb(var(--color-primary))]/50 transition-colors cursor-pointer text-sm font-sans"
            >
              <option value="All">Semua Paket</option>
              {uniquePackages.filter(p => p !== "All").map(pkg => (
                <option key={pkg} value={pkg}>Paket: {pkg}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
          </div>

          {/* Popular Toggle */}
          <label className="flex items-center gap-3 cursor-pointer group flex-1 sm:flex-none bg-[#2a1d15] px-4 py-2.5 rounded-xl border border-white/10 hover:border-[rgb(var(--color-primary))]/30 transition-colors">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={isPopularOnly}
                onChange={(e) => setIsPopularOnly(e.target.checked)}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${isPopularOnly ? 'bg-[rgb(var(--color-primary))]' : 'bg-white/10'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isPopularOnly ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className={`text-sm font-sans ${isPopularOnly ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
              Populer (&ge;4.5)
            </span>
          </label>
        </div>
      </div>

      {/* Portofolio Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center py-20 text-white/50 font-body">
            Belum ada portofolio yang dapat ditampilkan.
          </div>
        ) : (
          filteredData.map((inv) => (
            <div key={inv.id} className="group rounded-2xl overflow-hidden glass border border-white/5 flex flex-col">
              <div className="relative aspect-3/4 overflow-hidden bg-black/20">
                {inv.coverImage ? (
                  <Image
                    src={inv.coverImage}
                    alt={`${inv.groomName} & ${inv.brideName}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-[#20150f] to-[rgb(var(--color-primary))]/20">
                    <span className="font-heading text-4xl text-white/20">
                      {inv.groomName[0]}&{inv.brideName[0]}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
                  <Link
                    href={`/${inv.slug}`}
                    className="px-8 py-3 rounded-full border border-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))] hover:text-black transition-all font-sans text-sm tracking-widest uppercase transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 duration-300"
                  >
                    Lihat Undangan
                  </Link>
                </div>
              </div>

              <div className="p-6 relative z-30 bg-[#1a110c]/80 backdrop-blur-sm border-t border-white/5 grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <Link href={`/${inv.slug}`} className="hover:opacity-80 transition-opacity">
                      <h3 className="text-2xl font-heading text-white hover:text-[rgb(var(--color-primary))] transition-colors inline-block">
                        {inv.groomName} & {inv.brideName}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-md">
                      <Star className="w-4 h-4 text-[rgb(var(--color-primary))] fill-[rgb(var(--color-primary))]" />
                      <span className="text-white/90 text-sm font-sans font-medium">{inv.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="inline-block mt-2 mb-4">
                    <span className="text-xs font-sans tracking-wider uppercase px-3 py-1 rounded-full border border-[rgb(var(--color-primary))]/30 text-[rgb(var(--color-secondary))] bg-[rgb(var(--color-primary))]/10 mr-2 mb-2 inline-block">
                      Tema: {inv.theme.replace("-", " ")}
                    </span>
                    <span className="text-xs font-sans tracking-wider uppercase px-3 py-1 rounded-full border border-white/20 text-white/70 bg-white/5 mr-2 mb-2 inline-block">
                      Paket: {inv.package}
                    </span>
                    <span className="text-xs font-sans text-white/50 block mt-1">
                      {new Date(inv.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                
                {/* Rating Input Area */}
                <div className="pt-4 border-t border-white/10 mt-auto">
                  <p className="text-xs text-white/50 mb-2 font-sans">Beri nilai tema ini:</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRate(inv.id, star)}
                        disabled={submittingRating === inv.id}
                        className="group/star p-1 focus:outline-none disabled:opacity-50"
                        title={`Beri rating ${star}`}
                      >
                        <Star className="w-5 h-5 text-white/20 group-hover/star:text-[rgb(var(--color-primary))] transition-colors" />
                      </button>
                    ))}
                    {submittingRating === inv.id && <span className="ml-2 text-xs text-[rgb(var(--color-primary))] animate-pulse">Menyimpan...</span>}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
