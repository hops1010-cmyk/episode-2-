import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface ViewFinaleProps {
  onShowToast: (msg: string) => void;
  onNavigateScene?: (scene: string) => void;
}

export const ViewFinale: React.FC<ViewFinaleProps> = ({ onShowToast, onNavigateScene }) => {
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [userChoice, setUserChoice] = useState<'A' | 'B' | null>(null);
  const [votesA, setVotesA] = useState<number>(1645);
  const [votesB, setVotesB] = useState<number>(774);
  const [isAudioDecoding, setIsAudioDecoding] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  // Countdown timer state
  const [countdown, setCountdown] = useState({
    days: 14,
    hours: 8,
    minutes: 22,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalVotes = votesA + votesB;
  const pctA = Math.round((votesA / totalVotes) * 100);
  const pctB = 100 - pctA;

  // Poll Vote Handler
  const handleVote = (choice: 'A' | 'B') => {
    if (hasVoted) return;
    setHasVoted(true);
    setUserChoice(choice);
    sound.playTargetLock();

    if (choice === 'A') {
      setVotesA((prev) => prev + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#00f0ff', '#7df4ff', '#dbfcff'],
      });
      onShowToast('Canonical Vote Logged: Resistance Path Chosen!');
    } else {
      setVotesB((prev) => prev + 1);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#ffb4ab', '#93000a', '#ffd07c'],
      });
      onShowToast('Dark Cosmos Vote Logged: Hive-Mind Trajectory Projected.');
    }
  };

  // Toggle Audio Decoder
  const handleToggleAudio = () => {
    setIsAudioDecoding(!isAudioDecoding);
    if (!isAudioDecoding) {
      sound.playClick(1500, 0.05);
      onShowToast('Decoding Sub-Space Transmission Burst on CH-7...');
    } else {
      sound.playClick(800, 0.04);
    }
  };

  // Subscribe Toggle
  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    sound.playSuccess();
    onShowToast(
      isSubscribed
        ? 'Alert Preference Updated'
        : 'Priority Telemetry Beacon Armed: Season 2 Launch Alert Enabled!'
    );
  };

  return (
    <div className="flex flex-col w-full text-[#e1e2ee] pb-8 px-4 space-y-4">
      {/* Status Badge & Title */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#191b24] border border-[#00f0ff]/30 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f0ff]"></span>
            </span>
            <span className="font-telemetry text-[10px] text-[#00f0ff] uppercase tracking-widest font-bold">
              SEASON FINALE // PART 1 CLIFFHANGER
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#93000a]/50 border border-[#ffb4ab]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-pulse"></span>
            <span className="font-telemetry text-[10px] text-[#ffdad6] uppercase font-bold">CRITICAL DRIFT</span>
          </div>
        </div>

        <h1 className="font-headline text-3xl text-[#00f0ff] tracking-tight font-bold uppercase drop-shadow-[0_0_16px_rgba(0,240,255,0.35)] mt-1">
          END OF PART 1
        </h1>
        <p className="font-body text-xs text-[#b9cacb] leading-relaxed">
          Will Billy Newscombe recover to liberate Earth — or fall subject to the Gorglith's bio-synthetic enslavement?
        </p>
      </div>

      {/* Cinematic Cliffhanger Viewport */}
      <div className="relative w-full rounded-xl overflow-hidden bg-[#0b0e16] shadow-2xl border border-[#3b494b]/40">
        {/* Top HUD Telemetry */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-3 py-1.5 bg-[#0b0e16]/80 backdrop-blur-md border-b border-[#3b494b]/30">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#ffd07c]">satellite_alt</span>
            <span className="font-telemetry text-[10px] text-[#ffd07c] tracking-widest font-bold">
              TRANSMISSION FROZEN // ORBITAL HIATUS
            </span>
          </div>
          <span className="font-telemetry text-xs text-[#00f0ff]">SIG: 14.82 GHz</span>
        </div>

        {/* Visual Artwork */}
        <div className="relative aspect-[16/10] w-full">
          <img
            alt="Cinematic dramatic sci-fi season finale cliffhanger artwork. Split narrative visual composition in deep space."
            className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.08]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMsTx6AsTYyfjMDWaSrpaukMMFe9ZfMWb1pFTvzm-qqtFyQIeFFJEYxgr6YkmAQQJJA-2RB1rjza9FnRP1XsPBfoqU9Vvh_ZTk7L-GTz7VKNHluW32WR2jyEh0ru2Rm3-jyTRM0FMjSHiXYufzh_qVdWzsVygBxJJrkFiol0TZUhuHqulDt_8BRkGdCK9jDcdRdovD0U44IsXOKLghj0elsEygjJGDJHxKtU0BJBpEZJ34ACLk0aPP"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e16] via-transparent to-[#0b0e16]/60 pointer-events-none"></div>

          {/* Tactical HUD Corner Elements */}
          <div className="absolute top-8 left-3 z-20 pointer-events-none text-[#00f0ff] text-[9px] font-telemetry flex flex-col">
            <span>┌─ [SEC-09: LAGRANGE-2]</span>
            <span className="text-[8px] text-[#b9cacb]/70">RADAR LOCK: LOST</span>
          </div>
          <div className="absolute top-8 right-3 z-20 pointer-events-none text-[#ffb4ab] text-[9px] font-telemetry flex flex-col items-end">
            <span>[GORGLITH BIOMASS] ─┐</span>
            <span className="text-[8px] text-[#ffdad6]/70">PROXIMITY: 2,140 KM</span>
          </div>
          <div className="absolute bottom-2.5 left-3 z-20 pointer-events-none text-[#00f0ff]/70 text-[9px] font-telemetry">
            <span>└─ TELEMETRY PAUSED // HOPE: 48.2%</span>
          </div>
          <div className="absolute bottom-2.5 right-3 z-20 pointer-events-none text-[#ffd07c]/80 text-[9px] font-telemetry">
            <span>T-MINUS 14 DAYS TO EP 2 ─┘</span>
          </div>
        </div>
      </div>

      {/* Dual-Destiny Dossier */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">hub</span>
            <h2 className="font-headline text-base text-[#dbfcff] font-bold uppercase tracking-wide">
              DUAL-DESTINY DOSSIER
            </h2>
          </div>
          <span className="font-telemetry text-[10px] text-[#b9cacb]">BIFURCATION POINT</span>
        </div>

        <p className="font-body text-xs text-[#b9cacb]">
          Esperanza-IX is tumbling silently through the moon's shadow. Billy's oxygen scrubbers hold 42 minutes of breathable air. Two diverging timelines now govern the quadrant:
        </p>

        {/* Destiny Alpha Card */}
        <div className="p-4 rounded-xl bg-[#191b24] shadow-md border border-[#00f0ff]/30 relative overflow-hidden flex flex-col gap-2">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-[#00f0ff]/10 blur-xl pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>
              <span className="font-telemetry text-[10px] text-[#00f0ff] uppercase font-bold">DESTINY ALPHA</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-telemetry text-[10px] text-[#b9cacb]">ODDS</span>
              <span className="font-telemetry text-base text-[#00f0ff] font-bold">48.2%</span>
            </div>
          </div>

          <h3 className="font-headline text-base text-[#dbfcff] font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#00f0ff]">flare</span>
            RECOVERY &amp; RETRIBUTION
          </h3>

          <div className="px-2 py-0.5 rounded bg-[#0b0e16] border border-[#3b494b]/20 inline-block w-fit">
            <span className="font-telemetry text-[10px] text-[#00f0ff] font-bold">
              PATH OF THE HUMAN RESISTANCE
            </span>
          </div>

          <p className="font-body text-xs text-[#b9cacb] leading-relaxed">
            Billy navigates the grueling 42-second lunar slingshot burn on residual vapor fumes. Docking with the derelict Ceres-IV hydroponics station, he rehydrates and fires up Pete's improvised quantum mesh relay back to Wagga Wagga. Together, they invert Esperanza-IX's pulsed ion drive into an EMP lance primed against the Gorglith vanguard.
          </p>

          <div className="grid grid-cols-3 gap-2 bg-[#0b0e16] p-2 rounded-lg text-center border border-[#3b494b]/20">
            <div className="flex flex-col">
              <span className="font-telemetry text-[8px] text-[#849495]">BURN TIME</span>
              <span className="font-telemetry text-xs text-[#00f0ff] font-bold">42.4s</span>
            </div>
            <div className="flex flex-col">
              <span className="font-telemetry text-[8px] text-[#849495]">TARGET</span>
              <span className="font-telemetry text-xs text-[#00f0ff] font-bold">CERES-IV</span>
            </div>
            <div className="flex flex-col">
              <span className="font-telemetry text-[8px] text-[#849495]">WAGGA LINK</span>
              <span className="font-telemetry text-xs text-[#ffd07c] font-bold">PENDING</span>
            </div>
          </div>
        </div>

        {/* Destiny Omega Card */}
        <div className="p-4 rounded-xl bg-[#191b24] shadow-md border border-[#93000a]/50 relative overflow-hidden flex flex-col gap-2">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-[#93000a]/20 blur-xl pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#93000a]/40 border border-[#ffb4ab]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]"></span>
              <span className="font-telemetry text-[10px] text-[#ffdad6] uppercase font-bold">DESTINY OMEGA</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-telemetry text-[10px] text-[#b9cacb]">ODDS</span>
              <span className="font-telemetry text-base text-[#ffb4ab] font-bold">51.8%</span>
            </div>
          </div>

          <h3 className="font-headline text-base text-[#ffb4ab] font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#ffb4ab]">coronavirus</span>
            THE GORGLITH ENSLAVEMENT
          </h3>

          <div className="px-2 py-0.5 rounded bg-[#0b0e16] border border-[#3b494b]/20 inline-block w-fit">
            <span className="font-telemetry text-[10px] text-[#ffb4ab] font-bold">
              BIO-SYNTHETIC HARVEST THREAT
            </span>
          </div>

          <p className="font-body text-xs text-[#b9cacb] leading-relaxed">
            Thrusters cough and stall 2,000 kilometers short of Ceres-IV. Gorglith bio-recon spore tentacles detect the pilot's fading theta rhythm. Captured intact, Billy undergoes non-consensual neuro-symbiotic grafting — converting the Esperanza-IX into an infected dread-scout deployed to eradicate Earth's underground civilian shelters.
          </p>

          <div className="grid grid-cols-3 gap-2 bg-[#0b0e16] p-2 rounded-lg text-center border border-[#3b494b]/20">
            <div className="flex flex-col">
              <span className="font-telemetry text-[8px] text-[#849495]">DRIFT GAP</span>
              <span className="font-telemetry text-xs text-[#ffb4ab] font-bold">2,140 KM</span>
            </div>
            <div className="flex flex-col">
              <span className="font-telemetry text-[8px] text-[#849495]">INFECTION</span>
              <span className="font-telemetry text-xs text-[#ffb4ab] font-bold">94.1% CRIT</span>
            </div>
            <div className="flex flex-col">
              <span className="font-telemetry text-[8px] text-[#849495]">STATUS</span>
              <span className="font-telemetry text-xs text-[#ffd07c] font-bold">SYNAPSE LOCK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Prediction Poll */}
      <div className="p-4 rounded-xl bg-[#191b24] shadow-lg flex flex-col gap-3 border border-[#3b494b]/30">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-telemetry text-[10px] text-[#ffd07c] uppercase tracking-wider font-bold">
              CANONICAL PREDICTION DOCK
            </span>
            <span className="font-telemetry text-[10px] text-[#b9cacb]">
              {totalVotes.toLocaleString()} VOTES REGISTERED
            </span>
          </div>
          <h3 className="font-headline text-base text-[#dbfcff] font-bold">
            EPISODE 2 COMMUNITY PREDICTION POLL
          </h3>
          <p className="font-body text-xs text-[#b9cacb]">
            Cast your vote to calibrate the Esperanza telemetry server for Episode 2:
          </p>
        </div>

        {/* Poll Choices */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => handleVote('A')}
            className={`group relative flex flex-col p-3 rounded-xl transition-all text-left overflow-hidden active:scale-[0.99] border cursor-pointer ${
              userChoice === 'A'
                ? 'bg-[#1d1f28] border-[#00f0ff] shadow-[0_0_16px_rgba(0,240,255,0.3)]'
                : 'bg-[#1d1f28]/70 border-[#3b494b]/30 hover:border-[#00f0ff]/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5 z-10 relative">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] flex items-center justify-center font-telemetry text-xs font-bold">
                  A
                </span>
                <span className="font-body text-xs text-[#e1e2ee] font-semibold">
                  Billy Reaches Ceres-IV &amp; Fights Back
                </span>
              </div>
              <span className="font-telemetry text-sm text-[#00f0ff] font-bold">{pctA}%</span>
            </div>

            <div className="w-full h-2 rounded-full bg-[#0b0e16] overflow-hidden z-10 relative">
              <div
                style={{ width: `${pctA}%` }}
                className="h-full bg-[#00f0ff] transition-all duration-700 ease-out shadow-[0_0_8px_rgba(0,240,255,0.7)]"
              ></div>
            </div>

            <div className="flex justify-between items-center mt-1 z-10 relative font-telemetry text-[10px]">
              <span className="text-[#00f0ff]">RESISTANCE CANON</span>
              <span className="text-[#b9cacb]">{votesA.toLocaleString()} votes</span>
            </div>
          </button>

          <button
            onClick={() => handleVote('B')}
            className={`group relative flex flex-col p-3 rounded-xl transition-all text-left overflow-hidden active:scale-[0.99] border cursor-pointer ${
              userChoice === 'B'
                ? 'bg-[#1d1f28] border-[#ffb4ab] shadow-[0_0_16px_rgba(255,180,171,0.3)]'
                : 'bg-[#1d1f28]/70 border-[#3b494b]/30 hover:border-[#ffb4ab]/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5 z-10 relative">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#93000a]/40 text-[#ffb4ab] flex items-center justify-center font-telemetry text-xs font-bold">
                  B
                </span>
                <span className="font-body text-xs text-[#e1e2ee] font-semibold">
                  Captured &amp; Enslaved by Hive Mind
                </span>
              </div>
              <span className="font-telemetry text-sm text-[#ffb4ab] font-bold">{pctB}%</span>
            </div>

            <div className="w-full h-2 rounded-full bg-[#0b0e16] overflow-hidden z-10 relative">
              <div
                style={{ width: `${pctB}%` }}
                className="h-full bg-[#ffb4ab] transition-all duration-700 ease-out shadow-[0_0_8px_rgba(255,180,171,0.7)]"
              ></div>
            </div>

            <div className="flex justify-between items-center mt-1 z-10 relative font-telemetry text-[10px]">
              <span className="text-[#ffb4ab]">DARK COSMOS CANON</span>
              <span className="text-[#b9cacb]">{votesB.toLocaleString()} votes</span>
            </div>
          </button>
        </div>

        {hasVoted && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30">
            <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">verified</span>
            <span className="font-body text-xs text-[#00f0ff]">
              Prediction logged to deep space registry. Telemetry updated.
            </span>
          </div>
        )}
      </div>

      {/* Intercepted Audio Transmission Teaser */}
      <div className="p-4 rounded-xl bg-[#191b24] shadow-md border border-[#3b494b]/30 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffd07c] text-[20px] animate-pulse">cell_tower</span>
            <span className="font-telemetry text-[10px] text-[#ffd07c] uppercase tracking-wider font-bold">
              UNKNOWN FREQUENCY INTERCEPT (T-00:45s)
            </span>
          </div>
          <span className="font-telemetry text-xs text-[#b9cacb] font-bold px-2 py-0.5 rounded bg-[#0b0e16] border border-[#3b494b]/30">
            BURST CH-7
          </span>
        </div>

        <div className="flex flex-col gap-2 p-3 rounded-lg bg-[#0b0e16] border border-[#3b494b]/20">
          <div>
            <span className="font-telemetry text-xs text-[#00f0ff] font-bold">BILLY (ESPERANZA-IX):</span>
            <p className="font-body text-xs text-[#b9cacb] italic pl-2 mt-0.5">
              “Pete... if you're hearing this through the static noise... I'm cutting manual thrusters. Entering lunar dark side now...”
            </p>
          </div>

          <div className="flex items-center gap-2 py-0.5">
            <div className="flex-1 h-px bg-[#3b494b]/40"></div>
            <span className="font-telemetry text-[9px] text-[#ffb4ab] tracking-widest uppercase">
              [GORGLITH BIO-RESONANCE HUM INTERFERENCE]
            </span>
            <div className="flex-1 h-px bg-[#3b494b]/40"></div>
          </div>

          <div>
            <span className="font-telemetry text-xs text-[#ffd07c] font-bold">PETE (WAGGA WAGGA OBSERVATORY):</span>
            <p className="font-body text-xs text-[#b9cacb] italic pl-2 mt-0.5">
              “Hold on, mate! The Wagga Wagga array just picked up a second signature approaching behind you — and it's not human...”
            </p>
          </div>
        </div>

        {/* Audio Visualizer */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={handleToggleAudio}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-telemetry text-xs font-bold transition-all active:scale-95 ${
              isAudioDecoding
                ? 'bg-[#ffd07c] text-[#412d00]'
                : 'bg-[#272a33] text-[#00f0ff] hover:bg-[#363943]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isAudioDecoding ? 'pause' : 'play_arrow'}
            </span>
            <span>{isAudioDecoding ? 'PAUSE COMM' : 'DECODE AUDIO'}</span>
          </button>

          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffd07c] animate-ping"></span>
            <span className="font-telemetry text-[10px] text-[#b9cacb]">44.1 KHZ RAW PCM</span>
          </div>
        </div>
      </div>

      {/* Episode 2 Simulcast Countdown & Alert Button */}
      <div className="p-4 rounded-xl bg-[#191b24] shadow-xl flex flex-col gap-3 border border-[#3b494b]/40">
        <div className="flex flex-col gap-0.5">
          <span className="font-telemetry text-[10px] text-[#ffd07c] uppercase tracking-widest font-bold">
            NEXT BROADCAST CHAPTER
          </span>
          <h3 className="font-headline text-lg text-[#dbfcff] font-bold tracking-tight">
            SEASON 2 PREMIERE: THE BATTLE FOR LAGRANGE 2
          </h3>
        </div>

        {/* Countdown */}
        <div className="p-3 rounded-lg bg-[#0b0e16] border border-[#3b494b]/30">
          <span className="font-telemetry text-[9px] text-[#b9cacb] tracking-widest uppercase text-center block mb-2">
            EPISODE 2 SIMULCAST COUNTDOWN
          </span>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="flex flex-col p-2 rounded bg-[#272a33]">
              <span className="font-headline text-xl text-[#00f0ff] font-bold">{countdown.days}</span>
              <span className="font-telemetry text-[8px] text-[#849495]">DAYS</span>
            </div>
            <div className="flex flex-col p-2 rounded bg-[#272a33]">
              <span className="font-headline text-xl text-[#00f0ff] font-bold">{countdown.hours}</span>
              <span className="font-telemetry text-[8px] text-[#849495]">HRS</span>
            </div>
            <div className="flex flex-col p-2 rounded bg-[#272a33]">
              <span className="font-headline text-xl text-[#00f0ff] font-bold">{countdown.minutes}</span>
              <span className="font-telemetry text-[8px] text-[#849495]">MIN</span>
            </div>
            <div className="flex flex-col p-2 rounded bg-[#272a33]">
              <span className="font-headline text-xl text-[#ffd07c] font-bold">{countdown.seconds}</span>
              <span className="font-telemetry text-[8px] text-[#849495]">SEC</span>
            </div>
          </div>
        </div>

        {/* Primary Notification CTA */}
        <button
          onClick={handleSubscribe}
          className={`w-full py-3 px-4 rounded-xl font-telemetry text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${
            isSubscribed
              ? 'bg-[#f3af00] text-[#412d00] shadow-[0_0_18px_rgba(243,175,0,0.4)]'
              : 'bg-[#00f0ff] text-[#00363a] shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-[#7df4ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isSubscribed ? 'mark_email_read' : 'notifications_active'}
          </span>
          <span>{isSubscribed ? 'SUBSCRIBED // PRIORITY BEACON SET' : 'SUBSCRIBE FOR EPISODE 2 ALERT'}</span>
        </button>

        {/* Replay */}
        <button
          onClick={() => onNavigateScene && onNavigateScene('diagnostics')}
          className="w-full py-2.5 px-4 rounded-xl bg-[#272a33] hover:bg-[#363943] text-[#00f0ff] font-telemetry text-xs flex items-center justify-center gap-2 transition-colors border border-[#3b494b]/30"
        >
          <span className="material-symbols-outlined text-[16px]">history</span>
          <span>REPLAY PART 1 DISPATCH LOGS (SCENES 1-4)</span>
        </button>
      </div>
    </div>
  );
};
