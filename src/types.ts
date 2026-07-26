export interface AdmissionSchedule {
  applyStart: string;
  deadline: string;
  testDate: string;
  meritListDate: string;
  scheduleType?: 'Estimated Schedule' | 'Sample Data' | 'Last Known Schedule';
  isEstimated?: boolean;
}

export interface ProgramFeeStructure {
  semesterFee: string;
  admissionFee: string;
  annualFee: string;
  otherCharges?: string;
}

export type DegreeLevel =
  | 'Intermediate'
  | 'Associate Degree'
  | 'BS'
  | 'BE/BSc Engineering'
  | 'MBBS'
  | 'BDS'
  | 'DVM'
  | 'Pharm-D'
  | 'DPT'
  | 'LLB'
  | 'BBA'
  | 'MS/MPhil'
  | 'PhD';

export interface MeritFormula {
  matricWeight: number; // e.g. 10 or 30
  interWeight: number; // e.g. 40 or 70
  testWeight: number; // e.g. 50 or 0
  requiresTest: boolean;
  testName?: string; // e.g. "MDCAT", "LAT", "ECAT", "NUST NET", "FAST Entry Test", "NTS NAT", "None (Direct Academic Merit)"
  description: string; // e.g. "50% MDCAT + 40% FSc + 10% Matric"
}

export interface FiveYearMerit {
  year: number;
  closingAggregate: string;
}

export interface Program {
  id: string;
  name: string; // e.g., "MBBS", "BDS", "DVM", "BS Computer Science", "BS Microbiology", etc.
  degreeLevel?: DegreeLevel | string; // Degree level: BS, MS, PhD, MBBS, BDS, etc.
  category: 'Engineering' | 'Computer Science' | 'Medical' | 'Business' | 'Science' | 'Social Sciences' | 'Arts' | 'Law' | 'Agriculture' | string;
  duration: string;
  campus: string;
  closingMerit: string; // e.g. "94.80%" or "78.45%"
  closingMeritNum: number; // e.g. 94.8
  eligibilityCriteria: string[];
  feeStructure: ProgramFeeStructure;
  totalDegreeBudgetPKR?: number; // Estimated complete degree cost in PKR
  seats: string | number; // e.g. "150 Seats (120 Open Merit, 30 Self-Finance)"
  admissionTestRequirements: string; // e.g. "MDCAT (Min 55% score required)" or "Direct Academic Merit (No Test Required)"
  requiresEntranceTest?: boolean;
  testName?: string;
  meritFormula?: MeritFormula;
  fiveYearMerits?: FiveYearMerit[];
  requiredDocuments?: string[];
  schedule: AdmissionSchedule;
  historicalTrend?: string; // e.g. "↑ 1.2% higher than 2023"
}

export interface HistoricalMerit {
  program: string;
  closingAggregate: string;
  avgTestScore: string;
  trend: string; // e.g. '↑ 1.2%' or '↔ Stable'
}

export interface FeeItem {
  label: string;
  amount: string;
}

export interface Scholarship {
  name: string;
  description: string;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  city: string;
  province:
    | 'Punjab'
    | 'Sindh'
    | 'Khyber Pakhtunkhwa'
    | 'Balochistan'
    | 'Islamabad Capital Territory'
    | 'Azad Jammu & Kashmir'
    | 'Gilgit-Baltistan'
    | 'Azad Kashmir / Gilgit Baltistan';
  address: string;
  sector: 'Public' | 'Private';
  hecRanking?: number;
  fieldOfStudy: string[]; // e.g. ['Engineering', 'Computer Science']
  closingMerit: number; // e.g. 82.4 (baseline average)
  closingMeritDisplay: string; // e.g. "82.4%"
  annualFee: number; // in PKR, e.g. 240000
  annualFeeDisplay: string; // e.g. "2.4L PKR"
  semesterFee: number;
  logoUrl: string;
  bannerUrl: string;
  hostelImgUrl?: string;
  offeredPrograms: Program[];
  historicalMerits: HistoricalMerit[];
  requirements: string[];
  feeBreakdown: FeeItem[];
  scholarships: Scholarship[];
  hostelInfo: {
    description: string;
    monthlyCost: string;
  };
  admissionStatus: {
    term: string; // e.g. "Fall 2024 Open"
    percentFilled: number;
    deadline: string; // e.g. "Aug 15, 2024"
    statusText: 'Open' | 'Closing Soon' | 'Closed';
  };
  officialWebsite: string;
  locationDetails: string;
  district?: string;
  hostelAvailable?: boolean;
  scholarshipsAvailable?: boolean;
  genderType?: 'Co-education' | 'Male Only' | 'Female Only';
  hasEntranceTest?: boolean;
}

export interface EntranceTestDetails {
  id: string;
  name: string; // e.g. "MDCAT", "ECAT", "NET"
  fullName: string; // e.g. "Medical & Dental College Admission Test"
  organizingBody: string; // e.g. "PMDC / UHS / KMU / DUHS"
  purpose: string; // Which universities & programs accept it
  eligibility: string[];
  subjects: { name: string; percentage: number; mcqs: number }[];
  pattern: {
    totalMcqs: number;
    durationMins: number;
    markingScheme: string; // e.g. "+1 for correct, no negative marking"
  };
  schedule: {
    registrationStart: string;
    registrationDeadline: string;
    testDates: string[];
    resultDate: string;
    scheduleType?: 'Estimated Schedule' | 'Sample Data' | 'Last Known Schedule';
    isEstimated?: boolean;
  };
  scheduleDisclaimer?: string;
  registrationFeePKR: number;
  officialWebsite: string;
  requiredDocuments: string[];
  prepResources: {
    syllabusPdfName: string;
    samplePapersCount: number;
    pastPapersCount: number;
    recommendedBooks: string[];
  };
  studyTips: string[];
  faqs: { question: string; answer: string }[];
  lastUpdatedDate: string;
  liveSyncReady: boolean;
}

export interface BookmarkedProgram {
  id: string; // uniId_progId
  universityId: string;
  universityName: string;
  universityShortName: string;
  universityLogo: string;
  city: string;
  programId: string;
  programName: string;
  degreeLevel: string;
  closingMerit: string;
  annualFee: number;
  requiresEntranceTest: boolean;
  testName?: string;
  schedule: {
    applyStart: string;
    deadline: string;
    testDate: string;
    meritListDate: string;
  };
  addedAt: string;
  notes?: string;
}

export interface StudentProfile {
  matricPercentage: number;
  interPercentage: number;
  entryTestScore?: number;
  desiredProgram: string;
  preferredCity: string;
  preferredProvince: string;
  annualBudget: number;
}

export interface PredictorInput {
  matricPercentage: number;
  interPercentage: number;
  entryTestScore?: number;
  preferredField: string;
  selectedDegreeName?: string; // e.g., "BS Computer Science" or "MBBS"
  annualBudget: number;
  province: string;
  city: string;
}

export interface PredictionResult {
  university: University;
  matchedProgram: Program;
  calculatedAggregate: number;
  category: 'Safe' | 'Target' | 'Reach';
  matchProbability: number; // 0-100%
  recommendationReason: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  cardSuggestion?: {
    title: string;
    description: string;
    actionTab: 'predictor' | 'search' | 'details';
    universityId?: string;
  };
}
