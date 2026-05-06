import { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export const Select = (props: SelectProps) => {
  const { label, error, id, className = "", children, ...rest } = props;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`
          w-full rounded-md border px-3 py-2 text-base
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent
          disabled:bg-background disabled:cursor-not-allowed disabled:opacity-50
          ${error ? "border-danger-border bg-danger-light" : "border-border"}
          ${className}
        `}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
};
