"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Search, Star, TrendingUp, ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { availableThemes } from "@/config/themes";

type ThemePickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectTheme: (themeName: string) => void;
  allowedPackages: string[];
};

type SortOption = "populer" | "termurah" | "termahal" | "rating";

const SORT_OPTIONS: { id: SortOption; label: string; icon: React.ReactNode }[] = [
  { id: "populer", label: "Populer", icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: "rating", label: "Rating", icon: <Star className="w-3.5 h-3.5" /> },
  { id: "termurah", label: "Termurah", icon: <ArrowUpDown className="w-3.5 h-3.5" /> },
  { id: "termahal", label: "Termahal", icon: <ArrowUpDown className="w-3.5 h-3.5 rotate-180" /> },
];

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i <= value ? "text-[rgb(var(--color-primary))] fill-[rgb(var(--color-primary))]" : "text-white/20"}`}
        />
      ))}
    </div>
  );
}

const CATEGORIES = ["Semua", "Jawa", "Elegan", "Religion", "Bunga", "Minimalis", "Tema Gelap", "Tema Cerah", "Lainnya"];

export default function ThemePickerModal({ isOpen, onClose, onSelectTheme, allowedPackages }: ThemePickerModalProps) {
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("populer");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const baseThemes = useMemo(
    () => availableThemes.filter((t) => allowedPackages.includes(t.package)),
    [allowedPackages]
  );

  const displayedThemes = useMemo(() => {
    let list = baseThemes;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "Semua") {
      list = list.filter((t) => t.category === selectedCategory);
    }

    return [...list].sort((a, b) => {
      if (sortBy === "termurah") return a.price - b.price;
      if (sortBy === "termahal") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      const aBadge = a.badge ? 1 : 0;
      const bBadge = b.badge ? 1 : 0;
      return bBadge - aBadge || b.rating - a.rating;
    });
  }, [baseThemes, search, sortBy, selectedCategory]);

  const handleConfirm = () => {
    if (!selectedThemeId) return;
    const theme = displayedThemes.find((t) => t.id === selectedThemeId);
    if (theme) onSelectTheme(theme.name);
    onClose();
  };

  const selectedTheme = displayedThemes.find((t) => t.id === selectedThemeId);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-100 bg-black/75 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", duration: 0.45 }}
            className="fixed inset-4 md:inset-8 lg:inset-12 z-101 flex flex-col bg-[#18100b] border border-white/8 rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
          >
            {/* ── HEADER ── */}
            <div className="shrink-0 bg-[#20150f] border-b border-white/8 px-4 py-4 md:px-6 md:py-5">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h3 className="font-heading text-2xl text-white">
                    Pilih <span className="gold-text">Tema Undangan</span>
                  </h3>
                  <p className="text-white/45 font-sans text-xs mt-1 uppercase tracking-widest">
                    {displayedThemes.length} tema tersedia · Paket {allowedPackages.at(-1)}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 w-9 h-9 rounded-full bg-white/6 flex items-center justify-center text-white/50 hover:bg-white/12 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search + Sort bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama tema atau kategori..."
                    className="w-full bg-[#130c08] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[rgb(var(--color-primary))]/40 transition-colors font-body placeholder:text-white/25"
                  />
                </div>

                {/* Sort pills — scrolls horizontally on mobile */}
                <div className="flex gap-2 shrink-0 overflow-x-auto scrollbar-hide pb-0.5">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSortBy(opt.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans font-semibold uppercase tracking-wide transition-all ${
                        sortBy === opt.id
                          ? "gold-gradient text-black shadow-md"
                          : "bg-white/6 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80"
                      }`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category pills */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-3 pb-0.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-sans font-medium uppercase tracking-wide transition-all ${
                      selectedCategory === cat
                        ? "bg-[rgb(var(--color-primary))]/20 border border-[rgb(var(--color-primary))]/50 text-[rgb(var(--color-primary))]"
                        : "bg-white/5 border border-white/8 text-white/45 hover:bg-white/10 hover:text-white/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* ── GRID ── */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {displayedThemes.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-white/30">
                  <Search className="w-10 h-10" />
                  <p className="font-body text-sm">Tidak ada tema yang cocok.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {displayedThemes.map((theme) => {
                    const isSelected = selectedThemeId === theme.id;
                    return (
                      <motion.div
                        key={theme.id}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        onClick={() => setSelectedThemeId(isSelected ? null : theme.id)}
                        className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? "ring-2 ring-[rgb(var(--color-primary))] ring-offset-2 ring-offset-[#18100b]"
                            : "hover:ring-1 hover:ring-white/25"
                        }`}
                      >
                        {/* Image */}
                        <div className="aspect-3/4 relative overflow-hidden">
                          <Image
                            src={theme.image}
                            alt={theme.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-linear-to-t from-[#130c08] via-[#130c08]/40 to-transparent" />

                          {/* Selected checkmark */}
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.7 }}
                                className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
                              >
                                <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center shadow-xl">
                                  <Check className="w-7 h-7 text-black" strokeWidth={3} />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Badges – top right */}
                          <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                            {theme.badge && (
                              <span className="gold-gradient text-black text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-md">
                                {theme.badge}
                              </span>
                            )}
                            <span className="bg-black/60 backdrop-blur text-white/80 text-[10px] font-sans px-2.5 py-1 rounded-full border border-white/10">
                              {theme.category}
                            </span>
                          </div>

                          {/* Info – bottom */}
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h4 className="font-heading text-lg text-white leading-tight mb-1">{theme.name}</h4>
                            <div className="flex items-center justify-between">
                              <StarRating value={theme.rating} />
                              <span className="font-sans text-xs text-[rgb(var(--color-primary))] font-semibold">
                                Rp {theme.price}.000
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── FOOTER ── */}
            <div className="shrink-0 bg-[#20150f] border-t border-white/8 px-4 py-3 md:px-6 md:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Selected info */}
              <div className="min-w-0">
                {selectedTheme ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[rgb(var(--color-primary))]/30">
                      <Image src={selectedTheme.image} alt={selectedTheme.name} width={40} height={40} className="object-cover w-full h-full" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans text-[10px] uppercase tracking-widest text-white/40">Terpilih</p>
                      <p className="font-heading text-base text-[rgb(var(--color-primary))] truncate">{selectedTheme.name}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-white/35 font-body text-sm">Belum ada tema yang dipilih</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 shrink-0 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-white/15 text-white/60 font-sans text-sm tracking-wider uppercase hover:bg-white/6 hover:text-white transition-all text-center"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedThemeId}
                  className={`flex-1 sm:flex-none px-7 py-2.5 rounded-xl font-sans font-semibold text-sm tracking-wider uppercase transition-all text-center ${
                    selectedThemeId
                      ? "gold-gradient text-black hover:scale-[1.03] shadow-md shadow-[rgb(var(--color-primary))]/20"
                      : "bg-white/8 text-white/25 cursor-not-allowed"
                  }`}
                >
                  Pilih Tema Ini
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
