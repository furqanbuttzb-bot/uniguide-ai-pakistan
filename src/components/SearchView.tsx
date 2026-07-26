import React, { useState, useMemo, useRef, useEffect } from 'react';
import { UNIVERSITIES } from '../data/universities';
import { University, Program } from '../types';
import { getDynamicAdmissionStatus } from '../utils/admissionCycle';
import { isProgramMatch, getEquivalentProgramSuggestions, normalizeText } from '../utils/programSynonyms';

interface SearchViewProps {
  onSelectUniversity: (uni: University, programId?: string) => void;
}

const ALL_PROVINCES = [
  'All',
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan',
];

const DEGREE_LEVELS = [
  { value: 'All', label: 'All Degree Levels' },
  { value: 'Intermediate', label: 'Intermediate (FSc / FA / ICS / A-Levels)' },
  { value: 'Associate Degree', label: 'Associate Degree (ADP)' },
  { value: 'BS', label: 'BS / Bachelor (4-Year)' },
  { value: 'BE/BSc Engineering', label: 'BE / BSc Engineering (4-Year)' },
  { value: 'MBBS', label: 'MBBS (Bachelor of Medicine & Surgery)' },
  { value: 'BDS', label: 'BDS (Bachelor of Dental Surgery)' },
  { value: 'DVM', label: 'DVM (Doctor of Veterinary Medicine)' },
  { value: 'Pharm-D', label: 'Pharm-D (Doctor of Pharmacy)' },
  { value: 'DPT', label: 'DPT (Doctor of Physical Therapy)' },
  { value: 'LLB', label: 'LLB (Bachelor of Law)' },
  { value: 'BBA', label: 'BBA (Bachelor of Business Admin)' },
  { value: 'MS/MPhil', label: 'MS / MPhil / Master (18-Year)' },
  { value: 'PhD', label: 'PhD / Doctorate' },
];

const FACULTIES = [
  'All',
  'Computer Science',
  'Engineering',
  'Medical',
  'Business',
  'Science',
  'Social Sciences',
  'Arts',
  'Law',
  'Agriculture',
];

const MASTER_POPULAR_PROGRAMS = [
  'MBBS',
  'BDS',
  'DVM',
  'Pharm-D',
  'DPT',
  'BS Microbiology',
  'BS Biotechnology',
  'BS Biochemistry',
  'BS Medical Laboratory Technology',
  'BS Computer Science',
  'BS Software Engineering',
  'BS Artificial Intelligence',
  'BS Data Science',
  'BS Cyber Security',
  'BS Information Technology',
  'BS Mathematics',
  'BS Physics',
  'BS Chemistry',
  'BS Zoology',
  'BS Botany',
  'BS Agriculture',
  'BS Food Science & Technology',
  'BS Human Nutrition & Dietetics',
  'BBA',
  'Accounting & Finance',
  'Economics',
  'Psychology',
  'Law (LLB)',
  'English Literature',
  'Education',
  'Architecture',
  'Civil Engineering',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Chemical Engineering',
  'MS Computer Science',
  'PhD Software Engineering',
];

const normalizeSearchText = (value: string): string => normalizeText(value);

export const SearchView: React.FC<SearchViewProps> = ({ onSelectUniversity }) => {
  // Main Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedSector, setSelectedSector] = useState<'All' | 'Public' | 'Private'>('All');
  const [selectedDegreeLevel, setSelectedDegreeLevel] = useState('All');
  const [selectedFaculty, setSelectedFaculty] = useState('All');
  const [selectedProgram, setSelectedProgram] = useState('All');
  const [feeDisplayMode, setFeeDisplayMode] = useState<'annual' | 'semester' | 'total'>('annual');
  const [maxBudget, setMaxBudget] = useState<number>(2000000);
  const [hostelOnly, setHostelOnly] = useState(false);
  const [scholarshipOnly, setScholarshipOnly] = useState(false);
  const [genderFilter, setGenderFilter] = useState<'All' | 'Co-education' | 'Female Only' | 'Male Only'>('All');
  const [testRequirementFilter, setTestRequirementFilter] = useState<'All' | 'Required' | 'Direct'>('All');
  const [admissionStatusFilter, setAdmissionStatusFilter] = useState<'All' | 'Open' | 'Closing Soon' | 'Closed'>('All');
  const [sortBy, setSortBy] = useState<'ranking' | 'merit' | 'fee' | 'alphabetical'>('ranking');

  // Program Autocomplete Search State
  const [programSearchInput, setProgramSearchInput] = useState('');
  const [isProgramDropdownOpen, setIsProgramDropdownOpen] = useState(false);
  const programSearchRef = useRef<HTMLDivElement>(null);

  // Searchable City Filter State
  const [citySearchInput, setCitySearchInput] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const citySearchRef = useRef<HTMLDivElement>(null);

  // University counts by city
  const cityUniCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    UNIVERSITIES.forEach((uni) => {
      if (uni.city) {
        counts[uni.city] = (counts[uni.city] || 0) + 1;
      }
    });
    return counts;
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (programSearchRef.current && !programSearchRef.current.contains(event.target as Node)) {
        setIsProgramDropdownOpen(false);
      }
      if (citySearchRef.current && !citySearchRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. DYNAMIC CITY LIST (Generated dynamically from database based on selected province)
  const dynamicCities = useMemo(() => {
    const citiesSet = new Set<string>();

    UNIVERSITIES.forEach((uni) => {
      const matchProvince =
        selectedProvince === 'All' ||
        uni.province === selectedProvince ||
        (selectedProvince === 'Azad Jammu & Kashmir' && uni.province.includes('Kashmir')) ||
        (selectedProvince === 'Gilgit-Baltistan' && uni.province.includes('Gilgit'));

      if (matchProvince && uni.city) {
        citiesSet.add(uni.city);
      }
    });

    return Array.from(citiesSet).sort();
  }, [selectedProvince]);

  // Filtered dynamic cities based on user search typing
  const filteredDynamicCities = useMemo(() => {
    const q = normalizeSearchText(citySearchInput);
    if (!q) return dynamicCities;
    return dynamicCities.filter((c) => normalizeSearchText(c).includes(q));
  }, [dynamicCities, citySearchInput]);

  // Reset selected city if not present in new dynamic list
  useEffect(() => {
    if (selectedCity !== 'All' && !dynamicCities.includes(selectedCity)) {
      setSelectedCity('All');
    }
  }, [selectedProvince, dynamicCities, selectedCity]);

  // 2. DYNAMIC DISTRICT LIST
  const dynamicDistricts = useMemo(() => {
    const districtSet = new Set<string>();
    UNIVERSITIES.forEach((uni) => {
      const matchProv =
        selectedProvince === 'All' ||
        uni.province === selectedProvince ||
        (selectedProvince === 'Azad Jammu & Kashmir' && uni.province.includes('Kashmir')) ||
        (selectedProvince === 'Gilgit-Baltistan' && uni.province.includes('Gilgit'));
      const matchCity = selectedCity === 'All' || uni.city === selectedCity;

      if (matchProv && matchCity && uni.district) {
        districtSet.add(uni.district);
      }
    });
    return Array.from(districtSet).sort();
  }, [selectedProvince, selectedCity]);

  // 3. MASTER PROGRAM LIST (Extracted from all universities in database + master list)
  const masterProgramsList = useMemo(() => {
    const programSet = new Set<string>(MASTER_POPULAR_PROGRAMS);
    UNIVERSITIES.forEach((u) => {
      u.offeredPrograms.forEach((p) => {
        if (p.name) programSet.add(p.name);
      });
    });
    return Array.from(programSet).sort();
  }, []);

  // Filtered program suggestions for autocomplete search
  const programSuggestions = useMemo(() => {
    const query = normalizeSearchText(programSearchInput);
    if (!query) return masterProgramsList.slice(0, 15);
    return masterProgramsList
      .filter((p) => isProgramMatch(p, query))
      .slice(0, 15);
  }, [programSearchInput, masterProgramsList]);

  // Equivalent Program Suggestions for Fallback state
  const equivalentProgramSuggestions = useMemo(() => {
    const activeTerm = selectedProgram !== 'All' ? selectedProgram : searchQuery;
    return getEquivalentProgramSuggestions(activeTerm);
  }, [selectedProgram, searchQuery]);

  // Helper function to evaluate degree level of a program
  const getDegreeLevelOfProgram = (prog: Program): string => {
    if (prog.degreeLevel) return prog.degreeLevel;
    const nameLower = prog.name.toLowerCase();

    if (nameLower.includes('mbbs')) return 'MBBS';
    if (nameLower.includes('bds')) return 'BDS';
    if (nameLower.includes('dvm')) return 'DVM';
    if (nameLower.includes('pharm-d') || nameLower.includes('pharmacy')) return 'Pharm-D';
    if (nameLower.includes('dpt') || nameLower.includes('physical therapy')) return 'DPT';
    if (nameLower.includes('llb') || nameLower.includes('law')) return 'LLB';
    if (nameLower.includes('bba')) return 'BBA';
    if (nameLower.includes('engineering') || nameLower.startsWith('be ') || nameLower.startsWith('bsc ')) return 'BE/BSc Engineering';
    if (nameLower.startsWith('ms') || nameLower.includes('msc') || nameLower.includes('mphil')) return 'MS/MPhil';
    if (nameLower.startsWith('phd') || nameLower.includes('doctorate')) return 'PhD';
    if (nameLower.includes('adp') || nameLower.includes('associate')) return 'Associate Degree';
    if (nameLower.includes('fsc') || nameLower.includes('intermediate') || nameLower.includes('fa')) return 'Intermediate';

    return 'BS';
  };

  // Helper to compute fee amount based on active display mode
  const getUniFeeAmount = (uni: University, mode: 'annual' | 'semester' | 'total'): number => {
    if (mode === 'semester') return uni.semesterFee || Math.round(uni.annualFee / 2);
    if (mode === 'total') return uni.annualFee * 4; // 4-Year standard BS degree cost
    return uni.annualFee;
  };

  // SMART FILTERING INTERSECTION
  const filteredUniversities = useMemo(() => {
    const filtered = UNIVERSITIES.filter((uni) => {
      // 1. Search Query (Keyword search across university name, city, province, district, programs, entry tests)
      const q = normalizeSearchText(searchQuery);
      const matchesSearch =
        !q ||
        normalizeSearchText(uni.name).includes(q) ||
        normalizeSearchText(uni.shortName).includes(q) ||
        normalizeSearchText(uni.city).includes(q) ||
        (uni.district && normalizeSearchText(uni.district).includes(q)) ||
        normalizeSearchText(uni.province).includes(q) ||
        uni.offeredPrograms.some(
          (p) =>
            isProgramMatch(p.name, q) ||
            normalizeSearchText(p.category).includes(q) ||
            (p.admissionTestRequirements && normalizeSearchText(p.admissionTestRequirements).includes(q))
        );

      // 2. Province Filter
      const normalizedSelectedProvince = normalizeText(selectedProvince);
      const normalizedUniProvince = normalizeText(uni.province);
      const matchesProvince =
        selectedProvince === 'All' ||
        normalizedUniProvince === normalizedSelectedProvince ||
        normalizedUniProvince.includes(normalizedSelectedProvince) ||
        normalizedSelectedProvince.includes(normalizedUniProvince) ||
        (selectedProvince === 'Azad Jammu & Kashmir' && normalizedUniProvince.includes('kashmir')) ||
        (selectedProvince === 'Gilgit-Baltistan' && normalizedUniProvince.includes('gilgit'));

      // 3. City Filter
      const normalizedSelectedCity = normalizeText(selectedCity);
      const normalizedUniCity = normalizeText(uni.city);
      const matchesCity =
        selectedCity === 'All' ||
        normalizedUniCity === normalizedSelectedCity ||
        normalizedUniCity.includes(normalizedSelectedCity) ||
        normalizedSelectedCity.includes(normalizedUniCity);

      // 4. District Filter
      const normalizedSelectedDistrict = normalizeText(selectedDistrict);
      const normalizedUniDistrict = uni.district ? normalizeText(uni.district) : '';
      const matchesDistrict =
        selectedDistrict === 'All' ||
        (uni.district && (normalizedUniDistrict === normalizedSelectedDistrict || normalizedUniDistrict.includes(normalizedSelectedDistrict) || normalizedSelectedDistrict.includes(normalizedUniDistrict)));

      // 5. Sector (Public / Private)
      const matchesSector = selectedSector === 'All' || uni.sector === selectedSector;

      // 6. Degree Level Filter
      const matchesDegreeLevel =
        selectedDegreeLevel === 'All' ||
        uni.offeredPrograms.some((p) => {
          const level = getDegreeLevelOfProgram(p);
          if (selectedDegreeLevel === 'BS') {
            return level === 'BS' || p.name.toLowerCase().startsWith('bs ');
          }
          if (selectedDegreeLevel === 'BE/BSc Engineering') {
            return level === 'BE/BSc Engineering' || p.category === 'Engineering';
          }
          if (selectedDegreeLevel === 'MS/MPhil') {
            return level === 'MS/MPhil' || p.degreeLevel === 'MS';
          }
          return level === selectedDegreeLevel || (p.degreeLevel && p.degreeLevel === selectedDegreeLevel);
        });

      // 7. Faculty / Field of Study Filter
      const matchesFaculty =
        selectedFaculty === 'All' ||
        uni.fieldOfStudy.some((f) => f.toLowerCase() === selectedFaculty.toLowerCase()) ||
        uni.offeredPrograms.some((p) => p.category.toLowerCase() === selectedFaculty.toLowerCase());

      const activeProgramQuery = selectedProgram !== 'All' ? selectedProgram : programSearchInput;

      // 8. Specific Program Filter with Synonym Mapping
      const matchesProgram =
        activeProgramQuery === 'All' ||
        uni.offeredPrograms.some((p) => isProgramMatch(p.name, activeProgramQuery));

      // 9. Fee Filter
      const currentFee = getUniFeeAmount(uni, feeDisplayMode);
      const matchesFee = currentFee <= maxBudget;

      // 10. Hostel Availability Filter
      const matchesHostel = !hostelOnly || uni.hostelAvailable === true || (uni.hostelInfo && !uni.hostelInfo.description.toLowerCase().includes('not available'));

      // 11. Scholarships Availability Filter
      const matchesScholarship = !scholarshipOnly || uni.scholarshipsAvailable === true || (uni.scholarships && uni.scholarships.length > 0);

      // 12. Gender Filter
      const matchesGender =
        genderFilter === 'All' ||
        !uni.genderType ||
        uni.genderType === genderFilter ||
        uni.genderType === 'Co-education';

      // 13. Entrance Test Requirement Filter
      const matchesTestRequirement =
        testRequirementFilter === 'All' ||
        (testRequirementFilter === 'Required' &&
          (uni.hasEntranceTest === true ||
            uni.offeredPrograms.some(
              (p) => p.requiresEntranceTest || (p.admissionTestRequirements && !p.admissionTestRequirements.toLowerCase().includes('no test'))
            ))) ||
        (testRequirementFilter === 'Direct' &&
          (uni.hasEntranceTest === false ||
            uni.offeredPrograms.some((p) => p.admissionTestRequirements && p.admissionTestRequirements.toLowerCase().includes('no test'))));

      // 14. Admission Status Filter
      const matchesAdmissionStatus =
        admissionStatusFilter === 'All' ||
        uni.admissionStatus.statusText.toLowerCase() === admissionStatusFilter.toLowerCase() ||
        (admissionStatusFilter === 'Open' && uni.admissionStatus.statusText === 'Closing Soon');

      return (
        matchesSearch &&
        matchesProvince &&
        matchesCity &&
        matchesDistrict &&
        matchesSector &&
        matchesDegreeLevel &&
        matchesFaculty &&
        matchesProgram &&
        matchesFee &&
        matchesHostel &&
        matchesScholarship &&
        matchesGender &&
        matchesTestRequirement &&
        matchesAdmissionStatus
      );
    });

    const uniqueUniversities = filtered.filter((uni, index, self) => self.findIndex((item) => item.id === uni.id) === index);

    return uniqueUniversities.sort((a, b) => {
      if (sortBy === 'ranking') return (a.hecRanking || 99) - (b.hecRanking || 99);
      if (sortBy === 'merit') return b.closingMerit - a.closingMerit;
      if (sortBy === 'fee') return getUniFeeAmount(a, feeDisplayMode) - getUniFeeAmount(b, feeDisplayMode);
      if (sortBy === 'alphabetical') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [
    searchQuery,
    selectedProvince,
    selectedCity,
    selectedDistrict,
    selectedSector,
    selectedDegreeLevel,
    selectedFaculty,
    selectedProgram,
    programSearchInput,
    feeDisplayMode,
    maxBudget,
    hostelOnly,
    scholarshipOnly,
    genderFilter,
    testRequirementFilter,
    admissionStatusFilter,
    sortBy,
  ]);

  // Recommended Universities fallback list when strict filters yield 0 exact results
  const recommendedUniversities = useMemo(() => {
    if (filteredUniversities.length > 0) return [];

    // Relax filters to recommend nearest top universities in the province or nearby cities
    const recommendations = UNIVERSITIES.filter((uni) => {
      if (selectedCity !== 'All') {
        const matchProv = selectedProvince === 'All' || uni.province === selectedProvince;
        return matchProv && normalizeText(uni.city) !== normalizeText(selectedCity);
      }
      const matchesProvince = selectedProvince === 'All' || uni.province === selectedProvince;
      const matchesSector = selectedSector === 'All' || uni.sector === selectedSector;
      return matchesProvince && matchesSector;
    });

    const uniqueRecommendations = recommendations.filter((uni, index, self) => self.findIndex((item) => item.id === uni.id) === index);

    return uniqueRecommendations.sort((a, b) => (a.hecRanking || 99) - (b.hecRanking || 99)).slice(0, 6);
  }, [filteredUniversities, selectedCity, selectedProvince, selectedSector]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedProvince !== 'All') count++;
    if (selectedCity !== 'All') count++;
    if (selectedDistrict !== 'All') count++;
    if (selectedSector !== 'All') count++;
    if (selectedDegreeLevel !== 'All') count++;
    if (selectedFaculty !== 'All') count++;
    if (selectedProgram !== 'All') count++;
    if (maxBudget < 2000000) count++;
    if (hostelOnly) count++;
    if (scholarshipOnly) count++;
    if (genderFilter !== 'All') count++;
    if (testRequirementFilter !== 'All') count++;
    if (admissionStatusFilter !== 'All') count++;
    if (searchQuery.trim().length > 0) count++;
    return count;
  }, [
    selectedProvince,
    selectedCity,
    selectedDistrict,
    selectedSector,
    selectedDegreeLevel,
    selectedFaculty,
    selectedProgram,
    maxBudget,
    hostelOnly,
    scholarshipOnly,
    genderFilter,
    testRequirementFilter,
    admissionStatusFilter,
    searchQuery,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedProvince('All');
    setSelectedCity('All');
    setCitySearchInput('');
    setSelectedDistrict('All');
    setSelectedSector('All');
    setSelectedDegreeLevel('All');
    setSelectedFaculty('All');
    setSelectedProgram('All');
    setProgramSearchInput('');
    setFeeDisplayMode('annual');
    setMaxBudget(2000000);
    setHostelOnly(false);
    setScholarshipOnly(false);
    setGenderFilter('All');
    setTestRequirementFilter('All');
    setAdmissionStatusFilter('All');
    setSortBy('ranking');
  };

  const handleSelectProgramFromAutocomplete = (progName: string) => {
    setSelectedProgram(progName);
    setProgramSearchInput(progName);
    setIsProgramDropdownOpen(false);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 space-y-8 animate-fade-in">
      {/* Search Hero Banner */}
      <div className="bg-gradient-to-r from-[#00288e] to-[#2170e4] text-white p-6 md:p-8 rounded-3xl shadow-lg space-y-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">manage_search</span>
            <span>HEC Recognized University Directory & Intelligent Admissions Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Find Universities & Degree Programs across All Pakistan
          </h1>
          <p className="text-sm text-white/90 leading-relaxed">
            Filter by Province, dynamically generated Cities & Districts, Degree Level, Faculty, Fee Structure, Hostel Availability, or Search Equivalent Programs (e.g., BBA, MBBS, BS CS, Microbiology, Agriculture, Law).
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="space-y-3 max-w-4xl">
          <div className="bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-2 flex-1 px-3 py-1 text-[#0b1c30] w-full">
              <span className="material-symbols-outlined text-[#00288e] text-2xl">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by program (BBA, MBBS, DVM, BS CS, Microbiology), university name, or city..."
                className="w-full text-xs md:text-sm font-medium focus:outline-none placeholder-[#444653]/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#444653] hover:text-black p-1 rounded-full hover:bg-gray-100"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
            <button className="bg-[#00288e] hover:bg-[#1e40af] text-white font-bold text-xs md:text-sm px-6 py-3 rounded-xl transition-all w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 shadow-md cursor-pointer">
              <span>Search Database</span>
            </button>
          </div>

          {/* Quick Program Tags */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar pt-1">
            <span className="text-white/80 text-[11px] font-bold shrink-0 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">local_offer</span>
              Popular Programs:
            </span>
            {[
              'BS Computer Science',
              'MBBS',
              'BDS',
              'DVM',
              'Pharm-D',
              'BS Microbiology',
              'BS Software Engineering',
              'BS Artificial Intelligence',
              'BBA',
              'Civil Engineering',
              'Law (LLB)',
            ].map((tag) => {
              const isSelected = selectedProgram.toLowerCase().includes(tag.toLowerCase());
              return (
                <button
                  key={tag}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedProgram('All');
                      setProgramSearchInput('');
                    } else {
                      setSelectedProgram(tag);
                      setProgramSearchInput(tag);
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-white text-[#00288e] border-white shadow-sm'
                      : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-4 bg-white p-5 rounded-2xl shadow-sm border border-[#c4c5d5]/30 space-y-5">
          <div className="flex items-center justify-between border-b border-[#c4c5d5]/20 pb-3">
            <h2 className="font-bold text-sm text-[#0b1c30] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00288e] text-lg">tune</span>
              <span>Intelligent Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-[#00288e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#00288e] font-bold hover:underline cursor-pointer"
            >
              Clear Filters
            </button>
          </div>

          {/* 1. Program Search with Synonym Autocomplete */}
          <div className="space-y-1.5" ref={programSearchRef}>
            <label className="text-xs font-bold text-[#00288e] flex items-center justify-between">
              <span>Program & Equivalent Search</span>
              {selectedProgram !== 'All' && (
                <button
                  onClick={() => {
                    setSelectedProgram('All');
                    setProgramSearchInput('');
                  }}
                  className="text-[10px] text-rose-600 hover:underline font-bold cursor-pointer"
                >
                  Clear Program
                </button>
              )}
            </label>

            <div className="relative">
              <div className="flex items-center bg-[#eff4ff] border-2 border-[#2170e4]/30 rounded-xl px-3 py-2">
                <span className="material-symbols-outlined text-[#00288e] text-sm mr-2 shrink-0">
                  search
                </span>
                <input
                  type="text"
                  value={programSearchInput}
                  onChange={(e) => {
                    setProgramSearchInput(e.target.value);
                    setIsProgramDropdownOpen(true);
                    if (!e.target.value) {
                      setSelectedProgram('All');
                    }
                  }}
                  onFocus={() => setIsProgramDropdownOpen(true)}
                  placeholder="Type program name (e.g. BBA, MBBS, DVM, Microbiology...)"
                  className="w-full bg-transparent text-xs font-bold text-[#0b1c30] focus:outline-none placeholder-[#444653]/60"
                />
                {programSearchInput && (
                  <button
                    onClick={() => {
                      setProgramSearchInput('');
                      setSelectedProgram('All');
                    }}
                    className="text-[#444653] hover:text-black ml-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown List */}
              {isProgramDropdownOpen && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-[#c4c5d5]/40 max-h-56 overflow-y-auto divide-y divide-[#c4c5d5]/20 text-xs">
                  <button
                    onClick={() => {
                      setSelectedProgram('All');
                      setProgramSearchInput('');
                      setIsProgramDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#eff4ff] font-bold text-[#00288e] flex items-center justify-between cursor-pointer"
                  >
                    <span>All Degree Programs</span>
                    <span className="material-symbols-outlined text-xs">done_all</span>
                  </button>

                  {programSuggestions.map((progName) => (
                    <button
                      key={progName}
                      onClick={() => handleSelectProgramFromAutocomplete(progName)}
                      className={`w-full text-left px-3 py-2 hover:bg-[#f8f9ff] flex items-center justify-between transition-colors cursor-pointer ${
                        selectedProgram === progName ? 'bg-[#eff4ff] font-extrabold text-[#00288e]' : 'text-[#0b1c30]'
                      }`}
                    >
                      <span>{progName}</span>
                      {selectedProgram === progName && (
                        <span className="material-symbols-outlined text-xs text-[#00288e]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 2. Province Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0b1c30] block">Province / Region</label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full text-xs p-2.5 bg-[#f8f9ff] border border-[#c4c5d5] rounded-xl focus:outline-none focus:border-[#00288e] text-[#0b1c30] font-medium cursor-pointer"
            >
              {ALL_PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p === 'All' ? 'All Provinces & Regions' : p}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Searchable Dynamic City Filter */}
          <div className="space-y-1.5" ref={citySearchRef}>
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-[#0b1c30]">City (HEC Directory)</label>
              <span className="text-[10px] text-[#00288e] font-bold bg-[#eff4ff] px-2 py-0.5 rounded-full border border-[#2170e4]/20">
                {dynamicCities.length} Cities
              </span>
            </div>

            <div className="relative">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-2.5 text-sm text-[#00288e] pointer-events-none">
                  location_on
                </span>
                <input
                  type="text"
                  placeholder={selectedCity !== 'All' ? selectedCity : "Search city (e.g. Gujrat, Swat)..."}
                  value={isCityDropdownOpen ? citySearchInput : (selectedCity !== 'All' ? selectedCity : citySearchInput)}
                  onFocus={() => {
                    setIsCityDropdownOpen(true);
                    setCitySearchInput('');
                  }}
                  onChange={(e) => {
                    setCitySearchInput(e.target.value);
                    setIsCityDropdownOpen(true);
                  }}
                  className="w-full text-xs pl-8 pr-8 py-2.5 bg-[#f8f9ff] border border-[#c4c5d5] rounded-xl focus:outline-none focus:border-[#00288e] text-[#0b1c30] font-medium placeholder-[#666677]"
                />
                {selectedCity !== 'All' || citySearchInput ? (
                  <button
                    onClick={() => {
                      setSelectedCity('All');
                      setCitySearchInput('');
                      setIsCityDropdownOpen(false);
                    }}
                    className="absolute right-2 text-[#444653] hover:text-rose-600 cursor-pointer p-1 flex items-center"
                    title="Clear city selection"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                    className="absolute right-2 text-[#444653] cursor-pointer p-1 flex items-center"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
                  </button>
                )}
              </div>

              {/* City Autocomplete Dropdown List */}
              {isCityDropdownOpen && (
                <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-[#c4c5d5] rounded-xl shadow-xl max-h-60 overflow-y-auto text-xs py-1 divide-y divide-gray-100">
                  <button
                    onClick={() => {
                      setSelectedCity('All');
                      setCitySearchInput('');
                      setIsCityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-[#eff4ff] flex items-center justify-between font-bold cursor-pointer ${
                      selectedCity === 'All' ? 'text-[#00288e] bg-[#eff4ff]' : 'text-[#0b1c30]'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">public</span>
                      <span>All Cities ({dynamicCities.length})</span>
                    </span>
                    {selectedCity === 'All' && <span className="material-symbols-outlined text-xs">check</span>}
                  </button>

                  {filteredDynamicCities.length > 0 ? (
                    filteredDynamicCities.map((c) => {
                      const count = cityUniCounts[c] || 0;
                      return (
                        <button
                          key={c}
                          onClick={() => {
                            setSelectedCity(c);
                            setCitySearchInput(c);
                            setIsCityDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-[#eff4ff] flex items-center justify-between cursor-pointer transition-colors ${
                            selectedCity === c ? 'text-[#00288e] font-extrabold bg-[#eff4ff]' : 'text-[#0b1c30]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-xs text-[#00288e]">location_city</span>
                            <span>{c}</span>
                          </div>
                          <span className="text-[10px] text-[#00288e] font-semibold bg-[#f8f9ff] px-2 py-0.5 rounded border border-[#2170e4]/20">
                            {count} {count === 1 ? 'Campus' : 'Campuses'}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-3 text-[#666677] text-center italic text-xs">
                      No HEC-recognized university campus found in "{citySearchInput}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 4. District Filter (if available) */}
          {dynamicDistricts.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0b1c30] block">District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#f8f9ff] border border-[#c4c5d5] rounded-xl focus:outline-none focus:border-[#00288e] text-[#0b1c30] font-medium cursor-pointer"
              >
                <option value="All">All Districts</option>
                {dynamicDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 5. Sector (Public / Private) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#0b1c30] block">
              University Sector Type
            </label>
            <div className="flex gap-2">
              {(['All', 'Public', 'Private'] as const).map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSelectedSector(sec)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    selectedSector === sec
                      ? 'bg-[#00288e] text-white border-[#00288e] shadow-sm'
                      : 'bg-[#f8f9ff] text-[#444653] border-[#c4c5d5]/40 hover:bg-[#eff4ff]'
                  }`}
                >
                  {sec === 'All' ? 'All Types' : `${sec} Sector`}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Degree Level Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0b1c30] block">
              Degree Level Filter
            </label>
            <select
              value={selectedDegreeLevel}
              onChange={(e) => setSelectedDegreeLevel(e.target.value)}
              className="w-full text-xs p-2.5 bg-[#f8f9ff] border border-[#c4c5d5] rounded-xl focus:outline-none focus:border-[#00288e] text-[#0b1c30] font-medium cursor-pointer"
            >
              {DEGREE_LEVELS.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>
                  {lvl.label}
                </option>
              ))}
            </select>
          </div>

          {/* 7. Faculty / Discipline Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0b1c30] block">
              Faculty / Discipline
            </label>
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="w-full text-xs p-2.5 bg-[#f8f9ff] border border-[#c4c5d5] rounded-xl focus:outline-none focus:border-[#00288e] text-[#0b1c30] font-medium cursor-pointer"
            >
              {FACULTIES.map((fac) => (
                <option key={fac} value={fac}>
                  {fac === 'All' ? 'All Faculties' : `Faculty of ${fac}`}
                </option>
              ))}
            </select>
          </div>

          {/* 8. Fee Filter & Fee View Mode */}
          <div className="space-y-3 pt-3 border-t border-[#c4c5d5]/20">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-[#0b1c30]">Max Fee Budget</label>
              <div className="flex gap-1 bg-[#f8f9ff] p-1 rounded-lg border border-[#c4c5d5]/30 text-[10px]">
                <button
                  type="button"
                  onClick={() => setFeeDisplayMode('semester')}
                  className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                    feeDisplayMode === 'semester' ? 'bg-[#00288e] text-white' : 'text-[#444653]'
                  }`}
                >
                  Semester
                </button>
                <button
                  type="button"
                  onClick={() => setFeeDisplayMode('annual')}
                  className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                    feeDisplayMode === 'annual' ? 'bg-[#00288e] text-white' : 'text-[#444653]'
                  }`}
                >
                  Annual
                </button>
                <button
                  type="button"
                  onClick={() => setFeeDisplayMode('total')}
                  className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                    feeDisplayMode === 'total' ? 'bg-[#00288e] text-white' : 'text-[#444653]'
                  }`}
                >
                  Total Degree
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-[#00288e] bg-[#eff4ff] p-2 rounded-xl">
              <span>Selected Limit:</span>
              <span>{(maxBudget / 100000).toFixed(1)} Lacs PKR ({feeDisplayMode})</span>
            </div>

            <input
              type="range"
              min="50000"
              max="5000000"
              step="50000"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-[#00288e] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#444653]">
              <span>50k PKR</span>
              <span>50 Lacs PKR</span>
            </div>
          </div>

          {/* 9. Extra Facility & Admission Filters */}
          <div className="space-y-3 pt-3 border-t border-[#c4c5d5]/20 text-xs">
            <p className="font-bold text-[#0b1c30]">Facilities & Admission Criteria</p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setHostelOnly(!hostelOnly)}
                className={`p-2.5 rounded-xl border font-bold flex items-center justify-between cursor-pointer transition-colors ${
                  hostelOnly
                    ? 'bg-[#00288e] text-white border-[#00288e]'
                    : 'bg-[#f8f9ff] text-[#0b1c30] border-[#c4c5d5]/40 hover:bg-[#eff4ff]'
                }`}
              >
                <span>Hostel Available</span>
                <span className="material-symbols-outlined text-sm">bed</span>
              </button>

              <button
                type="button"
                onClick={() => setScholarshipOnly(!scholarshipOnly)}
                className={`p-2.5 rounded-xl border font-bold flex items-center justify-between cursor-pointer transition-colors ${
                  scholarshipOnly
                    ? 'bg-[#00288e] text-white border-[#00288e]'
                    : 'bg-[#f8f9ff] text-[#0b1c30] border-[#c4c5d5]/40 hover:bg-[#eff4ff]'
                }`}
              >
                <span>Scholarships</span>
                <span className="material-symbols-outlined text-sm">card_giftcard</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#0b1c30] block">Entrance Test Required</label>
              <select
                value={testRequirementFilter}
                onChange={(e) => setTestRequirementFilter(e.target.value as any)}
                className="w-full text-xs p-2.5 bg-[#f8f9ff] border border-[#c4c5d5] rounded-xl focus:outline-none text-[#0b1c30] font-medium cursor-pointer"
              >
                <option value="All">All (Test Required & Direct Merit)</option>
                <option value="Required">Requires Entrance Test (MDCAT/ECAT/NET)</option>
                <option value="Direct">Direct Academic Merit (No Test Required)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#0b1c30] block">Admission Status</label>
              <select
                value={admissionStatusFilter}
                onChange={(e) => setAdmissionStatusFilter(e.target.value as any)}
                className="w-full text-xs p-2.5 bg-[#f8f9ff] border border-[#c4c5d5] rounded-xl focus:outline-none text-[#0b1c30] font-medium cursor-pointer"
              >
                <option value="All">All Admission Statuses</option>
                <option value="Open">Admissions Currently Open</option>
                <option value="Closing Soon">Closing Soon</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Results Main Section */}
        <main className="lg:col-span-8 space-y-6">
          {/* Active Filter Chips & Control Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#c4c5d5]/30 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <p className="font-bold text-[#0b1c30]">
                  Found <span className="text-[#00288e] text-base font-extrabold">{filteredUniversities.length}</span> Universities
                </p>
                {activeFiltersCount > 0 && (
                  <span className="bg-[#00288e] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {activeFiltersCount} Active Filters
                  </span>
                )}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[#444653] font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#f8f9ff] border border-[#c4c5d5] px-3 py-1.5 rounded-lg font-bold text-[#0b1c30] focus:outline-none cursor-pointer"
                >
                  <option value="ranking">HEC Ranking (Top First)</option>
                  <option value="merit">Closing Merit (Highest First)</option>
                  <option value="fee">Fee ({feeDisplayMode}) (Lowest First)</option>
                  <option value="alphabetical">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Active Filter Removable Chips */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#c4c5d5]/20 text-xs">
                <span className="text-[11px] text-[#444653] font-bold">Active:</span>

                {selectedProvince !== 'All' && (
                  <span className="inline-flex items-center gap-1 bg-[#eff4ff] text-[#00288e] px-2.5 py-0.5 rounded-full border border-[#2170e4]/20 font-semibold text-[11px]">
                    Province: {selectedProvince}
                    <button onClick={() => setSelectedProvince('All')} className="hover:text-rose-600 cursor-pointer">
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </span>
                )}

                {selectedCity !== 'All' && (
                  <span className="inline-flex items-center gap-1 bg-[#eff4ff] text-[#00288e] px-2.5 py-0.5 rounded-full border border-[#2170e4]/20 font-semibold text-[11px]">
                    City: {selectedCity}
                    <button onClick={() => setSelectedCity('All')} className="hover:text-rose-600 cursor-pointer">
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </span>
                )}

                {selectedSector !== 'All' && (
                  <span className="inline-flex items-center gap-1 bg-[#eff4ff] text-[#00288e] px-2.5 py-0.5 rounded-full border border-[#2170e4]/20 font-semibold text-[11px]">
                    Sector: {selectedSector}
                    <button onClick={() => setSelectedSector('All')} className="hover:text-rose-600 cursor-pointer">
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </span>
                )}

                {selectedDegreeLevel !== 'All' && (
                  <span className="inline-flex items-center gap-1 bg-[#eff4ff] text-[#00288e] px-2.5 py-0.5 rounded-full border border-[#2170e4]/20 font-semibold text-[11px]">
                    Degree Level: {selectedDegreeLevel}
                    <button onClick={() => setSelectedDegreeLevel('All')} className="hover:text-rose-600 cursor-pointer">
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </span>
                )}

                {selectedProgram !== 'All' && (
                  <span className="inline-flex items-center gap-1 bg-[#00288e] text-white px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                    Program: {selectedProgram}
                    <button
                      onClick={() => {
                        setSelectedProgram('All');
                        setProgramSearchInput('');
                      }}
                      className="hover:text-rose-300 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </span>
                )}

                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-[#eff4ff] text-[#00288e] px-2.5 py-0.5 rounded-full border border-[#2170e4]/20 font-semibold text-[11px]">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-rose-600 cursor-pointer">
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </span>
                )}

                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-rose-600 font-bold hover:underline ml-auto cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-6">
            {filteredUniversities.map((uni) => {
              // Extract matching programs for this university based on active filters & synonym mapping
              const programFilterQuery = selectedProgram !== 'All' ? selectedProgram : programSearchInput;
              const searchQ = normalizeSearchText(searchQuery);
              const progQ = normalizeSearchText(programFilterQuery || 'All');

              const matchingPrograms = uni.offeredPrograms.filter((p) => {
                const matchesSearchQ = searchQ && isProgramMatch(p.name, searchQ);
                const matchesProgQ = progQ !== 'all' && isProgramMatch(p.name, progQ);

                const matchesLvl =
                  selectedDegreeLevel === 'All' ||
                  getDegreeLevelOfProgram(p) === selectedDegreeLevel ||
                  p.degreeLevel === selectedDegreeLevel;

                return matchesSearchQ || matchesProgQ || (matchesLvl && selectedDegreeLevel !== 'All');
              });

              const semesterFeeDisplay = `PKR ${(uni.semesterFee || Math.round(uni.annualFee / 2)).toLocaleString()}`;
              const annualFeeDisplay = `PKR ${uni.annualFee.toLocaleString()}`;
              const totalDegreeCostDisplay = `PKR ${(uni.annualFee * 4).toLocaleString()} (4-Yr Total)`;

              return (
                <div
                  key={uni.id}
                  className="bg-white rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all border border-[#c4c5d5]/30 space-y-4 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <img
                          src={uni.logoUrl}
                          alt={uni.shortName}
                          className="w-14 h-14 rounded-2xl object-contain bg-white border border-[#c4c5d5]/30 p-1 shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-base md:text-lg text-[#0b1c30] group-hover:text-[#00288e] transition-colors leading-snug">
                              {uni.name}
                            </h3>
                          </div>
                          <p className="text-xs text-[#444653] mt-1 flex items-center gap-1.5 flex-wrap">
                            <span className="material-symbols-outlined text-sm text-[#00288e]">
                              location_on
                            </span>
                            <span>
                              {uni.city}, {uni.province} {uni.district ? `(${uni.district} Dist.)` : ''}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[11px] font-bold bg-[#eff4ff] text-[#00288e] px-2.5 py-1 rounded-full border border-[#2170e4]/20">
                          {uni.badge}
                        </span>
                        <span className="text-[10px] text-[#444653] font-semibold">
                          {uni.sector} Sector
                        </span>
                      </div>
                    </div>

                    {/* Fee & Merit Stats Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-[#f8f9ff] p-3 rounded-xl border border-[#c4c5d5]/20 text-xs">
                      <div>
                        <span className="text-[10px] text-[#444653] block font-medium">HEC Ranking</span>
                        <span className="font-bold text-[#0b1c30]">#{uni.hecRanking || 'N/A'} in Pakistan</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#444653] block font-medium">Avg Closing Merit</span>
                        <span className="font-extrabold text-[#00288e]">{uni.closingMeritDisplay}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#444653] block font-medium">Semester Fee</span>
                        <span className="font-bold text-[#0b1c30]">{semesterFeeDisplay}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#444653] block font-medium">Total Degree Cost</span>
                        <span className="font-extrabold text-[#00288e]">{totalDegreeCostDisplay}</span>
                      </div>
                    </div>

                    {/* Highlighted Offered Programs & Details */}
                    {matchingPrograms.length > 0 ? (
                      <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#2170e4]/20 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <p className="font-bold text-[#00288e] flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">stars</span>
                            <span>Matching Programs ({matchingPrograms.length})</span>
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {matchingPrograms.map((prog) => (
                            <button
                              key={prog.id}
                              onClick={() => onSelectUniversity(uni, prog.id)}
                              className="bg-white p-3 rounded-xl border border-[#c4c5d5]/30 text-xs space-y-1.5 text-left hover:border-[#00288e] hover:shadow-xs transition-all group/prog cursor-pointer"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-extrabold text-[#0b1c30] group-hover/prog:text-[#00288e]">
                                  {prog.name}
                                </span>
                                <span className="text-[9px] bg-[#00288e] text-white font-bold px-1.5 py-0.5 rounded shrink-0">
                                  {prog.duration}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-1 text-[11px] text-[#444653]">
                                <span>Closing Merit: <strong className="text-[#00288e]">{prog.closingMerit}</strong></span>
                                <span>Seats: <strong className="text-[#0b1c30]">{prog.seats}</strong></span>
                              </div>

                              <div className="text-[10px] text-[#444653] pt-1 border-t border-[#c4c5d5]/20 flex items-center justify-between">
                                <span>Test: {prog.admissionTestRequirements.split(' ')[0]}</span>
                                <span className="font-bold text-[#00288e] flex items-center gap-0.5">
                                  <span>View Details</span>
                                  <span className="material-symbols-outlined text-xs">chevron_right</span>
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-[#444653] bg-[#f8f9ff] p-3 rounded-xl border border-[#c4c5d5]/20">
                        <span className="font-bold text-[#0b1c30]">Offered Degree Programs: </span>
                        {uni.offeredPrograms.slice(0, 5).map((p) => p.name).join(' • ')}
                        {uni.offeredPrograms.length > 5 && ` + ${uni.offeredPrograms.length - 5} more`}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  {(() => {
                    const dynStatus = getDynamicAdmissionStatus(5, 1, 7, 25, 8, 10, 8, 25);
                    return (
                      <div className="pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#c4c5d5]/20 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${dynStatus.badgeColor}`}>
                            ● {dynStatus.term}: {dynStatus.statusText}
                          </span>
                          <span className="text-[11px] text-[#444653] font-medium hidden sm:inline">
                            Deadline: {dynStatus.formattedDeadline}
                          </span>
                          <span className="text-[10px] text-[#00288e] bg-[#eff4ff] px-2 py-0.5 rounded font-bold border border-[#2170e4]/20">
                            (API Live Sync Ready)
                          </span>
                        </div>

                        <button
                          onClick={() => onSelectUniversity(uni)}
                          className="bg-[#00288e] hover:bg-[#1e40af] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
                        >
                          <span>Explore Campus & Programs</span>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            })}

            {/* Smart Fallback Search State when No Exact Matches Found */}
            {filteredUniversities.length === 0 && (
              <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-[#2170e4]/40 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-[#eff4ff] rounded-full flex items-center justify-center mx-auto text-[#00288e]">
                    <span className="material-symbols-outlined text-2xl">location_off</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-[#0b1c30]">
                    {selectedCity !== 'All'
                      ? `No HEC-recognized university found in ${selectedCity} matching active filters`
                      : 'No exact match found for your selected filters'}
                  </h3>
                  <p className="text-xs text-[#444653] max-w-lg mx-auto leading-relaxed">
                    {selectedCity !== 'All'
                      ? `No HEC-recognized university found in ${selectedCity} matching all active criteria. Here are the nearest universities in neighboring cities:`
                      : `No university matched all filter parameters simultaneously (Province: ${selectedProvince}, City: ${selectedCity}, Program: ${selectedProgram !== 'All' ? selectedProgram : searchQuery || 'Any'}).`}
                  </p>
                </div>

                {/* Synonym Recommendations */}
                {equivalentProgramSuggestions.length > 0 && (
                  <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#2170e4]/30 space-y-2">
                    <p className="text-xs font-bold text-[#00288e] flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">lightbulb</span>
                      <span>Showing similar programs you may be interested in:</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {equivalentProgramSuggestions.map((sug) => (
                        <button
                          key={sug}
                          onClick={() => {
                            setSelectedProgram(sug);
                            setProgramSearchInput(sug);
                          }}
                          className="bg-white text-[#00288e] font-bold text-xs px-3 py-1.5 rounded-lg border border-[#2170e4]/30 hover:bg-[#00288e] hover:text-white transition-colors cursor-pointer"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Top / Nearest Universities */}
                {recommendedUniversities.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-[#00288e] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">near_me</span>
                      <span>
                        {selectedCity !== 'All'
                          ? `Nearest Universities in Neighboring Cities (${selectedProvince !== 'All' ? selectedProvince : 'Pakistan'}):`
                          : `Recommended Universities in ${selectedProvince !== 'All' ? selectedProvince : 'Pakistan'}:`}
                      </span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {recommendedUniversities.map((uni) => (
                        <div
                          key={uni.id}
                          className="bg-[#f8f9ff] p-4 rounded-xl border border-[#c4c5d5]/30 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <img src={uni.logoUrl} alt={uni.shortName} className="w-10 h-10 object-contain rounded-lg bg-white p-1" />
                            <div>
                              <p className="font-bold text-xs text-[#0b1c30]">{uni.name}</p>
                              <p className="text-[11px] text-[#444653]">{uni.city}, {uni.province}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => onSelectUniversity(uni)}
                            className="bg-[#00288e] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shrink-0 cursor-pointer"
                          >
                            Explore
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-center pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="bg-[#00288e] hover:bg-[#1e40af] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md cursor-pointer inline-flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">restart_alt</span>
                    <span>Reset All Filters to See All Universities</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
