import React, { useState } from 'react';

interface HeaderProps {
  activeTab: 'home' | 'search' | 'tests' | 'calendar' | 'predictor' | 'counselor' | 'about';
  setActiveTab: (tab: 'home' | 'search' | 'tests' | 'calendar' | 'predictor' | 'counselor' | 'about') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'search', label: 'University Search' },
    { id: 'tests', label: 'Entrance Tests' },
    { id: 'calendar', label: 'My Calendar' },
    { id: 'predictor', label: 'Admission Predictor' },
    { id: 'counselor', label: 'AI Counselor' },
    { id: 'about', label: 'About Us' },
  ] as const;

  return (
    <>
      <header className="w-full top-0 sticky z-50 bg-[#ffffff] dark:bg-[#213145] shadow-sm border-b border-[#c4c5d5]/20">
        <div className="flex justify-between items-center px-4 md:px-6 py-3 max-w-[1280px] mx-auto">
          {/* Left Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open Menu"
              className="p-2 rounded-full hover:bg-[#eff4ff] transition-colors md:hidden text-[#00288e] flex items-center justify-center"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 font-bold text-xl md:text-2xl text-[#00288e] dark:text-[#dde1ff] hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-filled text-2xl md:text-3xl text-[#00288e]">school</span>
              <span>UniGuide AI</span>
            </button>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 lg:gap-8 items-center">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`font-semibold text-sm transition-all duration-200 py-1.5 border-b-2 ${
                    isActive
                      ? 'text-[#00288e] dark:text-[#dde1ff] border-[#00288e] font-bold'
                      : 'text-[#444653] dark:text-[#fefcff] hover:text-[#0058be] border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end text-xs">
              <span className="font-semibold text-[#0b1c30]">Student Profile</span>
              <span className="text-[10px] text-[#00288e] font-medium">Pre-Engineering / ICS</span>
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#2170e4] flex items-center justify-center text-white font-bold text-sm shadow-sm border-2 border-[#d3e4fe] overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU63AbcmVShZbBylYNkDNwsJGQSxCuKJwoseaC8u85f-jwHCeEpUjqBh6iAk2QPFh5amZ1MaTBEkw-Q_GR917xy69SiMcKa34LPvWva1K5yGEu8OQR7r0WZyoa7rocT7hug34WT0wIbLyLLLgQxqHABuHHAkUkncN1n2zPjQeDOpDTM4byOnljwVgaz_eALVglUg89g9R0gZdZEBmW35StR5osyz5sASJL6_mE6XB7SOKu6z8_yjc"
                alt="Student Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] transition-opacity animate-fade-in">
          <aside className="h-full w-72 bg-[#f8f9ff] dark:bg-[#213145] shadow-2xl flex flex-col py-6 px-4 animate-slide-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#c4c5d5]/30">
              <div className="flex items-center gap-2 text-[#00288e] font-bold text-lg">
                <span className="material-symbols-filled">school</span>
                <span>UniGuide AI</span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-full hover:bg-black/5 text-[#444653]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav className="flex-col flex gap-2 pt-6">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setDrawerOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm text-left transition-colors ${
                      isActive
                        ? 'bg-[#2170e4] text-white shadow-sm'
                        : 'text-[#444653] hover:bg-[#eff4ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined">
                      {item.id === 'home'
                        ? 'home'
                        : item.id === 'search'
                        ? 'school'
                        : item.id === 'predictor'
                        ? 'calculate'
                        : item.id === 'counselor'
                        ? 'smart_toy'
                        : 'info'}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto pt-6 border-t border-[#c4c5d5]/30">
              <div className="flex items-center gap-3 p-2 bg-[#eff4ff] rounded-lg">
                <div className="w-8 h-8 rounded-full bg-[#00288e] text-white flex items-center justify-center font-bold text-xs">
                  SP
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#0b1c30]">Pakistani Student</p>
                  <p className="text-[#444653]">Session {new Date().getFullYear()} - {new Date().getFullYear() + 1}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
