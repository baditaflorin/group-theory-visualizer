import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  active?: boolean;
  icon: ReactNode;
};

export function IconButton({
  label,
  icon,
  active = false,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded border px-3 text-sm font-semibold transition ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-ink/15 bg-white text-ink hover:border-river hover:text-river"
      } ${className}`}
      title={label}
      aria-label={label}
      {...props}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
