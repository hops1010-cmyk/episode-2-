import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { sound } from '../utils/audio';
import { PlanetInspectorModal } from './PlanetInspectorModal';

export interface CelestialBody {
  id: string;
  name: string;
  type: string;
  index: string;
  distance: string;
  distanceKm: string;
  velocity: string;
  day: string;
  moons: string;
  moonsDetail: string;
  temp: string;
  glowColor: string;
  radius: number;
  orbitalSpeed: number;
  colorClass: string;
  sizeClass: string;
}

const CELESTIAL_DATA: Record<string, CelestialBody> = {
  sun: {
    id: 'sun',
    name: 'Sol (Central Star)',
    type: 'G-Type Main-Sequence',
    index: 'SOL-0',
    distance: '0.00',
    distanceKm: '0 km',
    velocity: '220.0',
    day: '27.0 Earth Days',
    moons: '8 Planets',
    moonsDetail: 'System Anchor',
    temp: '+5,505°C (Surface)',
    glowColor: 'rgba(255, 208, 124, 0.4)',
    radius: 0,
    orbitalSpeed: 0,
    colorClass: 'bg-gradient-to-br from-[#ffdea7] via-[#ffd07c] to-[#412d00]',
    sizeClass: 'w-9 h-9',
  },
  mercury: {
    id: 'mercury',
    name: 'Mercury (Hermes)',
    type: 'Terrestrial Airless',
    index: 'SOL-I',
    distance: '0.39',
    distanceKm: '57.9M km',
    velocity: '47.36',
    day: '58.6 Earth Days',
    moons: '0',
    moonsDetail: 'None',
    temp: '-180°C to +430°C',
    glowColor: 'rgba(225, 226, 238, 0.3)',
    radius: 37,
    orbitalSpeed: 4.15,
    colorClass: 'bg-[#363943]',
    sizeClass: 'w-3 h-3',
  },
  venus: {
    id: 'venus',
    name: 'Venus (Aphrodite)',
    type: 'Greenhouse Terrestrial',
    index: 'SOL-II',
    distance: '0.72',
    distanceKm: '108.2M km',
    velocity: '35.02',
    day: '243.0 Earth Days',
    moons: '0',
    moonsDetail: 'None',
    temp: '+462°C Constant',
    glowColor: 'rgba(255, 187, 30, 0.3)',
    radius: 54,
    orbitalSpeed: 1.62,
    colorClass: 'bg-gradient-to-tr from-[#ffd07c] to-[#ffdea7]',
    sizeClass: 'w-4 h-4',
  },
  earth: {
    id: 'earth',
    name: 'Earth (Terra)',
    type: 'Terrestrial Habitable',
    index: 'SOL-III',
    distance: '1.00',
    distanceKm: '149.6M km',
    velocity: '29.78',
    day: '23h 56m 04s',
    moons: '1',
    moonsDetail: '(Luna)',
    temp: '-88°C to +58°C',
    glowColor: 'rgba(0, 240, 255, 0.3)',
    radius: 76,
    orbitalSpeed: 1.0,
    colorClass: 'bg-gradient-to-tr from-[#006970] via-[#00dbe9] to-[#dbfcff]',
    sizeClass: 'w-5 h-5',
  },
  mars: {
    id: 'mars',
    name: 'Mars (Ares)',
    type: 'Iron Oxide Desert',
    index: 'SOL-IV',
    distance: '1.52',
    distanceKm: '227.9M km',
    velocity: '24.07',
    day: '24h 37m 22s',
    moons: '2',
    moonsDetail: '(Phobos, Deimos)',
    temp: '-140°C to +20°C',
    glowColor: 'rgba(255, 180, 171, 0.3)',
    radius: 98,
    orbitalSpeed: 0.53,
    colorClass: 'bg-gradient-to-br from-[#ffb4ab] via-[#ffb5a0] to-[#b12f00]',
    sizeClass: 'w-4 h-4',
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jupiter (Zeus)',
    type: 'Gas Giant Jovian',
    index: 'SOL-V',
    distance: '5.20',
    distanceKm: '778.5M km',
    velocity: '13.07',
    day: '09h 55m 30s',
    moons: '95',
    moonsDetail: '(Galileans+)',
    temp: '-110°C (1 bar level)',
    glowColor: 'rgba(243, 175, 0, 0.35)',
    radius: 123,
    orbitalSpeed: 0.084,
    colorClass: 'bg-gradient-to-b from-[#ffdea7] via-[#f3af00] to-[#634600]',
    sizeClass: 'w-7 h-7',
  },
  saturn: {
    id: 'saturn',
    name: 'Saturn (Cronus)',
    type: 'Ringed Gas Giant',
    index: 'SOL-VI',
    distance: '9.58',
    distanceKm: '1.43B km',
    velocity: '9.68',
    day: '10h 33m 38s',
    moons: '146',
    moonsDetail: '(Titan, Enceladus)',
    temp: '-140°C Mean',
    glowColor: 'rgba(255, 222, 167, 0.35)',
    radius: 148,
    orbitalSpeed: 0.034,
    colorClass: 'bg-[#ffdea7]',
    sizeClass: 'w-6 h-6',
  },
  uranus: {
    id: 'uranus',
    name: 'Uranus (Caelus)',
    type: 'Tilted Ice Giant',
    index: 'SOL-VII',
    distance: '19.22',
    distanceKm: '2.87B km',
    velocity: '6.80',
    day: '17h 14m 24s',
    moons: '28',
    moonsDetail: '(Miranda, Titania)',
    temp: '-224°C Cryo',
    glowColor: 'rgba(0, 219, 233, 0.3)',
    radius: 169,
    orbitalSpeed: 0.012,
    colorClass: 'bg-gradient-to-tr from-[#00dbe9] to-[#7df4ff]',
    sizeClass: 'w-5 h-5',
  },
  neptune: {
    id: 'neptune',
    name: 'Neptune (Poseidon)',
    type: 'Outer Ice Giant',
    index: 'SOL-VIII',
    distance: '30.05',
    distanceKm: '4.50B km',
    velocity: '5.43',
    day: '16h 06m 36s',
    moons: '16',
    moonsDetail: '(Triton+)',
    temp: '-218°C Cryo',
    glowColor: 'rgba(0, 240, 255, 0.35)',
    radius: 187,
    orbitalSpeed: 0.006,
    colorClass: 'bg-gradient-to-tr from-[#006970] to-[#00f0ff]',
    sizeClass: 'w-5 h-5',
  },
};

const PLANET_KEYS = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

interface ViewOrbitsProps {
  onShowToast: (msg: string) => void;
}

export const ViewOrbits: React.FC<ViewOrbitsProps> = ({ onShowToast }) => {
  const [targetKey, setTargetKey] = useState<string>('earth');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [scrubberValue, setScrubberValue] = useState<number>(340);
  const [epochText, setEpochText] = useState<string>('SOL 2025.42');
  const [periodText, setPeriodText] = useState<string>('PERIOD 143.8d');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);

  const starCanvasRef = useRef<HTMLCanvasElement>(null);
  const hudReticleRef = useRef<HTMLDivElement>(null);
  const cardGlowRef = useRef<HTMLDivElement>(null);
  const dossierCardRef = useRef<HTMLDivElement>(null);

  // Planetary simulation angles and base time
  const simState = useRef({
    baseTime: 142.5,
    angles: {
      mercury: 0.6,
      venus: 2.1,
      earth: 4.4,
      mars: 1.1,
      jupiter: 5.2,
      saturn: 3.4,
      uranus: 0.8,
      neptune: 2.9,
    },
  });

  // Animated Starfield
  useEffect(() => {
    const canvas = starCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let stars: Array<{ x: number; y: number; size: number; alpha: number; drift: number }> = [];

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 360;
      canvas.height = canvas.parentElement?.clientHeight || 370;
      stars = [];
      for (let i = 0; i < 90; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.3,
          alpha: Math.random() * 0.8 + 0.2,
          drift: (Math.random() - 0.5) * 0.04,
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const renderStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.alpha += s.drift;
        if (s.alpha > 0.95 || s.alpha < 0.15) s.drift = -s.drift;
        ctx.fillStyle = `rgba(225, 226, 238, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      animId = requestAnimationFrame(renderStars);
    };
    renderStars();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // GSAP Ticker for Smooth Orbital Physics
  useEffect(() => {
    let lastTime = performance.now();

    const tickerCallback = (time: number) => {
      const delta = Math.min(time - lastTime, 64);
      lastTime = time;

      if (isPlaying) {
        simState.current.baseTime += delta * 0.0008 * speedMultiplier;
        const solYear = (2025.42 + simState.current.baseTime * 0.005).toFixed(2);
        setEpochText(`SOL ${solYear}`);
        setPeriodText(`PERIOD ${(simState.current.baseTime * 2.2).toFixed(1)}d`);
        setScrubberValue((simState.current.baseTime * 20) % 1000);
      }

      PLANET_KEYS.forEach((key) => {
        const bodyEl = document.getElementById(`planet-body-${key}`);
        const data = CELESTIAL_DATA[key];
        if (!bodyEl || !data) return;

        if (isPlaying) {
          simState.current.angles[key as keyof typeof simState.current.angles] +=
            delta * 0.001 * data.orbitalSpeed * speedMultiplier;
        }

        const angle = simState.current.angles[key as keyof typeof simState.current.angles];
        const r = data.radius;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;

        bodyEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;

        if (key === targetKey && hudReticleRef.current) {
          hudReticleRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
      });

      if (targetKey === 'sun' && hudReticleRef.current) {
        hudReticleRef.current.style.transform = 'translate3d(0px, 0px, 0)';
      }
    };

    gsap.ticker.add(tickerCallback);
    return () => {
      gsap.ticker.remove(tickerCallback);
    };
  }, [isPlaying, speedMultiplier, targetKey]);

  // Planet Select Handler with GSAP animation on dossier
  const handleSelectPlanet = (key: string) => {
    sound.playTargetLock();
    setTargetKey(key);
    onShowToast(`Vector Locked: ${key.toUpperCase()}`);

    const data = CELESTIAL_DATA[key];
    if (!data) return;

    if (cardGlowRef.current) {
      gsap.to(cardGlowRef.current, {
        backgroundColor: data.glowColor,
        duration: 0.5,
        ease: 'power2.out',
      });
    }

    if (dossierCardRef.current) {
      gsap.fromTo(
        dossierCardRef.current,
        { scale: 0.98, opacity: 0.85 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' }
      );
    }
  };

  const handlePlayPause = () => {
    sound.playClick(isPlaying ? 800 : 1200, 0.05);
    setIsPlaying(!isPlaying);
    onShowToast(isPlaying ? 'Orbital Clock Paused' : 'Orbital Clock Resumed');
  };

  const handleSpeedChange = (mult: number) => {
    sound.playClick(1000 + mult * 100, 0.04);
    setSpeedMultiplier(mult);
    onShowToast(`Velocity Multiplier: ${mult}x`);
  };

  const currentData = CELESTIAL_DATA[targetKey] || CELESTIAL_DATA.earth;

  return (
    <div className="flex flex-col w-full text-[#e1e2ee] select-none pb-6">
      {/* HUD Control Strip */}
      <section className="px-4 pt-2 pb-2 flex flex-col gap-2 z-20">
        <div className="flex items-center justify-between gap-2">
          {/* Epoch Readout */}
          <div className="flex items-center gap-1.5 bg-[#191b24]/80 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-[#3b494b]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffbb1e] animate-ping"></span>
            <span className="font-telemetry text-[10px] text-[#ffd07c] tracking-widest uppercase">EPOCH</span>
            <span className="font-telemetry text-xs text-[#dbfcff] tracking-wider font-bold">{epochText}</span>
          </div>

          {/* Quick Focus Target Dropdown */}
          <div className="relative flex-1 max-w-[170px]">
            <div className="relative flex items-center bg-[#191b24]/90 backdrop-blur-md rounded-lg shadow-sm border border-[#3b494b]/40">
              <span className="material-symbols-outlined text-[#00f0ff] text-[18px] pl-2 pointer-events-none">
                my_location
              </span>
              <select
                value={targetKey}
                onChange={(e) => handleSelectPlanet(e.target.value)}
                className="w-full bg-transparent font-telemetry text-xs text-[#e1e2ee] py-1.5 pl-1.5 pr-6 appearance-none focus:outline-none focus:text-[#00f0ff] cursor-pointer"
              >
                <option value="sun" className="bg-[#272a33] text-[#e1e2ee]">Sun (Sol-0)</option>
                <option value="mercury" className="bg-[#272a33] text-[#e1e2ee]">Mercury (I)</option>
                <option value="venus" className="bg-[#272a33] text-[#e1e2ee]">Venus (II)</option>
                <option value="earth" className="bg-[#272a33] text-[#e1e2ee]">Earth (III)</option>
                <option value="mars" className="bg-[#272a33] text-[#e1e2ee]">Mars (IV)</option>
                <option value="jupiter" className="bg-[#272a33] text-[#e1e2ee]">Jupiter (V)</option>
                <option value="saturn" className="bg-[#272a33] text-[#e1e2ee]">Saturn (VI)</option>
                <option value="uranus" className="bg-[#272a33] text-[#e1e2ee]">Uranus (VII)</option>
                <option value="neptune" className="bg-[#272a33] text-[#e1e2ee]">Neptune (VIII)</option>
              </select>
              <span className="material-symbols-outlined text-[#b9cacb] text-[16px] absolute right-1.5 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Simulation Play / Pause Button */}
          <button
            onClick={handlePlayPause}
            aria-label="Toggle Orbital Simulation Clock"
            className={`w-8 h-8 rounded-lg flex items-center justify-center active:scale-90 transition-all ${
              isPlaying
                ? 'bg-[#00f0ff] text-[#00363a] shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'bg-[#272a33] text-[#e1e2ee] hover:bg-[#363943]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
        </div>

        {/* Multipliers & Locked status */}
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-telemetry text-[10px] text-[#b9cacb] uppercase">VEL:</span>
            <div className="flex items-center gap-1 bg-[#191b24]/60 p-0.5 rounded-lg backdrop-blur-sm border border-[#3b494b]/20">
              {[0.25, 1, 5, 15].map((mult) => (
                <button
                  key={mult}
                  onClick={() => handleSpeedChange(mult)}
                  className={`px-2 py-0.5 rounded font-telemetry text-[11px] transition-colors ${
                    speedMultiplier === mult
                      ? 'bg-[#272a33] text-[#00f0ff] font-bold shadow-sm'
                      : 'text-[#b9cacb] hover:text-[#dbfcff]'
                  }`}
                >
                  {mult === 15 ? 'MAX' : `${mult}x`}
                </button>
              ))}
            </div>
          </div>

          {/* Locked Badge */}
          <div className="flex items-center gap-1.5 bg-[#191b24]/70 px-2.5 py-1 rounded-md border border-[#00f0ff]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse"></span>
            <span className="font-telemetry text-[11px] text-[#00f0ff] uppercase tracking-wider font-bold">
              LOCKED: {targetKey.toUpperCase()}
            </span>
          </div>
        </div>
      </section>

      {/* Celestial Viewport */}
      <div className="relative w-full h-[370px] overflow-hidden my-1 flex items-center justify-center">
        {/* Starfield Canvas */}
        <canvas ref={starCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-85" />

        {/* Deep Space Radial Gradient Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,219,233,0.08)_0%,transparent_75%)] pointer-events-none" />

        {/* Reticle Lines & Crosshairs */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[320px] h-[320px] rounded-full border border-dashed border-[#3b494b]"></div>
          <div className="absolute w-[200px] h-[200px] rounded-full border border-[#3b494b]"></div>
          <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-[#00f0ff]/30 to-transparent"></div>
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/30 to-transparent"></div>
        </div>

        {/* Central Sun Node */}
        <div
          onClick={() => handleSelectPlanet('sun')}
          className="absolute z-10 flex items-center justify-center cursor-pointer group"
        >
          <div className="absolute w-20 h-20 rounded-full bg-[#f3af00]/25 blur-xl animate-pulse"></div>
          <div className="absolute w-14 h-14 rounded-full bg-gradient-to-tr from-[#ffd07c] via-[#f3af00] to-[#ffdea7] opacity-75 blur-md"></div>
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[#ffdea7] via-[#ffd07c] to-[#412d00] shadow-[0_0_24px_rgba(255,208,124,0.95)] flex items-center justify-center transition-transform group-hover:scale-110">
            <span className="font-telemetry text-[8px] text-[#0b0e16] font-bold">SOL</span>
          </div>
        </div>

        {/* Concentric Orbit Paths & Planet Markers */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {PLANET_KEYS.map((key) => {
            const data = CELESTIAL_DATA[key];
            const isSelected = key === targetKey;
            const orbitDiameter = data.radius * 2;

            return (
              <div
                key={key}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPlanet(key);
                }}
                style={{ width: `${orbitDiameter}px`, height: `${orbitDiameter}px` }}
                className={`absolute rounded-full pointer-events-auto cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'border border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : 'border border-[#3b494b]/30 hover:border-[#3b494b]/70'
                }`}
              >
                {/* Planet Marker moving along orbit */}
                <div
                  id={`planet-body-${key}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlanet(key);
                  }}
                  className={`absolute -top-2 left-1/2 -ml-2 rounded-full cursor-pointer pointer-events-auto flex items-center justify-center hover:scale-125 transition-transform ${data.sizeClass} ${data.colorClass} shadow-md`}
                >
                  {/* Moon for Earth */}
                  {key === 'earth' && (
                    <div
                      className="absolute w-7 h-7 rounded-full border border-[#00f0ff]/30 pointer-events-none animate-spin"
                      style={{ animationDuration: '3s' }}
                    >
                      <span className="absolute top-0 right-0 w-1 h-1 rounded-full bg-[#e1e2ee] shadow-xs"></span>
                    </div>
                  )}
                  {/* Rings for Saturn */}
                  {key === 'saturn' && (
                    <div className="absolute w-9 h-3 rounded-full border border-[#ffd07c]/80 -rotate-12 pointer-events-none shadow-[0_0_4px_rgba(255,208,124,0.5)]"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* HUD Reticle Overlay */}
        <div
          ref={hudReticleRef}
          className="absolute pointer-events-none flex items-center justify-center w-12 h-12 transition-transform duration-75"
        >
          <div
            className="w-full h-full border border-dashed border-[#00f0ff] rounded-full animate-spin"
            style={{ animationDuration: '8s' }}
          ></div>
          <div className="absolute -top-1 w-1.5 h-1.5 bg-[#00f0ff] rounded-full"></div>
          <div className="absolute -bottom-1 w-1.5 h-1.5 bg-[#00f0ff] rounded-full"></div>
        </div>

        {/* Floating In-Canvas HUD Bar */}
        <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 bg-[#0b0e16]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#3b494b]/30 shadow-sm pointer-events-auto">
            <span className="material-symbols-outlined text-[14px] text-[#00f0ff]">info</span>
            <span className="font-telemetry text-[11px] text-[#b9cacb]">Tap any planet or orbit</span>
          </div>
          <button
            onClick={() => handleSelectPlanet('earth')}
            className="pointer-events-auto flex items-center gap-1 bg-[#0b0e16]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#3b494b]/30 text-[#b9cacb] hover:text-[#00f0ff] transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[14px]">filter_center_focus</span>
            <span className="font-telemetry text-[10px] uppercase font-bold">RECENTER</span>
          </button>
        </div>
      </div>

      {/* Epoch Scrubber Slider */}
      <section className="px-4 py-2 z-20 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[#b9cacb]">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-[#00f0ff]">schedule</span>
            <span className="font-telemetry text-[10px] uppercase tracking-wider text-[#ffd07c] font-bold">
              EPOCH SCRUBBER
            </span>
          </div>
          <div className="font-telemetry text-xs text-[#00f0ff] flex items-center gap-1">
            <span>{periodText}</span>
            <span className="text-[#3b494b]">/</span>
            <span className="text-[#b9cacb] font-telemetry text-[10px]">T-0</span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="relative w-full flex items-center py-1">
          <input
            type="range"
            min="0"
            max="1000"
            value={scrubberValue}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setScrubberValue(val);
              simState.current.baseTime = val * 0.05;
              PLANET_KEYS.forEach((p) => {
                simState.current.angles[p as keyof typeof simState.current.angles] =
                  val * 0.02 * (CELESTIAL_DATA[p]?.orbitalSpeed || 1);
              });
              const solYear = (2025.0 + val * 0.001).toFixed(2);
              setEpochText(`SOL ${solYear}`);
            }}
            className="w-full h-1.5 bg-[#272a33] rounded-full appearance-none cursor-pointer accent-[#00f0ff] focus:outline-none shadow-[0_0_8px_rgba(0,240,255,0.3)]"
          />
        </div>

        {/* Tick Marks */}
        <div className="flex justify-between items-center px-1 font-telemetry text-[9px] text-[#b9cacb]/60">
          <span>JAN 2025</span>
          <span className="text-[#3b494b]">•</span>
          <span>APR 2025</span>
          <span className="text-[#3b494b]">•</span>
          <span className="text-[#00f0ff] font-semibold">JUL 2025</span>
          <span className="text-[#3b494b]">•</span>
          <span>OCT 2025</span>
          <span className="text-[#3b494b]">•</span>
          <span>DEC 2025</span>
        </div>
      </section>

      {/* Planetary Dossier & Telemetry Sheet */}
      <section
        ref={dossierCardRef}
        className="mx-4 mt-2 bg-[#191b24]/90 backdrop-blur-xl rounded-xl p-4 shadow-xl border border-[#3b494b]/30 relative overflow-hidden transition-all duration-300"
      >
        {/* Interior Glow Wash */}
        <div
          ref={cardGlowRef}
          style={{ backgroundColor: currentData.glowColor }}
          className="absolute -right-10 -top-10 w-36 h-36 rounded-full blur-2xl pointer-events-none transition-colors"
        ></div>

        {/* Header */}
        <div className="flex items-start justify-between gap-2 relative z-10">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-telemetry text-[10px] text-[#ffd07c] uppercase tracking-widest font-bold">
                {currentData.type}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#3b494b]"></span>
              <span className="font-telemetry text-[11px] text-[#b9cacb]">{currentData.index}</span>
            </div>
            <h2 className="font-headline text-xl text-[#00f0ff] font-bold tracking-tight mt-0.5">
              {currentData.name}
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-[#272a33] px-2.5 py-1 rounded-full border border-[#3b494b]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse"></span>
            <span className="font-telemetry text-[10px] text-[#00f0ff] uppercase font-bold tracking-wider">
              TRACKING
            </span>
          </div>
        </div>

        {/* 2-Column Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mt-3 relative z-10">
          <div className="bg-[#1d1f28]/70 rounded-lg p-2.5 flex flex-col justify-between border border-[#3b494b]/20">
            <span className="font-telemetry text-[9px] text-[#b9cacb] uppercase">DISTANCE TO SOL</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-telemetry text-lg text-[#00f0ff] font-bold">{currentData.distance}</span>
              <span className="font-telemetry text-xs text-[#00f0ff]">AU</span>
              <span className="font-telemetry text-[10px] text-[#b9cacb] ml-auto">{currentData.distanceKm}</span>
            </div>
          </div>

          <div className="bg-[#1d1f28]/70 rounded-lg p-2.5 flex flex-col justify-between border border-[#3b494b]/20">
            <span className="font-telemetry text-[9px] text-[#b9cacb] uppercase">ORBITAL VELOCITY</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-telemetry text-lg text-[#00f0ff] font-bold">{currentData.velocity}</span>
              <span className="font-telemetry text-xs text-[#00f0ff]">km/s</span>
            </div>
          </div>

          <div className="bg-[#1d1f28]/70 rounded-lg p-2.5 flex flex-col justify-between border border-[#3b494b]/20">
            <span className="font-telemetry text-[9px] text-[#b9cacb] uppercase">SOLAR DAY CYCLE</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-telemetry text-base text-[#00f0ff] font-bold">{currentData.day}</span>
            </div>
          </div>

          <div className="bg-[#1d1f28]/70 rounded-lg p-2.5 flex flex-col justify-between border border-[#3b494b]/20">
            <span className="font-telemetry text-[9px] text-[#b9cacb] uppercase">NATURAL MOONS</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-telemetry text-lg text-[#00f0ff] font-bold">{currentData.moons}</span>
              <span className="font-telemetry text-[10px] text-[#b9cacb] ml-1">{currentData.moonsDetail}</span>
            </div>
          </div>
        </div>

        {/* Thermal Range */}
        <div className="mt-2.5 bg-[#1d1f28]/50 rounded-lg px-3 py-2 flex items-center justify-between text-[#b9cacb] border border-[#3b494b]/20 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#ffd07c]">thermostat</span>
            <span className="font-telemetry text-[10px] uppercase font-bold">SURFACE THERMAL:</span>
          </div>
          <span className="font-telemetry text-xs text-[#ffd07c] font-semibold">{currentData.temp}</span>
        </div>

        {/* Interactive Action Buttons */}
        <div className="flex items-center gap-2 mt-3.5 relative z-10">
          <button
            onClick={() => {
              sound.playTargetLock();
              setIsInspectorOpen(true);
            }}
            className="flex-1 bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] py-2.5 px-3 rounded-lg font-telemetry text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_16px_rgba(0,240,255,0.35)] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">travel_explore</span>
            <span>INSPECT 3D DOSSIER</span>
          </button>
          <button
            onClick={() => {
              sound.playClick(1300, 0.04);
              onShowToast('Scanning Ionosphere & Barometric Density...');
            }}
            title="Inspect Atmospheric Layers"
            className="w-11 h-11 bg-[#272a33] hover:bg-[#363943] text-[#00f0ff] rounded-lg flex items-center justify-center active:scale-95 transition-all border border-[#3b494b]/30"
          >
            <span className="material-symbols-outlined text-[20px]">layers</span>
          </button>
          <button
            onClick={() => {
              sound.playClick(1500, 0.05);
              onShowToast(`Plotting Hohmann Transfer Vectors to ${targetKey.toUpperCase()}...`);
            }}
            title="Track Trajectory Vector"
            className="w-11 h-11 bg-[#272a33] hover:bg-[#363943] text-[#00f0ff] rounded-lg flex items-center justify-center active:scale-95 transition-all border border-[#3b494b]/30"
          >
            <span className="material-symbols-outlined text-[20px]">ssid_chart</span>
          </button>
        </div>
      </section>

      {/* 3D Planet Inspection Modal */}
      <PlanetInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        initialPlanet={targetKey === 'mars' ? 'mars' : 'earth'}
        onShowToast={onShowToast}
      />
    </div>
  );
};
