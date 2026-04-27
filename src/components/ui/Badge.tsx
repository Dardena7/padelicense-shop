type BadgeVariant = "default" | "success" | "danger" | "accent";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-foreground-light text-foreground",
  success: "bg-success-light text-success",
  danger: "bg-danger-light text-danger",
  accent: "bg-accent-light text-accent",
};

export default function Badge({ variant = "default", children }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-2.5 py-0.5
        text-xs font-medium
        ${variantStyles[variant]}
      `}
    >
      {children}
    </span>
  );
}
