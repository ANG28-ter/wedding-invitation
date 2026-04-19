"use client";

import { useEffect, useState, useCallback } from "react";

interface CountdownTimerProps {
    targetDate: Date | string;
    className?: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isValid: boolean;
}

export default function CountdownTimer({ targetDate, className = "" }: CountdownTimerProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, isValid: true });

    const calculateTimeLeft = useCallback((): TimeLeft => {
        // Handle both Date objects and strings
        const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
        
        // Check if date is valid
        if (isNaN(target.getTime())) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, isValid: false };
        }

        const difference = target.getTime() - Date.now();

        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
                isValid: true
            };
        }

        return { days: 0, hours: 0, minutes: 0, seconds: 0, isValid: true };
    }, [targetDate]);

    useEffect(() => {
        setIsMounted(true);
        const updateTimer = () => setTimeLeft(calculateTimeLeft());
        
        updateTimer();
        const timer = setInterval(updateTimer, 1000);

        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    if (!isMounted) {
        return (
            <div className={`flex justify-center items-start gap-4 sm:gap-6 md:gap-8 opacity-0 ${className}`}>
                {[1, 2, 3, 4].map((_, i) => (
                    <div key={i} className="flex flex-col items-center min-w-[40px]">
                        <span className="text-[32px] sm:text-[40px] md:text-[48px]">00</span>
                    </div>
                ))}
            </div>
        );
    }

    if (!timeLeft.isValid) {
        console.warn("CountdownTimer: Jam target tidak valid.", targetDate);
        return null;
    }

    const timeUnits = [
        { value: timeLeft.days, label: "HARI" },
        { value: timeLeft.hours, label: "JAM" },
        { value: timeLeft.minutes, label: "MENIT" },
        { value: timeLeft.seconds, label: "DETIK" },
    ];

    return (
        <div className={`flex justify-center items-start gap-4 sm:gap-6 md:gap-8 ${className}`}>
            {timeUnits.map((unit, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center min-w-[40px] sm:min-w-[50px]"
                >
                    <span 
                        className="text-[32px] sm:text-[40px] md:text-[48px] text-[#20150f] leading-none mb-1 tabular-nums" 
                        style={{ fontFamily: "'Upakarti', cursive" }}
                    >
                        {String(unit.value).padStart(2, "0")}
                    </span>
                    <span 
                        className="text-[8px] sm:text-[10px] md:text-[11px] font-bold text-[#20150f] tracking-widest"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                        {unit.label}
                    </span>
                </div>
            ))}
        </div>
    );
}
