import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Layers,
  Sparkles,
  RotateCcw,
  Target,
  Globe2,
  FileCheck2,
  Award,
} from 'lucide-react';
import { AspiringStudentBaseline, GradeLevel, RankTier } from '../../types';
import { detectProfileCompletedActivities, DetectedActivityEvidence } from '../../utils/roadmapEngine';

export interface SupercurricularMilestoneItem {
  id: string;
  category: 'internship' | 'research' | 'competition' | 'certification' | 'award' | 'leadership';
  title: string;
  suggestedAction: string;
  impactLevel: 'Critical Anchor' | 'High-Impact Spike' | 'Core Differentiator';
  timeCommitment: string;
  admissionsRationale: string;
}

export interface MilestonePhase {
  milestoneNumber: number;
  grade: GradeLevel;
  phaseTitle: string;
  objective: string;
  items: SupercurricularMilestoneItem[];
}

export interface SupercurricularMilestonesViewProps {
  currentGrade: GradeLevel;
  targetRankTier: RankTier;
  targetUniversity?: string;
  targetCountry: string;
  targetField?: string;
  baseline?: AspiringStudentBaseline;
  studentName?: string;
  onMilestonesChange?: (total: number, completed: number) => void;
}

export const getMilestoneCountForTier = (tier: RankTier): number => {
  switch (tier) {
    case 'Top 5':
      return 18;
    case 'Top 10':
      return 15;
    case 'Top 25':
      return 12;
    case 'Top 50':
      return 10;
    case 'Top 100':
    default:
      return 8;
  }
};

export const SupercurricularMilestonesView: React.FC<SupercurricularMilestonesViewProps> = ({
  currentGrade,
  targetRankTier,
  targetUniversity,
  targetCountry,
  targetField = 'Computer Science & AI',
  baseline,
  studentName = 'Aspiring Student',
  onMilestonesChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completedItemIds, setCompletedItemIds] = useState<Set<string>>(new Set());

  // Detect verified activities from uploaded profile baseline
  const detectedActivities = useMemo(() => {
    if (!baseline) return [];
    return detectProfileCompletedActivities(
      {
        studentName,
        currentGrade,
        targetCountry,
        targetRankTier,
        targetUniversity,
        targetField,
        targetClassOf: '2028',
      },
      baseline
    );
  }, [baseline, studentName, currentGrade, targetCountry, targetRankTier, targetUniversity, targetField]);

  // Map of milestoneId -> DetectedActivityEvidence
  const detectedEvidenceMap = useMemo(() => {
    const map = new Map<string, DetectedActivityEvidence>();
    detectedActivities.forEach((act) => {
      map.set(act.milestoneId, act);
    });
    return map;
  }, [detectedActivities]);

  // Track student identity token: switching profiles re-initializes from detected evidence, while country/tier adjustments preserve marked milestones
  const studentIdentity = `${studentName}::${baseline?.gpaRigor || ''}::${baseline?.testingStatus || ''}::${baseline?.technicalProjects || ''}`;
  const prevStudentIdentityRef = useRef<string>(studentIdentity);

  useEffect(() => {
    if (prevStudentIdentityRef.current !== studentIdentity) {
      prevStudentIdentityRef.current = studentIdentity;
      const initial = new Set<string>();
      detectedActivities.forEach((act) => initial.add(act.milestoneId));
      setCompletedItemIds(initial);
    } else {
      setCompletedItemIds((prev) => {
        const merged = new Set(prev);
        detectedActivities.forEach((act) => merged.add(act.milestoneId));
        return merged;
      });
    }
  }, [detectedActivities, studentIdentity]);

  const toggleItem = (id: string) => {
    setCompletedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleResetProgress = () => {
    setCompletedItemIds(new Set());
  };

  // Generate discipline, country, and selectivity tier-tailored supercurricular milestones
  const phases: MilestonePhase[] = useMemo(() => {
    const f = targetField.toLowerCase();
    const isCS = f.includes('cs') || f.includes('computer') || f.includes('code') || f.includes('software') || f.includes('data');
    const isEngineering = !isCS && (f.includes('engineer') || f.includes('robot') || f.includes('aerospace') || f.includes('mechanical') || f.includes('electrical'));
    const isPreMed = f.includes('pre-med') || f.includes('med') || f.includes('bio') || f.includes('health') || f.includes('neuro');
    const isEcon = f.includes('econ') || f.includes('finance') || f.includes('business') || f.includes('quant') || f.includes('commerce') || f.includes('consult');
    const isLaw = f.includes('law') || f.includes('policy') || f.includes('relation') || f.includes('gov') || f.includes('history') || f.includes('phil') || f.includes('humanit');
    const isPhysicsMath = f.includes('phys') || f.includes('math') || f.includes('astro') || f.includes('stat');

    // Country flags
    const c = targetCountry.toLowerCase();
    const isUK = c.includes('united kingdom') || c.includes('uk') || c.includes('britain') || c.includes('oxford') || c.includes('cambridge');
    const isUS = c.includes('united states') || c.includes('us');
    const isCanada = c.includes('canada') || c.includes('waterloo') || c.includes('toronto');
    const isSingapore = c.includes('singapore') || c.includes('nus') || c.includes('ntu');
    const isSwitzerland = c.includes('switzerland') || c.includes('europe') || c.includes('eth');
    const isAustralia = c.includes('australia') || c.includes('melbourne');
    const isCanadaOrSingapore = isCanada || isSingapore;

    // University tier scaling flags (Top 5 is pinnacle international, Top 25/50 shifts to strong regional/capstone depth)
    const isTop5 = targetRankTier === 'Top 5';
    const isTop10 = targetRankTier === 'Top 10';
    const isTop25 = targetRankTier === 'Top 25';
    const isTop50 = targetRankTier === 'Top 50';
    const isTop100 = targetRankTier === 'Top 100';
    const isElitePinnacle = isTop5 || isTop10;

    // --- GRADE 9 ITEMS POOL ---
    const g9Pool: SupercurricularMilestoneItem[] = [
      {
        id: 'g9-cert-1',
        category: 'certification',
        title: isUK
          ? isTop5
            ? 'Oxbridge Faculty Reading List & Seminal Literature Synthesis'
            : isTop10
            ? 'Russell Group Core Reading List & Foundational Essay'
            : 'Academic Subject MOOC & Foundational Literature Critique'
          : isCanadaOrSingapore
          ? isTop5
            ? 'Waterloo Advanced Contest Core & Canadian Computing Preparation'
            : 'Applied STEM Mathematics & Computing Prerequisite Core'
          : isAustralia
          ? isTop5
            ? 'Advanced Prerequisite Mathematics & High-Rank ATAR Syllabus Core'
            : 'State Prerequisite Mathematics & Academic Foundation'
          : isPreMed
          ? isTop5
            ? 'Johns Hopkins Genomic Tech & NIH Bioethics Specialization'
            : 'Foundational Medical & Bio Sciences MOOCs'
          : isEcon
          ? isTop5
            ? 'Wharton Business Foundations & Advanced Financial Modeling'
            : 'Foundational Microeconomics & Market Dynamics MOOCs'
          : isEngineering
          ? isTop5
            ? 'Certified SolidWorks Associate (CSWA) & Advanced CAD Digital Fabrication'
            : 'Introductory CAD Design & Tooling Safety Certification'
          : isLaw
          ? isTop5
            ? 'Harvard Justice (edX) & Constitutional Jurisprudence Specialization'
            : 'Jurisprudence & Constitutional Foundations MOOCs'
          : isPhysicsMath
          ? isTop5
            ? `${targetUniversity ? targetUniversity.split(' ')[0] : 'Top Tier'} Multivariable Calculus & Discrete Proof Techniques`
            : 'Introductory Calculus & Physics Problem Solving'
          : isTop5
          ? `${targetUniversity ? targetUniversity.split(' ')[0] : 'Top Tier'} Disciplinary Core & Advanced University Proofs`
          : 'Foundational University MOOCs & Coding Tools',
        suggestedAction: isUK
          ? isTop5
            ? `Read 4 foundational university texts recommended by Oxford/Cambridge faculty bibliographies for ${targetField}; synthesize two 1,500-word critical evaluation essays assessing contested theories.`
            : `Read 2 foundational texts from Russell Group recommended reading lists for ${targetField}; maintain a structured reading synthesis journal.`
          : isCanadaOrSingapore
          ? `Work through past University of Waterloo mathematics contest sets; complete introductory Python/C++ algorithmic problem sets.`
          : isAustralia
          ? `Lock in prerequisites in Higher Level Mathematics or Chemistry; maintain top 5% test scores in school assessments.`
          : isTop5
          ? `Enroll in the most rigorous high school schedule available; complete premier university online modules and advanced coursework in ${targetField} with verified distinction.`
          : isTop10
          ? `Maintain unweighted 3.94+ GPA across honors/AP courses and complete 1 foundational university specialization in ${targetField}.`
          : isTop25
          ? `Maintain 3.90+ GPA in high school core coursework and complete introductory online course credential.`
          : `Maintain solid 3.80+ GPA in college preparatory coursework and complete introductory online learning modules.`,
        impactLevel: isTop5 ? 'Critical Anchor' : 'Core Differentiator',
        timeCommitment: isTop5 ? '4–5 hrs/week' : '2–3 hrs/week',
        admissionsRationale: isUK
          ? 'UCAS admissions tutors prioritize self-directed academic reading beyond the school syllabus over general extracurriculars.'
          : 'Establishes early scholastic mastery and proves intellectual vitality beyond mandatory classroom curricula.',
      },
      {
        id: 'g9-comp-1',
        category: 'competition',
        title: isUK
          ? isTop5
            ? 'UKMT Intermediate Mathematical Challenge (Target Gold & Maclaurin / Kangaroo)'
            : 'UKMT Intermediate Challenge & Regional Subject Contest'
          : isCanadaOrSingapore
          ? isTop5
            ? 'Waterloo Pascal / Gauss (Top 5% Distinction) & CCC Junior'
            : 'Waterloo Pascal Contest & Local Computing Competition'
          : isPreMed
          ? isTop5
            ? 'Regional Science Fair Inquiry & Local HOSA Innovation Winner'
            : 'Regional Science Fair Inquiry & Local HOSA'
          : isEcon
          ? isTop5
            ? 'Wharton Global High School Investment & Novice Debate Circuit'
            : 'Local High School Investment Challenge & Speech Contest'
          : isEngineering
          ? isTop5
            ? 'FIRST Robotics (FRC/FTC) Regional Roster & CAD Mechanism Design'
            : 'School Robotics Club or Science Olympiad Regional Roster'
          : isLaw
          ? isTop5
            ? 'Novice Lincoln-Douglas Debate & Premier Collegiate Model UN Gavel Circuit'
            : 'High School Debate Club & Model UN Participant'
          : isPhysicsMath
          ? isTop5
            ? 'AMC 10 (Target 95+ Score for Early AIME Cutoff) & Physics Bowl Division 1'
            : 'AMC 10 Contest & Local High School Math Meet'
          : isTop5
          ? 'AMC 10 (Target 95+ Score) & USACO Bronze → Silver Advancement'
          : isTop10
          ? 'AMC 10 Contest (Target 85+ Score) & High School Hackathon Finalist'
          : isTop25
          ? 'Regional Science Fair Inquiry or Local Hackathon Finalist'
          : 'First-Round Olympiads & Contest Benchmarking',
        suggestedAction: isUK
          ? `Prepare with past UKMT Intermediate papers aiming for Gold certificate; explore British Biology or Chemistry Olympiad junior division.`
          : isCanadaOrSingapore
          ? `Sit for University of Waterloo Pascal or Cayley contest; compete in Canadian Computing Competition (CCC Junior).`
          : isTop5
          ? `Sit for AMC 10 aiming for 95+ score to build trajectory toward AIME qualification; advance to USACO Silver or win regional hackathon.`
          : isTop10
          ? `Target 85+ score on AMC 10; participate in regional Science Olympiad or local student hackathon.`
          : isTop25
          ? `Participate in regional science fair or high school contest in ${targetField}; build competitive problem-solving endurance.`
          : `Participate in high school mathematics or domain contest to establish an initial problem-solving benchmark.`,
        impactLevel: isTop5 ? 'Critical Anchor' : 'Core Differentiator',
        timeCommitment: isTop5 ? '3–5 hrs/week contest prep' : '2–3 hrs/week',
        admissionsRationale:
          'Establishes objective contest benchmark. Starting in 9th grade provides multiple iterative cycles to qualify for national rounds.',
      },
      {
        id: 'g9-intern-1',
        category: 'internship',
        title: isUK
          ? isTop5
            ? 'University Faculty Research Shadowing & Supercurricular Diary (Gresham / In2scienceUK)'
            : 'Academic Department Lecture Attendance & Reflective Subject Diary'
          : isPreMed
          ? isTop5
            ? 'Hospital Shadowing & Clinical Volunteer Rotations (60+ Hours Logged)'
            : 'Local Hospital or Healthcare Community Volunteering'
          : isEcon
          ? isTop5
            ? 'Credit Union / Financial Literacy Community Apprenticeship'
            : 'Community Business Operations or Non-Profit Finance Volunteering'
          : isEngineering
          ? isTop5
            ? 'Mechanical Fabrication Workshop & Machine Tooling Safety Apprenticeship'
            : 'Maker Space Tooling Safety & Prototyping Apprentice'
          : isLaw
          ? isTop5
            ? 'Legal Aid Clinic Assistant & Municipal Office Volunteer'
            : 'Local Court Observer & Civic Non-Profit Volunteer'
          : isPhysicsMath
          ? isTop5
            ? 'University Physics Observatory / Computational Lab Shadowing'
            : 'University Math Circle / Science Observatory Public Nights'
          : isTop5
          ? 'Selective Lab Apprenticeship / Hardware Prototyping Fellow'
          : isTop10
          ? 'University Laboratory Shadowing or Engineering Workshop Apprentice'
          : isTop25
          ? 'Local Professional Firm Shadowing, Hospital Volunteer, or Maker Lab Apprentice'
          : 'Shadowing & Exploratory Project Lab',
        suggestedAction: isUK
          ? `Attend open university research colloquia or Gresham College public lectures; keep a 20-page reflective reading journal in ${targetField}.`
          : isTop5
          ? `Secure structured shadowing with university lab researchers or log 60+ hours in professional clinic/engineering facility in ${targetField}.`
          : isTop10
          ? `Shadow an engineer, researcher, or practitioner in ${targetField}; assist with laboratory testing or technical setups.`
          : isTop25
          ? `Volunteer with local firm or clinical non-profit in ${targetField}; document professional workflows.`
          : `Complete structured laboratory safety orientation or shadow a local practitioner in ${targetField}.`,
        impactLevel: 'Core Differentiator',
        timeCommitment: '2–3 hrs/week',
        admissionsRationale:
          'Provides early exposure to professional workflows and experimental pipelines in your intended discipline.',
      },
      {
        id: 'g9-lead-1',
        category: 'leadership',
        title: isUK
          ? isTop5
            ? 'Academic Subject Discussion Society & Journal Club Founder'
            : 'High School Academic Club Executive & Subject Peer Tutor'
          : isTop5
          ? 'Founder of Scaled Peer Initiative or Non-Profit Workshop Series (50+ active participants)'
          : isTop10
          ? 'High School Organization Co-Founder & Regional STEM Workshop Director'
          : isTop25
          ? 'School Club Officer / Team Project Co-Lead'
          : 'Peer Mentorship & School Club Initiation',
        suggestedAction: isUK
          ? `Found or co-lead an after-school academic seminar reviewing recent journal publications in ${targetField}. (Note: UCAS explicitly ignores generic sports captaincy or unrelated volunteering).`
          : isTop5
          ? `Launch a student tutoring initiative, open-source workshop, or community service program in ${targetField} with 50+ verified participants.`
          : isTop10
          ? `Serve as officer in major high school club in ${targetField}; organize inter-school seminars or hackathon sessions.`
          : isTop25
          ? `Lead a project team or serve as junior officer in school club related to ${targetField}.`
          : `Actively contribute to high school academic or community club in ${targetField}.`,
        impactLevel: isTop5 ? 'High-Impact Spike' : 'Core Differentiator',
        timeCommitment: '2 hrs/week',
        admissionsRationale: isUK
          ? 'Demonstrates academic enthusiasm and intellectual generosity without distracting from subject depth.'
          : 'Demonstrates early leadership initiative, collaborative warmth, and inclination to share domain skills.',
      },
    ];

    // --- GRADE 10 ITEMS POOL ---
    const g10Pool: SupercurricularMilestoneItem[] = [
      {
        id: 'g10-comp-1',
        category: 'competition',
        title: isUK
          ? isTop5
            ? 'UKMT Senior Mathematical Challenge Gold + BMO1 / BPhO Senior Gold'
            : isTop10
            ? 'UKMT Senior Gold & Kangaroo / BPhO Senior Challenge Silver'
            : 'UKMT Senior Silver / Regional Subject Contest Finalist'
          : isCanadaOrSingapore
          ? isTop5
            ? 'Waterloo Fermat / Galois Top 10% & CCC Senior Distinction'
            : 'Waterloo Contest Top 25% Honor Roll & Computing Contest'
          : isPreMed
          ? isTop5
            ? 'USABO Semifinalist Push (Top 10% Nationwide) & State HOSA Gold'
            : isTop10
            ? 'USABO Top 20% Score & State HOSA Medical Innovation Winner'
            : 'Regional HOSA Medalist & Local Science Fair Finalist'
          : isEcon
          ? isTop5
            ? 'National Economics Challenge (NEC) State Finals Champion & Wharton Pitch'
            : isTop10
            ? 'NEC State Finals Qualifier & Regional Case Competition Gold'
            : 'Regional Business Challenge Participant & Debate Winner'
          : isEngineering
          ? isTop5
            ? 'BPhO Senior Challenge Gold & FIRST Robotics Subsystem Lead'
            : isTop10
            ? 'BPhO Senior Silver & FRC Regional Drive Team'
            : 'Regional Robotics / TSA TEAMS Engineering Competitor'
          : isLaw
          ? isTop5
            ? 'National History Day (NHD) State Championship & Collegiate MUN Best Delegate'
            : isTop10
            ? 'State Speech & Debate Tournament Finalist & Model UN Outstanding Delegate'
            : 'Regional Debate Tournament Participant & Local MUN Delegate'
          : isPhysicsMath
          ? isTop5
            ? 'AIME Qualification (Score 8+ Target) & USAPhO F=ma Top 10%'
            : isTop10
            ? 'AIME Qualifier via AMC 10/12 & USAPhO F=ma Qualifier'
            : 'AMC 10 Score 85+ & PhysicsBowl Division 1 Participant'
          : isTop5
          ? 'AIME Qualification (Score 8+ Target) & USACO Silver → Gold Advancement'
          : isTop10
          ? 'AIME Qualification via AMC 10/12 & USACO Gold'
          : isTop25
          ? 'Regional Science Olympiad Medalist / State Contest Finalist / AMC 10 Score 85+'
          : 'Regional STEM / Contest Competitor',
        suggestedAction: isUK
          ? isTop5
            ? 'Target Gold certificate in UKMT Senior Challenge to qualify for British Mathematical Olympiad (BMO1); sit for BPhO Senior Challenge.'
            : 'Sit for UKMT Senior Mathematical Challenge aiming for Silver or Gold; enter regional science olympiad.'
          : isCanadaOrSingapore
          ? 'Score in top 10% honor roll in University of Waterloo Fermat contest; score 45+ on Canadian Computing Competition Senior.'
          : isTop5
          ? 'Attain AIME cutoff on AMC 10/12; advance to USACO Gold; compete in State Science Olympiad.'
          : isTop10
          ? 'Target AIME qualification on AMC 10/12; earn medal at State Science Olympiad or regional hackathon.'
          : isTop25
          ? 'Compete in regional contests in ${targetField}; target top quartile placement in state-level competition.'
          : 'Compete in regional high school academic contests in ${targetField} to establish external contest validation.',
        impactLevel: isTop5 ? 'Critical Anchor' : 'High-Impact Spike',
        timeCommitment: isTop5 ? '6–8 hrs/week contest prep' : '3–4 hrs/week',
        admissionsRationale:
          'High-percentile contest credentials provide objective validation of scholastic endurance evaluated nationwide.',
      },
      {
        id: 'g10-intern-1',
        category: 'internship',
        title: isUK
          ? isTop5
            ? 'University Department Summer Apprenticeship & PI Outreach'
            : 'Academic Department Summer Attachment or Research Colleague Shadowing'
          : isTop5
          ? 'Selective Summer Lab Research Fellowship (Garcia Center, NIH Summer, Stanford SIMR, LaunchX)'
          : isTop10
          ? 'University Lab Research Fellowship or Tech Startup Software Engineering Internship'
          : isTop25
          ? 'Regional Engineering Apprenticeship, Hospital Clinical Rotations (60+ Hours), or University Summer Workshop'
          : 'Local Professional Shadowing, Non-Profit IT Fellow, or School Lab Apprentice',
        suggestedAction: isUK
          ? `Direct outreach to academic researchers in ${targetField} at regional universities; secure summer observational or computational research role.`
          : isTop5
          ? `Apply to selective merit summer research labs; reach out to 20+ university faculty members with tailored inquiries citing their recent papers in ${targetField}.`
          : isTop10
          ? `Secure 6-week summer apprenticeship with university research team or tech startup in ${targetField}.`
          : isTop25
          ? `Shadow an engineer, doctor, or analyst in ${targetField}; complete 40+ hours of structured project or clinical work.`
          : `Participate in school summer lab program or shadow local industry professionals in ${targetField}.`,
        impactLevel: isTop5 ? 'High-Impact Spike' : 'Core Differentiator',
        timeCommitment: 'Full-time 4–6 weeks in summer',
        admissionsRationale:
          'Faculty mentorship provides experimental credibility and guidance required for publication-grade inquiry.',
      },
      {
        id: 'g10-research-1',
        category: 'research',
        title: isUK
          ? isTop5
            ? 'Extended Project Qualification (EPQ) Topic Formulation (Target A*) with Primary Literature Review'
            : 'Structured Subject Inquiry Paper & Academic Extended Essay'
          : isTop5
          ? 'Original Empirical Research Protocol & Manuscript Draft (Targeting arXiv/bioRxiv/IEEE)'
          : isTop10
          ? 'Faculty-Advised Research Protocol & State Science Fair Submission Draft'
          : isTop25
          ? 'Independent Inquiry Capstone Paper & Regional Science Fair Investigation'
          : 'Teacher-Advised Literature Review Paper & Classroom Capstone',
        suggestedAction: isUK
          ? `Formulate a 5,000-word EPQ research thesis exploring a nuanced theoretical controversy in ${targetField}; establish an academic bibliography with university-level texts.`
          : isTop5
          ? `Conduct supervised wet-lab assays, numerical simulations, or econometric regressions; draft full manuscript following peer-reviewed journal format in ${targetField}.`
          : isTop10
          ? `Under lab mentorship, run empirical tests or code simulations; synthesize findings into structured paper draft for state science fair.`
          : isTop25
          ? `Author comprehensive independent research capstone or engineering design report advising teacher or local mentor.`
          : `Complete structured literature survey paper or science inquiry project with formal citations.`,
        impactLevel: isTop5 ? 'High-Impact Spike' : 'Core Differentiator',
        timeCommitment: isTop5 ? '8–10 hrs/week' : '4–5 hrs/week',
        admissionsRationale:
          'Marks the transformation from passive student to independent investigator producing original empirical artifacts.',
      },
      {
        id: 'g10-cert-1',
        category: 'certification',
        title: isUK
          ? isTop5
            ? 'Oxbridge / Russell Group Supercurricular Reading & Theoretical Essay Synthesis'
            : 'Advanced Disciplinary Coursework & Supercurricular Critique'
          : isCanadaOrSingapore
          ? isTop5
            ? 'Waterloo CEMC Advanced Contest Preparation & Algorithmic Problem Solving'
            : 'Applied Computing & Mathematics Specialization'
          : isTop5
          ? `Advanced Quantitative & Disciplinary Proof Specialization (${targetUniversity ? targetUniversity.split(' ')[0] : 'Top University'} / DeepLearning / CSWP)`
          : isTop10
          ? 'AP/IB Higher Level Prerequisite Credentials & Professional Certifications'
          : isTop25
          ? 'Targeted Technical Credential (SolidWorks CSWA, Python Data Science, or AP core)'
          : 'Specialized Technical Certifications',
        suggestedAction: isUK
          ? `Author two 2,000-word critical essays examining core academic disputes in ${targetField}; reference primary scholarly papers from university faculty bibliographies.`
          : isTop5
          ? `Complete advanced university modules in multivariable calculus, linear algebra, or deep learning algorithms with verified certificates in ${targetField}.`
          : isTop10
          ? `Earn professional certificate (e.g. university specialization, SolidWorks CSWP, or Johns Hopkins Genomic Tech) and maintain top 5% exam grades.`
          : `Complete introductory online specialization in ${targetField} to formalize core technical competency.`,
        impactLevel: 'Core Differentiator',
        timeCommitment: '3 hrs/week',
        admissionsRationale:
          'Formalizes advanced technical proficiency that can be directly applied to research codebases and laboratory assays.',
      },
      {
        id: 'g10-lead-2',
        category: 'leadership',
        title: isTop5
          ? isUK
            ? 'Regional Academic Subject Society Federation'
            : 'Regional Multi-School Federation / Scaled Civic Program (500+ users / 5 partner schools)'
          : isTop10
          ? 'Regional Chapter Lead / Major High School Club President'
          : isTop25
          ? 'School Club Officer / Varsity Team Lead'
          : 'Regional Impact Initiative & Domain Spreading',
        suggestedAction: isTop5
          ? `Expand your student initiative or open-source artifact across 3+ partner high schools or 500+ users; host regional academic symposium in ${targetField}.`
          : isTop10
          ? `Lead school organization in ${targetField}; coordinate regional guest speakers and student competition teams.`
          : `Serve as officer in high school club in ${targetField}; organize campus workshops or competition prep sessions.`,
        impactLevel: isTop5 ? 'High-Impact Spike' : 'Core Differentiator',
        timeCommitment: '2–3 hrs/week',
        admissionsRationale:
          'Exhibits organizational maturity and verified scale beyond single school walls.',
      },
    ];

    // --- GRADE 11 ITEMS POOL (THE CORE SPIKE YEAR) ---
    const g11Pool: SupercurricularMilestoneItem[] = [
      {
        id: 'g11-research-1',
        category: 'research',
        title: isUK
          ? isTop5
            ? '5,000-Word Extended Project Qualification (EPQ) Graded A* & John Locke / Trinity Essay Global Distinction'
            : isTop10
            ? 'EPQ Dissertation Completion (Target Grade A) & Academic Journal Submission'
            : 'Independent Subject Inquiry Paper & School Research Presentation'
          : isCanada
          ? isTop5
            ? 'Working Production Software / Hardware Artifact & Applied Engineering Publication'
            : 'Hands-on Engineering Prototype & Technical Capstone Repository'
          : isSingapore || isSwitzerland
          ? isTop5
            ? 'A*STAR Institute Research Paper / Published Theoretical Investigation'
            : 'Faculty-Supervised Science Paper & Laboratory Assay Report'
          : isTop5
          ? 'First-Author Preprint on arXiv / bioRxiv / SSRN & Regeneron ISEF Grand Award Finalist'
          : isTop10
          ? 'Structured University Co-Authored Paper & State Science Fair Grand Prize'
          : isTop25
          ? 'Independent Inquiry Capstone Paper & Regional Science Fair Distinction'
          : 'Documented Senior Capstone Project & School Research Colloquium Presentation',
        suggestedAction: isUK
          ? isTop5
            ? `Finalize 5,000-word EPQ with rigorous university-level academic bibliography; submit paper to Cambridge/Oxford essay competitions (John Locke / Trinity) or Young Scientists journal in ${targetField}.`
            : `Finalize EPQ dissertation graded A; present findings at high school academic colloquium in ${targetField}.`
          : isTop5
          ? `Finalize primary-author manuscript with university lab mentor; post preprint to arXiv / bioRxiv / SSRN; compete in Regeneron ISEF regional qualifying fair for Grand Award.`
          : isTop10
          ? `Complete co-authored research paper under faculty PI; submit to state science fair and target regional grand award in ${targetField}.`
          : isTop25
          ? `Author comprehensive independent research capstone in ${targetField}; present at regional high school symposium.`
          : `Complete capstone research investigation with faculty review in ${targetField}.`,
        impactLevel: isTop5 ? 'Critical Anchor' : 'High-Impact Spike',
        timeCommitment: isTop5 ? '12–15 hrs/week in peak season' : '6–8 hrs/week',
        admissionsRationale:
          'A public preprint or premier academic award provides verifiable proof of top 0.1% scholarship.',
      },
      {
        id: 'g11-intern-1',
        category: 'internship',
        title: isUK
          ? isTop5
            ? 'Premier University Summer Research Placement (Russell Group / In2science / Isaac Physics / Sutton Trust)'
            : 'Russell Group Department Summer Research Fellowship'
          : isCanada
          ? isTop5
            ? 'University of Waterloo / UofT Research Fellowship or Startup Engineering Placement'
            : 'Regional Tech Apprenticeship or Software Engineering Internship'
          : isSingapore
          ? isTop5
            ? 'A*STAR Research Institute Science Award Attachment'
            : 'National Laboratory or Industry Research Internship'
          : isSwitzerland
          ? isTop5
            ? 'ETH Zurich / EPFL Summer Research Fellowship'
            : 'European Laboratory Research Apprenticeship'
          : isTop5
          ? `Premier Merit Summer Program (RSI, Summer Science Program, PROMYS, Ross, Simons, or Selective University Lab Fellowship)`
          : isTop10
          ? 'University Research Lab Fellowship or Engineering Firm Apprenticeship'
          : isTop25
          ? 'University Pre-College Summer Academy or Industry Apprenticeship'
          : 'Regional Summer Enrichment Course or Community Service Fellowship',
        suggestedAction: isUK
          ? `Complete competitive residential or virtual academic research program with Russell Group faculty in ${targetField}.`
          : isCanada
          ? `Secure summer tech fellowship or co-op developer role; contribute production code to real-world repositories.`
          : isSingapore
          ? `Apply for A*STAR junior science attachment or university research mentorship in ${targetField}.`
          : isTop5
          ? `Apply to tuition-free, merit-only summer programs: RSI, SSP, Simons Summer Research, PROMYS, or selective faculty laboratory fellowships in ${targetField}.`
          : isTop10
          ? `Participate in university lab research program or tech startup software fellowship in ${targetField}.`
          : isTop25
          ? `Attend university pre-college enrichment program or complete 50+ hours in professional internship.`
          : `Attend regional summer enrichment course or complete structured shadowing in ${targetField}.`,
        impactLevel: isTop5 ? 'High-Impact Spike' : 'Core Differentiator',
        timeCommitment: 'Full-time 4–6 weeks in summer',
        admissionsRationale:
          'Admission into selective summer research programs signals elite pre-selection to admissions committees.',
      },
      {
        id: 'g11-test-1',
        category: 'certification',
        title: isUK
          ? isTop5
            ? 'Admissions Assessment Apex (TMUA 7.0+, ESAT, Oxford PAT/MAT, STEP 1/2, UCAT 3100+ Band 1)'
            : isTop10
            ? 'Admissions Tests (TMUA 6.5+, UCAT 2950+, STEP 2)'
            : 'Admissions Assessment Preparation & UCAS Prerequisite Study'
          : isCanada
          ? isTop5
            ? 'Grade 11/12 Average: 97%+ with Waterloo Euclid Contest Honor Roll'
            : 'Top 6 Grade 12 Average: 94%+ with Strong Contest Consistency'
          : isSingapore
          ? isTop5
            ? 'Straight As in A-Levels (90 RP) with H3 Distinction or IB 44+'
            : 'Top Percentile Indicative Grade Profile (IGP) Clearance'
          : isSwitzerland
          ? isTop5
            ? 'ETH Zurich / EPFL Entrance Exam Preparation (Differential Equations & Vector Mechanics)'
            : 'Prerequisite Matura Mathematics & Physics Examination Mastery'
          : isAustralia
          ? isTop5
            ? 'ATAR 99.00+ / IB 42+ Projection with UCAT ANZ 90th+ percentile'
            : 'Direct ATAR Cutoff Clearance (95.00+)'
          : isTop5
          ? 'Standardized Testing Apex (SAT 1550–1600 / ACT 35–36 & 5–7 AP 5s / IB 43+)'
          : isTop10
          ? 'SAT: 1520–1580 / ACT: 34–36 with 4–5 AP 5s'
          : isTop25
          ? 'SAT: 1480–1550 / ACT: 33–35 with 3–4 AP/IB courses (consistent upward trend)'
          : 'SAT: 1380–1480 / ACT: 30–33 with solid core GPA',
        suggestedAction: isUK
          ? `Intensive timed drilling on past university entrance assessments: TMUA (Cambridge/LSE), ESAT (Imperial/Cambridge), STEP, UCAT, or LNAT.`
          : isTop5
          ? `Lock in SAT 1550+ (or ACT 35+) and sit for 5+ AP / IB Higher Level exams in core discipline, targeting scores of 5 / 7.`
          : isTop10
          ? `Attain SAT 1520+ (or ACT 34+) and complete 4 AP/IB courses with consistent top grades.`
          : isTop25
          ? `Attain SAT 1480+ (or ACT 33+) with strong transcript GPA trajectory.`
          : `Achieve target standardized test score and maintain unweighted GPA consistency.`,
        impactLevel: 'Critical Anchor',
        timeCommitment: '6–8 hrs/week during testing cycles',
        admissionsRationale:
          'Satisfies the non-negotiable academic baseline, removing any testing doubts from the admissions committee.',
      },
      {
        id: 'g11-lead-1',
        category: 'leadership',
        title: isUK
          ? isTop5
            ? 'Head of Academic Subject Society, Academic Journal Chief Editor, or Peer Tutorial Lead'
            : 'President of High School Subject Society & Debate Team Captain'
          : isTop5
          ? 'Founder & Executive Director of Scaled 501(c)(3) or Civic Venture (1,000+ stakeholders, verified impact)'
          : isTop10
          ? 'President of Major School Organization & Regional Initiative Director (250+ participants)'
          : isTop25
          ? 'Officer in 2+ High School Clubs & Regional Community Project Lead'
          : 'Active High School Club Officer & Community Volunteer',
        suggestedAction: isUK
          ? `Serve as Head of Academic Society; mentor 20+ younger students through subject competitions and university reading groups in ${targetField}.`
          : isTop5
          ? `Scale a verifiable initiative: an open-source library with 200+ GitHub stars, an active 501(c)(3) with $10k+ raised, or 1,000+ active users on a deployed application.`
          : isTop10
          ? `Direct major school organization in ${targetField}; lead regional event or community initiative reaching 250+ individuals.`
          : isTop25
          ? `Lead school club or project team; organize regional workshops or community drives.`
          : `Contribute meaningfully to high school organizations and community projects.`,
        impactLevel: isTop5 ? 'High-Impact Spike' : 'Core Differentiator',
        timeCommitment: '3–5 hrs/week',
        admissionsRationale: isUK
          ? 'Shows genuine academic mentorship and leadership centered on subject mastery rather than generic resume-padding.'
          : 'Proves leadership that generates tangible external artifacts rather than nominal club titles.',
      },
      {
        id: 'g11-comp-2',
        category: 'competition',
        title: isUK
          ? isTop5
            ? 'Senior BPhO Gold, UKMT BMO2 Qualifier, or Cambridge Chemistry Roentgenium'
            : 'UKMT Senior Gold / Kangaroo Distinction / BPhO Challenge Silver'
          : isTop5
          ? 'USAMO Qualifier / USACO Platinum / USABO Semifinalist Medalist / ISEF International Finalist'
          : isTop10
          ? 'AIME Qualifier / USACO Gold / State Science Olympiad Gold / UKMT Senior Gold'
          : isTop25
          ? 'State Science Olympiad Medalist / USACO Silver / Regional Hackathon 1st Place'
          : 'Regional STEM Contest Competitor / High School Science Team Lead',
        suggestedAction: isTop5
          ? `Achieve National Round or Semifinalist qualification in primary subject Olympiad (USAMO, USACO Platinum, USABO, USAPhO, or Regeneron ISEF).`
          : isTop10
          ? `Qualify for state/national round in primary academic contest; earn gold/silver honors.`
          : `Earn medal or top placement in regional STEM, business, or debate competition.`,
        impactLevel: isTop5 ? 'Critical Anchor' : 'Core Differentiator',
        timeCommitment: '4–6 hrs/week',
        admissionsRationale:
          'High-level contest honors validate the candidate as among the top tier nationwide in their field.',
      },
    ];

    // --- GRADE 12 ITEMS POOL (CULMINATION & APPLICATIONS) ---
    const g12Pool: SupercurricularMilestoneItem[] = [
      {
        id: 'g12-award-1',
        category: 'award',
        title: isUK
          ? isTop5
            ? 'Oxbridge / Imperial Technical Tutorial Interview Mastery (Live Whiteboard Problem Solving & Unseen Logic Defense)'
            : 'Admissions Interview Preparation & Russell Group Prerequisite Defense'
          : isTop5
          ? 'Regeneron STS Scholar / Finalist or National Merit Finalist'
          : isTop10
          ? 'State Science Fair Grand Champion / National Merit Commended'
          : isTop25
          ? 'Senior Capstone Defense & Regional STEM Showcase'
          : 'High School Academic Showcase Presentation & Honors',
        suggestedAction: isUK
          ? `Practice answering unseen, open-ended tutorial problems aloud on a whiteboard under mock-interview conditions with teachers or advisors in ${targetField}.`
          : isTop5
          ? `Submit completed research thesis to Regeneron Science Talent Search (STS); report state/national competition results on Common App.`
          : isTop10
          ? `Submit research paper to state science contests; finalize honors list for university applications.`
          : `Present senior capstone project and document honors for application profile.`,
        impactLevel: isTop5 ? 'Critical Anchor' : 'High-Impact Spike',
        timeCommitment: '4–6 hrs/week during application cycle',
        admissionsRationale: isUK
          ? 'Oxford and Cambridge tutors base final admissions decisions on tutorial dialogue stamina, teachability, and problem solving under questioning.'
          : 'Provides final proof of intellectual stamina and readiness to defend original research.',
      },
      {
        id: 'g12-project-1',
        category: 'research',
        title: isUK
          ? isTop5
            ? 'UCAS Personal Statement Supercurricular Synthesis (80%+ Scholarly Literature & EPQ Inquiry Analysis)'
            : 'UCAS Personal Statement Academic Focus (Course Prerequisites & Reading)'
          : isCanada
          ? 'Waterloo AIF Engineering / CS Builder Showcase with GitHub Repositories'
          : isTop5
          ? 'SlideRoom Maker Portfolio & Deployed Open-Source Artifact (Verifiable Public Impact)'
          : isTop10
          ? 'Focused Personal Statement Spike & Portfolio Artifact Repository'
          : isTop25
          ? 'Structured Common App Essay & Capstone Project Repository'
          : 'Personal Narrative Essay & Project Portfolio Summary',
        suggestedAction: isUK
          ? `Draft personal statement dedicating 80%+ of text to scholarly questions explored, primary literature analyzed, and EPQ findings in ${targetField}.`
          : isCanada
          ? `Detail your practical coding, robotic, or design projects in the Waterloo AIF or UofT engineering profile.`
          : isTop5
          ? `Build clean SlideRoom research abstract or open-source repository showcase directly hyperlinked from application.`
          : `Synthesize 4-year project journey in Common App activities list and supplemental essays.`,
        impactLevel: isTop5 ? 'High-Impact Spike' : 'Core Differentiator',
        timeCommitment: '3–4 hrs/week',
        admissionsRationale:
          'Directly presents tangible artifacts and published scholarship to faculty admissions evaluators.',
      },
      {
        id: 'g12-lead-1',
        category: 'leadership',
        title: isTop5
          ? 'Faculty & Research PI Briefing Dossier (Highlighting Breakthroughs & Unseen Logic)'
          : isTop10
          ? 'Counselor & Teacher Academic Briefing Pack'
          : isTop25
          ? 'Teacher Recommendation Summary & Activity Resume'
          : 'Teacher Recommendation Requests & High School Resume',
        suggestedAction:
          `Prepare a detailed 2-page briefing document for your teachers and research PI highlighting your specific breakthroughs and academic growth in ${targetField}.`,
        impactLevel: 'Critical Anchor',
        timeCommitment: '2 hrs/week',
        admissionsRationale:
          'Top recommendation letters quote specific domain breakthroughs and intellectual hurdles overcome directly from your briefing dossier.',
      },
      {
        id: 'g12-award-2',
        category: 'award',
        title: isUK
          ? isTop5
            ? 'Final Academic Reading Synthesis & Term Paper Submission'
            : 'Subject Reading Journal Synthesis & Essay Submission'
          : isTop5
          ? 'Senior Capstone Monograph Defense & Public Artifact Dissemination'
          : isTop10
          ? 'School & Regional Symposium Presentation'
          : isTop25
          ? 'High School Capstone Exhibition'
          : 'Departmental Graduation Showcase',
        suggestedAction:
          `Present final research or engineering portfolio defense before academic committee or regional industry mentors in ${targetField}.`,
        impactLevel: 'Core Differentiator',
        timeCommitment: '2 hrs/week',
        admissionsRationale:
          'Caps 4-year intellectual narrative with coherent capstone achievement.',
      },
    ];

    // Slice pools based on targetRankTier
    let g9Slice: SupercurricularMilestoneItem[] = [];
    let g10Slice: SupercurricularMilestoneItem[] = [];
    let g11Slice: SupercurricularMilestoneItem[] = [];
    let g12Slice: SupercurricularMilestoneItem[] = [];

    switch (targetRankTier) {
      case 'Top 5':
        // 4 + 5 + 5 + 4 = 18 milestones
        g9Slice = g9Pool.slice(0, 4);
        g10Slice = g10Pool.slice(0, 5);
        g11Slice = g11Pool.slice(0, 5);
        g12Slice = g12Pool.slice(0, 4);
        break;

      case 'Top 10':
        // 4 + 4 + 4 + 3 = 15 milestones
        g9Slice = g9Pool.slice(0, 4);
        g10Slice = g10Pool.slice(0, 4);
        g11Slice = g11Pool.slice(0, 4);
        g12Slice = g12Pool.slice(0, 3);
        break;

      case 'Top 25':
        // 3 + 3 + 3 + 3 = 12 milestones
        g9Slice = [g9Pool[0], g9Pool[1], g9Pool[3]]; // cert, comp, lead
        g10Slice = [g10Pool[0], g10Pool[1], g10Pool[2]]; // comp, intern, research
        g11Slice = [g11Pool[0], g11Pool[2], g11Pool[3]]; // research, test, lead
        g12Slice = [g12Pool[0], g12Pool[1], g12Pool[2]]; // award, project, lead
        break;

      case 'Top 50':
        // 2 + 3 + 3 + 2 = 10 milestones
        g9Slice = [g9Pool[0], g9Pool[1]]; // cert, comp
        g10Slice = [g10Pool[0], g10Pool[2], g10Pool[3]]; // comp, research, cert
        g11Slice = [g11Pool[0], g11Pool[2], g11Pool[3]]; // research, test, lead
        g12Slice = [g12Pool[1], g12Pool[2]]; // project, lead
        break;

      case 'Top 100':
      default:
        // 2 + 2 + 2 + 2 = 8 milestones
        g9Slice = [g9Pool[0], g9Pool[1]]; // cert, comp
        g10Slice = [g10Pool[0], g10Pool[3]]; // comp, cert
        g11Slice = [g11Pool[0], g11Pool[2]]; // research, test
        g12Slice = [g12Pool[1], g12Pool[2]]; // project, lead
        break;
    }

    return [
      {
        milestoneNumber: 1,
        grade: 'Grade 9',
        phaseTitle: isTop5
          ? 'Foundation & Curiosity Discovery (Pinnacle Tier Standard)'
          : isTop10
          ? 'Foundation & Core Rigor Discovery'
          : 'Foundation & Curiosity Discovery',
        objective: `Establish unshakeable academic baseline, build foundational ${
          isPreMed ? 'biomedical & laboratory' : isEcon ? 'quantitative & economic' : isEngineering ? 'CAD & mechanical' : isLaw ? 'analytical & oratorical' : isPhysicsMath ? 'theoretical math & physics' : 'technical & algorithmic'
        } tools, and explore genuine areas of intellectual curiosity in ${targetField} tailored for ${targetCountry}.`,
        items: g9Slice,
      },
      {
        milestoneNumber: 2,
        grade: 'Grade 10',
        phaseTitle: isTop5
          ? 'Specialization & First Scholarly Artifact (National Calibration)'
          : isTop10
          ? 'Specialization & Regional Distinction'
          : 'Specialization & Inquiry Capstone',
        objective:
          `Narrow down to primary academic spike in ${targetField}, compete in ${isTop5 ? 'national' : 'regional'} contests, and draft independent inquiry paper.`,
        items: g10Slice,
      },
      {
        milestoneNumber: 3,
        grade: 'Grade 11',
        phaseTitle: isTop5
          ? 'The Pinnacle Spike Year — Preprints & National Honors'
          : isTop10
          ? 'The Spike Year — Advanced Research & State Honors'
          : isTop25
          ? 'The Specialization Year — Capstone Paper & Regional Distinction'
          : 'The Focused Year — Inquiry Project & School Leadership',
        objective:
          isTop5
            ? `Deliver core differentiator: publish/preprint original research in ${targetField}, achieve national/state honors, and demonstrate community impact.`
            : `Consolidate domain portfolio in ${targetField}: complete advanced capstone, clear standardized testing benchmarks, and lead meaningful community initiatives.`,
        items: g11Slice,
      },
      {
        milestoneNumber: 4,
        grade: 'Grade 12',
        phaseTitle: isTop5
          ? 'Culmination, Technical Interview Mastery & Application Synthesis'
          : 'Culmination, Portfolio Showcase & Application Synthesis',
        objective: isUK
          ? `Synthesize 4-year supercurricular journey, master live tutorial interview problem solving in ${targetField}, and complete UCAS personal statement.`
          : `Synthesize 4-year intellectual journey, complete university admissions assessments, and present verifiable scholarship directly to faculty evaluators.`,
        items: g12Slice,
      },
    ];
  }, [targetRankTier, targetUniversity, targetCountry, targetField]);

  // Compute total milestones dynamically
  const totalMilestonesCount = useMemo(() => {
    return phases.reduce((acc, p) => acc + p.items.length, 0);
  }, [phases]);

  // Notify parent if callback provided
  React.useEffect(() => {
    if (onMilestonesChange) {
      onMilestonesChange(totalMilestonesCount, completedItemIds.size);
    }
  }, [totalMilestonesCount, completedItemIds.size, onMilestonesChange]);

  const categories = [
    { id: 'all', label: 'All Activities' },
    { id: 'verified', label: `Verified in Profile (${detectedEvidenceMap.size})` },
    { id: 'pending', label: 'Pending Actions' },
    { id: 'research', label: 'Research & Papers' },
    { id: 'competition', label: 'Competitions & Olympiads' },
    { id: 'internship', label: 'Internships & Labs' },
    { id: 'certification', label: 'Certifications' },
    { id: 'leadership', label: 'Leadership & Scale' },
  ];

  const completionPercentage = totalMilestonesCount > 0 
    ? Math.round((completedItemIds.size / totalMilestonesCount) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider mb-1 flex-wrap">
            <span>Milestone-Wise Supercurricular Sequence</span>
            <span>·</span>
            <span className="font-semibold text-stone-800 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
              {targetCountry}
            </span>
            <span>·</span>
            <span className="font-semibold text-stone-900 bg-stone-100 border border-stone-300 px-2 py-0.5 rounded">
              {targetRankTier} Scaling ({totalMilestonesCount} Milestones)
            </span>
            <span>·</span>
            <span className="font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              {targetField}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Supercurricular Action Blueprint
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
            Phased action items across research, competitions, apprenticeships, and leadership tailored for <strong className="text-stone-900 font-semibold">{targetField}</strong> in <strong className="text-stone-900 font-semibold">{targetCountry}</strong>. Documented achievements from candidate's uploaded dossier are automatically verified and linked to achieved score points.
          </p>
        </div>

        {/* Dynamic Progress summary */}
        <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
          <div className="bg-stone-50 px-3.5 py-2 rounded-lg border border-stone-200 text-xs font-mono text-stone-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-semibold">{completedItemIds.size} of {totalMilestonesCount} Completed</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
              {detectedEvidenceMap.size} Verified in Dossier
            </span>
            {completedItemIds.size > 0 && (
              <button
                type="button"
                onClick={handleResetProgress}
                className="text-[11px] text-stone-400 hover:text-stone-700 underline ml-1 cursor-pointer flex items-center gap-0.5"
                title="Reset completed checkmarks"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
          {/* Progress bar */}
          <div className="w-full sm:w-48 bg-stone-100 h-1.5 rounded-full overflow-hidden border border-stone-200">
            <div 
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills (Clean Segmented Tabs) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-stone-900 text-stone-100 border-stone-900 font-semibold'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Milestones Phases */}
      <div className="space-y-6">
        {phases.map((phase) => {
          const isCurrentPhase = currentGrade === phase.grade;
          const filteredItems = phase.items.filter((item) => {
            if (selectedCategory === 'verified') return detectedEvidenceMap.has(item.id);
            if (selectedCategory === 'pending') return !completedItemIds.has(item.id);
            return selectedCategory === 'all' || item.category === selectedCategory;
          });

          if (filteredItems.length === 0) return null;

          return (
            <div
              key={phase.milestoneNumber}
              className={`rounded-xl border transition-all ${
                isCurrentPhase
                  ? 'bg-stone-50/70 border-stone-300 ring-1 ring-stone-300'
                  : 'bg-white border-stone-200'
              }`}
            >
              {/* Phase Header */}
              <div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                      isCurrentPhase
                        ? 'bg-stone-900 text-stone-100'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    M{phase.milestoneNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-stone-900 text-base">
                        {phase.phaseTitle}
                      </h4>
                      <span className="text-xs font-mono text-stone-500">
                        ({phase.grade}{isCurrentPhase ? ' · Current Year' : ''})
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                      {phase.objective}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 shrink-0">
                  {filteredItems.length} {filteredItems.length === 1 ? 'Milestone' : 'Milestones'}
                </div>
              </div>

              {/* Items List */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item) => {
                  const isDone = completedItemIds.has(item.id);
                  const evidence = detectedEvidenceMap.get(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`rounded-lg p-4 border transition-all flex flex-col justify-between ${
                        isDone
                          ? 'bg-stone-50/90 border-stone-200'
                          : 'bg-white border-stone-200/90 hover:border-stone-400 shadow-2xs'
                      }`}
                    >
                      <div>
                        {/* Top Metadata */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 uppercase tracking-wider flex-wrap">
                            <span>{item.category}</span>
                            <span>·</span>
                            <span className="font-semibold text-stone-800">{item.impactLevel}</span>
                            {evidence && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Verified in Dossier
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleItem(item.id)}
                            className="text-stone-400 hover:text-stone-900 transition-colors cursor-pointer shrink-0"
                            title={isDone ? 'Mark as pending' : 'Mark as completed'}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Title & Suggested Action */}
                        <h5
                          className={`text-sm font-semibold text-stone-900 mb-1 ${
                            isDone ? 'text-stone-800' : ''
                          }`}
                        >
                          {item.title}
                        </h5>
                        <p className="text-xs text-stone-600 leading-relaxed mb-2">
                          {item.suggestedAction}
                        </p>

                        {/* Visual Evidence Link back to completed activities */}
                        {evidence && isDone && (
                          <div className="my-2.5 p-2.5 rounded-lg bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                            <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-emerald-800">
                              <span className="flex items-center gap-1.5">
                                <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Documented Profile Evidence:</span>
                              </span>
                              <span className="font-mono text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-bold">
                                +{evidence.pointsBoost} pts earned
                              </span>
                            </div>
                            <p className="font-mono text-[10px] text-emerald-900 bg-white/80 p-1.5 rounded border border-emerald-200/60 leading-snug">
                              "{evidence.evidenceSnippet}"
                            </p>
                            <div className="text-[10px] text-emerald-700 flex items-center justify-between pt-0.5">
                              <span>Credited to: <strong className="capitalize">{evidence.dimension}</strong></span>
                              <span className="font-semibold text-emerald-800">Active in Candidate Score</span>
                            </div>
                          </div>
                        )}

                        {!evidence && isDone && (
                          <div className="my-2 p-2 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 text-[11px] flex items-center justify-between">
                            <span className="font-medium text-stone-800">✓ Manually checked off as completed</span>
                            <span className="font-mono text-[10px] text-emerald-800 font-semibold">+8 pts to profile</span>
                          </div>
                        )}
                      </div>

                      {/* Footer Note: Admissions Rationale & Time */}
                      <div className="pt-2.5 border-t border-stone-100 space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-500">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>Commitment: {item.timeCommitment}</span>
                        </div>

                        <div className="p-2 rounded bg-stone-50/80 border border-stone-200 text-[11px] text-stone-700 leading-snug">
                          <strong className="text-stone-900 font-semibold">• Rationale: </strong>
                          {item.admissionsRationale}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
