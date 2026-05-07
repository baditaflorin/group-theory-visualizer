const colors = ["#2364aa", "#f45b69", "#2fbf71", "#f5a623", "#7c3aed"];

function mod(value, n) {
  return ((value % n) + n) % n;
}

function cyclic(n) {
  return {
    id: `c${n}`,
    name: `Cyclic group C${n}`,
    shortName: `C${n}`,
    family: "cyclic",
    order: n,
    description: `Rotations by multiples of ${360 / n} degrees.`,
    presentation: `<a | a^${n} = e>`,
    symmetryKind: "polygon",
    elements: Array.from({ length: n }, (_, i) => (i === 0 ? "e" : i === 1 ? "a" : `a^${i}`)),
    operationTable: Array.from({ length: n }, (_, a) =>
      Array.from({ length: n }, (_, b) => mod(a + b, n))
    ),
    generators: [{ label: n === 1 ? "e" : "a", element: n === 1 ? 0 : 1, color: colors[0] }]
  };
}

function productGroup(left, right, id, name, shortName, description) {
  const elements = [];
  const pairs = [];
  for (let i = 0; i < left.order; i += 1) {
    for (let j = 0; j < right.order; j += 1) {
      pairs.push([i, j]);
      const l = left.elements[i];
      const r = right.elements[j];
      elements.push(`${l},${r}`);
    }
  }

  const index = new Map(pairs.map(([a, b], i) => [`${a}:${b}`, i]));
  const operationTable = pairs.map(([a1, b1]) =>
    pairs.map(([a2, b2]) => {
      const a = left.operationTable[a1][a2];
      const b = right.operationTable[b1][b2];
      return index.get(`${a}:${b}`);
    })
  );

  return {
    id,
    name,
    shortName,
    family: "product",
    order: elements.length,
    description,
    presentation: `${left.shortName} x ${right.shortName}`,
    symmetryKind: "torus",
    elements,
    operationTable,
    generators: [
      ...left.generators.map((generator, generatorIndex) => ({
        label: `${generator.label},e`,
        element: index.get(`${generator.element}:0`),
        color: colors[generatorIndex % colors.length]
      })),
      ...right.generators.map((generator, generatorIndex) => ({
        label: `e,${generator.label}`,
        element: index.get(`0:${generator.element}`),
        color: colors[(left.generators.length + generatorIndex) % colors.length]
      }))
    ]
  };
}

function dihedral(n) {
  const elements = [];
  for (let i = 0; i < n; i += 1) elements.push(i === 0 ? "e" : i === 1 ? "r" : `r^${i}`);
  for (let i = 0; i < n; i += 1) elements.push(i === 0 ? "s" : `r^${i}s`);

  const toIndex = (rotation, reflected) => mod(rotation, n) + (reflected ? n : 0);
  const operationTable = Array.from({ length: 2 * n }, (_, a) => {
    const ar = a % n;
    const af = a >= n;
    return Array.from({ length: 2 * n }, (_, b) => {
      const br = b % n;
      const bf = b >= n;
      return toIndex(ar + (af ? -br : br), af !== bf);
    });
  });

  return {
    id: `d${n}`,
    name: `Dihedral group D${n}`,
    shortName: `D${n}`,
    family: "dihedral",
    order: 2 * n,
    description: `Rotations and reflections of a regular ${n}-gon.`,
    presentation: `<r,s | r^${n} = s^2 = e, srs = r^-1>`,
    symmetryKind: "polygon-reflection",
    elements,
    operationTable,
    generators: [
      { label: "r", element: 1, color: colors[0] },
      { label: "s", element: n, color: colors[1] }
    ]
  };
}

function quaternion() {
  const names = ["1", "-1", "i", "-i", "j", "-j", "k", "-k"];
  const basis = {
    1: [1, "1"],
    "-1": [-1, "1"],
    i: [1, "i"],
    "-i": [-1, "i"],
    j: [1, "j"],
    "-j": [-1, "j"],
    k: [1, "k"],
    "-k": [-1, "k"]
  };
  const index = new Map(names.map((name, i) => [name, i]));
  const multiplyBasis = {
    "1:1": [1, "1"],
    "1:i": [1, "i"],
    "1:j": [1, "j"],
    "1:k": [1, "k"],
    "i:1": [1, "i"],
    "j:1": [1, "j"],
    "k:1": [1, "k"],
    "i:i": [-1, "1"],
    "j:j": [-1, "1"],
    "k:k": [-1, "1"],
    "i:j": [1, "k"],
    "j:k": [1, "i"],
    "k:i": [1, "j"],
    "j:i": [-1, "k"],
    "k:j": [-1, "i"],
    "i:k": [-1, "j"]
  };
  const multiply = (a, b) => {
    const [sa, ba] = basis[a];
    const [sb, bb] = basis[b];
    const [sp, bp] = multiplyBasis[`${ba}:${bb}`];
    const sign = sa * sb * sp;
    return sign === 1 ? bp : `-${bp}`;
  };

  return {
    id: "q8",
    name: "Quaternion group Q8",
    shortName: "Q8",
    family: "quaternion",
    order: 8,
    description: "The eight quaternion units under multiplication.",
    presentation: "<i,j | i^4 = e, i^2 = j^2, jij^-1 = i^-1>",
    symmetryKind: "axes",
    elements: names,
    operationTable: names.map((a) => names.map((b) => index.get(multiply(a, b)))),
    generators: [
      { label: "i", element: 2, color: colors[0] },
      { label: "j", element: 4, color: colors[1] }
    ]
  };
}

function compose(p, q) {
  return q.map((value) => p[value]);
}

function permKey(p) {
  return p.join(",");
}

function cycleNotation(p) {
  const seen = new Set();
  const cycles = [];
  for (let i = 0; i < p.length; i += 1) {
    if (seen.has(i) || p[i] === i) continue;
    const cycle = [];
    let current = i;
    while (!seen.has(current)) {
      seen.add(current);
      cycle.push(current + 1);
      current = p[current];
    }
    cycles.push(`(${cycle.join(" ")})`);
  }
  return cycles.length === 0 ? "e" : cycles.join("");
}

function permutationGroup(id, name, shortName, degree, generators, description, symmetryKind) {
  const identity = Array.from({ length: degree }, (_, i) => i);
  const elements = [identity];
  const queue = [identity];
  const seen = new Map([[permKey(identity), 0]]);

  while (queue.length > 0) {
    const current = queue.shift();
    for (const generator of generators) {
      for (const candidate of [
        compose(generator.permutation, current),
        compose(current, generator.permutation)
      ]) {
        const key = permKey(candidate);
        if (!seen.has(key)) {
          seen.set(key, elements.length);
          elements.push(candidate);
          queue.push(candidate);
        }
      }
    }
  }

  const operationTable = elements.map((a) =>
    elements.map((b) => {
      const composed = compose(a, b);
      return seen.get(permKey(composed));
    })
  );

  return {
    id,
    name,
    shortName,
    family: "permutation",
    order: elements.length,
    description,
    presentation: `Permutation group on ${degree} symbols`,
    symmetryKind,
    elements: elements.map(cycleNotation),
    operationTable,
    generators: generators.map((generator, index) => ({
      label: generator.label,
      element: seen.get(permKey(generator.permutation)),
      color: colors[index]
    }))
  };
}

function validateGroup(group) {
  const { order, operationTable } = group;
  if (operationTable.length !== order) throw new Error(`${group.id}: invalid row count`);
  for (const row of operationTable) {
    if (row.length !== order) throw new Error(`${group.id}: invalid column count`);
    for (const cell of row) {
      if (!Number.isInteger(cell) || cell < 0 || cell >= order) {
        throw new Error(`${group.id}: invalid product ${cell}`);
      }
    }
  }
  return group;
}

export function buildCatalog() {
  const c2 = cyclic(2);
  const c3 = cyclic(3);
  const c4 = cyclic(4);
  const groups = [
    cyclic(1),
    c2,
    c3,
    c4,
    cyclic(5),
    cyclic(6),
    cyclic(8),
    cyclic(12),
    productGroup(c2, c2, "v4", "Klein four group V4", "V4", "A square of commuting involutions."),
    productGroup(
      c4,
      c2,
      "c4xc2",
      "Product group C4 x C2",
      "C4 x C2",
      "Two independent clock symmetries."
    ),
    productGroup(
      productGroup(c2, c2, "tmp-v4", "tmp", "tmp", "tmp"),
      c2,
      "c2x2x2",
      "Elementary abelian group C2 x C2 x C2",
      "C2^3",
      "The vector space of three binary switches."
    ),
    dihedral(3),
    dihedral(4),
    dihedral(6),
    quaternion(),
    permutationGroup(
      "a4",
      "Alternating group A4",
      "A4",
      4,
      [
        { label: "(1 2 3)", permutation: [1, 2, 0, 3] },
        { label: "(1 2)(3 4)", permutation: [1, 0, 3, 2] }
      ],
      "Even symmetries of four symbols, visible as tetrahedral rotations.",
      "tetrahedron"
    ),
    permutationGroup(
      "s3",
      "Symmetric group S3",
      "S3",
      3,
      [
        { label: "(1 2 3)", permutation: [1, 2, 0] },
        { label: "(1 2)", permutation: [1, 0, 2] }
      ],
      "All permutations of three objects.",
      "triangle"
    ),
    permutationGroup(
      "s4",
      "Symmetric group S4",
      "S4",
      4,
      [
        { label: "(1 2 3 4)", permutation: [1, 2, 3, 0] },
        { label: "(1 2)", permutation: [1, 0, 2, 3] }
      ],
      "All permutations of four objects, linked to cube and tetrahedron symmetries.",
      "cube"
    )
  ]
    .filter((group) => !group.id.startsWith("tmp"))
    .map(validateGroup)
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

  return {
    schemaVersion: "group-catalog/v1",
    generatedAt: new Date(0).toISOString(),
    source: "deterministic local catalog",
    groups
  };
}
