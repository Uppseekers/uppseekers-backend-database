import { StudentProfile } from '../types';
import { cleanText, parseBulletItems } from './textCleaner';

export interface StandoutHighlight {
  id: string;
  category: 'research' | 'internship' | 'award' | 'project' | 'academic' | 'leadership';
  title: string;
  badge: string;
  description: string;
  impact: 'exceptional' | 'distinguished';
  sourceField: string;
  rawText: string;
}

export interface ProfileCompleteness {
  totalScore: number;
  detailTier: 'Comprehensive' | 'High' | 'Moderate' | 'Basic';
  workCount: number;
  internshipCount: number;
  researchCount: number;
  awardCount: number;
  projectCount: number;
  standoutCount: number;
  standouts: StandoutHighlight[];
}

/**
 * Checks if a piece of text represents an elite or high-impact achievement
 */
export function isStandoutItem(text: string): boolean {
  if (!text || text.length < 5) return false;
  const lower = text.toLowerCase();

  const standoutKeywords = [
    'published',
    'publication',
    'journal',
    'conference',
    'primes',
    'usamo',
    'usapho',
    'aime',
    'usaco',
    'isef',
    'regeneron',
    'olympiad',
    'onsi sawiris',
    'presidential scholar',
    'national merit',
    'valedictorian',
    'salutatorian',
    'gold award',
    'first place',
    '1st place',
    'champion',
    'ibm',
    'microsoft',
    'schneider electric',
    'de nora',
    'bu rise',
    'sams',
    'beaver works',
    'undergraduate researcher',
    'research intern',
    'founder &',
    'founder/ceo',
    'co-founder',
    'autonomous',
    'robotics lead',
    'ethereum',
    'all american',
    'ncwit',
    '1600',
    'act: 36',
    'sat: 1600',
    'sat: 1580',
    '99.72 percentile',
    'city topper',
  ];

  return standoutKeywords.some(kw => lower.includes(kw));
}

/**
 * Intelligently scans a student profile to extract standout work and key achievements
 */
export function detectStandoutWork(student: StudentProfile): StandoutHighlight[] {
  const highlights: StandoutHighlight[] = [];
  let highlightCounter = 0;

  const createId = () => `hl-${student.id}-${++highlightCounter}`;

  // 1. Standardized Testing & Academics Standouts
  const actSatClean = cleanText(student.actSat);
  const acadClean = cleanText(student.academicsPerformance);

  if (actSatClean.includes('1600') || actSatClean.toLowerCase().includes('act: 36') || actSatClean.includes('36/36')) {
    highlights.push({
      id: createId(),
      category: 'academic',
      title: 'Perfect Standardized Test Score',
      badge: 'Perfect Test Score',
      description: actSatClean,
      impact: 'exceptional',
      sourceField: 'actSat',
      rawText: actSatClean,
    });
  } else if (actSatClean.includes('1580') || actSatClean.includes('1550') || actSatClean.includes('1490') || actSatClean.includes('35')) {
    highlights.push({
      id: createId(),
      category: 'academic',
      title: 'Elite Standardized Test Performance',
      badge: 'Top 1% Nationwide',
      description: actSatClean,
      impact: 'distinguished',
      sourceField: 'actSat',
      rawText: actSatClean,
    });
  }

  if (acadClean.toLowerCase().includes('city topper') || acadClean.toLowerCase().includes('99.72 percentile') || acadClean.toLowerCase().includes('4.0 gpa') || acadClean.toLowerCase().includes('gpa: 3.99')) {
    highlights.push({
      id: createId(),
      category: 'academic',
      title: 'Top Academic Standing & Distinction',
      badge: 'Academic Distinction',
      description: acadClean.split('\n')[0] || acadClean,
      impact: 'exceptional',
      sourceField: 'academicsPerformance',
      rawText: acadClean,
    });
  }

  // 2. Research Standouts
  const researchItems = parseBulletItems(student.research);
  for (const item of researchItems) {
    const lower = item.toLowerCase();

    if (lower.includes('primes') || lower.includes('publication') || lower.includes('published') || lower.includes('journal') || lower.includes('ieee') || lower.includes('conference')) {
      highlights.push({
        id: createId(),
        category: 'research',
        title: lower.includes('primes') ? 'MIT PRIMES-USA Theoretical Research' : 'Published Academic Research / Journal Paper',
        badge: 'Published Research',
        description: item,
        impact: 'exceptional',
        sourceField: 'research',
        rawText: item,
      });
    } else if (lower.includes('rise') || lower.includes('reinforcement learning') || lower.includes('perovskite') || lower.includes('undergraduate researcher') || lower.includes('quantum') || lower.includes('astrophysics') || lower.includes('acoustics') || lower.includes('sams')) {
      highlights.push({
        id: createId(),
        category: 'research',
        title: 'Advanced University Laboratory Research',
        badge: 'Advanced Lab Research',
        description: item,
        impact: 'distinguished',
        sourceField: 'research',
        rawText: item,
      });
    }
  }

  // 3. Internship & Work Experience Standouts
  const internItems = parseBulletItems(student.internshipWork);
  for (const item of internItems) {
    const lower = item.toLowerCase();

    if (lower.includes('ibm') || lower.includes('microsoft') || lower.includes('schneider electric') || lower.includes('de nora') || lower.includes('platoon commander') || lower.includes('t1nexus') || lower.includes('devrev') || lower.includes('hospital')) {
      highlights.push({
        id: createId(),
        category: 'internship',
        title: 'Industry & Corporate Work Experience',
        badge: 'Recognized Work Experience',
        description: item,
        impact: 'exceptional',
        sourceField: 'internshipWork',
        rawText: item,
      });
    } else if (lower.includes('founder') || lower.includes('ceo') || lower.includes('co-founder') || lower.includes('lead developer') || lower.includes('machine learning engineer intern') || lower.includes('software engineer intern')) {
      highlights.push({
        id: createId(),
        category: 'internship',
        title: 'Engineering Leadership & Startup Role',
        badge: 'Technical Leadership',
        description: item,
        impact: 'distinguished',
        sourceField: 'internshipWork',
        rawText: item,
      });
    }
  }

  // 4. Competitions and Awards Standouts
  const awardItems = parseBulletItems(student.competitionsAwards);
  for (const item of awardItems) {
    const lower = item.toLowerCase();

    if (lower.includes('isef') || lower.includes('regeneron') || lower.includes('usamo') || lower.includes('usapho') || lower.includes('aime') || lower.includes('usaco platinum') || lower.includes('onsi sawiris') || lower.includes('presidential scholar') || lower.includes('national merit') || lower.includes('first place') || lower.includes('1st place') || lower.includes('champion') || lower.includes('salutatorian') || lower.includes('valedictorian') || lower.includes('gold award')) {
      highlights.push({
        id: createId(),
        category: 'award',
        title: lower.includes('isef') ? 'Regeneron ISEF International Finalist' : lower.includes('usamo') ? 'USAMO / Olympiad Honors' : lower.includes('onsi sawiris') ? 'Onsi Sawiris Scholarship Nominee' : 'National / International Competition Honor',
        badge: lower.includes('isef') ? 'ISEF Finalist' : lower.includes('usamo') ? 'USAMO Qualifier' : 'National Honor',
        description: item,
        impact: 'exceptional',
        sourceField: 'competitionsAwards',
        rawText: item,
      });
    } else if (lower.includes('scholarship') || lower.includes('distinction') || lower.includes('olympiad') || lower.includes('ncwit') || lower.includes('all american') || lower.includes('ukmt') || lower.includes('amc') || lower.includes('deca icdc')) {
      highlights.push({
        id: createId(),
        category: 'award',
        title: 'Selective Scholarship & Contest Distinction',
        badge: 'Selective Distinction',
        description: item,
        impact: 'distinguished',
        sourceField: 'competitionsAwards',
        rawText: item,
      });
    }
  }

  // 5. Significant Technical Projects
  const projectItems = parseBulletItems(student.projects);
  for (const item of projectItems) {
    const lower = item.toLowerCase();
    if (lower.includes('robot') || lower.includes('autonomous') || lower.includes('ethereum') || lower.includes('blockchain') || lower.includes('llm') || lower.includes('generative ai') || lower.includes('yolo') || lower.includes('rov') || lower.includes('circuit complexity') || lower.includes('simbad') || lower.includes('saas') || lower.includes('machine learning model')) {
      highlights.push({
        id: createId(),
        category: 'project',
        title: 'Complex Engineering & AI Project',
        badge: 'Deep Tech Project',
        description: item,
        impact: 'distinguished',
        sourceField: 'projects',
        rawText: item,
      });
    }
  }

  // Limit to top distinct highlights to prevent UI clutter while giving rich details
  return highlights.slice(0, 5);
}

/**
 * Computes a comprehensive detail and work completeness score for a student profile.
 * Profiles with more rich content (especially work, research, awards, tests, projects)
 * will score significantly higher and be sorted upwards.
 */
export function calculateProfileCompleteness(student: StudentProfile): ProfileCompleteness {
  const internItems = parseBulletItems(student.internshipWork);
  const researchItems = parseBulletItems(student.research);
  const awardItems = parseBulletItems(student.competitionsAwards);
  const projectItems = parseBulletItems(student.projects);
  const summerItems = parseBulletItems(student.summerPrograms);
  const certItems = parseBulletItems(student.certificatesMoocs);
  const activityItems = parseBulletItems(student.otherActivities);

  const standouts = detectStandoutWork(student);

  // Score points calculation
  let score = 0;

  // Work & Internships (35 pts each + text length factor)
  score += internItems.length * 35;
  score += Math.min(100, (student.internshipWork || '').length / 10);

  // Research (40 pts each + text length factor)
  score += researchItems.length * 40;
  score += Math.min(100, (student.research || '').length / 10);

  // Competitions & Awards (30 pts each)
  score += awardItems.length * 30;
  score += Math.min(80, (student.competitionsAwards || '').length / 10);

  // Projects (25 pts each)
  score += projectItems.length * 25;
  score += Math.min(60, (student.projects || '').length / 10);

  // Academics & Test Scores
  if (student.actSat && student.actSat.trim().length > 0) score += 40;
  if (student.academicsPerformance && student.academicsPerformance.trim().length > 0) score += 35;
  if (student.apTaken && student.apTaken.trim().length > 0) score += 25;
  if (student.languageTest && student.languageTest.trim().length > 0) score += 15;

  // Summer programs & certs
  score += summerItems.length * 15;
  score += certItems.length * 10;
  score += activityItems.length * 8;
  if (student.linkedin) score += 15;
  if (student.notes) score += 10;

  // Standout achievements bonus
  score += standouts.length * 30;
  standouts.forEach(s => {
    if (s.impact === 'exceptional') score += 25;
  });

  const totalWorkCount = internItems.length + researchItems.length + awardItems.length + projectItems.length;

  let tier: ProfileCompleteness['detailTier'] = 'Basic';
  if (score >= 260 || (totalWorkCount >= 6 && standouts.length >= 2)) {
    tier = 'Comprehensive';
  } else if (score >= 150 || totalWorkCount >= 4) {
    tier = 'High';
  } else if (score >= 70 || totalWorkCount >= 2) {
    tier = 'Moderate';
  }

  return {
    totalScore: Math.round(score),
    detailTier: tier,
    workCount: totalWorkCount,
    internshipCount: internItems.length,
    researchCount: researchItems.length,
    awardCount: awardItems.length,
    projectCount: projectItems.length,
    standoutCount: standouts.length,
    standouts,
  };
}
