import React, { InputHTMLAttributes, forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, icon, ...props }, ref) => {
        const [isPasswordVisible, setIsPasswordVisible] = useState(false);
        const isPasswordType = type === "password";

        const togglePasswordVisibility = () => {
            setIsPasswordVisible(!isPasswordVisible);
        };

        const inputType = isPasswordType ? (isPasswordVisible ? "text" : "password") : type;

        return (
            <div className="space-y-2">
                {label && (
                    <label className="text-sm font-medium text-slate-300">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                            {icon}
                        </div>
                    )}
                    <input
                        type={inputType}
                        className={cn(
                            "flex h-11 w-full rounded-xl bg-slate-800/50 px-4 py-2 text-sm text-white placeholder-slate-500 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium outline-none ring-1 ring-white/5 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                            icon && "pl-10",
                            isPasswordType && "pr-10",
                            error && "ring-red-500/50 focus:ring-red-500/50",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {isPasswordType && (
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            tabIndex={-1}
                        >
                            {isPasswordVisible ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    )}
                </div>
                {error && (
                    <p className="text-xs text-red-400 font-medium">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
