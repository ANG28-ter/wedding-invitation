"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface PhotoFrameCarouselProps {
    images: string[];
    onImageClick?: (index: number) => void;
}

export default function PhotoFrameCarousel({ images, onImageClick }: PhotoFrameCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        if (!isPlaying || images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [isPlaying, images.length]);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handleImageClick = () => {
        if (onImageClick) {
            onImageClick(currentIndex);
        }
    };

    if (images.length === 0) {
        return (
            <div className="photo-frame-carousel">
                <div className="photo-frame-empty">
                    <p className="text-neutral-500">Belum ada foto</p>
                </div>
            </div>
        );
    }

    return (
        <div className="photo-frame-carousel">
            {/* Vintage Frame Container */}
            <div className="vintage-frame">
                {/* Torn Paper Border */}
                <div className="torn-paper-border">
                    {/* Photo Display */}
                    <div
                        className="photo-display"
                        onClick={handleImageClick}
                    >
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Gallery ${index + 1}`}
                                className={`carousel-image ${index === currentIndex ? "active" : ""}`}
                            />
                        ))}
                    </div>

                    {/* Decorative Elements */}
                    <div className="decorative-tape tape-top-left"></div>
                    <div className="decorative-tape tape-top-right"></div>
                    <div className="decorative-tape tape-bottom-left"></div>
                    <div className="decorative-tape tape-bottom-right"></div>
                </div>

                {/* Navigation Controls */}
                <div className="carousel-controls">
                    <button
                        onClick={goToPrevious}
                        className="control-btn"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="control-btn"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? (
                            <Pause className="h-4 w-4" />
                        ) : (
                            <Play className="h-4 w-4" />
                        )}
                    </button>

                    <button
                        onClick={goToNext}
                        className="control-btn"
                        aria-label="Next"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                {/* Image Counter */}
                <div className="image-counter">
                    {currentIndex + 1} / {images.length}
                </div>

                {/* Dot Indicators */}
                <div className="dot-indicators">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`dot ${index === currentIndex ? "active" : ""}`}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Caption */}
            <p className="photo-caption">Precious Moment</p>
        </div>
    );
}
