import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

export function GlassCard({
    className,
    children,
    hoverEffect = false,
    ...props
}: GlassCardProps) {
    return (
        <div
            className={cn(
                "rounded-2xl transition-all duration-300 ease-in-out",
                "bg-card/90 backdrop-blur-md border border-white/5 shadow-lg",
                // Dark mode specific nuances are handled by bg-card (mapped to #151C2C)
                // We add texture/glass feel explicitly if needed, but the colors are solid glass
                hoverEffect && "hover:bg-secondary/80 hover:border-primary/20 hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
