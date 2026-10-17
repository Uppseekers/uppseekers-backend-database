import { AdmittedStudentProfile, RankTier } from '../types';

export interface UniversityMeta {
  name: string;
  country: string;
  rank: number;
  rankTier: RankTier;
}

export const TOP_UNIVERSITIES: UniversityMeta[] = [
  // Top 5 Global
  { name: 'Massachusetts Institute of Technology (MIT)', country: 'United States', rank: 1, rankTier: 'Top 5' },
  { name: 'University of Cambridge', country: 'United Kingdom', rank: 2, rankTier: 'Top 5' },
  { name: 'University of Oxford', country: 'United Kingdom', rank: 3, rankTier: 'Top 5' },
  { name: 'Harvard University', country: 'United States', rank: 4, rankTier: 'Top 5' },
  { name: 'Stanford University', country: 'United States', rank: 5, rankTier: 'Top 5' },

  // Top 10 Global
  { name: 'Imperial College London', country: 'United Kingdom', rank: 6, rankTier: 'Top 10' },
  { name: 'ETH Zurich', country: 'Switzerland', rank: 7, rankTier: 'Top 10' },
  { name: 'National University of Singapore (NUS)', country: 'Singapore', rank: 8, rankTier: 'Top 10' },
  { name: 'University College London (UCL)', country: 'United Kingdom', rank: 9, rankTier: 'Top 10' },
  { name: 'California Institute of Technology (Caltech)', country: 'United States', rank: 10, rankTier: 'Top 10' },

  // Top 25 Global
  { name: 'University of Pennsylvania', country: 'United States', rank: 11, rankTier: 'Top 25' },
  { name: 'UC Berkeley', country: 'United States', rank: 12, rankTier: 'Top 25' },
  { name: 'University of Melbourne', country: 'Australia', rank: 13, rankTier: 'Top 25' },
  { name: 'Cornell University', country: 'United States', rank: 14, rankTier: 'Top 25' },
  { name: 'Nanyang Technological University (NTU)', country: 'Singapore', rank: 15, rankTier: 'Top 25' },
  { name: 'University of Toronto', country: 'Canada', rank: 16, rankTier: 'Top 25' },
  { name: 'Princeton University', country: 'United States', rank: 17, rankTier: 'Top 25' },
  { name: 'Yale University', country: 'United States', rank: 18, rankTier: 'Top 25' },
  { name: 'Columbia University', country: 'United States', rank: 19, rankTier: 'Top 25' },
  { name: 'University of Chicago', country: 'United States', rank: 20, rankTier: 'Top 25' },
  { name: 'Carnegie Mellon University (CMU)', country: 'United States', rank: 21, rankTier: 'Top 25' },
  { name: 'Johns Hopkins University', country: 'United States', rank: 22, rankTier: 'Top 25' },
  { name: 'University of Edinburgh', country: 'United Kingdom', rank: 23, rankTier: 'Top 25' },
  { name: 'EPFL', country: 'Switzerland', rank: 24, rankTier: 'Top 25' },
  { name: 'The University of Hong Kong (HKU)', country: 'Hong Kong', rank: 25, rankTier: 'Top 25' },

  // Top 50 Global
  { name: 'University of Michigan, Ann Arbor', country: 'United States', rank: 28, rankTier: 'Top 50' },
  { name: 'UCLA', country: 'United States', rank: 29, rankTier: 'Top 50' },
  { name: 'McGill University', country: 'Canada', rank: 30, rankTier: 'Top 50' },
  { name: 'King’s College London', country: 'United Kingdom', rank: 32, rankTier: 'Top 50' },
  { name: 'Georgia Institute of Technology', country: 'United States', rank: 33, rankTier: 'Top 50' },
  { name: 'The University of Sydney', country: 'Australia', rank: 34, rankTier: 'Top 50' },
  { name: 'Purdue University', country: 'United States', rank: 35, rankTier: 'Top 50' },
  { name: 'University of British Columbia (UBC)', country: 'Canada', rank: 36, rankTier: 'Top 50' },
  { name: 'London School of Economics (LSE)', country: 'United Kingdom', rank: 40, rankTier: 'Top 50' },
  { name: 'UIUC (Univ of Illinois Urbana-Champaign)', country: 'United States', rank: 41, rankTier: 'Top 50' },
  { name: 'UC San Diego (UCSD)', country: 'United States', rank: 45, rankTier: 'Top 50' },
  { name: 'University of Manchester', country: 'United Kingdom', rank: 48, rankTier: 'Top 50' },

  // Top 100 Global
  { name: 'University of Waterloo', country: 'Canada', rank: 54, rankTier: 'Top 100' },
  { name: 'University of Warwick', country: 'United Kingdom', rank: 60, rankTier: 'Top 100' },
  { name: 'University of Wisconsin-Madison', country: 'United States', rank: 65, rankTier: 'Top 100' },
  { name: 'Technical University of Munich (TUM)', country: 'Germany', rank: 68, rankTier: 'Top 100' },
  { name: 'University of Washington', country: 'United States', rank: 72, rankTier: 'Top 100' },
  { name: 'University of Texas at Austin', country: 'United States', rank: 75, rankTier: 'Top 100' },
  { name: 'Hong Kong University of Science and Tech (HKUST)', country: 'Hong Kong', rank: 80, rankTier: 'Top 100' },
  { name: 'Boston University', country: 'United States', rank: 85, rankTier: 'Top 100' },
  { name: 'University of Bristol', country: 'United Kingdom', rank: 90, rankTier: 'Top 100' },
];

export const FIELD_CATEGORIES = [
  'Computer Science & AI',
  'Engineering & Robotics',
  'Pre-Med & BioSciences',
  'Economics & Quant Finance',
  'Physical Sciences & Math',
  'Business & Tech Management',
  'Humanities & Social Sciences',
] as const;

export const ARCHETYPES = [
  'The Pure Researcher',
  'The Olympiad Prodigy',
  'The Tech Builder & Founder',
  'The Polymath Leader',
  'The Community Innovator',
  'The Quant & Applied Modeler',
] as const;

const FIRST_NAMES = [
  'Alex', 'Liam', 'Maya', 'Aarav', 'Ethan', 'Sophie', 'Elena', 'Lucas', 'Chloe', 'Noah',
  'Ananya', 'Rohan', 'Isabella', 'David', 'Zoe', 'Oliver', 'Kiran', 'Daniel', 'Mia', 'Marcus',
  'Priya', 'Leo', 'Emma', 'Hiroshi', 'Siddharth', 'Ava', 'Nathan', 'Tara', 'Julian', 'Grace',
  'Dev', 'Hannah', 'Arjun', 'Olivia', 'Kevin', 'Mira', 'Gabriel', 'Leila', 'Sam', 'Amara',
  'Vikram', 'Rachel', 'Mateo', 'Nora', 'Kabir', 'Sara', 'Aditya', 'Freya', 'Justin', 'Ayla',
];

const LAST_INITIALS = ['A.', 'B.', 'C.', 'D.', 'E.', 'G.', 'H.', 'J.', 'K.', 'L.', 'M.', 'N.', 'P.', 'R.', 'S.', 'T.', 'V.', 'W.', 'Y.', 'Z.'];

// Deterministic pseudo-random generator
function createRng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateAdmittedCohort1500(): AdmittedStudentProfile[] {
  const students: AdmittedStudentProfile[] = [];
  const rng = createRng(42918);

  const pick = <T>(arr: readonly T[] | T[]): T => arr[Math.floor(rng() * arr.length)];
  const pickInt = (min: number, max: number): number => Math.floor(rng() * (max - min + 1)) + min;

  for (let i = 1; i <= 1500; i++) {
    const uni = pick(TOP_UNIVERSITIES);
    const field = pick(FIELD_CATEGORIES);
    const archetype = pick(ARCHETYPES);
    const name = `${pick(FIRST_NAMES)} ${pick(LAST_INITIALS)}`;
    const classOf = pick(['2027', '2028', '2029', '2030']);
    const isTopTier = uni.rankTier === 'Top 5' || uni.rankTier === 'Top 10';

    // Standardized Academics & Tests based on university rank tier
    let academicsPerformance = '';
    let actSat = '';
    let apTaken = '';

    if (uni.rankTier === 'Top 5') {
      const gpa = (3.95 + rng() * 0.05).toFixed(2);
      const sat = pickInt(1550, 1600);
      academicsPerformance = `GPA: ${gpa} / 4.0 (Unweighted) | Valedictorian / Top 1%`;
      actSat = `SAT: ${sat} (Math: ${pickInt(790, 800)}, EBRW: ${sat - 800 >= 750 ? sat - 800 : 760})`;
      apTaken = 'AP Calc BC (5), AP Physics C: Mech (5), AP Physics C: E&M (5), AP Comp Sci A (5), AP Chem (5), AP Lit (5)';
    } else if (uni.rankTier === 'Top 10') {
      const gpa = (3.92 + rng() * 0.07).toFixed(2);
      const sat = pickInt(1530, 1590);
      academicsPerformance = `GPA: ${gpa} / 4.0 | Top 2% of graduating class`;
      actSat = `SAT: ${sat} (Math: ${pickInt(770, 800)}, EBRW: ${pickInt(740, 780)})`;
      apTaken = 'AP Calc BC (5), AP Comp Sci A (5), AP Physics C (5), AP Micro/Macro Econ (5), AP Stats (5)';
    } else if (uni.rankTier === 'Top 25') {
      const gpa = (3.88 + rng() * 0.1).toFixed(2);
      const sat = pickInt(1500, 1570);
      academicsPerformance = `GPA: ${gpa} / 4.0 (UW), Weighted 4.65 / 5.0`;
      actSat = rng() > 0.3 ? `SAT: ${sat} | ACT: 35` : `ACT: 35 (Math: 36, Science: 36)`;
      apTaken = 'AP Calc BC (5), AP Bio (5), AP Lang (4), AP US History (5), AP Physics 1 (5)';
    } else {
      const gpa = (3.82 + rng() * 0.15).toFixed(2);
      const sat = pickInt(1470, 1550);
      academicsPerformance = `GPA: ${gpa} / 4.0 | IB Diploma: 42/45 points`;
      actSat = `SAT: ${sat} | ACT: 34`;
      apTaken = 'AP Calc AB/BC (5), AP European History (4), AP Chemistry (4), AP Stats (5)';
    }

    // Authentic Non-Academic Profile Fields by Field & Archetype
    let internshipWork = '';
    let research = '';
    let summerPrograms = '';
    let certificatesMoocs = '';
    let competitionsAwards = '';
    let projects = '';
    let otherActivities = '';
    let keySpike = '';

    const grade9: string[] = [];
    const grade10: string[] = [];
    const grade11: string[] = [];
    const grade12: string[] = [];

    if (field === 'Computer Science & AI') {
      if (archetype === 'The Pure Researcher') {
        internshipWork = `Student Research Intern — University AI Systems Lab (${pick(['MIT CSAIL', 'Stanford SAIL', 'Berkeley BAIR', 'CMU LTI'])} affiliate) (Summer 2024)\nMachine Learning Engineering Intern at Seed-stage LLM startup (2024)`;
        research = `First Author, "Accelerating Edge Inference in Deep Vision Transformers via Sparse Pruning" — Accepted at NeurIPS High School Track / arXiv preprint (2024)\nResearch Assistant under Prof. Chen, working on multimodal medical imaging embeddings (2023–2024)`;
        summerPrograms = pick(['MIT Beaver Works Summer Institute (Cognitive AI & Autonomous RACECAR)', 'Research Science Institute (RSI)', 'Stanford SIMR']);
        competitionsAwards = `Regeneron International Science and Engineering Fair (ISEF) — 2nd Place in System Software\nUSACO Gold Division Qualifier\nAIME Qualifier (Score: 8/15)\nSiemens Math, Science and Technology Finalist`;
        projects = `Engineered "SparseVision-Core", open-source PyTorch pipeline with 640+ GitHub stars and 12k PyPI downloads\nAutonomous micro-quadcopter obstacle avoidance using optical flow on Jetson Nano`;
        otherActivities = `Founder & President, Regional Youth AI Ethics Fellowship (400+ student members across 18 high schools)\nCaptain, Varsity Track & Field (Pole Vault)\nPeer Math & CS Tutor (120+ volunteer hours)`;
        keySpike = 'NeurIPS/arXiv First-Author Vision Transformer Publication & ISEF Software Award';

        grade9.push('Explored Python, C++ and Linear Algebra; joined high school competitive programming club');
        grade9.push('Competed in AMC 10 (scored 92) and advanced to USACO Silver');
        grade10.push('Advanced to USACO Gold; built early neural net benchmarking tool on GitHub (120 stars)');
        grade10.push('Cold-contacted 14 university AI faculty; secured summer apprenticeship in computer vision lab');
        grade11.push('Completed primary research on sparse pruning; wrote paper draft and submitted to ISEF / arXiv');
        grade11.push('Earned 2nd Place at Regeneron ISEF Grand Awards; presented poster to university department chairs');
        grade12.push('Co-authored conference camera-ready paper; served as varsity captain and led regional AI fellowship');
      } else if (archetype === 'The Tech Builder & Founder') {
        internshipWork = `Founder & Lead Engineer — OpenPulse Analytics (SaaS analytics for indie devs, 14,000 monthly active users, $3.2k MRR)\nSoftware Engineering Intern — Y Combinator backed fintech (Summer 2024)`;
        research = `Independent Applied Systems Study: "Benchmarking Distributed State Machines across Heterogeneous Node Clusters" (2024)`;
        summerPrograms = 'LaunchX Entrepreneurship Program (Top Pitch Award) & MIT Beaver Works';
        competitionsAwards = `Congressional App Challenge — 1st Place Winner (District Level)\nPennApps Hackathon — Best FinTech Track Grand Prize\nApple Swift Student Challenge Winner (2023 & 2024)\nUSA Computing Olympiad (USACO) Silver`;
        projects = `Full-stack production web application built in Next.js, Go, Redis, Docker, and PostgreSQL with Stripe billing integration\nCreated popular CLI developer productivity tool with 1,800+ GitHub stars`;
        otherActivities = `President, School Hackathon Organization (organized 36-hour event with 250 participants and $15k sponsor funding)\nEagle Scout / President’s Volunteer Service Award (Gold)\nJazz Ensemble Lead Saxophonist`;
        keySpike = 'Bootstrapped SaaS to $3.2k MRR, Apple Swift Winner & Congressional App Challenge 1st Place';

        grade9.push('Self-taught full-stack web development (React, Node.js, SQLite); built school schedule organizer');
        grade9.push('Submitted first iOS app to Apple Swift Student Challenge; participated in local 24-hr hackathon');
        grade10.push('Won Apple Swift Student Challenge; scaled side project to first 1,000 active users');
        grade10.push('Joined school coding club leadership; founded student hackathon committee');
        grade11.push('Incorporated micro-SaaS with Stripe billing; grew to 14k MAU; won Congressional App Challenge');
        grade11.push('Organized 250-student regional hackathon raising $15,000 corporate sponsorship');
        grade12.push('Interned at YC startup; open-sourced developer tool with 1.8k GitHub stars; finalized Stanford application');
      } else {
        internshipWork = `Data Science Fellow — State Department of Health Data Taskforce (Summer 2024)\nJunior DevOps Engineer — Local Tech Consultancy (2023–2024)`;
        research = `Computational graph network analysis of epidemiological contact dynamics published in student research journal (2024)`;
        summerPrograms = 'Carnegie Mellon Pre-College National High School Game Academy / AP/EA';
        competitionsAwards = `AIME 2x Qualifier (Scores: 7, 9)\nUSACO Gold Division Competitor\nNational Merit Scholar Semifinalist\n1st Place State Science Olympiad (Codebusters & Robot Tour)`;
        projects = `Developed real-time graph visualization engine for 200k interconnected hospital nodes using WebGL & D3\nCo-created automated grading assistant for high school computer science curriculum`;
        otherActivities = `Varsity Math Team Co-Captain\nLead Cellist, Youth Symphony Orchestra\nVolunteer Instructor for underserved middle school robotics leagues`;
        keySpike = 'AIME 2x Qualifier, USACO Gold & Computational Graph Network Analysis';

        grade9.push('Built foundational algorithmic problem-solving habits via AoPS and LeetCode');
        grade10.push('Qualified for AIME; placed 1st in State Science Olympiad Codebusters');
        grade11.push('Earned USACO Gold; completed graph data science fellowship with State Health Dept');
        grade12.push('Led Math Team to state finals; completed computational graph publication');
      }
    } else if (field === 'Pre-Med & BioSciences') {
      internshipWork = `Clinical Research Intern — Oncology Biostatistics Unit, University Medical Center (Jun 2024 – Aug 2024)\nHospital Emergency Department Volunteer (240+ verified clinical hours, 2023–2025)`;
      research = `Co-author, "Targeted Nanoparticle Drug Delivery Systems for HER2+ Breast Cancer Cell Lines", Journal of Student Research & submitted to AACR Youth (2024)\nGenomic sequencing pipelining using Biopython and BLAST for antibiotic-resistant bacteria`;
      summerPrograms = pick(['Stanford SIMR (Summer Institutes of Medicine Research)', 'SSP (Summer Science Program in Biochemistry)', 'Roswell Park Cancer Institute Summer Program']);
      competitionsAwards = `USABO (USA Biology Olympiad) Semifinalist (Top 10% nationally)\nHOSA International Leadership Conference — 1st Place in Medical Innovation\nState Science & Humanities Symposium (JSHS) — Oral Presenter Finalist`;
      projects = `Engineered 3D-printable low-cost prosthetic hand actuated by EMG muscle sensors with Arduino ($45 bill of materials)\nCreated open-access interactive molecular pathway tutorial web app with 8,000 user views`;
      otherActivities = `President, School HOSA Chapter (grew membership from 22 to 74 students)\nFounder, "HealthLumin": youth community CPR & stroke symptom education initiative reaching 1,200 residents\nVarsity Tennis #2 Singles`;
      keySpike = 'USABO Semifinalist, HOSA International 1st Place & Stanford SIMR Cancer Research Co-author';

      grade9.push('Discovered cellular biology passion; completed AP Bio coursework and volunteered at local free clinic');
      grade10.push('Scored top 20% on USABO Open Exam; placed top 3 in State HOSA Medical Innovation');
      grade11.push('Attained USABO Semifinalist honors; admitted to highly selective biochemistry summer research program');
      grade11.push('Synthesized HER2+ targeted nanoparticle data; authored paper draft; won 1st Place at HOSA Internationals');
      grade12.push('Expanded "HealthLumin" community CPR training across 4 school districts; submitted medical school track apps');
    } else if (field === 'Engineering & Robotics') {
      internshipWork = `Hardware Engineering Intern — Autonomous Drone Lab / Aerospace Incubator (Summer 2024)\nPrecision CNC Machinist Apprentice — MakerSpace Guild (2023–2024)`;
      research = `Design and aerodynamic wind tunnel analysis of morphing-camber airfoil configurations for small UAV efficiency (2024)\nFEA structural optimization of titanium lattice bracket prototypes`;
      summerPrograms = 'MIT Beaver Works RACECAR or NASA High School Aerospace Scholars (HAS)';
      competitionsAwards = `FIRST Robotics Competition (FRC) — Team Captain & Chief Mechanical Engineer (Regional Winners & Worlds Division Quarterfinalists)\nNational Invention Convention — Gold Medalist for Portable Water Filtration Mechanism\nSkillsUSA State Champion in CNC Milling & CAD`;
      projects = `Designed, machined, and programmed custom 6-axis robotic arm with sub-millimeter repeatable precision using ROS2 and inverse kinematics\nBuilt hybrid composite road-bicycle frame utilizing vacuum-bagged carbon fiber`;
      otherActivities = `Head of School Fabrication Lab & Mentor to 45 novice engineers\nTreasurer, Engineers Without Borders High School Chapter\nRock Climbing Club Founder`;
      keySpike = 'FRC Robotics Team Captain (Worlds Division Qualifiers) & National Invention Convention Gold Medal';

      grade9.push('Joined FRC Robotics build crew; learned SolidWorks 3D CAD modeling and manual lathe machining');
      grade10.push('Promoted to Mechanical Sub-Team Lead; designed custom 2-speed planetary gearbox for competition robot');
      grade11.push('Appointed FRC Team Captain; engineered robot scoring system leading team to Regional Championship & Worlds');
      grade11.push('Invented portable water purification mechanism; awarded Gold Medal at National Invention Convention');
      grade12.push('Completed wind tunnel analysis on airfoil morphing; published CAD models to open-source community');
    } else if (field === 'Economics & Quant Finance') {
      internshipWork = `Quantitative Research Intern — Systematic Trading Proprietary Desk / Hedge Fund Mentorship (Summer 2024)\nResearch Assistant — Federal Reserve Bank High School Academic Internship (2024)`;
      research = `Empirical econometric evaluation: "Impact of Central Bank Liquidity Injections on High-Frequency Cryptocurrency Volatility Spreads" (2024)\nAlgorithmic order book matching engine analysis`;
      summerPrograms = 'Wharton High School Leadership in the Business World (LBW) or PROMYS/SUMaC';
      competitionsAwards = `Wharton Global High School Investment Competition — Global Finalist (Top 10 Teams out of 1,200)\nNational Economics Challenge (NEC) — Adam Smith Division State Champion & 3rd Place National Finalist\nAIME Qualifier (Score: 8/15)\nHarvard Pre-Collegiate Economics Bowl Winner`;
      projects = `Developed high-performance backtesting framework in C++ and Python supporting limit order book tick replay\nBuilt interactive economic policy simulator visualizing Phillips Curve dynamics and monetary policy shifts`;
      otherActivities = `President, School Economics and Investment Society (managing $15,000 student endowment simulation)\nCaptain, Policy Debate Team (State Champion & TOC Qualifier)\nVarsity Cross Country Runner`;
      keySpike = 'Wharton Global Investment Finalist, National Economics Challenge 3rd Place & AIME Qualifier';

      grade9.push('Read Mankiw and Hull; mastered Python data structures and pandas statistical modeling');
      grade10.push('Led school investment club; qualified for State Finals in National Economics Challenge; took AMC 10');
      grade11.push('Earned AIME qualification; placed 3rd Nationally in National Economics Challenge Adam Smith division');
      grade11.push('Ranked Global Finalist in Wharton Investment Competition; wrote econometric volatility paper');
      grade12.push('Interned at systematic trading proprietary desk; captained debate team to Tournament of Champions');
    } else {
      // Physical Sciences, Pure Math, or Humanities
      internshipWork = `Archival Research Fellow — University Humanities Center or Physics Observatory (2024)\nEditorial Assistant — Regional Law and Policy Review (2023–2024)`;
      research = `Authored monograph on comparative constitutional jurisprudence in developing legal systems (2024)\nOr: Experimental spectroscopic analysis of variable stars`;
      summerPrograms = pick(['Telluride Association Summer Program (TASP/TASS)', 'Stanford High School Summer College', 'SSP in Astrophysics']);
      competitionsAwards = `National Speech & Debate Tournament (NSDA) — National Finalist in Lincoln-Douglas Debate\nScholastic Art & Writing Awards — 2x National Gold Medal Winner\nJohn Locke Institute Global Essay Prize — Very High Commendation\nAIME / Olympiad Recognition`;
      projects = `Founded peer-reviewed humanities and science synthesis review featuring submissions from 32 states\nAuthored 75-page historical deep-dive into Cold War scientific diplomacy`;
      otherActivities = `Student Body President (represented 2,200 students in board negotiations)\nEditor-in-Chief, School Literary Magazine (Pacemaker Award Finalist)\nVarsity Mock Trial Captain`;
      keySpike = 'NSDA National Finalist in Debate, 2x Scholastic National Gold Medal & John Locke Prize';

      grade9.push('Joined debate and literary journal; won regional novice tournaments; read foundational primary texts');
      grade10.push('Earned first Scholastic Art & Writing Gold Key; qualified for State Speech & Debate championships');
      grade11.push('Won 2x Scholastic National Gold Medals at Carnegie Hall; named Very High Commendation in John Locke Prize');
      grade11.push('Reached National Finals in Lincoln-Douglas Debate; elected Student Body President');
      grade12.push('Published historical monograph; expanded school journal to national distribution; applied to top institutions');
    }

    const admissionType = pick(['Early Action', 'Early Decision', 'Regular Decision', 'Oxbridge Direct'] as const);

    students.push({
      id: `admitted-cohort-1500-${String(i).padStart(4, '0')}`,
      name,
      university: uni.name,
      country: uni.country,
      universityRank: uni.rank,
      rankTier: uni.rankTier,
      linkedin: `https://linkedin.com/in/student-${i}`,
      course: `${field === 'Pre-Med & BioSciences' ? 'B.S. in Molecular Biology & Pre-Med' : field === 'Economics & Quant Finance' ? 'B.A. in Economics & Data Science' : `Bachelor of Science in ${field}`}`,
      fieldCategory: field,
      academicsPerformance,
      classOf,
      apTaken,
      actSat,
      languageTest: uni.country !== 'United States' && uni.country !== 'United Kingdom' ? 'TOEFL: 114 / IELTS 8.5' : '',
      internshipWork,
      research,
      summerPrograms,
      certificatesMoocs: 'CS50x, DeepLearning.AI Specialization, MITx 6.00.1x, Wharton FinTech Foundations',
      competitionsAwards,
      projects,
      otherActivities,
      notes: `Admitted via ${admissionType} with primary spike in ${keySpike.split('&')[0]?.trim() || 'Core Excellence'}. Strong dimensional spikes across all 6 MLS competencies.`,
      admissionType,
      profileArchetype: archetype,
      keySpike,
      gradeMilestones: {
        grade9,
        grade10,
        grade11,
        grade12,
      },
    });
  }

  return students;
}

import { rawAdmittedStudentsCSV } from './admittedStudentsRawCSV';
import { parseCSV } from '../utils/csvParser';

export function parseRealAdmittedCSV(): AdmittedStudentProfile[] {
  const rows = parseCSV(rawAdmittedStudentsCSV);
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const nameIdx = headers.findIndex((h) => h.includes('name'));
  const uniIdx = headers.findIndex((h) => h.includes('university'));
  const linkedinIdx = headers.findIndex((h) => h.includes('linkedin'));
  const courseIdx = headers.findIndex((h) => h.includes('course'));
  const acadIdx = headers.findIndex((h) => h.includes('academic'));
  const classIdx = headers.findIndex((h) => h.includes('class'));
  const apIdx = headers.findIndex((h) => h.includes('ap'));
  const satIdx = headers.findIndex((h) => h.includes('act') || h.includes('sat'));
  const langIdx = headers.findIndex((h) => h.includes('language'));
  const internIdx = headers.findIndex((h) => h.includes('intern') || h.includes('work'));
  const researchIdx = headers.findIndex((h) => h.includes('research'));
  const summerIdx = headers.findIndex((h) => h.includes('summer'));
  const certIdx = headers.findIndex((h) => h.includes('certificate') || h.includes('mooc'));
  const compIdx = headers.findIndex((h) => h.includes('competition') || h.includes('award'));
  const projIdx = headers.findIndex((h) => h.includes('project'));
  const otherIdx = headers.findIndex((h) => h.includes('other') || h.includes('activit'));
  const notesIdx = headers.findIndex((h) => h.includes('note'));

  const parsed: AdmittedStudentProfile[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const name = row[nameIdx]?.trim();
    if (!name) continue;

    const uniName = row[uniIdx]?.trim() || '';
    const norm = uniName.toLowerCase();

    let country = 'United States';
    let rank = 10;
    let rankTier: RankTier = 'Top 10';

    if (norm.includes('massachusetts institute of technology') || norm.includes('mit')) {
      country = 'United States'; rank = 1; rankTier = 'Top 5';
    } else if (norm.includes('cambridge')) {
      country = 'United Kingdom'; rank = 2; rankTier = 'Top 5';
    } else if (norm.includes('oxford')) {
      country = 'United Kingdom'; rank = 3; rankTier = 'Top 5';
    } else if (norm.includes('harvard')) {
      country = 'United States'; rank = 4; rankTier = 'Top 5';
    } else if (norm.includes('stanford')) {
      country = 'United States'; rank = 5; rankTier = 'Top 5';
    } else if (norm.includes('imperial')) {
      country = 'United Kingdom'; rank = 6; rankTier = 'Top 10';
    } else if (norm.includes('eth zurich')) {
      country = 'Switzerland'; rank = 7; rankTier = 'Top 10';
    } else if (norm.includes('national university of singapore') || norm.includes('nus')) {
      country = 'Singapore'; rank = 8; rankTier = 'Top 10';
    } else if (norm.includes('ucl') || norm.includes('university college london')) {
      country = 'United Kingdom'; rank = 9; rankTier = 'Top 10';
    } else if (norm.includes('caltech') || norm.includes('california institute of technology')) {
      country = 'United States'; rank = 10; rankTier = 'Top 10';
    } else if (norm.includes('pennsylvania') || norm.includes('wharton')) {
      country = 'United States'; rank = 11; rankTier = 'Top 25';
    } else if (norm.includes('berkeley')) {
      country = 'United States'; rank = 12; rankTier = 'Top 25';
    } else if (norm.includes('melbourne')) {
      country = 'Australia'; rank = 13; rankTier = 'Top 25';
    } else if (norm.includes('cornell')) {
      country = 'United States'; rank = 14; rankTier = 'Top 25';
    } else if (norm.includes('nanyang') || norm.includes('ntu')) {
      country = 'Singapore'; rank = 15; rankTier = 'Top 25';
    } else if (norm.includes('toronto')) {
      country = 'Canada'; rank = 16; rankTier = 'Top 25';
    } else if (norm.includes('princeton')) {
      country = 'United States'; rank = 17; rankTier = 'Top 25';
    } else if (norm.includes('yale')) {
      country = 'United States'; rank = 18; rankTier = 'Top 25';
    } else if (norm.includes('columbia')) {
      country = 'United States'; rank = 19; rankTier = 'Top 25';
    } else if (norm.includes('chicago')) {
      country = 'United States'; rank = 20; rankTier = 'Top 25';
    } else if (norm.includes('carnegie mellon') || norm.includes('cmu')) {
      country = 'United States'; rank = 21; rankTier = 'Top 25';
    } else if (norm.includes('johns hopkins')) {
      country = 'United States'; rank = 22; rankTier = 'Top 25';
    } else if (norm.includes('edinburgh')) {
      country = 'United Kingdom'; rank = 23; rankTier = 'Top 25';
    } else if (norm.includes('epfl')) {
      country = 'Switzerland'; rank = 24; rankTier = 'Top 25';
    } else if (norm.includes('hong kong') || norm.includes('hku') || norm.includes('hkust')) {
      country = 'Hong Kong'; rank = 25; rankTier = 'Top 25';
    } else if (norm.includes('michigan')) {
      country = 'United States'; rank = 28; rankTier = 'Top 50';
    } else if (norm.includes('ucla')) {
      country = 'United States'; rank = 29; rankTier = 'Top 50';
    } else if (norm.includes('mcgill')) {
      country = 'Canada'; rank = 30; rankTier = 'Top 50';
    } else if (norm.includes('king')) {
      country = 'United Kingdom'; rank = 32; rankTier = 'Top 50';
    } else if (norm.includes('georgia tech')) {
      country = 'United States'; rank = 33; rankTier = 'Top 50';
    } else if (norm.includes('sydney') || norm.includes('unsw')) {
      country = 'Australia'; rank = 34; rankTier = 'Top 50';
    } else if (norm.includes('purdue')) {
      country = 'United States'; rank = 35; rankTier = 'Top 50';
    } else if (norm.includes('british columbia') || norm.includes('ubc')) {
      country = 'Canada'; rank = 36; rankTier = 'Top 50';
    } else if (norm.includes('manchester')) {
      country = 'United Kingdom'; rank = 48; rankTier = 'Top 50';
    } else if (norm.includes('bristol')) {
      country = 'United Kingdom'; rank = 90; rankTier = 'Top 100';
    } else if (norm.includes('texas')) {
      country = 'United States'; rank = 75; rankTier = 'Top 100';
    } else if (norm.includes('washington')) {
      country = 'United States'; rank = 72; rankTier = 'Top 100';
    }

    const course = row[courseIdx]?.trim() || 'Computer Science';
    let fieldCategory = 'Computer Science & AI';
    const cNorm = course.toLowerCase();
    if (cNorm.includes('bio') || cNorm.includes('med') || cNorm.includes('health') || cNorm.includes('physiol')) {
      fieldCategory = 'Pre-Med & BioSciences';
    } else if (cNorm.includes('econ') || cNorm.includes('finance') || cNorm.includes('business') || cNorm.includes('quant')) {
      fieldCategory = 'Economics & Quant Finance';
    } else if (cNorm.includes('engineer') || cNorm.includes('mech') || cNorm.includes('aero') || cNorm.includes('robot')) {
      fieldCategory = 'Engineering & Robotics';
    } else if (cNorm.includes('math') || cNorm.includes('physics')) {
      fieldCategory = 'Physical Sciences & Math';
    } else if (cNorm.includes('law') || cNorm.includes('politic') || cNorm.includes('histor') || cNorm.includes('sociolog')) {
      fieldCategory = 'Humanities & Social Sciences';
    }

    const research = row[researchIdx]?.trim() || '';
    const awards = row[compIdx]?.trim() || '';
    const projects = row[projIdx]?.trim() || '';

    let keySpike = awards.split('\n')[0]?.trim() || research.split('\n')[0]?.trim() || projects.split('\n')[0]?.trim() || 'Core Rigor & Research Excellence';
    if (keySpike.length > 90) keySpike = keySpike.slice(0, 90) + '...';

    parsed.push({
      id: `real-1500-${i}`,
      name,
      university: uniName || 'Top University',
      country,
      universityRank: rank,
      rankTier,
      course,
      fieldCategory,
      academicsPerformance: row[acadIdx]?.trim() || '',
      classOf: row[classIdx]?.trim() || '2028',
      apTaken: row[apIdx]?.trim() || '',
      actSat: row[satIdx]?.trim() || '',
      languageTest: row[langIdx]?.trim() || '',
      internshipWork: row[internIdx]?.trim() || '',
      research,
      summerPrograms: row[summerIdx]?.trim() || '',
      certificatesMoocs: row[certIdx]?.trim() || '',
      competitionsAwards: awards,
      projects,
      otherActivities: row[otherIdx]?.trim() || '',
      notes: row[notesIdx]?.trim() || '',
      linkedin: row[linkedinIdx]?.trim() || '',
      admissionType: 'Regular Decision',
      profileArchetype: research ? 'The Pure Researcher' : awards ? 'The Olympiad Prodigy' : 'The Tech Builder & Founder',
      keySpike,
      gradeMilestones: {
        grade9: ['Established foundational honors coursework', 'Joined competitive STEM/debate activities'],
        grade10: ['Advanced contest preparation', 'Pursued university lab research inquiry'],
        grade11: ['Achieved regional/national competition distinction', 'Completed flagship independent project'],
        grade12: ['Curated comprehensive admissions portfolio', 'Finalized early action/decision submission'],
      },
    });
  }

  return parsed;
}

// In-memory cached dataset of admitted students
let cached1500Students: AdmittedStudentProfile[] | null = null;

export function getAdmittedCohort1500(): AdmittedStudentProfile[] {
  if (cached1500Students && cached1500Students.length >= 100) {
    return cached1500Students;
  }

  // First, parse the real student records from the user-provided CSV
  const realStudents = parseRealAdmittedCSV();

  // Combine with synthetic benchmarks to ensure complete coverage of all country/tier permutations
  const syntheticCohort = generateAdmittedCohort1500();
  const combined = [...realStudents, ...syntheticCohort.slice(realStudents.length)];

  cached1500Students = combined;
  return cached1500Students;
}

export function saveCustom1500Cohort(customCohort: AdmittedStudentProfile[]): void {
  cached1500Students = customCohort;
  try {
    localStorage.setItem('uppseekers_admitted_1500_custom', JSON.stringify(customCohort));
  } catch {
    // ignore
  }
}

export function resetDefault1500Cohort(): void {
  try {
    localStorage.removeItem('uppseekers_admitted_1500_custom');
    localStorage.removeItem('uppseekers_1500_sheet_url');
  } catch {
    // ignore
  }
  cached1500Students = generateAdmittedCohort1500();
}
