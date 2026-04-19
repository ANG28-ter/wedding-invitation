"use client";

import { motion } from "framer-motion";

interface DesktopSideImageProps {
    image?: string | null;
    groomImage?: string | null;
    brideImage?: string | null;
}

export default function DesktopSideImage({ image, groomImage, brideImage }: DesktopSideImageProps) {
    // Logic: 
    // 1. Try 'image' (coverImage)
    // 2. Try 'groomImage'
    // 3. Try 'brideImage'
    // 4. Fallback to generic gradient if nothing exists

    const bgImage = image || groomImage || brideImage;

    return (
        <div className="hidden md:block fixed left-0 top-0 h-full w-[calc(100%-480px)] overflow-hidden z-0 bg-[#20150f]">
            {bgImage ? (
                <motion.div
                    initial={{ scale: 1.05, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('${bgImage}')` }}
                />
            ) : (
                <div className="absolute inset-0 bg-[#20150f]" />
            )}

            {/* Dark Overlay for better blending */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

            {/* Subtle Texture Overlay */}
            <div
                className="absolute inset-0 z-10 pointer-events-none opacity-40 mix-blend-overlay"
                style={{
                    backgroundImage: "url('/jawa_modern/background_pengantin.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            
            {/* Edge Shadow to blend with mobile viewport seamlessly */}
            <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-black/80 to-transparent pointer-events-none z-20" />
        </div>
    );
}
