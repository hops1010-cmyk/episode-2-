import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { sound } from '../utils/audio';
import { PowerProgressBar } from './PowerProgressBar';

interface ViewDiagnosticsProps {
  onShowToast: (msg: string) => void;
  onNavigateScene?: (scene: string) => void;
}

interface ModuleInfo {
  tag: string;
  status: string;
  name: string;
  desc: string;
  stat1Label: string;
  stat1Val: string;
  stat2Label: string;
  stat2Val: string;
  integrity: string;
}

const MODULES_DATA: Record<string, ModuleInfo> = {
  avionics: {
    tag: 'MOD [01] // COCKPIT & GUIDANCE',
    status: 'ONLINE // BYPASS LOCKED',
    name: 'Pressurized Pod & Scrap Sat Avionics',
    desc: 'Mateo\'s reinforced pilot blister fabricated from salvaged school bus chassis and weather satellite guidance cores. Integrated with a hacked tablet telemetry receiver.',
    stat1Label: 'CABIN PRESSURE',
    stat1Val: '1.02 ATM (O2: 21%)',
    stat2Label: 'GPS BYPASS',
    stat2Val: 'OPTICAL STELLAR FIX',
    integrity: '96.2%',
  },
  defense: {
    tag: 'MOD [02] // DEFENSIVE COUNTERMEASURE',
    status: 'RESONATING (142.8 MHz)',
    name: 'Bio-Spore Neutralization Field Generator',
    desc: 'High-frequency electromagnetic pulse coil constructed from copper refrigeration lines to incinerate Gorglith atmospheric spores before they infest the hull air intakes.',
    stat1Label: 'FIELD RADIUS',
    stat1Val: '18.5 METERS',
    stat2Label: 'HARVEST INTERFERENCE',
    stat2Val: '99.1% REPULSION',
    integrity: '91.8%',
  },
  tanks: {
    tag: 'MOD [03] // PROPELLANT STORAGE',
    status: 'OPTIMAL (410 BAR)',
    name: 'Dual-Stage Cryo-Methane & LOX Cell',
    desc: 'Double-walled vacuum insulated tanks assembled from salvaged irrigation pumps and scrap aerospace titanium-aluminum weave with vulcanized rubber seals.',
    stat1Label: 'FLOW RATE',
    stat1Val: '14.2 kg/s',
    stat2Label: 'SAFETY INTERLOCK',
    stat2Val: 'BYPASS (MANUAL)',
    integrity: '94.6%',
  },
  engine: {
    tag: 'MOD [04] // PROPULSION STACK',
    status: 'READY // PRE-IGNITION',
    name: 'Hybrid Aerospike Manifold & Ion Bell',
    desc: 'Machined truncated aerospike with ablative basalt-ceramic heat shielding designed to auto-compensate atmospheric backpressure during hypersonic breakthrough.',
    stat1Label: 'VACUUM ISP',
    stat1Val: '388 SECONDS',
    stat2Label: 'CHAMBER TEMP',
    stat2Val: '2,840 K (PEAK)',
    integrity: '98.0%',
  },
};

export const ViewDiagnostics: React.FC<ViewDiagnosticsProps> = ({ onShowToast, onNavigateScene }) => {
  const [selectedModuleKey, setSelectedModuleKey] = useState<string>('tanks');
  const [activeFilter, setActiveFilter] = useState<'all' | 'propulsion' | 'avionics' | 'defense'>('all');
  const [powerDistribution, setPowerDistribution] = useState<number>(65);
  const [isStressTesting, setIsStressTesting] = useState<boolean>(false);
  const [radarStatusText, setRadarStatusText] = useState<string>('LIDAR: ACTIVE SWEEP');
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);

  const moduleDrawerRef = useRef<HTMLDivElement>(null);
  const radarSweepRef = useRef<HTMLDivElement>(null);
  const cutawayContainerRef = useRef<HTMLDivElement>(null);

  // GSAP Radar Sweep Animation
  useEffect(() => {
    if (!radarSweepRef.current) return;
    const sweep = radarSweepRef.current;

    const tween = gsap.fromTo(
      sweep,
      { top: '10%' },
      {
        top: '85%',
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      }
    );

    return () => {
      tween.kill();
    };
  }, []);

  // Hotspot click handler with GSAP transition
  const handleSelectModule = (key: string) => {
    sound.playClick(1300, 0.05);
    setSelectedModuleKey(key);

    if (moduleDrawerRef.current) {
      gsap.fromTo(
        moduleDrawerRef.current,
        { scale: 0.98, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out' }
      );
    }
  };

  // Filter layer toggle
  const handleFilterLayers = (type: 'all' | 'propulsion' | 'avionics' | 'defense') => {
    sound.playClick(1100, 0.04);
    setActiveFilter(type);
    if (type === 'all') handleSelectModule('tanks');
    else if (type === 'propulsion') handleSelectModule('engine');
    else if (type === 'avionics') handleSelectModule('avionics');
    else if (type === 'defense') handleSelectModule('defense');
  };

  // Trigger Subsystem Stress Test with GSAP vibration and gauges
  const handleStressTest = () => {
    if (isStressTesting) return;
    setIsStressTesting(true);
    sound.playWarning();
    sound.playThrust(1.2);
    setRadarStatusText('STRESS TEST: BURST CYCLING...');
    onShowToast('Firing High-Pressure Fuel Rail Stress Pulsing...');

    // Jitter cutaway container with GSAP
    if (cutawayContainerRef.current) {
      gsap.to(cutawayContainerRef.current, {
        x: '+=3',
        y: '+=2',
        duration: 0.04,
        repeat: 24,
        yoyo: true,
        ease: 'none',
        onComplete: () => {
          gsap.set(cutawayContainerRef.current, { x: 0, y: 0 });
        },
      });
    }

    setTimeout(() => {
      sound.playSuccess();
      setRadarStatusText('ALL TOLERANCES NOMINAL (SAFE TO FIRE)');
      setIsStressTesting(false);
      onShowToast('Subsystem Diagnostic: 100% Structural Integrity Validated');
    }, 1800);
  };

  // Transmit Telemetry to Cockpit HUD
  const handleTransmit = () => {
    if (isTransmitting) return;
    setIsTransmitting(true);
    sound.playTargetLock();
    onShowToast('Streaming Sectional Vector Telemetry to Esperanza-IX Cabin...');

    setTimeout(() => {
      sound.playSuccess();
      setIsTransmitting(false);
      onShowToast('Telemetry Synced to Mateo\'s Dashboard HUD');
    }, 1400);
  };

  const currentMod = MODULES_DATA[selectedModuleKey] || MODULES_DATA.tanks;

  return (
    <div className="flex flex-col w-full text-[#e1e2ee] pb-6 px-4">
      {/* Top Banner Card */}
      <div className="bg-[#191b24]/90 rounded-xl p-4 shadow-lg flex flex-col gap-2 border border-[#3b494b]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]"></span>
            <span className="font-telemetry text-[10px] text-[#ffd07c] tracking-widest uppercase font-bold">
              ESP-09-SALVADOR // DIAGNOSTICS
            </span>
          </div>
          <span className="bg-[#272a33] text-[#00f0ff] font-telemetry text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border border-[#3b494b]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffd07c]"></span> T-01:24:11
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-baseline justify-between">
            <h2 className="font-headline text-2xl text-[#dbfcff] tracking-tight font-bold">ESPERANZA-IX</h2>
            <span className="font-telemetry text-xs text-[#ffdea7]">SSTO PROTO-09</span>
          </div>
          <p className="font-body text-xs text-[#b9cacb]">Pilot: Mateo (Age 16) | Usulután, SLV → Mars Transfer Arc</p>
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
          {(['all', 'propulsion', 'avionics', 'defense'] as const).map((filter) => {
            const isActive = activeFilter === filter;
            const labels = {
              all: 'ALL SYSTEMS',
              propulsion: 'PROPULSION',
              avionics: 'AVIONICS/LIFE',
              defense: 'BIO-JAMMER',
            };
            return (
              <button
                key={filter}
                onClick={() => handleFilterLayers(filter)}
                className={`shrink-0 px-3 py-1 rounded-lg font-telemetry text-xs transition-all ${
                  isActive
                    ? 'bg-[#00f0ff] text-[#00363a] font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : 'bg-[#1d1f28] text-[#b9cacb] hover:text-[#00f0ff]'
                }`}
              >
                {labels[filter]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sectional Cutaway Graphic Container */}
      <div
        ref={cutawayContainerRef}
        className="relative w-full rounded-xl bg-[#0b0e16]/90 overflow-hidden shadow-2xl p-2.5 flex flex-col items-center my-3 border border-[#3b494b]/30"
      >
        {/* Background Dot Grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 240, 255, 0.4) 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        ></div>

        {/* Cutaway Header Status */}
        <div className="w-full flex items-center justify-between text-[#b9cacb] text-xs font-telemetry px-2 pb-1 z-10">
          <span className="text-[#00f0ff] font-telemetry flex items-center gap-1 text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">tune</span> SECTIONAL CUTAWAY
          </span>
          <span
            className={`font-telemetry tracking-wider text-[11px] ${
              isStressTesting ? 'text-[#ffb4ab] font-bold animate-pulse' : 'text-[#ffd07c]'
            }`}
          >
            {radarStatusText}
          </span>
        </div>

        {/* SVG Rocket Cutaway with GSAP Sweeping Beam */}
        <div className="relative w-full max-w-[340px] h-[390px] flex items-center justify-center my-1 select-none">
          {/* Radar Sweep Horizontal Laser */}
          <div
            ref={radarSweepRef}
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-80 pointer-events-none z-20 shadow-[0_0_12px_rgba(0,240,255,0.9)]"
            style={{ top: '10%' }}
          ></div>

          <svg className="w-full h-full" viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hullGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1d1f28" />
                <stop offset="50%" stopColor="#32343e" />
                <stop offset="100%" stopColor="#191b24" />
              </linearGradient>
              <linearGradient id="ch4Grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#006970" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="loxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffd07c" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f3af00" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="thrustPlume" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="35%" stopColor="#7df4ff" />
                <stop offset="70%" stopColor="#ffb5a0" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Hull Silhouette */}
            <path
              d="M 160 18 Q 120 75 105 150 L 100 315 L 220 315 L 215 150 Q 200 75 160 18 Z"
              fill="url(#hullGrad)"
              opacity="0.6"
              stroke="#3b494b"
              strokeWidth="1.5"
            />

            {/* Avionics Layer */}
            <g
              className="transition-opacity duration-300"
              style={{
                opacity: activeFilter === 'all' || activeFilter === 'avionics' ? 1 : 0.2,
              }}
            >
              <path d="M 160 25 L 128 90 L 192 90 Z" fill="#10131c" stroke="#00f0ff" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="160" cy="55" r="9" fill="#00dbe9" fillOpacity="0.25" stroke="#00f0ff" strokeWidth="1.5" />
              <rect x="151" y="70" width="18" height="14" rx="2" fill="#272a33" stroke="#849495" strokeWidth="1" />
              <path d="M 148 64 L 142 58 M 172 64 L 178 58" stroke="#00f0ff" strokeWidth="1.2" />
              <text x="160" y="58" fill="#dbfcff" fontSize="7" fontFamily="Space Mono" fontWeight="bold" textAnchor="middle">
                HUD
              </text>
            </g>

            {/* Bio-Defense Field Generator */}
            <g
              className="transition-opacity duration-300"
              style={{
                opacity: activeFilter === 'all' || activeFilter === 'defense' ? 1 : 0.2,
              }}
            >
              <rect x="116" y="98" width="88" height="42" rx="4" fill="#191b24" stroke="#ffdea7" strokeWidth="1.2" />
              <ellipse cx="160" cy="119" rx="34" ry="12" fill="none" stroke="#00f0ff" strokeWidth="1.5" filter="url(#glowEffect)" opacity="0.85">
                <animate attributeName="rx" values="30;36;30" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
              </ellipse>
              <circle cx="160" cy="119" r="6" fill="#ffd07c" />
              <path d="M 130 119 L 190 119" stroke="#dbfcff" strokeWidth="1" strokeDasharray="3 2" />
            </g>

            {/* Propulsion & Fuel Tanks */}
            <g
              className="transition-opacity duration-300"
              style={{
                opacity: activeFilter === 'all' || activeFilter === 'propulsion' ? 1 : 0.2,
              }}
            >
              <rect x="112" y="148" width="96" height="66" rx="5" fill="#10131c" stroke="#3b494b" strokeWidth="1" />
              {/* Cryo Methane */}
              <rect x="116" y="152" width="42" height="58" rx="3" fill="url(#ch4Grad)">
                <animate attributeName="opacity" values="0.75;0.95;0.75" dur="3s" repeatCount="indefinite" />
              </rect>
              <text x="137" y="184" fill="#002022" fontSize="8" fontFamily="Space Mono" fontWeight="bold" textAnchor="middle">
                CRYO
              </text>

              {/* LOX Tank */}
              <rect x="162" y="152" width="42" height="58" rx="3" fill="url(#loxGrad)">
                <animate attributeName="opacity" values="0.9;0.7;0.9" dur="3s" repeatCount="indefinite" />
              </rect>
              <text x="183" y="184" fill="#271900" fontSize="8" fontFamily="Space Mono" fontWeight="bold" textAnchor="middle">
                LOX
              </text>

              {/* Piping lines */}
              <path d="M 137 210 L 137 270 L 152 270" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
              <path d="M 183 210 L 183 270 L 168 270" stroke="#ffd07c" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />

              {/* Exterior RCS pods */}
              <path d="M 98 170 L 88 170 M 88 165 L 88 175 M 222 170 L 232 170 M 232 165 L 232 175" stroke="#dbfcff" strokeWidth="1.5" />
              <path d="M 96 235 L 86 235 M 86 230 L 86 240 M 224 235 L 234 235 M 234 230 L 234 240" stroke="#dbfcff" strokeWidth="1.5" />

              {/* Aerospike Nozzle Bell */}
              <path d="M 120 274 L 140 315 L 180 315 L 200 274 Z" fill="#272a33" stroke="#849495" strokeWidth="1" />
              <polygon points="144,315 176,315 160,336" fill="#191b24" stroke="#00f0ff" strokeWidth="1" />

              {/* Thrust Plume */}
              <polygon points="146,317 174,317 160,368" fill="url(#thrustPlume)" opacity="0.9">
                <animate attributeName="points" values="146,317 174,317 160,368; 144,317 176,317 160,378; 146,317 174,317 160,368" dur="0.25s" repeatCount="indefinite" />
              </polygon>
              <circle cx="160" cy="336" r="4" fill="#dbfcff" filter="url(#glowEffect)" />
              <circle cx="160" cy="350" r="3" fill="#00dbe9" opacity="0.8" />
            </g>

            {/* Clickable Hotspots */}
            <g id="hotspots" className="cursor-pointer">
              {/* Hotspot 01: Avionics */}
              <g onClick={() => handleSelectModule('avionics')}>
                <circle cx="218" cy="55" r="11" fill="#10131c" stroke="#00f0ff" strokeWidth="1.5" />
                <circle cx="218" cy="55" r="5" fill="#00f0ff" opacity="0.6" className="animate-ping origin-center" />
                <text x="218" y="58" fill="#00f0ff" fontSize="8" fontFamily="Space Mono" fontWeight="bold" textAnchor="middle">01</text>
                <line x1="172" y1="55" x2="207" y2="55" stroke="#00f0ff" strokeWidth="1" strokeDasharray="2 2" />
              </g>

              {/* Hotspot 02: Defense Bio-Jammer */}
              <g onClick={() => handleSelectModule('defense')}>
                <circle cx="75" cy="119" r="11" fill="#10131c" stroke="#ffd07c" strokeWidth="1.5" />
                <circle cx="75" cy="119" r="4" fill="#ffd07c" />
                <text x="75" y="122" fill="#ffd07c" fontSize="8" fontFamily="Space Mono" fontWeight="bold" textAnchor="middle">02</text>
                <line x1="86" y1="119" x2="116" y2="119" stroke="#ffd07c" strokeWidth="1" strokeDasharray="2 2" />
              </g>

              {/* Hotspot 03: Cryo Tanks */}
              <g onClick={() => handleSelectModule('tanks')}>
                <circle cx="242" cy="180" r="11" fill="#10131c" stroke="#00f0ff" strokeWidth="1.5" />
                <circle cx="242" cy="180" r="4" fill="#00f0ff" />
                <text x="242" y="183" fill="#00f0ff" fontSize="8" fontFamily="Space Mono" fontWeight="bold" textAnchor="middle">03</text>
                <line x1="208" y1="180" x2="231" y2="180" stroke="#00f0ff" strokeWidth="1" strokeDasharray="2 2" />
              </g>

              {/* Hotspot 04: Aerospike Engine */}
              <g onClick={() => handleSelectModule('engine')}>
                <circle cx="82" cy="295" r="11" fill="#10131c" stroke="#00f0ff" strokeWidth="1.5" />
                <circle cx="82" cy="295" r="4" fill="#00f0ff" />
                <text x="82" y="298" fill="#00f0ff" fontSize="8" fontFamily="Space Mono" fontWeight="bold" textAnchor="middle">04</text>
                <line x1="93" y1="295" x2="128" y2="295" stroke="#00f0ff" strokeWidth="1" strokeDasharray="2 2" />
              </g>
            </g>
          </svg>
        </div>

        {/* Metric Scale Bar */}
        <div className="w-full flex items-center justify-between text-[11px] font-telemetry text-[#b9cacb] px-1 pt-1 border-t border-[#3b494b]/20">
          <span className="text-[#b9cacb]/70">X-POS: +13.344</span>
          <span className="text-[#00f0ff] tracking-widest font-bold">SCALE: 1:35 METRIC</span>
          <span className="text-[#b9cacb]/70">Z-ALT: 00.000 KM</span>
        </div>
      </div>

      {/* Selected Module Detail Drawer */}
      <div
        ref={moduleDrawerRef}
        className="w-full bg-[#1d1f28]/95 rounded-xl p-4 shadow-xl flex flex-col gap-2 border border-[#3b494b]/40 mb-3"
      >
        <div className="flex items-center justify-between">
          <span className="font-telemetry text-[10px] text-[#ffd07c] font-bold uppercase tracking-wider">
            {currentMod.tag}
          </span>
          <span className="bg-[#272a33] px-2.5 py-0.5 rounded-full font-telemetry text-xs text-[#00f0ff] flex items-center gap-1.5 border border-[#3b494b]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping"></span>
            {currentMod.status}
          </span>
        </div>

        <h3 className="font-headline text-lg text-[#dbfcff] font-bold">{currentMod.name}</h3>
        <p className="font-body text-xs text-[#b9cacb] leading-relaxed">{currentMod.desc}</p>

        {/* 2-Column Module Specs */}
        <div className="grid grid-cols-2 gap-2 my-1">
          <div className="bg-[#191b24] rounded-lg p-2.5 flex flex-col border border-[#3b494b]/20">
            <span className="font-telemetry text-[9px] text-[#b9cacb]">{currentMod.stat1Label}</span>
            <span className="font-telemetry text-sm text-[#00f0ff] font-bold mt-0.5">{currentMod.stat1Val}</span>
          </div>
          <div className="bg-[#191b24] rounded-lg p-2.5 flex flex-col border border-[#3b494b]/20">
            <span className="font-telemetry text-[9px] text-[#b9cacb]">{currentMod.stat2Label}</span>
            <span className="font-telemetry text-sm text-[#ffd07c] font-bold mt-0.5">{currentMod.stat2Val}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-telemetry text-[#b9cacb] pt-1 border-t border-[#3b494b]/20">
          <span className="flex items-center gap-1 text-[#00f0ff]">
            <span className="material-symbols-outlined text-[15px]">verified</span>
            Salvaged Avionics Logic Validated
          </span>
          <span className="text-[#ffdea7] font-semibold">INTEGRITY {currentMod.integrity}</span>
        </div>
      </div>

      {/* Flight Performance Telemetry Metrics (4 Cards) */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-[#191b24] rounded-xl p-3 flex flex-col gap-1 border border-[#3b494b]/30">
          <span className="font-telemetry text-[9px] text-[#b9cacb]">ESTIMATED TWR</span>
          <div className="flex items-baseline gap-1">
            <span className="font-telemetry text-lg text-[#00f0ff] font-bold">1.42</span>
            <span className="font-telemetry text-[11px] text-[#ffd07c]">LIFT-OFF</span>
          </div>
          <div className="w-full bg-[#1d1f28] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#00f0ff] h-full w-[72%] rounded-full shadow-[0_0_8px_rgba(0,240,255,0.7)]"></div>
          </div>
        </div>

        <div className="bg-[#191b24] rounded-xl p-3 flex flex-col gap-1 border border-[#3b494b]/30">
          <span className="font-telemetry text-[9px] text-[#b9cacb]">TOTAL DELTA-V</span>
          <div className="flex items-baseline gap-1">
            <span className="font-telemetry text-lg text-[#00f0ff] font-bold">11,250</span>
            <span className="font-telemetry text-[11px] text-[#b9cacb]">m/s</span>
          </div>
          <div className="w-full bg-[#1d1f28] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#ffd07c] h-full w-[88%] rounded-full"></div>
          </div>
        </div>

        <div className="bg-[#191b24] rounded-xl p-3 flex flex-col gap-1 border border-[#3b494b]/30">
          <span className="font-telemetry text-[9px] text-[#b9cacb]">THERMAL RESIST</span>
          <div className="flex items-baseline gap-1">
            <span className="font-telemetry text-lg text-[#00f0ff] font-bold">2,400</span>
            <span className="font-telemetry text-[11px] text-[#b9cacb]">°C MAX</span>
          </div>
          <div className="w-full bg-[#1d1f28] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#00f0ff] h-full w-[65%] rounded-full"></div>
          </div>
        </div>

        <div className="bg-[#191b24] rounded-xl p-3 flex flex-col gap-1 border border-[#3b494b]/30">
          <span className="font-telemetry text-[9px] text-[#b9cacb]">SPORE JAMMER</span>
          <div className="flex items-baseline gap-1">
            <span className="font-telemetry text-lg text-[#ffd07c] font-bold">142.8</span>
            <span className="font-telemetry text-[11px] text-[#ffd07c]">MHz</span>
          </div>
          <div className="w-full bg-[#1d1f28] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#ffd07c] h-full w-[95%] rounded-full shadow-[0_0_8px_rgba(255,208,124,0.6)]"></div>
          </div>
        </div>
      </div>

      {/* Power Grid Distribution Slider */}
      <div className="bg-[#191b24] rounded-xl p-3.5 flex flex-col gap-2 border border-[#3b494b]/30 mb-3">
        <div className="flex justify-between items-center text-xs font-telemetry">
          <span className="text-[#b9cacb] font-bold">POWER GRID DISTRIBUTION</span>
          <span className="text-[#00f0ff] font-bold">
            THRUST {powerDistribution}% // DEFENSE {100 - powerDistribution}%
          </span>
        </div>
        <PowerProgressBar
          level={powerDistribution}
          height={10}
          showTicks={true}
          glow={true}
          colorScheme={powerDistribution > 60 ? 'cyan' : 'amber'}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={powerDistribution}
          onChange={(e) => {
            setPowerDistribution(parseInt(e.target.value, 10));
          }}
          className="w-full accent-[#00f0ff] bg-[#1d1f28] h-2 rounded-lg cursor-pointer shadow-[0_0_8px_rgba(0,240,255,0.3)] mt-0.5"
        />
        <div className="flex justify-between font-telemetry text-[10px] text-[#b9cacb]/70">
          <span>PRIORITY: SPORE FIELD</span>
          <span>BALANCED</span>
          <span>PRIORITY: ASCENT SPEED</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-1 mb-3">
        <button
          onClick={handleStressTest}
          disabled={isStressTesting}
          className="w-full py-3.5 px-4 rounded-xl bg-[#00f0ff] text-[#00363a] font-telemetry text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(0,240,255,0.45)] active:scale-95 transition-all cursor-pointer hover:bg-[#7df4ff]"
        >
          <span className="material-symbols-outlined text-[20px]">{isStressTesting ? 'sync' : 'bolt'}</span>
          <span>{isStressTesting ? 'CYCLING THRUSTER CHAMBER...' : 'RUN SUBSYSTEM STRESS TEST'}</span>
        </button>

        <button
          onClick={handleTransmit}
          disabled={isTransmitting}
          className="w-full py-2.5 px-4 rounded-xl bg-[#1d1f28] hover:bg-[#272a33] text-[#00f0ff] font-telemetry text-xs font-semibold flex items-center justify-center gap-2 border border-[#3b494b]/40 transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isTransmitting ? 'sync' : 'terminal'}
          </span>
          <span>{isTransmitting ? 'STREAMING PACKETS...' : 'TRANSMIT TELEMETRY TO COCKPIT HUD'}</span>
        </button>
      </div>

      {/* Chapter Stepper Bottom Link */}
      <div className="w-full bg-[#0b0e16]/80 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-telemetry border border-[#3b494b]/30">
        <span className="text-[#b9cacb] flex items-center gap-1 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span> SCENE 01: PREPARATION
        </span>
        <span className="text-[#00f0ff] font-telemetry text-[10px] font-bold">• HUD ACTIVE •</span>
        <button
          onClick={() => onNavigateScene && onNavigateScene('ascent')}
          className="text-[#ffd07c] hover:text-[#ffdea7] flex items-center gap-1 transition-colors font-bold"
        >
          SCENE 02: ASCENT <span className="material-symbols-outlined text-[16px]">east</span>
        </button>
      </div>
    </div>
  );
};
