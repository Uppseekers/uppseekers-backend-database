import { StudentProfile } from '../types';

export interface ActivityBenchmark {
  activityName: string;
  category?: string;
  rarityPercent: string;
  whySuggested: string;
  knowledgeContribution?: string;
}

export interface KnowledgeAssessment {
  breadthAnalysis: string;
  depthAnalysis: string;
  technicalLevel: string;
}

export interface MentorSummaryResponse {
  hasEnoughInfo: boolean;
  studentName?: string;
  missingFields?: string[];
  reason?: string;
  counselorVoiceSummary?: string;
  knowledgeAssessment?: KnowledgeAssessment;
  activityBenchmarking?: ActivityBenchmark[];
  strategicAdmissionsVerdict?: string;
  source?: string;
}

/**
 * Checks if a profile contains enough substantive information to warrant a human mentor evaluation.
 * If data is very minimal (e.g. no internships, no research, no awards, no projects),
 * the summary is skipped and data is required to be added by the student.
 */
export function evaluateProfileSufficiency(student: StudentProfile): {
  isSufficient: boolean;
  missingFields: string[];
  reason: string;
} {
  const missingFields: string[] = [];

  const internText = (student.internshipWork || '').trim();
  const researchText = (student.research || '').trim();
  const awardsText = (student.competitionsAwards || '').trim();
  const projectsText = (student.projects || '').trim();
  const summerText = (student.summerPrograms || '').trim();
  const activitiesText = (student.otherActivities || '').trim();
  const academicsText = (student.academicsPerformance || '').trim();
  const testScoresText = (student.actSat || '').trim();

  if (internText.length < 10) missingFields.push('Internships & Professional Experience');
  if (researchText.length < 10) missingFields.push('Research & Laboratory Inquiries');
  if (awardsText.length < 10) missingFields.push('Competitions, Olympiads & Honors');
  if (projectsText.length < 10) missingFields.push('Technical & Capstone Projects');

  // Count core substantive areas populated
  const substantiveAreas = [
    internText.length >= 10,
    researchText.length >= 10,
    awardsText.length >= 10,
    projectsText.length >= 10,
  ].filter(Boolean).length;

  const totalLength =
    internText.length +
    researchText.length +
    awardsText.length +
    projectsText.length +
    summerText.length +
    activitiesText.length;

  // If student has 0 or 1 sparse substantive area and very little text overall
  const isSufficient = substantiveAreas >= 2 || (substantiveAreas >= 1 && totalLength > 120);

  return {
    isSufficient,
    missingFields,
    reason: isSufficient
      ? 'Profile has sufficient documented activities for a comprehensive counselor evaluation.'
      : 'This student profile currently lacks detailed activity and project records. Before our advisory team can compile a personalized mentor summary evaluating intellectual breadth, research depth, and admissions strategy, the student must submit additional portfolio data.',
  };
}

// In-memory / session cache key
const CACHE_PREFIX = 'mentor_summary_';

export async function fetchMentorSummary(
  student: StudentProfile,
  forceRefresh = false
): Promise<MentorSummaryResponse> {
  const cacheKey = `${CACHE_PREFIX}${student.id || student.name}`;

  if (!forceRefresh) {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // ignore storage error
    }
  }

  // Pre-check sufficiency
  const check = evaluateProfileSufficiency(student);
  if (!check.isSufficient) {
    const insufficientResult: MentorSummaryResponse = {
      hasEnoughInfo: false,
      studentName: student.name,
      missingFields: check.missingFields,
      reason: check.reason,
    };
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(insufficientResult));
    } catch {
      // ignore
    }
    return insufficientResult;
  }

  try {
    const res = await fetch('/api/profile-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data: MentorSummaryResponse = await res.json();
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
    } catch {
      // ignore
    }
    return data;
  } catch (err) {
    console.warn('Backend summary endpoint unreachable, using client synthesizer:', err);
    const fallback = generateClientMentorSummary(student);
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(fallback));
    } catch {
      // ignore
    }
    return fallback;
  }
}

/**
 * High-fidelity client-side counselor generator used as immediate fallback
 */
export function generateClientMentorSummary(student: StudentProfile): MentorSummaryResponse {
  const check = evaluateProfileSufficiency(student);
  if (!check.isSufficient) {
    return {
      hasEnoughInfo: false,
      studentName: student.name,
      missingFields: check.missingFields,
      reason: check.reason,
    };
  }

  const firstName = student.name ? student.name.split(' ')[0] : 'The student';
  const benchmarks: ActivityBenchmark[] = [];

  // Parse Research
  if (student.research && student.research.trim().length > 10) {
    const isPrimes = /primes|usamo|stanford|mit/i.test(student.research);
    const isJournal = /journal|publication|conference|ieee/i.test(student.research);
    benchmarks.push({
      activityName: student.research.split('\n')[0].replace(/^[•\-\*]\s*/, ''),
      category: 'Research & Scholarly Inquiry',
      rarityPercent: isPrimes
        ? '<0.1% of national applicants'
        : isJournal
        ? '~0.8% of competitive STEM applicants'
        : 'Top ~2.5% of pre-college researchers',
      whySuggested: `We originally guided ${firstName} to pursue this research topic to move beyond standardized curriculum mastery and establish verifiable proof of scholarly independence and experimental stamina.`,
      knowledgeContribution: 'Cultivates specialized literature comprehension and graduate-level computational/experimental rigor.',
    });
  }

  // Parse Internships
  if (student.internshipWork && student.internshipWork.trim().length > 10) {
    const isMajor = /ibm|microsoft|schneider|de nora|intel|apple|google|startup/i.test(student.internshipWork);
    benchmarks.push({
      activityName: student.internshipWork.split('\n')[0].replace(/^[•\-\*]\s*/, ''),
      category: 'Industry & Professional Engineering',
      rarityPercent: isMajor
        ? 'Fewer than 1.5% of high school candidates'
        : 'Top ~4% of pre-college applicants',
      whySuggested: `We advised ${firstName} to secure production engineering exposure early to prove their ability to deliver software in collaborative, live enterprise environments outside a classroom setting.`,
      knowledgeContribution: 'Broadens practical understanding of distributed systems, Agile workflows, and production codebases.',
    });
  }

  // Parse Competitions & Awards
  if (student.competitionsAwards && student.competitionsAwards.trim().length > 10) {
    const isOlympiad = /usamo|usaco|aime|isef|regeneron|olympiad|sawiris/i.test(student.competitionsAwards);
    benchmarks.push({
      activityName: student.competitionsAwards.split('\n')[0].replace(/^[•\-\*]\s*/, ''),
      category: 'Academic Competitions & Honors',
      rarityPercent: isOlympiad
        ? '<0.5% of national competitors'
        : 'Top ~3% of academic candidates',
      whySuggested: `We recommended targeting selective national competitions to provide external, objective validation of ${firstName}'s problem-solving acumen against top-tier peer groups.`,
      knowledgeContribution: 'Validates rapid algorithmic thinking, mathematical intuition, and execution under pressure.',
    });
  }

  // Parse Projects
  if (student.projects && student.projects.trim().length > 10) {
    benchmarks.push({
      activityName: student.projects.split('\n')[0].replace(/^[•\-\*]\s*/, ''),
      category: 'Independent Capstone & Engineering',
      rarityPercent: 'Top ~5% of pre-college builders',
      whySuggested: `We encouraged ${firstName} to build and deploy an autonomous technical project to demonstrate end-to-end execution, problem discovery, and initiative.`,
      knowledgeContribution: 'Develops full-stack product architectural intuition and iterative user feedback integration.',
    });
  }

  const counselorVoiceSummary = `When our advisory team first began guiding ${firstName} through their admissions roadmap, our goal was turning their sharp curiosity into a unified, high-impact narrative. Rather than accumulating disconnected extracurricular titles, we challenged ${firstName} to anchor their energy in genuine academic depth and practical technical application.

Throughout our mentoring sessions, ${firstName}'s dedication was unmistakable. By balancing advanced theoretical exploration with tangible problem solving, they successfully established a profile with both academic weight and real-world relevance—making them an exceptional match for ${student.university}.`;

  return {
    hasEnoughInfo: true,
    studentName: student.name,
    counselorVoiceSummary,
    knowledgeAssessment: {
      breadthAnalysis: `${firstName} showcases notable breadth of knowledge across disciplines, connecting computer science concepts with applied fields such as robotics, data analytics, and community-facing platforms.`,
      depthAnalysis: `Within their focal discipline, ${firstName} exhibits advanced conceptual depth, demonstrating the patience and analytical rigor expected in collegiate-level lab environments.`,
      technicalLevel: benchmarks.length >= 3 ? 'Advanced Scholarly & Technical Distinction' : 'High Technical Proficiency',
    },
    activityBenchmarking: benchmarks,
    strategicAdmissionsVerdict: `${firstName}'s candidacy succeeded because every strategic recommendation was executed with authenticity—presenting admissions committees with a mature scholar capable of immediate contribution.`,
    source: 'counselor_synthesizer',
  };
}
