import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PowerProgressBarProps {
  level: number; // 0 to 100
  previousLevel?: number;
  height?: number | string;
  showTicks?: boolean;
  className?: string;
  glow?: boolean;
  colorScheme?: 'auto' | 'cyan' | 'amber' | 'crimson';
}

export const PowerProgressBar: React.FC<PowerProgressBarProps> = ({
  level,
  previousLevel,
  height = 8,
  showTicks = true,
  className = '',
  glow = true,
  colorScheme = 'auto',
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const previousLevelRef = useRef<number>(previousLevel ?? level);

  // Determine color scheme based on level
  const computedScheme =
    colorScheme !== 'auto'
      ? colorScheme
      : level > 50
      ? 'cyan'
      : level > 20
      ? 'amber'
      : 'crimson';

  const colorStyles = {
    cyan: {
      fill: 'from-[#006970] via-[#00dbe9] to-[#00f0ff]',
      solid: '#00f0ff',
      glowColor: 'rgba(0, 240, 255, 0.45)',
      tickColor: 'bg-[#00f0ff]/30',
      flashColor: 'rgba(125, 244, 255, 0.8)',
    },
    amber: {
      fill: 'from-[#f3af00] via-[#ffd07c] to-[#ffdea7]',
      solid: '#ffd07c',
      glowColor: 'rgba(255, 208, 124, 0.45)',
      tickColor: 'bg-[#ffd07c]/30',
      flashColor: 'rgba(255, 222, 167, 0.8)',
    },
    crimson: {
      fill: 'from-[#93000a] via-[#ffb4ab] to-[#ffdad6]',
      solid: '#ffb4ab',
      glowColor: 'rgba(255, 180, 171, 0.55)',
      tickColor: 'bg-[#ffb4ab]/30',
      flashColor: 'rgba(255, 180, 171, 0.85)',
    },
  }[computedScheme];

  useEffect(() => {
    const bar = barRef.current;
    const flash = flashRef.current;
    const glowEl = glowRef.current;
    if (!bar) return;

    const prev = previousLevelRef.current;
    const delta = level - prev;
    previousLevelRef.current = level;

    // Smooth GSAP Tween on width and scale
    gsap.to(bar, {
      width: `${Math.max(0, Math.min(100, level))}%`,
      duration: 0.65,
      ease: 'elastic.out(1, 0.75)',
    });

    // Reactive pulse/flash effect when power fluctuations occur
    if (Math.abs(delta) > 0.5 && flash) {
      gsap.killTweensOf(flash);
      gsap.fromTo(
        flash,
        { opacity: delta < 0 ? 0.75 : 0.9, scaleY: 1.6 },
        {
          opacity: 0,
          scaleY: 1,
          duration: 0.55,
          ease: 'power2.out',
        }
      );
    }

    if (glowEl) {
      gsap.to(glowEl, {
        opacity: level < 25 ? 0.9 : 0.6,
        duration: 0.4,
      });
    }
  }, [level]);

  return (
    <div
      className={`relative w-full rounded-full bg-[#0b0e16] border border-[#3b494b]/40 overflow-hidden shadow-inner flex items-center ${className}`}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      {/* Background Micro Grid Graticule */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '8px 100%',
        }}
      />

      {/* Main Animated Fill Bar */}
      <div
        ref={barRef}
        className={`h-full rounded-full bg-gradient-to-r ${colorStyles.fill} relative transition-colors duration-300`}
        style={{
          width: `${Math.max(0, Math.min(100, previousLevelRef.current))}%`,
          boxShadow: glow ? `0 0 12px ${colorStyles.glowColor}` : 'none',
        }}
      >
        {/* Leading edge neon cap with pulse */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1.5 rounded-full"
          style={{ backgroundColor: colorStyles.solid, boxShadow: `0 0 8px ${colorStyles.solid}` }}
        />

        {/* Dynamic Sheen Sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 pointer-events-none animate-pulse" />
      </div>

      {/* Fluctuation Flash Indicator */}
      <div
        ref={flashRef}
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{ backgroundColor: colorStyles.flashColor }}
      />

      {/* Subtly glowing atmospheric underglow */}
      {glow && (
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none rounded-full blur-[2px] transition-all"
          style={{
            boxShadow: `inset 0 0 6px ${colorStyles.glowColor}`,
          }}
        />
      )}

      {/* Static Sub-Division Ticks (25%, 50%, 75%) */}
      {showTicks && (
        <div className="absolute inset-0 flex justify-between px-1 pointer-events-none items-center">
          <span className="w-0.5 h-1/2 bg-white/20 rounded-full" style={{ left: '25%', position: 'absolute' }} />
          <span className="w-0.5 h-2/3 bg-white/35 rounded-full" style={{ left: '50%', position: 'absolute' }} />
          <span className="w-0.5 h-1/2 bg-white/20 rounded-full" style={{ left: '75%', position: 'absolute' }} />
        </div>
      )}
    </div>
  );
};
