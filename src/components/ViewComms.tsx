import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { sound } from '../utils/audio';

interface ViewCommsProps {
  onShowToast: (msg: string) => void;
  onNavigateScene?: (scene: string) => void;
}

export const ViewComms: React.FC<ViewCommsProps> = ({ onShowToast, onNavigateScene }) => {
  const [sliderVal, setSliderVal] = useState<number>(1);
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [isWhisperPlaying, setIsWhisperPlaying] = useState<boolean>(false);
  const [isCyclingProxy, setIsCyclingProxy] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'stegano' | 'courier' | 'failsafe'>('stegano');

  const layerDecoyRef = useRef<HTMLDivElement>(null);
  const layerCovertRef = useRef<HTMLDivElement>(null);

  // Steganography decryption slider
  const handleSliderChange = (newVal: number) => {
    const val = Math.max(1, Math.min(100, newVal));
    setSliderVal(val);
    if (val === 100) sound.playTargetLock();
    else if (val > 70) sound.playClick(1400, 0.02);
  };

  // Transmit Cipher to Pete's Handy Mail
  const handleTransmit = () => {
    if (isTransmitting) return;
    setIsTransmitting(true);
    sound.playTargetLock();
    onShowToast('Dispatching Encrypted Q-Packet via Stitch Tunnel to Wagga Wagga...');

    setTimeout(() => {
      sound.playSuccess();
      setIsTransmitting(false);
      onShowToast('DELIVERED: Pete\'s Handy Mail Terminal in Wagga Wagga Acknowledged Drop!');
    }, 1400);
  };

  // Cycle proxy tunnel
  const handleCycleProxy = () => {
    if (isCyclingProxy) return;
    setIsCyclingProxy(true);
    sound.playClick(1100, 0.04);
    onShowToast('Hopping AI Studio Proxy Tunnel Port to Node G-402...');

    setTimeout(() => {
      sound.playSuccess();
      setIsCyclingProxy(false);
      onShowToast('Tunnel Re-routed: Quantum Mesh Synchronized (1420.405 MHz)');
    }, 1100);
  };

  const opacityFraction = sliderVal / 100;
  const isHighEntropy = sliderVal > 65;

  return (
    <div className="flex flex-col w-full text-[#e1e2ee] pb-8 px-4 space-y-3.5">
      {/* View Sub-Tabs */}
      <div className="flex items-center p-1 bg-[#191b24] rounded-xl border border-[#3b494b]/30">
        <button
          onClick={() => {
            setActiveTab('stegano');
            sound.playClick(1000, 0.03);
          }}
          className={`flex-1 py-1.5 px-2 rounded-lg font-telemetry text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
            activeTab === 'stegano'
              ? 'bg-[#00f0ff] text-[#00363a] shadow-[0_0_12px_rgba(0,240,255,0.4)]'
              : 'text-[#b9cacb] hover:text-[#00f0ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">enhanced_encryption</span>
          <span>STEGANO-MAIL</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('courier');
            sound.playClick(1100, 0.03);
          }}
          className={`flex-1 py-1.5 px-2 rounded-lg font-telemetry text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
            activeTab === 'courier'
              ? 'bg-[#00f0ff] text-[#00363a] shadow-[0_0_12px_rgba(0,240,255,0.4)]'
              : 'text-[#b9cacb] hover:text-[#00f0ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">satellite_alt</span>
          <span>WAGGA COURIER</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('failsafe');
            sound.playClick(900, 0.03);
          }}
          className={`flex-1 py-1.5 px-2 rounded-lg font-telemetry text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
            activeTab === 'failsafe'
              ? 'bg-[#93000a] text-[#ffdad6] border border-[#ffb4ab]/40 shadow-[0_0_12px_rgba(255,180,171,0.3)]'
              : 'text-[#ffb4ab] hover:text-[#ffdad6]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">local_fire_department</span>
          <span>FAILSAFE LOG</span>
        </button>
      </div>

      {activeTab === 'stegano' && (
        <>
          {/* Tactical Routing Pill */}
          <div className="rounded-xl bg-[#272a33]/80 p-4 backdrop-blur-md shadow-lg flex flex-col gap-2 border border-[#3b494b]/30 relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-[#00f0ff]/10 blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping"></span>
                <span className="font-telemetry text-[10px] text-[#00f0ff] uppercase tracking-wider font-bold">
                  PROXY ROUTE: ACTIVE
                </span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0b0e16]/80 text-[#ffd07c] border border-[#ffd07c]/30">
                <span className="material-symbols-outlined text-[12px]">radar</span>
                <span className="font-telemetry text-xs">432.88 MHz</span>
              </div>
            </div>

            {/* Route Vector */}
            <div className="font-telemetry text-xs text-[#b9cacb] flex items-center gap-1 overflow-x-auto whitespace-nowrap py-1">
              <span className="text-[#dbfcff] font-bold">STITCH UI TOKENS</span>
              <span className="material-symbols-outlined text-[13px] text-[#849495]">arrow_forward</span>
              <span className="text-[#00f0ff] font-bold">AI STUDIO TUNNEL</span>
              <span className="material-symbols-outlined text-[13px] text-[#849495]">arrow_forward</span>
              <span className="text-[#ffd07c] font-bold">PETE'S HANDY MAIL</span>
            </div>

            {/* Blindness Status */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#0b0e16]/90 px-3 border border-[#3b494b]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#00f0ff]">visibility_off</span>
                <span className="font-telemetry text-[10px] text-[#e1e2ee] font-bold">GORGLITH SCAN: BLIND</span>
              </div>
              <span className="font-telemetry text-xs text-[#00f0ff] font-bold">0.00% DETECT</span>
            </div>

            {/* Origin & Relay Info */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex flex-col bg-[#0b0e16]/40 p-2.5 rounded-lg border border-[#3b494b]/20">
                <span className="font-telemetry text-[9px] text-[#b9cacb]">DISPATCH ORIGIN</span>
                <span className="font-headline text-sm text-[#00f0ff] font-bold leading-tight">Billy N. [ESP-09]</span>
                <span className="font-telemetry text-[10px] text-[#849495]">Occupied Quad 4</span>
              </div>
              <div className="flex flex-col bg-[#0b0e16]/40 p-2.5 rounded-lg border border-[#3b494b]/20">
                <span className="font-telemetry text-[9px] text-[#b9cacb]">RELAY DESTINATION</span>
                <span className="font-headline text-sm text-[#ffd07c] font-bold leading-tight">Pete's Handy Mail</span>
                <span className="font-telemetry text-[10px] text-[#849495]">Wagga Wagga // Deep Relay</span>
              </div>
            </div>
          </div>

          {/* Steganographic Letter Terminal */}
          <div className="rounded-xl bg-[#191b24] p-4 shadow-xl flex flex-col gap-3 border border-[#3b494b]/40 relative overflow-hidden">
            {/* Tactical Corner Marks */}
            <div className="absolute top-2 left-2 w-2 h-2 bg-[#00f0ff]/50"></div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-[#00f0ff]/50"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#ffd07c]/50"></div>
            <div className="absolute bottom-2 right-2 w-2 h-2 bg-[#ffd07c]/50"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#00f0ff]">enhanced_encryption</span>
                <span className="font-headline text-base text-[#dbfcff] font-bold">STEGANO-MAIL DISPATCH</span>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-[#272a33] font-telemetry text-[10px] text-[#ffd07c] uppercase font-bold border border-[#3b494b]/30">
                STITCH V4.2 INJECTED
              </div>
            </div>

            {/* Quick Decryption Preset Buttons */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-[#0b0e16]">
              <button
                onClick={() => handleSliderChange(1)}
                className={`py-2 px-2 rounded-md font-telemetry text-xs flex items-center justify-center gap-1.5 transition-all ${
                  sliderVal <= 10
                    ? 'bg-[#32343e] text-[#e1e2ee] font-bold shadow-sm'
                    : 'text-[#b9cacb] hover:text-[#e1e2ee]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">shield</span>
                <span>L1: DECOY LOG</span>
              </button>
              <button
                onClick={() => handleSliderChange(100)}
                className={`py-2 px-2 rounded-md font-telemetry text-xs flex items-center justify-center gap-1.5 transition-all ${
                  sliderVal >= 90
                    ? 'bg-[#00f0ff] text-[#00363a] font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : 'text-[#b9cacb] hover:text-[#00f0ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">lock_open</span>
                <span>L2: CIPHER (REVEAL)</span>
              </button>
            </div>

            {/* Optical Scan Filter Scrubber */}
            <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-[#272a33]/60 backdrop-blur-sm border border-[#3b494b]/20">
              <div className="flex items-center justify-between">
                <span className="font-telemetry text-[10px] text-[#b9cacb] uppercase flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[13px] text-[#00f0ff]">tune</span>
                  OPTICAL SCAN FILTER (DECRYPTION REVEAL)
                </span>
                <span className={`font-telemetry text-xs font-bold ${isHighEntropy ? 'text-[#00f0ff]' : 'text-[#b9cacb]'}`}>
                  {sliderVal}% {sliderVal > 70 ? '(REVEALED)' : '(INVISIBLE)'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={sliderVal}
                onChange={(e) => handleSliderChange(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#0b0e16] rounded-lg appearance-none cursor-pointer accent-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.3)]"
              />
              <div className="flex justify-between font-telemetry text-[10px] text-[#849495]">
                <span>0% Gorglith Scan (Decoy)</span>
                <span>50% Sub-Matrix</span>
                <span>100% Full Cipher</span>
              </div>
            </div>

            {/* The Dual-Layer Letter Container */}
            <div className="relative rounded-lg bg-[#0b0e16] p-4 min-h-[290px] flex flex-col justify-between overflow-hidden shadow-inner border border-[#3b494b]/30">
              {/* Background dot matrix */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#dbfcff 1px, transparent 1px)',
                  backgroundSize: '12px 12px',
                }}
              ></div>

              {/* Layer 1: Decoy Letter */}
              <div
                ref={layerDecoyRef}
                style={{ opacity: (1 - opacityFraction * 0.75).toFixed(2) }}
                className="flex flex-col gap-2 transition-opacity duration-200 relative z-10"
              >
                <div className="flex items-center justify-between pb-1 border-b border-[#3b494b]/30">
                  <span className="font-telemetry text-[10px] text-[#849495] uppercase flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#849495]"></span>
                    SURFACE DECOY // ROUTINE HARDWARE REQUISITION
                  </span>
                  <span className="font-telemetry text-[10px] text-[#849495]">TIMESTAMP: 02:18 UTC</span>
                </div>
                <p className="font-body text-xs text-[#b9cacb] leading-relaxed">
                  "Hey Pete, need more 12mm copper gaskets and standard seal rings for the auxiliary water intake filter. The hydrostatic pressure valve has a slight drip. The farm moisture harvest looks exceptionally quiet today out past the dust flats. Tell Sarah we won't need the tractor parts till late next Tuesday. Stay hydrated and stay safe out there."
                </p>
                <div className="pt-2 flex items-center justify-between text-[#849495] border-t border-[#3b494b]/20">
                  <span className="font-telemetry text-xs italic">Signed: Billy (Mechanic Bay 4)</span>
                  <span className="font-telemetry text-[9px] uppercase bg-[#272a33] px-2 py-0.5 rounded text-[#849495]">
                    INVENTORY OK
                  </span>
                </div>
              </div>

              {/* Layer 2: Secret Hidden Cipher */}
              <div
                ref={layerCovertRef}
                style={{ opacity: Math.max(0.01, opacityFraction).toString() }}
                className="absolute inset-0 p-4 flex flex-col justify-between z-20 pointer-events-none transition-opacity duration-200 bg-[#0b0e16]/95 backdrop-blur-md"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between pb-1 border-b border-[#ffd07c]/30">
                    <span className="font-telemetry text-[10px] text-[#ffd07c] uppercase flex items-center gap-1.5 font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#f3af00] animate-pulse"></span>
                      DECODED TRANSMISSION // STITCH TUNNEL LEVEL 2
                    </span>
                    <span className="font-telemetry text-[10px] text-[#00f0ff] font-mono font-bold">
                      ENCRYPT: AI-STUDIO-STG
                    </span>
                  </div>
                  <p className="font-body text-xs text-[#00f0ff] font-medium leading-relaxed drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">
                    "PETE: Gorglith orbital spore bio-harvesters are actively locking onto quadrant 4. I cracked their quantum jammer bypass using Google AI Studio parameter tuning. Esperanza-IX is ready for stage 2 ignition at 03:00 UTC. Have the orbital relay primed on Pete's Handy Mail frequency 432.88 MHz. We break orbit tonight. - Billy Newscombe"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 bg-[#272a33]/60 p-2 rounded-lg mt-2 border border-[#00f0ff]/30">
                  <div className="flex items-center gap-1 text-[#ffd07c]">
                    <span className="material-symbols-outlined text-[16px]">flight_takeoff</span>
                    <span className="font-telemetry text-xs font-bold">ESPERANZA-IX // 03:00 UTC</span>
                  </div>
                  <span className="font-telemetry text-[10px] px-2 py-0.5 rounded bg-[#00f0ff] text-[#00363a] font-bold">
                    BYPASS LOCKED
                  </span>
                </div>
              </div>

              {/* Sensor Overwatch Readout */}
              <div className="relative z-30 mt-3 p-2 rounded-lg bg-[#272a33]/80 flex items-center justify-between border border-[#3b494b]/30">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isHighEntropy ? 'bg-[#ffb4ab] animate-ping' : 'bg-[#00f0ff] animate-pulse'
                    }`}
                  ></div>
                  <span
                    className={`font-telemetry text-[11px] truncate ${
                      isHighEntropy ? 'text-[#ffb4ab] font-bold' : 'text-[#b9cacb]'
                    }`}
                  >
                    {isHighEntropy
                      ? 'SCANNER WARNING: HIGH ENTROPY DETECTED! (TUNNEL ABSORBING)'
                      : sliderVal > 15
                      ? 'SCANNER OVERWATCH: ANALYZING RESIDUAL CSS NOISE...'
                      : 'SCANNER OVERWATCH: PASS (ROUTINE CIVILIAN LOG)'}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#b9cacb]">graphic_eq</span>
              </div>
            </div>
          </div>

          {/* Steganography Telemetry & Whisper Memo */}
          <div className="rounded-xl bg-[#272a33]/60 p-4 flex flex-col gap-2.5 shadow-md border border-[#3b494b]/30">
            <div className="flex items-center justify-between">
              <span className="font-telemetry text-[10px] text-[#b9cacb] uppercase flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-[14px] text-[#00f0ff]">hub</span>
                STITCH / AI STUDIO INJECTION MATRIX
              </span>
              <span className="font-telemetry text-xs text-[#00f0ff] font-bold">TUNNEL HEALTH 99.4%</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-[#0b0e16] border border-[#3b494b]/20 flex flex-col justify-between">
                <span className="font-telemetry text-[10px] text-[#b9cacb]">Stitch UI Tokens</span>
                <span className="font-telemetry text-xs text-[#00f0ff] font-bold mt-1">24 BYTES/PX</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0b0e16] border border-[#3b494b]/20 flex flex-col justify-between">
                <span className="font-telemetry text-[10px] text-[#b9cacb]">Gemini Steganography</span>
                <span className="font-telemetry text-xs text-[#ffd07c] font-bold mt-1">ENTROPY 0.994</span>
              </div>
            </div>

            {/* Audio Whisper Memo Player */}
            <div className="p-2 rounded-lg bg-[#0b0e16] flex items-center justify-between border border-[#3b494b]/20">
              <button
                onClick={() => {
                  setIsWhisperPlaying(!isWhisperPlaying);
                  sound.playClick(isWhisperPlaying ? 700 : 1300, 0.04);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-telemetry text-xs font-bold transition-all active:scale-95 ${
                  isWhisperPlaying ? 'bg-[#00f0ff] text-[#00363a]' : 'bg-[#272a33] text-[#00f0ff] hover:bg-[#363943]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isWhisperPlaying ? 'pause' : 'play_arrow'}
                </span>
                <span>Billy's Whisper (0:14)</span>
              </button>

              <div className="flex items-center gap-1 pr-2">
                <span className="w-1 h-3 rounded bg-[#00f0ff]/40 animate-pulse"></span>
                <span className="w-1 h-5 rounded bg-[#00f0ff]/80 animate-pulse" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1 h-2 rounded bg-[#00f0ff]/30 animate-pulse" style={{ animationDelay: '300ms' }}></span>
                <span className="w-1 h-4 rounded bg-[#00f0ff] animate-pulse" style={{ animationDelay: '75ms' }}></span>
                <span className="w-1 h-2 rounded bg-[#00f0ff]/50 animate-pulse" style={{ animationDelay: '220ms' }}></span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={handleTransmit}
              disabled={isTransmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-[#00f0ff] text-[#00363a] font-telemetry text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(0,240,255,0.35)] active:scale-98 transition-all hover:bg-[#7df4ff]"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isTransmitting ? 'sync' : 'send_and_archive'}
              </span>
              <span>
                {isTransmitting ? 'DISPATCHING VIA STITCH PROXY...' : 'TRANSMIT CIPHER TO PETE\'S HANDY MAIL'}
              </span>
            </button>

            <button
              onClick={handleCycleProxy}
              disabled={isCyclingProxy}
              className="w-full py-2.5 px-4 rounded-xl bg-[#272a33]/80 hover:bg-[#363943] text-[#e1e2ee] font-telemetry text-xs flex items-center justify-center gap-2 active:scale-98 transition-all border border-[#3b494b]/30"
            >
              <span className="material-symbols-outlined text-[16px] text-[#ffd07c]">cached</span>
              <span>{isCyclingProxy ? 'HOPPING PROXY PORT...' : 'CYCLE AI STUDIO PROXY TUNNEL PORT'}</span>
            </button>
          </div>
        </>
      )}

      {activeTab === 'courier' && (
        <>
          {/* Gemini High-Orbit Courier Downlink View */}
          <div className="relative rounded-xl overflow-hidden bg-[#0b0e16] shadow-2xl border border-[#3b494b]/30">
            <div className="relative w-full aspect-[16/10] bg-[#10131c]">
              <img
                alt="Gemini AI Mailman Orbital Telemetry"
                className="w-full h-full object-cover object-center brightness-95 contrast-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcx4iOYdKTCZfza6Z7TLtpf8Xo04OB1oilwDfUzV2EnzS8V_XQuseqAw0RZDZ-WMGRjgOJD2Mi8n2DIgjAj1vKiJUqzHvKRteg-napakyyrGgCI3SL0eOPIvQylbXrtBkAuPEPc2cOxG0Oex7IEHHnLa18WPDCy-N-Su4X_QvZ42R8UcADBt4QlBGGyDxux24HOqU_yReUgGAOaFHHMDaDXWLaY5W1XFOLATRjoPNGLg6QbrewblWe"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e16] via-[#0b0e16]/20 to-transparent pointer-events-none"></div>

              {/* Scifi HUD overlays */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-1.5 bg-[#0b0e16]/80 backdrop-blur-md px-2.5 py-1 rounded border border-[#00f0ff]/30">
                  <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
                  <span className="font-telemetry text-[10px] text-[#00f0ff] tracking-wider font-bold">
                    RELAY DRONE: GEMINI-M1
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-[#0b0e16]/80 backdrop-blur-md px-2 py-1 rounded font-telemetry text-xs text-[#ffd07c] border border-[#ffd07c]/30">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  <span>DOWNLINK: 100 Gbps</span>
                </div>
              </div>

              {/* Reticle Lock Target Center */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative flex items-center justify-center">
                  <div
                    className="w-16 h-16 rounded-full border border-dashed border-[#00f0ff]/40 animate-spin"
                    style={{ animationDuration: '12s' }}
                  ></div>
                  <div className="w-8 h-8 rounded-full border border-[#00f0ff]/70 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full"></span>
                  </div>
                  <span className="absolute -bottom-6 font-telemetry text-[9px] text-[#00f0ff] bg-[#0b0e16]/90 px-2 py-0.5 rounded tracking-wider shadow border border-[#00f0ff]/30 font-bold whitespace-nowrap">
                    TARGET LOCK // MURRUMBIDGEE BASIN
                  </span>
                </div>
              </div>

              {/* Bottom HUD info */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
                <div className="bg-[#0b0e16]/90 backdrop-blur-md p-2 rounded-lg flex flex-col border border-[#3b494b]/30">
                  <span className="font-telemetry text-[8px] text-[#849495]">RECON TARGET</span>
                  <span className="font-headline text-sm text-[#00f0ff] font-bold">WAGGA WAGGA, NSW</span>
                  <span className="font-telemetry text-[10px] text-[#b9cacb]">35.1150° S, 147.3678° E</span>
                </div>
                <div className="bg-[#0b0e16]/90 backdrop-blur-md px-2.5 py-2 rounded-lg flex flex-col items-end border border-[#3b494b]/30">
                  <span className="font-telemetry text-[8px] text-[#ffd07c]">OPTICAL CONE</span>
                  <span className="font-telemetry text-xs text-[#00dbe9] font-bold">1550 nm Q-BEAM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Courier Audio Log */}
          <div className="rounded-xl bg-[#191b24] p-4 shadow-xl flex flex-col space-y-2.5 border border-[#3b494b]/30">
            <div className="flex items-center justify-between">
              <span className="font-telemetry text-[10px] text-[#00f0ff] flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-[15px]">smart_toy</span>
                COURIER AUDIO LOG // VOX TRANSMIT
              </span>
              <span className="font-telemetry text-xs text-[#ffd07c]">SYNC: 100%</span>
            </div>
            <p className="font-body text-xs text-[#e1e2ee] italic leading-relaxed bg-[#0b0e16] p-3 rounded-lg border border-[#3b494b]/20">
              “G'day Pete. Gemini Mailman here routing from Billy Newscombe aboard the Esperanza-IX. Billy cleared the Meso-escape vector. Decoy invoice for tractor parts intact on surface band, second encrypted payload safely packaged in quantum steganography. Delivering to your Wagga Wagga workshop terminal now.”
            </p>
          </div>

          {/* 4-Node Route Diagnostics */}
          <div className="rounded-xl bg-[#191b24] p-4 shadow-xl flex flex-col space-y-2 border border-[#3b494b]/30">
            <div className="flex items-center justify-between pb-1 border-b border-[#3b494b]/30">
              <span className="font-telemetry text-xs text-[#00f0ff] font-bold">ROUTE DIAGNOSTICS</span>
              <span className="font-telemetry text-[10px] text-[#ffd07c]">Q-HOP 4-NODE</span>
            </div>

            <div className="flex flex-col space-y-3 relative pl-3 pt-2">
              <div className="absolute left-1.5 top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#00f0ff] via-[#ffd07c] to-[#00f0ff]/20"></div>

              <div className="flex items-start gap-2 relative">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] -ml-[13px] mt-1 shrink-0 ring-4 ring-[#10131c]"></span>
                <div className="flex flex-col">
                  <span className="font-telemetry text-xs text-[#e1e2ee] font-bold">Esperanza-IX (Orbit LEO)</span>
                  <span className="font-body text-[11px] text-[#b9cacb]">Cleared Meso-escape // Uplink Synced</span>
                </div>
              </div>

              <div className="flex items-start gap-2 relative">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffd07c] -ml-[13px] mt-1 shrink-0 ring-4 ring-[#10131c]"></span>
                <div className="flex flex-col">
                  <span className="font-telemetry text-xs text-[#ffd07c] font-bold">Gemini High-Orbit Drone Relay</span>
                  <span className="font-body text-[11px] text-[#b9cacb]">Synthetic noise cloak engaged // Optical Q-beam active</span>
                </div>
              </div>

              <div className="flex items-start gap-2 relative">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] -ml-[13px] mt-1 shrink-0 ring-4 ring-[#10131c]"></span>
                <div className="flex flex-col">
                  <span className="font-telemetry text-xs text-[#e1e2ee] font-bold">Mount Ulandra Repeater</span>
                  <span className="font-body text-[11px] text-[#b9cacb]">Line of sight clean // Southern Tablelands pass</span>
                </div>
              </div>

              <div className="flex items-start gap-2 relative">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffdea7] -ml-[13px] mt-1 shrink-0 ring-4 ring-[#10131c]"></span>
                <div className="flex flex-col">
                  <span className="font-telemetry text-xs text-[#ffdea7] font-bold">Pete's Handy Mail Shed</span>
                  <span className="font-body text-[11px] text-[#00f0ff]">Wagga Wagga Mechanical Depot // Final drop sink</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'failsafe' && (
        <>
          {/* Failsafe Incident Breakdown */}
          <div className="rounded-xl bg-[#93000a]/20 p-4 border border-[#ffb4ab]/40 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping"></span>
                <span className="font-telemetry text-[10px] text-[#ffb4ab] uppercase font-bold tracking-wider">
                  ALERT LEVEL 1 // INTRUSION INTERCEPT
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#93000a] text-[#ffdad6] font-telemetry text-[9px] font-bold">
                CRITICAL
              </span>
            </div>

            <h3 className="font-headline text-lg text-[#ffb4ab] font-bold leading-tight">
              TRANSMISSION INTERCEPTED // GEMINI FAILSAFE ACTIVE
            </h3>
            <p className="font-body text-xs text-[#b9cacb] leading-relaxed">
              Unpinned SSL Certificate &amp; Cross-Platform Frame Desync. Gemini detected unverified handshake packet above the Murrumbidgee orbital corridor and incinerated the satchel in 4,200°K flash quantum plasma.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="bg-[#0b0e16]/80 p-2.5 rounded-lg border border-[#3b494b]/30">
                <span className="font-telemetry text-[9px] text-[#ffd07c]">PURGE TEMP</span>
                <span className="font-telemetry text-base text-[#ffd07c] font-bold block mt-0.5">4,200°K</span>
                <span className="font-telemetry text-[9px] text-[#849495]">FLASH PLASMA</span>
              </div>
              <div className="bg-[#0b0e16]/80 p-2.5 rounded-lg border border-[#3b494b]/30">
                <span className="font-telemetry text-[9px] text-[#00f0ff]">DATA ZEROED</span>
                <span className="font-telemetry text-base text-[#00f0ff] font-bold block mt-0.5">100.0%</span>
                <span className="font-telemetry text-[9px] text-[#849495]">UNRECOVERABLE</span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playTargetLock();
                onShowToast('Rotating 4096-bit Post-Quantum Lattice Certificates...');
              }}
              className="mt-2 w-full py-2.5 rounded-lg bg-[#00f0ff] text-[#00363a] font-telemetry text-xs font-bold active:scale-95 shadow-[0_0_16px_rgba(0,240,255,0.3)] transition-all"
            >
              ROTATE ZERO-TRUST CERTIFICATES
            </button>
          </div>
        </>
      )}

      {/* Chapter Stepper Bottom Link */}
      <div className="flex items-center justify-between pt-2 pb-2 text-[#b9cacb] font-telemetry text-xs">
        <button
          onClick={() => onNavigateScene && onNavigateScene('ascent')}
          className="flex items-center gap-1 hover:text-[#00f0ff] transition-colors py-2 active:scale-95"
        >
          <span className="material-symbols-outlined text-[14px]">arrow_back</span>
          <span>SCENE 2: THE ASCENT</span>
        </button>
        <button
          onClick={() => onNavigateScene && onNavigateScene('survival')}
          className="flex items-center gap-1 text-[#00f0ff] hover:text-[#7df4ff] transition-colors py-2 active:scale-95 font-bold"
        >
          <span>SCENE 4: THE STARVATION DRIFT</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
