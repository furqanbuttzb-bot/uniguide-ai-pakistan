import React from 'react';

interface FooterProps {
  setActiveTab: (tab: 'home' | 'search' | 'tests' | 'calendar' | 'predictor' | 'counselor' | 'about') => void;
  onOpenScholarships: () => void;
  onOpenTestPrep: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenScholarships, onOpenTestPrep }) => {
  return (
    <footer className="w-full bg-[#0b1c30] text-white pt-12 pb-8 border-t border-[#2170e4]/30 mt-16">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold text-[#d3e4fe]">
              <span className="material-symbols-filled text-2xl text-[#2170e4]">school</span>
              <span>UniGuide AI</span>
            </div>
            <p className="text-sm text-[#c4c5d5] leading-relaxed">
              Pakistan&apos;s premier AI-powered university guidance platform, featuring smart admission predictors, university finder, merit calculators, and interactive counseling.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#2170e4] transition-colors text-white text-xs">
                FB
              </a>
              <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#2170e4] transition-colors text-white text-xs">
                TW
              </a>
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#2170e4] transition-colors text-white text-xs">
                IN
              </a>
              <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#2170e4] transition-colors text-white text-xs">
                YT
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-white">Smart Tools</h4>
            <ul className="space-y-2 text-sm text-[#c4c5d5]">
              <li>
                <button onClick={() => setActiveTab('search')} className="hover:text-white transition-colors">
                  University Finder
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('predictor')} className="hover:text-white transition-colors">
                  Admission Predictor
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('counselor')} className="hover:text-white transition-colors">
                  AI Counselor Chat
                </button>
              </li>
              <li>
                <button onClick={onOpenScholarships} className="hover:text-white transition-colors">
                  Scholarship Tracker {new Date().getFullYear()}
                </button>
              </li>
              <li>
                <button onClick={onOpenTestPrep} className="hover:text-white transition-colors">
                  Entry Test Prep (NET/ECAT/MDCAT)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-white">Top Institutions</h4>
            <ul className="space-y-2 text-sm text-[#c4c5d5]">
              <li>
                <button onClick={() => setActiveTab('search')} className="hover:text-white transition-colors">
                  NUST Islamabad
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('search')} className="hover:text-white transition-colors">
                  FAST-NUCES Karachi & Lahore
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('search')} className="hover:text-white transition-colors">
                  King Edward Medical University
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('search')} className="hover:text-white transition-colors">
                  LUMS Lahore
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('search')} className="hover:text-white transition-colors">
                  GIKI Swabi
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-white">Admissions Updates</h4>
            <p className="text-xs text-[#c4c5d5]">
              Subscribe to get real-time merit alerts, entry test reminders, and scholarship updates directly.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to UniGuide AI updates!'); }} className="flex gap-2">
              <input
                type="email"
                placeholder="Student email address"
                required
                className="w-full bg-white/10 text-white placeholder-white/50 text-xs px-3 py-2 rounded border border-white/20 focus:outline-none focus:border-[#2170e4]"
              />
              <button
                type="submit"
                className="bg-[#2170e4] hover:bg-[#0058be] text-white px-3 py-2 rounded text-xs font-bold transition-colors shrink-0"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-[#c4c5d5] gap-4">
          <p>© {new Date().getFullYear()} UniGuide AI Pakistan. All HEC recognized data updated regularly.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">HEC Recognition Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
