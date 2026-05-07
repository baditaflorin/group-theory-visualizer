import type { FiniteGroup, GroupGenerator } from "./schema";
import { product } from "./algebra";

export type CayleyEdge = {
  from: number;
  to: number;
  generator: GroupGenerator;
};

export function cayleyEdges(group: FiniteGroup, generators: GroupGenerator[]): CayleyEdge[] {
  return group.elements.flatMap((_, from) =>
    generators.map((generator) => ({
      from,
      to: product(group, from, generator.element),
      generator
    }))
  );
}

export function cayleyDot(group: FiniteGroup, generators: GroupGenerator[]): string {
  const nodes = group.elements
    .map((label, index) => `  n${index} [label="${escapeDot(label)}"];`)
    .join("\n");
  const edges = cayleyEdges(group, generators)
    .map((edge) => {
      return `  n${edge.from} -> n${edge.to} [label="${escapeDot(edge.generator.label)}", color="${edge.generator.color}", fontcolor="${edge.generator.color}"];`;
    })
    .join("\n");

  return `digraph "${escapeDot(group.shortName)}" {
  graph [rankdir=LR, bgcolor="transparent", margin=0.08, pad=0.05, splines=true, overlap=false];
  node [shape=circle, style="filled", fillcolor="#f7f3e8", color="#101820", fontname="Inter", fontsize=12, margin=0.05];
  edge [arrowsize=0.7, penwidth=1.8, fontname="Inter", fontsize=10];
${nodes}
${edges}
}`;
}

function escapeDot(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}
