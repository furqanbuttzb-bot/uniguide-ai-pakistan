import { BookmarkedProgram, University, Program } from '../types';
import { UNIVERSITIES } from '../data/universities';

const STORAGE_KEY = 'uniguide_admission_bookmarks_v1';

// Default starter bookmarked programs for new users so the calendar is instantly engaging
const DEFAULT_BOOKMARKS: BookmarkedProgram[] = [
  {
    id: 'nust-isb_nust-cs',
    universityId: 'nust-isb',
    universityName: 'National University of Sciences and Technology (NUST)',
    universityShortName: 'NUST',
    universityLogo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=120&auto=format&fit=crop&q=80',
    city: 'Islamabad',
    programId: 'nust-cs',
    programName: 'BS Computer Science',
    degreeLevel: 'BS',
    closingMerit: '79.80%',
    annualFee: 260000,
    requiresEntranceTest: true,
    testName: 'NUST NET (Series 4)',
    schedule: {
      applyStart: 'May 15, 2026',
      deadline: 'July 10, 2026',
      testDate: 'July 18, 2026',
      meritListDate: 'August 05, 2026'
    },
    addedAt: new Date().toISOString(),
    notes: 'Primary target for BS CS in Islamabad.'
  },
  {
    id: 'kemu-lhr_kemu-mbbs',
    universityId: 'kemu-lhr',
    universityName: 'King Edward Medical University (KEMU)',
    universityShortName: 'KEMU',
    universityLogo: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=120&auto=format&fit=crop&q=80',
    city: 'Lahore',
    programId: 'kemu-mbbs',
    programName: 'MBBS (Bachelor of Medicine)',
    degreeLevel: 'MBBS',
    closingMerit: '93.50%',
    annualFee: 35000,
    requiresEntranceTest: true,
    testName: 'MDCAT (UHS / PMDC)',
    schedule: {
      applyStart: 'July 15, 2026',
      deadline: 'August 10, 2026',
      testDate: 'September 20, 2026',
      meritListDate: 'October 15, 2026'
    },
    addedAt: new Date().toISOString(),
    notes: 'Top medical college in Punjab.'
  },
  {
    id: 'fast-khi_fast-se',
    universityId: 'fast-khi',
    universityName: 'FAST NUCES Karachi Campus',
    universityShortName: 'FAST Karachi',
    universityLogo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=120&auto=format&fit=crop&q=80',
    city: 'Karachi',
    programId: 'fast-se',
    programName: 'BS Software Engineering',
    degreeLevel: 'BS',
    closingMerit: '74.20%',
    annualFee: 240000,
    requiresEntranceTest: true,
    testName: 'FAST NU Admission Test',
    schedule: {
      applyStart: 'June 01, 2026',
      deadline: 'July 05, 2026',
      testDate: 'July 15, 2026',
      meritListDate: 'July 28, 2026'
    },
    addedAt: new Date().toISOString(),
    notes: 'Backup choice for software engineering.'
  }
];

export function getBookmarkedPrograms(): BookmarkedProgram[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BOOKMARKS));
      return DEFAULT_BOOKMARKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_BOOKMARKS;
  } catch (e) {
    console.error('Error reading admission bookmarks:', e);
    return DEFAULT_BOOKMARKS;
  }
}

export function isProgramBookmarked(universityId: string, programId: string): boolean {
  const bookmarks = getBookmarkedPrograms();
  const targetId = `${universityId}_${programId}`;
  return bookmarks.some((b) => b.id === targetId || (b.universityId === universityId && b.programId === programId));
}

export function toggleBookmarkProgram(
  university: University,
  program: Program,
  customNotes?: string
): boolean {
  const bookmarks = getBookmarkedPrograms();
  const targetId = `${university.id}_${program.id}`;
  const existsIndex = bookmarks.findIndex((b) => b.id === targetId || (b.universityId === university.id && b.programId === program.id));

  if (existsIndex >= 0) {
    // Remove
    bookmarks.splice(existsIndex, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    return false; // Now unbookmarked
  } else {
    // Add
    const newBookmark: BookmarkedProgram = {
      id: targetId,
      universityId: university.id,
      universityName: university.name,
      universityShortName: university.shortName,
      universityLogo: university.logoUrl,
      city: university.city,
      programId: program.id,
      programName: program.name,
      degreeLevel: program.degreeLevel || 'BS',
      closingMerit: program.closingMerit,
      annualFee: university.annualFee,
      requiresEntranceTest: program.requiresEntranceTest ?? true,
      testName: program.testName || (program.requiresEntranceTest ? 'University Entrance Test' : undefined),
      schedule: {
        applyStart: program.schedule?.applyStart || 'Open Soon',
        deadline: program.schedule?.deadline || university.admissionStatus.deadline || 'TBA',
        testDate: program.schedule?.testDate || 'TBA',
        meritListDate: program.schedule?.meritListDate || 'TBA'
      },
      addedAt: new Date().toISOString(),
      notes: customNotes || `Saved for ${program.name} admission.`
    };
    bookmarks.push(newBookmark);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    return true; // Now bookmarked
  }
}

export function removeBookmarkById(bookmarkId: string): BookmarkedProgram[] {
  const bookmarks = getBookmarkedPrograms().filter((b) => b.id !== bookmarkId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  return bookmarks;
}

export interface TimelineEvent {
  id: string;
  bookmarkId: string;
  universityName: string;
  universityShortName: string;
  programName: string;
  city: string;
  logoUrl: string;
  eventType: 'apply_start' | 'deadline' | 'test_date' | 'result' | 'merit_list';
  title: string;
  dateStr: string;
  parsedDate?: Date;
  daysRemaining?: number;
  requiresTest: boolean;
  testName?: string;
  statusTag: 'Urgent' | 'Upcoming' | 'Past';
}

// Helper to parse date strings like "July 10, 2026" or "August 05, 2026"
export function parsePakistaniDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.toLowerCase().includes('tba') || dateStr.toLowerCase().includes('open')) {
    return null;
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

export function generatePersonalizedTimeline(bookmarks: BookmarkedProgram[]): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const now = new Date();

  bookmarks.forEach((b) => {
    // Event 1: Application Start
    if (b.schedule.applyStart && b.schedule.applyStart !== 'TBA') {
      const pDate = parsePakistaniDate(b.schedule.applyStart);
      events.push({
        id: `${b.id}_apply`,
        bookmarkId: b.id,
        universityName: b.universityName,
        universityShortName: b.universityShortName,
        programName: b.programName,
        city: b.city,
        logoUrl: b.universityLogo,
        eventType: 'apply_start',
        title: `Admissions Opening: ${b.programName}`,
        dateStr: b.schedule.applyStart,
        parsedDate: pDate || undefined,
        requiresTest: b.requiresEntranceTest,
        testName: b.testName,
        statusTag: 'Upcoming'
      });
    }

    // Event 2: Application Deadline
    if (b.schedule.deadline && b.schedule.deadline !== 'TBA') {
      const pDate = parsePakistaniDate(b.schedule.deadline);
      events.push({
        id: `${b.id}_deadline`,
        bookmarkId: b.id,
        universityName: b.universityName,
        universityShortName: b.universityShortName,
        programName: b.programName,
        city: b.city,
        logoUrl: b.universityLogo,
        eventType: 'deadline',
        title: `Application Deadline: ${b.programName}`,
        dateStr: b.schedule.deadline,
        parsedDate: pDate || undefined,
        requiresTest: b.requiresEntranceTest,
        testName: b.testName,
        statusTag: 'Urgent'
      });
    }

    // Event 3: Entrance Test Date (if test required)
    if (b.requiresEntranceTest && b.schedule.testDate && b.schedule.testDate !== 'TBA') {
      const pDate = parsePakistaniDate(b.schedule.testDate);
      events.push({
        id: `${b.id}_test`,
        bookmarkId: b.id,
        universityName: b.universityName,
        universityShortName: b.universityShortName,
        programName: b.programName,
        city: b.city,
        logoUrl: b.universityLogo,
        eventType: 'test_date',
        title: `Entry Exam (${b.testName || 'Entrance Test'})`,
        dateStr: b.schedule.testDate,
        parsedDate: pDate || undefined,
        requiresTest: true,
        testName: b.testName,
        statusTag: 'Urgent'
      });
    }

    // Event 4: Merit List Date
    if (b.schedule.meritListDate && b.schedule.meritListDate !== 'TBA') {
      const pDate = parsePakistaniDate(b.schedule.meritListDate);
      events.push({
        id: `${b.id}_merit`,
        bookmarkId: b.id,
        universityName: b.universityName,
        universityShortName: b.universityShortName,
        programName: b.programName,
        city: b.city,
        logoUrl: b.universityLogo,
        eventType: 'merit_list',
        title: `1st Merit List Announcement`,
        dateStr: b.schedule.meritListDate,
        parsedDate: pDate || undefined,
        requiresTest: b.requiresEntranceTest,
        testName: b.testName,
        statusTag: 'Upcoming'
      });
    }
  });

  // Calculate days remaining & sorting
  events.forEach((ev) => {
    if (ev.parsedDate) {
      const diffTime = ev.parsedDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      ev.daysRemaining = diffDays;
      if (diffDays < 0) {
        ev.statusTag = 'Past';
      } else if (diffDays <= 7) {
        ev.statusTag = 'Urgent';
      } else {
        ev.statusTag = 'Upcoming';
      }
    }
  });

  // Sort by date closest to today
  events.sort((a, b) => {
    if (!a.parsedDate) return 1;
    if (!b.parsedDate) return -1;
    return a.parsedDate.getTime() - b.parsedDate.getTime();
  });

  return events;
}
