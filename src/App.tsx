import { useQuery } from "@tanstack/react-query";
import {
  Bot,
  Boxes,
  Braces,
  Github,
  GitCommit,
  Grid2X2,
  Heart,
  Network,
  Rotate3D,
  Sparkles,
  Table2
} from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { IconButton } from "./components/IconButton";
import { Metric } from "./components/Metric";
import { fetchLatestCommit } from "./lib/github";
import { readStoredValue, writeStoredValue } from "./lib/storage";
import {
  appVersion,
  buildBranch,
  buildCommit,
  buildDate,
  paypalUrl,
  repositoryUrl
} from "./lib/version";
import { LocalAssistant } from "./features/assistant/LocalAssistant";
import { findGroup, groups } from "./features/groups/catalog";
import { ElementExplorer } from "./features/groups/ElementExplorer";
import { GroupPicker } from "./features/groups/GroupPicker";
import { formatElements, generatedSubgroup, summarizeGroup } from "./features/groups/algebra";
import { createGroupKernel } from "./features/groups/wasmKernel";
import { MultiplicationTable } from "./features/visualization/MultiplicationTable";
import type { FiniteGroup, GroupGenerator } from "./features/groups/schema";

const GraphVizPanel = lazy(() =>
  import("./features/visualization/GraphVizPanel").then((module) => ({
    default: module.GraphVizPanel
  }))
);
const ThreeSymmetry = lazy(() =>
  import("./features/visualization/ThreeSymmetry").then((module) => ({
    default: module.ThreeSymmetry
  }))
);

type View = "graph" | "symmetry" | "table" | "elements" | "assistant";

const storageKeys = {
  group: "gtv.group",
  view: "gtv.view",
  generators: "gtv.generators"
};

export function App() {
  const [selectedGroupId, setSelectedGroupId] = useState(() =>
    readStoredValue(storageKeys.group, "d4", (value) => JSON.parse(value) as string)
  );
  const [view, setView] = useState<View>(() =>
    readStoredValue(storageKeys.view, "elements", (value) => JSON.parse(value) as View)
  );
  const [query, setQuery] = useState("");
  const [selectedElement, setSelectedElement] = useState(0);
  const [activeGeneratorLabels, setActiveGeneratorLabels] = useState<string[]>([]);
  const [kernelStatus, setKernelStatus] = useState("WASM idle");

  const selectedGroup = useMemo(() => findGroup(selectedGroupId), [selectedGroupId]);
  const summary = useMemo(() => summarizeGroup(selectedGroup), [selectedGroup]);

  const filteredGroups = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return groups;
    return groups.filter((group) =>
      [group.name, group.shortName, group.family, group.description].some((value) =>
        value.toLowerCase().includes(normalized)
      )
    );
  }, [query]);

  const activeGenerators = useMemo(() => {
    const labels = activeGeneratorLabels.length
      ? activeGeneratorLabels
      : selectedGroup.generators.map((generator) => generator.label);
    return selectedGroup.generators.filter((generator) => labels.includes(generator.label));
  }, [activeGeneratorLabels, selectedGroup]);

  const generated = useMemo(
    () =>
      generatedSubgroup(
        selectedGroup,
        activeGenerators.map((generator) => generator.element)
      ),
    [activeGenerators, selectedGroup]
  );
  const shouldFetchLatestCommit = window.location.hostname === "baditaflorin.github.io";

  const latestCommit = useQuery({
    queryKey: ["latestCommit"],
    queryFn: fetchLatestCommit,
    enabled: shouldFetchLatestCommit
  });

  useEffect(() => {
    writeStoredValue(storageKeys.group, selectedGroupId);
  }, [selectedGroupId]);

  useEffect(() => {
    writeStoredValue(storageKeys.view, view);
  }, [view]);

  useEffect(() => {
    setSelectedElement(0);
    const stored = readStoredValue<Record<string, string[]>>(
      storageKeys.generators,
      {},
      (value) => JSON.parse(value) as Record<string, string[]>
    );
    setActiveGeneratorLabels(
      stored[selectedGroup.id] ?? selectedGroup.generators.map((item) => item.label)
    );
  }, [selectedGroup]);

  useEffect(() => {
    const stored = readStoredValue<Record<string, string[]>>(
      storageKeys.generators,
      {},
      (value) => JSON.parse(value) as Record<string, string[]>
    );
    writeStoredValue(storageKeys.generators, {
      ...stored,
      [selectedGroup.id]: activeGeneratorLabels
    });
  }, [activeGeneratorLabels, selectedGroup.id]);

  useEffect(() => {
    let cancelled = false;
    setKernelStatus("WASM loading");
    void createGroupKernel(selectedGroup)
      .then((kernel) => {
        if (cancelled) return;
        const identity = summary.identity;
        const firstGenerator = selectedGroup.generators[0].element;
        const product = kernel.product(identity, firstGenerator);
        const order = kernel.elementOrder(identity, firstGenerator);
        setKernelStatus(
          product === firstGenerator
            ? `WASM ready · ${selectedGroup.elements[firstGenerator]} has order ${order}`
            : "WASM ready · table mismatch"
        );
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setKernelStatus(error instanceof Error ? error.message : "WASM unavailable");
      });

    return () => {
      cancelled = true;
    };
  }, [selectedGroup, summary.identity]);

  const selectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  const toggleGenerator = (generator: GroupGenerator) => {
    setActiveGeneratorLabels((current) => {
      if (current.includes(generator.label)) {
        const next = current.filter((label) => label !== generator.label);
        return next.length === 0 ? current : next;
      }
      return [...current, generator.label];
    });
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-ink/10 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded bg-ink text-paper">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight sm:text-xl">
                Group Theory Visualizer
              </h1>
              <p className="text-xs text-ink/60">
                finite groups · Cayley maps · symmetry scenes · local explanations
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={repositoryUrl}
              className="inline-flex h-10 items-center gap-2 rounded border border-ink/15 bg-white px-3 text-sm font-semibold text-ink hover:border-river hover:text-river"
            >
              <Github className="h-4 w-4" />
              Star repo
            </a>
            <a
              href={paypalUrl}
              className="inline-flex h-10 items-center gap-2 rounded border border-coral/30 bg-coral px-3 text-sm font-semibold text-white hover:bg-coral/90"
            >
              <Heart className="h-4 w-4" />
              PayPal
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink/10 px-4 py-2 text-xs text-ink/65 lg:px-6">
          <span>v{appVersion}</span>
          <span className="inline-flex items-center gap-1">
            <GitCommit className="h-3.5 w-3.5" />
            build {buildCommit} · {buildBranch}
          </span>
          <span>{new Date(buildDate).toLocaleString()}</span>
          <span>
            main{" "}
            {latestCommit.data ? (
              <a href={latestCommit.data.url} className="font-semibold text-river hover:underline">
                {latestCommit.data.shortSha}
              </a>
            ) : latestCommit.isError ? (
              "unavailable"
            ) : !shouldFetchLatestCommit ? (
              "live on GitHub Pages"
            ) : (
              "checking"
            )}
          </span>
        </div>
      </header>

      <main className="grid min-h-[calc(100vh-112px)] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <GroupPicker
          groups={filteredGroups}
          selectedId={selectedGroup.id}
          query={query}
          onQueryChange={setQuery}
          onSelect={selectGroup}
        />

        <section className="min-w-0">
          <div className="border-b border-ink/10 bg-paper px-4 py-4 lg:px-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-ink px-2.5 py-1 text-sm font-bold text-paper">
                    {selectedGroup.shortName}
                  </span>
                  <h2 className="text-2xl font-bold">{selectedGroup.name}</h2>
                </div>
                <p className="mt-2 text-sm leading-6 text-ink/70">{selectedGroup.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Metric label="order" value={selectedGroup.order} />
                <Metric label="abelian" value={summary.isAbelian ? "yes" : "no"} />
                <Metric label="center" value={summary.center.length} />
                <Metric label="exponent" value={summary.exponent} />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {selectedGroup.generators.map((generator) => (
                <button
                  key={generator.label}
                  onClick={() => toggleGenerator(generator)}
                  className={`inline-flex h-9 items-center gap-2 rounded border px-3 text-sm font-semibold ${
                    activeGenerators.some((item) => item.label === generator.label)
                      ? "border-ink bg-white text-ink"
                      : "border-ink/10 bg-transparent text-ink/50"
                  }`}
                  title={`Toggle generator ${generator.label}`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: generator.color }}
                    aria-hidden="true"
                  />
                  {generator.label}
                </button>
              ))}
              <span className="text-xs font-semibold text-ink/55">
                generates {generated.length}/{selectedGroup.order} · {kernelStatus}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <IconButton
                label="Map"
                icon={<Network className="h-4 w-4" />}
                active={view === "graph"}
                onClick={() => setView("graph")}
              />
              <IconButton
                label="3D"
                icon={<Rotate3D className="h-4 w-4" />}
                active={view === "symmetry"}
                onClick={() => setView("symmetry")}
              />
              <IconButton
                label="Table"
                icon={<Table2 className="h-4 w-4" />}
                active={view === "table"}
                onClick={() => setView("table")}
              />
              <IconButton
                label="Elements"
                icon={<Grid2X2 className="h-4 w-4" />}
                active={view === "elements"}
                onClick={() => setView("elements")}
              />
              <IconButton
                label="LLM"
                icon={<Bot className="h-4 w-4" />}
                active={view === "assistant"}
                onClick={() => setView("assistant")}
              />
            </div>
          </div>

          <div className="bg-white">
            <Suspense fallback={<LoadingView group={selectedGroup} />}>
              {view === "graph" ? (
                <GraphVizPanel group={selectedGroup} generators={activeGenerators} />
              ) : null}
              {view === "symmetry" ? <ThreeSymmetry group={selectedGroup} /> : null}
              {view === "table" ? (
                <MultiplicationTable
                  group={selectedGroup}
                  selectedElement={selectedElement}
                  onSelectElement={setSelectedElement}
                />
              ) : null}
              {view === "elements" ? (
                <ElementExplorer
                  group={selectedGroup}
                  summary={summary}
                  selectedElement={selectedElement}
                  onSelectElement={setSelectedElement}
                />
              ) : null}
              {view === "assistant" ? (
                <LocalAssistant group={selectedGroup} summary={summary} />
              ) : null}
            </Suspense>
          </div>

          <footer className="grid gap-3 border-t border-ink/10 bg-paper px-4 py-4 text-xs text-ink/60 sm:grid-cols-3 lg:px-6">
            <span className="inline-flex items-center gap-2">
              <Boxes className="h-3.5 w-3.5" />
              {groups.length} groups in catalog
            </span>
            <span className="inline-flex items-center gap-2">
              <Braces className="h-3.5 w-3.5" />
              center: {formatElements(selectedGroup, summary.center)}
            </span>
            <a href={repositoryUrl} className="font-semibold text-river hover:underline">
              https://github.com/baditaflorin/group-theory-visualizer
            </a>
          </footer>
        </section>
      </main>
    </div>
  );
}

function LoadingView({ group }: { group: FiniteGroup }) {
  return (
    <section className="grid min-h-[520px] place-items-center bg-white">
      <div className="text-sm font-semibold text-ink/65">Loading {group.shortName}</div>
    </section>
  );
}
