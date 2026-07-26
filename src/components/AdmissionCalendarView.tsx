import React, { useState, useEffect, useMemo } from 'react';
import {
  getBookmarkedPrograms,
  generatePersonalizedTimeline,
  removeBookmarkById,
  TimelineEvent,
} from '../utils/calendarStorage';
import { BookmarkedProgram, University } from '../types';
import { UNIVERSITIES } from '../data/universities';

interface AdmissionCalendarViewProps {
  onSelectUniversity: (uni: University, programId?: string) => void;
  setActiveTab: (tab: 'home' | 'search' | 'tests' | 'calendar' | 'predictor' | 'counselor' | 'about') => void;
}

export const AdmissionCalendarView: React.FC<AdmissionCalendarViewProps> = ({
  onSelectUniversity,
  setActiveTab
}) => {
  const [bookmarks, setBookmarks] = useState<BookmarkedProgram[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'deadline' | 'test' | 'merit'>('all');
  const [activeViewMode, setActiveViewMode] = useState<'timeline' | 'programs'>('timeline');

  // Load bookmarks on mount
  useEffect(() => {
    setBookmarks(getBookmarkedPrograms());
  }, []);

  const handleRemove = (bookmarkId: string) => {
    const updated = removeBookmarkById(bookmarkId);
    setBookmarks(updated);
  };

  const timelineEvents = useMemo(() => {
    return generatePersonalizedTimeline(bookmarks);
  }, [bookmarks]);

  const filteredEvents = useMemo(() => {
    if (selectedFilter === 'all') return timelineEvents;
    if (selectedFilter === 'deadline') return timelineEvents.filter((e) => e.eventType === 'deadline' || e.eventType === 'apply_start');
    if (selectedFilter === 'test') return timelineEvents.filter((e) => e.eventType === 'test_date');
    if (selectedFilter === 'merit') return timelineEvents.filter((e) => e.eventType === 'merit_list');
    return timelineEvents;
  }, [timelineEvents, selectedFilter]);

  const urgentCount = useMemo(() => {
    return timelineEvents.filter((e) => e.statusTag === 'Urgent').length;
  }, [timelineEvents]);

  const upcomingTestsCount = useMemo(() => {
    return timelineEvents.filter((e) => e.eventType === 'test_date' && e.statusTag !== 'Past').length;
  }, [timelineEvents]);

  // Export iCal (.ics) file download
  const handleExportICS = () => {
    if (timelineEvents.length === 0) {
      alert('No events to export. Save some university programs first!');
      return;
    }

    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//UniGuide AI Pakistan//Admission Calendar//EN\n`;

    timelineEvents.forEach((ev) => {
      const dtStr = ev.parsedDate
        ? ev.parsedDate.toISOString().replace(/-|:|\.\d+/g, '')
        : new Date().toISOString().replace(/-|:|\.\d+/g, '');

      icsContent += `BEGIN:VEVENT\nSUMMARY:${ev.title} - ${ev.universityShortName}\nDESCRIPTION:${ev.programName} at ${ev.universityName} (${ev.city}). ${
        ev.requiresTest ? `Test: ${ev.testName || 'Required'}` : 'No entrance test required.'
      }\nDTSTART:${dtStr}\nDTEND:${dtStr}\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
    });

    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'UniGuide_My_Admission_Calendar.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#00288e] via-[#1a4fba] to-[#2170e4] text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">calendar_month</span>
              <span>Personalized Admission Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              My Admission Calendar
            </h1>
            <p className="text-sm text-white/90 leading-relaxed">
              Automatic timeline tracking for your saved universities and degree programs. Monitor application openings, entrance test registration deadlines, exam dates, result announcements, and merit lists.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportICS}
              className="bg-white text-[#00288e] hover:bg-gray-100 font-extrabold text-xs px-4 py-3 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Export to iCal / Google Calendar</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center space-y-0.5">
            <span className="text-[10px] text-white/70 uppercase font-bold block">Saved Programs</span>
            <span className="text-xl font-extrabold text-white">{bookmarks.length}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center space-y-0.5">
            <span className="text-[10px] text-white/70 uppercase font-bold block">Timeline Events</span>
            <span className="text-xl font-extrabold text-white">{timelineEvents.length}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center space-y-0.5">
            <span className="text-[10px] text-amber-200 uppercase font-bold block">Urgent Deadlines</span>
            <span className="text-xl font-extrabold text-amber-300">{urgentCount}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center space-y-0.5">
            <span className="text-[10px] text-emerald-200 uppercase font-bold block">Upcoming Entry Exams</span>
            <span className="text-xl font-extrabold text-emerald-300">{upcomingTestsCount}</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c4c5d5]/30 space-y-6">
        {/* Schedule Verification Disclaimer */}
        <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-700 text-base shrink-0">info</span>
            <span>
              <strong className="font-bold">Estimated Schedule Notice:</strong> Dates shown in your calendar are based on standard university admission cycles. Please verify exact deadlines on the official university portal.
            </span>
          </div>
          <span className="bg-amber-200/80 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded shrink-0 hidden sm:inline-block">
            Estimated Data
          </span>
        </div>

        {/* Navigation & Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#c4c5d5]/20">
          <div className="flex items-center gap-2 bg-[#f8f9ff] p-1 rounded-xl border border-[#c4c5d5]/30 text-xs font-bold">
            <button
              onClick={() => setActiveViewMode('timeline')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeViewMode === 'timeline'
                  ? 'bg-[#00288e] text-white shadow-xs'
                  : 'text-[#444653] hover:text-[#00288e]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">timeline</span>
              <span>Interactive Timeline</span>
            </button>
            <button
              onClick={() => setActiveViewMode('programs')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeViewMode === 'programs'
                  ? 'bg-[#00288e] text-white shadow-xs'
                  : 'text-[#444653] hover:text-[#00288e]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">bookmarks</span>
              <span>Saved Programs ({bookmarks.length})</span>
            </button>
          </div>

          {activeViewMode === 'timeline' && (
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold no-scrollbar">
              <span className="text-[#444653] font-bold text-[11px] shrink-0">Filter:</span>
              {[
                { id: 'all', label: 'All Milestones' },
                { id: 'deadline', label: 'Deadlines & Openings' },
                { id: 'test', label: 'Entrance Exams' },
                { id: 'merit', label: 'Merit Lists' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
                    selectedFilter === f.id
                      ? 'bg-[#eff4ff] text-[#00288e] border-[#2170e4]/40 font-bold'
                      : 'bg-[#f8f9ff] text-[#444653] border-[#c4c5d5]/30 hover:bg-[#eff4ff]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setActiveTab('search')}
            className="bg-[#00288e] hover:bg-[#1e40af] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Browse More Universities</span>
          </button>
        </div>

        {/* MODE 1: INTERACTIVE TIMELINE */}
        {activeViewMode === 'timeline' && (
          <div className="space-y-6">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-[#f8f9ff] rounded-2xl border border-dashed border-[#c4c5d5]">
                <span className="material-symbols-outlined text-4xl text-[#00288e]">calendar_today</span>
                <h3 className="font-bold text-base text-[#0b1c30]">No Timeline Milestones Found</h3>
                <p className="text-xs text-[#444653] max-w-md mx-auto">
                  You haven't saved any universities or degree programs to your calendar yet, or the current filter has no items.
                </p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="bg-[#00288e] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Explore Universities
                </button>
              </div>
            ) : (
              <div className="relative pl-6 md:pl-8 space-y-6 before:absolute before:left-3 md:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#2170e4]/30">
                {filteredEvents.map((ev) => {
                  const uni = UNIVERSITIES.find((u) => u.id === ev.bookmarkId.split('_')[0]);

                  return (
                    <div key={ev.id} className="relative group">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-6 md:-left-8 top-1.5 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center text-[10px] font-bold ${
                          ev.statusTag === 'Urgent'
                            ? 'border-amber-500 text-amber-600'
                            : ev.statusTag === 'Past'
                            ? 'border-gray-300 text-gray-400'
                            : 'border-[#00288e] text-[#00288e]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">
                          {ev.eventType === 'deadline'
                            ? 'alarm'
                            : ev.eventType === 'test_date'
                            ? 'assignment'
                            : ev.eventType === 'merit_list'
                            ? 'verified'
                            : 'event'}
                        </span>
                      </div>

                      {/* Event Card */}
                      <div className="bg-[#f8f9ff] p-4 md:p-5 rounded-2xl border border-[#c4c5d5]/30 hover:border-[#00288e] transition-all space-y-3 shadow-2xs">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <img
                              src={ev.logoUrl}
                              alt={ev.universityShortName}
                              className="w-10 h-10 rounded-xl object-contain bg-white border border-[#c4c5d5]/30 p-0.5 shrink-0"
                            />
                            <div>
                              <h4 className="font-extrabold text-sm md:text-base text-[#0b1c30]">
                                {ev.title}
                              </h4>
                              <p className="text-xs text-[#444653]">
                                {ev.universityName} • {ev.city}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {ev.daysRemaining !== undefined && (
                              <span
                                className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                                  ev.daysRemaining < 0
                                    ? 'bg-gray-100 text-gray-500 border-gray-300'
                                    : ev.daysRemaining <= 7
                                    ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                }`}
                              >
                                {ev.daysRemaining < 0
                                  ? 'Past Deadline'
                                  : ev.daysRemaining === 0
                                  ? 'TODAY!'
                                  : `In ${ev.daysRemaining} Days`}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Event Details Footer */}
                        <div className="pt-3 border-t border-[#c4c5d5]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3 text-[#444653]">
                            <span className="font-bold text-[#00288e] flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">calendar_month</span>
                              <span>Date: {ev.dateStr}</span>
                            </span>

                            {ev.requiresTest && (
                              <span className="bg-[#eff4ff] text-[#00288e] font-semibold px-2 py-0.5 rounded text-[11px]">
                                Test: {ev.testName || 'Required'}
                              </span>
                            )}
                            {!ev.requiresTest && (
                              <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                                No Entrance Test Required
                              </span>
                            )}
                          </div>

                          {uni && (
                            <button
                              onClick={() => onSelectUniversity(uni)}
                              className="text-[#00288e] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <span>View University</span>
                              <span className="material-symbols-outlined text-xs">arrow_forward</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* MODE 2: SAVED PROGRAMS MANAGEMENT */}
        {activeViewMode === 'programs' && (
          <div className="space-y-4">
            {bookmarks.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-[#f8f9ff] rounded-2xl border border-dashed border-[#c4c5d5]">
                <span className="material-symbols-outlined text-4xl text-[#00288e]">bookmarks</span>
                <h3 className="font-bold text-base text-[#0b1c30]">No Programs Saved</h3>
                <p className="text-xs text-[#444653]">Browse universities and click "Add to My Admission Calendar" to track them here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookmarks.map((bm) => {
                  const uni = UNIVERSITIES.find((u) => u.id === bm.universityId);

                  return (
                    <div
                      key={bm.id}
                      className="bg-[#f8f9ff] p-5 rounded-2xl border border-[#c4c5d5]/30 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={bm.universityLogo}
                              alt={bm.universityShortName}
                              className="w-12 h-12 rounded-xl object-contain bg-white border border-[#c4c5d5]/30 p-1 shrink-0"
                            />
                            <div>
                              <h4 className="font-extrabold text-sm text-[#0b1c30]">{bm.programName}</h4>
                              <p className="text-xs text-[#444653]">{bm.universityName} • {bm.city}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemove(bm.id)}
                            title="Remove from calendar"
                            className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>

                        {/* Milestone Schedule Cards */}
                        <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-[#c4c5d5]/20 text-xs">
                          <div>
                            <span className="text-[10px] text-[#444653] font-bold block">Apply Deadline</span>
                            <span className="font-bold text-rose-700">{bm.schedule.deadline}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#444653] font-bold block">Entry Exam Date</span>
                            <span className="font-bold text-[#00288e]">{bm.schedule.testDate}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#444653] font-bold block">1st Merit List</span>
                            <span className="font-bold text-emerald-700">{bm.schedule.meritListDate}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#444653] font-bold block">Last Closing Merit</span>
                            <span className="font-bold text-[#00288e]">{bm.closingMerit}</span>
                          </div>
                        </div>

                        {/* Test Requirement Notice */}
                        <div className="text-xs">
                          {bm.requiresEntranceTest ? (
                            <span className="inline-flex items-center gap-1 text-[#00288e] font-semibold bg-[#eff4ff] px-2.5 py-1 rounded-lg border border-[#2170e4]/20">
                              <span className="material-symbols-outlined text-xs">assignment</span>
                              <span>Test Required: {bm.testName || 'Entrance Test'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              <span className="material-symbols-outlined text-xs">check_circle</span>
                              <span>No Entrance Test Required</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#c4c5d5]/20 flex items-center justify-between text-xs">
                        <span className="text-[#444653] text-[10px] font-medium">Added: {new Date(bm.addedAt).toLocaleDateString()}</span>
                        {uni && (
                          <button
                            onClick={() => onSelectUniversity(uni)}
                            className="bg-[#00288e] hover:bg-[#1e40af] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            Open Details
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
