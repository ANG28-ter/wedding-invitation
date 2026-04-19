"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Story {
    id: string;
    title: string;
    description: string;
    date?: string | Date | null;
    imageUrl?: string | null;
}

interface StoryTimelineProps {
    isOpen: boolean;
    onClose: () => void;
    stories: Story[];
    initialIndex: number;
}

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 300 : -300,
        opacity: 0
    })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};

export default function StoryTimeline({ isOpen, onClose, stories, initialIndex }: StoryTimelineProps) {
    const [[page, direction], setPage] = useState([initialIndex, 0]);

    // Reset page when initialIndex changes or modal opens
    useEffect(() => {
        if (isOpen) {
            setPage([initialIndex, 0]);
        }
    }, [isOpen, initialIndex]);

    const storyIndex = ((page % stories.length) + stories.length) % stories.length;

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    };

    if (!isOpen || stories.length === 0) return null;

    const currentStory = stories[storyIndex];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                    onClick={onClose}
                >
                    <div className="relative w-full max-w-[400px] flex items-center justify-center pointer-events-none">
                        {/* Close Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className="absolute top-[1%] right-[1%] z-50 p-2 hover:cursor-pointer transition-all pointer-events-auto"
                        >
                            <X className="h-6 w-6 text-[#f0f0f0]" />
                        </button>

                        {/* Navigation Arrows (Desktop) */}
                        <button
                            className="absolute left-[-60px] hidden md:flex z-50 p-3 hover:bg-white/10 rounded-full text-white pointer-events-auto"
                            onClick={(e) => {
                                e.stopPropagation();
                                paginate(-1);
                            }}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            className="absolute right-[-60px] hidden md:flex z-50 p-3 hover:bg-white/10 rounded-full text-white pointer-events-auto"
                            onClick={(e) => {
                                e.stopPropagation();
                                paginate(1);
                            }}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>

                        {/* Card Content with Slide Animation */}
                        <div className="relative w-full h-[75vh] md:h-[80vh] bg-[#1a110d] overflow-hidden shadow-2xl pointer-events-auto">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={page}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={1}
                                    onDragEnd={(e, { offset, velocity }) => {
                                        const swipe = swipePower(offset.x, velocity.x);

                                        if (swipe < -swipeConfidenceThreshold) {
                                            paginate(1);
                                        } else if (swipe > swipeConfidenceThreshold) {
                                            paginate(-1);
                                        }
                                    }}
                                    className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Background Image */}
                                    {currentStory.imageUrl && (
                                        <div className="absolute inset-0 z-0">
                                            <img
                                                src={currentStory.imageUrl}
                                                alt={currentStory.title}
                                                className="w-full h-full object-cover pointer-events-none"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-[#1a110d] via-[#1a110d]/30 to-transparent z-10" />
                                        </div>
                                    )}

                                    {/* Text Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8 pt-16 z-20 flex flex-col gap-3">
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <h2
                                                className="text-[#e3d3b7] text-[28px] font-bold leading-tight"
                                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                            >
                                                {currentStory.title}
                                            </h2>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <p className="text-white/80 text-[13px] leading-relaxed text-justify italic font-light line-clamp-6">
                                                {currentStory.description}
                                            </p>
                                        </motion.div>

                                        <div className="w-10 h-1 bg-[#e3d3b7]/40 mt-4 rounded-full" />

                                        {/* Index Indicator */}
                                        <div className="absolute bottom-6 right-8 text-white/30 text-[10px] font-bold tracking-widest">
                                            {storyIndex + 1} / {stories.length}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
