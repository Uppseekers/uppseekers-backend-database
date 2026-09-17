export interface StudentProfile {
  id: string;
  name: string;
  university: string;
  linkedin: string;
  course: string;
  academicsPerformance: string;
  classOf: string; // e.g. "2028", "2029", "2030"
  apTaken: string;
  actSat: string;
  languageTest: string;
  internshipWork: string;
  research: string;
  summerPrograms: string;
  certificatesMoocs: string;
  competitionsAwards: string;
  projects: string;
  otherActivities: string;
  notes: string;
}

export type SortOption = 'details' | 'work' | 'awards' | 'university' | 'classOf';

export interface FilterState {
  classOf: string; // "ALL" or specific year e.g. "2028", "2029", "2030"
  university: string; // "ALL" or specific university
  searchQuery: string;
  sortBy: SortOption;
  onlyWithStandouts?: boolean;
}

export type UserRole = 'admin' | 'staff';

export interface AuthUser {
  email: string;
  loginAt: string;
  role: UserRole;
  isAdmin?: boolean;
}
