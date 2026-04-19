"use client";

import { useEffect } from "react";

type ToastProps = {
    message: string;
    type?: "success" | "error" | "info" | "warning";
    onClose: () => void;
    duration?: number;
};

export function Toast({ message, type = "info", onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const styles = {
        success: "border-emerald-900 bg-emerald-950/90 text-emerald-400",
        error: "border-red-900 bg-red-950/90 text-red-400",
        warning: "border-yellow-900 bg-yellow-950/90 text-yellow-400",
        info: "border-blue-900 bg-blue-950/90 text-blue-400",
    };

    const icons = {
        success: (
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        warning: (
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        info: (
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };

    return (
        <div className="fixed right-6 top-6 z-50 animate-slide-in-right">
            <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-sm ${styles[type]}`}>
                {icons[type]}
                <p className="text-sm font-medium">{message}</p>
                <button
                    onClick={onClose}
                    className="ml-2 rounded-lg p-1 hover:bg-white/10"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

// Toast Container for multiple toasts
type ToastContainerProps = {
    toasts: Array<{ id: string; message: string; type: ToastProps["type"] }>;
    onRemove: (id: string) => void;
};

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return (
        <div className="fixed right-6 top-6 z-50 flex flex-col gap-2">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="animate-slide-in-right"
                >
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => onRemove(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
}
