import React from 'react';

interface AboutViewProps {
  setActiveTab: (tab: 'home' | 'search' | 'predictor' | 'counselor' | 'about') => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ setActiveTab }) => {
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8 space-y-12 animate-fade-in">
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eff4ff] border border-[#2170e4]/20 text-[#00288e] text-xs font-semibold">
          <span className="material-symbols-filled text-sm text-[#2170e4]">flag</span>
          <span>Made for Pakistani Students Across All Provinces</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0b1c30] tracking-tight">
          Empowering the Next Generation of Pakistani Leaders
        </h1>
        <p className="text-base text-[#444653] leading-relaxed">
          UniGuide AI bridges the information gap in Pakistani higher education by providing real-time merit data, aggregate predictors, and 24/7 AI admission counseling.
        </p>
      </section>

      {/* Purpose Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c4c5d5]/30 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#00288e] flex items-center justify-center">
            <span className="material-symbols-filled text-2xl">target</span>
          </div>
          <h3 className="font-bold text-lg text-[#0b1c30]">Our Purpose</h3>
          <p className="text-xs text-[#444653] leading-relaxed">
            Eliminate confusion around university cutoffs and entrance exam preparation for matric, FSc, O/A-Levels, and diploma holders.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c4c5d5]/30 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#00288e] flex items-center justify-center">
            <span className="material-symbols-filled text-2xl">database</span>
          </div>
          <h3 className="font-bold text-lg text-[#0b1c30]">500+ Campuses</h3>
          <p className="text-xs text-[#444653] leading-relaxed">
            Updated databases covering HEC recognized public and private universities across Punjab, Sindh, KPK, Balochistan, ICT, and AJK.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c4c5d5]/30 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#00288e] flex items-center justify-center">
            <span className="material-symbols-filled text-[#00288e] text-2xl">verified</span>
          </div>
          <h3 className="font-bold text-lg text-[#0b1c30]">98% Merit Accuracy</h3>
          <p className="text-xs text-[#444653] leading-relaxed">
            Mathematical aggregate algorithms matching official university formulas including NUST NET, MDCAT, UET ECAT, and FAST tests.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c4c5d5]/30 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#00288e] flex items-center justify-center">
            <span className="material-symbols-filled text-[#00288e] text-2xl">smart_toy</span>
          </div>
          <h3 className="font-bold text-lg text-[#0b1c30]">AI Guidance</h3>
          <p className="text-xs text-[#444653] leading-relaxed">
            Powered by Gemini AI, delivering instant personalized advice on field selection, career paths, and scholarship criteria.
          </p>
        </div>
      </section>

      {/* How It Works 3 Steps */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-[#c4c5d5]/30 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[#0b1c30]">How UniGuide AI Works</h2>
          <p className="text-xs text-[#444653] mt-1">3 simple steps from profile entry to university selection</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-[#00288e] text-white font-extrabold text-lg flex items-center justify-center mx-auto">
              1
            </div>
            <h4 className="font-bold text-base text-[#0b1c30]">Input Credentials</h4>
            <p className="text-xs text-[#444653] leading-relaxed">
              Enter your Matric %, Intermediate %, and Entrance test score (NET/MDCAT/ECAT).
            </p>
          </div>

          <div className="space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-[#00288e] text-white font-extrabold text-lg flex items-center justify-center mx-auto">
              2
            </div>
            <h4 className="font-bold text-base text-[#0b1c30]">Automated Aggregate Calculation</h4>
            <p className="text-xs text-[#444653] leading-relaxed">
              Our system applies specific university weightage rules and matches closing cutoffs.
            </p>
          </div>

          <div className="space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-[#00288e] text-white font-extrabold text-lg flex items-center justify-center mx-auto">
              3
            </div>
            <h4 className="font-bold text-base text-[#0b1c30]">Get Matched & AI Advice</h4>
            <p className="text-xs text-[#444653] leading-relaxed">
              Receive categorized safe, target, and reach universities plus strategy from AI Counselor.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-[#00288e] to-[#2170e4] text-white p-8 md:p-12 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-2xl md:text-3xl font-extrabold">Ready to Find Your University?</h3>
          <p className="text-xs md:text-sm text-white/80">
            Start using UniGuide AI&apos;s predictor tool or chat directly with the AI Counselor today.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('predictor')}
            className="bg-white text-[#00288e] hover:bg-[#f8f9ff] px-6 py-3.5 rounded-xl font-bold text-xs md:text-sm shadow-md transition-colors"
          >
            Check Aggregate Now
          </button>
          <button
            onClick={() => setActiveTab('counselor')}
            className="bg-[#2170e4] hover:bg-[#0058be] text-white px-6 py-3.5 rounded-xl font-bold text-xs md:text-sm border border-white/30 transition-colors"
          >
            Talk to AI Counselor
          </button>
        </div>
      </section>
    </div>
  );
};
