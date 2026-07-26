// Comprehensive Program Synonym and Equivalent Program Mapping Engine for Pakistani Universities

export const PROGRAM_SYNONYM_GROUPS: Record<string, string[]> = {
  // Business & Commerce Cluster
  bba: [
    'bba',
    'bba hons',
    'bba (hons)',
    'bachelor of business administration',
    'bs business administration',
    'bs management sciences',
    'b.com',
    'bs commerce',
    'finance',
    'accounting',
    'accounting & finance',
    'marketing',
    'human resource management',
    'hrm',
    'entrepreneurship',
    'supply chain management',
    'bs banking & finance',
    'bs executive business',
  ],
  business: [
    'bba',
    'business administration',
    'management sciences',
    'b.com',
    'commerce',
    'finance',
    'accounting',
    'marketing',
    'entrepreneurship',
    'supply chain',
  ],
  finance: ['accounting & finance', 'bs finance', 'banking & finance', 'financial economics', 'bba', 'b.com'],

  // Computer Science & IT Cluster
  'computer science': [
    'bs computer science',
    'bscs',
    'bs cs',
    'bs software engineering',
    'bs se',
    'bs artificial intelligence',
    'bs ai',
    'bs data science',
    'bs cyber security',
    'bs information technology',
    'bs it',
    'bs computer engineering',
    'computer science',
  ],
  cs: ['bs computer science', 'software engineering', 'artificial intelligence', 'data science', 'cyber security', 'information technology'],
  ai: ['artificial intelligence', 'bs ai', 'data science', 'machine learning', 'computer science', 'software engineering'],
  'software engineering': ['bs software engineering', 'bs se', 'bs computer science', 'bs ai', 'bs data science'],
  it: ['information technology', 'bs it', 'computer science', 'software engineering', 'cyber security'],

  // Medical, Dentistry, Veterinary & Allied Health Sciences Cluster
  medical: [
    'mbbs',
    'bds',
    'dvm',
    'pharm-d',
    'pharmd',
    'pharmacy',
    'dpt',
    'doctor of physical therapy',
    'physical therapy',
    'bs microbiology',
    'bs biotechnology',
    'bs biochemistry',
    'bs medical laboratory technology',
    'bs mlt',
    'bs nursing',
    'bs human nutrition & dietetics',
    'bs radiologic technology',
  ],
  mbbs: ['mbbs', 'bachelor of medicine', 'bds', 'dental surgery', 'dvm', 'pharm-d', 'pharmd', 'dpt'],
  bds: ['bds', 'bachelor of dental surgery', 'mbbs', 'dvm', 'pharm-d', 'pharmd'],
  dvm: ['dvm', 'doctor of veterinary medicine', 'veterinary science', 'animal sciences', 'mbbs', 'bs agriculture'],
  pharmacy: ['pharm-d', 'pharmd', 'doctor of pharmacy', 'pharmaceutical sciences', 'bs pharmacology', 'bs biochemistry'],
  dpt: ['dpt', 'doctor of physical therapy', 'physical therapy', 'doctor of physiotherapy'],
  microbiology: ['bs microbiology', 'microbiology', 'bs biotechnology', 'bs biochemistry', 'bs molecular biology', 'bs genetics', 'bs mlt'],
  biotechnology: ['bs biotechnology', 'biotechnology', 'bs microbiology', 'bs biochemistry', 'bs bioinformatics', 'bs genetics'],

  // Engineering Cluster
  engineering: [
    'be',
    'bsc engineering',
    'bs engineering',
    'civil engineering',
    'mechanical engineering',
    'electrical engineering',
    'chemical engineering',
    'mechatronics engineering',
    'computer engineering',
    'aerospace engineering',
    'industrial engineering',
    'software engineering',
  ],
  civil: ['civil engineering', 'bs civil engineering', 'structural engineering'],
  mechanical: ['mechanical engineering', 'bs mechanical engineering', 'mechatronics'],
  electrical: ['electrical engineering', 'bs electrical engineering', 'electronics engineering', 'telecommunication engineering'],

  // Agriculture & Food Sciences Cluster
  agriculture: [
    'bs agriculture',
    'agronomy',
    'entomology',
    'horticulture',
    'bs food science & technology',
    'bs human nutrition & dietetics',
    'plant breeding',
    'soil science',
    'dvm',
    'agricultural engineering',
  ],

  // Law Cluster
  law: ['llb', 'law', 'bachelor of law', 'ba llb', 'shariah & law', 'criminology', 'corporate law'],
  llb: ['llb', 'law', 'ba llb', 'shariah & law', 'criminology'],

  // Basic Sciences Cluster
  physics: ['bs physics', 'physics', 'applied physics', 'bs mathematics', 'nanotechnology'],
  math: ['bs mathematics', 'math', 'applied mathematics', 'bs statistics', 'data analytics'],
  chemistry: ['bs chemistry', 'applied chemistry', 'bs biochemistry', 'chemical engineering'],
  biology: ['bs zoology', 'bs botany', 'bs biology', 'bs microbiology', 'bs biotechnology', 'bs biochemistry'],

  // Social Sciences & Arts Cluster
  psychology: ['bs psychology', 'applied psychology', 'clinical psychology', 'behavioral sciences', 'bs sociology'],
  english: ['bs english', 'english literature', 'applied linguistics', 'mass communication'],
  economics: ['bs economics', 'economics & finance', 'development economics', 'bba'],
  social: ['bs sociology', 'bs psychology', 'bs international relations', 'bs political science', 'bs media studies'],
};

export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ');
}

export function normalizeProgramText(value: string): string {
  return normalizeText(value);
}

export function formatProgramSuggestion(value: string): string {
  return value
    .split(/\s+/)
    .map((word) => (word.length <= 3 ? word.toUpperCase() : `${word[0].toUpperCase()}${word.slice(1)}`))
    .join(' ');
}

export function isProgramMatch(programName: string, query: string): boolean {
  if (!query || query.trim() === '' || query.toLowerCase() === 'all') return true;

  const progLower = normalizeText(programName);
  const queryLower = normalizeText(query);

  // 1. Direct inclusion check
  if (progLower.includes(queryLower) || queryLower.includes(progLower)) {
    return true;
  }

  // 2. Word boundary / key term check
  const queryWords = queryLower
    .split(/\s+/)
    .filter((w) => w.length > 1 && w !== 'bs' && w !== 'ms' && w !== 'phd' && w !== 'honors' && w !== 'honours');
  if (queryWords.length > 0) {
    const wordMatches = queryWords.every((word) => progLower.includes(word));
    if (wordMatches) return true;
  }

  // 3. Synonym Group Check
  for (const [key, synonyms] of Object.entries(PROGRAM_SYNONYM_GROUPS)) {
    const normalizedKey = normalizeText(key);
    const normalizedSynonyms = synonyms.map(normalizeText);
    const matchesGroup = queryLower.includes(normalizedKey) || normalizedSynonyms.some((syn) => queryLower.includes(syn) || syn.includes(queryLower));

    if (matchesGroup) {
      const progBelongsToGroup = normalizedSynonyms.some((syn) => progLower.includes(syn) || syn.includes(progLower));
      if (progBelongsToGroup) {
        return true;
      }
    }
  }

  return false;
}

export function getEquivalentProgramSuggestions(query: string): string[] {
  if (!query || query.trim() === '' || query.toLowerCase() === 'all') return [];

  const queryLower = normalizeText(query);
  const related = new Set<string>();

  for (const [key, synonyms] of Object.entries(PROGRAM_SYNONYM_GROUPS)) {
    const normalizedKey = normalizeText(key);
    const normalizedSynonyms = synonyms.map(normalizeText);
    if (queryLower.includes(normalizedKey) || normalizedSynonyms.some((syn) => queryLower.includes(syn))) {
      synonyms.forEach((syn) => {
        const normalizedSyn = normalizeText(syn);
        if (normalizedSyn.length > 2 && !queryLower.includes(normalizedSyn)) {
          related.add(formatProgramSuggestion(syn));
        }
      });
    }
  }

  return Array.from(related).slice(0, 6);
}
