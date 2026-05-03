"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Filter, ChevronDown, LayoutGrid, ShoppingBag } from "lucide-react";
import { ThemeItem } from "@/config/themes";
import OrderWizard from "@/components/theme/OrderWizard";

export default function TemaClient({ initialData }: { initialData: ThemeItem[] }) {
  const [selectedPackage, setSelectedPackage] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeItem | null>(null);

  const packages = ["All", "Basic", "Premium", "Exclusive"];
  const categories = [
    "All",
    "Jawa",
    "Elegan",
    "Religion",
    "Bunga",
    "Minimalis",
    "Tema Gelap",
    "Tema Cerah",
    "Lainnya",
  ];

  const filteredThemes = initialData.filter((theme) => {
    const matchPackage = selectedPackage === "All" || theme.package === selectedPackage;
    const matchCategory = selectedCategory === "All" || theme.category === selectedCategory;
    return matchPackage && matchCategory;
  });

  const handleSelectTheme = (theme: ThemeItem) => {
    setSelectedTheme(theme);
    setIsWizardOpen(true);
  };

  return (
    <>
      {/* Package Tabs */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
        {packages.map((pkg) => (
          <button
            key={pkg}
            onClick={() => setSelectedPackage(pkg)}
            className={`px-6 py-3 rounded-full font-sans text-sm tracking-widest uppercase transition-all duration-300 ${selectedPackage === pkg
                ? "gold-gradient text-black font-semibold shadow-lg shadow-[rgb(var(--color-primary))]/20 scale-105"
                : "bg-[#1a110c] text-white/70 border border-white/10 hover:border-[rgb(var(--color-primary))]/50 hover:text-white"
              }`}
          >
            {pkg === "All" ? "Semua Paket" : pkg}
          </button>
        ))}
      </div>

      {/* Filter Options */}
      <div className="bg-[#1a110c] p-6 rounded-2xl border border-white/10 mb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-3 text-white/80">
          <Filter className="w-5 h-5 text-[rgb(var(--color-primary))]" />
          <span className="font-heading text-lg">Saring Kategori</span>
        </div>

        <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-sans transition-colors border ${selectedCategory === cat
                    ? "bg-[rgb(var(--color-primary))]/20 border-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))]"
                    : "bg-[#2a1d15] border-white/10 text-white/70 hover:border-white/30"
                  }`}
              >
                {cat === "All" ? "Semua" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredThemes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/50">
            <LayoutGrid className="w-16 h-16 mb-4 text-white/20" />
            <p className="font-body text-lg">Belum ada tema yang sesuai dengan filter Anda.</p>
            <button
              onClick={() => { setSelectedPackage("All"); setSelectedCategory("All"); }}
              className="mt-6 px-6 py-2 rounded-full border border-[rgb(var(--color-primary))]/50 text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/10 transition-colors font-sans text-sm"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          filteredThemes.map((theme, index) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group rounded-2xl overflow-hidden glass border border-white/5 flex flex-col"
            >
              <div className="relative aspect-3/4 overflow-hidden bg-black/20">
                {theme.badge && (
                  <div className="absolute top-4 right-4 z-20 gold-gradient text-black text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-lg">
                    {theme.badge}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <Image
                  src={theme.image}
                  alt={theme.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
                  <Link
                    href={theme.link}
                    className="px-8 py-3 rounded-full border border-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))] hover:text-black transition-all font-sans text-sm tracking-widest uppercase transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 duration-300 shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_20px_rgba(var(--color-primary),0.6)]"
                  >
                    Lihat Demo
                  </Link>
                </div>
              </div>

              <div className="p-6 relative z-30 bg-[#20150f]/80 backdrop-blur-sm border-t border-white/5 grow flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-heading text-white mb-2">{theme.name}</h3>
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs font-sans tracking-wider uppercase px-2.5 py-1 rounded-md border border-[rgb(var(--color-primary))]/30 text-[rgb(var(--color-secondary))] bg-[rgb(var(--color-primary))]/10">
                      {theme.package}
                    </span>
                    <span className="text-xs font-sans tracking-wider uppercase px-2.5 py-1 rounded-md border border-white/20 text-white/70 bg-white/5">
                      {theme.category}
                    </span>
                  </div>
                  <p className="text-white/60 font-body text-sm line-clamp-2 mt-2">
                    {theme.description}
                  </p>
                  
                  <button
                    onClick={() => handleSelectTheme(theme)}
                    className="mt-6 w-full py-4 rounded-xl gold-gradient text-black font-bold font-sans text-sm tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg shadow-[rgb(var(--color-primary))]/10"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Pilih Tema
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <OrderWizard 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        selectedTheme={selectedTheme}
      />
    </>
  );
}
