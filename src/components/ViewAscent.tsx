import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { sound } from '../utils/audio';

interface ViewAscentProps {
  onShowToast: (msg: string) => void;
  onNavigateScene?: (scene: string) => void;
}

export const ViewAscent: React.FC<ViewAscentProps> = ({ onShowToast, onNavigateScene }) => {
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<number>(65); // T+01:42 (65%)
  const [isFullThrottle, setIsFullThrottle] = useState<boolean>(false);
  const [isJammerOverdrive, setIsJammerOverdrive] = useState<boolean>(false);
  const [isCommsActive, setIsCommsActive] = useState<boolean>(true);
  const [leviathanDistance, setLeviathanDistance] = useState<number>(820);
  const [isEvasiveActive, setIsEvasiveActive] = useState<boolean>(false);

  const rumbleViewportRef = useRef<HTMLDivElement>(null);
  const threatCardRef = useRef<HTMLDivElement>(null);
  const scrubberTrackRef = useRef<HTMLDivElement>(null);
  const simIntervalRef = useRef<number | null>(null);

  // Equalizer heights
  const [eqHeights, setEqHeights] = useState<number[]>([8, 14, 6, 16, 10, 5]);

  // Animated equalizer loop
  useEffect(() => {
    if (!isCommsActive) return;
    const interval = setInterval(() => {
      setEqHeights([
        Math.floor(Math.random() * 14) + 4,
        Math.floor(Math.random() * 18) + 4,
        Math.floor(Math.random() * 10) + 4,
        Math.floor(Math.random() * 18) + 4,
        Math.floor(Math.random() * 12) + 4,
        Math.floor(Math.random() * 8) + 3,
      ]);
    }, 110);
    return () => clearInterval(interval);
  }, [isCommsActive]);

  // GSAP Camera Rumble micro-interaction
  const triggerCameraRumble = (intensity = 5, duration = 0.6) => {
    if (!rumbleViewportRef.current) return;
    const target = rumbleViewportRef.current;
    sound.playThrust(duration);

    gsap.killTweensOf(target);
    gsap.to(target, {
      x: `random(-${intensity}, ${intensity})`,
      y: `random(-${intensity}, ${intensity})`,
      duration: 0.03,
      repeat: Math.floor(duration / 0.03),
      yoyo: true,
      ease: 'none',
      onComplete: () => {
        gsap.to(target, { x: 0, y: 0, duration: 0.1 });
      },
    });
  };

  // Initial gentle rumble on mount
  useEffect(() => {
    triggerCameraRumble(3, 0.5);
  }, []);

  // Compute telemetry metrics from simulation progress percentage
  const pct = Math.max(0, Math.min(100, simProgress));
  const altVal = Math.round(1200 + (pct / 100) * 44800);
  const machVal = (1.1 + (pct / 100) * 5.35).toFixed(2);
  const qVal = (18.2 + Math.sin((pct / 100) * Math.PI) * 26.3).toFixed(1);
  const gBase = isFullThrottle ? 5.2 : 2.0;
  const gVal = (gBase + (pct / 100) * 2.8).toFixed(1);
  const msSpeed = Math.round(340 + (pct / 100) * 1620);
  const dvVal = Math.round(15 + (pct / 100) * 78);
  const climbRate = Math.round(180 + (pct / 100) * 310);

  const totalSeconds = Math.round((pct / 100) * 190);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  const timeFormatted = `T+0${m}:${s < 10 ? '0' : ''}${s}`;

  const commDialogues: Record<number, string> = {
    0: '"Ignition sequence initiated. Turbopumps at 100%. Esperanza-IX is breathing fire!"',
    15: '"Tower clear! Ground clamps detached! We are airborne through the canopy!"',
    42: '"Passing Max-Q! Dynamic buffeting on the aerodynamic cowl! Hang tight!"',
    65: '"G-forces spiking at 4.2G! Spore jammer holds at 72%... Clearing the cloud deck now!"',
    100: '"Main engine cutoff (MECO)! Orbit insertion trajectory confirmed. We cleared the tentacles!"',
  };

  let closestPhase = 65;
  let minDiff = 999;
  [0, 15, 42, 65, 100].forEach((pt) => {
    const diff = Math.abs(pct - pt);
    if (diff < minDiff) {
      minDiff = diff;
      closestPhase = pt;
    }
  });

  // Toggle simulate ascent
  const handleToggleSimulate = () => {
    if (isSimulating) {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      setIsSimulating(false);
      onShowToast('Flight Simulation Paused');
    } else {
      setIsSimulating(true);
      triggerCameraRumble(6, 1.2);
      onShowToast('Running Full Ascent Trajectory Engine...');

      simIntervalRef.current = window.setInterval(() => {
        setSimProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 1.2;
        });
      }, 100);
    }
  };

  useEffect(() => {
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  // Emergency RCS lateral burst action
  const handleRcsBurst = () => {
    sound.playWarning();
    triggerCameraRumble(9, 1.0);
    setIsEvasiveActive(true);
    setLeviathanDistance((prev) => prev + 420);
    onShowToast('Lateral Thrusters Fired: +420m Evasion Vector Locked!');

    if (threatCardRef.current) {
      gsap.fromTo(
        threatCardRef.current,
        { scale: 0.97, borderColor: '#00f0ff' },
        { scale: 1, borderColor: 'rgba(255, 180, 171, 0.4)', duration: 0.4, ease: 'back.out(2)' }
      );
    }

    setTimeout(() => {
      setIsEvasiveActive(false);
    }, 2400);
  };

  // Full throttle toggle
  const handleThrottleToggle = () => {
    setIsFullThrottle(!isFullThrottle);
    if (!isFullThrottle) {
      sound.playThrust(1.5);
      triggerCameraRumble(10, 1.8);
      onShowToast('Stage 1 Engines at 100% Throttle - Supersonic Breakout!');
    } else {
      sound.playClick(900, 0.05);
      onShowToast('Thrust Level Restored to Nominal Profile');
    }
  };

  // Aux power to jammer toggle
  const handleAuxToggle = () => {
    setIsJammerOverdrive(!isJammerOverdrive);
    sound.playClick(isJammerOverdrive ? 800 : 1400, 0.06);
    onShowToast(
      isJammerOverdrive ? 'Auxiliary Power Reverted' : 'Auxiliary Power Diverted: Spore Jammer Overdrive!'
    );
  };

  return (
    <div className="flex flex-col w-full px-4 space-y-3.5 text-[#e1e2ee] pb-8">
      {/* Alert Header */}
      <div className="flex flex-col space-y-1.5 bg-[#191b24]/90 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-[#3b494b]/30 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#93000a]/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping"></span>
            <span className="font-telemetry text-[10px] text-[#ffd07c] tracking-widest uppercase font-bold">
              SCENE 02 // THE ASCENT
            </span>
          </div>
          <span className="font-telemetry text-xs px-2.5 py-0.5 rounded-full bg-[#272a33] text-[#00f0ff] font-bold border border-[#3b494b]/30">
            {timeFormatted}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex flex-col">
            <span className="font-telemetry text-[9px] text-[#b9cacb] uppercase">FLIGHT TRAJECTORY</span>
            <span className="font-telemetry text-sm text-[#00f0ff] font-bold tracking-tight">
              COASTAL USULUTÁN → LEO ESCAPE ARC
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#93000a] text-[#ffdad6] shadow-[0_0_12px_rgba(255,180,171,0.25)] border border-[#ffb4ab]/40">
            <span className="material-symbols-outlined text-[14px] animate-pulse">warning</span>
            <span className="font-telemetry text-[9px] font-bold tracking-wider">TITAN INTERCEPT IMMINENT</span>
          </div>
        </div>
      </div>

      {/* 16:9 Tactical Viewport with GSAP Rumble */}
      <div
        ref={rumbleViewportRef}
        className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#0b0e16] shadow-2xl border border-[#3b494b]/40 select-none"
      >
        <img
          alt="Mateo's Liftoff Under Gorglith Attack"
          className="w-full h-full object-cover select-none pointer-events-none brightness-95 contrast-105"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPXuiHC7-Jxsg7eX2cHgzmkxKABIAjy91ch-qjmlXcmPYbJyQDidyMzDr1VnADY9zjIH5hNAHi2XnJR17-E_zGmf_QCWL_RsVU2OK466XABVDFl8dkdBnCnUmTeYJCbhNj9ugFYhX2LSpqxFrHnLBUbQ9a06uN5t8M4XcNh74FYvmtKLd0_Sr8exSKDNy-ihpbDHVFsM6kq1Camet_zqBA7Ja2K9nPA72VP-d-99rNXka6yHGEzEzL"
        />

        {/* Viewport Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#10131c] via-transparent to-[#10131c]/40 pointer-events-none"></div>

        {/* Floating Spore Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-1.5 h-1.5 rounded-full bg-[#ffd07c]/80 shadow-[0_0_6px_#ffd07c] animate-pulse" style={{ left: '22%', bottom: '25%' }}></div>
          <div className="absolute w-1 h-1 rounded-full bg-[#00f0ff] shadow-[0_0_5px_#00f0ff] animate-pulse" style={{ left: '48%', bottom: '40%' }}></div>
          <div className="absolute w-2 h-2 rounded-full bg-[#ffb4ab]/70 shadow-[0_0_8px_#ffb4ab] animate-pulse" style={{ left: '76%', bottom: '55%' }}></div>
        </div>

        {/* HUD Corner Brackets */}
        <div className="absolute top-2.5 left-2.5 w-4 h-4 pointer-events-none">
          <svg className="w-full h-full text-[#00f0ff] drop-shadow-[0_0_4px_#00f0ff]" viewBox="0 0 16 16">
            <path d="M0 16 V2 Q0 0 2 0 H16" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <div className="absolute top-2.5 right-2.5 w-4 h-4 pointer-events-none">
          <svg className="w-full h-full text-[#00f0ff] drop-shadow-[0_0_4px_#00f0ff]" viewBox="0 0 16 16">
            <path d="M16 16 V2 Q16 0 14 0 H0" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <div className="absolute bottom-2.5 left-2.5 w-4 h-4 pointer-events-none">
          <svg className="w-full h-full text-[#00f0ff] drop-shadow-[0_0_4px_#00f0ff]" viewBox="0 0 16 16">
            <path d="M0 0 V14 Q0 16 2 16 H16" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <div className="absolute bottom-2.5 right-2.5 w-4 h-4 pointer-events-none">
          <svg className="w-full h-full text-[#00f0ff] drop-shadow-[0_0_4px_#00f0ff]" viewBox="0 0 16 16">
            <path d="M16 0 V14 Q16 16 14 16 H0" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {/* Center Reticle Lock on Mateo's Rocket */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Outer Rotating Ring */}
            <div className="absolute inset-0 rotate-reticle opacity-75">
              <svg className="w-full h-full text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="14 10" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />
              </svg>
            </div>
            {/* Inner Crosshairs */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.85)]" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="40" y1="2" x2="40" y2="14" stroke="currentColor" strokeWidth="2" />
                <line x1="40" y1="66" x2="40" y2="78" stroke="currentColor" strokeWidth="2" />
                <line x1="2" y1="40" x2="14" y2="40" stroke="currentColor" strokeWidth="2" />
                <line x1="66" y1="40" x2="78" y2="40" stroke="currentColor" strokeWidth="2" />
                <circle cx="40" cy="40" r="3" fill="#00f0ff" />
              </svg>
              <span className="absolute -bottom-5 font-telemetry text-[8px] text-[#00f0ff] font-bold tracking-widest whitespace-nowrap bg-[#0b0e16]/80 px-1 rounded shadow">
                TGT: LOCK-ESPERANZA IX
              </span>
            </div>
          </div>
        </div>

        {/* Altitude Ladder */}
        <div className="absolute left-3 top-8 bottom-8 flex flex-col justify-between items-start pointer-events-none text-[#00f0ff]/80">
          <span className="font-telemetry text-[9px] tracking-tighter">45k—</span>
          <span className="font-telemetry text-[9px] text-[#ffd07c] tracking-tighter font-bold">
            {Math.round(altVal / 1000)}k►
          </span>
          <span className="font-telemetry text-[9px] tracking-tighter">20k—</span>
          <span className="font-telemetry text-[9px] tracking-tighter">15k—</span>
        </div>

        {/* Right Status Badge */}
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1">
          <button
            onClick={() => triggerCameraRumble(8, 0.8)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0b0e16]/85 backdrop-blur-md border border-[#ffd07c]/30 hover:border-[#ffd07c] transition-all active:scale-95 shadow-[0_0_12px_rgba(255,208,124,0.2)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffd07c] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffd07c]"></span>
            </span>
            <span className="font-telemetry text-[9px] text-[#ffd07c] font-bold">RUMBLE: ACTIVE</span>
          </button>
          <span className="font-telemetry text-[10px] text-[#00dbe9]">
            PITCH: +{(88 - (pct / 100) * 18).toFixed(1)}° VERT
          </span>
        </div>
      </div>

      {/* Trajectory Simulation Engine & Interactive Timeline Scrubber */}
      <div className="flex flex-col space-y-2 bg-[#191b24]/90 backdrop-blur-xl p-4 rounded-xl shadow-md border border-[#3b494b]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">timeline</span>
            <span className="font-headline text-base text-[#dbfcff] font-bold">Ascent Trajectory</span>
          </div>
          <button
            onClick={handleToggleSimulate}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-telemetry text-xs font-bold active:scale-95 transition-all shadow-[0_0_14px_rgba(0,240,255,0.4)] ${
              isSimulating
                ? 'bg-[#ffd07c] text-[#412d00]'
                : 'bg-[#00f0ff] text-[#00363a] hover:bg-[#7df4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {isSimulating ? 'pause' : 'play_arrow'}
            </span>
            <span>{isSimulating ? 'PAUSE MONITOR' : 'SIMULATE ASCENT'}</span>
          </button>
        </div>

        {/* Stages click buttons */}
        <div className="flex justify-between items-center text-[#b9cacb] font-telemetry text-[9px] pt-1">
          {[
            { label: 'IGNITION', val: 0 },
            { label: 'LIFTOFF', val: 15 },
            { label: 'MAX-Q', val: 42 },
            { label: 'APEX THREAT', val: 65, alert: true },
            { label: 'BURNOUT', val: 100 },
          ].map((st) => (
            <button
              key={st.label}
              onClick={() => {
                setSimProgress(st.val);
                triggerCameraRumble(5, 0.4);
                sound.playClick(1000 + st.val * 5, 0.04);
              }}
              className={`px-1 py-0.5 rounded transition-all cursor-pointer ${
                st.alert ? 'text-[#ffb4ab] font-bold shadow-[0_0_6px_rgba(255,180,171,0.3)]' : 'hover:text-[#00f0ff]'
              } ${Math.abs(pct - st.val) < 8 ? 'text-[#00f0ff] font-bold scale-105' : ''}`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Timeline Scrubber Track */}
        <div
          ref={scrubberTrackRef}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            const newPct = Math.round((clickPos / rect.width) * 100);
            setSimProgress(newPct);
            triggerCameraRumble(4, 0.2);
          }}
          className="relative w-full h-4 bg-[#272a33] rounded-full cursor-pointer flex items-center px-1"
        >
          <div
            style={{ width: `${pct}%` }}
            className="h-2 bg-gradient-to-r from-[#006970] via-[#00f0ff] to-[#ffd07c] rounded-full"
          ></div>
          <div
            style={{ left: `${pct}%` }}
            className="absolute -ml-2.5 w-5 h-5 rounded-full bg-[#00f0ff] shadow-[0_0_12px_#00f0ff] ring-2 ring-[#10131c] flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#00363a]"></div>
          </div>
        </div>

        <div className="flex justify-between items-center font-telemetry text-[10px] text-[#b9cacb]">
          <span>T-00:10</span>
          <span>T+00:00</span>
          <span>T+00:45</span>
          <span className="text-[#ffd07c] font-bold tracking-wider">{timeFormatted}</span>
          <span>T+03:10</span>
        </div>

        {/* Radio Comm Box */}
        <div
          onClick={() => {
            setIsCommsActive(!isCommsActive);
            sound.playClick(isCommsActive ? 700 : 1300, 0.05);
          }}
          className="mt-1 p-2.5 rounded-lg bg-[#1d1f28] flex items-start gap-2.5 shadow-inner border border-[#3b494b]/20 hover:border-[#00f0ff]/40 transition-colors cursor-pointer group"
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all ${
              isCommsActive
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                : 'bg-[#272a33] text-[#b9cacb]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isCommsActive ? 'mic' : 'mic_off'}
            </span>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-telemetry text-[10px] text-[#ffd07c] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isCommsActive ? 'bg-[#00f0ff] animate-ping' : 'bg-[#849495]'}`}></span>
                MATEO // ESPERANZA-IX COMM
              </span>
              {/* Equalizer */}
              <div className="flex items-end gap-0.5 h-3.5">
                {eqBarsHeight()}
              </div>
            </div>
            <p className="font-body text-xs text-[#e1e2ee] italic mt-0.5 line-clamp-2">
              {commDialogues[closestPhase]}
            </p>
            <div className="flex items-center justify-between mt-1 text-[9px] font-telemetry text-[#b9cacb]">
              <span className={isCommsActive ? 'text-[#00f0ff] flex items-center gap-1' : 'text-[#849495]'}>
                <span className="material-symbols-outlined text-[11px]">graphic_eq</span>
                {isCommsActive ? 'LIVE TRANSMISSION' : 'MUTED'}
              </span>
              <span className="hover:text-[#ffd07c]">TAP TO TOGGLE COMM FEED</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Altitude */}
        <div className="bg-[#191b24]/90 p-3 rounded-xl flex flex-col justify-between shadow-md border border-[#3b494b]/20">
          <div className="flex items-center justify-between">
            <span className="font-telemetry text-[9px] text-[#b9cacb] uppercase">ALTITUDE</span>
            <span className="material-symbols-outlined text-[#00f0ff] text-[16px]">height</span>
          </div>
          <div className="my-1">
            <span className="font-telemetry text-lg text-[#00f0ff] font-bold tracking-tight">
              {altVal.toLocaleString()} m
            </span>
          </div>
          <div className="flex items-center justify-between font-telemetry text-[10px] text-[#b9cacb]">
            <span className="flex items-center gap-0.5 text-[#00f0ff]">
              <span className="material-symbols-outlined text-[12px]">arrow_upward</span>+{climbRate} m/s
            </span>
            <span>MESO-ESCAPE</span>
          </div>
        </div>

        {/* Velocity */}
        <div className="bg-[#191b24]/90 p-3 rounded-xl flex flex-col justify-between shadow-md border border-[#3b494b]/20">
          <div className="flex items-center justify-between">
            <span className="font-telemetry text-[9px] text-[#b9cacb] uppercase">VELOCITY</span>
            <span className="material-symbols-outlined text-[#00f0ff] text-[16px]">speed</span>
          </div>
          <div className="my-1">
            <span className="font-telemetry text-lg text-[#00f0ff] font-bold tracking-tight">
              Mach {machVal}
            </span>
          </div>
          <div className="flex items-center justify-between font-telemetry text-[10px] text-[#b9cacb]">
            <span>{msSpeed.toLocaleString()} m/s</span>
            <span className="text-[#ffd07c] font-bold">Δv: {dvVal}%</span>
          </div>
        </div>

        {/* Max-Q */}
        <div className="bg-[#191b24]/90 p-3 rounded-xl flex flex-col justify-between shadow-md border border-[#3b494b]/20">
          <div className="flex items-center justify-between">
            <span className="font-telemetry text-[9px] text-[#b9cacb] uppercase">MAX-Q PRESSURE</span>
            <span className="material-symbols-outlined text-[#ffd07c] text-[16px]">compress</span>
          </div>
          <div className="my-1">
            <span className="font-telemetry text-lg text-[#dbfcff] font-bold tracking-tight">
              {qVal} kPa
            </span>
          </div>
          <div className="flex items-center gap-1 font-telemetry text-[10px] text-[#00f0ff]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>
            <span>NOMINAL TOLERANCE</span>
          </div>
        </div>

        {/* G-Force */}
        <div className="bg-[#191b24]/90 p-3 rounded-xl flex flex-col justify-between shadow-md border border-[#3b494b]/20">
          <div className="flex items-center justify-between">
            <span className="font-telemetry text-[9px] text-[#b9cacb] uppercase">G-FORCE LOAD</span>
            <span className="material-symbols-outlined text-[#ffd07c] text-[16px]">electric_meter</span>
          </div>
          <div className="my-1 flex items-baseline gap-1">
            <span className="font-telemetry text-lg text-[#ffd07c] font-bold tracking-tight">{gVal} G</span>
            <span className="font-telemetry text-[9px] text-[#ffbb1e] animate-pulse uppercase">PULSING</span>
          </div>
          <div className="w-full bg-[#272a33] rounded-full h-1.5 overflow-hidden">
            <div
              style={{ width: `${Math.min(100, Math.round((parseFloat(gVal) / 8) * 100))}%` }}
              className="bg-[#ffd07c] h-full rounded-full transition-all duration-150"
            ></div>
          </div>
        </div>
      </div>

      {/* Bio-Spore Shield Integrity */}
      <div className={`bg-[#191b24]/90 backdrop-blur-xl p-3.5 rounded-xl flex flex-col space-y-2 shadow-md border transition-all ${
        isJammerOverdrive ? 'border-[#ffd07c] shadow-[0_0_18px_rgba(255,208,124,0.3)]' : 'border-[#3b494b]/20'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">shield</span>
            <span className="font-headline text-sm text-[#dbfcff] font-bold">Bio-Spore Shield Integrity</span>
          </div>
          <span
            className={`font-telemetry text-xs px-2.5 py-0.5 rounded font-bold ${
              isJammerOverdrive ? 'bg-[#f3af00] text-[#412d00]' : 'bg-[#1d1f28] text-[#00f0ff]'
            }`}
          >
            {isJammerOverdrive ? '94% [OVERCHARGED]' : '68% [ACTIVE]'}
          </span>
        </div>

        {/* Live Continuous Undulating Wave Graphic */}
        <div className="w-full h-10 bg-[#1d1f28] rounded-lg px-2 flex items-center justify-between overflow-hidden relative border border-[#3b494b]/15">
          <svg className="w-full h-8" preserveAspectRatio="none" viewBox="0 0 300 32">
            <path
              d="M -60 16 Q -35 2 0 16 T 60 16 T 120 16 T 180 16 T 240 16 T 300 16 T 360 16"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="wave-animated-1 drop-shadow-[0_0_6px_rgba(0,240,255,0.6)]"
            />
            <path
              d="M -60 16 Q -30 26 0 16 T 60 16 T 120 16 T 180 16 T 240 16 T 300 16 T 360 16"
              fill="none"
              stroke="#ffd07c"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.85"
              className="wave-animated-2"
            />
          </svg>
        </div>

        <div className="flex justify-between items-center text-[#b9cacb] font-telemetry text-[10px]">
          <span>CORONA FREQ: 428.6 THz</span>
          <span className="text-[#00f0ff]">
            DEFLECTION RESIST: {isJammerOverdrive ? '2.4 GW' : '1.2 GW'}
          </span>
        </div>
      </div>

      {/* Gorglith Leviathan Threat Intercept Tracker */}
      <div
        ref={threatCardRef}
        className="bg-[#191b24]/95 backdrop-blur-xl p-4 rounded-xl space-y-3 shadow-xl relative overflow-hidden border border-[#93000a]/50"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-lg bg-[#93000a]/40 flex items-center justify-center text-[#ffb4ab] overflow-visible">
              <span className="absolute inset-0 rounded-lg border-2 border-[#ffb4ab] sonar-ring pointer-events-none"></span>
              <span className="material-symbols-outlined text-[20px] animate-pulse">radar</span>
            </div>
            <div>
              <span className="font-telemetry text-[10px] text-[#ffb4ab] tracking-wider uppercase font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-ping"></span>
                GORGLITH SCANNER
              </span>
              <h2 className="font-headline text-base text-[#dbfcff] font-bold">Leviathan Intercept Array</h2>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#93000a] text-[#ffdad6] font-telemetry text-[9px] uppercase font-bold animate-pulse">
            DANGER
          </span>
        </div>

        <div className="bg-[#1d1f28] p-3 rounded-lg flex items-center justify-between border border-[#3b494b]/20">
          <div className="flex flex-col">
            <span className="font-telemetry text-[9px] text-[#b9cacb] uppercase">LEVIATHAN PROXIMITY</span>
            <span className={`font-telemetry text-base font-bold tracking-tight ${isEvasiveActive ? 'text-[#00f0ff]' : 'text-[#ffb4ab]'}`}>
              {leviathanDistance}m {isEvasiveActive ? '[EVADED +420m]' : '& CLOSING'}
            </span>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="font-telemetry text-[9px] text-[#ffd07c] uppercase">LAST EVASION</span>
            <span className="font-telemetry text-xs text-[#00f0ff] font-bold">
              {isEvasiveActive ? 'VECTOR DELTA-9 (+420m)' : 'VECTOR ALPHA-3 (-140m)'}
            </span>
          </div>
        </div>

        {/* Emergency RCS Lateral Burst Button */}
        <button
          onClick={handleRcsBurst}
          className="w-full py-2.5 px-3 rounded-lg bg-[#272a33] hover:bg-[#363943] text-[#00f0ff] font-telemetry text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_16px_rgba(0,240,255,0.2)] border border-[#00f0ff]/30 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">sync</span>
          <span>EMERGENCY RCS LATERAL BURST</span>
        </button>
      </div>

      {/* Flight Control Action Buttons */}
      <div className="flex flex-col space-y-2 pt-1">
        <button
          onClick={handleThrottleToggle}
          className={`w-full py-3.5 px-4 rounded-xl font-headline text-base font-bold tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-lg ${
            isFullThrottle
              ? 'throttle-active bg-[#ffd07c] text-[#412d00]'
              : 'bg-[#00f0ff] text-[#00363a] hover:bg-[#7df4ff] shadow-[0_0_24px_rgba(0,240,255,0.45)]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isFullThrottle ? 'speed' : 'rocket'}
          </span>
          <span>
            {isFullThrottle
              ? '[THROTTLE 100% - SUPERSONIC BREAKOUT]'
              : 'ENGAGE FULL THROTTLE (STAGE 1)'}
          </span>
        </button>

        <button
          onClick={handleAuxToggle}
          className={`w-full py-2.5 px-4 rounded-xl font-telemetry text-xs tracking-wider uppercase flex items-center justify-center gap-2 active:scale-[0.98] transition-all border cursor-pointer ${
            isJammerOverdrive
              ? 'bg-[#ffd07c] text-[#412d00] border-[#ffd07c] shadow-[0_0_20px_rgba(255,208,124,0.4)]'
              : 'bg-[#272a33] hover:bg-[#363943] text-[#ffd07c] border-[#ffd07c]/30'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isJammerOverdrive ? 'security' : 'bolt'}
          </span>
          <span>
            {isJammerOverdrive
              ? 'AUX POWER LOCKED: JAMMER OVERDRIVE'
              : 'DIVERT AUX POWER TO JAMMER'}
          </span>
        </button>
      </div>

      {/* Chapter Stepper Bottom Link */}
      <div className="flex items-center justify-between pt-2 pb-2 text-[#b9cacb] font-telemetry text-xs">
        <button
          onClick={() => onNavigateScene && onNavigateScene('diagnostics')}
          className="flex items-center gap-1 hover:text-[#00f0ff] transition-colors py-2 active:scale-95"
        >
          <span className="material-symbols-outlined text-[14px]">arrow_back</span>
          <span>SCENE 1: THE PREPARATION</span>
        </button>
        <button
          onClick={() => onNavigateScene && onNavigateScene('comms')}
          className="flex items-center gap-1 text-[#00f0ff] hover:text-[#7df4ff] transition-colors py-2 active:scale-95 font-bold"
        >
          <span>SCENE 3: LEO SPORE RUN</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );

  function eqBarsHeight() {
    return eqHeights.map((h, i) => (
      <span
        key={i}
        style={{ height: `${isCommsActive ? h : 2}px` }}
        className="w-0.5 bg-[#00f0ff] rounded-full transition-all duration-100"
      ></span>
    ));
  }
};
