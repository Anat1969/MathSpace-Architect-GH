import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { cn } from "@/lib/utils";

export default function RoomViewer3D({ shape = 'square', ratio = 1, goldenActive = false }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const roomRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(goldenActive ? 0x2a2520 : 0x1a1d2e);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.set(0, 3.5, 5);
    camera.lookAt(0, 0.5, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(3, 5, 3);
    scene.add(dir);

    const point = new THREE.PointLight(goldenActive ? 0xf0c040 : 0x4060f0, goldenActive ? 1.5 : 0.5, 10);
    point.position.set(0, 2.5, 0);
    scene.add(point);

    // Grid floor
    const grid = new THREE.GridHelper(10, 20, 0x444466, 0x333355);
    scene.add(grid);

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (roomRef.current) {
        roomRef.current.rotation.y += 0.003;
      }
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

  // Update room shape
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Remove old room
    if (roomRef.current) {
      scene.remove(roomRef.current);
      roomRef.current.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    }

    const group = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({
      color: goldenActive ? 0xd4a840 : 0x6672a8,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const edgeMat = new THREE.LineBasicMaterial({ color: goldenActive ? 0xf0c040 : 0x8090d0 });

    let floorGeom;
    const width = 2 * ratio;
    const depth = 2;
    const height = 2.5;

    if (shape === 'circle') {
      floorGeom = new THREE.CircleGeometry(1.5, 32);
      const wallGeom = new THREE.CylinderGeometry(1.5, 1.5, height, 32, 1, true);
      const walls = new THREE.Mesh(wallGeom, wallMat);
      walls.position.y = height / 2;
      group.add(walls);
      const edges = new THREE.EdgesGeometry(wallGeom);
      group.add(new THREE.LineSegments(edges, edgeMat));
    } else if (shape === 'hexagon') {
      floorGeom = new THREE.CircleGeometry(1.5, 6);
      const wallGeom = new THREE.CylinderGeometry(1.5, 1.5, height, 6, 1, true);
      const walls = new THREE.Mesh(wallGeom, wallMat);
      walls.position.y = height / 2;
      group.add(walls);
      const edges = new THREE.EdgesGeometry(wallGeom);
      group.add(new THREE.LineSegments(edges, edgeMat));
    } else {
      floorGeom = new THREE.PlaneGeometry(width, depth);
      const wallGeom = new THREE.BoxGeometry(width, height, depth);
      const walls = new THREE.Mesh(wallGeom, wallMat);
      walls.position.y = height / 2;
      group.add(walls);
      const edges = new THREE.EdgesGeometry(wallGeom);
      group.add(new THREE.LineSegments(edges, edgeMat));
    }

    const floorMat = new THREE.MeshStandardMaterial({
      color: goldenActive ? 0x3a3020 : 0x2a2d3e,
      side: THREE.DoubleSide
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    group.add(floor);

    scene.add(group);
    roomRef.current = group;

    // Update background & lights
    scene.background = new THREE.Color(goldenActive ? 0x2a2520 : 0x1a1d2e);
    scene.children.forEach(child => {
      if (child instanceof THREE.PointLight) {
        child.color.set(goldenActive ? 0xf0c040 : 0x4060f0);
        child.intensity = goldenActive ? 1.5 : 0.5;
      }
    });
  }, [shape, ratio, goldenActive]);

  return (
    <div
      ref={mountRef}
      className={cn(
        "w-full h-64 md:h-80 rounded-2xl overflow-hidden border transition-all duration-700",
        goldenActive ? "border-accent/50 shadow-lg shadow-accent/20" : "border-border/30"
      )}
    />
  );
}