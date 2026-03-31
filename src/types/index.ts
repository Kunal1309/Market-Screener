// ─── Advisor ────────────────────────────────────────────────
export interface Advisor {
  id: string;
  name: string;
  crd: string;
  location: string;
  firm: string;
  yearsOfExperience: number;
  age: number;
  compliance: "No issues" | "Complaint" | "Judgement";
  jobTitle: string;
  statesRegistered: string[];
  yearsAtCurrentFirm: number;
  lifeEvents: string[];
  almaMater?: string;
}

// ─── Firm ───────────────────────────────────────────────────
export interface Firm {
  id: string;
  name: string;
  location: string;
  totalAUM: number;
  advisors: number;
  hnwAUMPercent: number;
  acquisitionScore: number;
  decisionMaker: string;
  custodian: string[];
  officeCount: number;
  aumPerAdvisor: number;
  clients: number;
  employees: number;
  secRegistrationDate: string;
  aumCAGR: number;
  pastAcquisitions: number;
  ownerTenure: number;
  ownerAge: number;
  familyOwned: boolean;
  adv: boolean;
}

// ─── Owner ──────────────────────────────────────────────────
export interface Owner {
  id: string;
  name: string;
  firm: string;
  ownershipPercentage: number;
  role: string;
  age: number;
  tenure: number;
  location: string;
}

// ─── Firm Profile ────────────────────────────────────────────
export interface FirmProfile {
  id: string;
  name: string;
  established: number;
  location: string;
  website: string;
  linkedin: string;
  advisorCount: number;
  officeCount: number;
  lastFiling: string;
  acquisitionScore: number;
  acquisitionScoreChange: number;
  totalAUM: number;
  aumComposition: AUMSegment[];
  aumGrowthTrend: AUMDataPoint[];
  aiSummary: AISummary;
  acquisitionHistory: AcquisitionHistory;
  benchmark: FirmBenchmark;
}

export interface AUMSegment {
  name: string;
  percentage: number;
  color: string;
}

export interface AUMDataPoint {
  year: number;
  firmAUM: number;
  marketAverage: number;
}

export interface AISummary {
  title: string;
  trend: "up" | "down" | "neutral";
  bullets: string[];
}

export interface AcquisitionHistory {
  totalAcquiredAUM: string;
  totalAcquisitions: number;
}

export interface FirmBenchmark {
  regionRank: string;
  region: string;
  higherThanAverage: string;
  aumRange: string;
}

// ─── Filters ────────────────────────────────────────────────
export interface AdvisorFilters {
  yearsOfExperience: string[];
  yearsAtCurrentFirm: string[];
  jobTitles: string[];
  excludeJobTitles: string[];
  currentFirms: string[];
  firmAUM: string[];
  locationZip: string;
  locationRadius: string;
  locationMode: "zip" | "drive";
  statesRegistered: string[];
  statesMode: "is_any_of" | "is_not_any_of" | "is_all_of";
  compliance: string[];
  ageRanges: string[];
  lifeEvents: string[];
  almaMater: string[];
  smartSearch: boolean;
}

export interface OwnerFilters {
  ownershipRanges: string[];
  roles: string[];
  ageRanges: string[];
  tenureRanges: string[];
  locationZip: string;
  smartSearch: boolean;
}

export interface FirmFilters {
  totalAUM: string[];
  hnwClientAUM: string[];
  acquisitionScore: string[];
  custodian: string[];
  location: string[];
  officeCount: string[];
  advisorCount: string[];
  aumPerAdvisor: string[];
  clients: string[];
  employees: string[];
  secRegistrationDateFrom: string;
  secRegistrationDateTo: string;
  aumCAGR: string[];
  pastAcquisitions: string[];
  ownerTenure: string[];
  ownerAge: string[];
  familyOwned: boolean | null;
  smartSearch: boolean;
  outpacesMarketGrowth: boolean;
  hnwClientGrowth: string[];
  clientGrowth: string[];
}

// ─── UI State ───────────────────────────────────────────────
export type SortDirection = "asc" | "desc" | null;

export interface SortState {
  column: string;
  direction: SortDirection;
}

export interface SavedSearch {
  id: string;
  name: string;
  createdAt: string;
  page: "advisors" | "market-insights";
}

export interface Column {
  key: string;
  label: string;
  visible: boolean;
  sortable?: boolean;
}
