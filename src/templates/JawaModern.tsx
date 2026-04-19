"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import CoverCard from "@/components/CoverCard";
import { TemplateProps } from "./types";
import SideNavigation from "@/components/SideNavigation";
import StoryTimeline from "@/components/StoryTimeline";
import PhotoGallery from "@/components/PhotoGallery";
import CountdownTimer from "@/components/CountdownTimer";
import RsvpForm from "@/components/RsvpForm";
import Guestbook from "@/components/Guestbook";
import AudioPlayer from "@/components/AudioPlayer";
import { Story, Event } from "@prisma/client";

export default function JawaModern({ data }: TemplateProps) {
  const [coverOpen, setCoverOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [rsvpCount, setRsvpCount] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  // Find events for specific sections
  const akadEvent = data.events?.find((e: Event) => e.type === "AKAD");
  const resepsiEvent = data.events?.find((e: Event) => e.type === "RESEPSI");

  // Fetch RSVP count
  useEffect(() => {
    if (!data.slug) return;
    fetch(`/api/public/invitations/${encodeURIComponent(data.slug)}/rsvp`)
      .then((r) => r.json())
      .then((json) => {
        const items = json?.data ?? json ?? [];
        if (Array.isArray(items)) setRsvpCount(items.length);
      })
      .catch(() => { });
  }, [data.slug]);

  return (
    <>
      <CoverCard
        isOpen={coverOpen}
        onOpen={() => setCoverOpen(true)}
        groomName={data.groomName}
        brideName={data.brideName}
        coverImage={data.coverImage}
      />

      <motion.main
        initial={{ opacity: 0 }}
        animate={coverOpen ? { opacity: 1 } : { opacity: 0 }}
        className="w-full min-h-screen bg-[#20150f] flex justify-center"
      >
        {/* FRAME */}
        <div
          className="w-full max-w-[430px] min-h-svh relative overflow-hidden text-white"
          style={{
            backgroundImage: "url('/ornaments/background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >

          {/* ================= HERO ================= */}
          <section id="hero" className="relative w-full h-svh max-h-[900px] overflow-hidden flex items-center justify-center">

            {/* BASE TEXTURE/COLOR (Visible through transparency if no photo) */}
            <div className="absolute inset-0 opacity-30 z-0 " />

            {/* HERO PHOTO (Inside the torn paper) */}
            {data.heroImage && (
              <div className="absolute inset-0 z-10 overflow-hidden">
                <img
                  src={data.heroImage}
                  alt="Hero Couple"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            )}

            {/* FRAME OVERLAY (hero_background.png with transparency) */}
            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{
                backgroundImage: "url('/jawa_modern/hero_background.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* BURUNG */}
            <motion.img
              src="/jawa_modern/Burung.png"
              className="absolute top-[-2%] left-[-15%] w-[55%] z-30 pointer-events-none origin-center"
              initial={{ x: -100, opacity: 0 }}
              animate={
                coverOpen
                  ? {
                    x: 0,
                    opacity: 1,
                    y: [0, -8, 2, -4, 0],
                    rotate: [0, -1.5, 1, -0.5, 0],
                    scale: [1, 1.02, 0.98, 1.01, 1]
                  }
                  : { x: -100, opacity: 0 }
              }
              transition={{
                x: { duration: 2.5, ease: "easeOut" },
                opacity: { duration: 2.5 },
                y: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2.5 },
                rotate: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2.5 },
                scale: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2.5 }
              }}
            />

            {/* GUNUNGAN */}
            <motion.img
              src="/ornaments/gunungan-1.png"
              className="absolute bottom-[18%] right-[-1%] w-[25%] z-30 pointer-events-none origin-bottom"
              initial={{ x: 100, opacity: 0 }}
              animate={
                coverOpen
                  ? {
                    x: 0,
                    opacity: 1,
                    y: [0, -3, 1, -2, 0],
                    rotate: [0, 1.5, -1, 0.5, 0],
                    skewX: [0, 0.8, -0.5, 0.3, 0],
                    scale: [1, 1.01, 0.99, 1.005, 1]
                  }
                  : { x: 100, opacity: 0 }
              }
              transition={{
                x: { duration: 2.5, ease: "easeOut", delay: 0.5 },
                opacity: { duration: 2.5, delay: 0.5 },
                y: { duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 },
                rotate: { duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 },
                skewX: { duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 },
                scale: { duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }
              }}
            />

            {/* FLORAL */}
            <motion.img
              src="/ornaments/rantai-daun-1.png"
              className="absolute bottom-[-12%] right-[-2%] w-[70%] z-25 pointer-events-none origin-bottom-right"
              initial={{ x: 100, opacity: 0 }}
              animate={
                coverOpen
                  ? {
                    x: 0,
                    opacity: 1,
                    rotate: [0, 2, -1.5, 1, 0],
                    skewY: [0, 1, -1, 0.5, 0],
                    scale: [1, 1.02, 0.98, 1.01, 1]
                  }
                  : { x: 100, opacity: 0 }
              }
              transition={{
                x: { duration: 3, ease: "easeOut", delay: 0.2 },
                opacity: { duration: 3, delay: 0.2 },
                rotate: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3.2 },
                skewY: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3.2 },
                scale: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3.2 }
              }}
            />

            {/* NAMES */}
            <div className="absolute top-[13%] right-[20%] text-right z-40 ">
              <motion.h1
                className="text-[#e3d3b7] text-[38px] leading-[0.8]"
                style={{ fontFamily: "var(--font-lostar), serif" }}
                initial="hidden"
                animate={coverOpen ? "visible" : "hidden"}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1, delayChildren: 1.5 }
                  }
                }}
              >
                <span className="block">
                  {(data.groomName || "").split("").map((char, i) => (
                    <motion.span key={`g-${i}`} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                  <motion.span variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="text-[38px] ml-2">
                    &
                  </motion.span>
                </span>
                <span className="block mt-2 ml-[30%]">
                  {(data.brideName || "").split("").map((char, i) => (
                    <motion.span key={`b-${i}`} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </span>
              </motion.h1>
            </div>

            {/* QUOTE */}
            {data.openingQuote && (
              <motion.div
                className="absolute bottom-0 left-[16px] right-[16px] max-w-[280px] z-50"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                initial={{ opacity: 0, y: 15 }}
                animate={coverOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 1.5, delay: 2.8, ease: "easeOut" }}
              >
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/60 font-bold mb-1">
                  Allah’s blessings message:
                </p>

                <blockquote className="text-[10px] font-light leading-[1.6] italic text-white/90">
                  {data.openingQuote}
                </blockquote>

                {data.openingQuoteAuthor && (
                  <cite className="block mt-2 text-[10px] text-white not-italic font-bold">
                    ({data.openingQuoteAuthor})
                  </cite>
                )}
              </motion.div>
            )}

          </section>

          {/* ================= COUPLE ================= */}
          <section id="couple" className="relative w-full h-svh max-h-[850px] overflow-hidden">

            {/* BG */}
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: "url('/jawa_modern/background_pengantin.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* WRAPPER SINTA */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-10%" }}
              variants={{
                hidden: { x: -150, opacity: 0 },
                visible: { x: 0, opacity: 1, transition: { duration: 1, ease: "easeOut" } }
              }}
              className="absolute top-[5%] w-[95%] z-10"
            >
              <div className="relative w-full">
                {/* SINTA TEXT (AS BG) */}
                <div
                  aria-hidden="true"
                  className="w-full relative z-10 aspect-9/16"
                >
                  {/* Width/offset dibuat mengikuti area non-transparan pada `teks-sinta.png` */}
                  <div
                    className="absolute top-[18%] right-[3.9%] w-[82.3%] h-[21%] rounded-r-[18px] bg-[#20150f] shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                  />
                </div>

                {/* TEXT OVERLAY */}
                <div className="absolute inset-0 z-15 flex flex-col justify-start pt-[36.5%] pl-[28%] pr-8">
                  <motion.h2
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.5 } }
                    }}
                    className="text-[#e3d3b7] text-[45px] leading-[0.7]"
                    style={{ fontFamily: "var(--font-upakarti), serif" }}
                  >
                    {data.brideName}
                  </motion.h2>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { duration: 1, delay: 0.8 } }
                    }}
                    className="text-[#e3d3b7]"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <p className="text-[10px] tracking-widest opacity-90 mb-1">
                      {data.brideHandle || `@${data.brideName?.toLowerCase().replace(/\s/g, '_')}`}
                    </p>
                    <p className="text-[8px] uppercase tracking-widest opacity-90 mt-2">Putri dari:</p>
                    <p className="text-[10px] font-medium leading-tight max-w-[160px]">
                      {data.brideParents}
                    </p>
                    {data.brideLocation && (
                      <p className="text-[8px] uppercase tracking-widest opacity-70 mt-2 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                        {data.brideLocation}
                      </p>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* WAYANG SINTA */}
              <motion.img
                variants={{
                  hidden: { opacity: 0, scale: 0.8, rotate: -10 },
                  visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1, type: "spring", stiffness: 50, delay: 0.3 } }
                }}
                src="/jawa_modern/Sinta.png"
                className="absolute top-[6%] left-[-17%] w-[51%] z-20 pointer-events-none"
              />
            </motion.div>

            {/* WRAPPER RAMA */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-10%" }}
              variants={{
                hidden: { x: 150, opacity: 0 },
                visible: { x: 0, opacity: 1, transition: { duration: 1, ease: "easeOut", delay: 0.2 } }
              }}
              className="absolute bottom-[5%] right-0 w-[95%] z-10"
            >
              <div className="relative w-full">
                {/* RAMA TEXT (AS BG) */}
                <div
                  aria-hidden="true"
                  className="w-full relative z-10 aspect-9/16"
                >
                  {/* Width/offset dibuat mengikuti area non-transparan pada `teks-rama.png` */}
                  <div
                    className="absolute bottom-[30%] left-[2.0%] w-[82.3%] h-[21%] rounded-l-[18px] bg-[#20150f] shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                  />
                </div>

                {/* TEXT OVERLAY */}
                <div className="absolute inset-0 z-15 flex flex-col pt-[91.5%] items-end pr-[28%] pl-8 text-right">
                  <motion.h2
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.7 } }
                    }}
                    className="text-[#e3d3b7] text-[45px] leading-[0.7]"
                    style={{ fontFamily: "var(--font-upakarti), serif" }}
                  >
                    {data.groomName}
                  </motion.h2>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { duration: 1, delay: 1.0 } }
                    }}
                    className="text-[#e3d3b7]"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <p className="text-[10px] tracking-widest opacity-90 mb-2">
                      {data.groomHandle || `@${data.groomName?.toLowerCase().replace(/\s/g, '_')}`}
                    </p>
                    <p className="text-[8px] uppercase tracking-widest opacity-90">Putra dari:</p>
                    <p className="text-[10px] font-medium leading-tight max-w-[160px]">
                      {data.groomParents}
                    </p>
                    {data.groomLocation && (
                      <p className="text-[8px] uppercase tracking-widest opacity-70 mt-2 flex items-center justify-end gap-1">
                        {data.groomLocation}
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                      </p>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* WAYANG RAMA */}
              <motion.img
                variants={{
                  hidden: { opacity: 0, scale: 0.8, rotate: 10 },
                  visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1, type: "spring", stiffness: 50, delay: 0.6 } }
                }}
                src="/jawa_modern/Rama.png"
                className="absolute bottom-[17.5%] right-[-15%] w-[46%] z-20 pointer-events-none"
              />
            </motion.div>

          </section>

          {/* ================= OUR STORY ================= */}
          <section id="story" className="relative w-full py-10 bg-[#20150f] overflow-hidden ">
            {/* Title */}
            <div className="text-center mb-10 px-6">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-[#e3d3b7] text-[32px] italic leading-tight drop-shadow-lg"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Our Love Story
              </motion.h2>
            </div>

            {/* Story Grid / Horizontal Scroll */}
            <div className="flex overflow-x-auto pb-10 px-8 hide-scrollbar snap-x snap-mandatory">
              {[
                { id: "beginning", title: "Beginning" },
                { id: "first-date", title: "First Date" },
                { id: "proposal", title: "The Proposal" },
                { id: "wedding", title: "Our Wedding" },
              ].map((step, idx) => {
                // Find matching story from data.stories by title or index
                const story = data.stories?.find(
                  (s) => s.title?.toLowerCase() === step.title.toLowerCase()
                ) || data.stories?.[idx];

                // If no image uploaded for this milestone, don't render the frame based on user comment
                if (!story?.imageUrl) return null;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="shrink-0 w-[240px] flex flex-col items-center snap-center cursor-pointer group"
                    onClick={() => {
                      // Find index of this story in the data.stories array
                      const actualIdx = data.stories?.findIndex(s => s.id === story.id);
                      setSelectedStoryIndex(actualIdx !== -1 ? actualIdx : idx);
                    }}
                  >
                    {/* Framed Image */}
                    <div className="relative w-[220px] aspect-square flex items-center justify-center">
                      {/* Real Photo */}
                      <div className="w-[72px] h-[72px] rounded-full overflow-hidden z-10">
                        <img
                          src={story.imageUrl}
                          alt={step.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Ornament Frame (Bingkai.png) */}
                      <div
                        className="absolute inset-0 z-20 pointer-events-none right-[7%] bottom-[7%]"
                        style={{
                          backgroundImage: "url('/jawa_modern/Bingkai.png')",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat"
                        }}
                      />
                    </div>

                    {/* Label */}
                    <p
                      className="text-[#e3d3b7] text-[12px] tracking-wider"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {step.title}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* ================= GALLERY ================= */}
          <div id="gallery">
            <PhotoGallery images={data.mediaItems?.map(item => item.url) || []} />
          </div>

          {/* ================= SAVE THE DATE & EVENTS ================= */}
          <section id="events" className="relative w-full pt-22 overflow-hidden flex flex-col items-center">
            {/* Ornament Layering */}
            <div className="relative w-full flex flex-col items-center">
              {/* Gunungan Background (Large) — slide up + scale in, then breathe loop */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
                className="absolute top-[4%] w-full max-w-[55%] z-0 pointer-events-none"
              >
                <motion.img
                  src="/jawa_modern/gunungan.png"
                  alt=""
                  className="w-full h-auto opacity-70"
                  animate={{ scale: [1, 1.04, 0.97, 1.02, 1] }}
                  transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
                />
              </motion.div>

              {/* Ranting kanan — slide from left, then wind-sway loop */}
              <motion.div
                initial={{ x: -120, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.7 }}
                className="absolute top-[-1%] left-[-30%] w-[80%] z-10 pointer-events-none origin-bottom-right"
              >
                <motion.img
                  src="/jawa_modern/ranting-kanan-base.png"
                  alt=""
                  className="w-full h-auto"
                  style={{ transformOrigin: "90% 100%" }}
                  animate={{
                    rotate: [0, 2.5, -1.5, 1.8, -0.8, 0],
                    skewX: [0, 1.2, -0.8, 0.6, -0.3, 0],
                    scaleY: [1, 1.01, 0.99, 1.01, 1],
                  }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
                />
              </motion.div>

              {/* Ranting kiri — slide from right, then wind-sway loop (mirror) */}
              <motion.div
                initial={{ x: 120, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.7 }}
                className="absolute top-[-1%] right-[-30%] w-[80%] z-10 pointer-events-none origin-bottom-left"
              >
                <motion.img
                  src="/jawa_modern/ranting-kiri.png"
                  alt=""
                  className="w-full h-auto"
                  style={{ transformOrigin: "10% 100%" }}
                  animate={{
                    rotate: [0, -2.5, 1.5, -1.8, 0.8, 0],
                    skewX: [0, -1.2, 0.8, -0.6, 0.3, 0],
                    scaleY: [1, 1.01, 0.99, 1.01, 1],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2.1 }}
                />
              </motion.div>

              {/* Burung (Bird) at the top — drop in from above, then float loop */}
              <motion.div
                initial={{ y: -80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1.1, ease: "easeOut", delay: 0.6 }}
                className="relative w-[42%] z-20 pointer-events-none bottom-30"
              >
                <motion.img
                  src="/jawa_modern/Burung.png"
                  alt=""
                  className="w-full drop-shadow-xl"
                  animate={{
                    y: [0, -9, 3, -5, 0],
                    rotate: [0, -1.5, 1, -0.8, 0],
                    scale: [1, 1.02, 0.98, 1.01, 1]
                  }}
                  transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.7 }}
                />
              </motion.div>

              {/* Save the Date Parchment (kertas.png) */}
              <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
                className="relative w-[95%] max-w-[450px] mx-auto z-30 flex flex-col items-center mt-[-15%] md:mt-[-20%]"
              >
                {/* Paper Image (The Source of Truth for sizing) */}
                <img
                  src="/jawa_modern/kertas.png"
                  alt="Parchment"
                  className="w-full h-auto drop-shadow-2xl"
                />

                {/* Absolute Content Overlay */}
                <div className="absolute inset-0 z-10 flex flex-col items-center pt-[35%] px-[10%] text-center">
                  <h2
                    className="text-[48px] sm:text-[48px] md:text-[48px] text-[#20150f] opacity-80 mb-[5%]"
                    style={{ fontFamily: "'Upakarti', cursive" }}
                  >
                    save the date
                  </h2>

                  {resepsiEvent && (
                    <>
                      <div className="mb-[8%] w-full opacity-80">
                        <CountdownTimer
                          targetDate={(() => {
                            const d = new Date(resepsiEvent.date);
                            if (resepsiEvent.startTime) {
                              const [h, m] = resepsiEvent.startTime.split(':');
                              d.setHours(parseInt(h || '0'), parseInt(m || '0'), 0, 0);
                            }
                            return d;
                          })()}
                        />
                      </div>

                      <div className="mb-[8%]">
                        <p className="text-[12px] sm:text-[12px] font-bold text-[#20150f] opacity-80 uppercase tracking-widest bg-[#20150f]/5 px-3 py-1 rounded-full inline-block">
                          {resepsiEvent.type === "RESEPSI" ? "Reception" : resepsiEvent.type}
                        </p>
                        <p className="text-[14px] sm:text-[14px] font-medium text-[#20150f] opacity-80 mt-1">
                          {new Date(resepsiEvent.date).toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="mb-[10%] w-full">
                        <p className="text-[12px] sm:text-[12px] font-semibold text-[#20150f] opacity-80 leading-snug px-2">
                          {resepsiEvent.venueName}
                        </p>
                        <p className="text-[11px] sm:text-[11px] text-[#20150f]/80 leading-tight italic px-4 mt-1">
                          {resepsiEvent.address}
                        </p>
                      </div>

                      {resepsiEvent.mapsUrl && (
                        <a
                          href={resepsiEvent.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-[8%] py-[1%] border border-[#20150f]/60 rounded-full text-[9px] sm:text-[10px] font-bold text-[#20150f]/80 hover:bg-[#20150f]/5 transition-all whitespace-nowrap"
                        >
                          Lihat Lokasi
                        </a>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Marriage Contract Section */}
            {akadEvent && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative mt-[-30%] md:mt-[-30%] flex flex-col items-center text-center px-10 w-full max-w-[400px] z-20"
              >
                <h2
                  className="text-[48px] sm:text-[48px] md:text-[48px] text-[#e3d3b7] mb-2 md:mb-2"
                  style={{ fontFamily: "'Upakarti', cursive" }}
                >
                  marriage contract
                </h2>

                <p className="text-[#e3d3b7] text-[13px] sm:text-[14px] font-medium mb-5 md:mb-6">
                  {new Date(akadEvent.date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <div className="space-y-1 md:space-y-2 mb-8 md:mb-10">
                  <p className="text-[#e3d3b7] text-[12px] sm:text-[13px] font-semibold">
                    {akadEvent.venueName}
                  </p>
                  <p className="text-[#e3d3b7]/70 text-[10px] sm:text-[11px] leading-relaxed italic">
                    {akadEvent.address}
                  </p>
                </div>

                {akadEvent.mapsUrl && (
                  <a
                    href={akadEvent.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-[8%] sm:px-8 py-[2%] border border-[#e3d3b7]/30 rounded-full text-[9px] sm:text-[11px] font-bold text-[#e3d3b7] hover:bg-white/5 transition-all"
                  >
                    Lihat Lokasi
                  </a>
                )}
              </motion.div>
            )}
          </section>

          {/* ================= RSVT ================= */}
          <section id="rsvp" className="relative w-full overflow-hidden flex flex-col items-center bg-[#20150f] pb-20 pt-50 md:pt-55 mt-[10%]">
            {/* Background RSVT torn paper effect */}
            <div className="relative w-full flex flex-col items-center">

              {/* LAYER 1: The placeholder background/photo (z-10) */}
              <div className="absolute inset-0 z-10 overflow-hidden mt-[40%] mb-[5%]">
                <div className="w-full h-full" />
                {/* Overriding with data.rsvtImage if available, else heroImage */}
                {(data.rsvtImage || data.heroImage) && (
                  <img src={data.rsvtImage || data.heroImage || ""} alt="Couple RSVT" className="absolute inset-0 w-full h-full object-cover object-top" />
                )}
              </div>

              {/* LAYER 2: Torn batik paper frame overlay (z-20) */}
              <img
                src="/jawa_modern/Background-RSVT.png"
                alt=""
                className="relative w-full h-full pointer-events-none z-20 mt-[35%]"
              />

              {/* LAYER 3: Batik Mandala ornament*/}
              <div className="absolute top-[-20%] left-[12%] md:left-[12%] md:bottom-2 w-[80%] sm:w-[80%] max-w-[600px] z-30 pointer-events-none">
                {/* Inner motion.div: handles entrance scale/opacity only */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                >
                  {/* motion.img: handles perpetual rotation — pivot at its own center */}
                  <motion.img
                    src="/jawa_modern/brush-batik-1.png"
                    alt=""
                    className="w-full h-auto opacity-95 block"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>

              {/* LAYER 3: Ranting kanan shadow — slide from left + wind sway loop */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                className="absolute top-[-23%] sm:top-[-23%] left-[-20%] sm:left-[-20%] w-[77%] sm:w-[77%] max-w-[350px] z-30 pointer-events-none"
              >
                <motion.img
                  src="/jawa_modern/ranting-kanan-shadow.png"
                  alt=""
                  className="w-full h-auto"
                  style={{ transformOrigin: "80% 90%" }}
                  animate={{
                    rotate: [0, 2, -1.2, 1, -0.6, 0],
                    skewX: [0, 0.8, -0.5, 0.4, -0.2, 0],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.7 }}
                />
              </motion.div>

              {/* LAYER 3: Ranting kiri shadow — slide from right + mirror wind sway loop */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                className="absolute top-[-22%] sm:top-[-22%] right-[-18%] sm:right-[-18%] w-[75%] sm:w-[75%] max-w-[350px] z-30 pointer-events-none"
              >
                <motion.img
                  src="/jawa_modern/ranting-kiri-shadow.png"
                  alt=""
                  className="w-full h-auto"
                  style={{ transformOrigin: "20% 90%" }}
                  animate={{
                    rotate: [0, -2, 1.2, -1.5, 0.6, 0],
                    skewX: [0, -0.8, 0.5, -0.4, 0.2, 0],
                  }}
                  transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
                />
              </motion.div>
            </div>

            {/* RSVT Card Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative w-[85%] max-w-[340px] flex flex-col items-center text-center px-6 py-10 mt-[-40%] z-40 bg-[#20150f] rounded-2xl"
            >
              {/* Title */}
              <h2
                className="text-[42px] sm:text-[48px] text-[#e3d3b7] mb-2"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, letterSpacing: "2px" }}
              >
                RSVT
              </h2>

              {/* Counter Text */}
              <p className="text-[#e3d3b7]/70 text-[11px] sm:text-[12px] mb-8 leading-tight">
                <span className="font-bold text-[#e3d3b7]">{rsvpCount || 0} tamu</span> akan hadir<br />
                mari kirim tanggapan anda juga.
              </p>

              {/* Reservation Button */}
              <button
                onClick={() => setIsRsvpOpen(true)}
                className="px-8 py-3 bg-[#e3d3b7] rounded-xl text-[11px] sm:text-[12px] font-bold text-[#1a110c] hover:bg-white transition-all tracking-wider uppercase"
              >
                Reservation
              </button>
            </motion.div>

            {/* Honor message and Also Invite below card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-[85%] flex flex-col items-center text-center mt-12 z-20"
            >
              <p className="text-[#e3d3b7]/60 text-[10px] sm:text-[11px] leading-relaxed mb-10 max-w-[280px]">
                Suatu kehormatan dan kebahagiaan bagi kami jika Bapak /<br />
                Ibu/Saudara/Saudara. Terima kasih telah datang<br />
                untuk memberikan restu Anda kepada kami.
              </p>
            </motion.div>
          </section>

          {/* ================= AMPLOP ONLINE (KIRIM HADIAH) ================= */}
          <section id="gift" className="relative w-full flex flex-col items-center justify-center min-h-svh overflow-hidden pt-[50%] bg-[#20150f] z-10">

            {/* ── LAYER 1: Brush-Batik mandala — Background ornament ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute md:top-[15%] md:left-22 top-[19%] left-[18%] w-[70%] z-0 pointer-events-none"
            >
              <motion.img
                src="/jawa_modern/brush-batik-1.png"
                alt=""
                className="w-full h-auto"
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* ── LAYER 2: Background Hadiah (torn batik paper band) ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 w-full h-[85%] top-[18%] z-10 overflow-hidden"
            >
              <img
                src="/jawa_modern/background-hadiah.png"
                alt=""
                className="w-full h-full object-cover object-center pointer-events-none opacity-100 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              />
            </motion.div>

            {/* ── LAYER 3: Gunungan — top-left peeking ── */}
            <motion.div
              initial={{ x: -60, y: 40, opacity: 0, rotate: -15 }}
              whileInView={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="absolute top-[-1%] left-[-10%] w-[45%] z-0 pointer-events-none origin-bottom"
            >
              <motion.img
                src="/jawa_modern/gunungan.png"
                alt=""
                className="w-full h-auto drop-shadow-2xl"
                animate={{
                  rotate: [10, 8, 12, 9, 10],
                  y: [0, -10, 5, -5, 0],
                  scale: [1, 1.02, 0.98, 1.01, 1]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* ── LAYER 3: Floral Bouquet — top-right peeking ── */}
            <motion.div
              initial={{ x: 60, y: 40, opacity: 0, rotate: 15 }}
              whileInView={{ x: 0, y: 0, opacity: 1, rotate: -10 }}
              viewport={{ once: false }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              className="absolute top-[2%] right-[-25%] w-[55%] max-w-[240px] z-20 pointer-events-none origin-bottom-left"
            >
              <motion.img
                src="/jawa_modern/ranting-kiri-shadow.png"
                alt=""
                className="w-full h-auto drop-shadow-2xl"
                animate={{
                  rotate: [-10, -12, -8, -11, -10],
                  scale: [1, 1.05, 0.95, 1.02, 1],
                  x: [0, 5, -3, 2, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </motion.div>

            {/* ── LAYER 4: Dark Premium Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              className="relative z-30 w-[85%] max-w-[340px] mx-auto bg-[#130c08]/95 backdrop-blur-md border border-white/5 rounded-2xl px-8 py-12 flex flex-col items-center text-center shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
            >

              {/* Title Section */}
              <div className="mb-6 relative">
                <h2
                  className="text-[#e3d3b7] text-[36px] leading-[0.9] text-center"
                  style={{ fontFamily: "var(--font-upakarti), serif" }}
                >
                  kirim hadiah
                  <span className="block mt-1">kamu</span>
                </h2>
                <div className="w-12 h-px bg-[#e3d3b7]/30 mx-auto mt-6" />
              </div>

              {/* Description */}
              <p
                className="text-[#e3d3b7]/70 text-[12px] leading-relaxed mb-10 max-w-[240px] font-light"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Cinta dan kebaikan Anda menambah kebahagiaan di hari istimewa kami. Terima kasih telah menjadi bagian dari perjalanan kami
              </p>

              {/* Amplop Online Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsGiftOpen(true)}
                className="w-full py-4 bg-[#e3d3b7] rounded-2xl text-[13px] font-bold text-[#130c08] shadow-[0_4px_20px_rgba(227,211,183,0.3)] hover:shadow-[0_8px_30px_rgba(227,211,183,0.4)] transition-all tracking-widest uppercase"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Amplop Online
              </motion.button>
            </motion.div>

          </section>

          {/* ================= GUESTBOOK (UCAPAN & DOA) ================= */}
          <section id="guestbook" className="relative w-full min-h-svh snap-start snap-always overflow-hidden bg-[#20150f] pt-24 z-10">
            <Guestbook slug={data.slug} />
          </section>

          {/* ================= THANK YOU SECTION ================= */}
          <section id="thanks" className="relative w-full min-h-svh flex flex-col items-center justify-between py-20 bg-[#20150f] overflow-hidden snap-start z-10">

            {/* ── Heading ── */}
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative z-30"
            >
              <h2
                className="text-[#e3d3b7] text-[36px] sm:text-[36px] text-center"
                style={{ fontFamily: "var(--font-lostar), serif" }}
              >
                TERIMA KASIH
              </h2>
            </motion.div>

            {/* ── Main Ornament Composition ── */}
            <div className="relative w-full flex-1 flex items-center justify-center mt-[-10%] sm:mt-0">

              {/* Layer 1: Mandala Background (Brush-Batik) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -30 }}
                whileInView={{ opacity: 1, scale: 1.2, rotate: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute w-[80%] sm:w-[80%] max-w-[600px] top-[-10%] md:top-[-20%] left-[5.5%] z-0 pointer-events-none"
              >
                <img src="/jawa_modern/brush-batik-2.png" alt="" className="w-full h-auto" />
              </motion.div>

              {/* Layer 2: Floral Bouquets (Framing) */}
              {/* Left Bouquet */}
              <motion.div
                initial={{ opacity: 0, x: -100, scale: 0.8 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                className="absolute left-[-17%] top-[20%] sm:left-[-17%] w-[75%] sm:w-[75%] max-w-[400px] z-40 pointer-events-none"
              >
                <img src="/jawa_modern/ranting-kiri-shadow.png" alt="" className="w-full h-auto drop-shadow-2xl scale-x-[-1]" />
              </motion.div>

              {/* Right Bouquet (Mirrored) */}
              <motion.div
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="absolute right-[-17%] top-[20%] sm:right-[-17%] w-[75%] sm:w-[75%] max-w-[400px] z-40 pointer-events-none"
              >
                <img src="/jawa_modern/ranting-kiri-shadow.png" alt="" className="w-full h-auto drop-shadow-2xl" />
              </motion.div>

              {/* Layer 3: Central Gunungan */}
              <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.7 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="relative z-30 w-[65%] sm:w-[55%] md:w-[55%] lg:w-[55%] lg:top-10 drop-shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
              >
                <motion.img
                  src="/jawa_modern/gunungan.png"
                  alt=""
                  className="w-full h-auto"
                />
              </motion.div>
            </div>

            {/* ── Footer / Branding ── */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 1, delay: 0.8 }}
              className="relative z-30"
            >
              <p
                className="text-[#e3d3b7] text-md sm:text-md tracking-[0.2em] font-bold uppercase opacity-80"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                AKA DEV
              </p>
            </motion.div>

          </section>
        </div>
      </motion.main>

      {/* RSVP Modal */}
      <RsvpForm
        slug={data.slug}
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
      />

      <SideNavigation />
      <StoryTimeline
        isOpen={selectedStoryIndex !== null}
        onClose={() => setSelectedStoryIndex(null)}
        stories={data.stories}
        initialIndex={selectedStoryIndex || 0}
      />

      {/* Gift Modal */}
      {isGiftOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsGiftOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-[400px] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 text-center border-b border-neutral-100 relative">
              <button
                onClick={() => setIsGiftOpen(false)}
                className="absolute right-4 top-4 p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
              <h3 className="text-[18px] font-bold text-[#20150f] uppercase tracking-wider mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Kirim Hadiah Kamu
              </h3>
              <div className="w-16 h-px bg-[#20150f]/20 mx-auto" />
            </div>

            {/* Content Slot */}
            <div className="p-6 overflow-y-auto hide-scrollbar space-y-6">
              {/* Gift Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 bg-[#20150f]/5 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#20150f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M20 12v10c0 .6-.4 1-1 1H5c-.6 0-1-.4-1-1V12" /><path d="M2 7c0-.6.4-1 1-1h18c.6 0 1 .4 1 1v2c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V7Z" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z" /></svg>
                </div>
              </div>

              {data.giftAccounts?.length > 0 ? (
                <div className="space-y-4">
                  {data.giftAccounts.map((account) => (
                    <div key={account.id} className="space-y-4">
                      {/* Account Card */}
                      <div className="p-5 border-2 border-[#20150f]/10 rounded-2xl hover:border-[#20150f]/30 transition-all bg-[#20150f]/2">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-[18px] font-extrabold text-[#20150f] tracking-tight">{account.bankName}</h4>
                          <button
                            onClick={() => copyToClipboard(account.accountNumber, account.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#20150f] text-[#e3d3b7] rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-[#3a281d] transition-colors"
                          >
                            {copyStatus === account.id ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                Copied
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-[16px] font-bold text-[#20150f]/80 font-mono mb-1">{account.accountNumber}</p>
                        <p className="text-[13px] text-neutral-500 font-medium tracking-tight">a/n {account.accountHolder}</p>
                      </div>

                      {/* QR Optional */}
                      {account.qrCodeUrl && (
                        <div className="p-5 border-2 border-[#20150f]/10 rounded-2xl bg-[#20150f]/2 flex flex-col items-center">
                          <h4 className="text-[16px] font-bold text-[#20150f] tracking-tight text-center mb-4">{account.bankName}</h4>
                          <div className="w-full max-w-[200px] aspect-square bg-white p-4 rounded-xl shadow-inner border border-neutral-100">
                            <img src={account.qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-neutral-400 text-sm py-8">Belum ada informasi rekening tersedia.</p>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-[#20150f]/5 text-center">
              <p className="text-[10px] text-[#20150f]/60 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Terima kasih atas doa restu & hadiah Anda
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Hanya tampilkan ikon dan putar musik setelah cover dibuka */}
      {coverOpen && <AudioPlayer autoPlay={true} src={data.musicUrl || ""} />}
    </>
  );
}
