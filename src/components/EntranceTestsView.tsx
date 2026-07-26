import React, { useState, useMemo } from 'react';
import { ALL_ENTRANCE_TESTS, getEntranceTestById } from '../data/entranceTestsData';
import { EntranceTestDetails } from '../types';

interface EntranceTestsViewProps {
  initialTestId?: string;
  onOpenTestPrepModal?: () => void;
  onSelectUniversityByTest?: (testName: string) => void;
}

export const EntranceTestsView: React.FC<EntranceTestsViewProps> = ({
  initialTestId,
  onOpenTestPrepModal,
  onSelectUniversityByTest
}) => {
  const [selectedTestId, setSelectedTestId] = useState<string>(initialTestId || 'mdcat');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'pattern' | 'schedule' | 'prep' | 'faqs'>('overview');

  const selectedTest: EntranceTestDetails = useMemo(() => {
    return getEntranceTestById(selectedTestId) || ALL_ENTRANCE_TESTS[0];
  }, [selectedTestId]);

  const filteredTests = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return ALL_ENTRANCE_TESTS;
    return ALL_ENTRANCE_TESTS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.fullName.toLowerCase().includes(q) ||
        t.organizingBody.toLowerCase().includes(q) ||
        t.purpose.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#00288e] via-[#1a4fba] to-[#2170e4] text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>HEC & PMDC Recognized Testing Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Comprehensive Entrance Test Portal
            </h1>
            <p className="text-sm text-white/90 leading-relaxed">
              Complete guide to MDCAT, ECAT, NUST NET, FAST NU, NTS (NAT/GAT), HEC LAT, GIKI, PIEAS, NUMS, and university entrance tests. View patterns, schedules, preparation materials, and past paper packs.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs space-y-2 shrink-0 w-full md:w-auto">
            <div className="flex items-center justify-between gap-3 text-amber-300 font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Estimated Schedule</span>
              </span>
              <span className="bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded text-[10px]">VERIFY ON PORTAL</span>
            </div>
            <p className="text-white/90 text-[11px]">
              Structured for API integration; dates based on official academic cycles.
            </p>
            <p className="text-white/70 text-[10px]">
              Always verify exact dates on the testing body website.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Test List + Detailed Test Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Entrance Test Selector List */}
        <aside className="lg:col-span-4 bg-white p-5 rounded-2xl shadow-sm border border-[#c4c5d5]/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#c4c5d5]/20">
            <h2 className="font-extrabold text-sm text-[#0b1c30] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00288e] text-lg">assignment</span>
              <span>Entrance Tests ({filteredTests.length})</span>
            </h2>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#00288e] text-sm">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter test (e.g., MDCAT, ECAT, NET, LAT...)"
              className="w-full bg-[#f8f9ff] text-xs font-semibold pl-9 pr-3 py-2 rounded-xl border border-[#c4c5d5]/40 focus:outline-none focus:border-[#00288e] text-[#0b1c30]"
            />
          </div>

          {/* Test Buttons */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredTests.map((test) => {
              const isSelected = selectedTest.id === test.id;
              return (
                <button
                  key={test.id}
                  onClick={() => {
                    setSelectedTestId(test.id);
                    setActiveTab('overview');
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#00288e] text-white border-[#00288e] shadow-md'
                      : 'bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#0b1c30] border-[#c4c5d5]/30'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`font-extrabold text-xs md:text-sm ${isSelected ? 'text-white' : 'text-[#00288e]'}`}>
                        {test.name}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#eff4ff] text-[#00288e]'
                        }`}
                      >
                        {test.pattern.totalMcqs} MCQs
                      </span>
                    </div>
                    <p className={`text-[11px] line-clamp-1 ${isSelected ? 'text-white/80' : 'text-[#444653]'}`}>
                      {test.fullName}
                    </p>
                  </div>
                  <span className={`material-symbols-outlined text-sm ${isSelected ? 'text-white' : 'text-[#00288e]'}`}>
                    chevron_right
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Column: Selected Test Specs & Deep Dive */}
        <main className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-[#c4c5d5]/30 space-y-6">
          {/* Test Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#c4c5d5]/20">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-[#eff4ff] text-[#00288e] px-2.5 py-1 rounded-full border border-[#2170e4]/20">
                  {selectedTest.organizingBody}
                </span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                  Fee: PKR {selectedTest.registrationFeePKR.toLocaleString()}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#0b1c30]">
                {selectedTest.fullName} ({selectedTest.name})
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={selectedTest.officialWebsite}
                target="_blank"
                rel="noreferrer"
                className="bg-[#00288e] hover:bg-[#1e40af] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Official Registration Portal</span>
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>
          </div>

          {/* Nav Tabs for Detailed Views */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#c4c5d5]/20 text-xs font-bold no-scrollbar">
            {[
              { id: 'overview', label: 'Overview & Eligibility', icon: 'info' },
              { id: 'pattern', label: 'Test Pattern & Marks', icon: 'analytics' },
              { id: 'schedule', label: 'Registration & Schedule', icon: 'event' },
              { id: 'prep', label: 'Preparation & Past Papers', icon: 'auto_stories' },
              { id: 'faqs', label: 'FAQs & Guidelines', icon: 'help' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#00288e] text-white shadow-sm'
                      : 'bg-[#f8f9ff] text-[#444653] hover:bg-[#eff4ff] hover:text-[#00288e]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW & ELIGIBILITY */}
          {activeTab === 'overview' && (
            <div className="space-y-6 text-xs md:text-sm animate-fade-in">
              {/* Purpose Box */}
              <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#2170e4]/20 space-y-2">
                <h3 className="font-extrabold text-sm text-[#00288e] flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">target</span>
                  <span>Which Universities & Programs Accept {selectedTest.name}?</span>
                </h3>
                <p className="text-[#0b1c30] leading-relaxed font-medium">
                  {selectedTest.purpose}
                </p>
              </div>

              {/* Eligibility Criteria */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-sm text-[#0b1c30] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00288e] text-base">fact_check</span>
                  <span>Eligibility Criteria</span>
                </h3>
                <ul className="space-y-2">
                  {selectedTest.eligibility.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-[#f8f9ff] p-3 rounded-xl border border-[#c4c5d5]/30">
                      <span className="material-symbols-outlined text-emerald-600 text-sm mt-0.5 shrink-0">
                        check_circle
                      </span>
                      <span className="text-[#0b1c30] font-medium">{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Documents */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-sm text-[#0b1c30] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00288e] text-base">folder_shared</span>
                  <span>Required Documents for Registration</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedTest.requiredDocuments.map((doc, idx) => (
                    <div key={idx} className="bg-[#f8f9ff] p-2.5 rounded-xl border border-[#c4c5d5]/30 flex items-center gap-2 text-xs">
                      <span className="material-symbols-outlined text-[#00288e] text-sm">description</span>
                      <span className="text-[#0b1c30] font-medium">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEST PATTERN & MARKS */}
          {activeTab === 'pattern' && (
            <div className="space-y-6 text-xs md:text-sm animate-fade-in">
              {/* Pattern Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#c4c5d5]/30 text-center space-y-1">
                  <span className="text-[10px] text-[#444653] font-bold block uppercase">Total Questions</span>
                  <span className="text-xl font-extrabold text-[#00288e]">{selectedTest.pattern.totalMcqs} MCQs</span>
                </div>
                <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#c4c5d5]/30 text-center space-y-1">
                  <span className="text-[10px] text-[#444653] font-bold block uppercase">Total Duration</span>
                  <span className="text-xl font-extrabold text-[#00288e]">{selectedTest.pattern.durationMins} Mins</span>
                </div>
                <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#c4c5d5]/30 text-center space-y-1">
                  <span className="text-[10px] text-[#444653] font-bold block uppercase">Reg Fee</span>
                  <span className="text-xl font-extrabold text-emerald-700">PKR {selectedTest.registrationFeePKR.toLocaleString()}</span>
                </div>
              </div>

              {/* Marking Scheme Alert */}
              <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#2170e4]/20 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#00288e] text-xl shrink-0 mt-0.5">
                  info
                </span>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-xs text-[#00288e]">Marking Scheme & Evaluation Rules</h4>
                  <p className="text-xs text-[#0b1c30] font-medium">{selectedTest.pattern.markingScheme}</p>
                </div>
              </div>

              {/* Subjects Breakdown Progress Bars */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm text-[#0b1c30]">Subject-Wise Weightage Breakdown</h3>
                <div className="space-y-3">
                  {selectedTest.subjects.map((subj) => (
                    <div key={subj.name} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-bold text-[#0b1c30]">
                        <span>{subj.name}</span>
                        <span className="text-[#00288e]">{subj.mcqs} MCQs ({subj.percentage}%)</span>
                      </div>
                      <div className="w-full h-3 bg-[#e0e2ec] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#00288e] to-[#2170e4] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, subj.percentage * 2)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REGISTRATION & SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="space-y-6 text-xs md:text-sm animate-fade-in">
              {/* Schedule Disclaimer Note */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900 space-y-1.5 flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-700 text-xl shrink-0 mt-0.5">
                  warning
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-amber-900 uppercase tracking-wider">Estimated / Sample Schedule</span>
                    <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">Verify on Official Site</span>
                  </div>
                  <p className="text-xs leading-relaxed text-amber-800">
                    {selectedTest.scheduleDisclaimer ||
                      'The registration deadlines and exam dates shown below are estimated based on standard annual academic cycles. Exact dates must be confirmed directly on the official website.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#c4c5d5]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#00288e]">
                      <span className="material-symbols-outlined text-lg">event_available</span>
                      <span className="font-bold text-xs uppercase">Registration Start Date</span>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">Estimated</span>
                  </div>
                  <p className="text-base font-extrabold text-[#0b1c30]">{selectedTest.schedule.registrationStart}</p>
                </div>

                <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#c4c5d5]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-rose-600">
                      <span className="material-symbols-outlined text-lg">event_busy</span>
                      <span className="font-bold text-xs uppercase">Registration Deadline</span>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">Estimated</span>
                  </div>
                  <p className="text-base font-extrabold text-rose-700">{selectedTest.schedule.registrationDeadline}</p>
                </div>

                <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#2170e4]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#00288e]">
                      <span className="material-symbols-outlined text-lg">edit_calendar</span>
                      <span className="font-bold text-xs uppercase">Exam Session Dates</span>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">Estimated</span>
                  </div>
                  <div className="space-y-1">
                    {selectedTest.schedule.testDates.map((d, i) => (
                      <p key={i} className="text-sm font-extrabold text-[#00288e]">
                        • {d}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#c4c5d5]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <span className="material-symbols-outlined text-lg">campaign</span>
                      <span className="font-bold text-xs uppercase">Result Announcement Date</span>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">Estimated</span>
                  </div>
                  <p className="text-base font-extrabold text-emerald-800">{selectedTest.schedule.resultDate}</p>
                </div>
              </div>

              {/* Registration Direct CTA */}
              <div className="bg-gradient-to-r from-[#0b1c30] to-[#00288e] text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Ready to apply for {selectedTest.name}?</h4>
                  <p className="text-xs text-white/80">Ensure your required documents are ready before clicking registration portal.</p>
                </div>
                <a
                  href={selectedTest.officialWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white text-[#00288e] hover:bg-gray-100 font-extrabold text-xs px-5 py-3 rounded-xl transition-all shrink-0 cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <span>Go to Official {selectedTest.name} Portal</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB 4: PREPARATION & PAST PAPERS */}
          {activeTab === 'prep' && (
            <div className="space-y-6 text-xs md:text-sm animate-fade-in">
              {/* Material Packs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#c4c5d5]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-[#00288e] text-2xl">picture_as_pdf</span>
                    <span className="text-[10px] bg-[#eff4ff] text-[#00288e] font-bold px-2 py-0.5 rounded">
                      Official PDF
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0b1c30]">Official Syllabus Guide</h4>
                    <p className="text-xs text-[#444653] mt-0.5">{selectedTest.prepResources.syllabusPdfName}</p>
                  </div>
                  <button
                    onClick={() => alert(`Opening official syllabus PDF: ${selectedTest.prepResources.syllabusPdfName}`)}
                    className="w-full bg-[#00288e] hover:bg-[#1e40af] text-white font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span>Download Official Syllabus</span>
                  </button>
                </div>

                <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#c4c5d5]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-[#00288e] text-2xl">folder_zip</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Practice Pack
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0b1c30]">Past Papers & Sample Tests Pack</h4>
                    <p className="text-xs text-[#444653] mt-0.5">
                      {selectedTest.prepResources.pastPapersCount} Solved Past Papers + {selectedTest.prepResources.samplePapersCount} Mock Papers
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenTestPrepModal) onOpenTestPrepModal();
                      else alert(`Opening Past Papers Pack for ${selectedTest.name}`);
                    }}
                    className="w-full bg-[#2170e4] hover:bg-[#0058be] text-white font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">folder_open</span>
                    <span>Access Solved Papers Pack</span>
                  </button>
                </div>
              </div>

              {/* Recommended Books */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-sm text-[#0b1c30]">Recommended Books & Prep Series</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedTest.prepResources.recommendedBooks.map((book, i) => (
                    <div key={i} className="bg-[#f8f9ff] p-3 rounded-xl border border-[#c4c5d5]/30 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#00288e] text-sm">menu_book</span>
                      <span className="text-xs font-semibold text-[#0b1c30]">{book}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Study Tips & Prep Strategy */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-sm text-[#0b1c30] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00288e] text-base">psychology</span>
                  <span>Expert Study Tips & Strategy</span>
                </h3>
                <ul className="space-y-2">
                  {selectedTest.studyTips.map((tip, idx) => (
                    <li key={idx} className="bg-[#f8f9ff] p-3 rounded-xl border border-[#c4c5d5]/30 flex items-start gap-2.5">
                      <span className="bg-[#00288e] text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-xs text-[#0b1c30] font-medium leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: FAQS */}
          {activeTab === 'faqs' && (
            <div className="space-y-4 text-xs md:text-sm animate-fade-in">
              <h3 className="font-extrabold text-sm text-[#0b1c30]">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {selectedTest.faqs.map((faq, i) => (
                  <div key={i} className="bg-[#f8f9ff] p-4 rounded-xl border border-[#c4c5d5]/30 space-y-1.5">
                    <h4 className="font-bold text-sm text-[#00288e] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">help</span>
                      <span>{faq.question}</span>
                    </h4>
                    <p className="text-xs text-[#444653] leading-relaxed font-medium pl-6">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
