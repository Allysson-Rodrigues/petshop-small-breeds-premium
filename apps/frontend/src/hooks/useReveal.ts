import { useEffect, useRef } from "react";

/**
 * Scroll reveal hook — adds the "revealed" class when the element
 * enters the viewport, triggering the CSS .reveal-up animation.
 */
export function useReveal(delay = 0) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const prefersReducedMotion =
            typeof window.matchMedia === "function"
                ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
                : false;

        if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
            el.classList.add("revealed");
            return;
        }

        let timeoutId: number | undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (delay > 0) {
                        timeoutId = window.setTimeout(() => el.classList.add("revealed"), delay);
                    } else {
                        el.classList.add("revealed");
                    }
                    observer.unobserve(el);
                }
            },
            { threshold: 0.12 },
        );

        observer.observe(el);
        return () => {
            observer.disconnect();
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
        };
    }, [delay]);

    return ref;
}
