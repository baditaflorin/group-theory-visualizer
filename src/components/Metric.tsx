import type { ReactNode } from "react";

type MetricProps = {
  label: string;
  value: ReactNode;
};

export function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded border border-ink/10 bg-white p-3 text-ink shadow-sm">
      <div className="text-xs uppercase tracking-normal text-ink/55">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
