import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "destructive" | "ghost" | "outline";
    size?: "sm" | "md" | "lg" | "icon";
}

export function Button({
    className,
    variant = "primary",
    size = "md",
    children,
    ...props
}: ButtonProps) {
    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-transparent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-white/5",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground text-foreground"
    };

    const sizes = {
        sm: "h-9 px-3 text-xs rounded-lg",
        md: "h-11 px-5 text-sm rounded-xl",
        lg: "h-14 px-8 text-base rounded-2xl",
        icon: "h-11 w-11 flex items-center justify-center rounded-xl"
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
