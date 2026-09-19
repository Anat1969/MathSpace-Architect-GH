import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { cn } from "@/lib/utils";

export default function StaircaseViewer({ angle = 30, acceleration = 0, optimal = false }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const stairsRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1d2e);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(4, 4, 6);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(3, 8, 5);
    scene.add(dir);

    const grid = new THREE.GridHelper(10, 20, 0x333355, 0x222244);
    scene.add(grid);

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const nw = mountRef.current.clientWidth;
      const nh = mountRef.current.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    if (stairsRef.current) {
      scene.remove(stairsRef.current);
      stairsRef.current.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    }

    const group = new THREE.Group();
    const stepCount = 15;
    const stepWidth = 1.2;
    const stepDepth = 0.3;
    const stepHeight = 0.18;
    const angleRad = (angle * Math.PI) / 180;
    const accelFactor = acceleration / 100;

    const mat = new THREE.MeshStandardMaterial({
      color: optimal ? 0x4ade80 : 0x6672a8,
    });
    const edgeMat = new THREE.LineBasicMaterial({
      color: optimal ? 0x22c55e : 0x8090d0
    });

    for (let i = 0; i < stepCount; i++) {
      const t = i / stepCount;
      const currentAngle = angleRad + accelFactor * t * 0.3;
      const rise = stepHeight + Math.sin(currentAngle) * 0.15;
      const run = stepDepth + Math.cos(currentAngle) * 0.1;

      const geom = new THREE.BoxGeometry(stepWidth, rise, run);
      const step = new THREE.Mesh(geom, mat);

      const y = i * rise;
      const z = -i * run;
      step.position.set(0, y + rise / 2, z);

      group.add(step);

      const edges = new THREE.EdgesGeometry(geom);
      const line = new THREE.LineSegments(edges, edgeMat);
      line.position.copy(step.position);
      group.add(line);
    }

    // Railing
    const railMat = new THREE.MeshStandardMaterial({
      color: optimal ? 0x22c55e : 0x555588,
      transparent: true,
      opacity: 0.5
    });
    const railGeom = new THREE.CylinderGeometry(0.02, 0.02, 5, 8);
    const rail = new THREE.Mesh(railGeom, railMat);
    rail.position.set(stepWidth / 2 + 0.1, 2, -2);
    rail.rotation.x = Math.PI / 6;
    group.add(rail);

    group.position.set(0, 0, 2);
    scene.add(group);
    stairsRef.current = group;
  }, [angle, acceleration, optimal]);

  return (
    <div
      ref={mountRef}
      className={cn(
        "w-full h-full min-h-[200px] rounded-2xl overflow-hidden border transition-all duration-500",
        optimal ? "border-emerald-500/30 shadow-lg shadow-emerald-500/10" : "border-border/30"
      )}
    />
  );
}