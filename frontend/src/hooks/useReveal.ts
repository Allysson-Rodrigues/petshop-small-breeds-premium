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

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (delay > 0) {
                        setTimeout(() => el.classList.add("revealed"), delay);
                    } else {
                        el.classList.add("revealed");
                    }
                    observer.unobserve(el);
                }
            },
            { threshold: 0.12 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [delay]);

    return ref;
}
