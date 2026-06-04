import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

// Vanilla Three.js hero (no R3F) for maximum compatibility + bloom glow.
const ThreeHero = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer;
    let frameId;
    let composer;
    const cleanupFns = [];

    try {
      const width = mount.clientWidth || window.innerWidth;
      const height = mount.clientHeight || window.innerHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 6);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      // Lights
      scene.add(new THREE.AmbientLight(0xffffff, 0.75));
      const p1 = new THREE.PointLight(0x67e8f9, 2.4, 100);
      p1.position.set(5, 5, 5);
      scene.add(p1);
      const p2 = new THREE.PointLight(0x2563eb, 1.8, 100);
      p2.position.set(-5, -3, 2);
      scene.add(p2);
      const dir = new THREE.DirectionalLight(0xffffff, 1.0);
      dir.position.set(0, 4, 6);
      scene.add(dir);

      const group = new THREE.Group();
      scene.add(group);

      // Central wireframe orb
      const orb = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.3, 1),
        new THREE.MeshStandardMaterial({ color: 0x2563eb, emissive: 0x1d4ed8, emissiveIntensity: 1.0, metalness: 0.7, roughness: 0.2, wireframe: true })
      );
      group.add(orb);

      // Floating glowing shapes
      const shapeDefs = [
        { geo: new THREE.DodecahedronGeometry(0.5, 0), color: 0x0ea5e9, pos: [2.6, 0.6, -1], speed: 1.2, emissive: 1.7 },
        { geo: new THREE.IcosahedronGeometry(0.42, 0), color: 0x67e8f9, pos: [-2.8, 0.9, -0.5], speed: 0.9, emissive: 1.9 },
        { geo: new THREE.TorusGeometry(0.36, 0.14, 16, 40), color: 0x3b82f6, pos: [2.1, -1.4, 0.5], speed: 1.4, emissive: 1.6 },
        { geo: new THREE.OctahedronGeometry(0.46, 0), color: 0x2563eb, pos: [-2.3, -1.2, 0.4], speed: 1.1, emissive: 1.7 },
        { geo: new THREE.SphereGeometry(0.22, 24, 24), color: 0x67e8f9, pos: [0, 2.05, -0.5], speed: 1.6, emissive: 2.2 },
        { geo: new THREE.SphereGeometry(0.18, 24, 24), color: 0x0ea5e9, pos: [1.25, 1.6, 0.8], speed: 2.0, emissive: 2.0 },
        { geo: new THREE.TetrahedronGeometry(0.4, 0), color: 0x3b82f6, pos: [-1.3, 1.7, 0.6], speed: 1.5, emissive: 1.8 },
      ];

      const meshes = shapeDefs.map((d) => {
        const mat = new THREE.MeshStandardMaterial({ color: d.color, emissive: d.color, emissiveIntensity: d.emissive, metalness: 0.4, roughness: 0.25 });
        const m = new THREE.Mesh(d.geo, mat);
        m.position.set(d.pos[0], d.pos[1], d.pos[2]);
        m.userData = { baseY: d.pos[1], speed: d.speed, seed: Math.random() * 100 };
        group.add(m);
        return m;
      });

      // Postprocessing: bloom
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.75, 0.55, 0.55);
      composer.addPass(bloom);
      composer.addPass(new OutputPass());
      composer.setSize(width, height);

      // Pointer parallax
      const pointer = { x: 0, y: 0 };
      const onPointerMove = (e) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
      };
      window.addEventListener("pointermove", onPointerMove);
      cleanupFns.push(() => window.removeEventListener("pointermove", onPointerMove));

      const clock = new THREE.Clock();
      const animate = () => {
        const t = clock.getElapsedTime();
        orb.rotation.y = t * 0.25;
        orb.rotation.z = Math.sin(t * 0.3) * 0.15;
        meshes.forEach((m) => {
          m.position.y = m.userData.baseY + Math.sin(t * m.userData.speed + m.userData.seed) * 0.35;
          m.rotation.x = t * 0.3;
          m.rotation.y = t * 0.24;
        });
        group.rotation.y += (pointer.x * 0.4 - group.rotation.y) * 0.05;
        group.rotation.x += (-pointer.y * 0.3 - group.rotation.x) * 0.05;
        composer.render();
        frameId = requestAnimationFrame(animate);
      };
      animate();

      // Resize
      const handleResize = () => {
        const w = mount.clientWidth || window.innerWidth;
        const h = mount.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        composer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);
      cleanupFns.push(() => window.removeEventListener("resize", handleResize));

      cleanupFns.push(() => {
        meshes.forEach((m) => { m.geometry.dispose(); m.material.dispose(); });
        orb.geometry.dispose();
        orb.material.dispose();
      });
    } catch (err) {
      // WebGL not available -> gracefully show gradient fallback (parent has hero-bg)
      // eslint-disable-next-line no-console
      console.error("ThreeHero init failed:", err);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      cleanupFns.forEach((fn) => fn());
      if (composer) composer.dispose && composer.dispose();
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" data-testid="three-hero-canvas" aria-hidden="true" />;
};

export default ThreeHero;
