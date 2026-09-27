import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { sound } from '../utils/audio';

interface ViewSurvivalProps {
  onShowToast: (msg: string) => void;
  onNavigateScene?: (scene: string) => void;
}

export const ViewSurvival: React.FC<ViewSurvivalProps> = ({ onShowToast, onNavigateScene }) => {
  const [selectedPlan, setSelectedPlan] = useState<'A' | 'B' | 'C'>('A');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isSimulatingMonteCarlo, setIsSimulatingMonteCarlo] = useState<boolean>(false);
  const [monteCarloRuns, setMonteCarloRuns] = useState<number>(10000);
  const [monteCarloSuccess, setMonteCarloSuccess] = useState<number>(62.4);

  const planCardRefA = useRef<HTMLDivElement>(null);
  const planCardRefB = useRef<HTMLDivElement>(null);
  const planCardRefC = useRef<HTMLDivElement>(null);

  // Plan select with GSAP tactile bounce
  const handleSelectPlan = (plan: 'A' | 'B' | 'C') => {
    setSelectedPlan(plan);
    sound.playClick(plan === 'A' ? 1400 : plan === 'B' ? 1100 : 800, 0.05);

    const ref = plan === 'A' ? planCardRefA : plan === 'B' ? planCardRefB : planCardRefC;
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { scale: 0.98 },
        { scale: 1, duration: 0.25, ease: 'back.out(2)' }
      );
    }
  };

  // Run Monte Carlo Trajectory Simulation
  const handleRunMonteCarlo = () => {
    if (isSimulatingMonteCarlo) return;
    setIsSimulatingMonteCarlo(true);
    sound.playTargetLock();
    onShowToast('Executing 10,000 Monte Carlo Orbital Insertion Trajectories...');

    const simObj = { runs: 0, pct: 0 };
    const targetPct = selectedPlan === 'A' ? 62.4 : selectedPlan === 'B' ? 31.8 : 14.1;

    gsap.to(simObj, {
      runs: 10000,
      pct: targetPct,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => {
        setMonteCarloRuns(Math.round(simObj.runs));
        setMonteCarloSuccess(parseFloat(simObj.pct.toFixed(1)));
      },
      onComplete: () => {
        sound.playSuccess();
        setIsSimulatingMonteCarlo(false);
        onShowToast(`Simulation Complete: ${targetPct}% Optimal Window Calculated`);
      },
    });
  };

  const handleCommitBurn = () => {
    sound.playThrust(1.2);
    if (selectedPlan === 'A') {
      onShowToast('42-Second Lunar Prograde Burn Programmed into Navigation Guidance Computer!');
    } else if (selectedPlan === 'B') {
      onShowToast('Hyperbolic Intercept Coordinates Locked on Comet Vukov-7!');
    } else {
      onShowToast('Cryogenic Hibernation Induction Staged: Pilot Vitals Regulated.');
    }
  };

  return (
    <div className="flex flex-col w-full text-[#e1e2ee] pb-8 px-4 space-y-3.5">
      {/* Alert Header */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="font-telemetry text-xs text-[#00f0ff] tracking-wider flex items-center gap-1.5 font-bold">
            <span className="material-symbols-outlined text-[15px]">satellite_alt</span>
            SYS.T+528:14:02 // DEEP SPACE DRIFT
          </span>
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#93000a]/60 border border-[#ffb4ab]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-ping"></span>
            <span className="font-telemetry text-[9px] text-[#ffdad6] uppercase font-bold tracking-widest">
              ALERT LEVEL 0
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[#ffb4ab] font-headline text-lg uppercase tracking-tight font-bold">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] animate-pulse">warning</span>
            Imminent System Collapse
          </span>
          <span className="font-telemetry text-xs text-[#b9cacb] font-normal">ESPERANZA-IX</span>
        </div>

        <p className="font-body text-xs text-[#b9cacb]">
          Food &amp; Water Depleted • Reaction Mass 6% • Transmissions Incinerated • Gorglith Swarm Encircling Earth
        </p>
      </div>

      {/* Cockpit Viewport Artwork Frame */}
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-2xl bg-[#0b0e16] border border-[#3b494b]/40">
        <img
          alt="Cockpit of Esperanza-IX looking towards ruined Earth and Moon with young pilot Billy clutching a vintage pocket compass"
          className="w-full h-full object-cover select-none pointer-events-none brightness-95 contrast-105"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKC679j9SurFzRYOpgzf9OA7HdWpNIXY8NVWb1wZkyxPy5zmx7wmWBmAXKkOPStnsVOBT6SsRiHPziqIKu_ZgYDuazxXTmf5FtHxDrOW3Oes6XxM5jhoJTTnW-yzWas3tiaxNT-GcFBFMTaoVfsKUr_Vzz-FUmeZn2L12qJ_-JmGO948kYIJP6BxkmuCTU3gw2TQI0gwCV7a2PfGxbJMHxoRIoFJ-kaAVwg9puniD0z8NyDyv66uSt"
        />

        {/* Tactical HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 bg-gradient-to-t from-[#0b0e16]/80 via-transparent to-[#0b0e16]/40">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-1.5 bg-[#0b0e16]/85 backdrop-blur-md px-2.5 py-1 rounded border border-[#ffb4ab]/30">
              <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-pulse"></span>
              <span className="font-telemetry text-[9px] text-[#ffdad6] font-bold">VITAL METRICS CRITICAL</span>
            </div>
            <div className="bg-[#0b0e16]/85 backdrop-blur-md px-2.5 py-1 rounded font-telemetry text-[11px] text-[#7df4ff] border border-[#00f0ff]/30">
              <span className="text-[#b9cacb]">RANGE TO LUNAR HORIZON:</span> 14,220 KM
            </div>
          </div>

          {/* Center Targeting Matrix */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-28 h-28 text-[#00f0ff]/40" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="0.5" />
              <line x1="50" y1="12" x2="50" y2="28" stroke="currentColor" strokeWidth="1" />
              <line x1="50" y1="72" x2="50" y2="88" stroke="currentColor" strokeWidth="1" />
              <line x1="12" y1="50" x2="28" y2="50" stroke="currentColor" strokeWidth="1" />
              <line x1="72" y1="50" x2="88" y2="50" stroke="currentColor" strokeWidth="1" />
              <circle cx="50" cy="50" r="2" fill="#00f0ff" />
            </svg>
          </div>

          <div className="flex items-center justify-between font-telemetry text-[9px] text-[#00f0ff]/80">
            <div className="flex items-center gap-1 bg-[#0b0e16]/85 backdrop-blur-md px-2 py-0.5 rounded border border-[#3b494b]/20">
              <span className="material-symbols-outlined text-[12px] text-[#ffd07c]">explore</span>
              <span>RCS GYRO: DRIFT LOCK</span>
            </div>
            <div className="flex items-center gap-1 bg-[#0b0e16]/85 backdrop-blur-md px-2 py-0.5 rounded text-[#ffb4ab] border border-[#93000a]/40">
              <span className="material-symbols-outlined text-[12px]">pest_control</span>
              <span>SWARM DENSITY: EXTREME</span>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry & Consumables Gauge Matrix (4 Cards) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="font-telemetry text-[10px] text-[#b9cacb] uppercase tracking-wider flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-[14px] text-[#ffb4ab]">monitor_heart</span>
            LIFE SUPPORT &amp; PROPULSION TELEMETRY
          </span>
          <span className="font-telemetry text-xs text-[#ffb4ab] animate-pulse font-bold">
            4 METRICS OUT OF TOLERANCE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Water */}
          <div className="bg-[#191b24] p-3 rounded-xl flex flex-col justify-between shadow-md border border-[#3b494b]/30">
            <div className="flex items-center justify-between">
              <span className="font-telemetry text-[9px] text-[#b9cacb] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#00f0ff]">water_drop</span>
                POTABLE WATER
              </span>
              <span className="font-telemetry text-xs text-[#ffb4ab] font-bold">4%</span>
            </div>
            <div className="my-1.5 flex flex-col gap-1">
              <div className="font-telemetry text-lg text-[#dbfcff] font-bold">0.42 L</div>
              <div className="w-full h-1.5 bg-[#0b0e16] rounded-full overflow-hidden">
                <div className="h-full bg-[#ffb4ab] w-[4%] rounded-full shadow-[0_0_8px_rgba(255,180,171,0.8)]"></div>
              </div>
            </div>
            <div className="font-telemetry text-[9px] text-[#ffb4ab] truncate flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[12px]">hourglass_bottom</span>
              6 HOURS REMAINING
            </div>
          </div>

          {/* Nutrition */}
          <div className="bg-[#191b24] p-3 rounded-xl flex flex-col justify-between shadow-md border border-[#3b494b]/30">
            <div className="flex items-center justify-between">
              <span className="font-telemetry text-[9px] text-[#b9cacb] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#ffd07c]">lunch_dining</span>
                NUTRITION
              </span>
              <span className="font-telemetry text-xs text-[#ffb4ab] font-bold">0%</span>
            </div>
            <div className="my-1.5 flex flex-col gap-1">
              <div className="font-telemetry text-lg text-[#ffd07c] font-bold">0 UNITS</div>
              <div className="w-full h-1.5 bg-[#0b0e16] rounded-full overflow-hidden">
                <div className="h-full bg-[#ffb4ab] w-0 rounded-full"></div>
              </div>
            </div>
            <div className="font-telemetry text-[9px] text-[#ffd07c] truncate flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[12px] animate-pulse">timer</span>
              STARVATION: 36H
            </div>
          </div>

          {/* Delta-V */}
          <div className="bg-[#191b24] p-3 rounded-xl flex flex-col justify-between shadow-md border border-[#3b494b]/30">
            <div className="flex items-center justify-between">
              <span className="font-telemetry text-[9px] text-[#b9cacb] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#00f0ff]">rocket</span>
                DELTA-V
              </span>
              <span className="font-telemetry text-xs text-[#00f0ff] font-bold">6.2%</span>
            </div>
            <div className="my-1.5 flex flex-col gap-1">
              <div className="font-telemetry text-lg text-[#00f0ff] font-bold">84 m/s</div>
              <div className="w-full h-1.5 bg-[#0b0e16] rounded-full overflow-hidden">
                <div className="h-full bg-[#00f0ff] w-[6.2%] rounded-full shadow-[0_0_8px_rgba(0,240,255,0.7)]"></div>
              </div>
            </div>
            <div className="font-telemetry text-[9px] text-[#ffb4ab] truncate flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[12px]">electric_meter</span>
              1 BURN REMAINING
            </div>
          </div>

          {/* Cabin O2 */}
          <div className="bg-[#191b24] p-3 rounded-xl flex flex-col justify-between shadow-md border border-[#3b494b]/30">
            <div className="flex items-center justify-between">
              <span className="font-telemetry text-[9px] text-[#b9cacb] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#ffd07c]">air</span>
                CABIN O2 / CO2
              </span>
              <span className="font-telemetry text-xs text-[#ffd07c] font-bold">CRIT</span>
            </div>
            <div className="my-1.5 flex flex-col gap-1">
              <div className="font-telemetry text-lg text-[#e1e2ee] font-bold">19.4% O2</div>
              <div className="w-full h-1.5 bg-[#0b0e16] rounded-full overflow-hidden">
                <div className="h-full bg-[#ffd07c] w-[88%] rounded-full"></div>
              </div>
            </div>
            <div className="font-telemetry text-[9px] text-[#b9cacb] truncate flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px] text-[#ffd07c]">cloud_alert</span>
              SCRUBBER SAT: 88%
            </div>
          </div>
        </div>
      </div>

      {/* Billy's Drift Log */}
      <div className="bg-[#191b24] rounded-xl p-4 shadow-lg flex flex-col gap-2.5 border border-[#3b494b]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#272a33] flex items-center justify-center text-[#00f0ff]">
              <span className="material-symbols-outlined text-[18px]">mic</span>
            </div>
            <div className="flex flex-col">
              <span className="font-telemetry text-xs text-[#00f0ff] font-bold">BILLY'S DRIFT LOG // DAY 22</span>
              <span className="font-telemetry text-[9px] text-[#849495]">COMM FREQ: 1420.45 MHz (OFFLINE)</span>
            </div>
          </div>
          <span className="font-telemetry text-xs text-[#ffd07c] font-bold">0:38</span>
        </div>

        {/* Audio Waveform Graphic with Interactive Play Control */}
        <div className="bg-[#0b0e16] rounded-lg p-2 flex items-center gap-2 border border-[#3b494b]/20">
          <button
            onClick={() => {
              setIsAudioPlaying(!isAudioPlaying);
              sound.playClick(isAudioPlaying ? 700 : 1300, 0.04);
            }}
            className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center active:scale-95 transition-all shadow-[0_0_12px_rgba(0,240,255,0.4)] ${
              isAudioPlaying ? 'bg-[#ffd07c] text-[#412d00]' : 'bg-[#00f0ff] text-[#00363a]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isAudioPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          <div className="flex-1 flex items-center justify-between h-7 px-1 gap-[2px]">
            {[2, 3, 5, 6, 4, 2, 3, 6, 7, 5, 2, 3, 4, 5, 2, 3, 6, 4, 2].map((h, i) => (
              <div
                key={i}
                style={{ height: `${isAudioPlaying ? Math.floor(Math.random() * 18) + 4 : h * 3}px` }}
                className="w-1 bg-[#00f0ff] rounded-full transition-all duration-150"
              ></div>
            ))}
          </div>

          <span className="font-telemetry text-xs text-[#00dbe9] px-1 font-bold">REC-04</span>
        </div>

        {/* Monologue */}
        <div className="relative bg-[#272a33]/60 rounded-lg p-3 border border-[#3b494b]/20">
          <p className="font-body text-xs text-[#e1e2ee] leading-relaxed italic">
            “Gemini's failsafe worked... the mail burned before the Gorglith could read Pete's coordinates. But now I'm stranded past lunar orbit. The condenser is coughing dust, my stomach's eating itself, and I've only got enough fuel for one single burn. I can't go back to Earth—the leviathans own the sky. Pete told me once about the derelict Sol-Gen hydroponic station docked at Lagrange Point 2. If I sling past the Moon's gravity well, I might coast to it on fumes...”
          </p>
        </div>
      </div>

      {/* Tactical Contingency Paths (The Crucial Dilemma) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#00f0ff]">route</span>
            <span className="font-telemetry text-xs text-[#e1e2ee] uppercase tracking-wider font-bold">
              TACTICAL CONTINGENCY PATHS
            </span>
          </div>
          <span className="font-telemetry text-[10px] text-[#b9cacb] font-bold">CHOOSE 1 ROUTE</span>
        </div>

        {/* Plan A */}
        <div
          ref={planCardRefA}
          onClick={() => handleSelectPlan('A')}
          className={`cursor-pointer rounded-xl p-4 transition-all duration-200 active:scale-[0.99] flex flex-col gap-2 border ${
            selectedPlan === 'A'
              ? 'bg-[#191b24] border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.25)]'
              : 'bg-[#1d1f28]/70 border-[#3b494b]/30 opacity-75 hover:opacity-100'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_6px_rgba(0,240,255,0.8)]"></span>
                <span className="font-telemetry text-xs text-[#00f0ff] font-bold">
                  PLAN A // LUNAR SLINGSHOT → L2 STATION
                </span>
              </div>
              <span className="font-headline text-base text-[#dbfcff] font-bold mt-0.5">Sol-Gen Ceres-IV Hub</span>
            </div>
            <div className="px-2.5 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] font-telemetry text-[10px] font-bold border border-[#00f0ff]/30">
              62% SURVIVAL
            </div>
          </div>
          <p className="font-body text-xs text-[#b9cacb] leading-relaxed">
            Free-return orbital trajectory around lunar farside. Requires exact 42-second prograde burn (costs 5.8% delta-v). Target: Derelict UN Sol-Gen Hydroponics Hub 'Ceres-IV' for emergency water filters and preserved nutrient paste.
          </p>
          <div className="p-2 rounded bg-[#0b0e16]/80 flex items-center justify-between font-telemetry text-[10px] border border-[#3b494b]/20">
            <span className="text-[#ffb4ab] flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[14px]">crisis_alert</span>
              RISK: GORGLITH PICKET SPORES IN LUNAR SHADOW
            </span>
            <span className="text-[#00f0ff] font-bold">BURN: 42s</span>
          </div>
        </div>

        {/* Plan B */}
        <div
          ref={planCardRefB}
          onClick={() => handleSelectPlan('B')}
          className={`cursor-pointer rounded-xl p-4 transition-all duration-200 active:scale-[0.99] flex flex-col gap-2 border ${
            selectedPlan === 'B'
              ? 'bg-[#191b24] border-[#ffd07c] shadow-[0_0_20px_rgba(255,208,124,0.25)]'
              : 'bg-[#1d1f28]/70 border-[#3b494b]/30 opacity-75 hover:opacity-100'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ffd07c]"></span>
                <span className="font-telemetry text-xs text-[#ffd07c] font-bold">
                  PLAN B // ICE-HARVEST DIVE ON COMET 'VUKOV-7'
                </span>
              </div>
              <span className="font-headline text-base text-[#ffdea7] font-bold mt-0.5">Hyperbolic Intercept</span>
            </div>
            <div className="px-2.5 py-0.5 rounded-full bg-[#f3af00]/20 text-[#ffd07c] font-telemetry text-[10px] font-bold border border-[#ffd07c]/30">
              31% SURVIVAL
            </div>
          </div>
          <p className="font-body text-xs text-[#b9cacb] leading-relaxed">
            Intercept a volatile methane-water ice chunk drifting along hyperbolic trajectory. Extract 50L ice slush using Esperanza's manual RCS grapple.
          </p>
          <div className="p-2 rounded bg-[#0b0e16]/80 flex items-center justify-between font-telemetry text-[10px] border border-[#3b494b]/20">
            <span className="text-[#ffb4ab] flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              RISK: HIGH-VELOCITY IMPACT; NO FOOD RATIONS
            </span>
            <span className="text-[#ffd07c] font-bold">BURN: 6.0% ΔV</span>
          </div>
        </div>

        {/* Plan C */}
        <div
          ref={planCardRefC}
          onClick={() => handleSelectPlan('C')}
          className={`cursor-pointer rounded-xl p-4 transition-all duration-200 active:scale-[0.99] flex flex-col gap-2 border ${
            selectedPlan === 'C'
              ? 'bg-[#191b24] border-[#ffb4ab] shadow-[0_0_20px_rgba(255,180,171,0.25)]'
              : 'bg-[#1d1f28]/70 border-[#3b494b]/30 opacity-75 hover:opacity-100'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span>
                <span className="font-telemetry text-xs text-[#ffb4ab] font-bold">
                  PLAN C // CRYOGENIC HYBERNATION PROTOCOL
                </span>
              </div>
              <span className="font-headline text-base text-[#ffb4ab] font-bold mt-0.5">Surrender To Void</span>
            </div>
            <div className="px-2.5 py-0.5 rounded-full bg-[#93000a]/40 text-[#ffdad6] font-telemetry text-[10px] font-bold border border-[#ffb4ab]/30">
              14% SURVIVAL
            </div>
          </div>
          <p className="font-body text-xs text-[#b9cacb] leading-relaxed">
            Vent cabin heat and enter low-metabolic hypothermia in pilot suit; broadcast repeating encrypted distress beacon.
          </p>
          <div className="p-2 rounded bg-[#0b0e16]/80 flex items-center justify-between font-telemetry text-[10px] border border-[#3b494b]/20">
            <span className="text-[#ffb4ab] flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[14px]">sensors_off</span>
              RISK: 94% GORGLITH SWEEP PROBABILITY; 12D BATTERY
            </span>
            <span className="text-[#ffb4ab] font-bold">BURN: 0.0%</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          onClick={handleCommitBurn}
          className={`w-full py-3.5 px-4 rounded-xl font-telemetry text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg ${
            selectedPlan === 'A'
              ? 'bg-[#00f0ff] text-[#00363a] shadow-[0_0_24px_rgba(0,240,255,0.45)] hover:bg-[#7df4ff]'
              : selectedPlan === 'B'
              ? 'bg-[#f3af00] text-[#412d00] shadow-[0_0_24px_rgba(243,175,0,0.45)] hover:bg-[#ffd07c]'
              : 'bg-[#ffb4ab] text-[#690005] shadow-[0_0_24px_rgba(255,180,171,0.45)]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
          <span>
            {selectedPlan === 'A'
              ? 'LOCK COORDINATES: LUNAR SLINGSHOT TO L2'
              : selectedPlan === 'B'
              ? 'COMMIT TO VUKOV-7 COMET INTERCEPT'
              : 'INITIATE CRYOGENIC HYBERNATION INDUCTION'}
          </span>
        </button>

        <button
          onClick={handleRunMonteCarlo}
          disabled={isSimulatingMonteCarlo}
          className="w-full py-2.5 px-4 rounded-lg bg-[#272a33] hover:bg-[#363943] text-[#00f0ff] font-telemetry text-xs font-semibold flex items-center justify-center gap-2 border border-[#3b494b]/30 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isSimulatingMonteCarlo ? 'sync' : 'calculate'}
          </span>
          <span>
            RUN MONTE CARLO TRAJECTORY CALCULATION ({monteCarloRuns.toLocaleString()} RUNS: {monteCarloSuccess}% SUCCESS)
          </span>
        </button>
      </div>

      {/* Chapter Stepper Bottom Link */}
      <div className="flex items-center justify-between pt-2 pb-2 text-[#b9cacb] font-telemetry text-xs">
        <button
          onClick={() => onNavigateScene && onNavigateScene('comms')}
          className="flex items-center gap-1 hover:text-[#00f0ff] transition-colors py-2 active:scale-95"
        >
          <span className="material-symbols-outlined text-[14px]">arrow_back</span>
          <span>SCENE 3: STEGANO-MAIL DISPATCH</span>
        </button>
        <button
          onClick={() => onNavigateScene && onNavigateScene('finale')}
          className="flex items-center gap-1 text-[#00f0ff] hover:text-[#7df4ff] transition-colors py-2 active:scale-95 font-bold"
        >
          <span>SCENE 5: SEASON FINALE CLIFFHANGER</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
