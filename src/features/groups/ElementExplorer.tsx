import { Atom, Binary, CircleDot } from "lucide-react";
import { formatElements, inverseOf, powers, product } from "./algebra";
import type { FiniteGroup, GroupInvariantSummary } from "./schema";

type ElementExplorerProps = {
  group: FiniteGroup;
  summary: GroupInvariantSummary;
  selectedElement: number;
  onSelectElement: (element: number) => void;
};

export function ElementExplorer({
  group,
  summary,
  selectedElement,
  onSelectElement
}: ElementExplorerProps) {
  const inverse = inverseOf(group, selectedElement, summary.identity);
  const powerSequence = powers(group, selectedElement);
  const elementOrder = summary.elementOrders[selectedElement];

  return (
    <section className="flex min-h-[520px] flex-1 flex-col bg-white">
      <div className="border-b border-ink/10 px-4 py-3">
        <h2 className="text-base font-semibold text-ink">Element explorer</h2>
        <p className="text-xs text-ink/60">
          {group.elements[selectedElement]} · order {elementOrder} · inverse{" "}
          {group.elements[inverse]}
        </p>
      </div>

      <div className="grid gap-4 overflow-auto p-4 lg:grid-cols-[minmax(220px,0.7fr)_minmax(320px,1fr)]">
        <div className="rounded border border-ink/10 bg-paper p-3">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
            <CircleDot className="h-4 w-4 text-river" />
            Elements
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {group.elements.map((label, index) => (
              <button
                key={`${label}-${index}`}
                onClick={() => onSelectElement(index)}
                className={`h-10 rounded border px-2 text-sm font-semibold ${
                  selectedElement === index
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/10 bg-white text-ink hover:border-river"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded border border-ink/10 bg-paper p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Atom className="h-4 w-4 text-mint" />
              Powers
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {powerSequence.map((element, index) => (
                <span
                  key={`${element}-${index}`}
                  className="rounded border border-ink/10 bg-white px-2.5 py-1 text-sm font-semibold text-ink"
                >
                  {index === 0 ? "e" : `${group.elements[selectedElement]}^${index}`} ={" "}
                  {group.elements[element]}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded border border-ink/10 bg-paper p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Binary className="h-4 w-4 text-coral" />
              Left multiplication by {group.elements[selectedElement]}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {group.elements.map((label, index) => (
                <div
                  key={label}
                  className="rounded border border-ink/10 bg-white px-2.5 py-2 text-sm text-ink"
                >
                  <span className="font-semibold">{group.elements[selectedElement]}</span> ·{" "}
                  <span>{label}</span> ={" "}
                  <span className="font-semibold">
                    {group.elements[product(group, selectedElement, index)]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded border border-ink/10 bg-paper p-4">
            <div className="text-sm font-semibold text-ink">Conjugacy classes</div>
            <div className="mt-3 grid gap-2">
              {summary.conjugacyClasses.map((conjugacyClass, index) => (
                <div
                  key={index}
                  className="rounded border border-ink/10 bg-white px-3 py-2 text-sm text-ink"
                >
                  {formatElements(group, conjugacyClass, 18)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
