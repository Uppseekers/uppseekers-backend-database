import React, { useState, useMemo } from 'react';
import {
  Compass,
  Printer,
  BookOpen,
  Target,
  FlaskConical,
  Trophy,
  Briefcase,
  Award,
  Layers,
  Globe2,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
} from 'lucide-react';
import {
  AdmittedStudentProfile,
  AspiringStudentBaseline,
  AspiringStudentTarget,
  RankTier,
  StudentProfile,
} from '../../types';
import {
  SAMPLE_ASPIRING_PROFILES,
  generateBackEngineeredPath,
  detectProfileCompletedActivities,
} from '../../utils/roadmapEngine';
import { TOP_UNIVERSITIES, UniversityMeta } from '../../data/admittedStudents1500';
import { SpiderChart, CustomSpiderEvaluation } from '../SpiderChart';
import { AspiringStudentUploader } from './AspiringStudentUploader';
import { TrajectoryTwoLineChart } from './TrajectoryTwoLineChart';
import {
  SupercurricularMilestonesView,
  getMilestoneCountForTier,
} from './SupercurricularMilestonesView';
import { UniversityAdmissionsSummary } from './UniversityAdmissionsSummary';
import { AspirantReportDrawer } from './AspirantReportDrawer';
import {
  triggerDossierPrint,
  generatePrintableDossierHTML,
  downloadDossierHTML,
} from '../../utils/printReport';

interface BackEngineeredRoadmapViewProps {
  cohort1500: AdmittedStudentProfile[];
  onInspectStudent?: (student: StudentProfile) => void;
}

const TIER_OPTIONS: {
  tier: RankTier;
  label: string;
  sublabel: string;
  rankRange: string;
}[] = [
  { tier: 'Top 5', label: 'Top 5', sublabel: 'Elite Global Pinnacle', rankRange: 'QS 1–5' },
  { tier: 'Top 10', label: 'Top 10', sublabel: 'World-Leading Research', rankRange: 'QS 6–10' },
  { tier: 'Top 25', label: 'Top 25', sublabel: 'High-Impact Flagships', rankRange: 'QS 11–25' },
  { tier: 'Top 50', label: 'Top 50', sublabel: 'Major Global Institutions', rankRange: 'QS 26–50' },
  { tier: 'Top 100', label: 'Top 100', sublabel: 'Competitive International', rankRange: 'QS 51–100' },
];

export const BackEngineeredRoadmapView: React.FC<BackEngineeredRoadmapViewProps> = ({
  cohort1500,
  onInspectStudent,
}) => {
  // Aspiring student target and baseline profile
  const [target, setTarget] = useState<AspiringStudentTarget>(
    SAMPLE_ASPIRING_PROFILES[0].target
  );
  const [baseline, setBaseline] = useState<AspiringStudentBaseline>(
    SAMPLE_ASPIRING_PROFILES[0].baseline
  );

  // Aspirant Report Drawer state
  const [isReportDrawerOpen, setIsReportDrawerOpen] = useState(false);
  const [reportDrawerTab, setReportDrawerTab] = useState<'preview' | 'gap_analysis' | 'markdown'>('preview');
  const [milestonesMeta, setMilestonesMeta] = useState<{ total: number; completed: number }>({
    total: getMilestoneCountForTier(target.targetRankTier),
    completed: 0,
  });

  // Filter available universities based on selected target rank tier and country
  const universitiesInActiveTier = useMemo(() => {
    return TOP_UNIVERSITIES.filter((uni) => {
      const matchTier =
        target.targetRankTier === 'Top 100'
          ? true
          : target.targetRankTier === 'Top 50'
          ? uni.rank <= 50
          : target.targetRankTier === 'Top 25'
          ? uni.rank <= 25
          : target.targetRankTier === 'Top 10'
          ? uni.rank <= 10
          : uni.rank <= 5;

      const matchCountry =
        target.targetCountry === 'All Global' ||
        uni.country.toLowerCase() === target.targetCountry.toLowerCase() ||
        (target.targetCountry === 'United States' && uni.country === 'United States') ||
        (target.targetCountry === 'United Kingdom' && uni.country === 'United Kingdom');

      return matchTier && matchCountry;
    });
  }, [target.targetRankTier, target.targetCountry]);

  // Generate the reverse engineered analytics path
  const pathData = useMemo(() => {
    return generateBackEngineeredPath(target, baseline, cohort1500);
  }, [target, baseline, cohort1500]);

  // Exact 6-Dimensional Radar Custom Evaluation matching pathData.cohortBenchmarks and pathData.aspirantScores
  const radarCustomEvaluations: CustomSpiderEvaluation[] = useMemo(() => {
    return [
      {
        studentId: 'aspirant-profile',
        studentName: `${target.studentName} (Current Profile)`,
        compositeScore: pathData.aspirantScores.compositeScore,
        totalPoints: pathData.aspirantScores.totalPoints,
        dimensions: [
          {
            key: 'problemSolving',
            label: 'Problem Solving',
            score: pathData.aspirantScores.problemSolving,
            evidence: `Contests, mathematical modeling, contest percentiles: ${pathData.aspirantScores.problemSolving}/100 pts`,
          },
          {
            key: 'technicalSkills',
            label: 'Technical Skills',
            score: pathData.aspirantScores.technicalSkills,
            evidence: `Applied engineering, code implementations, lab assays: ${pathData.aspirantScores.technicalSkills}/100 pts`,
          },
          {
            key: 'criticalThinking',
            label: 'Critical Thinking',
            score: pathData.aspirantScores.criticalThinking,
            evidence: `Scholarly inquiry, analytical literature synthesis: ${pathData.aspirantScores.criticalThinking}/100 pts`,
          },
          {
            key: 'teamWork',
            label: 'Team Work',
            score: pathData.aspirantScores.teamWork,
            evidence: `Team robotics, hackathons, lab co-investigation: ${pathData.aspirantScores.teamWork}/100 pts`,
          },
          {
            key: 'communication',
            label: 'Communication',
            score: pathData.aspirantScores.communication,
            evidence: `Debate, essay treatises, symposium presentations: ${pathData.aspirantScores.communication}/100 pts`,
          },
          {
            key: 'creativity',
            label: 'Creativity',
            score: pathData.aspirantScores.creativity,
            evidence: `Venture creation, novel engineering, artistic synthesis: ${pathData.aspirantScores.creativity}/100 pts`,
          },
        ],
      },
      {
        studentId: 'required-target-profile',
        studentName: `${target.targetRankTier} Benchmark (${target.targetCountry})`,
        compositeScore: pathData.cohortBenchmarks.compositeScore,
        totalPoints: pathData.cohortBenchmarks.totalPoints,
        dimensions: [
          {
            key: 'problemSolving',
            label: 'Problem Solving',
            score: pathData.cohortBenchmarks.problemSolving,
            evidence: `${target.targetRankTier} ${target.targetCountry} requirement: ${pathData.cohortBenchmarks.problemSolving}/100 pts`,
          },
          {
            key: 'technicalSkills',
            label: 'Technical Skills',
            score: pathData.cohortBenchmarks.technicalSkills,
            evidence: `${target.targetRankTier} ${target.targetCountry} requirement: ${pathData.cohortBenchmarks.technicalSkills}/100 pts`,
          },
          {
            key: 'criticalThinking',
            label: 'Critical Thinking',
            score: pathData.cohortBenchmarks.criticalThinking,
            evidence: `${target.targetRankTier} ${target.targetCountry} requirement: ${pathData.cohortBenchmarks.criticalThinking}/100 pts`,
          },
          {
            key: 'teamWork',
            label: 'Team Work',
            score: pathData.cohortBenchmarks.teamWork,
            evidence: `${target.targetRankTier} ${target.targetCountry} requirement: ${pathData.cohortBenchmarks.teamWork}/100 pts`,
          },
          {
            key: 'communication',
            label: 'Communication',
            score: pathData.cohortBenchmarks.communication,
            evidence: `${target.targetRankTier} ${target.targetCountry} requirement: ${pathData.cohortBenchmarks.communication}/100 pts`,
          },
          {
            key: 'creativity',
            label: 'Creativity',
            score: pathData.cohortBenchmarks.creativity,
            evidence: `${target.targetRankTier} ${target.targetCountry} requirement: ${pathData.cohortBenchmarks.creativity}/100 pts`,
          },
        ],
      },
    ];
  }, [
    target.studentName,
    target.targetRankTier,
    target.targetCountry,
    pathData.aspirantScores,
    pathData.cohortBenchmarks,
  ]);

  // Construct dummy StudentProfile for Spider Chart visualization
  const studentForRadar: StudentProfile = {
    id: 'aspirant-profile',
    name: `${target.studentName} (Current Profile)`,
    university: target.targetUniversity || `${target.targetRankTier} Target`,
    course: target.targetField,
    classOf: target.targetClassOf,
    linkedin: '',
    academicsPerformance: baseline.gpaRigor,
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

  // Required Profile Calibration (Calibrated per Tier, Target Country & Discipline)
  const requiredProfile = useMemo(() => {
    const isTop5 = target.targetRankTier === 'Top 5';
    const isTop10 = target.targetRankTier === 'Top 10' || isTop5;
    const isTop25 = target.targetRankTier === 'Top 25';
    const isTop50 = target.targetRankTier === 'Top 50';

    const c = target.targetCountry.toLowerCase();
    const isUK = c.includes('united kingdom') || c.includes('uk') || c.includes('britain');
    const isUS = c.includes('united states') || c.includes('us');
    const isCanada = c.includes('canada');
    const isSingapore = c.includes('singapore');
    const isSwitzerland = c.includes('switzerland') || c.includes('europe');
    const isAustralia = c.includes('australia');

    const f = target.targetField.toLowerCase();
    const isCS = f.includes('cs') || f.includes('computer') || f.includes('software');
    const isEngineering = !isCS && (f.includes('engineer') || f.includes('robot') || f.includes('aerospace'));
    const isPreMed = f.includes('pre-med') || f.includes('med') || f.includes('bio') || f.includes('health');
    const isEcon = f.includes('econ') || f.includes('finance') || f.includes('business') || f.includes('quant');
    const isLaw = f.includes('law') || f.includes('policy') || f.includes('relation') || f.includes('gov') || f.includes('history');
    const isPhysicsMath = f.includes('phys') || f.includes('math');

    if (isUK) {
      return {
        countryAdmissionModel: 'United Kingdom Admissions Standard (UCAS & Oxbridge Criteria)',
        academicBar: isTop5
          ? 'Predicted 42–44/45 in IB Diploma (with 7, 7 in Higher Level core subjects) or A*A*A* at A-Level in required discipline'
          : isTop10
          ? 'Predicted 40–42/45 in IB (with 7, 6 in HL) or A*A*A at A-Level in relevant subjects'
          : isTop25
          ? 'Predicted 38–40/45 in IB or A*AA at A-Level with strong subject alignment'
          : isTop50
          ? 'Predicted 36–38/45 in IB or AAA at A-Level'
          : 'Predicted 34–36/45 in IB or AAB at A-Level',
        testingBar: isTop5
          ? 'Cambridge ESAT / TMUA (Score 7.0+), Oxford PAT/MAT, STEP 1 & 2 (Grade 1/S), or UCAT (3100+ Band 1)'
          : isTop10
          ? 'TMUA (6.5+), Oxford TSA (70+), STEP 2/3, or UCAT (2950+ Band 1/2)'
          : isTop25
          ? 'Course Admissions Assessment (TMUA / UCAT / LNAT) top quartile score'
          : 'Standard admissions entrance exam or GCSE subject profile verification',
        supercurriculars: {
          research: isTop5
            ? '5,000-word Extended Project Qualification (EPQ) graded A*, faculty bibliography scholarly critiques, or paper in Young Scientists journal'
            : isTop10
            ? 'Structured EPQ (Grade A) or independent extended essay exploring university-level literature'
            : 'Independent subject inquiry notebook, essay competition submission, or critical reading digest',
          competitions: isTop5
            ? 'British Physics Olympiad (BPhO) Senior Gold, UKMT Senior Maths Challenge Gold & Maclaurin distinction, or Cambridge Chemistry Challenge Roentgenium'
            : isTop10
            ? 'UKMT Senior Gold / Kangaroo qualifier, BPhO Senior Challenge Silver, or British Biology Olympiad Silver'
            : 'UKMT Senior Silver or regional subject challenge participant',
          internships: isTop5
            ? 'University faculty research laboratory shadowing (In2scienceUK, Sutton Trust), or hospital clinical shadowing (60+ hrs)'
            : isTop10
            ? 'University department summer research placement or engineering firm apprenticeship'
            : 'Local professional shadowing or university public research colloquium attendance',
          certifications: isTop5
            ? 'Oxford/Cambridge faculty recommended reading list synthesis and advanced proof/calculus credentials'
            : 'Advanced subject MOOC credentials or Royal Society of Chemistry / IOP modules',
          leadership: isTop5
            ? `Head of Academic Subject Society in ${target.targetField}, student academic journal editor, or peer tutorial mentor (Note: UCAS explicitly ignores generic sports captaincy or unrelated volunteering)`
            : 'School subject club executive or academic debate society leader',
        },
        executiveConclusion: isTop5
          ? `UK elite admissions (Oxford, Cambridge, Imperial) prioritize supercurricular depth and academic purity over general well-roundedness. 80%+ of UCAS personal statements must focus on scholarly exploration. Tutors assess tutorial dialogue readiness and admissions test cutoffs (ESAT/TMUA/STEP). Generic volunteering or sports are de-emphasized.`
          : isTop10
          ? `Russell Group Top 10 institutions require focused supercurricular reading and high admissions assessment percentiles in ${target.targetField}.`
          : `UK admissions focus heavily on predicted grades in relevant prerequisite subjects and demonstrated subject enthusiasm.`,
      };
    }

    if (isCanada) {
      return {
        countryAdmissionModel: 'Canada Admissions Standard (Academic Rigor & Co-op Builders)',
        academicBar: isTop5
          ? 'Top 6 Grade 12 Average: 97%+ with 98%+ in Advanced Functions, Calculus and required Sciences'
          : isTop10
          ? 'Top 6 Grade 12 Average: 95%+ with solid mathematical consistency'
          : 'Top 6 Grade 12 Average: 92%+ with rigorous STEM/Humanities core',
        testingBar: 'Waterloo Euclid Mathematics Contest (Top 25% Honor Roll) and Canadian Computing Competition (CCC Senior)',
        supercurriculars: {
          research: 'Applied engineering prototypes, open-source repositories with active users, or local lab inquiry',
          competitions: 'Waterloo Euclid Distinction, Canadian Senior Mathematics Contest (CSMC), or regional hackathons',
          internships: 'Tech startup software engineering internship or engineering fabrication fellowship',
          certifications: 'CS50, Coursera Data Science, or SolidWorks CAD digital fabrication',
          leadership: 'Robotics sub-team lead, hackathon organizer, or STEM community outreach',
        },
        executiveConclusion: 'Canadian flagships (Toronto, Waterloo, McGill) prioritize high numerical grades combined with demonstrable applied engineering and co-op builder capability.',
      };
    }

    if (isSingapore) {
      return {
        countryAdmissionModel: 'Singapore Admissions Standard (Percentile & Olympiad Meritocracy)',
        academicBar: 'Straight As in Singapore-Cambridge GCE A-Levels (90 Rank Points) with H3 distinction or IB 44+',
        testingBar: 'Singapore Math Olympiad (SMO Open Gold), National Olympiads (SJPO/SChO), and University Aptitude assessments',
        supercurriculars: {
          research: 'A*STAR research attachment, university laboratory apprenticeship, or published science fair monograph',
          competitions: 'Singapore Math Olympiad (SMO), Singapore Physics Olympiad (SPhO), or National Science Talent Search',
          internships: 'Agency for Science, Technology and Research (A*STAR) or hospital junior research attachment',
          certifications: 'Advanced algorithms, multivariable mathematics, or university pre-matriculation modules',
          leadership: 'Student council executive, uniformed groups pinnacle badge, or national youth leadership',
        },
        executiveConclusion: 'Singapore universities (NUS, NTU) operate on strict meritocratic cutoffs and Olympiad percentiles; near-perfect academic percentiles are essential.',
      };
    }

    if (isSwitzerland) {
      return {
        countryAdmissionModel: 'Switzerland & Europe Admissions Standard (Formal Examination Rigor)',
        academicBar: 'Swiss Federal Matura or equivalent European examination with grade 5.8+ / 6.0 in Mathematics and Physics',
        testingBar: 'ETH Zurich / EPFL Comprehensive Entrance Examinations and European Physics/Math Olympiad medals',
        supercurriculars: {
          research: 'Computational physics/astrophysics simulation or university mathematics institute paper',
          competitions: 'Swiss Olympiad in Informatics, European Physics Olympiad, or Swiss Mathematical Olympiad',
          internships: 'ETH/EPFL research lab assistant or CERN visitor program apprenticeship',
          certifications: 'Advanced linear algebra, multivariable calculus, and LaTeX scientific typesetting',
          leadership: 'Academic problem seminar founder or math enrichment circle lead',
        },
        executiveConclusion: 'European pinnacles (ETH Zurich, EPFL) test pure theoretical and mathematical endurance under formal examination conditions.',
      };
    }

    if (isAustralia) {
      return {
        countryAdmissionModel: 'Australia Admissions Standard (Direct ATAR Rank Entry)',
        academicBar: 'ATAR 99.00+ (or IB 42+) direct entry cutoff for flagship engineering, law, and medical programs',
        testingBar: 'Prerequisite subject cutoffs and UCAT ANZ (90th+ percentile for medicine)',
        supercurriculars: {
          research: 'Independent university inquiry, extended investigation, or premier science fair submission',
          competitions: 'Australian Mathematics Competition (AMC) High Distinction or Australian Science Olympiads',
          internships: 'Hospital volunteering (50+ hours) or university engineering faculty shadowing',
          certifications: 'University micro-credentials or mathematics extension certificates',
          leadership: 'School prefect, house captain, or community service initiative leader',
        },
        executiveConclusion: 'Australian universities prioritize direct rank criteria (ATAR percentiles) alongside prerequisite subject mastery.',
      };
    }

    // Default: United States & All Global (Holistic & Angular Review)
    return {
      countryAdmissionModel: isUS
        ? 'United States Admissions Standard (Holistic & Angular Review)'
        : 'Global Selective Admissions Standard',
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
        ? 'SAT: 1540–1600 (Math 790+ for STEM, ERW 770+ for Humanities) or ACT: 35–36'
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
            : isTop10
            ? 'Structured laboratory paper under university medical faculty or regional ISEF award in Biochemistry'
            : 'Independent inquiry paper, clinical review, or local science fair finalist'
          : isEcon
          ? isTop5
            ? 'Empirical econometric working paper on SSRN, National Economics Challenge finalist, or Federal Reserve Challenge presentation'
            : isTop10
            ? 'Quantitative financial research paper under faculty mentorship or state economics award'
            : 'Independent market regression study or investment club research digest'
          : isEngineering
          ? isTop5
            ? 'First-author paper (IEEE/arXiv), provisional patent application, or ISEF Grand Award in Engineering Mechanics / Robotics'
            : isTop10
            ? 'Working physical mechanism with CAD stress analyses under university engineering mentorship'
            : 'Documented robotics capstone or local maker fair grand prize'
          : isLaw
          ? isTop5
            ? 'Published 6,000-word treatise in The Concord Review, John Locke Global Essay distinction, or municipal policy whitepaper'
            : isTop10
            ? 'State student journalism award, National History Day state medal, or published civic editorial series'
            : 'Independent policy brief or high school journal analytical essay'
          : isPhysicsMath
          ? isTop5
            ? 'Theoretical physics/math preprint on arXiv, MIT PRIMES submission, or Regeneron Science Talent Search scholar'
            : isTop10
            ? 'Computational astrophysics simulation paper or journal problem solution publication'
            : 'Independent math inquiry or proof notebook presentation'
          : isTop5
          ? 'First-author or primary contributor on preprint (arXiv/IEEE) or ISEF Grand Award finalist in Systems Software'
          : isTop10
          ? 'Structured research paper under university faculty mentorship or regional ISEF award'
          : 'Independent inquiry project, open-source documentation, or advanced capstone presentation',
        competitions: isPreMed
          ? isTop5
            ? 'USABO National Semifinalist (Top 10%), HOSA International Gold Medal, or Science Olympiad State Gold'
            : isTop10
            ? 'USABO Top 20% nationwide score, State HOSA Medical Innovation winner, or Brain Bee finalist'
            : 'Regional HOSA or local science competition participant'
          : isEcon
          ? isTop5
            ? 'National Economics Challenge Adam Smith National Finals, Wharton Global High School Investment Top 10, or AMC 10/12 AIME qualifier'
            : isTop10
            ? 'NEC State Finals Champion, Wharton Investment semi-finalist, or regional business case competition gold'
            : 'Local investment club challenge participant or novice debate competitor'
          : isEngineering
          ? isTop5
            ? 'FIRST Robotics Dean’s List Finalist, British Physics Olympiad Senior Gold, or NASA Student Launch finalist'
            : isTop10
            ? 'BPhO Senior Physics Challenge Silver, FRC Regional Subsystem Lead, or State Science Olympiad medalist'
            : 'Regional robotics or TSA TEAMS engineering competitor'
          : isLaw
          ? isTop5
            ? 'NSDA National Speech & Debate Tournament Qualifier, Model UN Best Delegate Gavels, or John Locke Essay Commendation'
            : isTop10
            ? 'State Speech & Debate Tournament Finalist or collegiate Model UN outstanding delegate'
            : 'Regional debate participant or local Model UN delegation member'
          : isPhysicsMath
          ? isTop5
            ? 'USAMO / USAJMO Qualifier, AIME score 8+, or USAPhO Semifinalist Medalist'
            : isTop10
            ? 'AIME Qualifier via AMC 10/12, USAPhO F=ma top 10% nationwide, or HMMT top 10%'
            : 'AMC 10 score 85+ or PhysicsBowl participant'
          : isTop5
          ? 'AIME Qualifier (Score 7+), USACO Gold/Platinum, or international hackathon championship'
          : isTop10
          ? 'AIME Qualifier, USACO Gold, or State Science Olympiad Gold'
          : 'USACO Silver or regional STEM competition finalist',
        internships: isPreMed
          ? isTop5
            ? 'Selective medical research institute (Stanford SIMR, Garcia Center, NIH Summer Internship) or hospital clinical trial shadowing'
            : isTop10
            ? 'University hospital faculty lab apprenticeship or biomedical laboratory research assistant'
            : 'Local hospital volunteering (60+ hours logged) or clinical practice shadowing'
          : isEcon
          ? isTop5
            ? 'Wharton Leadership in the Business World (LBW), Bank of America Student Leader, or boutique investment advisory fellow'
            : isTop10
            ? 'Economic consultancy, wealth management summer apprenticeship, or credit union financial fellow'
            : 'Local credit union, community non-profit, or business operations volunteer'
          : isEngineering
          ? isTop5
            ? 'MIT Beaver Works Summer Institute, SSP Engineering, or university robotics lab fellow'
            : isTop10
            ? 'University mechanical engineering lab apprenticeship or hardware startup prototyping fellow'
            : 'Local engineering firm shadowing or maker space apprentice'
          : isLaw
          ? isTop5
            ? 'United States Senate Page Program, Telluride Association (TASP), or Congressional district casework fellow'
            : isTop10
            ? 'State representative office fellowship, public defender clinic assistant, or municipal legal aid volunteer'
            : 'Civic non-profit intern or local court observer'
          : isPhysicsMath
          ? isTop5
            ? 'Research Science Institute (RSI), PROMYS, Ross Mathematics Program, or university physics department fellow'
            : isTop10
            ? 'Canada/USA Mathcamp, Boston University PROMYS Europe, or astrophysics observatory research assistant'
            : 'University math circle assistant or computational physics apprentice'
          : isTop5
          ? 'Selective merit summer institute (RSI, MIT Beaver Works, SSP, LaunchX) or tech startup software engineer'
          : isTop10
          ? 'University faculty research apprenticeship or technical startup engineering internship'
          : 'Structured university lab internship or tech/business apprenticeship',
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
          ? `Founder of scaled community initiative or 501(c)(3) in ${target.targetField} with verified 1,000+ participant reach`
          : isTop10
          ? `President of major school or district organization in ${target.targetField} with regional event organization`
          : isTop25
          ? 'Officer in 2+ school organizations or varsity athletics lead'
          : 'Active school club officer or team captain',
      },
      executiveConclusion: isTop5
        ? `Top 5 admission in ${target.targetField} requires an unmistakable "Angular Spike": perfect grades and test scores are merely the baseline ticket. Differentiators are verifiable external validation (national Olympiad selection, primary-author research preprint, or scaled community deployment).`
        : isTop10
        ? `Top 10 institutions seek proven scholastic endurance and high-percentile capability in ${target.targetField}. Students must demonstrate tangible independent inquiry outside the standard high school curriculum.`
        : isTop25
        ? `Top 25 universities look for strong academic consistency, deep involvement in 2–3 meaningful activities in ${target.targetField}, and clear evidence of intellectual vitality and institutional contribution.`
        : 'Focus on maintaining strong GPA trajectory, completing advanced coursework, and anchoring the profile with 1–2 structured projects or regional achievements.',
    };
  }, [target.targetRankTier, target.targetCountry, target.targetField]);

  // Benchmark student representing the required target curve on the radar
  const benchmarkStudent: StudentProfile = {
    id: 'required-target-profile',
    name: `Required Profile (${target.targetRankTier} Benchmark)`,
    university: target.targetUniversity || `${target.targetRankTier} Benchmark`,
    course: target.targetField,
    classOf: target.targetClassOf,
    linkedin: '',
    academicsPerformance: requiredProfile.academicBar,
    apTaken: 'Advanced placement / IB Higher Level core in target subject',
    actSat: requiredProfile.testingBar,
    languageTest: 'Proficient (TOEFL 110+ / IELTS 8.0+)',
    internshipWork: requiredProfile.supercurriculars.internships,
    research: requiredProfile.supercurriculars.research,
    summerPrograms: 'Competitive merit program or faculty lab',
    certificatesMoocs: requiredProfile.supercurriculars.certifications,
    competitionsAwards: requiredProfile.supercurriculars.competitions,
    projects: 'Verifiable open-source library or working prototype',
    otherActivities: requiredProfile.supercurriculars.leadership,
    notes: '',
  };

  const [downloadFeedback, setDownloadFeedback] = useState<string | null>(null);

  const handlePrintDossier = () => {
    setReportDrawerTab('preview');
    setIsReportDrawerOpen(true);
    triggerDossierPrint();
  };

  const handlePrintGapAnalysis = () => {
    setReportDrawerTab('gap_analysis');
    setIsReportDrawerOpen(true);
    triggerDossierPrint();
  };

  const handleDownloadFullReport = () => {
    const detected = detectProfileCompletedActivities(target, baseline);
    const html = generatePrintableDossierHTML({
      target,
      baseline,
      pathData,
      detectedActivities: detected,
      requiredProfile,
      isGapAnalysisOnly: false,
    });
    const filename = `${target.studentName.replace(/\s+/g, '_')}_Admissions_Diagnostic_Dossier.html`;
    downloadDossierHTML(filename, html);
    setDownloadFeedback(`Downloaded standalone report "${filename}"!`);
    setTimeout(() => setDownloadFeedback(null), 4000);
  };

  return (
    <div className="space-y-8 pb-16 print:space-y-4">
      {/* Download / Print Feedback Toast */}
      {downloadFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-xs print:hidden animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setDownloadFeedback(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer font-bold text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Editorial Research Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-200">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider mb-2">
              <span>Admissions Intelligence Memo</span>
              <span>·</span>
              <span>Calibrated against records from thousands of admitted students</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight mb-2">
              Back-Engineered Path for Aspiring Student
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Empirical diagnostic tool that models the exact profile requirements of your target university tier, calculates competency deficits across a 6-aspect radar, and charts your trajectory gap alongside a milestone-by-milestone supercurricular blueprint.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 print:hidden flex-wrap">
            <button
              type="button"
              onClick={() => {
                setReportDrawerTab('preview');
                setIsReportDrawerOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all cursor-pointer border border-indigo-700"
              title="Open interactive on-screen dossier and copyable markdown report"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Prepare Aspirant Report</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadFullReport}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors cursor-pointer border border-amber-600 shadow-2xs"
              title="Download standalone print-ready HTML report with all charts and sections (Admissions Philosophy module omitted)"
            >
              <Download className="w-3.5 h-3.5 text-stone-950" />
              <span>Download Report (HTML)</span>
            </button>
            <button
              type="button"
              onClick={handlePrintDossier}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-stone-900 text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer border border-stone-900 shadow-2xs"
              title="Print full admissions dossier report"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>

        {/* Quiet Diagnostic Overview Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
          <div>
            <div className="text-stone-500 text-[11px] uppercase tracking-wider">Candidate Profile</div>
            <div className="text-sm font-semibold text-stone-900 mt-0.5">{target.studentName}</div>
            <div className="text-stone-500 text-[11px]">{target.currentGrade} · {target.targetField}</div>
          </div>
          <div>
            <div className="text-stone-500 text-[11px] uppercase tracking-wider">Target Objective</div>
            <div className="text-sm font-semibold text-stone-900 mt-0.5">{target.targetRankTier} Tier</div>
            <div className="text-stone-500 text-[11px]">{target.targetUniversity || `${target.targetCountry} Target`}</div>
          </div>
          <div>
            <div className="text-stone-500 text-[11px] uppercase tracking-wider">Current Readiness</div>
            <div className="text-sm font-mono font-semibold text-stone-900 mt-0.5">{pathData.readinessScore}%</div>
            <div className="text-stone-500 text-[11px]">Empirical baseline score</div>
          </div>
          <div>
            <div className="text-stone-500 text-[11px] uppercase tracking-wider">Projected Trajectory</div>
            <div className="text-sm font-mono font-semibold text-stone-900 mt-0.5">{pathData.projectedReadinessScore}%</div>
            <div className="text-emerald-700 text-[11px] font-medium">+16% upon milestone execution</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Aspiring Student Profile Dossier (Upload / Review) */}
      <AspiringStudentUploader
        target={target}
        baseline={baseline}
        onUpdateTarget={setTarget}
        onUpdateBaseline={setBaseline}
      />

      {/* SECTION 2: UNIVERSITY TIER SELECTOR & TIER-BASED BENCHMARKS */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider mb-1">
            <span>Target Calibration</span>
            <span>·</span>
            <span>Governed by University Tier Standard</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
            Select University Tier Benchmark
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Requirements are standardized per university tier because admissions thresholds operate on cohort-level selectivity tiers.
          </p>
        </div>

        {/* TIER-BASED TABS (Primary Selector) */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
            1. University Tier Standard
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {TIER_OPTIONS.map((item) => {
              const isSelected = target.targetRankTier === item.tier;
              return (
                <button
                  key={item.tier}
                  type="button"
                  onClick={() => {
                    setTarget((prev) => ({
                      ...prev,
                      targetRankTier: item.tier,
                      targetUniversity: '', // Reset university selection when switching tier
                    }));
                  }}
                  className={`p-3.5 rounded-xl text-left transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-stone-900 text-stone-100 border-stone-900 shadow-xs'
                      : 'bg-stone-50/80 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    <span
                      className={`text-[10px] font-mono ${
                        isSelected ? 'text-stone-400' : 'text-stone-500'
                      }`}
                    >
                      {item.rankRange}
                    </span>
                  </div>
                  <div
                    className={`text-[11px] leading-snug ${
                      isSelected ? 'text-stone-300' : 'text-stone-500'
                    }`}
                  >
                    {item.sublabel}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECONDARY SELECTORS: Major Focus, Country Filter & Optional Specific Institution Tag */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-stone-100">
          {/* Intended Major / Academic Discipline */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-stone-500" />
                <span>Intended Major / Course</span>
              </span>
            </label>
            <select
              value={target.targetField}
              onChange={(e) => {
                setTarget((prev) => ({
                  ...prev,
                  targetField: e.target.value,
                }));
              }}
              className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-1 focus:ring-stone-900 font-medium text-stone-800"
            >
              <option value="Computer Science & AI">Computer Science & Artificial Intelligence</option>
              <option value="Pre-Med & BioSciences">Pre-Med, Biomedical Sciences & Healthcare</option>
              <option value="Mechanical & Aerospace Engineering">Mechanical & Aerospace Engineering</option>
              <option value="Economics & Quant Finance">Economics, Quantitative Finance & Business</option>
              <option value="Electrical Engineering & Robotics">Electrical Engineering & Robotics</option>
              <option value="Physics & Pure Mathematics">Physics, Astronomy & Pure Mathematics</option>
              <option value="Law, Policy & International Relations">Law, Public Policy & International Relations</option>
              <option value="Psychology & Cognitive Science">Psychology, Neuroscience & Cognitive Science</option>
              <option value="Chemistry & Materials Science">Chemistry, Biochemistry & Materials Science</option>
              <option value="Architecture & Urban Planning">Architecture & Spatial Design</option>
              <option value="Business Administration & Management">Business Administration & Management</option>
            </select>
          </div>

          {/* Target Country Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-stone-500" />
              <span>Target Country Focus</span>
            </label>
            <select
              value={target.targetCountry}
              onChange={(e) => {
                setTarget((prev) => ({
                  ...prev,
                  targetCountry: e.target.value,
                  targetUniversity: '',
                }));
              }}
              className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-1 focus:ring-stone-900 font-medium text-stone-800"
            >
              <option value="All Global">All Global Top Universities</option>
              <option value="United States">United States (Holistic & Angular Review)</option>
              <option value="United Kingdom">United Kingdom (Supercurricular & UCAS)</option>
              <option value="Canada">Canada (Academic Rigor & Co-op Builders)</option>
              <option value="Singapore">Singapore (Meritocratic & Percentile Cutoffs)</option>
              <option value="Switzerland">Switzerland & Europe (Examinations & Math Rigor)</option>
              <option value="Australia">Australia (Direct Grade Rank Entry)</option>
            </select>
          </div>

          {/* Optional University Tag within Tier */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-stone-500" />
              <span>Specific Institution (Optional within {target.targetRankTier})</span>
            </label>
            <select
              value={target.targetUniversity || ''}
              onChange={(e) => setTarget((prev) => ({ ...prev, targetUniversity: e.target.value }))}
              className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-1 focus:ring-stone-900 font-medium text-stone-800"
            >
              <option value="">-- Standard {target.targetRankTier} Cohort Benchmark --</option>
              {universitiesInActiveTier.map((uni) => (
                <option key={uni.name} value={uni.name}>
                  {uni.name} (#{uni.rank} · {uni.country})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* MEMBER INSTITUTIONS IN ACTIVE TIER (Clean Pill-Free Grouping) */}
        <div className="pt-2">
          <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider mb-2">
            Institutions in {target.targetRankTier} Cohort:
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-700">
            {universitiesInActiveTier.map((uni, idx) => {
              const isSelected = target.targetUniversity === uni.name;
              return (
                <button
                  key={uni.name}
                  type="button"
                  onClick={() => setTarget((prev) => ({ ...prev, targetUniversity: isSelected ? '' : uni.name }))}
                  className={`text-left text-xs transition-colors cursor-pointer py-1 ${
                    isSelected
                      ? 'font-bold text-stone-900 underline decoration-stone-900 underline-offset-4'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>{uni.name}</span>
                  <span className="text-stone-400 text-[11px] ml-1">#{uni.rank}</span>
                  {idx < universitiesInActiveTier.length - 1 && (
                    <span className="text-stone-300 ml-3" aria-hidden="true">·</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* EXECUTIVE DIAGNOSTIC MEMO: DIRECT BULLET-POINT FACTS */}
        <div className="p-5 sm:p-6 rounded-xl bg-stone-50/70 border border-stone-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
                Diagnostic Standard Memo
              </div>
              <h4 className="text-base font-serif font-bold text-stone-900">
                Required Profile for {target.targetUniversity || `${target.targetRankTier} Tier`}
              </h4>
            </div>
            <div className="text-xs font-mono text-stone-600 bg-white px-2.5 py-1 rounded border border-stone-200 self-start sm:self-auto">
              Empirical Admitted Thresholds
            </div>
          </div>

          {/* Bullet Points with Direct Bold Hooks */}
          <div className="space-y-2.5 text-xs text-stone-800">
            <div className="flex items-start gap-2">
              <span className="text-stone-400 select-none mt-0.5">•</span>
              <div>
                <strong className="text-stone-900 font-semibold">Academic Rigor Baseline: </strong>
                <span>{requiredProfile.academicBar}.</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-stone-400 select-none mt-0.5">•</span>
              <div>
                <strong className="text-stone-900 font-semibold">Standardized Testing Target: </strong>
                <span>{requiredProfile.testingBar}.</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-stone-400 select-none mt-0.5">•</span>
              <div>
                <strong className="text-stone-900 font-semibold">Supercurricular Research Standard: </strong>
                <span>{requiredProfile.supercurriculars.research}.</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-stone-400 select-none mt-0.5">•</span>
              <div>
                <strong className="text-stone-900 font-semibold">Competitions & Olympiads: </strong>
                <span>{requiredProfile.supercurriculars.competitions}.</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-stone-400 select-none mt-0.5">•</span>
              <div>
                <strong className="text-stone-900 font-semibold">Internships & Selective Programs: </strong>
                <span>{requiredProfile.supercurriculars.internships}.</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-stone-400 select-none mt-0.5">•</span>
              <div>
                <strong className="text-stone-900 font-semibold">Leadership & Community Scale: </strong>
                <span>{requiredProfile.supercurriculars.leadership}.</span>
              </div>
            </div>
          </div>

          {/* Concise Executive Takeaway */}
          <div className="pt-3 border-t border-stone-200 text-xs">
            <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider mb-1">
              Executive Conclusion & Admissions Verdict:
            </div>
            <p className="text-stone-700 leading-relaxed font-medium">
              {requiredProfile.executiveConclusion}
            </p>
          </div>
        </div>
      </div>

      {/* ADMISSIONS INTELLIGENCE SUMMARY & INSTITUTIONAL VISION GUIDE */}
      <UniversityAdmissionsSummary
        targetCountry={target.targetCountry}
        targetUniversity={target.targetUniversity}
        targetRankTier={target.targetRankTier}
        targetField={target.targetField}
        onSelectUniversity={(uniName) => {
          setTarget((prev) => ({
            ...prev,
            targetUniversity: uniName,
          }));
        }}
      />

      {/* SECTION 3: 2-LINE TRAJECTORY JOURNEY CHART WITH BLINKING BEACON (KEPT OVER AND ABOVE SPIDER CHART) */}
      <TrajectoryTwoLineChart
        currentGrade={target.currentGrade}
        studentName={target.studentName}
        targetRankTier={target.targetRankTier}
        targetCountry={target.targetCountry}
        targetUniversity={target.targetUniversity}
        targetField={target.targetField}
        baselineReadiness={pathData.readinessScore}
        projectedReadiness={pathData.projectedReadinessScore}
        cohortBenchmarkComposite={pathData.cohortBenchmarks.compositeScore}
        cohortBenchmarks={pathData.cohortBenchmarks}
      />

      {/* SECTION 4: SPIDER & RADAR CHART COMPETENCY COMPARISON */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider mb-1 flex-wrap">
              <span>Diagnostic Overlay</span>
              <span>·</span>
              <span className="font-semibold text-stone-900 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
                {target.targetCountry} Admissions Logic
              </span>
              <span>·</span>
              <span className="font-semibold text-stone-800 bg-stone-100 border border-stone-300 px-2 py-0.5 rounded">
                {target.targetRankTier} Standard
              </span>
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-900">
              Spider & Radar Competency Comparison
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Exact dimensional comparison between {target.studentName}'s current profile and the {target.targetCountry} {target.targetRankTier} benchmark.
            </p>
          </div>

          {/* Legend with Strict Total Points */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 text-xs font-mono text-stone-700 shrink-0">
            <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-900 shrink-0" />
              <span>
                <strong>{target.studentName}:</strong> {pathData.aspirantScores.compositeScore} pts avg
                <span className="text-stone-400 ml-1">({pathData.aspirantScores.totalPoints || 0} pts sum)</span>
              </span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-900">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
              <span>
                <strong>{target.targetRankTier} Standard:</strong> {pathData.cohortBenchmarks.compositeScore} pts avg
                <span className="text-emerald-700 ml-1">({pathData.cohortBenchmarks.totalPoints || 0} pts sum)</span>
              </span>
            </div>
            <button
              type="button"
              onClick={handlePrintGapAnalysis}
              className="print:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold cursor-pointer shadow-2xs transition-colors"
              title="Print Gap Analysis & Radar Breakdown"
            >
              <Printer className="w-3.5 h-3.5 text-stone-700" />
              <span>Print Gap Analysis</span>
            </button>
          </div>
        </div>

        {/* Chart + Dimensional Table */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-2">
          {/* Spider Canvas with custom dynamic evaluations */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <SpiderChart
              customEvaluations={radarCustomEvaluations}
              size={360}
            />
          </div>

          {/* 6 Aspects Dimensional Breakdown Table */}
          <div className="w-full lg:w-1/2 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-stone-500 uppercase tracking-wider mb-1">
              <span>Competency Dimensional Score Gaps</span>
              <span>{target.targetCountry}</span>
            </div>

            <div className="space-y-2">
              {[
                {
                  label: 'Problem Solving',
                  desc: 'Olympiad contests, advanced mathematical modeling, algorithmic logic',
                  current: pathData.aspirantScores.problemSolving,
                  target: pathData.cohortBenchmarks.problemSolving,
                },
                {
                  label: 'Technical Skills',
                  desc: 'Programming, hardware engineering, data pipelines, lab assays',
                  current: pathData.aspirantScores.technicalSkills,
                  target: pathData.cohortBenchmarks.technicalSkills,
                },
                {
                  label: 'Critical Thinking',
                  desc: 'Independent inquiry, scientific publications, primary source critique',
                  current: pathData.aspirantScores.criticalThinking,
                  target: pathData.cohortBenchmarks.criticalThinking,
                },
                {
                  label: 'Team Work',
                  desc: 'Robotics teams, collaborative hackathons, lab co-investigation',
                  current: pathData.aspirantScores.teamWork,
                  target: pathData.cohortBenchmarks.teamWork,
                },
                {
                  label: 'Communication',
                  desc: 'Debate finals, scientific presentation, essay persuasion',
                  current: pathData.aspirantScores.communication,
                  target: pathData.cohortBenchmarks.communication,
                },
                {
                  label: 'Creativity',
                  desc: 'Novel inventions, open-source creation, artistic synthesis',
                  current: pathData.aspirantScores.creativity,
                  target: pathData.cohortBenchmarks.creativity,
                },
              ].map((dim) => {
                const gap = dim.target - dim.current;

                return (
                  <div
                    key={dim.label}
                    className="p-3 rounded-lg bg-stone-50/70 border border-stone-200 text-xs flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-stone-900">{dim.label}</div>
                      <div className="text-[11px] text-stone-500">{dim.desc}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span className="font-semibold text-stone-900">{dim.current}</span>
                        <span className="text-stone-400">/</span>
                        <span className="text-stone-600 font-semibold">{dim.target}</span>
                      </div>
                      <div
                        className={`text-[10px] font-mono font-medium ${
                          gap > 0 ? 'text-amber-700' : 'text-emerald-700'
                        }`}
                      >
                        {gap > 0 ? `Deficit: -${gap} pts` : `Target Met (+${Math.abs(gap)})`}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Total Aggregate Harmonization Row */}
              <div className="p-3.5 rounded-xl bg-stone-900 text-stone-100 text-xs flex items-center justify-between gap-3 shadow-2xs">
                <div>
                  <div className="font-bold flex items-center gap-2">
                    <span>Harmonized Total Benchmark Points</span>
                    <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-mono">
                      Sum of 6 Dimensions
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Candidate Sum: {pathData.aspirantScores.totalPoints} pts vs Benchmark: {pathData.cohortBenchmarks.totalPoints} pts
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="text-stone-300">{pathData.aspirantScores.compositeScore}</span>
                    <span className="text-stone-500">/</span>
                    <span className="font-bold text-emerald-400">{pathData.cohortBenchmarks.compositeScore} pts</span>
                  </div>
                  <div className="text-[10px] font-mono text-stone-400">
                    Trajectory Line Target
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Country Philosophy & Trajectory Harmonization Callout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-stone-200 text-xs">
          <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-1">
              Country Philosophy Calibration ({target.targetCountry})
            </div>
            <p className="text-stone-700 leading-relaxed font-medium">
              {pathData.cohortBenchmarks.countryPhilosophy || 'Empirically calibrated admission standards reflecting target nation evaluation rubrics.'}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
            <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 mb-1">
              Strict Point Harmonization Notice
            </div>
            <p className="text-stone-700 leading-relaxed">
              The Admissions Readiness 2-Line Trajectory culmination benchmark ({pathData.cohortBenchmarks.compositeScore} pts) directly equals the normalized aggregate of the 6 spider chart dimensions ({pathData.cohortBenchmarks.totalPoints} total dimensional pts ÷ 6 = {pathData.cohortBenchmarks.compositeScore} pts).
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: DETAILED SUPERCURRICULAR MILESTONES ACTION PLAN */}
      <SupercurricularMilestonesView
        currentGrade={target.currentGrade}
        targetRankTier={target.targetRankTier}
        targetUniversity={target.targetUniversity}
        targetCountry={target.targetCountry}
        targetField={target.targetField}
        baseline={baseline}
        studentName={target.studentName}
        onMilestonesChange={(total, completed) => {
          setMilestonesMeta({ total, completed });
        }}
      />

      {/* SECTION 6: INTERACTIVE ASPIRANT STRATEGY REPORT DRAWER */}
      <AspirantReportDrawer
        isOpen={isReportDrawerOpen}
        onClose={() => setIsReportDrawerOpen(false)}
        target={target}
        baseline={baseline}
        pathData={pathData}
        totalMilestonesCount={milestonesMeta.total}
        completedMilestonesCount={milestonesMeta.completed}
        requiredProfile={requiredProfile}
        initialTab={reportDrawerTab}
      />
    </div>
  );
};
