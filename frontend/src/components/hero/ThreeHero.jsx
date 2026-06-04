import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

// Faithful WebGL port of the original "hero-futuristic" TSL effect:
// depth-mapped 3D render + tiled dot grid + scanning flow wave + bloom.
// Scan color tuned to brand cyan/blue instead of red.

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = `
  uniform sampler2D uMap;
  uniform sampler2D uDepth;
  uniform vec2 uPointer;
  uniform float uProgress;
  uniform float uOpacity;
  uniform vec3 uScan;
  varying vec2 vUv;

  float hash(vec2 p){
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main(){
    vec2 uv = vUv;
    float strength = 0.012;
    float depthR = texture2D(uDepth, uv).r;

    // pointer parallax driven by depth
    vec2 mapUv = uv + depthR * uPointer * strength;
    vec4 tMap = texture2D(uMap, mapUv);

    // tiled dot grid
    vec2 tUv = uv;
    float tiling = 120.0;
    vec2 tiledUv = mod(tUv * tiling, 2.0) - 1.0;
    float brightness = hash(floor(tUv * tiling / 2.0));
    float dist = length(tiledUv);
    float dotv = smoothstep(0.5, 0.49, dist) * brightness;

    // scanning flow wave following depth contours
    float flow = 1.0 - smoothstep(0.0, 0.025, abs(depthR - uProgress));
    vec3 mask = vec3(dotv * flow) * uScan;

    // blue tint on the base render so bloom glows blue
    vec3 base = tMap.rgb * vec3(0.62, 0.82, 1.30);

    // blendScreen(base, mask)
    vec3 final = 1.0 - (1.0 - base) * (1.0 - mask);

    // circular vignette to melt edges into the dark hero
    float d = length(vUv - 0.5);
    float vig = 1.0 - smoothstep(0.34, 0.5, d);

    gl_FragColor = vec4(final, tMap.a * uOpacity * vig);
  }
`;

const ThreeHero = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer, composer, frameId;
    const cleanup = [];
    let disposed = false;

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

      const uniforms = {
        uMap: { value: null },
        uDepth: { value: null },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uProgress: { value: 0 },
        uOpacity: { value: 0 },
        uScan: { value: new THREE.Vector3(0.4, 3.2, 7.5) }, // bright cyan/blue for bloom
      };

      const material = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms,
        transparent: true,
        depthWrite: false,
      });

      const geometry = new THREE.PlaneGeometry(1, 1);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const fitPlane = () => {
        const dist = camera.position.z;
        const vH = 2 * Math.tan((camera.fov * Math.PI) / 180 / 2) * dist;
        const size = vH * 1.18; // square plane, slightly larger than viewport height
        mesh.scale.set(size, size, 1);
      };
      fitPlane();

      // Load textures (same-origin -> no CORS issues)
      const base = process.env.PUBLIC_URL || "";
      const loader = new THREE.TextureLoader();
      let loaded = 0;
      const onAll = () => {
        loaded += 1;
        if (loaded >= 2) startLoop();
      };
      const map = loader.load(`${base}/assets/img-4.png`, onAll);
      map.colorSpace = THREE.SRGBColorSpace;
      const depth = loader.load(`${base}/assets/raw-4.webp`, onAll);
      uniforms.uMap.value = map;
      uniforms.uDepth.value = depth;

      // Postprocessing bloom
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.95, 0.7, 0.62);
      composer.addPass(bloom);
      composer.addPass(new OutputPass());
      composer.setSize(width, height);

      // pointer
      const pointer = new THREE.Vector2(0, 0);
      const onMove = (e) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
      };
      window.addEventListener("pointermove", onMove);
      cleanup.push(() => window.removeEventListener("pointermove", onMove));

      const clock = new THREE.Clock();
      const startLoop = () => {
        if (disposed || frameId) return;
        const animate = () => {
          const t = clock.getElapsedTime();
          uniforms.uProgress.value = Math.sin(t * 0.5) * 0.5 + 0.5;
          uniforms.uPointer.value.x += (pointer.x - uniforms.uPointer.value.x) * 0.05;
          uniforms.uPointer.value.y += (pointer.y - uniforms.uPointer.value.y) * 0.05;
          uniforms.uOpacity.value += (1 - uniforms.uOpacity.value) * 0.04;
          composer.render();
          frameId = requestAnimationFrame(animate);
        };
        animate();
      };

      const onResize = () => {
        const w = mount.clientWidth || window.innerWidth;
        const h = mount.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        composer.setSize(w, h);
        fitPlane();
      };
      window.addEventListener("resize", onResize);
      cleanup.push(() => window.removeEventListener("resize", onResize));

      cleanup.push(() => {
        geometry.dispose();
        material.dispose();
        map.dispose();
        depth.dispose();
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("ShaderHero init failed:", err);
    }

    return () => {
      disposed = true;
      if (frameId) cancelAnimationFrame(frameId);
      cleanup.forEach((fn) => fn());
      if (composer && composer.dispose) composer.dispose();
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
