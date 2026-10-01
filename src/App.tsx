/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { sound } from './utils/audio';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { PowerStatusWidget } from './components/PowerStatusWidget';
import { ViewOrbits } from './components/ViewOrbits';
import { ViewDiagnostics } from './components/ViewDiagnostics';
import { ViewAscent } from './components/ViewAscent';
import { ViewComms } from './components/ViewComms';
import { ViewSurvival } from './components/ViewSurvival';
import { ViewFinale } from './components/ViewFinale';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('orbits');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [pilot, setPilot] = useState<'Mateo' | 'Billy'>('Mateo');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const mainViewRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const radarScanOverlayRef = useRef<HTMLDivElement>(null);

  // Sync sound setting
  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  // Micro-toast notification with GSAP
  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastRef.current) {
      gsap.killTweensOf(toastRef.current);
      gsap.fromTo(
        toastRef.current,
        { opacity: 0, y: 15, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.25,
          ease: 'back.out(2)',
          onComplete: () => {
            gsap.to(toastRef.current, {
              opacity: 0,
              y: 10,
              scale: 0.95,
              delay: 1.9,
              duration: 0.25,
              ease: 'power2.in',
            });
          },
        }
      );
    }
  };

  // Switch tab with smooth GSAP transition
  const handleSelectTab = (tab: string) => {
    if (tab === currentTab) return;
    setCurrentTab(tab);

    if (mainViewRef.current) {
      gsap.fromTo(
        mainViewRef.current,
        { opacity: 0, y: 16, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.35, ease: 'power2.out' }
      );
    }
  };

  // Radar button click handler
  const handleRadarSweep = () => {
    sound.playTargetLock();
    showToast('LIDAR & Radar Sensor Sweep Active: 360° Sector Cleared');

    if (radarScanOverlayRef.current) {
      gsap.fromTo(
        radarScanOverlayRef.current,
        { opacity: 0.35, scale: 0.8 },
        { opacity: 0, scale: 1.5, duration: 0.9, ease: 'power2.out' }
      );
    }
  };

  const handleTogglePilot = () => {
    const next = pilot === 'Mateo' ? 'Billy' : 'Mateo';
    setPilot(next);
    showToast(`Pilot Telemetry Profile Switched: ${next === 'Mateo' ? 'Mateo (Esperanza-IX)' : 'Billy Newscombe (Courier)'}`);
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const tabList = ['orbits', 'diagnostics', 'ascent', 'comms', 'survival', 'finale'];
      const currentIndex = tabList.indexOf(currentTab);

      if (e.key === 'ArrowRight' && currentIndex < tabList.length - 1) {
        handleSelectTab(tabList[currentIndex + 1]);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        handleSelectTab(tabList[currentIndex - 1]);
      } else if (e.key === 'm' || e.key === 'M') {
        setSoundEnabled((prev) => !prev);
        sound.playClick(800, 0.04);
      } else if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (tabList[idx]) handleSelectTab(tabList[idx]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTab]);

  return (
    <div className="flex flex-col min-h-screen bg-[#10131c] text-[#e1e2ee] relative overflow-x-hidden selection:bg-[#00f0ff] selection:text-[#00363a]">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onRadarClick={handleRadarSweep}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        pilotName={pilot === 'Mateo' ? 'Mateo (ESP-09)' : 'Billy (Relay)'}
        onTogglePilot={handleTogglePilot}
      />

      {/* Radar Overlay Wave Pulse */}
      <div
        ref={radarScanOverlayRef}
        className="fixed inset-0 pointer-events-none rounded-full border-2 border-[#00f0ff] opacity-0 z-40"
      ></div>

      {/* Main Content View Container */}
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-20 max-w-xl mx-auto">
        {/* Persistent Power Status Battery Widget across all views */}
        <div className="pt-2 pb-1">
          <PowerStatusWidget onShowToast={showToast} currentTab={currentTab} />
        </div>

        <div ref={mainViewRef} className="w-full">
          {currentTab === 'orbits' && <ViewOrbits onShowToast={showToast} />}
          {currentTab === 'diagnostics' && (
            <ViewDiagnostics onShowToast={showToast} onNavigateScene={handleSelectTab} />
          )}
          {currentTab === 'ascent' && (
            <ViewAscent onShowToast={showToast} onNavigateScene={handleSelectTab} />
          )}
          {currentTab === 'comms' && (
            <ViewComms onShowToast={showToast} onNavigateScene={handleSelectTab} />
          )}
          {currentTab === 'survival' && (
            <ViewSurvival onShowToast={showToast} onNavigateScene={handleSelectTab} />
          )}
          {currentTab === 'finale' && (
            <ViewFinale onShowToast={showToast} onNavigateScene={handleSelectTab} />
          )}
        </div>
      </main>

      {/* Floating Micro-Toast Feedback */}
      <div
        ref={toastRef}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#0b0e16]/95 border border-[#00f0ff]/40 backdrop-blur-xl px-4 py-2 rounded-full shadow-[0_0_24px_rgba(0,240,255,0.3)] flex items-center gap-2 opacity-0 pointer-events-none z-50 transition-all max-w-[90vw]"
      >
        <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">verified</span>
        <span className="font-telemetry text-xs text-[#e1e2ee] truncate font-medium">
          {toastMessage || 'Telemetry synchronized'}
        </span>
      </div>

      {/* Bottom Navigation Dock */}
      <Navigation currentTab={currentTab} onSelectTab={handleSelectTab} />
    </div>
  );
}
