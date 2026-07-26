// Utility helper for dynamic admission cycle and status management

export interface DynamicAdmissionStatus {
  term: string; // e.g., "Fall 2026", "Spring 2027"
  statusText: 'Admissions Open' | 'Opening Soon' | 'Closed' | 'Results Announced';
  badgeColor: string;
  isEstimated: boolean;
  formattedDeadline: string;
  applyStartDisplay: string;
  testDateDisplay: string;
  meritListDisplay: string;
}

/**
 * Calculates current Pakistani university admission cycle dynamically based on Date
 */
export function getCurrentAdmissionTerm(date: Date = new Date()): { term: string; year: number; season: 'Fall' | 'Spring' } {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed (0 = Jan, 6 = July)

  // In Pakistan, Fall admissions run roughly June to October
  // Spring admissions run roughly November to February
  if (month >= 5 && month <= 10) {
    return { term: `Fall ${year}`, year, season: 'Fall' };
  } else if (month === 11) {
    return { term: `Spring ${year + 1}`, year: year + 1, season: 'Spring' };
  } else {
    return { term: `Spring ${year}`, year, season: 'Spring' };
  }
}

/**
 * Generates dynamic dates and status based on current year and university/program base month & day
 */
export function getDynamicAdmissionStatus(
  applyMonth: number = 6, // 0-based month (e.g. 6 = July)
  applyDay: number = 15,
  deadlineMonth: number = 7, // e.g. 7 = August
  deadlineDay: number = 31,
  testMonth: number = 8, // e.g. 8 = September
  testDay: number = 10,
  meritMonth: number = 8,
  meritDay: number = 25
): DynamicAdmissionStatus {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Construct dates for current cycle
  const applyStart = new Date(currentYear, applyMonth, applyDay);
  const deadline = new Date(currentYear, deadlineMonth, deadlineDay, 23, 59, 59);
  const testDate = new Date(currentYear, testMonth, testDay);
  const meritListDate = new Date(currentYear, meritMonth, meritDay);

  const currentTermInfo = getCurrentAdmissionTerm(now);

  let statusText: 'Admissions Open' | 'Opening Soon' | 'Closed' | 'Results Announced' = 'Closed';
  let badgeColor = 'bg-gray-100 text-gray-800 border-gray-200';

  if (now < applyStart) {
    statusText = 'Opening Soon';
    badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
  } else if (now >= applyStart && now <= deadline) {
    statusText = 'Admissions Open';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (now > deadline && now <= meritListDate) {
    statusText = 'Results Announced';
    badgeColor = 'bg-purple-100 text-purple-800 border-purple-200';
  } else {
    statusText = 'Closed';
    badgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return {
    term: currentTermInfo.term,
    statusText,
    badgeColor,
    isEstimated: true, // Label as estimated schedule until synchronized with live official portal
    formattedDeadline: `${monthNames[deadlineMonth]} ${deadlineDay}, ${currentYear}`,
    applyStartDisplay: `${monthNames[applyMonth]} ${applyDay}, ${currentYear}`,
    testDateDisplay: `${monthNames[testMonth]} ${testDay}, ${currentYear}`,
    meritListDisplay: `${monthNames[meritMonth]} ${meritDay}, ${currentYear}`,
  };
}
