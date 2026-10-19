import { AspiringStudentBaseline, GradeLevel, RankTier } from '../types';

export interface CountryDimensionalExpectation {
  dimension: 'problemSolving' | 'technicalSkills' | 'criticalThinking' | 'teamWork' | 'communication' | 'creativity';
  label: string;
  weightTier: 'Critical Mandatory' | 'Core Evaluated' | 'Secondary Factor' | 'Negligible / Unweighted';
  weightPercentage: number;
  targetScore: number; // 0-100 score required for top tiers in this country
  countrySpecificNeed: string;
  tacticalRemedyGuidance: string;
}

export interface CountryAdmissionsPillar {
  title: string;
  category: 'academics' | 'testing' | 'research' | 'competitions' | 'leadership' | 'essays_interviews';
  systemRequirement: string;
  weighting: string;
  admissionsOfficerQuote: string;
  evaluationCriteria: string[];
}

export interface CountryCompetencyProfile {
  countryId: string;
  countryName: string;
  flag: string;
  systemName: string;
  tagline: string;
  overview: string;
  primarySelectionMechanism: string;
  fatalMistake: string;
  winningStrategy: string;
  weights: {
    academics: number; // e.g. 75
    testingAndExams: number; // e.g. 20
    supercurricularsAndProjects: number; // e.g. 40
    extracurricularsAndLeadership: number; // e.g. 5
  };
  dimensionalExpectations: Record<string, CountryDimensionalExpectation>;
  pillars: CountryAdmissionsPillar[];
}

export interface DiagnosticMemoData {
  academicBar: string;
  testingBar: string;
  supercurriculars: {
    research: string;
    competitions: string;
    internships: string;
    certifications: string;
    leadership: string;
  };
  executiveConclusion: string;
  admissionsPhilosophy: string;
  countryFlag: string;
  systemTitle: string;
}

/**
 * Returns country-specific diagnostic standard memo calibrated for Country, Tier, and Field
 */
export function getCountryDiagnosticMemo(
  country: string,
  tier: RankTier,
  field: string
): DiagnosticMemoData {
  const isTop5 = tier === 'Top 5';
  const isTop10 = tier === 'Top 10' || isTop5;
  const isTop25 = tier === 'Top 25';
  const isTop50 = tier === 'Top 50';

  const f = (field || '').toLowerCase();
  const isCS = f.includes('cs') || f.includes('computer') || f.includes('software');
  const isEngineering = !isCS && (f.includes('engineer') || f.includes('robot') || f.includes('aerospace'));
  const isPreMed = f.includes('pre-med') || f.includes('med') || f.includes('bio') || f.includes('health');
  const isEcon = f.includes('econ') || f.includes('finance') || f.includes('business') || f.includes('quant');
  const isLaw = f.includes('law') || f.includes('policy') || f.includes('relation') || f.includes('gov') || f.includes('history') || f.includes('humanit');
  const isPhysicsMath = f.includes('phys') || f.includes('math');

  const normalizedCountry = country.toLowerCase();

  // 1. UNITED KINGDOM (UCAS & Supercurricular Focus)
  if (normalizedCountry.includes('kingdom') || normalizedCountry === 'uk') {
    return {
      countryFlag: '🇬🇧',
      systemTitle: 'United Kingdom (UCAS Supercurricular & Single-Subject Mastery)',
      admissionsPhilosophy:
        'UK admissions tutors evaluate candidates exclusively on academic aptitude and course-specific intellectual potential. Extracurriculars unrelated to the degree (sports, generic community service, school clubs) carry zero weight.',
      academicBar: isTop5
        ? 'A*A*A* at A-Level (with A* in subject prerequisites like Further Maths/Physics/Chemistry) or IB Diploma 42–44 points (7,7,7 at Higher Level)'
        : isTop10
        ? 'A*A*A to A*AA at A-Level or IB Diploma 39–41 points with 7,6,6 at Higher Level in core discipline subjects'
        : isTop25
        ? 'AAA at A-Level or IB Diploma 36–38 points (6,6,6 Higher Level)'
        : 'AAB to ABB at A-Level or IB Diploma 34–36 points',
      testingBar: isTop5
        ? isCS || isPhysicsMath
          ? 'Cambridge TMUA / STEP (STEP 2 & 3 Grades 1,1) or Oxford MAT score 75+ (Top 10th percentile)'
          : isEngineering
          ? 'Cambridge ESAT (Engineering and Science Admissions Test) or Oxford PAT score 70+'
          : isPreMed
          ? 'UCAT score 3050+ (Band 1 Situational Judgement) or BMAT replacement assessments'
          : isLaw
          ? 'LNAT (National Admissions Test for Law) score 28+ with top 5% analytical essay'
          : 'Top 5th percentile on subject-specific entrance exams (TMUA/ESAT/MAT/LNAT)'
        : isTop10
        ? 'Strong performance on university admissions test (TMUA/ESAT/UCAT/LNAT) clearing initial interview threshold'
        : 'Admissions assessments where required by specific Russell Group programs',
      supercurriculars: {
        research: isTop5
          ? `Extended Essay (Grade A) or EPQ (Extended Project Qualification, A*) directly dissecting university-level topics in ${field}; reading 5+ seminal scholarly texts beyond school syllabus`
          : 'Documented independent study, analytical literature review, or EPQ graded A/A* in chosen subject area',
        competitions: isPreMed
          ? isTop5
            ? 'British Biology Olympiad (BBO) Gold Medal, Royal Society of Chemistry Olympiad Gold, or Cambridge Chemistry Challenge (C3L6) Roentgenium award'
            : 'UK Biology Olympiad Silver/Bronze or regional science challenge commendation'
          : isEcon
          ? isTop5
            ? 'Royal Economic Society Young Economist of the Year finalist, Marshall Society Essay Competition distinction, or John Locke Economics distinction'
            : 'RES Young Economist entrant or Bank of England Target Two Point Zero challenge'
          : isEngineering || isPhysicsMath
          ? isTop5
            ? 'British Physics Olympiad (BPhO) Senior Gold / Round 1 Top 100, British Mathematical Olympiad (BMO1/BMO2), or UKMT Senior Maths Challenge Gold'
            : 'BPhO Senior Physics Challenge Silver or UKMT Senior Maths Challenge Silver/Gold'
          : isLaw
          ? isTop5
            ? 'John Locke Global Essay Prize distinction, Cambridge Law Journal essay prize, or national analytical mooting distinction'
            : 'School debate captain or national essay competition submission'
          : isTop5
          ? 'British Informatics Olympiad (BIO) finalist / Round 1 distinction, BMO1 qualification, or UKMT Senior Gold'
          : 'UKMT Senior Maths Challenge Silver/Gold or British Informatics Olympiad Round 1 entrant',
        internships: isTop5
          ? 'Academic department masterclasses (Cambridge Subject Masterclasses, Oxford UNIQ, Imperial Sutton Trust) or direct university laboratory shadowing. (Corporate office internships carry negligible weight).'
          : 'University taster days, open lecture attendance, or structured subject-relevant workplace observation',
        certifications:
          'University-level MOOCs (e.g. Oxford/MITx), STEP mathematics preparation modules, or advanced theoretical coursework directly aligned with syllabus',
        leadership:
          'NEAR-ZERO WEIGHT: UK universities explicitly disregard sports captaincies, school prefect roles, and non-subject charity. Tutors only value peer academic mentoring or leading the school STEM/Law journal.',
      },
      executiveConclusion: isTop5
        ? `Oxford, Cambridge, and Imperial admissions rely on objective subject metrics: perfect predicted grades, high percentiles on admissions tests (STEP/TMUA/ESAT), and the ability to solve unseen university-level problems out loud in academic interviews. Do not pad the UCAS statement with generic extracurriculars.`
        : `UK Russell Group institutions look for rock-solid predicted grades meeting or exceeding published conditional offers, coupled with an 80%+ academic UCAS statement proving intense intellectual engagement with ${field}.`,
    };
  }

  // 2. CANADA (Academic Rigor & Co-op Builders)
  if (normalizedCountry.includes('canada')) {
    return {
      countryFlag: '🇨🇦',
      systemTitle: 'Canada (High Provincial Averages, Waterloo AIF & Co-op Readiness)',
      admissionsPhilosophy:
        'Canadian flagships (Waterloo, Toronto, UBC, McGill) prioritize high cumulative Grade 11/12 academic averages (94–98%), rigorous math contest validation (Euclid/CCC), and practical technical execution evaluated via Supplemental Applications (AIF).',
      academicBar: isTop5
        ? 'High School Grade 11 & 12 average of 95%–98%+ across required prerequisite courses (Calculus, Advanced Functions, Physics, Chemistry, English)'
        : isTop10
        ? 'Grade 12 top 6 average of 92%–95%+ with no prerequisite course below 90%'
        : 'Grade 12 top 6 average of 88%–92% in college preparatory stream',
      testingBar: isTop5
        ? isCS || isEngineering || isPhysicsMath
          ? 'CEMC Waterloo Euclid Mathematics Contest (Score 75+ / Certificate of Distinction) and Canadian Computing Competition (CCC Senior Honor Roll)'
          : 'CEMC Euclid Contest participation or high AP scores (5s in Calculus and Chemistry/Biology)'
        : isTop10
        ? 'CEMC Euclid Contest participation (Waterloo strongly factors contest scores into scholarship and engineering admission)'
        : 'SAT/ACT optional; standardized high school transcript grade conversion',
      supercurriculars: {
        research:
          'Practical, applied laboratory capstone or engineering design project with tangible code or hardware output; documented in Waterloo Admission Information Form (AIF)',
        competitions: isCS || isEngineering || isPhysicsMath
          ? isTop5
            ? 'Waterloo Euclid Contest distinction (Top 25% internationally), Canadian Senior Mathematics Contest (CSMC), or Canadian Computing Competition (CCC Senior 40+)'
            : 'Euclid Contest participation, CSMC certificate, or Canadian Intermediate Mathematics Contest distinction'
          : isPreMed
          ? 'Canadian Biology Olympiad (CBO) national round or University of Toronto National Biology Competition honors'
          : 'National DECA Canada Provincial Champion or FBLA National Finalist',
        internships: isTop5
          ? 'Technical internship, junior software engineering role, or practical hands-on apprenticeship demonstrating readiness for immediate co-op placement'
          : 'Local company workplace experience, technical maker projects, or part-time employment demonstrating work ethic',
        certifications:
          'CS50x, AWS Certified Cloud Practitioner, SolidWorks CAD certification, or university dual-enrollment calculus credits',
        leadership:
          'High weight in Supplemental Applications: Captain of FIRST Robotics team, hackathon lead organizer, or founding a high school engineering design club with measurable impact.',
      },
      executiveConclusion: isTop5
        ? `Waterloo Computer Science/Engineering and UofT Engineering require a 96%+ grade average paired with top scores on the Euclid Math / CCC contests. In addition, the video interview and Waterloo AIF must demonstrate practical hands-on project creation and collaborative team readiness.`
        : `Canadian university admission is heavily formulaic based on prerequisite top-6 averages, with supplemental evaluations (AIF/Broad-Based Admission) breaking ties for competitive programs like Sauder Business, Rotman Commerce, or McGill Science.`,
    };
  }

  // 3. SINGAPORE (Meritocratic & Percentile Cutoffs)
  if (normalizedCountry.includes('singapore')) {
    return {
      countryFlag: '🇸🇬',
      systemTitle: 'Singapore (Strict Indicative Grade Profiles & Olympiad Pipelines)',
      admissionsPhilosophy:
        'NUS and NTU admissions are intensely meritocratic. Standard direct-entry admission requires meeting strict published Indicative Grade Profile (IGP) cutoffs. Aptitude-Based Admissions (ABA) considers national research (A*STAR) or International Olympiad honors.',
      academicBar: isTop5
        ? 'Straight 90 Rank Points in Singapore-Cambridge A-Levels (4 H2 As + H1 GP/PW), IB Diploma 43–45 points, or 4–5 AP exams with score 5 (including Calculus BC and Physics C)'
        : isTop10
        ? '87.5–90 Rank Points in A-Levels, IB Diploma 41–43 points, or 3–4 AP exams scored 5'
        : '82.5–87.5 Rank Points, IB Diploma 38–40 points',
      testingBar: isTop5
        ? 'SAT: 1540–1580+ (Math 790+) or ACT 35+, plus SAT Subject/AP exams; or direct International Olympiad medal'
        : 'SAT: 1500–1540 or ACT 33–35 with strong high school percentile standing',
      supercurriculars: {
        research:
          'A*STAR (Agency for Science, Technology and Research) Young Researchers Programme, SSEF (Singapore Science & Engineering Fair) medal, or university lab attachment (NUS/NTU faculty)',
        competitions:
          'Singapore Mathematical Olympiad (SMO Open/Senior Gold), National Olympiad in Informatics (NOI Gold/Silver), Singapore Physics Olympiad (SPhO), or Singapore Biology Olympiad',
        internships:
          'DSO National Laboratories attachment, DSTA (Defence Science and Technology Agency) scholarship fellow, or structured government science institute attachment',
        certifications:
          'Advanced algorithms and data structures certification, bioinformatics pipelines, or specialized university math modules',
        leadership:
          'Evaluated under Aptitude-Based Admissions (ABA): Uniformed Groups (NCC/NPCC) staff sergeant, Student Council executive, or Community Involvement Programme (CIP) leadership.',
      },
      executiveConclusion:
        'NUS and NTU adhere strictly to top-percentile academic cutoffs. If your transcript falls below the published 10th percentile IGP for your course (e.g. Computer Science or Medicine), even stellar extracurriculars will rarely grant admission unless backed by an International Olympiad medal.',
    };
  }

  // 4. SWITZERLAND & EUROPE (Entrance Exams & Prerequisite Mastery)
  if (normalizedCountry.includes('switzer') || normalizedCountry.includes('europe') || normalizedCountry.includes('germany')) {
    return {
      countryFlag: '🇨🇭',
      systemTitle: 'Switzerland & Europe (Entrance Exams & Prerequisite Proof Mastery)',
      admissionsPhilosophy:
        'European world-class institutions (ETH Zurich, EPFL, TUM, TU Delft) do not practice holistic admissions. Candidates must either hold a recognized national secondary diploma (Swiss Matura, German Abitur 1.0) or pass comprehensive written entrance examinations in math and science.',
      academicBar: isTop5
        ? 'Swiss Matura, German Abitur (1.0–1.2), or high-school diploma with university-level calculus, mechanics, electromagnetism, and chemistry (A*A*A* / IB 42+ with Math AA HL 7 and Physics HL 7)'
        : 'German Abitur (1.2–1.5), French Baccalaureate (16+/20), or IB 38+ with required scientific prerequisites',
      testingBar:
        'ETH Zurich Reduced Entrance Exam (Reduzierte Aufnahmeprüfung) covering Higher Mathematics, Physics, Chemistry, and Biology; or C1 German/French language proficiency certificates (Goethe C1 / DALF C1)',
      supercurriculars: {
        research:
          'Deep theoretical rigor: mastery of axiomatic calculus, proof techniques, and classical mechanics. Formal high school publications are neither expected nor evaluated.',
        competitions:
          'International Science Olympiad medals (IMO, IPhO, IOI, IChO, IBO) frequently grant direct entrance exam exemption or direct admission to ETH Zurich / EPFL',
        internships:
          'Vocational technical apprenticeships (Polymechaniker, Elektroniker) or university laboratory hands-on laboratory internships',
        certifications:
          'Advanced German/French language mastery (CEFR C1 level required for undergraduate bachelor degrees at ETH/EPFL) and advanced calculus credentials',
        leadership:
          'ZERO WEIGHT: European public universities do not evaluate personality, athletic records, school clubs, or civic volunteering for undergraduate admissions.',
      },
      executiveConclusion:
        'Admission to ETH Zurich or EPFL is strictly binary: either your high-school diploma satisfies the direct recognition criteria and language requirement (C1), or you must sit the demanding multi-day entrance examination in university-level mathematics and physical sciences.',
    };
  }

  // 5. AUSTRALIA (Direct ATAR Cutoffs & Grade Rank Entry)
  if (normalizedCountry.includes('australia') || normalizedCountry.includes('melbourne') || normalizedCountry.includes('sydney')) {
    return {
      countryFlag: '🇦🇺',
      systemTitle: 'Australia (Guaranteed ATAR Rank Thresholds & Prerequisite Cleared)',
      admissionsPhilosophy:
        'Australia’s Group of Eight (Go8) universities (Melbourne, Sydney, UNSW, ANU, Monash) admit undergraduates primarily on a single metric: achieving the published Selection Rank (ATAR) or international equivalent score (IB/SAT), provided course prerequisites are met.',
      academicBar: isTop5
        ? 'Guaranteed selection rank: ATAR 98.00–99.90+ (or IB Diploma 41–44 points, Indian CBSE 96%+, or GCE A-Levels A*A*A)'
        : isTop10
        ? 'ATAR 95.00–97.50+ (or IB Diploma 37–40 points)'
        : 'ATAR 88.00–94.00+ (or IB Diploma 32–36 points)',
      testingBar:
        'English Language Proficiency: IELTS Academic overall 7.0–7.5 (no sub-score below 7.0) or TOEFL iBT 102+. UCAT ANZ required for undergraduate Medicine/Dentistry only.',
      supercurriculars: {
        research:
          'Not required or evaluated for standard bachelor entry. Evaluated only for elite accelerated research degrees (e.g. Bachelor of Philosophy - PhB at ANU)',
        competitions:
          'Australian Mathematics Competition (AMC) Prize/High Distinction or Australian Science Olympiads (ASO) Summer School selection can assist with Chancellor’s scholarship applications',
        internships: 'Not evaluated for standard undergraduate admissions offers',
        certifications:
          'Direct proof of mandatory prerequisite subjects: Specialist Mathematics, Mathematical Methods, Chemistry, or Physics on high school transcripts',
        leadership:
          'Zero weight for general university offers. Extracurricular leadership is only reviewed for prestigious residential college scholarships (e.g. Melbourne Hansen / ANU Tuckwell).',
      },
      executiveConclusion:
        'Australian university entry is direct and transparent: if your converted ATAR or IB score meets the guaranteed published score cutoff and you satisfy subject prerequisites, you will receive an offer. Personal essays and extracurricular portfolios are not requested for standard programs.',
    };
  }

  // 6. UNITED STATES (Default / Standard Holistic Spike Review)
  return {
    countryFlag: '🇺🇸',
    systemTitle: 'United States (Holistic & Angular Spike Admissions)',
    admissionsPhilosophy:
      'Elite US admissions officers look for a distinct "Angular Spike": students who demonstrate national or international excellence in a single domain, backed by verifiable impact, creative initiative, and compelling personal character.',
    academicBar: isTop5
      ? 'Unweighted GPA 3.96+ (Top 1% Class Rank) with 7–9 advanced AP / IB Higher Level courses scored 5s/7s'
      : isTop10
      ? 'Unweighted GPA 3.94+ (Top 2% Class Rank) with 6–8 AP / IB Higher Level courses'
      : isTop25
      ? 'Unweighted GPA 3.90+ with 5–7 AP/IB courses with consistent upward trajectory'
      : isTop50
      ? 'Unweighted GPA 3.85+ with 4–6 rigorous honors or AP/IB coursework'
      : 'Unweighted GPA 3.80+ with solid college preparatory core',
    testingBar: isTop5
      ? 'SAT: 1540–1600 (Math 790+ for STEM, ERW 770+ for Humanities) or ACT: 35–36. Test-mandatory policies restored at MIT, Dartmouth, Yale, UT Austin, Georgetown.'
      : isTop10
      ? 'SAT: 1520–1580 (Math 780+) or ACT: 34–36'
      : isTop25
      ? 'SAT: 1480–1550 or ACT: 33–35'
      : isTop50
      ? 'SAT: 1420–1510 or ACT: 31–34'
      : 'SAT: 1360–1460 or ACT: 29–32',
    supercurriculars: {
      research: isPreMed
        ? isTop5
          ? 'First-author or primary contributor on preprint (bioRxiv/PubMed) or ISEF Grand Award finalist in Cellular/Genomic Biology'
          : 'Structured laboratory paper under university medical faculty or regional ISEF award in Biochemistry'
        : isEcon
        ? isTop5
          ? 'Empirical econometric working paper on SSRN, National Economics Challenge finalist, or Federal Reserve Challenge presentation'
          : 'Quantitative financial research paper under faculty mentorship or state economics award'
        : isEngineering
        ? isTop5
          ? 'First-author paper (IEEE/arXiv), provisional patent application, or ISEF Grand Award in Engineering Mechanics / Robotics'
          : 'Working physical mechanism with CAD stress analyses under university engineering mentorship'
        : isLaw
        ? isTop5
          ? 'Published 6,000-word treatise in The Concord Review, John Locke Global Essay distinction, or municipal policy whitepaper'
          : 'State student journalism award, National History Day state medal, or published civic editorial series'
        : isPhysicsMath
        ? isTop5
          ? 'Theoretical physics/math preprint on arXiv, MIT PRIMES submission, or Regeneron Science Talent Search scholar'
          : 'Computational astrophysics simulation paper or journal problem solution publication'
        : isTop5
        ? 'First-author or primary contributor on preprint (arXiv/IEEE) or ISEF Grand Award finalist in Systems Software'
        : 'Structured research paper under university faculty mentorship or regional ISEF award',
      competitions: isPreMed
        ? isTop5
          ? 'USABO National Semifinalist (Top 10%), HOSA International Gold Medal, or Science Olympiad State Gold'
          : 'USABO Top 20% nationwide score, State HOSA Medical Innovation winner, or Brain Bee finalist'
        : isEcon
        ? isTop5
          ? 'National Economics Challenge Adam Smith National Finals, Wharton Global High School Investment Top 10, or AMC 10/12 AIME qualifier'
          : 'NEC State Finals Champion, Wharton Investment semi-finalist, or regional business case competition gold'
        : isEngineering
        ? isTop5
          ? 'FIRST Robotics Dean’s List Finalist, British Physics Olympiad Senior Gold, or NASA Student Launch finalist'
          : 'BPhO Senior Physics Challenge Silver, FRC Regional Subsystem Lead, or State Science Olympiad medalist'
        : isLaw
        ? isTop5
          ? 'NSDA National Speech & Debate Tournament Qualifier, Model UN Best Delegate Gavels, or John Locke Essay Commendation'
          : 'State Speech & Debate Tournament Finalist or collegiate Model UN outstanding delegate'
        : isPhysicsMath
        ? isTop5
          ? 'USAMO / USAJMO Qualifier, AIME score 8+, or USAPhO Semifinalist Medalist'
          : 'AIME Qualifier via AMC 10/12, USAPhO F=ma top 10% nationwide, or HMMT top 10%'
        : isTop5
        ? 'AIME Qualifier (Score 7+), USACO Gold/Platinum, or international hackathon championship'
        : 'AIME Qualifier, USACO Gold, or State Science Olympiad Gold',
      internships: isPreMed
        ? isTop5
          ? 'Selective medical research institute (Stanford SIMR, Garcia Center, NIH Summer Internship) or hospital clinical trial shadowing'
          : 'University hospital faculty lab apprenticeship or biomedical laboratory research assistant'
        : isEcon
        ? isTop5
          ? 'Wharton Leadership in the Business World (LBW), Bank of America Student Leader, or boutique investment advisory fellow'
          : 'Economic consultancy, wealth management summer apprenticeship, or credit union financial fellow'
        : isEngineering
        ? isTop5
          ? 'MIT Beaver Works Summer Institute, SSP Engineering, or university robotics lab fellow'
          : 'University mechanical engineering lab apprenticeship or hardware startup prototyping fellow'
        : isLaw
        ? isTop5
          ? 'United States Senate Page Program, Telluride Association (TASP), or Congressional district casework fellow'
          : 'State representative office fellowship, public defender clinic assistant, or municipal legal aid volunteer'
        : isPhysicsMath
        ? isTop5
          ? 'Research Science Institute (RSI), PROMYS, Ross Mathematics Program, or university physics department fellow'
          : 'Canada/USA Mathcamp, Boston University PROMYS Europe, or astrophysics observatory research assistant'
        : isTop5
        ? 'Selective merit summer institute (RSI, MIT Beaver Works, SSP, LaunchX) or tech startup software engineer'
        : 'University faculty research apprenticeship or technical startup engineering internship',
      certifications: isPreMed
        ? isTop5
          ? 'Johns Hopkins Genomic Technologies, NIH Bioethics, HIPAA compliance, and CPR/BLS certification'
          : 'Cancer Biology online specialization, Coursera molecular genetics, or basic life support'
        : isEcon
        ? isTop5
          ? 'Wharton Business Foundations, Columbia Financial Engineering, Python for Quant Finance (pandas/yfinance)'
          : 'Microeconomics MOOC certificate or Excel financial modeling credential'
        : isEngineering
        ? isTop5
          ? 'Certified SolidWorks Professional (CSWP), Autodesk Fusion 360 Digital Fabrication, ARM embedded systems'
          : 'Certified SolidWorks Associate (CSWA) or introductory CAD credentials'
        : isLaw
        ? isTop5
          ? 'Harvard Justice (Michael Sandel), Yale Constitutional Law, International Humanitarian Law, or NSDA Premier Distinction'
          : 'Constitutional law MOOC or parliamentary debate distinction'
        : isPhysicsMath
        ? isTop5
          ? 'MITx Multivariable Calculus & Differential Equations, proof techniques, LaTeX publication mastery'
          : 'Calculus and linear algebra online credentials'
        : isTop5
        ? 'CS50x, DeepLearning.AI Specialization, MITx algorithms & data structures'
        : 'CS50x, Python for Data Science, or Coursera university certificate',
      leadership: isTop5
        ? `CRITICAL (40–50% of decision): Founder of scaled community initiative or 501(c)(3) in ${field} with verified 1,000+ participant reach; or state/national officer`
        : isTop10
        ? `President of major school or district organization in ${field} with regional event organization and civic impact`
        : isTop25
        ? 'Officer in 2+ school organizations, varsity athletics captain, or community service initiative leader'
        : 'Active school club officer, team captain, or volunteer coordinator',
    },
    executiveConclusion: isTop5
      ? `Top 5 US admission in ${field} requires an unmistakable "Angular Spike": near-perfect grades and test scores are merely the baseline ticket. True differentiators are verifiable external validation (national Olympiad selection, primary-author research preprint, or scaled community deployment with 1,000+ reach).`
      : isTop10
      ? `Top 10 US institutions seek proven scholastic endurance and high-percentile capability in ${field}. Students must demonstrate tangible independent inquiry outside the standard high school curriculum and clear evidence of institutional contribution.`
      : isTop25
      ? `Top 25 universities look for strong academic consistency, deep involvement in 2–3 meaningful activities in ${field}, and clear evidence of intellectual vitality and institutional contribution.`
      : 'Focus on maintaining strong GPA trajectory, completing advanced coursework, and anchoring the profile with 1–2 structured projects or regional achievements.',
  };
}

/**
 * Country competency profiles detailing the 6 dimensions, weightings, pillars, and cross-country comparisons
 */
export const COUNTRY_COMPETENCY_PROFILES: CountryCompetencyProfile[] = [
  {
    countryId: 'United States',
    countryName: 'United States',
    flag: '🇺🇸',
    systemName: 'Holistic & Angular Spike Admissions',
    tagline: 'Crafting an angular, high-impact community rather than a cohort of well-rounded generalists.',
    overview:
      'US admissions officers evaluate the "whole person" across academics, standardized test scores, intellectual spike, leadership, and personal character. Having high grades and test scores is merely necessary to cross the academic threshold; actual admission is won through distinctive external spikes and compelling personal essays.',
    primarySelectionMechanism:
      'Committee voting evaluating Academic Index threshold (GPA/SAT) followed by holistic rating of Extracurriculars (1-6 scale), Personal Character/Essays (1-6 scale), and Institutional Priorities (diversity, athletic recruits, legacy, geographic reach).',
    fatalMistake:
      'Presenting a "well-rounded" profile with a 4.0 GPA, 1560 SAT, and 10 passive school club memberships with zero deep impact or verifiable public artifact.',
    winningStrategy:
      'Cultivate an unmistakable "Angular Spike" in your target discipline: couple verifiable academic honors (AIME/USAMO/Olympiad) with a flagship external artifact (first-author preprint or community non-profit reaching 1,000+ people).',
    weights: {
      academics: 35,
      testingAndExams: 20,
      supercurricularsAndProjects: 25,
      extracurricularsAndLeadership: 20,
    },
    dimensionalExpectations: {
      problemSolving: {
        dimension: 'problemSolving',
        label: 'Problem Solving',
        weightTier: 'Critical Mandatory',
        weightPercentage: 25,
        targetScore: 94,
        countrySpecificNeed:
          'Evaluated via competitive Math & Science Olympiads (AMC 10/12, AIME, USACO, USAPhO) and advanced STEM competitions. High SAT Math (790+) is expected.',
        tacticalRemedyGuidance:
          'Qualify for AIME via AMC 10/12, advance to USACO Gold division, or win regional/state awards in Science Olympiad or academic decathlons.',
      },
      technicalSkills: {
        dimension: 'technicalSkills',
        label: 'Technical Skills',
        weightTier: 'Core Evaluated',
        weightPercentage: 20,
        targetScore: 92,
        countrySpecificNeed:
          'Hands-on maker portfolios, deployed software, hardware engineering, wet-lab protocols, or quantitative modeling presented via Maker Portfolios or SlideRoom.',
        tacticalRemedyGuidance:
          'Build a public, reproducible artifact: an open-source GitHub repository with active users, a CAD robotics subsystem, or an interactive web application.',
      },
      criticalThinking: {
        dimension: 'criticalThinking',
        label: 'Critical Thinking',
        weightTier: 'Critical Mandatory',
        weightPercentage: 20,
        targetScore: 93,
        countrySpecificNeed:
          'Demonstrated through faculty-mentored research, publication preprints (arXiv/bioRxiv), high AP Seminar/Research scores, or competitive science fair awards (ISEF/STS).',
        tacticalRemedyGuidance:
          'Conduct an empirical study under university faculty mentorship and submit your manuscript to ISEF, JSHS, or an open-access preprint archive.',
      },
      teamWork: {
        dimension: 'teamWork',
        label: 'Team Work',
        weightTier: 'Core Evaluated',
        weightPercentage: 15,
        targetScore: 88,
        countrySpecificNeed:
          'Collaborative impact in varsity athletics, FIRST robotics teams, musical ensembles, or student council where you uplift peers.',
        tacticalRemedyGuidance:
          'Lead a multi-disciplinary student team to deliver a substantial project (e.g. organizing a 300-person regional hackathon or leading a robotics drive team).',
      },
      communication: {
        dimension: 'communication',
        label: 'Communication',
        weightTier: 'Critical Mandatory',
        weightPercentage: 20,
        targetScore: 92,
        countrySpecificNeed:
          'Reflected in the Common App essay, supplemental essays, and alumni interview. Voice must be introspective, honest, and emotionally mature.',
        tacticalRemedyGuidance:
          'Draft introspective essays focused on vulnerability, philosophical curiosity, and community growth rather than listing accomplishments.',
      },
      creativity: {
        dimension: 'creativity',
        label: 'Creativity',
        weightTier: 'Core Evaluated',
        weightPercentage: 15,
        targetScore: 91,
        countrySpecificNeed:
          'Original thought: founding unique cross-disciplinary initiatives, inventing products, composing original arts, or pioneering novel outreach programs.',
        tacticalRemedyGuidance:
          'Create something unprecedented at your school: launch an interdisciplinary journal, design an assistive tech device, or patent an original mechanism.',
      },
    },
    pillars: [
      {
        title: 'Academic Rigor & Testing Threshold',
        category: 'academics',
        weighting: 'Mandatory Baseline (35%)',
        systemRequirement: 'Top 1-2% class rank with max available AP/IB rigor, SAT 1540+ or ACT 35+.',
        admissionsOfficerQuote:
          '"Grades get your file onto the table. What gets you admitted is what lies beyond the transcript."',
        evaluationCriteria: [
          'Unweighted GPA 3.96+ in most rigorous course load available',
          '7–9 AP or IB Higher Level courses scored 5s/7s',
          'SAT 1540–1600 (Math 790+ for STEM, ERW 770+ for Humanities)',
        ],
      },
      {
        title: 'Verifiable Intellectual Spike & Research',
        category: 'research',
        weighting: 'Core Differentiator (25%)',
        systemRequirement: 'Primary-author preprint, ISEF finalist, or national Olympiad qualification.',
        admissionsOfficerQuote:
          '"We look for evidence that you pursue knowledge when nobody is assigning homework."',
        evaluationCriteria: [
          'First-author or co-author preprint on arXiv/bioRxiv or peer-reviewed journal',
          'Regeneron Science Talent Search (STS) or ISEF Grand Award finalist',
          'AIME qualification (score 7+) or USACO Gold/Platinum division',
        ],
      },
      {
        title: 'Leadership Scale & Community Impact',
        category: 'leadership',
        weighting: 'Critical Decider (20%)',
        systemRequirement: 'Scaled initiative impacting 1,000+ people or major state/national office.',
        admissionsOfficerQuote:
          '"Show us how you leave any room or community better than you found it."',
        evaluationCriteria: [
          'Founder of registered 501(c)(3) or community project with verified reach',
          'State or national level leadership in youth governance or activism',
          'Demonstrated peer mentorship and sustained 3+ year commitment',
        ],
      },
    ],
  },
  {
    countryId: 'United Kingdom',
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    systemName: 'Supercurricular Mastery & UCAS Single-Subject Depth',
    tagline: 'Selecting candidates purely for academic ability and potential to excel in a demanding tutorial course.',
    overview:
      'British university admissions (Oxford, Cambridge, Imperial, UCL, LSE) focus almost entirely on academic excellence and supercurricular depth directly related to the degree subject. Unrelated extracurriculars (sports, drama, generic community charity) carry virtually zero weight and are ignored by admissions tutors.',
    primarySelectionMechanism:
      'Rigorous subject filter: conditional offer matching predicted A-Level (A*A*A*) or IB (42-44) grades, followed by performance on standardized subject tests (STEP, TMUA, ESAT, MAT, UCAT), culminating in technical academic interview tutorials.',
    fatalMistake:
      'Submitting a US-style personal statement dwelling on personal adversity, sports captaincy, or generic volunteer hours instead of discussing advanced subject literature and problem solving.',
    winningStrategy:
      'Read 5+ university-level texts beyond the syllabus, master 150+ Olympiad and admissions test questions (STEP/TMUA), and practice articulating your reasoning out loud for technical interview questions.',
    weights: {
      academics: 70,
      testingAndExams: 20,
      supercurricularsAndProjects: 10,
      extracurricularsAndLeadership: 0,
    },
    dimensionalExpectations: {
      problemSolving: {
        dimension: 'problemSolving',
        label: 'Problem Solving',
        weightTier: 'Critical Mandatory',
        weightPercentage: 45,
        targetScore: 98,
        countrySpecificNeed:
          'Absolute highest priority in UK STEM/Law admissions. Tested through STEP, TMUA, ESAT, MAT, and live technical interviews with Oxford/Cambridge professors.',
        tacticalRemedyGuidance:
          'Work through all past papers of TMUA, STEP 2/3, and Oxford MAT. Practice solving non-routine problems without a calculator under timed pressure.',
      },
      technicalSkills: {
        dimension: 'technicalSkills',
        label: 'Technical Skills',
        weightTier: 'Critical Mandatory',
        weightPercentage: 25,
        targetScore: 95,
        countrySpecificNeed:
          'Fluency in formal mathematical notation, physics derivations, chemical reaction mechanisms, or coding fundamentals strictly relevant to course.',
        tacticalRemedyGuidance:
          'Master university first-year textbook material (e.g. Spivak Calculus, Purcell Electricity & Magnetism, or K&R C Programming).',
      },
      criticalThinking: {
        dimension: 'criticalThinking',
        label: 'Critical Thinking',
        weightTier: 'Critical Mandatory',
        weightPercentage: 20,
        targetScore: 96,
        countrySpecificNeed:
          'Ability to evaluate primary academic sources, critique peer arguments, analyze counterexamples, and accept guidance during interview tutorials.',
        tacticalRemedyGuidance:
          'Write an EPQ or Extended Essay graded A* analyzing a contested question in your field. Read peer-reviewed journal reviews.',
      },
      teamWork: {
        dimension: 'teamWork',
        label: 'Team Work',
        weightTier: 'Negligible / Unweighted',
        weightPercentage: 0,
        targetScore: 50,
        countrySpecificNeed:
          'Not evaluated for standard UCAS undergraduate admission. Tutors assess individual intellectual autonomy.',
        tacticalRemedyGuidance:
          'Do not dedicate UCAS personal statement space to team activities unless directly involving academic peer discussion.',
      },
      communication: {
        dimension: 'communication',
        label: 'Communication',
        weightTier: 'Core Evaluated',
        weightPercentage: 10,
        targetScore: 90,
        countrySpecificNeed:
          'Clear, concise, and logically rigorous articulation of concepts in the 4,000-character UCAS statement and oral tutorial interview.',
        tacticalRemedyGuidance:
          'Draft the UCAS personal statement with 85%+ academic focus: dissect specific chapters, theorems, and laboratory questions you investigated.',
      },
      creativity: {
        dimension: 'creativity',
        label: 'Creativity',
        weightTier: 'Secondary Factor',
        weightPercentage: 5,
        targetScore: 75,
        countrySpecificNeed:
          'Valued as mathematical or intellectual ingenuity: finding elegant, unorthodox solutions to complex proofs or theoretical problems.',
        tacticalRemedyGuidance:
          'Engage with open-ended mathematical and scientific investigations (e.g. UKMT Senior Mathematical Challenge Olympiad rounds).',
      },
    },
    pillars: [
      {
        title: 'A-Level / IB Predicted Grade Threshold',
        category: 'academics',
        weighting: 'Mandatory Non-Negotiable (70%)',
        systemRequirement: 'A*A*A* at A-Level or IB Diploma 42–44 points (7,7,7 Higher Level).',
        admissionsOfficerQuote:
          '"If an applicant does not meet the conditional grade offer, we cannot offer them a seat regardless of enthusiasm."',
        evaluationCriteria: [
          'Predicted A* in all prerequisite subjects (Further Maths, Physics, Chemistry)',
          'IB Higher Level scores of 7, 7, 7',
          'GCSE / IGCSE profile with predominantly 8s and 9s (A* equivalent)',
        ],
      },
      {
        title: 'Subject Admissions Assessments (STEP / TMUA / ESAT)',
        category: 'testing',
        weighting: 'Critical Shortlisting Metric (20%)',
        systemRequirement: 'Top 10th percentile on subject admissions tests used to shortlist candidates for interview.',
        admissionsOfficerQuote:
          '"The admissions test allows us to rank candidates from diverse global schools on a single, rigorous benchmark."',
        evaluationCriteria: [
          'STEP Grades 1,1 or TMUA score 7.0+ for Cambridge Computer Science & Maths',
          'ESAT (Engineering and Science Admissions Test) top quartile for Imperial/Cambridge',
          'UCAT score 3,000+ (Band 1 SJT) for UK medical schools',
        ],
      },
      {
        title: 'Academic Interview & Supercurricular Dialogue',
        category: 'essays_interviews',
        weighting: 'Final Deciding Factor (10%)',
        systemRequirement: 'Ability to think aloud, accept tutorial hints, and solve university-level problems live with faculty.',
        admissionsOfficerQuote:
          '"We are not looking for someone who knows all the answers; we are looking for someone who is teachable in a supervision."',
        evaluationCriteria: [
          'Solving unfamiliar, complex problems on a whiteboard during 30-min interview',
          'Articulating mathematical or analytical hypotheses clearly',
          'Demonstrating intense, genuine geekery and enthusiasm for the subject',
        ],
      },
    ],
  },
  {
    countryId: 'Canada',
    countryName: 'Canada',
    flag: '🇨🇦',
    systemName: 'Provincial Averages, Math Contests & Co-op Builders',
    tagline: 'High academic consistency combined with practical, industry-ready engineering and problem-solving execution.',
    overview:
      'Canadian top programs (Waterloo CS/SE, Toronto Engineering, UBC, McGill) combine high prerequisite grade averages (95–98%) with rigorous Waterloo CEMC math contests and practical hands-on building evaluated through Supplemental Applications (AIF). Co-op programs prize students ready for immediate technical employment.',
    primarySelectionMechanism:
      'Formulaic admission based on Grade 11/12 prerequisite top-6 averages, adjusted by high school adjustment factors (Waterloo Engineering), CEMC Euclid/CCC scores, and scored video interview responses (Kira Talent).',
    fatalMistake:
      'Relying solely on a 96% high school average while omitting the Waterloo Euclid Mathematics Contest or submitting a sparse Admission Information Form (AIF).',
    winningStrategy:
      'Lock in a 96%+ grade average, achieve distinction on the Waterloo Euclid and CCC contests, and document deployed technical projects and robotics teamwork in your AIF.',
    weights: {
      academics: 65,
      testingAndExams: 15,
      supercurricularsAndProjects: 15,
      extracurricularsAndLeadership: 10,
    },
    dimensionalExpectations: {
      problemSolving: {
        dimension: 'problemSolving',
        label: 'Problem Solving',
        weightTier: 'Critical Mandatory',
        weightPercentage: 35,
        targetScore: 95,
        countrySpecificNeed:
          'Evaluated directly through CEMC Waterloo math contests (Euclid, Fermat, CSMC) and Canadian Computing Competition (CCC).',
        tacticalRemedyGuidance:
          'Score 75+ on the Waterloo Euclid Contest (top 25% distinction) and complete CCC Senior problems 1 through 3.',
      },
      technicalSkills: {
        dimension: 'technicalSkills',
        label: 'Technical Skills',
        weightTier: 'Critical Mandatory',
        weightPercentage: 30,
        targetScore: 94,
        countrySpecificNeed:
          'Working knowledge of software engineering, robotics fabrication, CAD, or applied sciences ready for 1st-year co-op job applications.',
        tacticalRemedyGuidance:
          'Build and deploy full-stack applications or documented hardware prototypes; link your GitHub repository in your AIF.',
      },
      criticalThinking: {
        dimension: 'criticalThinking',
        label: 'Critical Thinking',
        weightTier: 'Core Evaluated',
        weightPercentage: 15,
        targetScore: 88,
        countrySpecificNeed:
          'Demonstrated through practical problem solving and analytical reasoning in timed Kira video interview prompts.',
        tacticalRemedyGuidance:
          'Practice structuring responses under 90-second timers using the STAR framework (Situation, Task, Action, Result).',
      },
      teamWork: {
        dimension: 'teamWork',
        label: 'Team Work',
        weightTier: 'Core Evaluated',
        weightPercentage: 10,
        targetScore: 85,
        countrySpecificNeed:
          'Valued in engineering supplemental forms: proof that you collaborate effectively on robotics, sports, or student teams.',
        tacticalRemedyGuidance:
          'Highlight your collaborative contributions to team engineering builds or hackathon groups in your AIF extracurricular list.',
      },
      communication: {
        dimension: 'communication',
        label: 'Communication',
        weightTier: 'Core Evaluated',
        weightPercentage: 10,
        targetScore: 86,
        countrySpecificNeed:
          'Evaluated via Kira Talent recorded asynchronous video interview and concise essay answers on the AIF.',
        tacticalRemedyGuidance:
          'Ensure confident camera delivery, professional presence, and concise technical explanations during Kira assessments.',
      },
      creativity: {
        dimension: 'creativity',
        label: 'Creativity',
        weightTier: 'Secondary Factor',
        weightPercentage: 5,
        targetScore: 80,
        countrySpecificNeed:
          'Entrepreneurial or maker initiative: launching an app, starting a student maker space, or creative technical solutions.',
        tacticalRemedyGuidance:
          'Document independent side projects and explain why you chose to build them in the Waterloo AIF open response section.',
      },
    },
    pillars: [
      {
        title: 'Prerequisite Top-6 Grade Average',
        category: 'academics',
        weighting: 'Decisive Weight (65%)',
        systemRequirement: '95%–98%+ average in Calculus, Advanced Functions, Chemistry, Physics, English.',
        admissionsOfficerQuote:
          '"For Waterloo CS and Software Engineering, 95% is the baseline floor where review begins."',
        evaluationCriteria: [
          'Calculus & Advanced Functions grades of 97%+',
          'Physics and Chemistry grades of 95%+',
          'Overall Grade 12 top-6 average exceeding 96.0%',
        ],
      },
      {
        title: 'CEMC Waterloo Contests (Euclid & CCC)',
        category: 'testing',
        weighting: 'High-Impact Tiebreaker (15%)',
        systemRequirement: 'Score 75+ on Euclid Mathematics Contest or CCC Senior Honor Roll.',
        admissionsOfficerQuote:
          '"When choosing between two applicants with 98% averages, Euclid contest performance decides the offer."',
        evaluationCriteria: [
          'Euclid Mathematics Contest Certificate of Distinction (Top 25%)',
          'Canadian Computing Competition (CCC) Senior Score 35+',
          'Canadian Senior Mathematics Contest (CSMC) honors',
        ],
      },
      {
        title: 'Admission Information Form (AIF) & Kira Video',
        category: 'essays_interviews',
        weighting: 'Co-op Readiness Filter (20%)',
        systemRequirement: 'Detailed breakdown of coding projects, team building, and timed video interview performance.',
        admissionsOfficerQuote:
          '"We want to know if this candidate will get hired by tech employers in their first co-op term."',
        evaluationCriteria: [
          'Articulating technical passion clearly in Kira Talent interview',
          'Documented extracurricular commitment and engineering initiatives',
          'Clear self-directed project development outside school curriculum',
        ],
      },
    ],
  },
  {
    countryId: 'Singapore',
    countryName: 'Singapore',
    flag: '🇸🇬',
    systemName: 'Meritocratic Indicative Grade Profiles & Olympiad Pipelines',
    tagline: 'Transparent, unapologetic academic meritocracy with direct pipelines for national Olympiad medalists.',
    overview:
      'National University of Singapore (NUS) and Nanyang Technological University (NTU) operate on strict published Indicative Grade Profiles (IGP). Applicants must clear high standardized cutoffs (90 Rank Points in A-Levels or IB 43+) before secondary holistic achievements are even considered through Aptitude-Based Admissions (ABA).',
    primarySelectionMechanism:
      'Direct rank ranking based on standardized school diploma percentile cutoffs. Top international Olympiad medalists (IMO, IOI, IPhO, IChO, IBO) receive direct expedited offers.',
    fatalMistake:
      'Applying with an unweighted GPA or test score below the published 10th percentile cutoff, expecting extracurricular leadership to compensate.',
    winningStrategy:
      'Ensure near-perfect transcript scores first (straight As / IB 43+), then validate technical mastery through national Olympiads (SMO/NOI) or A*STAR research attachments.',
    weights: {
      academics: 75,
      testingAndExams: 15,
      supercurricularsAndProjects: 8,
      extracurricularsAndLeadership: 2,
    },
    dimensionalExpectations: {
      problemSolving: {
        dimension: 'problemSolving',
        label: 'Problem Solving',
        weightTier: 'Critical Mandatory',
        weightPercentage: 45,
        targetScore: 97,
        countrySpecificNeed:
          'Evaluated through national mathematical and computing Olympiads (SMO Open, NOI, SPhO) and SAT/AP math scores.',
        tacticalRemedyGuidance:
          'Achieve Gold or Silver in the Singapore Mathematical Olympiad or National Olympiad in Informatics.',
      },
      technicalSkills: {
        dimension: 'technicalSkills',
        label: 'Technical Skills',
        weightTier: 'Critical Mandatory',
        weightPercentage: 25,
        targetScore: 94,
        countrySpecificNeed:
          'Mastery in computational logic, algorithmic problem solving, and formal lab methodologies.',
        tacticalRemedyGuidance:
          'Complete algorithmic challenge problem sets (Codeforces rating 1600+, LeetCode hard problems).',
      },
      criticalThinking: {
        dimension: 'criticalThinking',
        label: 'Critical Thinking',
        weightTier: 'Critical Mandatory',
        weightPercentage: 20,
        targetScore: 95,
        countrySpecificNeed:
          'Demonstrated through A*STAR or university lab research participation and scientific fair papers (SSEF).',
        tacticalRemedyGuidance:
          'Secure an A*STAR attachment or submit a scientific paper to the Singapore Science and Engineering Fair.',
      },
      teamWork: {
        dimension: 'teamWork',
        label: 'Team Work',
        weightTier: 'Secondary Factor',
        weightPercentage: 5,
        targetScore: 72,
        countrySpecificNeed:
          'Uniformed groups or community involvement programmes (CIP) evaluated only under Aptitude-Based Admissions.',
        tacticalRemedyGuidance:
          'Log verified community service hours and participate in school co-curricular activities (CCA).',
      },
      communication: {
        dimension: 'communication',
        label: 'Communication',
        weightTier: 'Secondary Factor',
        weightPercentage: 5,
        targetScore: 82,
        countrySpecificNeed:
          'Succinct articulation of research interests and technical background in the 3-question online portal response.',
        tacticalRemedyGuidance:
          'Write factual, concise application responses outlining specific academic achievements and career alignment.',
      },
      creativity: {
        dimension: 'creativity',
        label: 'Creativity',
        weightTier: 'Negligible / Unweighted',
        weightPercentage: 0,
        targetScore: 68,
        countrySpecificNeed:
          'Pure creative flair is secondary to disciplined academic and analytical rigor in Singaporean universities.',
        tacticalRemedyGuidance:
          'Channel creative energy into formal scientific research or novel algorithmic contest submissions.',
      },
    },
    pillars: [
      {
        title: 'Indicative Grade Profile (IGP) Cutoff',
        category: 'academics',
        weighting: 'Mandatory Baseline (75%)',
        systemRequirement: 'Straight 90 Rank Points in Singapore-Cambridge A-Levels or IB Diploma 43+.',
        admissionsOfficerQuote:
          '"If an applicant does not meet the published course cutoff, our system automatically routes them to their second or third choice."',
        evaluationCriteria: [
          'A-Level 4 H2 As + GP (straight As)',
          'IB Diploma score 43–45 points',
          'AP Profile with 4–5 exams scored 5',
        ],
      },
      {
        title: 'Subject Admissions Assessments & Olympiads',
        category: 'testing',
        weighting: 'Competitive Filter (15%)',
        systemRequirement: 'High percentiles on standardized tests (SAT 1540+) or national Olympiad selection.',
        admissionsOfficerQuote:
          '"Top-tier standardized test percentiles and math/computing contests provide objective validation for high-demand majors."',
        evaluationCriteria: [
          'SAT Math 790+ / ERW 760+ or ACT 35+',
          'Singapore Mathematical Olympiad (SMO) or NOI distinction',
          'SSEF (Singapore Science & Engineering Fair) finalist',
        ],
      },
      {
        title: 'A*STAR Research Attachments & Projects',
        category: 'research',
        weighting: 'Scientific Depth (8%)',
        systemRequirement: 'Formal government research attachments (A*STAR, DSO) or university laboratory projects.',
        admissionsOfficerQuote:
          '"Applicants with verified laboratory experience under faculty mentorship stand out for research-intensive tracks."',
        evaluationCriteria: [
          'A*STAR Young Researchers Programme attachment',
          'Structured wet-lab or computing repository with verifiable data',
          'Faculty letter of commendation from Singapore research institute',
        ],
      },
      {
        title: 'Aptitude-Based Admissions (ABA) Leadership',
        category: 'leadership',
        weighting: 'Holistic Discretion (2%)',
        systemRequirement: 'Uniformed groups (NCC/NPCC), community service (CIP), or national representation.',
        admissionsOfficerQuote:
          '"ABA allows us to look at candidates within 2-3 points of the cutoff who demonstrate exceptional practical talent."',
        evaluationCriteria: [
          'Demonstrated entrepreneurship or national team representation',
          'Uniformed groups staff sergeant or sustained CIP hours',
          'Strong performance in faculty admissions interview',
        ],
      },
    ],
  },
  {
    countryId: 'Switzerland',
    countryName: 'Switzerland & Europe',
    flag: '🇨🇭',
    systemName: 'Prerequisite Examination & Fundamental Science',
    tagline: 'Rigorous entrance examinations and strict prerequisite mastery in core quantitative disciplines (ETH Zurich, TUM).',
    overview:
      'Continental European institutions (ETH Zurich, EPFL, TUM, TU Delft) do not practice holistic admissions. Candidates must either hold a recognized national diploma meeting strict equivalency standards, or sit rigorous written entrance examinations in advanced mathematics, physics, and chemistry.',
    primarySelectionMechanism:
      'Documentary credential recognition verifying exact prerequisite secondary subjects, followed by written entrance examinations (ETH Reduzierte Aufnahmeprüfung) and CEFR C1 language proficiency certification.',
    fatalMistake:
      'Assuming that stellar leadership, essays, or extracurricular volunteer hours will overcome missing prerequisite math/science coursework or language requirements.',
    winningStrategy:
      'Master advanced university-level calculus, classical mechanics, and chemistry; prepare systematically for the comprehensive written entrance examination.',
    weights: {
      academics: 90,
      testingAndExams: 10,
      supercurricularsAndProjects: 0,
      extracurricularsAndLeadership: 0,
    },
    dimensionalExpectations: {
      problemSolving: {
        dimension: 'problemSolving',
        label: 'Problem Solving',
        weightTier: 'Critical Mandatory',
        weightPercentage: 50,
        targetScore: 98,
        countrySpecificNeed:
          'Absolute highest priority: solving multi-part university-level math and physics examination problems.',
        tacticalRemedyGuidance:
          'Master university-level problem sets in single- and multivariable calculus, linear algebra, and Newtonian mechanics.',
      },
      technicalSkills: {
        dimension: 'technicalSkills',
        label: 'Technical Skills',
        weightTier: 'Critical Mandatory',
        weightPercentage: 30,
        targetScore: 95,
        countrySpecificNeed:
          'Rigorous scientific methodology, laboratory assays, and mathematical notation.',
        tacticalRemedyGuidance:
          'Complete past entrance exam papers from ETH Zurich and EPFL under strict timed conditions.',
      },
      criticalThinking: {
        dimension: 'criticalThinking',
        label: 'Critical Thinking',
        weightTier: 'Critical Mandatory',
        weightPercentage: 20,
        targetScore: 95,
        countrySpecificNeed:
          'Axiomatic mathematical reasoning and structured scientific proof formulation.',
        tacticalRemedyGuidance:
          'Study proof techniques (induction, contradiction, delta-epsilon limits) and classical physics derivations.',
      },
      teamWork: {
        dimension: 'teamWork',
        label: 'Team Work',
        weightTier: 'Negligible / Unweighted',
        weightPercentage: 0,
        targetScore: 40,
        countrySpecificNeed: 'Completely unweighted for European undergraduate admission.',
        tacticalRemedyGuidance: 'Focus 100% of study time on quantitative curriculum mastery.',
      },
      communication: {
        dimension: 'communication',
        label: 'Communication',
        weightTier: 'Secondary Factor',
        weightPercentage: 0,
        targetScore: 70,
        countrySpecificNeed:
          'Language proficiency: verified C1 level in German (for ETH/TUM) or French (for EPFL).',
        tacticalRemedyGuidance: 'Obtain official Goethe C1 or DALF C1 language certificates well before application deadlines.',
      },
      creativity: {
        dimension: 'creativity',
        label: 'Creativity',
        weightTier: 'Negligible / Unweighted',
        weightPercentage: 0,
        targetScore: 50,
        countrySpecificNeed: 'Unweighted for admissions purposes.',
        tacticalRemedyGuidance: 'Focus on technical precision rather than creative presentation.',
      },
    },
    pillars: [
      {
        title: 'Curriculum Equivalency & Prerequisites',
        category: 'academics',
        weighting: 'Mandatory Foundation (90%)',
        systemRequirement: 'Directly recognized national diploma or Swiss Matura equivalency.',
        admissionsOfficerQuote:
          '"Admissions in Switzerland is a matter of administrative law: you either satisfy the formal diploma criteria or you sit the exam."',
        evaluationCriteria: [
          'Swiss Matura, German Abitur 1.0–1.2, or equivalent',
          'IB Diploma with Math AA HL (7) and Physics HL (7)',
          'Complete secondary coverage of chemistry and biology',
        ],
      },
      {
        title: 'ETH Zurich Entrance Examination (Aufnahmeprüfung)',
        category: 'testing',
        weighting: 'Comprehensive Written Filter (10%)',
        systemRequirement: 'Pass multi-subject written entrance exam in Math, Physics, Chemistry, Biology.',
        admissionsOfficerQuote:
          '"The entrance exam tests the full breadth and depth of the Swiss Matura curriculum."',
        evaluationCriteria: [
          'Written examinations in Higher Mathematics',
          'Written examinations in Physics & Applied Mechanics',
          'Written examinations in Chemistry and Biology',
        ],
      },
    ],
  },
  {
    countryId: 'Australia',
    countryName: 'Australia',
    flag: '🇦🇺',
    systemName: 'Direct ATAR Cutoffs & Published Rank Thresholds',
    tagline: 'Direct index entry based on standardized equivalent grade thresholds (ATAR) with clear published rank cutoffs.',
    overview:
      'Australian Group of Eight (Go8) flagships (Melbourne, Sydney, UNSW, ANU, Monash) evaluate applicants through a direct index: the Australian Tertiary Admission Rank (ATAR) or international equivalent score (IB/SAT). Meeting the published guaranteed score cutoff and clearing prerequisite subjects ensures an offer.',
    primarySelectionMechanism:
      'Direct score conversion matching published ATAR cutoffs. Prerequisite courses (Specialist Mathematics, Chemistry) are verified directly from transcripts. Extracurriculars are not reviewed for general degree offers.',
    fatalMistake:
      'Missing a mandatory high-school prerequisite course (e.g. Higher Level Physics for Engineering) while having an otherwise stellar GPA or spending time on extracurriculars instead of maximizing test scores.',
    winningStrategy:
      'Direct 100% of preparation energy into maximizing your final IB points or standardized exam GPA to clear the published guaranteed ATAR threshold.',
    weights: {
      academics: 95,
      testingAndExams: 5,
      supercurricularsAndProjects: 0,
      extracurricularsAndLeadership: 0,
    },
    dimensionalExpectations: {
      problemSolving: {
        dimension: 'problemSolving',
        label: 'Problem Solving',
        weightTier: 'Critical Mandatory',
        weightPercentage: 60,
        targetScore: 90,
        countrySpecificNeed:
          'Reflected directly in final high school mathematics and science exam scores.',
        tacticalRemedyGuidance:
          'Ensure highest scores in Advanced / Specialist Mathematics and Physics on your final diploma.',
      },
      technicalSkills: {
        dimension: 'technicalSkills',
        label: 'Technical Skills',
        weightTier: 'Core Evaluated',
        weightPercentage: 25,
        targetScore: 86,
        countrySpecificNeed: 'Prerequisite subject mastery verified from transcripts.',
        tacticalRemedyGuidance: 'Complete all mandatory prerequisite courses for your target course.',
      },
      criticalThinking: {
        dimension: 'criticalThinking',
        label: 'Critical Thinking',
        weightTier: 'Core Evaluated',
        weightPercentage: 15,
        targetScore: 88,
        countrySpecificNeed: 'Standardized analytical reading and essay scores on final exams.',
        tacticalRemedyGuidance: 'Maintain consistent high achievement in English and humanities exams.',
      },
      teamWork: {
        dimension: 'teamWork',
        label: 'Team Work',
        weightTier: 'Negligible / Unweighted',
        weightPercentage: 0,
        targetScore: 40,
        countrySpecificNeed: 'Not evaluated for undergraduate admission offers.',
        tacticalRemedyGuidance: 'Only relevant if applying for residential college scholarships.',
      },
      communication: {
        dimension: 'communication',
        label: 'Communication',
        weightTier: 'Secondary Factor',
        weightPercentage: 0,
        targetScore: 75,
        countrySpecificNeed:
          'English proficiency: IELTS Academic 7.0–7.5 or TOEFL iBT 102+ for international applicants.',
        tacticalRemedyGuidance: 'Clear English proficiency testing requirements with high sub-scores.',
      },
      creativity: {
        dimension: 'creativity',
        label: 'Creativity',
        weightTier: 'Negligible / Unweighted',
        weightPercentage: 0,
        targetScore: 40,
        countrySpecificNeed: 'Not evaluated for standard university admissions.',
        tacticalRemedyGuidance: 'Direct focus towards final examination score optimization.',
      },
    },
    pillars: [
      {
        title: 'ATAR / International Guaranteed Cutoff',
        category: 'academics',
        weighting: 'Decisive Metric (95%)',
        systemRequirement: 'ATAR 98.00–99.90+ or IB Diploma 41–44 points.',
        admissionsOfficerQuote:
          '"If an applicant clears the published ATAR cutoff and meets prerequisite requirements, an offer is automatically generated."',
        evaluationCriteria: [
          'ATAR score meeting or exceeding published threshold',
          'IB Diploma score 41+ for Top 5 Australian faculties',
          'Prerequisite courses verified on transcript',
        ],
      },
      {
        title: 'English Language Competency',
        category: 'testing',
        weighting: 'Mandatory Visa / Entry Condition (5%)',
        systemRequirement: 'IELTS Academic overall 7.0–7.5 (no sub-band below 7.0).',
        admissionsOfficerQuote:
          '"Meeting the English threshold is a statutory requirement before visa and enrollment processing."',
        evaluationCriteria: [
          'IELTS Academic 7.5 or TOEFL iBT 102+',
          'PTE Academic score 72+',
        ],
      },
    ],
  },
];

/**
 * Dynamic calculation of 6-Dimensional Competency Requirements
 * Scaled precisely by University Tier (Top 5 to Top 100) and Destination Country
 */
export function getCountryDimensionalRequirements(
  countryId: string,
  tier: RankTier,
  field: string = ''
): Record<string, CountryDimensionalExpectation> {
  const profile =
    COUNTRY_COMPETENCY_PROFILES.find(
      (c) => c.countryId.toLowerCase() === countryId.toLowerCase()
    ) || COUNTRY_COMPETENCY_PROFILES[0];

  // Base tier scaling delta:
  // Top 5: delta = 0 (highest benchmark, e.g. 94-98)
  // Top 10: delta = -5 (e.g. 89-93)
  // Top 25: delta = -11 (e.g. 83-87)
  // Top 50: delta = -17 (e.g. 77-81)
  // Top 100: delta = -24 (e.g. 70-74)
  const tierDelta: Record<RankTier, number> = {
    'Top 5': 0,
    'Top 10': -5,
    'Top 25': -11,
    'Top 50': -17,
    'Top 100': -24,
  };
  const delta = tierDelta[tier] ?? 0;

  const res: Record<string, CountryDimensionalExpectation> = {};

  for (const [key, dim] of Object.entries(profile.dimensionalExpectations)) {
    // If dimension is unweighted in this country (e.g. Teamwork in UK/Europe), keep it unweighted floor
    if (dim.weightTier === 'Negligible / Unweighted') {
      res[key] = {
        ...dim,
        targetScore: dim.targetScore, // e.g. 40 or 50
      };
    } else {
      // Scale dynamically with tier, keeping minimum floor at 60
      const scaledTarget = Math.max(60, Math.min(99, dim.targetScore + delta));
      res[key] = {
        ...dim,
        targetScore: scaledTarget,
      };
    }
  }

  return res;
}

/**
 * Calculates candidate achieved points across 6 dimensions
 * Combines baseline evaluation + completed milestones boost + country-specific evaluation weighting
 */
export function calculateCandidateAchievedPoints(
  countryId: string,
  tier: RankTier,
  baselineScores: {
    problemSolving: number;
    technicalSkills: number;
    criticalThinking: number;
    teamWork: number;
    communication: number;
    creativity: number;
  },
  completedMilestoneIds: string[] = []
): {
  problemSolving: number;
  technicalSkills: number;
  criticalThinking: number;
  teamWork: number;
  communication: number;
  creativity: number;
  completedMilestonesCount: number;
  tierScoreAdjustment: number;
  bonusPointsFromActivities: number;
} {
  const normCountry = (countryId || '').toLowerCase();
  const isUK = normCountry.includes('kingdom') || normCountry === 'uk';
  const isEurope =
    normCountry.includes('switzer') ||
    normCountry.includes('europe') ||
    normCountry.includes('germany');
  const isAustralia = normCountry.includes('australia');
  const isCanada = normCountry.includes('canada');
  const isSingapore = normCountry.includes('singapore');

  // 1. TIER SELECTIVITY CALIBRATION:
  // When assessed against Top 100, the candidate's achievements show high readiness (+8 pts).
  // When assessed against Top 5, achievements are benchmarked against an elite global applicant pool (-6 pts).
  const tierAchievedDelta: Record<RankTier, number> = {
    'Top 5': -6,
    'Top 10': -2,
    'Top 25': +2,
    'Top 50': +5,
    'Top 100': +8,
  };
  const tDelta = tierAchievedDelta[tier] ?? 0;

  // 2. COMPLETED BLUEPRINT ACTIVITIES BOOST:
  // Count completed activities by their domain tag
  let compCount = 0;
  let projCount = 0;
  let resCount = 0;
  let leadCount = 0;
  let certCount = 0;

  for (const id of completedMilestoneIds) {
    const lower = id.toLowerCase();
    if (lower.includes('comp') || lower.includes('olympiad')) compCount++;
    else if (lower.includes('proj') || lower.includes('code') || lower.includes('intern')) projCount++;
    else if (lower.includes('res') || lower.includes('paper') || lower.includes('inquiry')) resCount++;
    else if (lower.includes('lead') || lower.includes('club') || lower.includes('found')) leadCount++;
    else if (lower.includes('cert') || lower.includes('read') || lower.includes('acad')) certCount++;
    else compCount++;
  }

  // Calculate raw scores with tier baseline calibration + completed activities boost
  let ps = baselineScores.problemSolving + tDelta + compCount * 3.5 + projCount * 1.5;
  let ts = baselineScores.technicalSkills + tDelta + projCount * 3.5 + certCount * 2 + resCount * 2;
  let ct = baselineScores.criticalThinking + tDelta + resCount * 4 + certCount * 2 + compCount * 1.5;
  let tw = baselineScores.teamWork + tDelta + leadCount * 4 + projCount * 1.5;
  let cm = baselineScores.communication + tDelta + leadCount * 3.5 + resCount * 2;
  let cr = baselineScores.creativity + tDelta + projCount * 3 + leadCount * 2;

  // 3. APPLY DESTINATION COUNTRY ADMISSIONS MECHANICS:
  if (isUK) {
    // UK tutors strictly value academic mastery (STEP, TMUA, Olympiads, Extended Essay)
    ps = Math.round(ps * 1.05 + compCount * 1.5);
    ct = Math.round(ct * 1.05 + resCount * 1.5);
    // Extracurricular leadership carries near-zero weight in UCAS
    tw = Math.min(50, baselineScores.teamWork + tDelta);
    cr = Math.min(68, baselineScores.creativity + tDelta);
  } else if (isEurope || isAustralia) {
    // European entrance exams & Australian ATAR do not evaluate extracurricular team/leadership
    tw = Math.min(45, baselineScores.teamWork + tDelta);
    cr = Math.min(50, baselineScores.creativity + tDelta);
    cm = Math.min(65, baselineScores.communication + tDelta);
  } else if (isCanada) {
    // Canada values Euclid/CCC and practical code builds heavily for co-op
    ps = Math.round(ps + compCount * 1.5);
    ts = Math.round(ts + projCount * 2.0);
  } else if (isSingapore) {
    // Singapore values Olympiads (SMO/NOI) and A*STAR research
    ps = Math.round(ps * 1.04 + compCount * 2.0);
    ts = Math.round(ts + projCount * 1.5);
    ct = Math.round(ct + resCount * 1.5);
    tw = Math.min(65, tw);
    cr = Math.min(65, cr);
  } else {
    // United States: Full holistic recognition of leadership spikes and creative initiatives
    tw = Math.round(tw + leadCount * 1.5);
    cm = Math.round(cm + leadCount * 1.5);
    cr = Math.round(cr + projCount * 1.5);
  }

  const bonusPointsFromActivities = Math.round(
    (compCount * 3.5 + projCount * 3.0 + resCount * 3.5 + leadCount * 3.0 + certCount * 2.0)
  );

  return {
    problemSolving: Math.min(99, Math.max(30, Math.round(ps))),
    technicalSkills: Math.min(99, Math.max(30, Math.round(ts))),
    criticalThinking: Math.min(99, Math.max(30, Math.round(ct))),
    teamWork: Math.min(99, Math.max(30, Math.round(tw))),
    communication: Math.min(99, Math.max(30, Math.round(cm))),
    creativity: Math.min(99, Math.max(30, Math.round(cr))),
    completedMilestonesCount: completedMilestoneIds.length,
    tierScoreAdjustment: tDelta,
    bonusPointsFromActivities,
  };
}

/**
 * Normalizes free-form country names to recognized profile identifiers
 */
export function getCountryCodeFromName(countryName: string): string {
  const c = (countryName || '').toLowerCase();
  if (c.includes('singapore')) return 'singapore';
  if (c.includes('united kingdom') || c === 'uk' || c.includes('britain') || c.includes('oxbridge')) return 'uk';
  if (c.includes('canada')) return 'canada';
  if (c.includes('germany') || c.includes('europe') || c.includes('tum')) return 'germany';
  if (c.includes('australia')) return 'australia';
  return 'us';
}

/**
 * Calculates a mathematically rigorous country-weighted composite score (0-100)
 * across the 6 competency dimensions based on the destination country's empirical admissions pillars.
 */
export function calculateCountryWeightedCompositeScore(
  countryIdOrName: string,
  scores: {
    problemSolving: number;
    technicalSkills: number;
    criticalThinking: number;
    teamWork: number;
    communication: number;
    creativity: number;
  }
): number {
  const code = getCountryCodeFromName(countryIdOrName);
  const profile =
    COUNTRY_COMPETENCY_PROFILES.find((c) => c.countryId.toLowerCase() === code) ||
    COUNTRY_COMPETENCY_PROFILES[0];

  const w = profile.weights;
  // Map the 4 empirical admissions pillars directly to the 6 MLS dimensions:
  // 1. Academics (e.g. Singapore 75%, US 35%) -> Problem Solving & Critical Thinking
  // 2. Testing & Exams (e.g. Singapore 15%, US 15%) -> Problem Solving & Technical Rigor
  // 3. Supercurriculars & Projects (e.g. Singapore 8%, US 25%) -> Technical Skills, Critical Thinking, Creativity
  // 4. Extracurriculars & Leadership (e.g. Singapore 2%, US 25%) -> Team Work, Communication, Creativity
  const w_ps = (w.academics * 0.5) + (w.testingAndExams * 0.6);
  const w_ts = (w.testingAndExams * 0.4) + (w.supercurricularsAndProjects * 0.5);
  const w_ct = (w.academics * 0.5) + (w.supercurricularsAndProjects * 0.25);
  const w_tw = (w.extracurricularsAndLeadership * 0.5);
  const w_cm = (w.extracurricularsAndLeadership * 0.3);
  const w_cr = (w.supercurricularsAndProjects * 0.25) + (w.extracurricularsAndLeadership * 0.2);

  const totalWeight = w_ps + w_ts + w_ct + w_tw + w_cm + w_cr;
  const rawComposite = (
    scores.problemSolving * w_ps +
    scores.technicalSkills * w_ts +
    scores.criticalThinking * w_ct +
    scores.teamWork * w_tw +
    scores.communication * w_cm +
    scores.creativity * w_cr
  ) / (totalWeight || 100);

  return Math.min(99, Math.max(25, Math.round(rawComposite)));
}

/**
 * Inspects the candidate baseline profile and identifies which milestones are already
 * accomplished in their past and current academic journey.
 */
export function detectCompletedMilestonesFromProfile(
  baseline: AspiringStudentBaseline,
  currentGrade: GradeLevel,
  field: string = ''
): {
  completedIds: Set<string>;
  matchedReasons: Record<string, string>;
} {
  const completedIds = new Set<string>();
  const matchedReasons: Record<string, string> = {};

  const gpa = (baseline.gpaRigor || '').toLowerCase();
  const test = (baseline.testingStatus || '').toLowerCase();
  const comp = (baseline.competitionsHonors || '').toLowerCase();
  const proj = (baseline.technicalProjects || '').toLowerCase();
  const lead = (baseline.leadershipActivities || '').toLowerCase();
  const intern = (baseline.internshipsWork || '').toLowerCase();
  const res = (baseline.researchExperience || '').toLowerCase();

  const isG10OrAbove = currentGrade === 'Grade 10' || currentGrade === 'Grade 11' || currentGrade === 'Grade 12';
  const isG11OrAbove = currentGrade === 'Grade 11' || currentGrade === 'Grade 12';
  const isG12 = currentGrade === 'Grade 12';

  // --- GRADE 9 FOUNDATIONS ---
  // Coursework / Certifications (g9-cert-1)
  if (isG10OrAbove || gpa.includes('ap') || gpa.includes('honors') || gpa.includes('ib') || test.length > 5) {
    completedIds.add('g9-cert-1');
    matchedReasons['g9-cert-1'] = gpa.includes('ap') || gpa.includes('honors') || gpa.includes('ib')
      ? `Validated in Profile: Advanced foundation coursework (${baseline.gpaRigor.split('.')[1]?.trim() || 'Honors / AP'})`
      : 'Foundational coursework & reading completed in Grade 9';
  }

  // Contests / Benchmarking (g9-comp-1)
  if (comp.length > 10 || isG10OrAbove) {
    completedIds.add('g9-comp-1');
    matchedReasons['g9-comp-1'] = comp.includes('amc') || comp.includes('olympiad') || comp.includes('usaco') || comp.includes('bpho') || comp.includes('waterloo')
      ? `Validated in Profile: ${baseline.competitionsHonors.split('.')[0]}`
      : 'Initial contest benchmarking & entrance assessments completed';
  }

  // School Club / Community Leadership (g9-lead-1)
  if (lead.length > 10 || isG10OrAbove) {
    completedIds.add('g9-lead-1');
    matchedReasons['g9-lead-1'] = `Validated in Profile: ${baseline.leadershipActivities.split(';')[0] || baseline.leadershipActivities.split('.')[0]}`;
  }

  // Technical Project Prototype (g9-proj-1)
  if (proj.length > 10 || isG10OrAbove) {
    completedIds.add('g9-proj-1');
    matchedReasons['g9-proj-1'] = `Validated in Profile: ${baseline.technicalProjects.split(';')[0] || baseline.technicalProjects.split('.')[0]}`;
  }

  // --- GRADE 10 MILESTONES ---
  if (isG11OrAbove) {
    // If student has already completed Grade 10
    completedIds.add('g10-comp-1');
    matchedReasons['g10-comp-1'] = `Validated in Profile: ${baseline.competitionsHonors.split('.')[0] || 'Grade 10 Contest Portfolio'}`;

    if (proj.length > 15) {
      completedIds.add('g10-proj-1');
      matchedReasons['g10-proj-1'] = `Validated in Profile: ${baseline.technicalProjects.split(';')[0]}`;
    }

    if (intern.length > 10 && !intern.includes('no formal') && !intern.includes('none')) {
      completedIds.add('g10-intern-1');
      matchedReasons['g10-intern-1'] = `Validated in Profile: ${baseline.internshipsWork.split(';')[0] || baseline.internshipsWork.split('.')[0]}`;
    }

    if (lead.length > 15) {
      completedIds.add('g10-lead-1');
      matchedReasons['g10-lead-1'] = `Validated in Profile: ${baseline.leadershipActivities.split(';')[0]}`;
    }
  } else if (currentGrade === 'Grade 10') {
    // Current Grade 10 student: check if they have specific accomplishments achieved
    if (comp.includes('silver') || comp.includes('gold') || comp.includes('aime') || comp.includes('first') || comp.includes('winner') || comp.includes('award') || comp.includes('distinction')) {
      completedIds.add('g10-comp-1');
      matchedReasons['g10-comp-1'] = `Validated in Profile: ${baseline.competitionsHonors.split('.')[0]}`;
    }
    if (intern.length > 10 && !intern.includes('none') && !intern.includes('no formal')) {
      completedIds.add('g10-intern-1');
      matchedReasons['g10-intern-1'] = `Validated in Profile: ${baseline.internshipsWork.split(';')[0] || baseline.internshipsWork.split('.')[0]}`;
    }
    if (proj.includes('built') || proj.includes('bot') || proj.includes('app') || proj.includes('react') || proj.includes('tool') || proj.includes('arm')) {
      completedIds.add('g10-proj-1');
      matchedReasons['g10-proj-1'] = `Validated in Profile: ${baseline.technicalProjects.split(';')[0]}`;
    }
  }

  // --- GRADE 11 MILESTONES (For Grade 12 students) ---
  if (isG12) {
    completedIds.add('g11-comp-1');
    matchedReasons['g11-comp-1'] = `Validated in Profile: Upper-division contest portfolio`;
    if (res.length > 15 && !res.includes('no formal') && !res.includes('none')) {
      completedIds.add('g11-res-1');
      matchedReasons['g11-res-1'] = `Validated in Profile: ${baseline.researchExperience.split('.')[0]}`;
    }
    if (lead.includes('president') || lead.includes('founder') || lead.includes('captain') || lead.includes('officer')) {
      completedIds.add('g11-lead-1');
      matchedReasons['g11-lead-1'] = `Validated in Profile: ${baseline.leadershipActivities.split(';')[0]}`;
    }
  }

  return { completedIds, matchedReasons };
}
