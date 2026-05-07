import { Rotate3D } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as ThreeTypes from "three";
import type { FiniteGroup } from "@/features/groups/schema";

type ThreeSymmetryProps = {
  group: FiniteGroup;
};

type ThreeModule = typeof ThreeTypes;

export function ThreeSymmetry({ group }: ThreeSymmetryProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState("Preparing scene");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let cleanup = () => {};

    void import("three")
      .then((THREE) => {
        if (disposed) return;
        cleanup = mountScene(THREE, container, group, setStatus);
      })
      .catch((error: unknown) => {
        setStatus(error instanceof Error ? error.message : "Three.js failed to load.");
      });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [group]);

  return (
    <section className="relative min-h-[520px] flex-1 overflow-hidden bg-ink text-paper">
      <div
        ref={containerRef}
        className="absolute inset-0"
        aria-label={`${group.name} symmetry scene`}
      />
      <div className="pointer-events-none absolute left-4 top-4 rounded border border-white/15 bg-ink/70 px-3 py-2 backdrop-blur">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Rotate3D className="h-4 w-4 text-mint" />
          {group.shortName} symmetry
        </div>
        <div className="mt-1 text-xs text-paper/70">{status}</div>
      </div>
    </section>
  );
}

function mountScene(
  THREE: ThreeModule,
  container: HTMLDivElement,
  group: FiniteGroup,
  setStatus: (status: string) => void
) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#101820");

  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  camera.position.set(4.2, 3.4, 6.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.replaceChildren(renderer.domElement);

  const root = new THREE.Group();
  scene.add(root);

  const ambient = new THREE.AmbientLight("#f7f3e8", 1.4);
  const key = new THREE.DirectionalLight("#ffffff", 2.1);
  key.position.set(3, 5, 4);
  const rim = new THREE.DirectionalLight("#70d6ff", 1.1);
  rim.position.set(-5, 1, -2);
  scene.add(ambient, key, rim);

  addReferenceGrid(THREE, scene);
  addGroupShape(THREE, root, group);

  let pointerDown = false;
  let lastX = 0;
  let lastY = 0;
  let targetRotationX = -0.25;
  let targetRotationY = 0.45;

  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(Math.max(1, width), Math.max(1, height), false);
    camera.aspect = Math.max(1, width) / Math.max(1, height);
    camera.updateProjectionMatrix();
  };

  const onPointerDown = (event: PointerEvent) => {
    pointerDown = true;
    lastX = event.clientX;
    lastY = event.clientY;
    renderer.domElement.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!pointerDown) return;
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    targetRotationY += dx * 0.008;
    targetRotationX += dy * 0.006;
    lastX = event.clientX;
    lastY = event.clientY;
  };

  const onPointerUp = (event: PointerEvent) => {
    pointerDown = false;
    renderer.domElement.releasePointerCapture(event.pointerId);
  };

  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerup", onPointerUp);
  window.addEventListener("resize", resize);

  const clock = new THREE.Clock();
  let animationFrame = 0;
  const animate = () => {
    const delta = clock.getDelta();
    root.rotation.x += (targetRotationX - root.rotation.x) * 0.08;
    root.rotation.y += (targetRotationY - root.rotation.y) * 0.08 + delta * 0.12;
    renderer.render(scene, camera);
    animationFrame = requestAnimationFrame(animate);
  };

  resize();
  setStatus("Drag to rotate · live WebGL");
  animationFrame = requestAnimationFrame(animate);

  return () => {
    renderer.domElement.removeEventListener("pointerdown", onPointerDown);
    renderer.domElement.removeEventListener("pointermove", onPointerMove);
    renderer.domElement.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("resize", resize);
    cancelAnimationFrame(animationFrame);
    renderer.dispose();
    root.traverse((object) => {
      const mesh = object as Partial<ThreeTypes.Mesh>;
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        const material = mesh.material as ThreeTypes.Material | ThreeTypes.Material[];
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material.dispose();
      }
    });
  };
}

function addReferenceGrid(THREE: ThreeModule, scene: ThreeTypes.Scene) {
  const grid = new THREE.GridHelper(7, 14, "#2fbf71", "#2d3a42");
  grid.position.y = -1.45;
  scene.add(grid);
}

function addGroupShape(THREE: ThreeModule, root: ThreeTypes.Group, group: FiniteGroup) {
  if (group.symmetryKind === "tetrahedron") {
    addPolyhedron(THREE, root, new THREE.TetrahedronGeometry(1.8), group.order);
    return;
  }
  if (group.symmetryKind === "cube") {
    addPolyhedron(THREE, root, new THREE.BoxGeometry(2.4, 2.4, 2.4), group.order);
    return;
  }
  if (group.symmetryKind === "axes") {
    addQuaternionAxes(THREE, root);
    return;
  }
  if (group.symmetryKind === "torus") {
    addTorusOrbit(THREE, root, group.order);
    return;
  }
  addPolygonOrbit(THREE, root, group.order, group.family === "dihedral");
}

function addPolyhedron(
  THREE: ThreeModule,
  root: ThreeTypes.Group,
  geometry: ThreeTypes.BufferGeometry,
  order: number
) {
  const material = new THREE.MeshStandardMaterial({
    color: "#2364aa",
    roughness: 0.42,
    metalness: 0.12,
    transparent: true,
    opacity: 0.9
  });
  const mesh = new THREE.Mesh(geometry, material);
  root.add(mesh);

  const wire = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: "#f7f3e8", linewidth: 2 })
  );
  root.add(wire);
  addOrbitPoints(THREE, root, Math.min(order, 48), 2.55);
}

function addPolygonOrbit(
  THREE: ThreeModule,
  root: ThreeTypes.Group,
  order: number,
  reflections: boolean
) {
  const n = reflections ? Math.max(3, order / 2) : Math.max(3, order);
  const shape = new THREE.Shape();
  for (let i = 0; i < n; i += 1) {
    const angle = (i / n) * Math.PI * 2;
    const x = Math.cos(angle) * 1.8;
    const y = Math.sin(angle) * 1.8;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelSize: 0.025,
    bevelThickness: 0.025
  });
  geometry.center();
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ color: reflections ? "#f45b69" : "#2364aa", roughness: 0.35 })
  );
  root.add(mesh);
  addOrbitPoints(THREE, root, Math.min(order, 48), 2.45);
}

function addQuaternionAxes(THREE: ThreeModule, root: ThreeTypes.Group) {
  const axisMaterial = [
    new THREE.MeshStandardMaterial({ color: "#2364aa" }),
    new THREE.MeshStandardMaterial({ color: "#f45b69" }),
    new THREE.MeshStandardMaterial({ color: "#2fbf71" })
  ];
  const cylinder = new THREE.CylinderGeometry(0.035, 0.035, 4.4, 24);
  const rotations = [
    [0, 0, Math.PI / 2],
    [0, Math.PI / 2, 0],
    [Math.PI / 2, 0, 0]
  ];
  rotations.forEach((rotation, index) => {
    const mesh = new THREE.Mesh(cylinder, axisMaterial[index]);
    mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
    root.add(mesh);
  });
  addOrbitPoints(THREE, root, 8, 2.4);
}

function addTorusOrbit(THREE: ThreeModule, root: ThreeTypes.Group, order: number) {
  const torus = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.35, 0.18, 140, 16, 2, 3),
    new THREE.MeshStandardMaterial({ color: "#2fbf71", roughness: 0.28, metalness: 0.18 })
  );
  root.add(torus);
  addOrbitPoints(THREE, root, Math.min(order, 48), 2.55);
}

function addOrbitPoints(THREE: ThreeModule, root: ThreeTypes.Group, count: number, radius: number) {
  const palette = ["#f7f3e8", "#70d6ff", "#f5a623", "#f45b69", "#2fbf71"];
  const geometry = new THREE.SphereGeometry(0.075, 18, 18);
  for (let i = 0; i < count; i += 1) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const point = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({ color: palette[i % palette.length], emissive: "#000000" })
    );
    point.position.set(
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi)
    );
    root.add(point);
  }
}
