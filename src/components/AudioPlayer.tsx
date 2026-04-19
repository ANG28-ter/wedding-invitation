"use client";

import { Disc3 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface AudioPlayerProps {
    src?: string; 
    autoPlay?: boolean;
}

export default function AudioPlayer({ src = "", autoPlay = false }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (autoPlay && audioRef.current && src && src.trim() !== "") {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }
    }, [autoPlay, src]);

    const togglePlay = () => {
        if (!src || src.trim() === "") {
            // Jika tidak ada mp3, cukup beri efek visual putar/stop tanpa memutar apa pun
            setIsPlaying(!isPlaying);
            return;
        }

        if (!audioRef.current) return;
        
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(e => console.log("Audio playback failed:", e));
            setIsPlaying(true);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-999">
            {src && src.trim() !== "" && <audio ref={audioRef} src={src} loop />}
            <motion.button
                onClick={togglePlay}
                className="w-11 h-11 md:w-14 md:h-14 bg-linear-to-tr from-[#20150f] to-[#3a2618] border border-[#e3d3b7]/60 rounded-full flex items-center justify-center opacity-90 hover:opacity-100 outline-none"
                animate={isPlaying ? {
                    boxShadow: ["0px 0px 0px 0px rgba(227,211,183,0.4)", "0px 0px 0px 12px rgba(227,211,183,0)"]
                } : {
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.5)"
                }}
                transition={isPlaying ? { duration: 1.5, repeat: Infinity, ease: "easeOut" } : { duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle Audio"
            >
                {/* Aesthetic Vinyl Effect */}
                <motion.div 
                    animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={isPlaying ? { duration: 3, repeat: Infinity, ease: "linear" } : { duration: 0.5, ease: "easeOut" }}
                    className="flex justify-center items-center"
                >
                    <Disc3 className="w-5 h-5 md:w-6 md:h-6 text-[#e3d3b7] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" strokeWidth={1.5} />
                </motion.div>
                
                {/* Crossed out visual when paused (subtle) */}
                {!isPlaying && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="w-1px h-6 md:h-8 bg-[#e3d3b7]/60 rotate-45 rounded-full" />
                    </motion.div>
                )}
            </motion.button>
        </div>
    );
}
