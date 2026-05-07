import { Graphviz } from "@hpcc-js/wasm/graphviz";
import { Loader2, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cayleyDot } from "@/features/groups/cayley";
import type { FiniteGroup, GroupGenerator } from "@/features/groups/schema";

type GraphVizPanelProps = {
  group: FiniteGroup;
  generators: GroupGenerator[];
};

export function GraphVizPanel({ group, generators }: GraphVizPanelProps) {
  const dot = useMemo(() => cayleyDot(group, generators), [group, generators]);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    void Graphviz.load()
      .then((graphviz) => graphviz.layout(dot, "svg", group.order > 18 ? "sfdp" : "dot"))
      .then((nextSvg) => {
        if (!cancelled) setSvg(nextSvg);
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "GraphViz failed.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dot, group.order]);

  return (
    <section className="relative flex min-h-[520px] flex-1 flex-col overflow-hidden bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 px-4 py-3">
        <div>
          <h2 className="text-base font-semibold text-ink">Cayley map</h2>
          <p className="text-xs text-ink/60">
            {group.order} nodes · {group.order * generators.length} directed edges
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {generators.map((generator) => (
            <span
              key={generator.label}
              className="inline-flex items-center gap-2 rounded border border-ink/10 bg-paper px-2.5 py-1 text-xs font-semibold text-ink"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: generator.color }}
                aria-hidden="true"
              />
              {generator.label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative grid min-h-0 flex-1 place-items-center overflow-auto p-4">
        {loading ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-ink/65">
            <Loader2 className="h-4 w-4 animate-spin" />
            Laying out graph
          </div>
        ) : error ? (
          <div className="max-w-md rounded border border-coral/40 bg-coral/10 p-4 text-sm text-ink">
            <RefreshCw className="mb-3 h-5 w-5 text-coral" />
            {error}
          </div>
        ) : (
          <div
            className="graphviz-output w-full min-w-[720px] max-w-5xl"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}
      </div>
    </section>
  );
}
