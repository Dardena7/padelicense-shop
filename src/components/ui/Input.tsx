import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full rounded-md border px-3 py-2 text-base
          transition-colors duration-200
          placeholder:text-muted
          focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent
          disabled:bg-background disabled:cursor-not-allowed disabled:opacity-50
          ${error ? "border-danger-border bg-danger-light" : "border-border"}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}
    </div>
  );
}
