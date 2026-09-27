import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { sound } from '../utils/audio';

interface PlanetInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanet?: 'earth' | 'mars';
  onShowToast: (msg: string) => void;
}

export const PlanetInspectorModal: React.FC<PlanetInspectorModalProps> = ({
  isOpen,
  onClose,
  initialPlanet = 'earth',
  onShowToast,
}) => {
  const [selectedPlanet, setSelectedPlanet] = useState<'earth' | 'mars'>(initialPlanet);
  const containerRef = useRef<HTMLDivElement>(null);
  const modalBoxRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Three.js internal references
  const threeState = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    planetMesh: THREE.Mesh | null;
    cloudMesh: THREE.Mesh | null;
    atmoMesh: THREE.Mesh | null;
    ringMesh: THREE.Mesh | null;
    planetGroup: THREE.Group | null;
    animId: number | null;
    earthTexture: THREE.CanvasTexture | null;
    marsTexture: THREE.CanvasTexture | null;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    planetMesh: null,
    cloudMesh: null,
    atmoMesh: null,
    ringMesh: null,
    planetGroup: null,
    animId: null,
    earthTexture: null,
    marsTexture: null,
  });

  // Entrance & Exit animation with GSAP
  useEffect(() => {
    if (isOpen) {
      sound.playClick(1400, 0.08);
      if (modalBoxRef.current && backdropRef.current) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: 'power2.out' }
        );
        gsap.fromTo(
          modalBoxRef.current,
          { y: 40, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.4)' }
        );
      }
    }
  }, [isOpen]);

  // Procedural canvas textures
  const createEarthTexture = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Ocean gradient
      const ocean = ctx.createLinearGradient(0, 0, 0, 512);
      ocean.addColorStop(0, '#0c1b33');
      ocean.addColorStop(0.5, '#07182e');
      ocean.addColorStop(1, '#051020');
      ctx.fillStyle = ocean;
      ctx.fillRect(0, 0, 1024, 512);

      // Continents
      ctx.fillStyle = '#1e4835';
      ctx.beginPath();
      ctx.ellipse(250, 180, 90, 60, -0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(320, 320, 60, 90, 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#2d5a3f';
      ctx.beginPath();
      ctx.ellipse(580, 190, 140, 80, 0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#6e5a32';
      ctx.beginPath();
      ctx.ellipse(540, 240, 80, 50, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#22553b';
      ctx.beginPath();
      ctx.ellipse(560, 330, 65, 80, 0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(780, 220, 80, 60, -0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(820, 350, 60, 45, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Ice caps
      ctx.fillStyle = '#eef6fc';
      ctx.fillRect(0, 0, 1024, 30);
      ctx.fillRect(0, 482, 1024, 30);
    }
    return new THREE.CanvasTexture(canvas);
  };

  const createMarsTexture = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#c1440e');
      grad.addColorStop(0.5, '#8c2d04');
      grad.addColorStop(1, '#5a1900');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Craters & dark highlands
      ctx.fillStyle = '#421200';
      ctx.beginPath();
      ctx.ellipse(380, 260, 160, 90, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(750, 220, 120, 70, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // South polar CO2 ice cap
      ctx.fillStyle = '#fce4dc';
      ctx.fillRect(0, 480, 1024, 32);
    }
    return new THREE.CanvasTexture(canvas);
  };

  const createCloudTexture = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(0, 0, 1024, 512);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      for (let i = 0; i < 65; i++) {
        const x = Math.random() * 1024;
        const y = 80 + Math.random() * 350;
        const r = 25 + Math.random() * 45;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    return new THREE.CanvasTexture(canvas);
  };

  // Setup Three.js scene
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 340;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x1a2638, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
    sunLight.position.set(5, 3, 4);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x00f0ff, 0.8);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    const earthTex = createEarthTexture();
    const marsTex = createMarsTexture();
    const cloudTex = createCloudTexture();

    // Planet Sphere
    const earthGeom = new THREE.SphereGeometry(1, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      map: selectedPlanet === 'earth' ? earthTex : marsTex,
      shininess: 25,
      specular: new THREE.Color(0x224466),
    });
    const planetMesh = new THREE.Mesh(earthGeom, earthMat);
    planetGroup.add(planetMesh);

    // Cloud Layer
    const cloudGeom = new THREE.SphereGeometry(1.02, 48, 48);
    const cloudMat = new THREE.MeshPhongMaterial({
      map: cloudTex,
      transparent: true,
      opacity: selectedPlanet === 'earth' ? 0.6 : 0,
      blending: THREE.AdditiveBlending,
    });
    const cloudMesh = new THREE.Mesh(cloudGeom, cloudMat);
    planetGroup.add(cloudMesh);

    // Atmosphere halo
    const atmoGeom = new THREE.SphereGeometry(1.08, 48, 48);
    const atmoMat = new THREE.MeshLambertMaterial({
      color: selectedPlanet === 'earth' ? 0x00f0ff : 0xff7744,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const atmoMesh = new THREE.Mesh(atmoGeom, atmoMat);
    planetGroup.add(atmoMesh);

    // 3D Polar Ring Grid HUD
    const ringGeom = new THREE.RingGeometry(1.35, 1.365, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: selectedPlanet === 'earth' ? 0x00f0ff : 0xff5522,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.x = Math.PI / 2.3;
    planetGroup.add(ringMesh);

    // Interactive Drag Rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0.2;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
      const clientY = 'clientY' in e ? e.clientY : e.touches[0].clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
      const clientY = 'clientY' in e ? e.clientY : e.touches[0].clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      targetRotY += deltaX * 0.008;
      targetRotX += deltaY * 0.008;
      targetRotX = Math.max(-1.2, Math.min(1.2, targetRotX));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.style.cursor = 'grab';
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 340;
      const h = container.clientHeight || 300;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging) {
        targetRotY += 0.003;
      }

      planetGroup.rotation.y += (targetRotY - planetGroup.rotation.y) * 0.08;
      planetGroup.rotation.x += (targetRotX - planetGroup.rotation.x) * 0.08;
      cloudMesh.rotation.y += 0.0015;
      ringMesh.rotation.z += 0.002;

      renderer.render(scene, camera);
    };
    animate();

    threeState.current = {
      renderer,
      scene,
      camera,
      planetMesh,
      cloudMesh,
      atmoMesh,
      ringMesh,
      planetGroup,
      animId,
      earthTexture: earthTex,
      marsTexture: marsTex,
    };

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      dom.removeEventListener('mousedown', onPointerDown);
      dom.removeEventListener('touchstart', onPointerDown);
      renderer.dispose();
    };
  }, [isOpen]);

  // Planet Switcher Handler
  const handleSwitchPlanet = (planet: 'earth' | 'mars') => {
    setSelectedPlanet(planet);
    sound.playTargetLock();
    onShowToast(`Loaded Planetary Model: ${planet === 'earth' ? 'EARTH (TERRA)' : 'MARS (ARES)'}`);

    const { planetMesh, cloudMesh, atmoMesh, ringMesh, earthTexture, marsTexture } = threeState.current;
    if (planetMesh && cloudMesh && atmoMesh && ringMesh) {
      const mat = planetMesh.material as THREE.MeshPhongMaterial;
      if (planet === 'mars') {
        if (marsTexture) mat.map = marsTexture;
        mat.needsUpdate = true;
        cloudMesh.visible = false;
        (atmoMesh.material as THREE.MeshLambertMaterial).color.setHex(0xff7744);
        (ringMesh.material as THREE.MeshBasicMaterial).color.setHex(0xff5522);
      } else {
        if (earthTexture) mat.map = earthTexture;
        mat.needsUpdate = true;
        cloudMesh.visible = true;
        (atmoMesh.material as THREE.MeshLambertMaterial).color.setHex(0x00f0ff);
        (ringMesh.material as THREE.MeshBasicMaterial).color.setHex(0x00f0ff);
      }
    }
  };

  const handleClose = () => {
    sound.playClick(900, 0.04);
    if (modalBoxRef.current && backdropRef.current) {
      gsap.to(modalBoxRef.current, {
        y: 30,
        opacity: 0,
        scale: 0.95,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: onClose,
      });
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.2 });
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  const isEarth = selectedPlanet === 'earth';

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
      onClick={handleClose}
    >
      <div
        ref={modalBoxRef}
        className="relative w-full max-w-lg bg-[#0b0e16]/95 border border-[#00f0ff]/30 rounded-t-2xl sm:rounded-2xl shadow-[0_0_35px_rgba(0,240,255,0.25)] overflow-hidden max-h-[92vh] flex flex-col text-[#e1e2ee]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1d1f28]/70 border-b border-[#3b494b]/30 backdrop-blur-md shrink-0">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-telemetry text-[10px] text-[#00f0ff] tracking-widest uppercase">
                PLANETARY INSPECTION MODULE
              </span>
              <span className="text-[#3b494b] font-telemetry text-[10px]">•</span>
              <span className="font-telemetry text-[10px] text-[#ffd07c] tracking-wide uppercase">
                {isEarth ? 'SYS.BODY // SOL-III' : 'SYS.BODY // SOL-IV'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse"></span>
              <span className="font-telemetry text-[9px] text-[#00f0ff] tracking-wider uppercase">
                LIVE TELEMETRY FEED • 60 FPS
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close Inspection Modal"
            className="w-8 h-8 rounded-lg bg-[#272a33]/80 hover:bg-[#363943] text-[#b9cacb] hover:text-[#00f0ff] flex items-center justify-center active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 space-y-3.5 overflow-y-auto overscroll-contain">
          {/* Planet Toggle Pill */}
          <div className="flex items-center p-1 bg-[#191b24] rounded-xl border border-[#3b494b]/30 shadow-inner">
            <button
              onClick={() => handleSwitchPlanet('earth')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-telemetry text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                isEarth
                  ? 'bg-[#00f0ff] text-[#00363a] shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'text-[#b9cacb] hover:text-[#00f0ff]'
              }`}
            >
              <span>🌍</span>
              <span>EARTH (TERRA)</span>
            </button>
            <button
              onClick={() => handleSwitchPlanet('mars')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-telemetry text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                !isEarth
                  ? 'bg-[#93000a] text-[#ffdad6] border border-[#ffb4ab]/50 shadow-[0_0_12px_rgba(255,180,171,0.35)]'
                  : 'text-[#b9cacb] hover:text-[#ffb4ab]'
              }`}
            >
              <span>🔴</span>
              <span>MARS (ARES)</span>
            </button>
          </div>

          {/* 3D Planet Viewport */}
          <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-[#00f0ff]/25 bg-[#0b0e16]/90 shadow-inner group">
            {/* Tactical Corners */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#00f0ff] pointer-events-none z-10"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#00f0ff] pointer-events-none z-10"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#00f0ff] pointer-events-none z-10"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#00f0ff] pointer-events-none z-10"></div>

            {/* Coordinates */}
            <div className="absolute top-2.5 left-8 font-telemetry text-[9px] text-[#00f0ff]/70 pointer-events-none z-10 tracking-widest uppercase">
              {isEarth ? 'LAT 00°00\'00"N' : 'LAT 18°39\'00"N'}
            </div>
            <div className="absolute top-2.5 right-8 font-telemetry text-[9px] text-[#00f0ff]/70 pointer-events-none z-10 tracking-widest uppercase">
              {isEarth ? 'LON 00°00\'00"E' : 'LON 226°12\'00"E'}
            </div>

            {/* Scanline */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 z-10">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent animate-scanline"></div>
            </div>

            {/* Canvas Mount Container */}
            <div ref={containerRef} className="w-full h-full"></div>

            {/* Drag to rotate pill */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-[#0b0e16]/85 backdrop-blur-md px-3 py-1 rounded-full border border-[#00f0ff]/20 flex items-center gap-1.5 pointer-events-none z-10 shadow-md">
              <span className="material-symbols-outlined text-[14px] text-[#00f0ff] animate-pulse">drag_indicator</span>
              <span className="font-telemetry text-[9px] text-[#00f0ff] tracking-widest uppercase">
                ↔ DRAG TO ROTATE 360°
              </span>
            </div>
          </div>

          {/* Telemetry Matrix Grid */}
          <div className="grid grid-cols-2 gap-2 text-[#e1e2ee]">
            <div className="bg-[#1d1f28]/70 rounded-xl p-2.5 border border-[#3b494b]/20 flex flex-col justify-between">
              <span className="font-telemetry text-[9px] text-[#b9cacb] uppercase">EQUATORIAL RADIUS</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-telemetry text-lg text-[#00f0ff] font-bold">
                  {isEarth ? '6,371' : '3,389'}
                </span>
                <span className="font-telemetry text-xs text-[#00f0ff]">km</span>
              </div>
              <span className="font-telemetry text-[10px] text-[#b9cacb] mt-0.5">
                {isEarth ? 'Ø 12,742 km' : 'Ø 6,779 km'}
              </span>
            </div>

            <div className="bg-[#1d1f28]/70 rounded-xl p-2.5 border border-[#3b494b]/20 flex flex-col justify-between">
              <span className="font-telemetry text-[9px] text-[#b9cacb] uppercase">SURFACE GRAVITY</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-telemetry text-lg text-[#00f0ff] font-bold">
                  {isEarth ? '9.807' : '3.721'}
                </span>
                <span className="font-telemetry text-xs text-[#00f0ff]">m/s²</span>
              </div>
              <span className="font-telemetry text-[10px] text-[#ffd07c] mt-0.5">
                {isEarth ? '1.00 g (Standard)' : '0.38 g (Low-G)'}
              </span>
            </div>

            <div className="bg-[#1d1f28]/70 rounded-xl p-2.5 border border-[#3b494b]/20 flex flex-col justify-between">
              <span className="font-telemetry text-[9px] text-[#b9cacb] uppercase">MEAN SURFACE TEMP</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-telemetry text-lg text-[#ffd07c] font-bold">
                  {isEarth ? '+15' : '-63'}
                </span>
                <span className="font-telemetry text-xs text-[#ffd07c]">°C</span>
              </div>
              <span className="font-telemetry text-[10px] text-[#b9cacb] mt-0.5">
                {isEarth ? 'Range: -88°C to +58°C' : 'Range: -140°C to +20°C'}
              </span>
            </div>

            <div className="bg-[#1d1f28]/70 rounded-xl p-2.5 border border-[#3b494b]/20 flex flex-col justify-between">
              <span className="font-telemetry text-[9px] text-[#b9cacb] uppercase">NATURAL SATELLITES</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-telemetry text-lg text-[#00f0ff] font-bold">
                  {isEarth ? '1' : '2'}
                </span>
                <span className="font-telemetry text-xs text-[#00f0ff]">
                  {isEarth ? 'MOON' : 'MOONS'}
                </span>
              </div>
              <span className="font-telemetry text-[10px] text-[#b9cacb] truncate mt-0.5">
                {isEarth ? 'Luna (Synchronous)' : 'Phobos & Deimos'}
              </span>
            </div>
          </div>

          {/* Atmospheric Composition Badges */}
          <div className="bg-[#1d1f28]/50 rounded-xl p-2.5 border border-[#3b494b]/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-telemetry text-[9px] text-[#b9cacb] uppercase tracking-wider">
                ATMOSPHERE COMPOSITION
              </span>
              <span className="font-telemetry text-[10px] text-[#00f0ff]">
                {isEarth ? '101.3 kPa (1.0 bar)' : '0.636 kPa (0.006 bar)'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {isEarth ? (
                <>
                  <span className="px-2 py-0.5 rounded-full bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30 font-telemetry text-[11px]">
                    N₂ 78.08%
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#272a33] text-[#e1e2ee] border border-[#3b494b]/40 font-telemetry text-[11px]">
                    O₂ 20.95%
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#272a33] text-[#b9cacb] border border-[#3b494b]/30 font-telemetry text-[11px]">
                    Ar 0.93%
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#272a33] text-[#b9cacb] border border-[#3b494b]/30 font-telemetry text-[11px]">
                    CO₂ 0.04%
                  </span>
                </>
              ) : (
                <>
                  <span className="px-2 py-0.5 rounded-full bg-[#93000a]/30 text-[#ffb4ab] border border-[#ffb4ab]/40 font-telemetry text-[11px]">
                    CO₂ 95.32%
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#272a33] text-[#e1e2ee] border border-[#3b494b]/40 font-telemetry text-[11px]">
                    N₂ 2.60%
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#272a33] text-[#b9cacb] border border-[#3b494b]/30 font-telemetry text-[11px]">
                    Ar 1.90%
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#272a33] text-[#b9cacb] border border-[#3b494b]/30 font-telemetry text-[11px]">
                    O₂ 0.13%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1 pb-1">
            <button
              onClick={() => {
                sound.playTargetLock();
                onShowToast(`Running Synthetic Aperture Radar Scan on ${selectedPlanet.toUpperCase()}...`);
              }}
              className="flex-1 relative overflow-hidden bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] py-2.5 px-3 rounded-lg font-telemetry text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_16px_rgba(0,240,255,0.4)] active:scale-95 transition-all group"
            >
              <span className="material-symbols-outlined text-[18px]">biotech</span>
              <span className="tracking-wide">SURFACE TOPOGRAPHY SCAN</span>
            </button>
            <button
              onClick={() => {
                sound.playClick(1500, 0.06);
                onShowToast(`Plotting Hohmann Transfer Trajectory: Earth ➔ ${selectedPlanet.toUpperCase()}`);
              }}
              className="px-3 py-2.5 rounded-lg border border-[#3b494b]/50 hover:border-[#00f0ff] bg-[#1d1f28] hover:bg-[#272a33] font-telemetry text-xs font-semibold text-[#00f0ff] flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">timeline</span>
              <span>ORBITAL TRAJECTORY</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
