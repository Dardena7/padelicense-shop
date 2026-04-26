"use client";

import { ButtonHTMLAttributes, MouseEvent, useRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  secondary: "bg-foreground text-background hover:bg-foreground/90",
  outline: "border border-border text-foreground hover:bg-foreground/5",
  ghost: "text-foreground hover:underline",
};

const rippleColor: Record<ButtonVariant, string> = {
  primary: "rgba(255, 255, 255, 0.3)",
  secondary: "rgba(255, 255, 255, 0.3)",
  outline: "rgba(0, 0, 0, 0.1)",
  ghost: "rgba(0, 0, 0, 0.1)",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (disabled || variant === "ghost") {
      onClick?.(e);
      return;
    }

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;

    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x - size / 2}px;
      top: ${y - size / 2}px;
      background: ${rippleColor[variant]};
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 500ms ease-out forwards;
      pointer-events: none;
    `;

    button.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());

    onClick?.(e);
  }

  return (
    <button
      ref={buttonRef}
      className={`
        relative overflow-hidden
        inline-flex items-center justify-center rounded-md font-medium
        transition-colors duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
