import {
  AdmittedStudentProfile,
  AspiringStudentBaseline,
  AspiringStudentTarget,
  BackEngineeredMilestone,
  BackEngineeredPath,
  GradeLevel,
  RankTier,
} from '../types';
import { evaluateStudent } from './studentEvaluation';

export const SAMPLE_ASPIRING_PROFILES: {
  label: string;
  target: AspiringStudentTarget;
  baseline: AspiringStudentBaseline;
}[] = [
  {
    label: 'Sophia Lin (10th Grader targeting MIT / Stanford CS)',
    target: {
      studentName: 'Sophia Lin',
      currentGrade: 'Grade 10',
      targetCountry: 'United States',
      targetRankTier: 'Top 5',
      targetUniversity: 'Massachusetts Institute of Technology (MIT)',
      targetField: 'Computer Science & AI',
      targetClassOf: '2029',
    },
    baseline: {
      gpaRigor: 'Unweighted GPA: 3.92 / 4.0. Taking Honors Pre-Calculus, Honors Chemistry, AP Computer Science Principles.',
      testingStatus: 'PSAT 10: 1420. Planning to take SAT in Spring of 11th grade. Aiming for 1560+.',
      researchExperience: 'Explored transformer architectures online. No formal research mentor or published paper yet.',
      internshipsWork: 'Weekend coding instructor for middle school girls at local community library.',
      competitionsHonors: 'AMC 10 Score: 94 (missed AIME cutoff by 6 pts). USACO Bronze to Silver in February contest.',
      technicalProjects: 'Built a Python Discord bot for study reminders; basic React portfolio site hosted on Vercel.',
      leadershipActivities: 'Treasurer of School Coding Club; member of Model UN and JV Volleyball.',
    },
  },
  {
    label: 'Aarav Sharma (11th Grader targeting Cambridge / Imperial Engineering)',
    target: {
      studentName: 'Aarav Sharma',
      currentGrade: 'Grade 11',
      targetCountry: 'United Kingdom',
      targetRankTier: 'Top 5',
      targetUniversity: 'University of Cambridge',
      targetField: 'Engineering & Robotics',
      targetClassOf: '2028',
    },
    baseline: {
      gpaRigor: 'IB Diploma candidate: Predicted 42/45. Higher Level: Mathematics AA (7), Physics (7), Chemistry (6).',
      testingStatus: 'Preparing for Cambridge Engineering Admissions Assessment (ESAT/TMUA). SAT: 1530.',
      researchExperience: 'Carrying out extended essay on composite beam deflection under cyclic loads.',
      internshipsWork: 'Two-week shadowing at local mechanical automation firm; CAD drafting assistance.',
      competitionsHonors: 'British Physics Olympiad (BPhO) Senior Physics Challenge — Silver Award. UKMT Senior Maths Challenge — Gold.',
      technicalProjects: 'Built a 3D-printed miniature pneumatic sorting arm with Arduino microcontroller.',
      leadershipActivities: 'Co-Founder of School STEM Journal; Vice Captain of Quiz Bowl.',
    },
  },
  {
    label: 'Marcus Vance (9th Grader targeting Harvard / Johns Hopkins Pre-Med)',
    target: {
      studentName: 'Marcus Vance',
      currentGrade: 'Grade 9',
      targetCountry: 'United States',
      targetRankTier: 'Top 5',
      targetUniversity: 'Harvard University',
      targetField: 'Pre-Med & BioSciences',
      targetClassOf: '2030',
    },
    baseline: {
      gpaRigor: 'Grade 9 GPA: 4.0 (All Honors: Biology, English, Geometry, World History).',
      testingStatus: 'Not taken yet. Planning PSAT 10 next fall.',
      researchExperience: 'Science fair project on microbial inhibition using plant essential oils.',
      internshipsWork: 'Community hospital junior transport volunteer (30 hours logged).',
      competitionsHonors: 'Regional Science Fair 2nd Place in Biochemistry.',
      technicalProjects: 'Maintains personal blog reviewing cancer immunotherapy clinical trials for teens.',
      leadershipActivities: 'Class representative; Red Cross Club member; recreational swimmer.',
    },
  },
  {
    label: 'Elena Rossi (10th Grader targeting Oxford / Wharton Quant & Econ)',
    target: {
      studentName: 'Elena Rossi',
      currentGrade: 'Grade 10',
      targetCountry: 'United States',
      targetRankTier: 'Top 5',
      targetUniversity: 'University of Pennsylvania (Wharton)',
      targetField: 'Economics & Quant Finance',
      targetClassOf: '2029',
    },
    baseline: {
      gpaRigor: 'GPA: 3.96 / 4.0 UW. AP Microeconomics (self-study 5), Honors Algebra II / Trig.',
      testingStatus: 'PSAT 10: 1460. Math: 760. Target SAT: 1570+.',
      researchExperience: 'Drafted paper examining local food inflation elasticity using web-scraped grocery data.',
      internshipsWork: 'Social media coordinator for local credit union youth savings program.',
      competitionsHonors: 'National Economics Challenge — State Semifinalist; AMC 10 Score: 98.',
      technicalProjects: 'Built a portfolio tracking script in Python using yfinance and pandas.',
      leadershipActivities: 'Co-President of Investment Club; Varsity Debate (Public Forum).',
    },
  },
  {
    label: 'Maya Chen (11th Grader targeting Yale / Oxford Law & Policy)',
    target: {
      studentName: 'Maya Chen',
      currentGrade: 'Grade 11',
      targetCountry: 'United States',
      targetRankTier: 'Top 5',
      targetUniversity: 'Yale University',
      targetField: 'Law, Policy & International Relations',
      targetClassOf: '2028',
    },
    baseline: {
      gpaRigor: 'GPA: 3.98 / 4.0 UW. AP US History (5), AP Government (5), AP English Language (5).',
      testingStatus: 'SAT: 1540 (ERW 780, Math 760).',
      researchExperience: 'Authored legal critique on judicial privacy standards in digital search and seizure.',
      internshipsWork: 'Legislative casework intern for state representative district office.',
      competitionsHonors: 'NSDA National Speech & Debate Qualifier; Model UN Best Delegate Gavel.',
      technicalProjects: 'Publishes monthly youth public policy digest with 1,200 regional subscribers.',
      leadershipActivities: 'Chair of Municipal Youth Advisory Council; Varsity Mock Trial Captain.',
    },
  },
  {
    label: 'David Kim (10th Grader targeting Princeton / Caltech Physics & Math)',
    target: {
      studentName: 'David Kim',
      currentGrade: 'Grade 10',
      targetCountry: 'United States',
      targetRankTier: 'Top 5',
      targetUniversity: 'Princeton University',
      targetField: 'Physics & Pure Mathematics',
      targetClassOf: '2029',
    },
    baseline: {
      gpaRigor: 'GPA: 4.0 / 4.0 UW. Multivariable Calculus, AP Physics C: Mechanics & E&M.',
      testingStatus: 'SAT: 1560 (Math 800, ERW 760).',
      researchExperience: 'Independent inquiry into numerical approximations for gravitational three-body orbits.',
      internshipsWork: 'Computational assistant at university astrophysics simulation lab.',
      competitionsHonors: 'USAMO Qualifier; USAPhO F=ma Bronze; AMC 10 score: 126.',
      technicalProjects: 'Built open-source Python physics engine for gravitational orbital mechanics.',
      leadershipActivities: 'President of High School Math Circle; Quiz Bowl Captain.',
    },
  },
];

export interface DetectedActivityEvidence {
  milestoneId: string;
  isCompleted: boolean;
  category: string;
  title: string;
  evidenceSnippet: string;
  dimension: 'problemSolving' | 'technicalSkills' | 'criticalThinking' | 'teamWork' | 'communication' | 'creativity';
  pointsBoost: number;
  reason: string;
}

/**
 * Country & Tier Dynamic Benchmarking Engine
 * Calculates the exact 6-dimensional requirements based on Target Country and University Tier Standard
 */
export function calculateCountryTierBenchmarks(
  tier: RankTier,
  country: string,
  field: string
) {
  // 1. Tier Base Expectation (Stringent scaling: Top 5 is highest bar; Top 100 is most relaxed)
  const rankTierBaseScores: Record<RankTier, number> = {
    'Top 5': 93,
    'Top 10': 88,
    'Top 25': 81,
    'Top 50': 74,
    'Top 100': 68,
  };

  const base = rankTierBaseScores[tier] || 81;

  // 2. Identify discipline & country contexts
  const c = country.toLowerCase();
  const isUK = c.includes('united kingdom') || c.includes('uk') || c.includes('britain');
  const isUS = c.includes('united states') || c.includes('us');
  const isCanada = c.includes('canada');
  const isSingapore = c.includes('singapore');
  const isSwitzerland = c.includes('switzerland') || c.includes('europe');
  const isAustralia = c.includes('australia');

  const f = field.toLowerCase();
  const isCS = f.includes('cs') || f.includes('computer') || f.includes('software');
  const isEngineering = !isCS && (f.includes('engineer') || f.includes('robot') || f.includes('aerospace'));
  const isPreMed = f.includes('pre-med') || f.includes('med') || f.includes('bio') || f.includes('health');
  const isEcon = f.includes('econ') || f.includes('finance') || f.includes('business') || f.includes('quant');
  const isLaw = f.includes('law') || f.includes('policy') || f.includes('relation') || f.includes('gov') || f.includes('history');
  const isPhysicsMath = f.includes('phys') || f.includes('math');
  const isSTEM = isCS || isEngineering || isPhysicsMath || isPreMed;

  // Country-specific admissions philosophies:
  // US: Requires solid baseline across all 6 + prominent technical/extracurricular "spike"
  // UK: Supercurricular depth & subject-specific academic mastery (tutors ignore generic sports/clubs)
  // Canada: Academic rigor with applied co-op engineering/tech building
  // Singapore: Strictly meritocratic examination cutoffs & Olympiad percentiles
  // Switzerland: High mathematical/physics examination rigor
  // Australia: Direct ATAR rank qualification
  let psDelta = 0;
  let tsDelta = 0;
  let ctDelta = 0;
  let twDelta = 0;
  let cmDelta = 0;
  let crDelta = 0;
  let philosophy = '';

  if (isUK) {
    philosophy = 'UK Supercurricular Purity: Emphasizes deep academic & technical mastery in specific course; de-emphasizes generic well-roundedness and club titles.';
    psDelta = isPhysicsMath || isCS ? 7 : isEngineering ? 6 : 4;
    tsDelta = isCS || isEngineering ? 7 : isPreMed ? 5 : 3;
    ctDelta = isLaw || isEcon ? 7 : 6; // High EPQ / scholarly reading emphasis
    twDelta = -14; // UK admissions tutors explicitly state they don't weigh generic sports or school clubs
    cmDelta = -8; // Focused on academic tutorial/interview presentation
    crDelta = -9; // Focused on subject depth rather than business venture founding
  } else if (isUS) {
    philosophy = 'US Holistic & Angular Spike: Requires strong baseline across all 6 parameters plus at least one unmistakable domain or community spike.';
    psDelta = isPhysicsMath || isCS || isEngineering ? 4 : 2;
    tsDelta = isCS || isEngineering ? 5 : isPreMed ? 3 : 1;
    ctDelta = 3;
    twDelta = 2; // High value on athletic captaincy, collaboration & team synergy
    cmDelta = 3; // High value on debate, student government & compelling narrative essays
    crDelta = 3; // High value on novel inventions, venture founding & artistic mastery
  } else if (isCanada) {
    philosophy = 'Canada Applied Co-op Builders: Strong balance between academic marks (Waterloo contests) and practical engineering / project execution.';
    psDelta = isCS || isEngineering || isPhysicsMath ? 5 : 3;
    tsDelta = 5;
    ctDelta = 2;
    twDelta = 0;
    cmDelta = -1;
    crDelta = 1;
  } else if (isSingapore) {
    philosophy = 'Singapore Percentile & Olympiad Meritocracy: Strict scholastic cutoffs, Olympiad medals, and rigorous academic endurance.';
    psDelta = 6;
    tsDelta = 4;
    ctDelta = 4;
    twDelta = -5;
    cmDelta = 0;
    crDelta = -3;
  } else if (isSwitzerland) {
    philosophy = 'Swiss & European Examination Rigor: Maximum theoretical foundations, advanced differential equations, and formal entrance exams.';
    psDelta = 8;
    tsDelta = 5;
    ctDelta = 5;
    twDelta = -10;
    cmDelta = -5;
    crDelta = -4;
  } else if (isAustralia) {
    philosophy = 'Australia Direct ATAR Rank Qualification: Direct percentile rank entry focused on prerequisite subject scores.';
    psDelta = 4;
    tsDelta = 2;
    ctDelta = 3;
    twDelta = -2;
    cmDelta = 0;
    crDelta = -1;
  } else {
    // All Global
    philosophy = 'Global Selective Standard: Balanced international benchmark combining academic Olympiads, research preprints, and verifiable domain depth.';
    psDelta = isSTEM ? 4 : 2;
    tsDelta = isSTEM ? 4 : 1;
    ctDelta = 3;
    twDelta = -1;
    cmDelta = 1;
    crDelta = 1;
  }

  // Calculate raw dimension scores
  const problemSolving = Math.min(99, Math.max(35, base + psDelta));
  const technicalSkills = Math.min(99, Math.max(35, base + tsDelta));
  const criticalThinking = Math.min(99, Math.max(35, base + ctDelta));
  const teamWork = Math.min(98, Math.max(35, base + twDelta));
  const communication = Math.min(98, Math.max(35, base + cmDelta));
  const creativity = Math.min(98, Math.max(35, base + crDelta));

  // Strict Point Harmonization: Total Points = Sum of the 6 dimensions
  const totalPoints = problemSolving + technicalSkills + criticalThinking + teamWork + communication + creativity;
  // Normalized aggregate = integer average of 6 dimensions
  const compositeScore = Math.round(totalPoints / 6);

  return {
    problemSolving,
    technicalSkills,
    criticalThinking,
    teamWork,
    communication,
    creativity,
    totalPoints,
    compositeScore,
    countryPhilosophy: philosophy,
  };
}

/**
 * Inspects a student's baseline dossier to detect activities that the student has already completed
 */
export function detectProfileCompletedActivities(
  target: AspiringStudentTarget,
  baseline: AspiringStudentBaseline
): DetectedActivityEvidence[] {
  const detected: DetectedActivityEvidence[] = [];

  const gpa = (baseline.gpaRigor || '').trim();
  const tests = (baseline.testingStatus || '').trim();
  const intern = (baseline.internshipsWork || '').trim();
  const research = (baseline.researchExperience || '').trim();
  const comps = (baseline.competitionsHonors || '').trim();
  const projs = (baseline.technicalProjects || '').trim();
  const lead = (baseline.leadershipActivities || '').trim();

  // Helper to test multiple keywords
  const hasKw = (text: string, kws: string[]): boolean => {
    const l = text.toLowerCase();
    return kws.some((kw) => l.includes(kw.toLowerCase()));
  };

  // 1. Academics / GPA Rigor
  if (gpa.length > 15 && !gpa.toLowerCase().includes('none') && !gpa.toLowerCase().includes('not recorded')) {
    detected.push({
      milestoneId: 'g9-cert-1',
      isCompleted: true,
      category: 'certification',
      title: 'Academic Anchor & Foundation Rigor',
      evidenceSnippet: gpa,
      dimension: 'criticalThinking',
      pointsBoost: 8,
      reason: 'Verified strong GPA and advanced curriculum coursework from candidate profile',
    });
  }

  // 2. Standardized Testing (Completed / High Score)
  if (
    tests.length > 10 &&
    (hasKw(tests, ['sat: 15', 'sat: 14', 'act: 3', 'psat', 'predicted', 'ib diploma', '1530', '1540', '1550', '1560', '1570', '1580', '1600']) ||
      (tests.includes('SAT') && !tests.includes('Not taken')))
  ) {
    detected.push({
      milestoneId: 'g11-test-1',
      isCompleted: true,
      category: 'certification',
      title: 'Standardized Testing & Admissions Assessments Benchmark',
      evidenceSnippet: tests,
      dimension: 'problemSolving',
      pointsBoost: 10,
      reason: 'Verified standardized test scores or active examination preparation logged in profile',
    });
  }

  // 3. Competitions & Olympiads (Grade 9 / 10 level)
  if (
    comps.length > 10 &&
    !comps.toLowerCase().includes('none') &&
    !comps.toLowerCase().includes('not recorded')
  ) {
    detected.push({
      milestoneId: 'g9-comp-1',
      isCompleted: true,
      category: 'competition',
      title: 'First-Round Olympiads & Contest Benchmarking',
      evidenceSnippet: comps,
      dimension: 'problemSolving',
      pointsBoost: 10,
      reason: 'Documented contest achievements and Olympiad rankings recorded in profile',
    });

    // Check for advanced regional/national honors (AIME, USABO, BPhO, Gold, State, National)
    if (hasKw(comps, ['aime', 'gold', 'silver', 'bpho', 'usabo', 'finalist', 'champion', '1st place', 'national', 'state finalist', 'usamo', 'ukmt'])) {
      detected.push({
        milestoneId: 'g10-comp-1',
        isCompleted: true,
        category: 'competition',
        title: 'National/Regional Competition Distinction',
        evidenceSnippet: comps,
        dimension: 'problemSolving',
        pointsBoost: 12,
        reason: 'Verified advanced medal, qualifier honor, or high percentile contest standing',
      });
    }
  }

  // 4. Internships & Laboratory Shadowing
  if (
    intern.length > 10 &&
    !intern.toLowerCase().includes('none') &&
    !intern.toLowerCase().includes('not recorded')
  ) {
    detected.push({
      milestoneId: 'g9-intern-1',
      isCompleted: true,
      category: 'internship',
      title: 'Industry / Clinical Shadowing & Apprenticeship',
      evidenceSnippet: intern,
      dimension: 'teamWork',
      pointsBoost: 8,
      reason: 'Logged industry apprenticeship, clinical volunteer rotations, or technical firm shadowing',
    });

    if (hasKw(intern, ['research', 'lab', 'assistant', 'engineer', 'developer', 'startup', 'fellow', 'casework', 'advisory'])) {
      detected.push({
        milestoneId: 'g10-intern-1',
        isCompleted: true,
        category: 'internship',
        title: 'Structured Lab Placement / Engineering Fellowship',
        evidenceSnippet: intern,
        dimension: 'technicalSkills',
        pointsBoost: 10,
        reason: 'Substantive role in professional lab, software engineering team, or district office',
      });
    }
  }

  // 5. Research Experience & Publications
  if (
    research.length > 10 &&
    !research.toLowerCase().includes('none') &&
    !research.toLowerCase().includes('not recorded')
  ) {
    detected.push({
      milestoneId: 'g10-research-1',
      isCompleted: true,
      category: 'research',
      title: 'Independent Inquiry & Literature Review Draft',
      evidenceSnippet: research,
      dimension: 'criticalThinking',
      pointsBoost: 10,
      reason: 'Independent scholarly investigation, empirical model, or extended essay recorded',
    });

    if (hasKw(research, ['preprint', 'paper', 'biorxiv', 'arxiv', 'ssrn', 'published', 'journal', 'isef', 'concord review', 'manuscript'])) {
      detected.push({
        milestoneId: 'g11-research-1',
        isCompleted: true,
        category: 'research',
        title: 'First-Author Preprint / Scholarly Publication',
        evidenceSnippet: research,
        dimension: 'criticalThinking',
        pointsBoost: 14,
        reason: 'Verified peer-reviewed manuscript, preprint submission, or national science fair paper',
      });
    }
  }

  // 6. Technical Projects & Artifacts
  if (
    projs.length > 10 &&
    !projs.toLowerCase().includes('none') &&
    !projs.toLowerCase().includes('not recorded')
  ) {
    detected.push({
      milestoneId: 'g9-proj-1',
      isCompleted: true,
      category: 'research',
      title: 'Public Software / Engineering Artifact Deployment',
      evidenceSnippet: projs,
      dimension: 'technicalSkills',
      pointsBoost: 10,
      reason: 'Functional open-source repository, working hardware mechanism, or deployed prototype',
    });
  }

  // 7. Leadership, Non-Profit & Peer Mentorship
  if (
    lead.length > 10 &&
    !lead.toLowerCase().includes('none') &&
    !lead.toLowerCase().includes('not recorded')
  ) {
    detected.push({
      milestoneId: 'g9-lead-1',
      isCompleted: true,
      category: 'leadership',
      title: 'Peer Mentorship & Academic Club Executive',
      evidenceSnippet: lead,
      dimension: 'communication',
      pointsBoost: 8,
      reason: 'Verified leadership position in school club, math circle, or peer mentoring group',
    });

    if (hasKw(lead, ['founder', 'co-founder', 'president', 'captain', 'chair', '1,000', '501(c)(3)', 'organized', 'director', 'coalition'])) {
      detected.push({
        milestoneId: 'g11-lead-1',
        isCompleted: true,
        category: 'leadership',
        title: 'Flagship Initiative Founding / Scaled Community Reach',
        evidenceSnippet: lead,
        dimension: 'creativity',
        pointsBoost: 12,
        reason: 'Documented executive founder role, community initiative, or varsity team leadership',
      });
    }
  }

  return detected;
}

/**
 * Evaluates an aspiring student baseline against the 6 MLS dimensions
 * Incorporates points from documented evidence and verified completed activities
 */
export function evaluateAspiringBaseline(
  baseline: AspiringStudentBaseline,
  target?: AspiringStudentTarget
) {
  // Synthesize a dummy StudentProfile to leverage our proven 6-aspect evaluation engine
  const syntheticProfile = {
    id: 'aspirant-eval-temp',
    name: target?.studentName || 'Aspirant',
    university: target?.targetUniversity || 'Target University',
    course: target?.targetField || 'Target Major',
    linkedin: '',
    academicsPerformance: baseline.gpaRigor,
    classOf: target?.targetClassOf || '2028',
    apTaken: baseline.gpaRigor,
    actSat: baseline.testingStatus,
    languageTest: '',
    internshipWork: baseline.internshipsWork,
    research: baseline.researchExperience,
    summerPrograms: '',
    certificatesMoocs: '',
    competitionsAwards: baseline.competitionsHonors,
    projects: baseline.technicalProjects,
    otherActivities: baseline.leadershipActivities,
    notes: '',
  };

  const evalResult = evaluateStudent(syntheticProfile);
  const dims = evalResult.dimensions;

  const getScore = (key: string): number => {
    const d = dims.find((x) => x.key === key);
    return d ? d.score : 45;
  };

  // Check if profile is completely blank
  const isBlank =
    !baseline.gpaRigor &&
    !baseline.testingStatus &&
    !baseline.internshipsWork &&
    !baseline.researchExperience &&
    !baseline.competitionsHonors &&
    !baseline.technicalProjects &&
    !baseline.leadershipActivities;

  if (isBlank) {
    return {
      problemSolving: 30,
      technicalSkills: 30,
      criticalThinking: 30,
      teamWork: 30,
      communication: 30,
      creativity: 30,
      totalPoints: 180,
      compositeScore: 30,
      completedMilestoneCount: 0,
    };
  }

  // Detect completed activities from documented baseline
  const detected = target ? detectProfileCompletedActivities(target, baseline) : [];

  const rawPS = Math.max(35, getScore('problemSolving'));
  const rawTS = Math.max(35, getScore('technicalSkills'));
  const rawCT = Math.max(35, getScore('criticalThinking'));
  const rawTW = Math.max(35, getScore('teamWork'));
  const rawCM = Math.max(35, getScore('communication'));
  const rawCR = Math.max(35, getScore('creativity'));

  const totalPoints = rawPS + rawTS + rawCT + rawTW + rawCM + rawCR;
  const compositeScore = Math.round(totalPoints / 6);

  return {
    problemSolving: rawPS,
    technicalSkills: rawTS,
    criticalThinking: rawCT,
    teamWork: rawTW,
    communication: rawCM,
    creativity: rawCR,
    totalPoints,
    compositeScore,
    completedMilestoneCount: detected.length,
  };
}

/**
 * Core Reverse-Engineering Pathfinder Algorithm
 * Matches against the 1,500 admitted student cohort by Country, Rank, and Field
 */
export function generateBackEngineeredPath(
  target: AspiringStudentTarget,
  baseline: AspiringStudentBaseline,
  cohort: AdmittedStudentProfile[]
): BackEngineeredPath {
  // 1. Filter matching cohort
  let matched = cohort.filter((s) => {
    const matchCountry =
      target.targetCountry === 'All Global' ||
      s.country.toLowerCase().includes(target.targetCountry.toLowerCase()) ||
      (target.targetCountry === 'United States' && s.country === 'United States') ||
      (target.targetCountry === 'United Kingdom' && s.country === 'United Kingdom');

    const matchRank = s.rankTier === target.targetRankTier;
    return matchCountry && matchRank;
  });

  // If filtered set is small, broaden country or rank tier gracefully
  if (matched.length < 15) {
    matched = cohort.filter((s) => s.rankTier === target.targetRankTier);
  }
  if (matched.length < 15) {
    matched = cohort.slice(0, 150);
  }

  // Also filter or sort by field affinity
  const fieldMatched = matched.filter(
    (s) => s.fieldCategory.toLowerCase() === target.targetField.toLowerCase()
  );
  const cohortPool = fieldMatched.length >= 10 ? fieldMatched : matched;

  // 2. Compute Dynamically Harmonized Cohort Benchmarks (Governed by Country & University Tier Standard)
  const cohortBenchmarks = calculateCountryTierBenchmarks(
    target.targetRankTier,
    target.targetCountry,
    target.targetField
  );

  // 3. Compute Aspiring Baseline Scores (Explicitly linked to documented activities)
  const aspirantScores = evaluateAspiringBaseline(baseline, target);
  const detectedActivities = detectProfileCompletedActivities(target, baseline);

  // 4. Compute Current Readiness Score (0 - 100%)
  // Normalized comparison against cohort benchmarks
  const scoreDeltas = [
    aspirantScores.problemSolving / cohortBenchmarks.problemSolving,
    aspirantScores.technicalSkills / cohortBenchmarks.technicalSkills,
    aspirantScores.criticalThinking / cohortBenchmarks.criticalThinking,
    aspirantScores.teamWork / cohortBenchmarks.teamWork,
    aspirantScores.communication / cohortBenchmarks.communication,
    aspirantScores.creativity / cohortBenchmarks.creativity,
  ];

  const averageRatio = scoreDeltas.reduce((a, b) => a + b, 0) / scoreDeltas.length;
  // Weight by current grade (9th graders naturally have lower raw readiness, which is normal!)
  const gradeNormalization: Record<GradeLevel, number> = {
    'Grade 9': 1.25,
    'Grade 10': 1.15,
    'Grade 11': 1.05,
    'Grade 12': 1.0,
  };
  const readinessRaw = Math.min(
    98,
    Math.max(25, Math.round(averageRatio * 75 * (gradeNormalization[target.currentGrade] || 1)))
  );
  const readinessScore = Math.min(94, readinessRaw);

  // 5. Synthesize Back-Engineered Milestones chronologically
  const milestones: BackEngineeredMilestone[] = buildMilestonesForTarget(target, baseline, cohortPool);

  // 6. Calculate Projected Scores assuming all high-impact milestones are completed
  const projectedScores = {
    problemSolving: Math.min(98, aspirantScores.problemSolving + 22),
    technicalSkills: Math.min(98, aspirantScores.technicalSkills + 24),
    criticalThinking: Math.min(98, aspirantScores.criticalThinking + 20),
    teamWork: Math.min(96, aspirantScores.teamWork + 18),
    communication: Math.min(96, aspirantScores.communication + 20),
    creativity: Math.min(97, aspirantScores.creativity + 22),
    compositeScore: 0,
  };
  projectedScores.compositeScore = Math.round(
    (projectedScores.problemSolving +
      projectedScores.technicalSkills +
      projectedScores.criticalThinking +
      projectedScores.teamWork +
      projectedScores.communication +
      projectedScores.creativity) / 6
  );

  const projectedReadinessScore = Math.min(96, Math.max(readinessScore + 28, 89));

  // 7. Find Top 3 Doppelgängers
  const topDoppelgangers = cohortPool.slice(0, 3);

  // 8. Identify Primary Gaps and Actionable Remedies
  const primaryGaps = generatePrimaryGaps(target, baseline, aspirantScores, cohortBenchmarks);

  return {
    target,
    baseline,
    matchingCohortCount: cohortPool.length,
    cohortBenchmarks,
    aspirantScores,
    projectedScores,
    readinessScore,
    projectedReadinessScore,
    milestones,
    topDoppelgangers,
    primaryGaps,
    detectedActivities,
  };
}

/**
 * Builds chronological, high-impact milestones back-engineered from admitted student patterns
 */
function buildMilestonesForTarget(
  target: AspiringStudentTarget,
  baseline: AspiringStudentBaseline,
  matchingCohort: AdmittedStudentProfile[]
): BackEngineeredMilestone[] {
  const f = target.targetField.toLowerCase();
  const isCS = f.includes('cs') || f.includes('computer') || f.includes('code') || f.includes('software') || f.includes('data');
  const isEngineering = !isCS && (f.includes('engineer') || f.includes('robot') || f.includes('aerospace') || f.includes('mechanical') || f.includes('electrical'));
  const isPreMed = f.includes('pre-med') || f.includes('med') || f.includes('bio') || f.includes('health') || f.includes('neuro');
  const isEconQuant = f.includes('econ') || f.includes('finance') || f.includes('business') || f.includes('quant') || f.includes('commerce') || f.includes('consult');
  const isLawHumanities = f.includes('law') || f.includes('policy') || f.includes('relation') || f.includes('gov') || f.includes('history') || f.includes('phil') || f.includes('humanit');
  const isPhysicsMath = f.includes('phys') || f.includes('math') || f.includes('astro') || f.includes('stat');

  const milestones: BackEngineeredMilestone[] = [
    // GRADE 9: Foundation, Curiosity & Core Anchors
    {
      id: 'm-g9-1',
      grade: 'Grade 9',
      quarter: 'Fall',
      category: 'academics',
      title: 'Establish Academic Anchor & Max Honors Rigor',
      description: 'Lock in unweighted 3.95+ GPA with highest available honors coursework in foundational Math, Sciences, and English. Begin building deep relationships with 2 key faculty members.',
      impactTier: 'Critical Must-Have',
      timeCommitment: '8-10 hrs/week study habits',
      status: target.currentGrade !== 'Grade 9' ? 'completed' : 'in_progress',
      competencyImpact: { dimension: 'criticalThinking', boost: 8 },
      cohortPrevalence: 94,
      mentorInsight: 'Top tier admissions officers check 9th grade transcript trend; establishing an unshakeable GPA early prevents having to dig out of a deficit later.',
    },
    {
      id: 'm-g9-2',
      grade: 'Grade 9',
      quarter: 'Spring',
      category: isCS || isEngineering ? 'projects' : isPreMed ? 'research' : isLawHumanities ? 'leadership' : 'competitions',
      title: isCS
        ? 'Build 1st Public Software Artifact & Join Coding Team'
        : isEngineering
        ? 'Master CAD Modeling (Fusion 360) & Join FIRST Robotics / TSA Team'
        : isPreMed
        ? 'Clinical Hospital Volunteering & Inquiry-Based Science Fair Project'
        : isEconQuant
        ? 'Join Investment Club, Novice Debate & Master Financial Modeling'
        : isLawHumanities
        ? 'Compete in National Speech & Debate / Model UN & Draft Policy Op-Ed'
        : isPhysicsMath
        ? 'Master AMC 10 Past Papers & Build Physics Simulation Engine'
        : 'Launch Independent Field Inquiry & Join Competitive Academic Team',
      description: isCS
        ? 'Ship a functional open-source utility or app on GitHub; join the high school Robotics (FRC/FTC) or Competitive Programming team.'
        : isEngineering
        ? 'Design 3D printable mechanical assemblies; assist FRC chassis or mechanism build; earn beginner CAD certification.'
        : isPreMed
        ? 'Complete 40 hours of clinical volunteer shadowing; develop an independent local science fair hypothesis in biochemistry or molecular biology.'
        : isEconQuant
        ? 'Compete in novice Lincoln-Douglas debate or National Economics Challenge David Ricardo division; master statistical modeling in Python/Excel.'
        : isLawHumanities
        ? 'Compete in regional speech and debate circuit; draft an analytical essay for a state student journalism or civic editorial contest.'
        : isPhysicsMath
        ? 'Target 100+ on AMC 10 contest problems; write Python numerical physics simulation exploring gravitational orbits or harmonic oscillators.'
        : 'Select a primary academic focus area; conduct an introductory literature review and join high school competition team.',
      impactTier: 'Core Differentiator',
      timeCommitment: '4-6 hrs/week',
      status: target.currentGrade !== 'Grade 9' ? 'completed' : 'in_progress',
      competencyImpact: { dimension: isCS || isEngineering ? 'technicalSkills' : 'problemSolving', boost: 10 },
      cohortPrevalence: 82,
      mentorInsight: 'Starting non-academic spikes in 9th grade gives you 3 full years of compound growth, rather than scrambling in junior year.',
    },
    {
      id: 'm-g9-3',
      grade: 'Grade 9',
      quarter: 'Summer',
      category: 'research',
      title: isPreMed
        ? 'Biomedical Foundation & Seminal Literature Immersion'
        : isEconQuant
        ? 'Econometric Methods & Financial Foundation Coursework'
        : isEngineering
        ? 'Hardware Prototyping & Applied Mechanics Exploration'
        : isLawHumanities
        ? 'Constitutional Law / Global Governance Reading & Essay Draft'
        : isPhysicsMath
        ? 'Proof-Based Mathematics & Classical Mechanics Immersion'
        : 'Competitive Summer Exploration & Advanced Reading',
      description: isPreMed
        ? 'Complete university-level coursework in molecular genetics or immunology; read 10 seminal peer-reviewed medical papers in targeted pathology.'
        : isEconQuant
        ? 'Complete Wharton Business Foundations or MITx Microeconomics; analyze empirical market pricing data with Python pandas and statsmodels.'
        : isEngineering
        ? 'Build and document a physical working prototype (microcontroller Arduino/ESP32, custom PCB, or robotics mechanism); complete safety protocols.'
        : isLawHumanities
        ? 'Read foundational jurisprudence and international treaties; participate in summer legal debate institute or humanities symposium.'
        : isPhysicsMath
        ? 'Self-study proof techniques (discrete math, linear algebra) or complete MITx classical mechanics with calculus.'
        : 'Complete rigorous university-level coursework (e.g. CS50, MITx, multivariable calculus) and read 10 seminal research papers in your target field.',
      impactTier: 'High-Impact Spike',
      timeCommitment: '15 hrs/week during summer',
      status: target.currentGrade !== 'Grade 9' ? 'completed' : 'not_started',
      competencyImpact: { dimension: 'creativity', boost: 7 },
      cohortPrevalence: 76,
      mentorInsight: 'Admitted students at world-leading universities don’t waste their 9th grade summer; they build genuine intellectual curiosity.',
    },

    // GRADE 10: Skill Acceleration, Regional Honors & Early Publications
    {
      id: 'm-g10-1',
      grade: 'Grade 10',
      quarter: 'Fall',
      category: 'competitions',
      title: isCS
        ? 'Target USACO Gold & AMC 10 AIME Cutoff'
        : isEngineering
        ? 'FRC Lead Mechanism Engineer & BPhO Senior Challenge'
        : isPreMed
        ? 'USABO Open Exam & Regional HOSA Competition'
        : isEconQuant
        ? 'Wharton Global Investment Challenge & National Economics Challenge'
        : isLawHumanities
        ? 'National History Day (NHD) & State Speech & Debate Qualifier'
        : isPhysicsMath
        ? 'AMC 10/12 AIME Cutoff & USAPhO F=ma Preparation'
        : 'Target Regional/National Competition Honors & Benchmark Exams',
      description: isCS
        ? 'Practice 150+ contest problems on Codeforces/USACO. Clear Silver division and target 100+ on AMC 10 to lock in AIME qualification.'
        : isEngineering
        ? 'Lead mechanical/electrical sub-team in FIRST Robotics; prepare for British Physics Olympiad Senior Challenge or Science Olympiad state rounds.'
        : isPreMed
        ? 'Intensive Campbell Biology prep for USABO Open Exam; submit competitive HOSA Medical Innovation or Biomedical Debate prototype.'
        : isEconQuant
        ? 'Form team for Wharton Global High School Investment Competition; qualify for State Finals in National Economics Challenge.'
        : isLawHumanities
        ? 'Prepare 5,000-word historical research paper for National History Day; earn top speaker gavels at varsity Model UN conferences.'
        : isPhysicsMath
        ? 'Solve past AIME papers aiming for 8+ correct; prepare for AAPT F=ma exam with David Morin mechanics problems.'
        : 'Compete in premier national academic Olympiads or state competitions aligned with your chosen course of study.',
      impactTier: 'Critical Must-Have',
      timeCommitment: '6-8 hrs/week',
      status: target.currentGrade === 'Grade 11' || target.currentGrade === 'Grade 12' ? 'completed' : 'in_progress',
      competencyImpact: { dimension: 'problemSolving', boost: 14 },
      cohortPrevalence: 88,
      mentorInsight: 'Standardized national competition benchmarks (AIME, USACO, USABO, Wharton, NSDA) prove undeniable objective talent that grades alone cannot demonstrate.',
    },
    {
      id: 'm-g10-2',
      grade: 'Grade 10',
      quarter: 'Spring',
      category: 'research',
      title: isPreMed
        ? 'Cold Outreach to Biomedical Labs & Clinical Apprenticeship'
        : isEngineering
        ? 'University Engineering Lab Outreach & Fabrication Apprenticeship'
        : isEconQuant
        ? 'Faculty Outreach for Econometric / Financial Modeling Mentorship'
        : isLawHumanities
        ? 'Secure Legal Aid, Judicial or Congressional District Internship'
        : isPhysicsMath
        ? 'Outreach to Theoretical Physics or Pure Math Faculty'
        : 'Cold Outreach to University Faculty & Secure Apprenticeship',
      description: isPreMed
        ? 'Draft customized cold emails to 20 pathology or genetics PIs. Reference their recent papers, demonstrate assay knowledge, and secure summer lab access.'
        : isEngineering
        ? 'Contact robotics, materials science, or aerospace laboratories with portfolio of CAD designs and microcontroller projects.'
        : isEconQuant
        ? 'Connect with applied economics professors or financial analysts; propose assistance with data cleaning and regression modeling.'
        : isLawHumanities
        ? 'Apply for summer fellowship with state representative, civil liberties NGO, or legal aid foundation to assist with research briefs.'
        : isPhysicsMath
        ? 'Email university math/physics researchers with insightful comments on preprints; request reading guidance or summer research problem.'
        : 'Draft customized cold emails to 20 university professors conducting research in your niche. Reference their recent papers and secure a position.',
      impactTier: 'High-Impact Spike',
      timeCommitment: '3-5 hrs/week outreach & reading',
      status: target.currentGrade === 'Grade 11' || target.currentGrade === 'Grade 12' ? 'completed' : 'not_started',
      competencyImpact: { dimension: 'criticalThinking', boost: 12 },
      cohortPrevalence: 79,
      mentorInsight: '90% of students fail cold outreach by sending generic resumes. Admitted applicants send tailored inquiries referencing specific methodological gaps or derivations.',
    },
    {
      id: 'm-g10-3',
      grade: 'Grade 10',
      quarter: 'Summer',
      category: 'research',
      title: isPreMed
        ? 'Biomedical Lab Immersion or Top Institute (SIMR, Garcia, NIH)'
        : isEngineering
        ? 'Engineering Lab Apprenticeship or NASA Student Launch Team'
        : isEconQuant
        ? 'Boutique Financial Advisory Internship & Empirical Working Paper'
        : isLawHumanities
        ? 'Legal Aid Internship & Human Rights / Policy Monograph Draft'
        : isPhysicsMath
        ? 'Intensive Mathematics Institute (PROMYS, ROSS, Canada/USA Mathcamp)'
        : 'Flagship Lab Apprenticeship or Top Tier Summer Institute',
      description: isPreMed
        ? 'Attend selective biomedical program (e.g. Stanford SIMR, Garcia Center) or spend 8 weeks full-time conducting supervised laboratory assays.'
        : isEngineering
        ? 'Spend 8 weeks in university fabrication facility testing physical stress limits, autonomous guidance systems, or composite materials.'
        : isEconQuant
        ? 'Conduct empirical econometric research testing micro-level inflation or market efficiency; write complete working paper draft.'
        : isLawHumanities
        ? 'Full-time public interest advocacy or municipal casework; complete extensive jurisprudence draft on constitutional law.'
        : isPhysicsMath
        ? 'Immerse in proof-based number theory or abstract algebra at premier residential math institutes; draft original conjectures.'
        : 'Attend a top tier merit program (e.g., SSP, RSI, LaunchX) or spend 8 weeks full-time conducting supervised research.',
      impactTier: 'Critical Must-Have',
      timeCommitment: '35-40 hrs/week (Full Time)',
      status: target.currentGrade === 'Grade 11' || target.currentGrade === 'Grade 12' ? 'completed' : 'not_started',
      competencyImpact: { dimension: 'technicalSkills', boost: 15 },
      cohortPrevalence: 86,
      mentorInsight: 'The summer between 10th and 11th grade is the inflection point where top applicants transition from student to independent contributor.',
    },

    // GRADE 11: The "Spike" Year — Original Research, National Honors & Flagship Leadership
    {
      id: 'm-g11-1',
      grade: 'Grade 11',
      quarter: 'Fall',
      category: 'leadership',
      title: isPreMed
        ? 'Lead Regional Health Equity Initiative or Red Cross Division'
        : isEngineering
        ? 'Found STEM Fabrication Maker Space or Direct Regional Hackathon'
        : isEconQuant
        ? 'Found Youth Financial Literacy Non-Profit (1,000+ Reach)'
        : isLawHumanities
        ? 'Found Statewide Civic Coalition or Direct District Youth Senate'
        : isPhysicsMath
        ? 'Establish Regional High School Math Circle & Outreach Network'
        : 'Found or Scale a Flagship Community Initiative (1,000+ Reach)',
      description: isPreMed
        ? 'Mobilize 50+ students to provide preventative health screenings, coordinate blood drives, or deliver clinical toolkits to underserved clinics.'
        : isEngineering
        ? 'Organize community robotics workshops for title-1 middle schools, or secure $10k+ sponsorship for an open maker-fair.'
        : isEconQuant
        ? 'Partner with local credit unions to deliver financial literacy curricula to 1,000+ high schoolers across your district.'
        : isLawHumanities
        ? 'Spearhead youth voter registration, draft policy proposals submitted to city council, or organize inter-school debate tournaments.'
        : isPhysicsMath
        ? 'Organize weekly problem seminars for regional students preparing for AMC/AIME; author published math enrichment newsletter.'
        : 'Transform your academic passion into systemic external impact: found a 501(c)(3) nonprofit or direct an impactful community organization.',
      impactTier: 'High-Impact Spike',
      timeCommitment: '6-8 hrs/week',
      status: target.currentGrade === 'Grade 12' ? 'completed' : 'not_started',
      competencyImpact: { dimension: 'teamWork', boost: 16 },
      cohortPrevalence: 84,
      mentorInsight: 'Admissions committees distinguish between passive club members and visionary founders who mobilize communities and create lasting institutions.',
    },
    {
      id: 'm-g11-2',
      grade: 'Grade 11',
      quarter: 'Winter',
      category: 'academics',
      title: 'Standardized Testing Lockout: SAT 1560+ / ACT 35+',
      description: 'Complete official standardized testing by December/March of junior year. Attain top-percentile scores (790+ Math for STEM, 750+ ERW for Humanities) to permanently remove testing anxiety.',
      impactTier: 'Critical Must-Have',
      timeCommitment: '5 hrs/week targeted prep',
      status: target.currentGrade === 'Grade 12' ? 'completed' : 'not_started',
      competencyImpact: { dimension: 'problemSolving', boost: 10 },
      cohortPrevalence: 92,
      mentorInsight: 'Getting testing done by winter of junior year clears bandwidth for high-stakes research and major competition submissions.',
    },
    {
      id: 'm-g11-3',
      grade: 'Grade 11',
      quarter: 'Spring',
      category: 'research',
      title: isPreMed
        ? 'Submit First-Author Paper to Regeneron ISEF / bioRxiv'
        : isEngineering
        ? 'Submit Engineering Mechanics Paper to ISEF / File Provisional Patent'
        : isEconQuant
        ? 'Submit Econometric Paper to SSRN / National Economics Challenge Finals'
        : isLawHumanities
        ? 'Submit Monograph to The Concord Review / John Locke Essay'
        : isPhysicsMath
        ? 'Submit Theoretical Physics / Math Paper to arXiv & AIME Top Score'
        : 'Submit First-Author Paper to Peer-Reviewed Conference / ISEF',
      description: isPreMed
        ? 'Complete primary inquiry into oncology, immunology, or bioinformatics. Write camera-ready manuscript; submit to Regeneron ISEF, JSHS, or bioRxiv.'
        : isEngineering
        ? 'Complete working mechanical/robotic prototype; draft formal engineering specifications and enter Regeneron ISEF or National Inventors Hall of Fame.'
        : isEconQuant
        ? 'Publish working paper analyzing market trends on SSRN or Journal of Financial Economics; qualify for National Finals in Adam Smith division.'
        : isLawHumanities
        ? 'Submit 6,000-word historical/philosophical treatise to The Concord Review or John Locke Essay Competition; earn qualification for NSDA Nationals.'
        : isPhysicsMath
        ? 'Finalize mathematical proof or astrophysics simulation paper; submit to arXiv, Journal of High School Science, or MIT PRIMES.'
        : 'Complete your primary investigation. Write camera-ready manuscript; submit to Regeneron ISEF regional qualifying fair or preprint server.',
      impactTier: 'Critical Must-Have',
      timeCommitment: '12-15 hrs/week',
      status: target.currentGrade === 'Grade 12' ? 'completed' : 'not_started',
      competencyImpact: { dimension: 'criticalThinking', boost: 18 },
      cohortPrevalence: 89,
      mentorInsight: 'A verified preprint or premier national prize in your major is the single highest-signal credential on any elite university application.',
    },
    {
      id: 'm-g11-4',
      grade: 'Grade 11',
      quarter: 'Summer',
      category: isCS || isEngineering ? 'projects' : isPreMed || isPhysicsMath ? 'research' : 'leadership',
      title: isCS
        ? 'Deploy Production Software / Open-Source Tool with Active Users'
        : isEngineering
        ? 'Fabricate Functional Capstone Hardware & Deploy Public Field Test'
        : isPreMed
        ? 'Selective Clinical Research Fellowship (NIH / Hospital Trial Center)'
        : isEconQuant
        ? 'Launch Youth Investment Fund or Scaled Micro-Enterprise'
        : isLawHumanities
        ? 'Direct Regional Policy Initiative & Author Published Monograph'
        : isPhysicsMath
        ? 'Research Science Institute (RSI) or Advanced Theoretical Fellowship'
        : 'Deploy Flagship Capstone Artifact & Complete Premier Fellowship',
      description: isCS
        ? 'Deploy a high-leverage capstone: live web platform with 2,000+ active users or published open-source tool with verified GitHub stars.'
        : isEngineering
        ? 'Construct autonomous drone, bionic assistive device, or sensor telemetry unit; document live testing with video and engineering portfolio.'
        : isPreMed
        ? 'Coordinate patient-facing trial data or molecular assays at major teaching hospital; present findings at regional medical conference.'
        : isEconQuant
        ? 'Manage live portfolio with documented alpha; generate quarterly financial reports for donors and community investors.'
        : isLawHumanities
        ? 'Present policy findings to state legislative committee; publish op-eds in regional daily newspapers on civic reform.'
        : isPhysicsMath
        ? 'Conduct intensive theoretical research under faculty mentorship; present at national symposium or compete in Intel/Regeneron STS.'
        : 'Complete a high-impact capstone artifact demonstrating advanced intellectual and creative maturity in your field.',
      impactTier: 'High-Impact Spike',
      timeCommitment: '25-30 hrs/week',
      status: 'not_started',
      competencyImpact: { dimension: 'creativity', boost: 15 },
      cohortPrevalence: 81,
      mentorInsight: 'Having public proof of your work (published paper, working hardware, active platform, policy brief) allows admissions committees to verify your excellence instantly.',
    },

    // GRADE 12: Packaging, Institutional Alignment & Early Submissions
    {
      id: 'm-g12-1',
      grade: 'Grade 12',
      quarter: 'Fall',
      category: 'leadership',
      title: 'Curate Compelling Admissions Dossier & Recommendation Letters',
      description: 'Brief 2 academic teachers and 1 research/industry mentor with an aligned dossier packet highlighting your primary academic spike, leadership moments, and character anecdotes.',
      impactTier: 'Critical Must-Have',
      timeCommitment: '4-6 hrs/week',
      status: 'not_started',
      competencyImpact: { dimension: 'communication', boost: 16 },
      cohortPrevalence: 96,
      mentorInsight: 'The best recommendation letters read like tenure evaluations; give your recommenders specific milestone data they can quote verbatim.',
    },
    {
      id: 'm-g12-2',
      grade: 'Grade 12',
      quarter: 'Fall',
      category: 'academics',
      title: 'Targeted Early Action / Early Decision Submission Strategy',
      description: `Draft distinctive personal statement and field-specific supplements for ${target.targetField}; weave all 4 years of reverse-engineered milestones into a cohesive narrative arc.`,
      impactTier: 'Critical Must-Have',
      timeCommitment: '10 hrs/week essay drafting & polish',
      status: 'not_started',
      competencyImpact: { dimension: 'communication', boost: 14 },
      cohortPrevalence: 98,
      mentorInsight: `Admitted students don’t write generic clichés. They write about specific intellectual breakthroughs and hurdles they overcame in ${target.targetField}.`,
    },
  ];

  return milestones;
}

/**
 * Computes primary gaps between student baseline and target cohort benchmarks
 */
function generatePrimaryGaps(
  target: AspiringStudentTarget,
  baseline: AspiringStudentBaseline,
  aspirantScores: { problemSolving: number; technicalSkills: number; criticalThinking: number; teamWork: number; communication: number; creativity: number },
  cohortBenchmarks: { problemSolving: number; technicalSkills: number; criticalThinking: number; teamWork: number; communication: number; creativity: number }
) {
  const gaps = [];
  const f = target.targetField.toLowerCase();
  const isCS = f.includes('cs') || f.includes('computer') || f.includes('software');
  const isEngineering = f.includes('engineer') || f.includes('robot') || f.includes('aerospace');
  const isPreMed = f.includes('pre-med') || f.includes('med') || f.includes('bio') || f.includes('health');
  const isEconQuant = f.includes('econ') || f.includes('finance') || f.includes('business') || f.includes('quant');
  const isLawHumanities = f.includes('law') || f.includes('policy') || f.includes('gov') || f.includes('history') || f.includes('humanit');
  const isPhysicsMath = f.includes('phys') || f.includes('math');

  // Problem Solving Gap
  const psGap = cohortBenchmarks.problemSolving - aspirantScores.problemSolving;
  if (psGap > 12) {
    gaps.push({
      area: isPreMed
        ? 'Quantitative & Biological Olympiad Rigor'
        : isEconQuant
        ? 'Analytical & Econometric Problem Solving'
        : isLawHumanities
        ? 'Logical Argumentation & Analytical Oratory'
        : 'Quantitative & Algorithmic Rigor',
      gapDescription: `Your baseline problem-solving score (${aspirantScores.problemSolving}) trails the ${target.targetRankTier} cohort average (${cohortBenchmarks.problemSolving}) by ${psGap} points.`,
      recommendedRemedy: isPreMed
        ? 'Target verified national benchmarks: USABO Semifinalist cutoff, HOSA National Medical Math, or AMC 10/12 score above 90.'
        : isEconQuant
        ? 'Compete in Wharton Global High School Investment Challenge, National Economics Challenge (Adam Smith division), and AMC 10/12.'
        : isLawHumanities
        ? 'Compete in NSDA Lincoln-Douglas or Policy debate circuits; earn state qualification or national speaking honors.'
        : 'Target verified national benchmarks: AIME qualification via AMC 10/12, USACO Gold division, or high placement in state-level math competitions.',
    });
  }

  // Technical Skills / Research Gap
  const techGap = cohortBenchmarks.technicalSkills - aspirantScores.technicalSkills;
  if (techGap > 10) {
    gaps.push({
      area: isPreMed
        ? 'Flagship Biomedical Research & Lab Publication'
        : isEconQuant
        ? 'Empirical Economic Research & Data Modeling'
        : isEngineering
        ? 'Verifiable Engineering Prototype & Fabrication Dossier'
        : isLawHumanities
        ? 'Scholarly Writing & Published Legal/Policy Brief'
        : isPhysicsMath
        ? 'Theoretical Physics / Mathematical Proof Paper'
        : 'Flagship Domain Artifact & Research Publication',
      gapDescription: isPreMed
        ? `Admitted pre-med students demonstrate verifiable proof of inquiry (laboratory shadowing, bioRxiv preprints, or Regeneron ISEF grand awards).`
        : isEconQuant
        ? `Admitted economics and finance students show empirical models, regression studies on real-world datasets, or working papers on SSRN.`
        : isEngineering
        ? `Admitted engineering applicants present CAD models (Fusion 360/SolidWorks), working hardware prototypes, or robotics mechanism documentation.`
        : isLawHumanities
        ? `Admitted law and humanities applicants demonstrate peer-recognized essays in The Concord Review, John Locke distinctions, or municipal policy adoption.`
        : isPhysicsMath
        ? `Admitted math and physics applicants present rigorous proof compendiums, arXiv preprints, or RSI research participation.`
        : `Admitted students in this bracket show verifiable proof of independent investigation and tangible public artifacts.`,
      recommendedRemedy: isPreMed
        ? 'Secure a university biomedical lab placement, conduct an empirical inquiry into genomics or pathology, and submit to ISEF, JSHS, or BioGENEius.'
        : isEconQuant
        ? 'Author an econometric working paper using real-world market datasets, compete in National Economics Challenge, and publish findings.'
        : isEngineering
        ? 'Design, build, and document a functional physical artifact or robotics mechanism with full engineering logs and CAD schematics.'
        : isLawHumanities
        ? 'Author a comprehensive historical or philosophical monograph; submit to John Locke Essay Competition and The Concord Review.'
        : isPhysicsMath
        ? 'Complete an independent theoretical investigation; submit solutions to journals or apply to premier programs like MIT PRIMES / PROMYS.'
        : 'Complete an end-to-end original research investigation or deploy a verified public project with measurable traction.',
    });
  }

  // Leadership / Impact Gap
  const leadGap = cohortBenchmarks.teamWork - aspirantScores.teamWork;
  if (leadGap > 10) {
    gaps.push({
      area: 'Institutional Leadership & Community Scale',
      gapDescription: 'Activity list currently leans toward participant roles rather than founder or systemic community organizer.',
      recommendedRemedy: isPreMed
        ? 'Found a regional health equity initiative, organize blood drives, or distribute medical supply kits reaching 500+ community members.'
        : isEconQuant
        ? 'Found a youth financial literacy council, host inter-school investment simulations, or partner with local credit unions.'
        : isLawHumanities
        ? 'Found a regional civic coalition, lead district Model UN conferences, or present policy briefs directly to city municipal councils.'
        : 'Found a 501(c)(3) nonprofit, direct a regional competition/conference, or scale an existing initiative beyond your immediate high school to 500+ participants.',
    });
  }

  // Standardized Rigor Gap
  if (baseline.testingStatus.includes('Not taken') || baseline.testingStatus.includes('Planning')) {
    gaps.push({
      area: 'Standardized Test Lockout',
      gapDescription: `${target.targetRankTier} institutions in ${target.targetCountry} heavily favor 1550+ SAT / 35+ ACT or predicted 42+ IB scores.`,
      recommendedRemedy: 'Lock down your target standardized test score before the start of senior year to ensure your academic threshold is met early.',
    });
  }

  return gaps;
}
