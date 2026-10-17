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

export type RankTier = 'Top 5' | 'Top 10' | 'Top 25' | 'Top 50' | 'Top 100';

export interface GradeMilestoneHistory {
  grade9: string[];
  grade10: string[];
  grade11: string[];
  grade12: string[];
}

export interface AdmittedStudentProfile extends StudentProfile {
  country: string; // e.g. "United States", "United Kingdom", "Canada", "Singapore", "Switzerland", "Australia"
  universityRank: number; // e.g. 1 to 150
  rankTier: RankTier;
  fieldCategory: string; // e.g. "Computer Science & AI", "Engineering & Robotics", etc.
  admissionType?: 'Early Action' | 'Early Decision' | 'Regular Decision' | 'Oxbridge Direct';
  profileArchetype: string; // e.g. "The Pure Researcher", "The Olympiad Prodigy", "The Tech Builder"
  keySpike: string;
  gradeMilestones?: GradeMilestoneHistory;
}

export type GradeLevel = 'Grade 9' | 'Grade 10' | 'Grade 11' | 'Grade 12';

export interface AspiringStudentTarget {
  studentName: string;
  currentGrade: GradeLevel;
  targetCountry: string; // "United States", "United Kingdom", "Canada", "Singapore", "Switzerland", "All Global"
  targetRankTier: RankTier;
  targetUniversity?: string;
  targetField: string;
  targetClassOf: string;
}

export interface AspiringStudentBaseline {
  gpaRigor: string;
  testingStatus: string;
  researchExperience: string;
  internshipsWork: string;
  competitionsHonors: string;
  technicalProjects: string;
  leadershipActivities: string;
}

export type MilestoneCategory = 'research' | 'competitions' | 'projects' | 'leadership' | 'academics';

export interface BackEngineeredMilestone {
  id: string;
  grade: GradeLevel;
  quarter: string; // e.g. "Fall", "Spring", "Summer"
  category: MilestoneCategory;
  title: string;
  description: string;
  impactTier: 'Critical Must-Have' | 'High-Impact Spike' | 'Core Differentiator';
  timeCommitment: string;
  status: 'not_started' | 'in_progress' | 'completed';
  competencyImpact: {
    dimension: 'problemSolving' | 'technicalSkills' | 'criticalThinking' | 'teamWork' | 'communication' | 'creativity';
    boost: number;
  };
  cohortPrevalence: number; // Percentage (e.g. 84 for 84% of admitted cohort)
  mentorInsight: string;
}

export interface BackEngineeredPath {
  target: AspiringStudentTarget;
  baseline: AspiringStudentBaseline;
  matchingCohortCount: number;
  cohortBenchmarks: {
    problemSolving: number;
    technicalSkills: number;
    criticalThinking: number;
    teamWork: number;
    communication: number;
    creativity: number;
    compositeScore: number;
  };
  aspirantScores: {
    problemSolving: number;
    technicalSkills: number;
    criticalThinking: number;
    teamWork: number;
    communication: number;
    creativity: number;
    compositeScore: number;
  };
  projectedScores: {
    problemSolving: number;
    technicalSkills: number;
    criticalThinking: number;
    teamWork: number;
    communication: number;
    creativity: number;
    compositeScore: number;
  };
  readinessScore: number; // 0-100%
  projectedReadinessScore: number;
  milestones: BackEngineeredMilestone[];
  topDoppelgangers: AdmittedStudentProfile[];
  primaryGaps: {
    area: string;
    gapDescription: string;
    recommendedRemedy: string;
  }[];
}

export type AppTab = 'database' | 'roadmap' | 'compare_lab';
