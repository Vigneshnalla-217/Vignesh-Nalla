import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

// Reusable math helper at module scope to prevent per-frame GC allocations
const _dummy = new THREE.Object3D();

export function HeroScene3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { reducedMotion, isCompactViewport } = useDeviceCapabilities();
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion) return;

    // Probe for software WebGL once before renderer setup
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09070d, 0.055);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.2, isCompactViewport ? 9.5 : 7.8);

    // Studio environment reflection for metallic and crystal materials
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // Three-point warm/cool lighting rig
    const hemiLight = new THREE.HemisphereLight(0x9272ff, 0x100c16, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1f5, 2.2);
    keyLight.position.set(5, 6, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xff557f, 18, 20);
    rimLight.position.set(-4, -2, 3);
    scene.add(rimLight);

    const violetLight = new THREE.PointLight(0x9272ff, 16, 20);
    violetLight.position.set(4, 3, -2);
    scene.add(violetLight);

    // Composite multi-part 3D sculpture (shifted slightly to frame behind hero composition)
    const sculpture = new THREE.Group();
    sculpture.position.set(isCompactViewport ? 0 : 1.35, isCompactViewport ? 0.5 : 0.05, -0.8);
    scene.add(sculpture);

    // Part 1: Inner faceted crystal core
    const coreGeo = new THREE.IcosahedronGeometry(0.95, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xff557f,
      emissive: 0x3b0d22,
      emissiveIntensity: 0.7,
      metalness: 0.25,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    sculpture.add(coreMesh);

    // Part 2: Outer wireframe geometric cage
    const cageGeo = new THREE.OctahedronGeometry(1.42, 0);
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0x9272ff,
      wireframe: true,
      metalness: 0.85,
      roughness: 0.25,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    sculpture.add(cageMesh);

    // Part 3 & 4: Precision beveled orbital rings
    const ring1Geo = new THREE.TorusGeometry(2.05, 0.045, 20, 96);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xf5f1f7,
      metalness: 0.92,
      roughness: 0.18,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI * 0.36;
    ring1.rotation.y = Math.PI * 0.12;
    sculpture.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.48, 0.032, 16, 96);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xc44d9e,
      metalness: 0.88,
      roughness: 0.28,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI * 0.28;
    ring2.rotation.z = Math.PI * 0.22;
    sculpture.add(ring2);

    // Part 5-7: Orbiting polyhedral data nodes attached to rings
    const nodeGeo = new THREE.OctahedronGeometry(0.14, 0);
    const nodeMatCrimson = new THREE.MeshStandardMaterial({
      color: 0xff557f,
      emissive: 0xff557f,
      emissiveIntensity: 0.45,
      metalness: 0.6,
      roughness: 0.2,
    });
    const nodeMatViolet = new THREE.MeshStandardMaterial({
      color: 0x9272ff,
      emissive: 0x9272ff,
      emissiveIntensity: 0.45,
      metalness: 0.6,
      roughness: 0.2,
    });

    const node1 = new THREE.Mesh(nodeGeo, nodeMatCrimson);
    node1.position.set(2.05, 0, 0);
    ring1.add(node1);

    const node2 = new THREE.Mesh(nodeGeo, nodeMatViolet);
    node2.position.set(-2.05, 0, 0);
    ring1.add(node2);

    const node3 = new THREE.Mesh(nodeGeo, nodeMatCrimson);
    node3.position.set(0, 2.48, 0);
    ring2.add(node3);

    // Instanced subtle particle field
    const particleCount = isCompactViewport ? 65 : 130;
    const particleGeo = new THREE.OctahedronGeometry(0.035, 0);
    const particleMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    particles.frustumCulled = false;

    const particleSeeds: Array<{ x: number; y: number; z: number; speed: number; scale: number }> = [];
    const colorCrimson = new THREE.Color(0xff557f);
    const colorViolet = new THREE.Color(0x9272ff);
    const colorSoft = new THREE.Color(0xf5f1f7);

    for (let i = 0; i < particleCount; i++) {
      const px = (Math.random() - 0.5) * 14;
      const py = (Math.random() - 0.5) * 8;
      const pz = (Math.random() - 0.5) * 6 - 1.5;
      const scale = 0.6 + Math.random() * 1.2;
      particleSeeds.push({ x: px, y: py, z: pz, speed: 0.3 + Math.random() * 0.6, scale });

      _dummy.position.set(px, py, pz);
      _dummy.scale.setScalar(scale);
      _dummy.updateMatrix();
      particles.setMatrixAt(i, _dummy.matrix);

      if (i % 3 === 0) particles.setColorAt(i, colorCrimson);
      else if (i % 3 === 1) particles.setColorAt(i, colorViolet);
      else particles.setColorAt(i, colorSoft);
    }
    particles.instanceMatrix.needsUpdate = true;
    if (particles.instanceColor) particles.instanceColor.needsUpdate = true;
    particles.computeBoundingSphere();
    scene.add(particles);

    // Pointer parallax target
    let targetPointerX = 0;
    let targetPointerY = 0;
    let smoothPointerX = 0;
    let smoothPointerY = 0;

    const onPointerMove = (e: PointerEvent) => {
      targetPointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetPointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      const nextW = container.clientWidth || window.innerWidth;
      const nextH = container.clientHeight || window.innerHeight;
      camera.aspect = nextW / nextH;
      camera.updateProjectionMatrix();
      renderer.setSize(nextW, nextH);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', onResize, { passive: true });

    let contextLost = false;
    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };
    const onContextRestored = () => {
      contextLost = false;
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      if (contextLost) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      smoothPointerX = THREE.MathUtils.damp(smoothPointerX, targetPointerX, 4.5, delta);
      smoothPointerY = THREE.MathUtils.damp(smoothPointerY, targetPointerY, 4.5, delta);

      coreMesh.rotation.y += delta * 0.45;
      coreMesh.rotation.x += delta * 0.25;
      cageMesh.rotation.y -= delta * 0.28;
      cageMesh.rotation.z += delta * 0.18;

      ring1.rotation.z += delta * 0.35;
      ring2.rotation.y -= delta * 0.26;

      sculpture.rotation.y = smoothPointerX * 0.32;
      sculpture.rotation.x = smoothPointerY * 0.22;
      sculpture.position.y = (isCompactViewport ? 0.5 : 0.05) + Math.sin(elapsed * 1.1) * 0.12;

      for (let i = 0; i < particleCount; i++) {
        const seed = particleSeeds[i];
        _dummy.position.set(
          seed.x + smoothPointerX * 0.25,
          seed.y + Math.sin(elapsed * seed.speed + i) * 0.14 - smoothPointerY * 0.2,
          seed.z
        );
        _dummy.rotation.y = elapsed * seed.speed;
        _dummy.scale.setScalar(seed.scale);
        _dummy.updateMatrix();
        particles.setMatrixAt(i, _dummy.matrix);
      }
      particles.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);

      coreGeo.dispose();
      coreMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      nodeGeo.dispose();
      nodeMatCrimson.dispose();
      nodeMatViolet.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      envTexture.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion, isCompactViewport]);

  if (reducedMotion || webglFailed) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute top-1/4 right-1/4 h-80 w-80 rounded-full bg-[#FF557F]/12 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 h-80 w-80 rounded-full bg-[#9272FF]/14 blur-[120px]" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-90"
    />
  );
}
