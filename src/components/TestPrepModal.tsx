import React from 'react';
import { ENTRY_TESTS_PREP } from '../data/universities';

interface TestPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestPrepModal: React.FC<TestPrepModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-[#c4c5d5]/30 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-[#00288e] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-filled text-2xl">assignment</span>
            <div>
              <h3 className="font-bold text-base md:text-lg">Entry Test Prep Resources</h3>
              <p className="text-xs text-white/80">NET, MDCAT, ECAT & FAST Sample Papers & Formulas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs md:text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ENTRY_TESTS_PREP.map((tp) => (
              <div
                key={tp.id}
                className="p-4 bg-[#f8f9ff] rounded-xl border border-[#c4c5d5]/30 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-[#eff4ff] text-[#00288e] px-2 py-0.5 rounded border border-[#2170e4]/20">
                      Target: {tp.targetUnis}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#0b1c30]">{tp.title}</h4>
                  <p className="text-xs text-[#444653]"><strong>Format:</strong> {tp.format}</p>
                  <p className="text-xs text-[#444653]"><strong>Duration:</strong> {tp.duration}</p>
                  <p className="text-xs text-emerald-700 font-semibold">{tp.passingMark}</p>
                </div>
                <div className="pt-3 border-t border-[#c4c5d5]/20 flex items-center justify-between">
                  <span className="text-[11px] text-[#444653] font-medium">{tp.downloadPdf}</span>
                  <button
                    onClick={() => alert(`Downloading practice papers pack: ${tp.downloadPdf}`)}
                    className="bg-[#00288e] hover:bg-[#1e40af] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8f9ff] border-t border-[#c4c5d5]/20 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-[#00288e] text-white text-xs font-bold px-5 py-2 rounded-xl"
          >
            Close Prep Hub
          </button>
        </div>
      </div>
    </div>
  );
};
