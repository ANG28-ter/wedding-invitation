"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CoverCardProps {
    isOpen: boolean;
    onOpen: () => void;
    groomName: string;
    brideName: string;
    coverImage?: string | null;
}

export default function CoverCard({ isOpen, onOpen, groomName, brideName, coverImage }: CoverCardProps) {
    return (
        <AnimatePresence>
            {!isOpen && (
                <motion.div
                    initial={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: "-100%" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed right-0 top-0 h-full w-full md:w-[480px] z-50 flex flex-col items-center justify-between bg-[#20150f] overflow-hidden"
                >
                    {/* Background Image (Couple Photo) */}
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: coverImage ? `url('${coverImage}')` : "url('/jawa_modern/Awal.png')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                    </div>

                    {/* Frame Overlay (Torn Paper at top & sides) */}
                    <div
                        className="absolute inset-0 z-10 pointer-events-none"
                        style={{
                            backgroundImage: "url('/jawa_modern/Awal.png')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />

                    {/* Content Container */}
                    <div className="relative z-20 w-full h-full flex flex-col items-center justify-between pt-[15vh] pb-[10vh]">

                        {/* Top Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 1 }}
                            className="flex flex-col items-center text-center px-4"
                        >
                            <p
                                className="text-[#e4dfd8] tracking-[0.2em] md:tracking-[0.3em] text-sm md:text-base mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                            >
                                The Wedding Of
                            </p>
                            <h1
                                className="text-[#e3d3b7] text-4xl sm:text-3xl md:text-4xl text-center leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                                style={{ fontFamily: "var(--font-lostar), serif" }}
                            >
                                {groomName?.toUpperCase()} & {brideName?.toUpperCase()}
                            </h1>
                        </motion.div>

                        {/* Open Button */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                            className="mt-auto mb-[20vh]"
                        >
                            <button
                                onClick={onOpen}
                                className="group relative px-4 py-1 bg-[#e3d3b7] text-[#20150f] rounded-[8px] font-bold text-[30%] uppercase shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-white"
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                            >
                                <span className="relative z-10 flex items-center justify-center cursor-pointer tracking-wider">
                                    Open Invitation
                                </span>
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        </motion.div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
