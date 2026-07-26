import React from 'react';
import { UNIVERSITIES } from '../data/universities';
import { University } from '../types';
import { getCurrentAdmissionTerm } from '../utils/admissionCycle';

interface HomeViewProps {
  setActiveTab: (tab: 'home' | 'search' | 'predictor' | 'counselor' | 'about') => void;
  onSelectUniversity: (uni: University) => void;
  onOpenScholarships: () => void;
  onOpenTestPrep: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  onSelectUniversity,
  onOpenScholarships,
  onOpenTestPrep,
}) => {
  return (
    <div className="space-y-12 animate-fade-in pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-12 pb-12">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eff4ff] border border-[#2170e4]/30 text-[#00288e] text-xs font-semibold">
                <span className="material-symbols-filled text-sm text-[#2170e4]">verified</span>
                <span>Trusted by 50,000+ Pakistani Students for {getCurrentAdmissionTerm().term} Admissions</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0b1c30] tracking-tight leading-[1.15]">
                Find Your Future <span className="text-[#00288e] underline decoration-[#2170e4] decoration-4 underline-offset-4">University</span> in Pakistan
              </h1>

              <p className="text-base sm:text-lg text-[#444653] max-w-2xl leading-relaxed">
                UniGuide AI combines official HEC merit data, real-time aggregate formulas, and personalized AI counseling to help you discover, evaluate, and get accepted into top Pakistani universities.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('predictor')}
                  className="bg-[#00288e] hover:bg-[#1e40af] text-white px-6 py-3.5 rounded-xl font-bold text-sm md:text-base shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
                >
                  <span>Predict Admission Chances</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <button
                  onClick={() => setActiveTab('search')}
                  className="bg-[#eff4ff] hover:bg-[#d3e4fe] text-[#00288e] px-6 py-3.5 rounded-xl font-bold text-sm md:text-base border border-[#2170e4]/20 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">search</span>
                  <span>Explore 200+ Universities</span>
                </button>
              </div>

              {/* Stat Counters */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#c4c5d5]/20 max-w-lg">
                <div>
                  <p className="text-2xl md:text-3xl font-extrabold text-[#00288e]">200+</p>
                  <p className="text-xs text-[#444653] font-medium">HEC Institutions</p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-extrabold text-[#00288e]">98%</p>
                  <p className="text-xs text-[#444653] font-medium">Merit Accuracy</p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-extrabold text-[#00288e]">24/7</p>
                  <p className="text-xs text-[#444653] font-medium">AI Counseling</p>
                </div>
              </div>
            </div>

            {/* Right Column / Floating Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Background Banner */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-gradient-to-tr from-[#00288e] to-[#2170e4]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCT4ULwf08vwCAS7PHj7z4yBkMQfegOGkphSfuvWke_xeb_aLy0kXMleR9AMJcYpMGMqsuckDDjSoU5PZ6MW740kG-rgNfvned-uZ23Ndw1cJHbdLI0R0c4SHbAWlrWPhjefx9ayzRJbIbW76M1U8LTGM_j1aViHSY7Xye-EtrfT_buJE7UPjM5-SpXrim6S5ilvZGJ0gCGksOKoSgfx-AWI0LnGyOLkRSsJ_Rq9k5I8a4tzRJd1gk"
                    alt="University Campus Pakistan"
                    className="w-full h-full object-cover mix-blend-overlay opacity-80"
                  />
                </div>

                {/* Floating Card - Top Merit Prediction */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-[#2170e4]/20 max-w-xs animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00288e] text-white flex items-center justify-center font-bold">
                      <span className="material-symbols-filled">insights</span>
                    </div>
                    <div>
                      <p className="text-xs text-[#444653] font-medium">Predicted Aggregate</p>
                      <p className="text-lg font-extrabold text-[#00288e]">82.4% - NUST CS</p>
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    <span>High Admission Probability (Safe Match)</span>
                  </div>
                </div>

                {/* Floating Card 2 - Active Admissions */}
                <div className="absolute -top-4 -right-2 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-[#c4c5d5]/30 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="font-bold text-[#0b1c30]">{getCurrentAdmissionTerm().term} Admissions Open</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Academic Tools Bento Grid */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <p className="text-xs font-bold text-[#00288e] tracking-wider uppercase">Our Smart Suite</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30]">
            Everything You Need for University Admissions
          </h2>
          <p className="text-sm text-[#444653]">
            Purpose-built tools for Pakistani students completing Matric, FSc, O/A-Levels, or DAE.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bento Card 1: University Finder */}
          <div
            onClick={() => setActiveTab('search')}
            className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-[#c4c5d5]/30 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#00288e] flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-filled text-2xl">school</span>
              </div>
              <h3 className="text-xl font-bold text-[#0b1c30] group-hover:text-[#00288e] transition-colors">
                University Finder
              </h3>
              <p className="text-sm text-[#444653] leading-relaxed">
                Filter through 200+ HEC recognized institutions by province, city, discipline, fee structure, and rankings.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-[#c4c5d5]/20 flex items-center justify-between text-xs font-bold text-[#00288e]">
              <span>Explore Universities</span>
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>

          {/* Bento Card 2: Admission Predictor */}
          <div
            onClick={() => setActiveTab('predictor')}
            className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-[#c4c5d5]/30 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#00288e] flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-filled text-2xl">calculate</span>
              </div>
              <h3 className="text-xl font-bold text-[#0b1c30] group-hover:text-[#00288e] transition-colors">
                Admission Predictor
              </h3>
              <p className="text-sm text-[#444653] leading-relaxed">
                Calculate your aggregate automatically and predict your safe, target, and reach universities with custom algorithms.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-[#c4c5d5]/20 flex items-center justify-between text-xs font-bold text-[#00288e]">
              <span>Check Admission Chances</span>
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>

          {/* Bento Card 3: AI Counselor (Highlight Card) */}
          <div
            onClick={() => setActiveTab('counselor')}
            className="group bg-gradient-to-br from-[#00288e] to-[#2170e4] text-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between md:col-span-2 lg:col-span-1"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-filled text-2xl">smart_toy</span>
                </div>
                <span className="bg-white/20 text-xs px-2.5 py-1 rounded-full font-semibold">Gemini Powered</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Interactive AI Counselor
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Get 24/7 personalized answers to queries about entrance test preparation, field selection, and career pathways in Pakistan.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
              <span>Start Counselor Chat</span>
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>

          {/* Bento Card 4: Scholarship Tracker */}
          <div
            onClick={onOpenScholarships}
            className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-[#c4c5d5]/30 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#00288e] flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-filled text-2xl">payments</span>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#0b1c30] group-hover:text-[#00288e] transition-colors">
                  Scholarship Tracker
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  4 Active
                </span>
              </div>
              <p className="text-sm text-[#444653] leading-relaxed">
                Access HEC Ehsaas, PEEF, LUMS NOP, and university merit scholarships with full eligibility requirements.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-[#c4c5d5]/20 flex items-center justify-between text-xs font-bold text-[#00288e]">
              <span>View Scholarships</span>
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>

          {/* Bento Card 5: Entry Test Prep */}
          <div
            onClick={onOpenTestPrep}
            className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-[#c4c5d5]/30 cursor-pointer flex flex-col justify-between md:col-span-2"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#00288e] flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-filled text-2xl">assignment</span>
              </div>
              <h3 className="text-xl font-bold text-[#0b1c30] group-hover:text-[#00288e] transition-colors">
                Entry Test Prep Resources (NET / ECAT / MDCAT / FAST)
              </h3>
              <p className="text-sm text-[#444653] leading-relaxed max-w-2xl">
                Comprehensive weightages, sample paper downloads, and past paper practice packs for NUST NET, MDCAT, UET ECAT, and FAST Entry Tests.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-[#c4c5d5]/20 flex items-center justify-between text-xs font-bold text-[#00288e]">
              <span>Explore Prep Materials</span>
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Admission Tracker Table */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-[#c4c5d5]/30 overflow-hidden">
          <div className="p-6 border-b border-[#c4c5d5]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="text-xl font-bold text-[#0b1c30]">{getCurrentAdmissionTerm().term} Admission Tracker</h3>
              </div>
              <p className="text-xs text-[#444653] mt-1">
                Real-time tracking of deadlines, closing merits, and seat availability for top Pakistani universities.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('search')}
              className="text-xs font-bold text-[#00288e] hover:underline flex items-center gap-1 self-start md:self-auto"
            >
              <span>View All Universities</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#eff4ff] text-[#00288e] font-semibold text-xs border-b border-[#c4c5d5]/30">
                  <th className="py-3.5 px-6">University</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Closing Merit</th>
                  <th className="py-3.5 px-4">Deadline</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c4c5d5]/20">
                {UNIVERSITIES.slice(0, 5).map((uni) => (
                  <tr key={uni.id} className="hover:bg-[#f8f9ff] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={uni.logoUrl}
                          alt={uni.shortName}
                          className="w-10 h-10 rounded-lg object-contain bg-white border border-[#c4c5d5]/30 p-1 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-[#0b1c30] text-sm">{uni.name}</p>
                          <span className="text-[11px] text-[#2170e4] font-medium">{uni.badge}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-[#444653]">
                      {uni.city}, {uni.province}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-[#00288e] text-sm">
                      {uni.closingMeritDisplay}
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold text-[#0b1c30]">
                      {uni.admissionStatus.deadline}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          uni.admissionStatus.statusText === 'Open'
                            ? 'bg-emerald-100 text-emerald-800'
                            : uni.admissionStatus.statusText === 'Closing Soon'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            uni.admissionStatus.statusText === 'Open'
                              ? 'bg-emerald-600'
                              : uni.admissionStatus.statusText === 'Closing Soon'
                              ? 'bg-amber-600'
                              : 'bg-rose-600'
                          }`}
                        ></span>
                        {uni.admissionStatus.statusText}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => onSelectUniversity(uni)}
                        className="bg-[#2170e4] hover:bg-[#0058be] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
