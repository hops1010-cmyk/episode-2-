import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { sound } from '../utils/audio';
import { PowerProgressBar } from './PowerProgressBar';

export type PowerMode = 'nominal' | 'boost' | 'eco' | 'recharge';

interface PowerStatusWidgetProps {
  onShowToast: (msg: string) => void;
  currentTab: string;
}

export const PowerStatusWidget: React.FC<PowerStatusWidgetProps> = ({ onShowToast, currentTab }) => {
  const [batteryLevel, setBatteryLevel] = useState<number>(78);
  const [previousLevel, setPreviousLevel] = useState<number>(78);
  const [powerMode, setPowerMode] = useState<PowerMode>('nominal');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [voltage, setVoltage] = useState<number>(28.4);
  const [dischargeRate, setDischargeRate] = useState<number>(-1.8);
  const [estimatedTime, setEstimatedTime] = useState<string>('18h 42m');

  const containerRef = useRef<HTMLDivElement>(null);
  const deltaBadgeRef = useRef<HTMLSpanElement>(null);
  const percentTextRef = useRef<HTMLSpanElement>(null);
  const fluctuationTimerRef = useRef<number | null>(null);

  // Tab-specific power drains or recharging dynamics
  useEffect(() => {
    // When switching tabs, simulate power draw differences across mission scenes
    let targetOffset = 0;
    if (currentTab === 'ascent') {
      targetOffset = -14; // heavy thruster ascent drain
    } else if (currentTab === 'survival') {
      targetOffset = -22; // critical starved drift
    } else if (currentTab === 'diagnostics') {
      targetOffset = +4; // test harness bench power
    } else if (currentTab === 'comms') {
      targetOffset = -6; // high-gain RF laser transmission
    } else if (currentTab === 'finale') {
      targetOffset = -10; // cliffhanger drift
    }

    const baseline = 78 + targetOffset;
    const clamped = Math.max(8, Math.min(99, baseline + Math.floor(Math.random() * 5 - 2)));
    triggerPowerFluctuation(clamped, `Scene shifted: Telemetry draws adjusted for [${currentTab.toUpperCase()}]`);
  }, [currentTab]);

  // Ambient natural cosmic background fluctuation loop
  useEffect(() => {
    const runFluctuationLoop = () => {
      fluctuationTimerRef.current = window.setTimeout(() => {
        setBatteryLevel((prev) => {
          let delta = 0;
          if (powerMode === 'boost') {
            delta = -2 - Math.random() * 2;
          } else if (powerMode === 'recharge') {
            delta = +2 + Math.random() * 3;
          } else if (powerMode === 'eco') {
            delta = -0.3 + (Math.random() - 0.4) * 0.8;
          } else {
            // nominal: small jitter
            delta = (Math.random() - 0.55) * 2;
          }

          const next = Math.max(5, Math.min(100, Math.round((prev + delta) * 10) / 10));
          if (Math.abs(next - prev) > 0.3) {
            animateNumber(prev, next);
          }
          return next;
        });

        runFluctuationLoop();
      }, 7000 + Math.random() * 5000);
    };

    runFluctuationLoop();
    return () => {
      if (fluctuationTimerRef.current) clearTimeout(fluctuationTimerRef.current);
    };
  }, [powerMode]);

  // Animate text numbers with GSAP counter
  const animateNumber = (fromVal: number, toVal: number) => {
    setPreviousLevel(fromVal);
    const delta = toVal - fromVal;

    // Flash small delta badge
    if (deltaBadgeRef.current) {
      deltaBadgeRef.current.textContent = `${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`;
      gsap.killTweensOf(deltaBadgeRef.current);
      gsap.fromTo(
        deltaBadgeRef.current,
        { opacity: 1, y: delta > 0 ? 4 : -4, scale: 1.1 },
        { opacity: 0, y: 0, scale: 1, duration: 1.6, ease: 'power2.out' }
      );
    }

    // Play tactile sound
    if (delta < -2) {
      sound.playClick(650, 0.06);
    } else if (delta > 2) {
      sound.playClick(1400, 0.04);
    }

    // Update dynamic voltage and time
    const newVolt = (24 + (toVal / 100) * 5.6).toFixed(1);
    setVoltage(parseFloat(newVolt));
    const newRate = powerMode === 'boost' ? -4.2 : powerMode === 'recharge' ? +3.6 : -1.8;
    setDischargeRate(newRate);
    const hrs = Math.max(1, Math.round((toVal / 100) * 24));
    setEstimatedTime(`${hrs}h ${Math.floor(Math.random() * 50 + 10)}m`);
  };

  const triggerPowerFluctuation = (targetLevel: number, note?: string) => {
    const clamped = Math.max(5, Math.min(100, targetLevel));
    animateNumber(batteryLevel, clamped);
    setBatteryLevel(clamped);
    if (note) onShowToast(note);
  };

  // Toggle Mode Handler
  const handleSetMode = (mode: PowerMode) => {
    setPowerMode(mode);
    sound.playTargetLock();

    if (mode === 'boost') {
      triggerPowerFluctuation(Math.max(12, batteryLevel - 15), 'Subsystem Overdrive engaged: High discharge rate (-4.2 kW)');
    } else if (mode === 'recharge') {
      triggerPowerFluctuation(Math.min(98, batteryLevel + 12), 'Solar Array deployed: Photo-voltaic charging active (+3.6 kW)');
    } else if (mode === 'eco') {
      onShowToast('Auxiliary Bus switched to Low-Power Eco Stasis (-0.4 kW)');
    } else {
      onShowToast('Bus normalized to standard Esperanza-IX Flight Profile');
    }
  };

  const isLow = batteryLevel < 25;
  const isOptimal = batteryLevel > 60;

  return (
    <div
      ref={containerRef}
      className="w-full max-w-xl mx-auto px-4 z-30 transition-all select-none"
    >
      <div
        className={`relative rounded-xl backdrop-blur-xl border transition-all duration-300 shadow-lg overflow-hidden ${
          isLow
            ? 'bg-[#191b24]/95 border-[#93000a]/60 shadow-[0_0_20px_rgba(255,180,171,0.2)]'
            : isOptimal
            ? 'bg-[#191b24]/90 border-[#00f0ff]/30 hover:border-[#00f0ff]/60 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
            : 'bg-[#191b24]/90 border-[#ffd07c]/40 shadow-[0_0_15px_rgba(255,208,124,0.15)]'
        }`}
      >
        {/* Ambient Top Glow Line */}
        <div
          className={`absolute top-0 inset-x-0 h-0.5 ${
            isLow
              ? 'bg-gradient-to-r from-transparent via-[#ffb4ab] to-transparent animate-pulse'
              : isOptimal
              ? 'bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent'
              : 'bg-gradient-to-r from-transparent via-[#ffd07c] to-transparent'
          }`}
        />

        {/* Compact Header Bar (Always Visible) */}
        <div className="px-3 py-2 flex items-center justify-between gap-2">
          {/* Left Title & Status Indicator */}
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                isLow
                  ? 'bg-[#93000a]/40 text-[#ffb4ab]'
                  : isOptimal
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff]'
                  : 'bg-[#f3af00]/20 text-[#ffd07c]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">
                {powerMode === 'recharge'
                  ? 'battery_charging_full'
                  : isLow
                  ? 'battery_alert'
                  : 'battery_horiz_075'}
              </span>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-telemetry text-[9px] uppercase tracking-wider text-[#ffd07c] font-bold">
                  POWER STATUS
                </span>
                <span className="text-[#3b494b] font-telemetry text-[10px]">•</span>
                <span className="font-telemetry text-[9px] text-[#b9cacb] uppercase truncate">
                  {powerMode.toUpperCase()} BUS
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-telemetry text-[11px] text-[#dbfcff] font-bold">
                  Esperanza Cryo-Cell Array
                </span>
              </div>
            </div>
          </div>

          {/* Center-Right Quick Numeric Readout & Dynamic Delta Flash */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex flex-col items-end">
              <div className="flex items-baseline gap-1 relative">
                <span
                  ref={percentTextRef}
                  className={`font-headline text-lg font-bold tracking-tight ${
                    isLow ? 'text-[#ffb4ab]' : isOptimal ? 'text-[#00f0ff]' : 'text-[#ffd07c]'
                  }`}
                >
                  {batteryLevel.toFixed(0)}%
                </span>
                <span className="font-telemetry text-[10px] text-[#b9cacb]">
                  {voltage}V
                </span>

                {/* GSAP floating delta badge */}
                <span
                  ref={deltaBadgeRef}
                  className="absolute -top-3 right-0 font-telemetry text-[9px] font-bold text-[#00f0ff] opacity-0 pointer-events-none"
                >
                  +0.0%
                </span>
              </div>

              <span className="font-telemetry text-[9px] text-[#b9cacb]">
                {dischargeRate > 0 ? `+${dischargeRate} kW` : `${dischargeRate} kW`} // {estimatedTime}
              </span>
            </div>

            {/* Expand / Minimize Drawer Toggle Button */}
            <button
              onClick={() => {
                setIsExpanded(!isExpanded);
                sound.playClick(isExpanded ? 800 : 1300, 0.04);
              }}
              title={isExpanded ? 'Minimize Power Status Drawer' : 'Expand Power Controls'}
              className="w-8 h-8 rounded-lg bg-[#272a33]/80 hover:bg-[#363943] text-[#b9cacb] hover:text-[#00f0ff] flex items-center justify-center transition-all active:scale-95 border border-[#3b494b]/30"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isExpanded ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>
        </div>

        {/* Custom Persistent Progress Bar Component */}
        <div className="px-3 pb-2.5 pt-0.5">
          <PowerProgressBar
            level={batteryLevel}
            previousLevel={previousLevel}
            height={9}
            showTicks={true}
            glow={true}
          />
        </div>

        {/* Expandable Power Control & Diagnostic Matrix */}
        {isExpanded && (
          <div className="px-3 pb-3 pt-1 border-t border-[#3b494b]/30 bg-[#0b0e16]/80 flex flex-col gap-2.5">
            {/* Quick Mode Selectors */}
            <div className="flex flex-col gap-1">
              <span className="font-telemetry text-[9px] text-[#b9cacb] uppercase tracking-wider font-bold">
                BUS DISCHARGE PROFILE SELECTOR
              </span>
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-lg bg-[#191b24] border border-[#3b494b]/30">
                {(['nominal', 'boost', 'eco', 'recharge'] as const).map((mode) => {
                  const isActive = powerMode === mode;
                  const modeIcons = {
                    nominal: 'tune',
                    boost: 'bolt',
                    eco: 'eco',
                    recharge: 'solar_power',
                  };
                  return (
                    <button
                      key={mode}
                      onClick={() => handleSetMode(mode)}
                      className={`py-1 px-1.5 rounded-md font-telemetry text-[10px] font-bold uppercase transition-all flex flex-col items-center justify-center gap-0.5 ${
                        isActive
                          ? mode === 'boost'
                            ? 'bg-[#ffd07c] text-[#412d00] shadow-[0_0_10px_rgba(255,208,124,0.4)]'
                            : mode === 'recharge'
                            ? 'bg-[#00f0ff] text-[#00363a] shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                            : 'bg-[#272a33] text-[#00f0ff] border border-[#00f0ff]/40'
                          : 'text-[#849495] hover:text-[#e1e2ee]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {modeIcons[mode]}
                      </span>
                      <span>{mode}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-Metrics Telemetry Grid */}
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="bg-[#191b24] p-1.5 rounded-lg border border-[#3b494b]/20 flex flex-col justify-between">
                <span className="font-telemetry text-[8px] text-[#849495]">CELL VOLTAGE</span>
                <span className="font-telemetry text-xs text-[#00f0ff] font-bold">{voltage} V</span>
              </div>
              <div className="bg-[#191b24] p-1.5 rounded-lg border border-[#3b494b]/20 flex flex-col justify-between">
                <span className="font-telemetry text-[8px] text-[#849495]">AMPERAGE</span>
                <span className="font-telemetry text-xs text-[#ffd07c] font-bold">
                  {powerMode === 'boost' ? '148.2 A' : '63.4 A'}
                </span>
              </div>
              <div className="bg-[#191b24] p-1.5 rounded-lg border border-[#3b494b]/20 flex flex-col justify-between">
                <span className="font-telemetry text-[8px] text-[#849495]">EST. AUTONOMY</span>
                <span className="font-telemetry text-xs text-[#7df4ff] font-bold">{estimatedTime}</span>
              </div>
            </div>

            {/* Quick Simulated Surge / Drain Test Buttons */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <button
                onClick={() => {
                  sound.playThrust(0.4);
                  triggerPowerFluctuation(Math.max(10, batteryLevel - 12), 'Simulated Surge Draw: RCS Thrusters test fired (-12%)');
                }}
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#272a33] hover:bg-[#363943] text-[#ffb4ab] border border-[#ffb4ab]/30 font-telemetry text-[10px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[13px]">electric_bolt</span>
                <span>SIMULATE SURGE (-12%)</span>
              </button>

              <button
                onClick={() => {
                  sound.playSuccess();
                  triggerPowerFluctuation(Math.min(99, batteryLevel + 15), 'Simulated Power Recovery: Auxiliary Solar alignment (+15%)');
                }}
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#272a33] hover:bg-[#363943] text-[#00f0ff] border border-[#00f0ff]/30 font-telemetry text-[10px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[13px]">battery_saver</span>
                <span>RECHARGE PULSE (+15%)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
