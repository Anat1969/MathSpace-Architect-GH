import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { cn } from "@/lib/utils";

export default function CityViewer({ model = null }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const buildingsRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1d2e);
    scene.fog = new THREE.Fog(0x1a1d2e, 15, 35);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(8, 8, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.7);
    dir.position.set(5, 10, 5);
    scene.add(dir);

    const grid = new THREE.GridHelper(20, 40, 0x333355, 0x222244);
    scene.add(grid);

    let angle = 0;
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      angle += 0.002;
      camera.position.x = 12 * Math.cos(angle);
      camera.position.z = 12 * Math.sin(angle);
      camera.lookAt(0, 1, 0);
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

    if (buildingsRef.current) {
      scene.remove(buildingsRef.current);
      buildingsRef.current.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    }

    if (!model) return;

    const group = new THREE.Group();

    if (model === 'monotone') {
      scene.background = new THREE.Color(0x1c1c1c);
      scene.fog = new THREE.Fog(0x1c1c1c, 10, 30);
      const gray = new THREE.MeshStandardMaterial({ color: 0x666666 });
      for (let i = 0; i < 30; i++) {
        const h = 1.5 + Math.random() * 4;
        const geom = new THREE.BoxGeometry(0.8, h, 0.8);
        const mesh = new THREE.Mesh(geom, gray);
        mesh.position.set(
          (Math.floor(i / 6) - 2.5) * 1.5,
          h / 2,
          (i % 6 - 2.5) * 1.5
        );
        group.add(mesh);
      }
    } else if (model === 'organic') {
      scene.background = new THREE.Color(0x1a2520);
      scene.fog = new THREE.Fog(0x1a2520, 15, 35);
      const colors = [0xe74c3c, 0xf39c12, 0x2ecc71, 0x3498db, 0x9b59b6, 0x1abc9c];
      for (let i = 0; i < 35; i++) {
        const colorIdx = Math.floor(Math.random() * colors.length);
        const mat = new THREE.MeshStandardMaterial({ color: colors[colorIdx] });
        const shapes = [
          () => new THREE.BoxGeometry(0.5 + Math.random() * 0.6, 0.8 + Math.random() * 2, 0.5 + Math.random() * 0.6),
          () => new THREE.CylinderGeometry(0.2 + Math.random() * 0.3, 0.3 + Math.random() * 0.3, 0.8 + Math.random() * 1.5, 8),
          () => new THREE.ConeGeometry(0.3 + Math.random() * 0.3, 1 + Math.random() * 1.5, 6),
        ];
        const geom = shapes[Math.floor(Math.random() * shapes.length)]();
        const mesh = new THREE.Mesh(geom, mat);
        const angle = (i / 35) * Math.PI * 4;
        const radius = 0.5 + (i / 35) * 5;
        mesh.position.set(
          Math.cos(angle) * radius,
          mesh.geometry.parameters.height / 2 || 0.5,
          Math.sin(angle) * radius
        );
        mesh.rotation.y = Math.random() * Math.PI;
        group.add(mesh);
      }

      // Add trees
      const treeMat = new THREE.MeshStandardMaterial({ color: 0x27ae60 });
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6d4c41 });
      for (let i = 0; i < 12; i++) {
        const tree = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.6, 6), trunkMat);
        trunk.position.y = 0.3;
        tree.add(trunk);
        const crown = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), treeMat);
        crown.position.y = 0.8;
        tree.add(crown);
        tree.position.set(
          (Math.random() - 0.5) * 10,
          0,
          (Math.random() - 0.5) * 10
        );
        group.add(tree);
      }
    }

    scene.add(group);
    buildingsRef.current = group;
  }, [model]);

  return (
    <div
      ref={mountRef}
      className={cn(
        "w-full h-64 md:h-80 rounded-2xl overflow-hidden border transition-all duration-500",
        model === 'organic' ? "border-emerald-500/30" : model === 'monotone' ? "border-red-500/30" : "border-border/30"
      )}
    />
  );
}