import React, { useState, useMemo } from 'react';
import { UNIVERSITIES } from '../data/universities';
import { University, Program, PredictionResult } from '../types';
import { getCurrentAdmissionTerm } from '../utils/admissionCycle';

interface PredictorViewProps {
  onSelectUniversity: (uni: University, programId?: string) => void;
  setActiveTab: (tab: 'home' | 'search' | 'predictor' | 'counselor' | 'about') => void;
  initialProgramName?: string;
}

// Popular degree programs in Pakistani universities with test policies
const DEGREE_PROGRAM_OPTIONS = [
  { name: 'BS Computer Science', category: 'Computer Science', testName: 'NUST NET / FAST Test / ECAT / NTS NAT', requiresTest: true },
  { name: 'MBBS (Bachelor of Medicine & Surgery)', category: 'Medical', testName: 'MDCAT', requiresTest: true },
  { name: 'BDS (Bachelor of Dental Surgery)', category: 'Medical', testName: 'MDCAT', requiresTest: true },
  { name: 'DVM (Doctor of Veterinary Medicine)', category: 'Medical', testName: 'MDCAT or UVAS Entry Test', requiresTest: true },
  { name: 'BS Microbiology', category: 'Science', testName: 'None (Direct Academic Merit)', requiresTest: false },
  { name: 'BS Biotechnology', category: 'Science', testName: 'None (Direct Academic Merit)', requiresTest: false },
  { name: 'BS Software Engineering', category: 'Engineering', testName: 'ECAT / NET / FAST Test', requiresTest: true },
  { name: 'BS Artificial Intelligence', category: 'Computer Science', testName: 'NET / FAST Test / ECAT', requiresTest: true },
  { name: 'BS Data Science', category: 'Computer Science', testName: 'NET / FAST Test', requiresTest: true },
  { name: 'BBA (Honors)', category: 'Business', testName: 'University Test / NTS NAT', requiresTest: true },
  { name: 'Doctor of Physical Therapy (DPT)', category: 'Medical', testName: 'MDCAT', requiresTest: true },
  { name: 'Law (LLB)', category: 'Law', testName: 'LAT (Law Admission Test)', requiresTest: true },
  { name: 'BS Mathematics', category: 'Science', testName: 'None (Direct Academic Merit)', requiresTest: false },
  { name: 'BS Physics', category: 'Science', testName: 'None (Direct Academic Merit)', requiresTest: false },
  { name: 'BS English', category: 'Arts', testName: 'None (Direct Academic Merit)', requiresTest: false },
  { name: 'BS Psychology', category: 'Social Sciences', testName: 'None (Direct Academic Merit)', requiresTest: false },
  { name: 'BS Mechanical Engineering', category: 'Engineering', testName: 'ECAT / NET', requiresTest: true },
];

export const PredictorView: React.FC<PredictorViewProps> = ({
  onSelectUniversity,
  setActiveTab,
  initialProgramName,
}) => {
  const [matric, setMatric] = useState<number>(88);
  const [inter, setInter] = useState<number>(85);
  const [entryTest, setEntryTest] = useState<number>(82);
  const [selectedDegree, setSelectedDegree] = useState<string>(
    initialProgramName || 'BS Computer Science'
  );
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>('All');
  const [budget, setBudget] = useState<number>(3000000);
  const [province, setProvince] = useState<string>('Punjab');
  const [city, setCity] = useState<string>('Lahore');

  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<PredictionResult[] | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  // Check if current selected degree program requires an entrance test
  const selectedDegreeInfo = useMemo(() => {
    const found = DEGREE_PROGRAM_OPTIONS.find((d) => d.name === selectedDegree);
    if (found) return found;

    const lower = selectedDegree.toLowerCase();
    if (lower.includes('microbiology') || lower.includes('biotech') || lower.includes('zoology') || lower.includes('botany') || lower.includes('math') || lower.includes('english')) {
      return { name: selectedDegree, category: 'Science', testName: 'None (Direct Academic Merit)', requiresTest: false };
    }
    return { name: selectedDegree, category: 'General', testName: 'Entrance Test Required', requiresTest: true };
  }, [selectedDegree]);

  const requiresTest = selectedDegreeInfo.requiresTest;

  // Compute aggregate percentage based on program rules
  const calculateUserAggregate = () => {
    if (!requiresTest) {
      // Direct academic formula: 70% FSC + 30% Matric
      return (inter * 0.7) + (matric * 0.3);
    }

    const isMedical = selectedDegree.includes('MBBS') || selectedDegree.includes('BDS') || selectedDegree.includes('DVM') || selectedDegree.includes('DPT');
    if (isMedical) {
      // Standard PMDC MDCAT Formula: 50% MDCAT + 40% FSC + 10% Matric
      return (entryTest * 0.5) + (inter * 0.4) + (matric * 0.1);
    }

    const isLaw = selectedDegree.includes('Law') || selectedDegree.includes('LLB');
    if (isLaw) {
      // Standard HEC LAT Formula: 50% LAT + 40% FSC + 10% Matric
      return (entryTest * 0.5) + (inter * 0.4) + (matric * 0.1);
    }

    // Standard Engineering / CS / Business Formula: 50% Test + 40% FSC + 10% Matric
    return (entryTest * 0.5) + (inter * 0.4) + (matric * 0.1);
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const userAgg = calculateUserAggregate();
    const mappedResults: PredictionResult[] = [];

    const universityPool = selectedUniversityId === 'All'
      ? UNIVERSITIES
      : UNIVERSITIES.filter((u) => u.id === selectedUniversityId);

    universityPool.forEach((uni) => {
      // Find programs that match selectedDegree or general category
      const matchedProgs = uni.offeredPrograms.filter(
        (prog) =>
          prog.name.toLowerCase().includes(selectedDegree.toLowerCase().split(' ')[0]) ||
          selectedDegree.toLowerCase().includes(prog.name.toLowerCase().split(' ')[0]) ||
          prog.category.toLowerCase() === selectedDegreeInfo.category.toLowerCase()
      );

      const programToMatch: Program = matchedProgs[0] || uni.offeredPrograms[0];
      const targetMeritNum = programToMatch.closingMeritNum || uni.closingMerit;

      const diff = userAgg - targetMeritNum;
      let category: 'Safe' | 'Target' | 'Reach' = 'Target';
      let matchProbability = 50;
      let reason = '';

      if (diff >= 2.5) {
        category = 'Safe';
        matchProbability = Math.min(98, Math.round(85 + diff * 2));
        reason = `Your aggregate (${userAgg.toFixed(1)}%) comfortably exceeds ${uni.shortName}'s closing merit cutoff for ${programToMatch.name} (${programToMatch.closingMerit}).`;
      } else if (diff >= -3.0) {
        category = 'Target';
        matchProbability = Math.round(65 + diff * 5);
        reason = `Competitive candidate. Your aggregate (${userAgg.toFixed(1)}%) is on the merit line for ${programToMatch.name} (${programToMatch.closingMerit}).`;
      } else {
        category = 'Reach';
        matchProbability = Math.max(10, Math.round(40 + diff * 4));
        reason = `Highly competitive cutoff gap (${Math.abs(diff).toFixed(1)}%). Boosting Intermediate/Test scores is recommended for ${programToMatch.name}.`;
      }

      mappedResults.push({
        university: uni,
        matchedProgram: programToMatch,
        calculatedAggregate: Number(userAgg.toFixed(1)),
        category,
        matchProbability,
        recommendationReason: reason,
      });
    });

    mappedResults.sort((a, b) => b.matchProbability - a.matchProbability);
    setResults(mappedResults);

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matricPercentage: matric,
          interPercentage: inter,
          entryTestScore: requiresTest ? entryTest : 0,
          preferredField: selectedDegreeInfo.category,
          selectedDegreeProgram: selectedDegree,
          annualBudget: budget,
          province,
          city,
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setAiAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('Prediction API call failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 space-y-10 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#c4c5d5]/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00288e] bg-[#eff4ff] px-3 py-1 rounded-full mb-2">
            <span className="material-symbols-filled text-sm">calculate</span>
            <span>Realistic Pakistani Admission Predictor Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30]">
            Degree Program Admission Predictor
          </h1>
          <p className="text-sm text-[#444653] mt-1">
            Calculate your exact aggregate percentage based on official HEC, PMDC, and university merit policies. Supports both entrance test programs (MDCAT, LAT, ECAT, NET) and direct academic merit programs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c4c5d5]/30 space-y-4">
            <h2 className="text-lg font-bold text-[#0b1c30] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00288e]">insights</span>
              <span>Smart Policy & Merit Logic</span>
            </h2>
            <ul className="space-y-3 text-xs text-[#444653]">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#eff4ff] text-[#00288e] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                <span><strong>Entrance Test Rule Detection:</strong> Programs like BS Microbiology, BS Math, or ADP use <em>Direct Academic Merit</em> (No entrance test required). Medical programs require <em>MDCAT</em> and Law requires <em>LAT</em>.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#eff4ff] text-[#00288e] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                <span><strong>PMDC & HEC Weightage Formulas:</strong> PMDC Formula (50% MDCAT + 40% FSC + 10% Matric), LAT Formula (50% LAT + 40% FSC + 10% Matric), or Academic Formula (70% FSC + 30% Matric).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#eff4ff] text-[#00288e] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                <span><strong>5-Year Closing Merit Trends:</strong> Evaluates your chances against historical closing merit cutoffs from 2019 to 2023.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#c4c5d5]/30 space-y-6">
          <div className="flex items-center justify-between border-b border-[#c4c5d5]/20 pb-4">
            <h3 className="text-lg font-bold text-[#0b1c30]">Select Program & Academic Marks</h3>
            <span className="text-xs bg-[#eff4ff] text-[#00288e] font-bold px-3 py-1 rounded-full">
              {getCurrentAdmissionTerm().term} Admissions Open
            </span>
          </div>

          <form onSubmit={handlePredict} className="space-y-5 text-sm">
            {/* Target Degree Program Picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-[#00288e]">
                Target Degree Program <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#00288e] text-lg">school</span>
                <select
                  value={selectedDegree}
                  onChange={(e) => setSelectedDegree(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#eff4ff] border-2 border-[#2170e4]/30 rounded-xl focus:outline-none focus:border-[#00288e] text-[#0b1c30] font-bold cursor-pointer"
                >
                  {DEGREE_PROGRAM_OPTIONS.map((deg) => (
                    <option key={deg.name} value={deg.name}>
                      {deg.name} — {deg.requiresTest ? `Requires ${deg.testName}` : 'Direct Academic Merit (No Test)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target University Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#0b1c30]">
                Select Target University (Optional)
              </label>
              <select
                value={selectedUniversityId}
                onChange={(e) => setSelectedUniversityId(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#c4c5d5] rounded-xl focus:outline-none focus:border-[#00288e] text-[#0b1c30] font-medium"
              >
                <option value="All">All HEC-Recognized Universities ({UNIVERSITIES.length})</option>
                {UNIVERSITIES.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.city}, {u.province})
                  </option>
                ))}
              </select>
            </div>

            {/* Smart Test Notice */}
            {!requiresTest ? (
              <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl flex items-start gap-3 text-emerald-950 text-xs">
                <span className="material-symbols-outlined text-emerald-600 text-xl shrink-0 mt-0.5">verified</span>
                <div>
                  <p className="font-extrabold text-sm text-emerald-900">Direct Academic Merit (No Entrance Test Required)</p>
                  <p className="mt-0.5 opacity-90">
                    For <strong>{selectedDegree}</strong>, admission is based directly on academic marks (70% Intermediate + 30% Matriculation). No entrance test score is required.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[#eff4ff] border border-[#2170e4]/30 p-3 rounded-xl flex items-center gap-2 text-xs text-[#00288e]">
                <span className="material-symbols-outlined text-base">assignment</span>
                <span>
                  Required Entrance Test for <strong>{selectedDegree}</strong>: <strong>{selectedDegreeInfo.testName}</strong>
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Matric Marks */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0b1c30]">
                  Matric / O-Level Marks (%) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#444653] text-lg">grade</span>
                  <input
                    type="number"
                    min="40"
                    max="100"
                    value={matric}
                    onChange={(e) => setMatric(Number(e.target.value))}
                    required
                    className="w-full pl-10 pr-3 py-2 bg-[#f8f9ff] border border-[#c4c5d5] rounded-xl focus:outline-none focus:border-[#00288e] text-[#0b1c30] font-medium"
                    placeholder="e.g. 88"
                  />
                </div>
              </div>

              {/* Inter Marks */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0b1c30]">
                  Intermediate / A-Level Marks (%) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#444653] text-lg">description</span>
                  <input
                    type="number"
                    min="40"
                    max="100"
                    value={inter}
                    onChange={(e) => setInter(Number(e.target.value))}
                    required
                    className="w-full pl-10 pr-3 py-2 bg-[#f8f9ff] border border-[#c4c5d5] rounded-xl focus:outline-none focus:border-[#00288e] text-[#0b1c30] font-medium"
                    placeholder="e.g. 85"
                  />
                </div>
              </div>
            </div>

            {/* Entrance Test Score Input - Only shown if requiresTest is true */}
            {requiresTest && (
              <div className="space-y-1.5 bg-[#f8f9ff] p-3.5 rounded-xl border border-[#c4c5d5]/30">
                <label className="block text-xs font-extrabold text-[#00288e] flex items-center justify-between">
                  <span>Entrance Test Score (%) — ({selectedDegreeInfo.testName})</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#00288e] text-lg">assignment_turned_in</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={entryTest}
                    onChange={(e) => setEntryTest(Number(e.target.value))}
                    required={requiresTest}
                    className="w-full pl-10 pr-3 py-2 bg-white border border-[#2170e4]/40 rounded-xl focus:outline-none focus:border-[#00288e] text-[#0b1c30] font-bold"
                    placeholder="e.g. 82"
                  />
                </div>
                <p className="text-[10px] text-[#444653]">
                  Enter your percentage score in {selectedDegreeInfo.testName}.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00288e] hover:bg-[#1e40af] text-white py-3.5 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                  <span>Calculating Official Aggregate for {selectedDegree}...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">analytics</span>
                  <span>Predict Admission Chances for {selectedDegree}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Results Display */}
      {results && (
        <div className="space-y-8 animate-fade-in pt-6 border-t border-[#c4c5d5]/30">
          <div className="bg-[#eff4ff] p-6 rounded-2xl border border-[#2170e4]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#00288e] font-bold uppercase tracking-wider">
                Calculated Admission Aggregate for {selectedDegree}
              </p>
              <h2 className="text-3xl font-extrabold text-[#0b1c30] mt-1">
                {calculateUserAggregate().toFixed(2)}%
              </h2>
              <p className="text-xs text-[#444653] mt-1">
                Formula used: {requiresTest ? 'Entrance Test + Intermediate + Matriculation Weightage' : '70% Intermediate + 30% Matriculation (Direct Merit)'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('counselor')}
                className="bg-[#00288e] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-[#1e40af]"
              >
                <span className="material-symbols-outlined text-sm">smart_toy</span>
                <span>Discuss {selectedDegree} Options with AI Counselor</span>
              </button>
            </div>
          </div>

          {/* Categorized Matches */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#0b1c30]">
              University Admission Predictions for {selectedDegree}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Safe Matches */}
              <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-emerald-900 flex items-center gap-1.5 text-sm">
                    <span className="material-symbols-filled text-emerald-600">check_circle</span>
                    <span>Safe Options (&gt;85% Probability)</span>
                  </h4>
                </div>
                <div className="space-y-3">
                  {results
                    .filter((r) => r.category === 'Safe')
                    .map((res) => (
                      <div
                        key={res.university.id}
                        onClick={() => onSelectUniversity(res.university, res.matchedProgram.id)}
                        className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-sm cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-xs text-[#0b1c30]">{res.university.shortName}</p>
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                            {res.matchProbability}%
                          </span>
                        </div>
                        <div className="text-[11px] text-[#00288e] font-semibold bg-[#eff4ff] p-2 rounded-lg border border-[#2170e4]/10">
                          Program: {res.matchedProgram.name} (Cutoff: {res.matchedProgram.closingMerit})
                        </div>
                        <p className="text-[10px] text-[#444653] leading-snug">{res.recommendationReason}</p>
                      </div>
                    ))}
                  {results.filter((r) => r.category === 'Safe').length === 0 && (
                    <p className="text-xs text-emerald-800 italic">No safe matches found for {selectedDegree} with current scores. Consider aiming for target/reach universities or boosting marks.</p>
                  )}
                </div>
              </div>

              {/* Target Matches */}
              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-amber-900 flex items-center gap-1.5 text-sm">
                    <span className="material-symbols-filled text-amber-600">adjust</span>
                    <span>Target Options (50-84% Probability)</span>
                  </h4>
                </div>
                <div className="space-y-3">
                  {results
                    .filter((r) => r.category === 'Target')
                    .map((res) => (
                      <div
                        key={res.university.id}
                        onClick={() => onSelectUniversity(res.university, res.matchedProgram.id)}
                        className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-sm cursor-pointer hover:border-amber-500 hover:shadow-md transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-xs text-[#0b1c30]">{res.university.shortName}</p>
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                            {res.matchProbability}%
                          </span>
                        </div>
                        <div className="text-[11px] text-[#00288e] font-semibold bg-[#eff4ff] p-2 rounded-lg border border-[#2170e4]/10">
                          Program: {res.matchedProgram.name} (Cutoff: {res.matchedProgram.closingMerit})
                        </div>
                        <p className="text-[10px] text-[#444653] leading-snug">{res.recommendationReason}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Reach Matches */}
              <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-blue-900 flex items-center gap-1.5 text-sm">
                    <span className="material-symbols-filled text-blue-600">stars</span>
                    <span>Reach Options (&lt;50% Probability)</span>
                  </h4>
                </div>
                <div className="space-y-3">
                  {results
                    .filter((r) => r.category === 'Reach')
                    .map((res) => (
                      <div
                        key={res.university.id}
                        onClick={() => onSelectUniversity(res.university, res.matchedProgram.id)}
                        className="bg-white p-3.5 rounded-xl border border-blue-200 shadow-sm cursor-pointer hover:border-blue-500 hover:shadow-md transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-xs text-[#0b1c30]">{res.university.shortName}</p>
                          <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            {res.matchProbability}%
                          </span>
                        </div>
                        <div className="text-[11px] text-[#00288e] font-semibold bg-[#eff4ff] p-2 rounded-lg border border-[#2170e4]/10">
                          Program: {res.matchedProgram.name} (Cutoff: {res.matchedProgram.closingMerit})
                        </div>
                        <p className="text-[10px] text-[#444653] leading-snug">{res.recommendationReason}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis Report */}
          {aiAnalysis && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#2170e4]/30 space-y-4">
              <div className="flex items-center gap-2 text-[#00288e]">
                <span className="material-symbols-filled text-xl">psychology</span>
                <h3 className="font-extrabold text-base text-[#0b1c30]">
                  AI Guidance Report for {selectedDegree}
                </h3>
              </div>
              <div className="text-xs text-[#444653] leading-relaxed whitespace-pre-line space-y-2">
                {aiAnalysis}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
