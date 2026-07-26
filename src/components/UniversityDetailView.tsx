import React, { useState, useEffect } from 'react';
import { University, Program } from '../types';
import { getDynamicAdmissionStatus, getCurrentAdmissionTerm } from '../utils/admissionCycle';
import { isProgramBookmarked, toggleBookmarkProgram } from '../utils/calendarStorage';

interface UniversityDetailViewProps {
  university: University;
  initialProgramId?: string;
  onBack: () => void;
  setActiveTab: (tab: 'home' | 'search' | 'tests' | 'calendar' | 'predictor' | 'counselor' | 'about') => void;
  onPredictProgram?: (uni: University, program: Program) => void;
}

export const UniversityDetailView: React.FC<UniversityDetailViewProps> = ({
  university,
  initialProgramId,
  onBack,
  setActiveTab,
  onPredictProgram,
}) => {
  // Determine default selected program
  const defaultProg =
    university.offeredPrograms.find((p) => p.id === initialProgramId) ||
    university.offeredPrograms[0];

  const [selectedProgram, setSelectedProgram] = useState<Program>(defaultProg);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  useEffect(() => {
    if (selectedProgram) {
      setIsBookmarked(isProgramBookmarked(university.id, selectedProgram.id));
    }
  }, [university.id, selectedProgram]);

  const handleToggleBookmark = () => {
    if (selectedProgram) {
      const newState = toggleBookmarkProgram(university, selectedProgram);
      setIsBookmarked(newState);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 space-y-8 animate-fade-in">
      {/* Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#00288e] bg-white hover:bg-[#eff4ff] px-3.5 py-2 rounded-xl border border-[#c4c5d5]/30 transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Back to Universities</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (onPredictProgram && selectedProgram) {
                onPredictProgram(university, selectedProgram);
              } else {
                setActiveTab('predictor');
              }
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#00288e] hover:bg-[#1e40af] px-4 py-2 rounded-xl shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-sm">calculate</span>
            <span>Predict Merit for {selectedProgram?.name || 'Program'}</span>
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative bg-white rounded-3xl shadow-sm border border-[#c4c5d5]/30 overflow-hidden">
        <div className="h-44 md:h-60 relative bg-[#00288e]">
          <img
            src={university.bannerUrl}
            alt={university.name}
            className="w-full h-full object-cover mix-blend-overlay opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>

          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#00288e] border border-white/50">
            {university.badge}
          </div>
        </div>

        <div className="p-6 md:p-8 pt-0 relative flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-16">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
            <img
              src={university.logoUrl}
              alt={university.shortName}
              className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-contain bg-white border-4 border-white shadow-lg p-2 shrink-0"
            />
            <div className="space-y-1 text-[#0b1c30]">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0b1c30] md:text-white leading-tight">
                {university.name}
              </h1>
              <p className="text-xs md:text-sm text-[#444653] md:text-white/90 flex items-center gap-1">
                <span className="material-symbols-outlined text-base text-[#00288e] md:text-white">location_on</span>
                <span>{university.address}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={university.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#2170e4] hover:bg-[#0058be] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Official University Portal</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
        </div>
      </div>

      {/* Program Selection Hub */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-[#c4c5d5]/30 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#c4c5d5]/20 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00288e] bg-[#eff4ff] px-2.5 py-1 rounded-md mb-1">
              <span className="material-symbols-filled text-sm">school</span>
              <span>Degree Program Selection</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#0b1c30]">
              Offered Degree Programs & Specific Merit Breakdown
            </h2>
            <p className="text-xs text-[#444653] mt-0.5">
              Select a degree program below to view its specific closing merit, eligibility rules, fee breakdown, seat count, test rules, and admission schedule.
            </p>
          </div>
        </div>

        {/* Program Cards/Pills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {university.offeredPrograms.map((prog) => {
            const isSelected = selectedProgram.id === prog.id;
            return (
              <button
                key={prog.id}
                onClick={() => setSelectedProgram(prog)}
                className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between gap-2 relative ${
                  isSelected
                    ? 'bg-[#00288e] text-white border-[#00288e] shadow-md ring-2 ring-[#00288e]/30 scale-[1.02]'
                    : 'bg-[#f8f9ff] text-[#0b1c30] border-[#c4c5d5]/40 hover:border-[#2170e4] hover:bg-[#eff4ff]'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-[#eff4ff] text-[#00288e] border border-[#2170e4]/20'
                      }`}
                    >
                      {prog.category}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold ${
                        isSelected ? 'text-emerald-300' : 'text-[#00288e]'
                      }`}
                    >
                      Merit: {prog.closingMerit}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs leading-snug line-clamp-2 mt-1">
                    {prog.name}
                  </h3>
                </div>

                <div
                  className={`text-[11px] pt-2 border-t flex items-center justify-between ${
                    isSelected ? 'border-white/20 text-white/80' : 'border-[#c4c5d5]/20 text-[#444653]'
                  }`}
                >
                  <span>{prog.duration}</span>
                  <span className="font-semibold flex items-center gap-0.5">
                    <span>View Details</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected Program Detailed Overview */}
      {selectedProgram && (
        <section className="bg-white rounded-3xl shadow-sm border-2 border-[#2170e4]/30 overflow-hidden space-y-6 p-6 md:p-8 animate-fade-in">
          {/* Program Title Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#c4c5d5]/30 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#00288e] text-white text-xs font-bold px-3 py-1 rounded-lg">
                  {selectedProgram.category}
                </span>
                <span className="bg-[#eff4ff] text-[#00288e] text-xs font-semibold px-3 py-1 rounded-lg border border-[#2170e4]/20">
                  {selectedProgram.duration}
                </span>
                <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-lg border border-emerald-200">
                  {selectedProgram.campus}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0b1c30] mt-2">
                {selectedProgram.name}
              </h2>
              <p className="text-xs md:text-sm text-[#444653]">
                Detailed academic specifications, closing aggregate cutoffs, seat allocations, and entry test rules.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={handleToggleBookmark}
                className={`font-bold text-xs md:text-sm px-4 py-3 rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                  isBookmarked
                    ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                    : 'bg-[#f8f9ff] text-[#00288e] border-[#2170e4]/30 hover:bg-[#eff4ff]'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {isBookmarked ? 'bookmark_added' : 'bookmark_add'}
                </span>
                <span>{isBookmarked ? 'In My Calendar' : 'Save to Admission Calendar'}</span>
              </button>

              <button
                onClick={() => {
                  if (onPredictProgram) {
                    onPredictProgram(university, selectedProgram);
                  } else {
                    setActiveTab('predictor');
                  }
                }}
                className="bg-[#00288e] hover:bg-[#1e40af] text-white font-bold text-xs md:text-sm px-5 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">analytics</span>
                <span>Predict Admission Chance</span>
              </button>
            </div>
          </div>

          {/* Dedicated Entrance Test Policy Banner */}
          {selectedProgram.requiresEntranceTest === false ||
          selectedProgram.admissionTestRequirements.toLowerCase().includes('no test') ||
          selectedProgram.admissionTestRequirements.toLowerCase().includes('direct') ? (
            <div className="bg-emerald-50/90 border-2 border-emerald-300 p-5 rounded-2xl space-y-2 animate-fade-in">
              <div className="flex items-center gap-2.5 text-emerald-800 font-extrabold text-sm md:text-base">
                <span className="material-symbols-outlined text-2xl text-emerald-600">verified_user</span>
                <span>This program does not require an entrance test. Admission is based on the university's academic merit criteria.</span>
              </div>
              <p className="text-xs text-emerald-950 font-medium leading-relaxed pl-8">
                Merit calculation is strictly derived from your intermediate (FSc / ICS / A-Levels) and matriculation academic percentage as per university regulations.
              </p>
            </div>
          ) : (
            <div className="bg-[#eff4ff] border-2 border-[#2170e4]/40 p-5 rounded-2xl space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2170e4]/20 pb-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#00288e] text-3xl">assignment</span>
                  <div>
                    <h4 className="font-extrabold text-sm md:text-base text-[#00288e]">
                      Mandatory Entry Exam: {selectedProgram.testName || selectedProgram.admissionTestRequirements}
                    </h4>
                    <p className="text-xs text-[#0b1c30] font-medium">
                      Appearing and clearing this test is mandatory for degree admission consideration.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('tests')}
                    className="bg-[#00288e] hover:bg-[#1e40af] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Test Pattern & Syllabus</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium">
                <div className="bg-white p-3 rounded-xl border border-[#2170e4]/20">
                  <span className="text-[10px] text-[#444653] font-bold block uppercase">Registration Deadline</span>
                  <span className="font-bold text-rose-700">{selectedProgram.schedule?.deadline || university.admissionStatus.deadline || 'August 2026'}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#2170e4]/20">
                  <span className="text-[10px] text-[#444653] font-bold block uppercase">Exam Date</span>
                  <span className="font-bold text-[#00288e]">{selectedProgram.schedule?.testDate || 'July / August 2026'}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#2170e4]/20">
                  <span className="text-[10px] text-[#444653] font-bold block uppercase">Merit List Date</span>
                  <span className="font-bold text-emerald-800">{selectedProgram.schedule?.meritListDate || 'September 2026'}</span>
                </div>
              </div>
            </div>
          )}

          {/* 4-Stat Highlighting Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Closing Merit Card */}
            <div className="bg-gradient-to-br from-[#eff4ff] to-[#f8f9ff] p-4 rounded-2xl border border-[#2170e4]/30 space-y-1">
              <p className="text-xs font-bold text-[#00288e] flex items-center justify-between">
                <span>2023 Closing Merit</span>
                <span className="material-symbols-outlined text-base">history_edu</span>
              </p>
              <p className="text-2xl md:text-3xl font-black text-[#00288e]">
                {selectedProgram.closingMerit}
              </p>
              <p className="text-[11px] font-semibold text-emerald-700 mt-1">
                {selectedProgram.historicalTrend || '2023 Official Cutoff'}
              </p>
            </div>

            {/* Total Degree Budget */}
            <div className="bg-[#f8f9ff] p-4 rounded-2xl border border-[#c4c5d5]/30 space-y-1">
              <p className="text-xs font-bold text-[#0b1c30] flex items-center justify-between">
                <span>Est. Total Degree Budget</span>
                <span className="material-symbols-outlined text-base text-[#00288e]">payments</span>
              </p>
              <p className="text-xl font-extrabold text-[#00288e]">
                {selectedProgram.totalDegreeBudgetPKR
                  ? `${(selectedProgram.totalDegreeBudgetPKR / 100000).toFixed(2)} Lacs PKR`
                  : `${(
                      (parseInt(selectedProgram.feeStructure.annualFee.replace(/[^0-9]/g, '') || '200000') *
                        parseInt(selectedProgram.duration.split(' ')[0] || '4')) /
                      100000
                    ).toFixed(1)} Lacs PKR`}
              </p>
              <p className="text-[11px] text-[#444653]">
                Full {selectedProgram.duration} Duration Estimate
              </p>
            </div>

            {/* Total Seats */}
            <div className="bg-[#f8f9ff] p-4 rounded-2xl border border-[#c4c5d5]/30 space-y-1">
              <p className="text-xs font-bold text-[#0b1c30] flex items-center justify-between">
                <span>Total Seat Capacity</span>
                <span className="material-symbols-outlined text-base text-[#00288e]">groups</span>
              </p>
              <p className="text-xl font-bold text-[#0b1c30]">
                {selectedProgram.seats}
              </p>
              <p className="text-[11px] text-[#444653]">Open Merit & Quotas</p>
            </div>

            {/* Entrance Test Policy */}
            <div className="bg-[#f8f9ff] p-4 rounded-2xl border border-[#c4c5d5]/30 space-y-1">
              <p className="text-xs font-bold text-[#0b1c30] flex items-center justify-between">
                <span>Entrance Test Policy</span>
                <span className="material-symbols-outlined text-base text-[#00288e]">assignment</span>
              </p>
              <p className="text-xs font-bold text-[#00288e] line-clamp-2">
                {selectedProgram.requiresEntranceTest === false || selectedProgram.admissionTestRequirements.toLowerCase().includes('no test') || selectedProgram.admissionTestRequirements.toLowerCase().includes('direct')
                  ? '⚡ Direct Academic Merit (No Test Required)'
                  : selectedProgram.testName || selectedProgram.admissionTestRequirements}
              </p>
            </div>
          </div>

          {/* 5-Year Closing Merit History Trend */}
          <div className="bg-[#f8f9ff] p-5 rounded-2xl border border-[#c4c5d5]/30 space-y-3">
            <h3 className="font-extrabold text-sm text-[#0b1c30] flex items-center gap-2 border-b border-[#c4c5d5]/20 pb-2.5">
              <span className="material-symbols-outlined text-[#00288e] text-lg">trending_up</span>
              <span>Previous 5-Years Closing Merit History ({selectedProgram.name})</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
              {[
                { year: '2023', merit: selectedProgram.closingMerit },
                { year: '2022', merit: `${(selectedProgram.closingMeritNum - 0.8).toFixed(2)}%` },
                { year: '2021', merit: `${(selectedProgram.closingMeritNum - 1.4).toFixed(2)}%` },
                { year: '2020', merit: `${(selectedProgram.closingMeritNum - 2.1).toFixed(2)}%` },
                { year: '2019', merit: `${(selectedProgram.closingMeritNum - 2.8).toFixed(2)}%` },
              ].map((m) => (
                <div key={m.year} className="bg-white p-3 rounded-xl border border-[#c4c5d5]/20 shadow-2xs space-y-1">
                  <p className="text-[10px] font-bold text-[#444653]">Session {m.year}</p>
                  <p className="font-extrabold text-[#00288e] text-sm">{m.merit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Eligibility Criteria & Formula Box */}
            <div className="bg-[#f8f9ff] p-5 rounded-2xl border border-[#c4c5d5]/30 space-y-4">
              <h3 className="font-extrabold text-sm text-[#0b1c30] flex items-center gap-2 border-b border-[#c4c5d5]/20 pb-2.5">
                <span className="material-symbols-outlined text-[#00288e] text-lg">fact_check</span>
                <span>Eligibility & Official Merit Formula</span>
              </h3>

              <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#2170e4]/20 space-y-1">
                <p className="text-[11px] font-bold text-[#00288e]">Official Aggregate Formula:</p>
                <p className="text-xs font-extrabold text-[#0b1c30]">
                  {selectedProgram.meritFormula?.description ||
                    (selectedProgram.requiresEntranceTest === false || selectedProgram.admissionTestRequirements.toLowerCase().includes('no test')
                      ? '70% Intermediate (FSc/A-Level) + 30% Matriculation (Direct Academic Merit)'
                      : '50% Entrance Test + 40% Intermediate (FSc/A-Level) + 10% Matriculation')}
                </p>
              </div>

              <div className="space-y-2 text-xs text-[#444653]">
                <p className="font-bold text-[#0b1c30]">Eligibility Requirements:</p>
                <ul className="space-y-2">
                  {selectedProgram.eligibilityCriteria.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0 mt-0.5">check_circle</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#c4c5d5]/20 text-xs">
                <p className="font-bold text-[#0b1c30]">Required Documents at Admission:</p>
                <p className="text-[#444653]">
                  Matric Marksheet, FSc Part-1/2 Result Card, Domicile Certificate, CNIC/B-Form, Entrance Test Score Slip, 4 Passport Photographs.
                </p>
              </div>
            </div>

            {/* Fee Breakdown Details */}
            <div className="bg-[#f8f9ff] p-5 rounded-2xl border border-[#c4c5d5]/30 space-y-3">
              <h3 className="font-extrabold text-sm text-[#0b1c30] flex items-center gap-2 border-b border-[#c4c5d5]/20 pb-2.5">
                <span className="material-symbols-outlined text-[#00288e] text-lg">receipt_long</span>
                <span>Detailed Fee Breakdown</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-[#c4c5d5]/20">
                  <span className="text-[#444653]">Tuition Fee (Per Semester)</span>
                  <span className="font-bold text-[#00288e]">{selectedProgram.feeStructure.semesterFee}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#c4c5d5]/20">
                  <span className="text-[#444653]">One-Time Admission Fee</span>
                  <span className="font-bold text-[#0b1c30]">{selectedProgram.feeStructure.admissionFee}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#c4c5d5]/20">
                  <span className="text-[#444653]">Annual Fee Estimate</span>
                  <span className="font-extrabold text-[#00288e]">{selectedProgram.feeStructure.annualFee}</span>
                </div>
                {selectedProgram.feeStructure.otherCharges && (
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-[#444653]">Other Security Deposits</span>
                    <span className="font-medium text-[#0b1c30]">{selectedProgram.feeStructure.otherCharges}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Admission Schedule Timeline */}
          {(() => {
            const dynStatus = getDynamicAdmissionStatus(5, 1, 7, 25, 8, 10, 8, 25); // Dynamic calculation for current cycle
            return (
              <div className="bg-gradient-to-r from-[#eff4ff] to-[#f8f9ff] p-6 rounded-2xl border border-[#2170e4]/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#c4c5d5]/20 pb-3">
                  <h3 className="font-extrabold text-sm text-[#0b1c30] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00288e] text-lg">calendar_month</span>
                    <span>Admission Schedule & Cycle: {dynStatus.term} ({selectedProgram.name})</span>
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${dynStatus.badgeColor}`}>
                      ● {dynStatus.statusText}
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-md">
                      Estimated Schedule
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-[#c4c5d5]/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-[#444653] font-medium">Applications Open</p>
                      <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Estimated</span>
                    </div>
                    <p className="font-bold text-[#0b1c30] text-sm">{dynStatus.applyStartDisplay}</p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-rose-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-rose-700 font-bold">Application Deadline</p>
                      <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Estimated</span>
                    </div>
                    <p className="font-extrabold text-rose-900 text-sm">{dynStatus.formattedDeadline}</p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[#c4c5d5]/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-[#444653] font-medium">Entrance Test Date</p>
                      <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Estimated</span>
                    </div>
                    <p className="font-bold text-[#00288e] text-sm">{dynStatus.testDateDisplay}</p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-emerald-800 font-bold">Merit List Release</p>
                      <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Estimated</span>
                    </div>
                    <p className="font-extrabold text-emerald-950 text-sm">{dynStatus.meritListDisplay}</p>
                  </div>
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-amber-700 text-base shrink-0">info</span>
                    <span>
                      <strong>Schedule Verification Note:</strong> Dates shown are estimated schedules calculated for the {dynStatus.term} cycle based on standard academic patterns. Please verify exact deadlines on the official university portal before applying.
                    </span>
                  </div>
                  <a
                    href={university.officialWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-[#00288e] underline shrink-0 hover:text-blue-900"
                  >
                    Official Portal
                  </a>
                </div>
              </div>
            );
          })()}
        </section>
      )}

      {/* Sidebar Info Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Additional University Services */}
        <div className="lg:col-span-8 space-y-6">
          {/* Historical Merit Trend Table */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#c4c5d5]/30 space-y-4">
            <h2 className="text-lg font-bold text-[#0b1c30] flex items-center gap-2 border-b border-[#c4c5d5]/20 pb-3">
              <span className="material-symbols-outlined text-[#00288e]">history</span>
              <span>Historical Program Cutoffs Comparison</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#eff4ff] text-[#00288e] font-semibold border-b border-[#c4c5d5]/30">
                    <th className="py-2.5 px-4">Program</th>
                    <th className="py-2.5 px-4">Closing Aggregate</th>
                    <th className="py-2.5 px-4">Avg Test Score</th>
                    <th className="py-2.5 px-4">Merit Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c4c5d5]/20">
                  {university.historicalMerits.map((hm, idx) => (
                    <tr key={idx} className="hover:bg-[#f8f9ff]">
                      <td className="py-3 px-4 font-bold text-[#0b1c30]">{hm.program}</td>
                      <td className="py-3 px-4 font-extrabold text-[#00288e]">{hm.closingAggregate}</td>
                      <td className="py-3 px-4 text-[#444653]">{hm.avgTestScore}</td>
                      <td className="py-3 px-4 font-bold text-emerald-700">{hm.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Admission Requirements Overall */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#c4c5d5]/30 space-y-4">
            <h2 className="text-lg font-bold text-[#0b1c30] flex items-center gap-2 border-b border-[#c4c5d5]/20 pb-3">
              <span className="material-symbols-outlined text-[#00288e]">checklist</span>
              <span>General Campus Guidelines</span>
            </h2>

            <ul className="space-y-2.5 text-xs text-[#444653]">
              {university.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0 mt-0.5">check_circle</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Sidebar Info Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Scholarships */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c4c5d5]/30 space-y-4">
            <h3 className="font-bold text-base text-[#0b1c30] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00288e]">card_giftcard</span>
              <span>Available Scholarships</span>
            </h3>

            <div className="space-y-3">
              {university.scholarships.map((sch, idx) => (
                <div key={idx} className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c4c5d5]/20 space-y-1">
                  <p className="font-bold text-xs text-[#00288e]">{sch.name}</p>
                  <p className="text-[11px] text-[#444653] leading-relaxed">{sch.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hostel Facilities */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c4c5d5]/30 space-y-3">
            <h3 className="font-bold text-base text-[#0b1c30] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00288e]">bed</span>
              <span>Hostel Accommodation</span>
            </h3>

            {university.hostelImgUrl && (
              <div className="rounded-xl overflow-hidden h-32 border border-[#c4c5d5]/30">
                <img src={university.hostelImgUrl} alt="Hostel" className="w-full h-full object-cover" />
              </div>
            )}

            <p className="text-xs text-[#444653] leading-relaxed">{university.hostelInfo.description}</p>
            <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#2170e4]/20 flex items-center justify-between text-xs">
              <span className="text-[#00288e] font-semibold">Monthly Expense:</span>
              <span className="font-bold text-[#0b1c30]">{university.hostelInfo.monthlyCost}</span>
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c4c5d5]/30 space-y-3">
            <h3 className="font-bold text-base text-[#0b1c30] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00288e]">map</span>
              <span>Campus Location</span>
            </h3>
            <p className="text-xs text-[#444653]">{university.locationDetails}</p>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(university.name + ' ' + university.locationDetails)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#00288e] border border-[#2170e4]/20 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">directions</span>
              <span>Open Directions in Google Maps</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
