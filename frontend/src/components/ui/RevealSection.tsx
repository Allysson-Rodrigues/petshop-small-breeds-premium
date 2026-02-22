import type React from "react";
import { useReveal } from "../../hooks/useReveal";

interface RevealSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export default function RevealSection({ children, className = "", delay = 0 }: RevealSectionProps) {
    const ref = useReveal(delay);
    return (
        <div ref={ref} className={`reveal-up ${className}`}>
            {children}
        </div>
    );
}
