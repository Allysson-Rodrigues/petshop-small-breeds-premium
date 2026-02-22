
interface SkeletonProps {
    className?: string;
    variant?: "rectangular" | "circular" | "text";
}

export default function Skeleton({ className = "", variant = "rectangular" }: SkeletonProps) {
    const baseClasses = "animate-pulse bg-neutral-200/50";
    const variantClasses = {
        rectangular: "rounded-sm",
        circular: "rounded-full",
        text: "rounded-sm h-4 w-full",
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            aria-hidden="true"
        />
    );
}
