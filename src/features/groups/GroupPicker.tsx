import { Boxes, Search } from "lucide-react";
import type { FiniteGroup } from "./schema";

type GroupPickerProps = {
  groups: FiniteGroup[];
  selectedId: string;
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (groupId: string) => void;
};

export function GroupPicker({
  groups,
  selectedId,
  query,
  onQueryChange,
  onSelect
}: GroupPickerProps) {
  return (
    <section className="flex min-h-0 flex-col border-r border-ink/10 bg-paper">
      <div className="border-b border-ink/10 p-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="h-10 w-full rounded border border-ink/15 bg-white pl-9 pr-3 text-sm text-ink outline-none focus:border-river focus:ring-2 focus:ring-river/20"
            placeholder="Search groups"
            aria-label="Search groups"
          />
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-2">
        {groups.map((group) => (
          <button
            key={group.id}
            className={`mb-2 flex w-full items-center gap-3 rounded border p-3 text-left transition ${
              selectedId === group.id
                ? "border-river bg-white shadow-sm"
                : "border-transparent bg-transparent hover:border-ink/10 hover:bg-white/70"
            }`}
            onClick={() => onSelect(group.id)}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded bg-ink text-sm font-bold text-paper">
              {group.shortName}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-ink">{group.name}</span>
              <span className="mt-0.5 flex items-center gap-1 text-xs text-ink/60">
                <Boxes className="h-3.5 w-3.5" />
                Order {group.order} · {group.family}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
