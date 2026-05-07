import type { FiniteGroup } from "@/features/groups/schema";

type MultiplicationTableProps = {
  group: FiniteGroup;
  selectedElement: number;
  onSelectElement: (element: number) => void;
};

export function MultiplicationTable({
  group,
  selectedElement,
  onSelectElement
}: MultiplicationTableProps) {
  return (
    <section className="flex min-h-[520px] flex-1 flex-col bg-white">
      <div className="border-b border-ink/10 px-4 py-3">
        <h2 className="text-base font-semibold text-ink">Multiplication table</h2>
        <p className="text-xs text-ink/60">{group.presentation}</p>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4">
        <table className="multiplication-table border-collapse text-center text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-20 bg-ink p-2 text-paper">·</th>
              {group.elements.map((label, index) => (
                <th
                  key={label}
                  className="sticky top-0 z-10 min-w-12 border border-ink/10 bg-paper p-2 font-semibold text-ink"
                >
                  <button title={`Select ${label}`} onClick={() => onSelectElement(index)}>
                    {label}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group.operationTable.map((row, rowIndex) => (
              <tr key={group.elements[rowIndex]}>
                <th className="sticky left-0 z-10 border border-ink/10 bg-paper p-2 font-semibold text-ink">
                  <button
                    title={`Select ${group.elements[rowIndex]}`}
                    onClick={() => onSelectElement(rowIndex)}
                  >
                    {group.elements[rowIndex]}
                  </button>
                </th>
                {row.map((cell, colIndex) => {
                  const active =
                    rowIndex === selectedElement ||
                    colIndex === selectedElement ||
                    cell === selectedElement;
                  return (
                    <td
                      key={`${rowIndex}-${colIndex}`}
                      className={`border border-ink/10 p-2 ${
                        active ? "bg-mint/15 font-semibold text-ink" : "bg-white text-ink/75"
                      }`}
                    >
                      {group.elements[cell]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
