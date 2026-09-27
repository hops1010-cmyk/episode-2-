import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentTab: string;
  onRadarClick: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  pilotName: string;
  onTogglePilot: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onRadarClick,
  soundEnabled,
  onToggleSound,
  pilotName,
  onTogglePilot,
}) => {
  const [timestamp, setTimestamp] = useState<string>('SYS.T+412:08:14');

  useEffect(() => {
    let sec = 14;
    let min = 8;
    let hr = 412;

    const interval = setInterval(() => {
      sec++;
      if (sec >= 60) {
        sec = 0;
        min++;
      }
      if (min >= 60) {
        min = 0;
        hr++;
      }
      setTimestamp(`SYS.T+${hr}:${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const tabLabels: Record<string, string> = {
    orbits: 'Orbits',
    diagnostics: 'Diagnostics',
    ascent: 'Ascent',
    comms: 'Comms',
    survival: 'Survival',
    finale: 'Finale',
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#10131c]/85 backdrop-blur-xl border-b border-[#3b494b]/25 shadow-[0_1px_12px_rgba(0,0,0,0.5)]">
      <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-4xl mx-auto">
        {/* Left Title & System Clock */}
        <div className="flex flex-col min-w-0 justify-center">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse"></span>
            <span className="font-telemetry text-[10px] text-[#ffd07c] tracking-widest uppercase">
              {timestamp}
            </span>
            <span className="text-[#3b494b] font-telemetry text-xs">•</span>
            <span className="font-telemetry text-[10px] text-[#b9cacb] truncate">J2000.0</span>
          </div>
          <h1 className="font-headline text-lg text-[#00f0ff] tracking-tight truncate font-bold leading-tight">
            {tabLabels[currentTab] || 'Orbits'}
          </h1>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Radar Telemetry */}
          <button
            onClick={() => {
              sound.playTargetLock();
              onRadarClick();
            }}
            aria-label="Toggle Live Orbit Telemetry"
            title="Radar Sweep"
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#191b24]/80 border border-[#3b494b]/30 text-[#b9cacb] hover:text-[#00f0ff] hover:border-[#00f0ff]/40 active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[19px]">radar</span>
          </button>

          {/* Audio Sound FX Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              sound.playClick(soundEnabled ? 600 : 1200, 0.05);
            }}
            aria-label="Toggle Audio Sound FX"
            title={soundEnabled ? 'Sound FX Enabled' : 'Sound FX Muted'}
            className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all active:scale-95 shadow-sm ${
              soundEnabled
                ? 'bg-[#191b24]/80 text-[#00f0ff] border-[#00f0ff]/40'
                : 'bg-[#191b24]/40 text-[#849495] border-[#3b494b]/20'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">
              {soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          {/* Pilot Switcher */}
          <button
            onClick={() => {
              sound.playClick(1400, 0.04);
              onTogglePilot();
            }}
            aria-label="Switch Pilot Profile"
            title={`Pilot: ${pilotName}`}
            className="flex items-center gap-1.5 bg-[#191b24]/80 border border-[#3b494b]/40 hover:border-[#00f0ff]/50 rounded-full pl-2 pr-1 py-1 active:scale-95 transition-all shadow-sm ml-0.5"
          >
            <span className="font-telemetry text-[10px] text-[#ffd07c] font-bold hidden sm:inline">
              {pilotName}
            </span>
            <div className="w-7 h-7 rounded-full bg-[#00f0ff] flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.35)]">
              <span className="material-symbols-outlined text-[#00363a] text-[16px]">person</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
