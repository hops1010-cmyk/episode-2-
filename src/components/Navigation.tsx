import React from 'react';
import { sound } from '../utils/audio';

interface NavigationProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'orbits', label: 'ORBITS', icon: 'orbit' },
    { id: 'diagnostics', label: 'SCHEMATIC', icon: 'tune' },
    { id: 'ascent', label: 'ASCENT', icon: 'rocket_launch' },
    { id: 'comms', label: 'COMMS', icon: 'cell_tower' },
    { id: 'survival', label: 'SURVIVAL', icon: 'vital_signs' },
    { id: 'finale', label: 'FINALE', icon: 'slow_motion_video' },
  ];

  const handleTabClick = (tabId: string) => {
    sound.playClick(1000 + tabs.findIndex((t) => t.id === tabId) * 80, 0.04);
    onSelectTab(tabId);
  };

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#0b0e16]/90 backdrop-blur-2xl border-t border-[#3b494b]/30 shadow-[0_-4px_24px_rgba(0,0,0,0.7)]">
      <div className="flex justify-around items-center h-16 px-1 max-w-xl mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] h-full transition-all relative py-1 cursor-pointer ${
                isActive
                  ? 'text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] font-bold'
                  : 'text-[#849495] hover:text-[#e1e2ee]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] transition-transform active:scale-90">
                {tab.icon}
              </span>
              <span className="font-telemetry text-[9px] mt-0.5 tracking-wider uppercase">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#00f0ff] shadow-[0_0_6px_#00f0ff]"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
