"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

interface PhotoGalleryProps {
    images: string[];
}

export default function PhotoGallery({ images }: PhotoGalleryProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

    if (images.length === 0) {
        return null;
    }

    // Only take the first 4 images for the 2x2 grid
    const displayImages = images.slice(0, 4);

    return (
        <section className="relative w-full h-dvh bg-[#20150f] overflow-hidden flex flex-col justify-center items-center snap-start snap-always">
            {/* Title */}
            <div className="text-center mb-10 px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8 }}
                    className="text-[#e3d3b7] text-[32px] italic leading-tight drop-shadow-lg"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                    Precious Moment
                </motion.h2>
            </div>

            {/* Photo Grid (2x2) */}
            <div className="w-full grid grid-cols-2 gap-0.5 px-0">
                {displayImages.map((image, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false }}
                        transition={{ delay: index * 0.1 }}
                        className="relative aspect-square overflow-hidden cursor-pointer group"
                        onClick={() => setSelectedPhoto(index)}
                    >
                        <img
                            src={image}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                ))}
            </div>

            {/* Quote / Catatan Template */}
            <div className="text-center mt-12 px-10 max-w-[400px]">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.4 }}
                    className="text-[#fff5e3] text-[13px] leading-relaxed italic font-light opacity-90"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                    "Setiap momen yang kita lalui bersama telah menjadi kenangan berharga—dipenuhi dengan cinta, tawa, dan keindahan tenang dari tumbuh bersama."
                </motion.p>
            </div>

            {/* Lightbox / Detail Modal */}
            <AnimatePresence>
                {selectedPhoto !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedPhoto(null)}
                            className="absolute top-6 right-6 z-110 p-2 bg-white/10 hover:bg-white/20 rounded-full"
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={displayImages[selectedPhoto]}
                                alt={`Gallery Detail ${selectedPhoto + 1}`}
                                className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
