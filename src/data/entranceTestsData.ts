import { EntranceTestDetails } from '../types';

export const ALL_ENTRANCE_TESTS: EntranceTestDetails[] = [
  {
    id: 'mdcat',
    name: 'MDCAT',
    fullName: 'Medical & Dental College Admission Test',
    organizingBody: 'PMDC (Pakistan Medical & Dental Council) / UHS / KMU / DUHS / SZABMU / BUMHS',
    purpose: 'Mandatory single entrance test for MBBS, BDS, Pharm-D, DPT, and Allied Health Sciences in all public and private medical colleges across Pakistan.',
    eligibility: [
      'Min 60% marks in FSc Pre-Medical or A-Levels (Biology, Chemistry, Physics/Math).',
      'Pakistani citizens, Overseas Pakistanis, and Dual National candidates.'
    ],
    subjects: [
      { name: 'Biology', percentage: 34, mcqs: 68 },
      { name: 'Chemistry', percentage: 27, mcqs: 54 },
      { name: 'Physics', percentage: 27, mcqs: 54 },
      { name: 'English', percentage: 9, mcqs: 18 },
      { name: 'Logical Reasoning', percentage: 3, mcqs: 6 }
    ],
    pattern: {
      totalMcqs: 200,
      durationMins: 215,
      markingScheme: '1 mark per correct answer. NO negative marking. Total Marks: 200.'
    },
    schedule: {
      registrationStart: 'July 15, 2026',
      registrationDeadline: 'August 10, 2026',
      testDates: ['September 20, 2026'],
      resultDate: 'October 05, 2026',
      scheduleType: 'Estimated Schedule',
      isEstimated: true
    },
    scheduleDisclaimer: 'Notice: Dates shown are estimated schedules based on standard PMDC admission cycles. Please verify official dates directly on the PMDC website (pmdc.pk).',
    registrationFeePKR: 6000,
    officialWebsite: 'https://pmdc.pk',
    requiredDocuments: [
      'CNIC or B-Form copy',
      'Matriculation / O-Levels Result Sheet',
      'FSc Part-1 / Part-2 DMC',
      'Recent passport-sized photograph with blue background',
      'Domicile certificate'
    ],
    prepResources: {
      syllabusPdfName: 'PMDC_MDCAT_Official_Syllabus_2026.pdf',
      samplePapersCount: 12,
      pastPapersCount: 15,
      recommendedBooks: [
        'KIPS MDCAT Physics, Chemistry & Biology Series',
        'STEP MDCAT Practice Booklets & Formula Sheets',
        'Grip MDCAT Mock Tests & MCQs Bank',
        'Punjab / Sindh / KPK Textbook Board Textbooks'
      ]
    },
    studyTips: [
      'Master textbook lines line-by-line from provincial textbook boards.',
      'Practice at least 15,000 MCQs with time constraints before exam day.',
      'Solve previous 10 years PMDC/UHS past papers to identify high-yield topics.',
      'Focus heavily on Biology diagrams and organic chemistry reaction mechanisms.'
    ],
    faqs: [
      {
        question: 'Is MDCAT score valid for 2 years?',
        answer: 'Yes, as per PMDC policy, an MDCAT result remains valid for 3 consecutive admission cycles.'
      },
      {
        question: 'What is the passing percentage for MBBS and BDS?',
        answer: 'The minimum passing score is 55% for MBBS (110/200) and 50% for BDS (100/200).'
      }
    ],
    lastUpdatedDate: 'July 2026',
    liveSyncReady: true
  },
  {
    id: 'ecat',
    name: 'ECAT',
    fullName: 'Engineering College Admission Test (UET)',
    organizingBody: 'University of Engineering and Technology (UET) Lahore',
    purpose: 'Required for entry into all public engineering universities in Punjab (UET Lahore, UET Taxila, ITU, BZU Multan) and private affiliated colleges.',
    eligibility: [
      'Min 60% marks in FSc Pre-Engineering / ICS (Physics, Math, Chemistry/CS) or DAE.',
      'Candidates awaiting FSc Part-2 results are eligible.'
    ],
    subjects: [
      { name: 'Mathematics', percentage: 30, mcqs: 30 },
      { name: 'Physics', percentage: 30, mcqs: 30 },
      { name: 'Chemistry / Computer Science', percentage: 30, mcqs: 30 },
      { name: 'English', percentage: 10, mcqs: 10 }
    ],
    pattern: {
      totalMcqs: 100,
      durationMins: 100,
      markingScheme: '+4 marks for correct answer, -1 negative mark for incorrect answer. Total: 400 Marks.'
    },
    schedule: {
      registrationStart: 'March 01, 2026',
      registrationDeadline: 'April 05, 2026',
      testDates: ['April 20 - April 25, 2026'],
      resultDate: 'May 02, 2026',
      scheduleType: 'Estimated Schedule',
      isEstimated: true
    },
    scheduleDisclaimer: 'Notice: Dates shown are estimated schedules based on UET admission cycles. Please verify official dates directly on the UET admission portal (admission.uet.edu.pk).',
    registrationFeePKR: 2500,
    officialWebsite: 'https://admission.uet.edu.pk',
    requiredDocuments: [
      'CNIC / Smart Card / B-Form',
      'Intermediate Part-1 Roll No Slip / Result Card',
      'Passport size photograph'
    ],
    prepResources: {
      syllabusPdfName: 'UET_ECAT_Official_Syllabus_Pattern.pdf',
      samplePapersCount: 8,
      pastPapersCount: 12,
      recommendedBooks: [
        'STEP ECAT Mathematics & Physics Short Formula Guides',
        'Dogar Brothers ECAT Smart Preparation Book',
        'UET Past 15-Year Solved Papers Pack'
      ]
    },
    studyTips: [
      'Beware of negative marking: Avoid guessing unless you can eliminate 2 choices.',
      'Speed calculation is crucial: Practice solving 1 MCQ per minute.',
      'Master Calculus, Trigonometry, Vectors, and Electromagnetism.'
    ],
    faqs: [
      {
        question: 'Does ECAT have negative marking?',
        answer: 'Yes! You get +4 for each correct answer and lose 1 mark (-1) for every wrong answer.'
      },
      {
        question: 'Can ICS students attempt ECAT?',
        answer: 'Yes, ICS students can attempt Computer Science instead of Chemistry.'
      }
    ],
    lastUpdatedDate: 'July 2026',
    liveSyncReady: true
  },
  {
    id: 'nust-net',
    name: 'NUST NET',
    fullName: 'NUST Entry Test (Series 1, 2, 3, 4)',
    organizingBody: 'National University of Sciences and Technology (NUST) Islamabad',
    purpose: 'Required for all undergraduate programs at NUST Islamabad, Rawalpindi, Risalpur, and Karachi campuses.',
    eligibility: [
      'Min 60% in SSC/O-Levels and HSSC/A-Levels Pre-Engineering, Pre-Medical, or ICS.',
      'Candidates can attempt all 4 NET series; NUST considers the highest score.'
    ],
    subjects: [
      { name: 'Mathematics / Biology', percentage: 40, mcqs: 80 },
      { name: 'Physics', percentage: 30, mcqs: 60 },
      { name: 'Chemistry / Computer Science', percentage: 15, mcqs: 30 },
      { name: 'English', percentage: 10, mcqs: 20 },
      { name: 'Intelligence', percentage: 5, mcqs: 10 }
    ],
    pattern: {
      totalMcqs: 200,
      durationMins: 180,
      markingScheme: '1 mark per MCQ. NO negative marking. Computer-based test. Total: 200.'
    },
    schedule: {
      registrationStart: 'November 20, 2025 (NET-1) to June 2026 (NET-4)',
      registrationDeadline: 'July 10, 2026 (Final NET-4 Deadline)',
      testDates: ['NET-1: Dec', 'NET-2: Mar', 'NET-3: May', 'NET-4: July 15-28, 2026'],
      resultDate: 'August 05, 2026 (Final Merit List)',
      scheduleType: 'Estimated Schedule',
      isEstimated: true
    },
    scheduleDisclaimer: 'Notice: NET dates are estimated schedules based on NUST academic series. Verify official schedules directly on the NUST portal (nust.edu.pk).',
    registrationFeePKR: 5000,
    officialWebsite: 'https://nust.edu.pk/admissions',
    requiredDocuments: [
      'Original CNIC / B-Form',
      'Matric & FSc DMC',
      'Paid Bank Chalan copy'
    ],
    prepResources: {
      syllabusPdfName: 'NUST_NET_Complete_Syllabus_Breakdown.pdf',
      samplePapersCount: 15,
      pastPapersCount: 20,
      recommendedBooks: [
        'OETP (One Entrance Test Preparation) NUST Series',
        'KIPS NET Intelligence & Math Workbook',
        'NUST NET Computer-Based Mock Simulator'
      ]
    },
    studyTips: [
      'NUST tests basic conceptual speed. Solve Intelligence questions quickly first.',
      'Since there is no negative marking, answer all 200 MCQs before time runs out.',
      'Attempting multiple NET series significantly increases your chance of scoring 150+.'
    ],
    faqs: [
      {
        question: 'Which NET series score is count for admission?',
        answer: 'NUST automatically considers your HIGHEST score among all the series you attempted in that session.'
      }
    ],
    lastUpdatedDate: 'July 2026',
    liveSyncReady: true
  },
  {
    id: 'fast-nu',
    name: 'FAST NU Test',
    fullName: 'FAST-NUCES Admission Test',
    organizingBody: 'National University of Computer and Emerging Sciences (FAST-NUCES)',
    purpose: 'Required for BS Computer Science, Software Engineering, AI, Data Science, Cyber Security, Civil/Electrical Engineering, and BBA across FAST campuses.',
    eligibility: [
      'Min 60% in Matric & Intermediate (ICS, Pre-Engineering, or Pre-Medical with Additional Math).',
      'SAT or NTS NAT scores are also accepted in lieu of NU test.'
    ],
    subjects: [
      { name: 'Advanced Mathematics', percentage: 40, mcqs: 50 },
      { name: 'Basic Mathematics', percentage: 20, mcqs: 20 },
      { name: 'Analytical Ability / IQ', percentage: 20, mcqs: 20 },
      { name: 'English', percentage: 20, mcqs: 30 }
    ],
    pattern: {
      totalMcqs: 120,
      durationMins: 120,
      markingScheme: '+1 mark for Advanced Math, +0.5 for Basic Math & IQ, +0.33 for English. Negative marking of -0.25 on wrong answers.'
    },
    schedule: {
      registrationStart: 'June 01, 2026',
      registrationDeadline: 'July 05, 2026',
      testDates: ['July 12 - July 20, 2026'],
      resultDate: 'July 28, 2026',
      scheduleType: 'Estimated Schedule',
      isEstimated: true
    },
    scheduleDisclaimer: 'Notice: Dates shown are estimated schedules based on FAST-NUCES academic cycles. Please verify official dates directly on the FAST admissions portal (nu.edu.pk).',
    registrationFeePKR: 3500,
    officialWebsite: 'https://nu.edu.pk/admissions',
    requiredDocuments: [
      'CNIC / B-Form',
      'Printed NU Admit Card',
      'Secondary School Certificate'
    ],
    prepResources: {
      syllabusPdfName: 'FAST_NU_Admission_Test_Pattern.pdf',
      samplePapersCount: 10,
      pastPapersCount: 12,
      recommendedBooks: [
        'Dogar FAST NU Admission Test Guide',
        'KIPS FAST Math & Analytical IQ Booster',
        'FAST Past MCQs Bank & Computer-Based Practice'
      ]
    },
    studyTips: [
      'Sectional timing is enforced: You cannot switch back to a completed section!',
      'Advanced Math is the main game changer—focus on Functions, Conics, Integration, and Limits.',
      'Be extremely careful with negative marking.'
    ],
    faqs: [
      {
        question: 'Does FAST NU test have sectional timing?',
        answer: 'Yes! Each section (Advanced Math, Basic Math, IQ, English) has its own strict timer.'
      }
    ],
    lastUpdatedDate: 'July 2026',
    liveSyncReady: true
  },
  {
    id: 'nts-nat',
    name: 'NTS NAT',
    fullName: 'National Aptitude Test (NAT-I & NAT-II)',
    organizingBody: 'National Testing Service (NTS) Pakistan',
    purpose: 'Accepted by over 40+ public and private universities in Pakistan (COMSATS, UETs, Islamia University, Air University, Bahria, etc.).',
    eligibility: ['12 years of education (FSc / ICS / I.Com / FA) for NAT-I, 16 years for NAT-II.'],
    subjects: [
      { name: 'Verbal Ability (English)', percentage: 20, mcqs: 20 },
      { name: 'Analytical Ability', percentage: 20, mcqs: 20 },
      { name: 'Quantitative Ability (Math)', percentage: 20, mcqs: 20 },
      { name: 'Subject Knowledge (Physics/Chem/CS/Bio/Acc)', percentage: 40, mcqs: 40 }
    ],
    pattern: {
      totalMcqs: 100,
      durationMins: 120,
      markingScheme: '1 mark per MCQ. NO negative marking. Total: 100 Marks.'
    },
    schedule: {
      registrationStart: 'Held every month (NAT-I to NAT-XII)',
      registrationDeadline: '15th of every month',
      testDates: ['First Sunday of every month'],
      resultDate: '7 days after test',
      scheduleType: 'Estimated Schedule',
      isEstimated: true
    },
    scheduleDisclaimer: 'Notice: NTS NAT is held monthly. Please verify the official monthly schedule directly on the NTS website (nts.org.pk).',
    registrationFeePKR: 1200,
    officialWebsite: 'https://nts.org.pk',
    requiredDocuments: ['CNIC / B-Form', '1 Passport size photo', 'Paid Chalan'],
    prepResources: {
      syllabusPdfName: 'NTS_NAT_Official_Format_Guide.pdf',
      samplePapersCount: 15,
      pastPapersCount: 25,
      recommendedBooks: [
        'Dogar NTS NAT Complete Master Guide',
        'Smart Brain NTS Quantitative & Analytical Reasoning'
      ]
    },
    studyTips: [
      'NAT is conducted monthly. If you get a low score, re-appear next month!',
      'NTS score remains valid for 1 full calendar year.'
    ],
    faqs: [
      {
        question: 'How long is NTS NAT score valid?',
        answer: 'NTS NAT scores are valid for 1 year from the test date.'
      }
    ],
    lastUpdatedDate: 'July 2026',
    liveSyncReady: true
  },
  {
    id: 'lat',
    name: 'HEC LAT',
    fullName: 'Law Admission Test (LAT)',
    organizingBody: 'Higher Education Commission (HEC) Pakistan',
    purpose: 'Mandatory test required for admission into 5-Year LLB programs in all public and private universities and law colleges in Pakistan.',
    eligibility: ['Passed Higher Secondary School Certificate (HSSC / Intermediate) or equivalent with min 45%.'],
    subjects: [
      { name: 'Essay (English or Urdu)', percentage: 15, mcqs: 0 },
      { name: 'Personal Statement (English or Urdu)', percentage: 10, mcqs: 0 },
      { name: 'English MCQs', percentage: 20, mcqs: 20 },
      { name: 'General Knowledge', percentage: 15, mcqs: 15 },
      { name: 'Islamic Studies', percentage: 10, mcqs: 10 },
      { name: 'Pakistan Studies', percentage: 10, mcqs: 10 },
      { name: 'Urdu', percentage: 10, mcqs: 10 },
      { name: 'Mathematics', percentage: 10, mcqs: 10 }
    ],
    pattern: {
      totalMcqs: 75,
      durationMins: 120,
      markingScheme: '75 MCQs + 25 Written Essay/Statement. Total 100 Marks. Passing Marks: 50/100.'
    },
    schedule: {
      registrationStart: 'May 10, 2026',
      registrationDeadline: 'June 10, 2026',
      testDates: ['July 05, 2026'],
      resultDate: 'July 25, 2026',
      scheduleType: 'Estimated Schedule',
      isEstimated: true
    },
    scheduleDisclaimer: 'Notice: LAT dates are estimated schedules based on HEC ETC announcements. Please verify official dates on the HEC ETC portal (etc.hec.gov.pk).',
    registrationFeePKR: 1800,
    officialWebsite: 'https://etc.hec.gov.pk',
    requiredDocuments: ['CNIC / B-Form', 'HSSC Result Sheet', 'Paid Chalan'],
    prepResources: {
      syllabusPdfName: 'HEC_LAT_Official_Syllabus_Outline.pdf',
      samplePapersCount: 10,
      pastPapersCount: 10,
      recommendedBooks: [
        'Dogar HEC LAT Law Admission Test Guide',
        'KIPS Essay Writing & General Knowledge for LAT'
      ]
    },
    studyTips: [
      'Practice writing structured essays on social issues and legal reforms in 200 words.',
      'Focus on Pakistan Constitutional history and General Knowledge.'
    ],
    faqs: [
      {
        question: 'What are the passing marks for LAT?',
        answer: 'Candidates must score at least 50 marks out of 100 to pass the HEC LAT.'
      }
    ],
    lastUpdatedDate: 'July 2026',
    liveSyncReady: true
  },
  {
    id: 'giki-entry',
    name: 'GIKI Admission Test',
    fullName: 'Ghulam Ishaq Khan Institute Admission Test',
    organizingBody: 'GIKI Swabi',
    purpose: 'Required for all Bachelor of Engineering and Computer Science programs at GIKI Swabi.',
    eligibility: ['Min 60% in FSc Pre-Engineering / ICS or A-Levels with Math & Physics.'],
    subjects: [
      { name: 'Mathematics', percentage: 40, mcqs: 30 },
      { name: 'Physics', percentage: 40, mcqs: 30 },
      { name: 'English', percentage: 20, mcqs: 20 }
    ],
    pattern: {
      totalMcqs: 80,
      durationMins: 120,
      markingScheme: '+3 for correct answer, -1 negative mark for wrong answer. Total 240 Marks.'
    },
    schedule: {
      registrationStart: 'April 15, 2026',
      registrationDeadline: 'June 25, 2026',
      testDates: ['July 08 - July 12, 2026'],
      resultDate: 'July 20, 2026',
      scheduleType: 'Estimated Schedule',
      isEstimated: true
    },
    scheduleDisclaimer: 'Notice: Dates shown are estimated schedules based on GIKI admission cycles. Please verify official dates directly on GIKI website (giki.edu.pk).',
    registrationFeePKR: 4500,
    officialWebsite: 'https://giki.edu.pk/admissions',
    requiredDocuments: ['CNIC', 'FSc DMC', 'Admit Card'],
    prepResources: {
      syllabusPdfName: 'GIKI_Engineering_Test_Pattern.pdf',
      samplePapersCount: 6,
      pastPapersCount: 10,
      recommendedBooks: ['GIKI Past Papers Pack', 'KIPS Conceptual Physics & Advanced Calculus']
    },
    studyTips: ['High difficulty physics and complex math equations. Practice conceptual problem solving.'],
    faqs: [
      {
        question: 'Is GIKI test harder than ECAT?',
        answer: 'Yes, GIKI questions are more application-oriented and conceptual with strict negative marking.'
      }
    ],
    lastUpdatedDate: 'July 2026',
    liveSyncReady: true
  },
  {
    id: 'pieas-entry',
    name: 'PIEAS Entry Test',
    fullName: 'Pakistan Institute of Engineering & Applied Sciences Admission Test',
    organizingBody: 'PIEAS Islamabad',
    purpose: 'Required for BS Computer Science, BS Electrical Engineering, Mechanical, Chemical, and Materials Engineering at PIEAS.',
    eligibility: ['Min 60% in FSc Pre-Engineering / ICS / A-Levels.'],
    subjects: [
      { name: 'Mathematics', percentage: 40, mcqs: 40 },
      { name: 'Physics', percentage: 35, mcqs: 35 },
      { name: 'Chemistry / CS', percentage: 15, mcqs: 15 },
      { name: 'General / English', percentage: 10, mcqs: 10 }
    ],
    pattern: {
      totalMcqs: 100,
      durationMins: 180,
      markingScheme: '+3 marks per question, -1 negative mark for incorrect choices. Total 300 Marks.'
    },
    schedule: {
      registrationStart: 'April 01, 2026',
      registrationDeadline: 'June 20, 2026',
      testDates: ['July 05, 2026'],
      resultDate: 'July 18, 2026',
      scheduleType: 'Estimated Schedule',
      isEstimated: true
    },
    scheduleDisclaimer: 'Notice: Dates shown are estimated schedules based on PIEAS academic cycles. Please verify official dates directly on PIEAS website (pieas.edu.pk).',
    registrationFeePKR: 3000,
    officialWebsite: 'https://pieas.edu.pk',
    requiredDocuments: ['CNIC', 'Intermediate DMC', 'Application Chalan'],
    prepResources: {
      syllabusPdfName: 'PIEAS_BS_Admission_Syllabus.pdf',
      samplePapersCount: 5,
      pastPapersCount: 8,
      recommendedBooks: ['PIEAS Entry Test Preparation Series']
    },
    studyTips: ['PIEAS focuses heavily on conceptual physics problems and mathematical derivations.'],
    faqs: [
      {
        question: 'What is PIEAS ranking in engineering?',
        answer: 'PIEAS is consistently ranked among the top 2 engineering institutes in Pakistan by HEC.'
      }
    ],
    lastUpdatedDate: 'July 2026',
    liveSyncReady: true
  }
];

export function getEntranceTestById(id: string): EntranceTestDetails | undefined {
  return ALL_ENTRANCE_TESTS.find((t) => t.id.toLowerCase() === id.toLowerCase() || t.name.toLowerCase() === id.toLowerCase());
}
