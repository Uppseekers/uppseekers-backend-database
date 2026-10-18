import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Layers,
} from 'lucide-react';
import { GradeLevel, RankTier } from '../../types';

interface SupercurricularMilestoneItem {
  id: string;
  category: 'internship' | 'research' | 'competition' | 'certification' | 'award' | 'leadership';
  title: string;
  suggestedAction: string;
  impactLevel: 'Critical Anchor' | 'High-Impact Spike' | 'Core Differentiator';
  timeCommitment: string;
  admissionsRationale: string;
}

interface MilestonePhase {
  milestoneNumber: number;
  grade: GradeLevel;
  phaseTitle: string;
  objective: string;
  items: SupercurricularMilestoneItem[];
}

interface SupercurricularMilestonesViewProps {
  currentGrade: GradeLevel;
  targetRankTier: RankTier;
  targetUniversity?: string;
  targetCountry: string;
  targetField?: string;
}

export const SupercurricularMilestonesView: React.FC<SupercurricularMilestonesViewProps> = ({
  currentGrade,
  targetRankTier,
  targetUniversity,
  targetCountry,
  targetField = 'Computer Science & AI',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completedItemIds, setCompletedItemIds] = useState<Set<string>>(
    new Set(['g9-cert-1', 'g9-comp-1'])
  );

  const toggleItem = (id: string) => {
    setCompletedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Generate discipline-tailored supercurricular milestones
  const phases: MilestonePhase[] = React.useMemo(() => {
    const f = targetField.toLowerCase();
    const isCS = f.includes('cs') || f.includes('computer') || f.includes('code') || f.includes('software') || f.includes('data');
    const isEngineering = !isCS && (f.includes('engineer') || f.includes('robot') || f.includes('aerospace') || f.includes('mechanical') || f.includes('electrical'));
    const isPreMed = f.includes('pre-med') || f.includes('med') || f.includes('bio') || f.includes('health') || f.includes('neuro');
    const isEcon = f.includes('econ') || f.includes('finance') || f.includes('business') || f.includes('quant') || f.includes('commerce') || f.includes('consult');
    const isLaw = f.includes('law') || f.includes('policy') || f.includes('relation') || f.includes('gov') || f.includes('history') || f.includes('phil') || f.includes('humanit');
    const isPhysicsMath = f.includes('phys') || f.includes('math') || f.includes('astro') || f.includes('stat');

    return [
      {
        milestoneNumber: 1,
        grade: 'Grade 9',
        phaseTitle: 'Foundation & Curiosity Discovery',
        objective: `Establish unshakeable academic baseline, build foundational ${isPreMed ? 'biomedical & laboratory' : isEcon ? 'quantitative & economic' : isEngineering ? 'CAD & mechanical' : isLaw ? 'analytical & oratorical' : isPhysicsMath ? 'theoretical math & physics' : 'technical & algorithmic'} tools, and explore 2–3 genuine areas of intellectual curiosity.`,
        items: [
          {
            id: 'g9-cert-1',
            category: 'certification',
            title: isPreMed
              ? 'Foundational Medical & Bio Sciences MOOCs'
              : isEcon
              ? 'Foundational Microeconomics & Financial Modeling'
              : isEngineering
              ? 'SolidWorks / Autodesk Fusion 360 CAD Certification'
              : isLaw
              ? 'Jurisprudence & Constitutional Foundations MOOCs'
              : isPhysicsMath
              ? 'MITx Classical Mechanics & Discrete Mathematics'
              : 'Foundational University MOOCs & Coding Tools',
            suggestedAction: isPreMed
              ? 'Complete Johns Hopkins Introduction to Genomic Technologies (Coursera), NIH Bioethics online modules, or advanced biochemistry courses.'
              : isEcon
              ? 'Complete Wharton Business Foundations, MITx 14.01x Principles of Microeconomics, or Python for Financial Data Analysis.'
              : isEngineering
              ? 'Earn Certified SolidWorks Associate (CSWA) or Autodesk Certified Associate in CAD & Digital Fabrication.'
              : isLaw
              ? 'Complete Harvard Justice (Michael Sandel on edX), Yale Constitutional Law, or International Humanitarian Law certifications.'
              : isPhysicsMath
              ? 'Complete MITx 8.01x Classical Mechanics, Gilbert Strang Linear Algebra lectures, and proof techniques (discrete math).'
              : 'Complete CS50x (Harvard Introduction to Computer Science), MITx 6.00.1x (Python), or advanced pre-calculus / linear algebra online courses.',
            impactLevel: 'Critical Anchor',
            timeCommitment: '3–5 hrs/week',
            admissionsRationale:
              'Demonstrates self-directed curiosity beyond school syllabus early on; provides prerequisite vocabulary for independent research.',
          },
          {
            id: 'g9-comp-1',
            category: 'competition',
            title: isPreMed
              ? 'Regional Science Fair Inquiry & Local HOSA'
              : isEcon
              ? 'Wharton Global High School Investment & Novice Debate'
              : isEngineering
              ? 'FIRST Robotics / Science Olympiad Regional Roster'
              : isLaw
              ? 'Novice Lincoln-Douglas Debate & Model UN Gavel Circuit'
              : isPhysicsMath
              ? 'AMC 10 (Target 95+) & Physics Bowl Division 1'
              : 'First-Round Olympiads & Contest Benchmarking',
            suggestedAction: isPreMed
              ? 'Participate in regional science fair with an inquiry in enzymology or public health; register for local HOSA Medical Reading or Innovation.'
              : isEcon
              ? 'Form a student team for Wharton Global High School Investment Competition; enter local Public Forum debate tournaments.'
              : isEngineering
              ? 'Join high school FRC/FTC Robotics team or Science Olympiad engineering events (Detector Building, Bridge Design).'
              : isLaw
              ? 'Compete in regional NSDA speech and debate circuit; earn best delegate honors at local high school Model UN conferences.'
              : isPhysicsMath
              ? 'Practice past AMC 10 papers aiming for 95+ score; enter AAPT PhysicsBowl and USAMTS proofs.'
              : 'Participate in AMC 10 (target 85+ score), USACO Bronze division, local high school hackathons, or novice debate.',
            impactLevel: 'Core Differentiator',
            timeCommitment: '2–4 hrs/week',
            admissionsRationale:
              'Establishes objective contest benchmark. Starting in 9th grade provides multiple attempts to qualify for national rounds.',
          },
          {
            id: 'g9-intern-1',
            category: 'internship',
            title: isPreMed
              ? 'Hospital Shadowing & Clinical Volunteer Rotations'
              : isEcon
              ? 'Credit Union / Financial Literacy Community Apprenticeship'
              : isEngineering
              ? 'Mechanical Fabrication Workshop & Machine Tooling Safety'
              : isLaw
              ? 'Legal Aid Clinic Assistant & Municipal Office Volunteer'
              : isPhysicsMath
              ? 'University Physics Observatory / Computational Lab Shadowing'
              : 'Shadowing & Exploratory Project Lab',
            suggestedAction: isPreMed
              ? 'Log 40+ hours volunteering at community hospital or geriatric care center; shadow attending physician during clinical rounds.'
              : isEcon
              ? 'Volunteer with non-profit community financial literacy group; assist local credit union with youth savings educational campaigns.'
              : isEngineering
              ? 'Shadow mechanical or civil engineers at local municipal works; assist high school maker lab with 3D printer calibration and CNC safety.'
              : isLaw
              ? 'Volunteer with local legal aid organization filing intake records; shadow district court public defender or city attorney.'
              : isPhysicsMath
              ? 'Assist university physics department observatory open nights; shadow graduate researchers writing numerical simulations.'
              : 'Shadow a local university graduate student, assist in a robotics club workshop, or complete structured laboratory safety courses.',
            impactLevel: 'Core Differentiator',
            timeCommitment: '2 hrs/week',
            admissionsRationale:
              'Provides real-world perspective on active professional practices and experimental pipelines.',
          },
          {
            id: 'g9-lead-1',
            category: 'leadership',
            title: isPreMed
              ? 'Red Cross Youth Chapter or First Aid Peer Workshop'
              : isEcon
              ? 'High School Investment Circle & Financial Education'
              : isEngineering
              ? 'Junior STEM Maker Club & Tooling Demonstrations'
              : isLaw
              ? 'Civic Discussion Forum & Mock Trial Team Initiation'
              : isPhysicsMath
              ? 'High School Math Circle Founder & Problem Seminars'
              : 'Peer Mentorship & School Club Initiation',
            suggestedAction: isPreMed
              ? 'Co-found Red Cross youth division or organize school-wide CPR certification drive and blood donor awareness workshops.'
              : isEcon
              ? 'Found high school investing club; organize weekly stock market simulations and guest lectures from local alumni in finance.'
              : isEngineering
              ? 'Lead after-school workshop teaching middle schoolers fundamental electronics with breadboards and microcontrollers.'
              : isLaw
              ? 'Establish non-partisan student civic discussion salon; mentor underclassmen on debate argumentation and case preparation.'
              : isPhysicsMath
              ? 'Organize weekly after-school math enrichment circle tackling challenging proof problems from past AIME/contest sets.'
              : 'Organize an after-school coding circle or math enrichment group for middle school students in your district.',
            impactLevel: 'Core Differentiator',
            timeCommitment: '2 hrs/week',
            admissionsRationale:
              'Shows early inclination toward sharing domain knowledge and mobilizing peers.',
          },
        ],
      },
      {
        milestoneNumber: 2,
        grade: 'Grade 10',
        phaseTitle: 'Specialization & First Scholarly Artifact',
        objective:
          'Narrow down to 1–2 target academic spikes, compete at regional/national levels, and draft an independent inquiry paper.',
        items: [
          {
            id: 'g10-comp-1',
            category: 'competition',
            title: isPreMed
              ? 'USABO Semifinalist Push & State HOSA Gold'
              : isEcon
              ? 'National Economics Challenge (NEC) State Finals'
              : isEngineering
              ? 'British Physics Olympiad Senior Challenge & FRC Drive Lead'
              : isLaw
              ? 'National History Day (NHD) State Championship & MUN Gavels'
              : isPhysicsMath
              ? 'AIME Qualification (100+ on AMC 10) & USAPhO F=ma'
              : 'AIME Cutoff & USACO Silver → Gold Advancement',
            suggestedAction: isPreMed
              ? 'Prepare intensively for USABO Open Exam with Campbell Biology; submit competitive HOSA Medical Innovation design for State Leadership Conference.'
              : isEcon
              ? 'Form 4-person team for National Economics Challenge David Ricardo division; advance to State Finals; submit Wharton portfolio pitch.'
              : isEngineering
              ? 'Earn medal in BPhO Senior Challenge; direct mechanical subsystem design for FIRST Robotics regional competition.'
              : isLaw
              ? 'Submit 5,000-word historical paper for National History Day; win Best Delegate gavel at premier collegiate Model UN conference.'
              : isPhysicsMath
              ? 'Attain AIME cutoff on AMC 10/12; sit for USAPhO F=ma physics exam with David Morin problem sets.'
              : 'Target 100+ on AMC 10 to lock in AIME qualification; advance to USACO Gold; compete in State Science Olympiad.',
            impactLevel: 'Critical Anchor',
            timeCommitment: '6–8 hrs/week contest prep',
            admissionsRationale:
              'National contest benchmarks validate objective domain talent against high-achieving peers nationwide.',
          },
          {
            id: 'g10-intern-1',
            category: 'internship',
            title: isPreMed
              ? 'University Biomedical Lab Outreach & Summer Placement'
              : isEcon
              ? 'Boutique Asset Management / Economic Research Apprenticeship'
              : isEngineering
              ? 'Aerospace / Robotics Lab Outreach & Mechanical Fellowship'
              : isLaw
              ? 'State Representative District Fellowship & Casework Briefing'
              : isPhysicsMath
              ? 'Theoretical Physics / Pure Math Department Summer Mentorship'
              : 'University Lab Outreach & Summer Apprenticeship',
            suggestedAction: isPreMed
              ? 'Reach out to 20 pathology or genetics professors; reference recent papers and secure summer wet-lab access or bioinformatics shadowing.'
              : isEcon
              ? 'Secure 6-week summer apprenticeship with economic consultancy, financial advisory firm, or municipal development office.'
              : isEngineering
              ? 'Join university lab conducting research in composite materials, drone autonomy, or biomechatronics.'
              : isLaw
              ? 'Serve as junior policy fellow for state senator or civil rights advocacy non-profit; assist in drafting constituent policy reports.'
              : isPhysicsMath
              ? 'Secure summer reading and computational research fellowship under university mathematics/physics faculty.'
              : 'Reach out to university faculty with tailored inquiries referencing recent publications; secure an apprenticeship in an AI, genomics, or robotics lab.',
            impactLevel: 'High-Impact Spike',
            timeCommitment: 'Full-time 6–8 weeks in summer',
            admissionsRationale:
              'Mentorship under a university Principal Investigator or expert provides credibility and experimental guidance for publication-grade work.',
          },
          {
            id: 'g10-research-1',
            category: 'research',
            title: isPreMed
              ? 'Biomedical Assay Protocol & Primary Paper Manuscript'
              : isEcon
              ? 'Econometric Regression Model & Market Dynamics Paper Draft'
              : isEngineering
              ? 'CAD Stress Finite Element Analysis & Functional Prototype'
              : isLaw
              ? 'Constitutional Jurisprudence Treatises & Policy Brief'
              : isPhysicsMath
              ? 'Analytical Proof Paper or Numerical Physics Simulation Draft'
              : 'Experimental Protocol & Initial Paper Draft',
            suggestedAction: isPreMed
              ? 'Conduct supervised cell culture assays or genomic sequence analysis; write comprehensive paper draft adhering to Nature/JBC format.'
              : isEcon
              ? 'Collect microeconomic retail or pricing datasets; run multivariate regressions in Python/R to test market hypotheses; write working paper.'
              : isEngineering
              ? 'Fabricate test mechanism, run FEA stress testing in SolidWorks, and document design iterations in formal engineering notebook.'
              : isLaw
              ? 'Synthesize primary historical archives and Supreme Court precedent to author an original 6,000-word treatise on legal doctrine.'
              : isPhysicsMath
              ? 'Derive solutions to unsolved problem or run astrophysics N-body gravitational simulations; format findings in LaTeX manuscript.'
              : 'Under lab mentorship, run computational simulations, wet-lab assays, or econometric models; synthesize findings into a structured paper draft.',
            impactLevel: 'High-Impact Spike',
            timeCommitment: '8–10 hrs/week',
            admissionsRationale:
              'Demonstrates shift from passive learner to independent investigator producing original empirical data.',
          },
          {
            id: 'g10-cert-1',
            category: 'certification',
            title: isPreMed
              ? 'Advanced Molecular Biology & Clinical Research Credential'
              : isEcon
              ? 'Financial Modeling & Quantitative Econometrics Credential'
              : isEngineering
              ? 'CSWP Professional CAD & Microcontroller Specialization'
              : isLaw
              ? 'International Human Rights & Advanced Oratory Distinction'
              : isPhysicsMath
              ? 'Differential Equations & Proof Verification Tools'
              : 'Specialized Technical Certifications',
            suggestedAction: isPreMed
              ? 'Complete Stanford Medicine Coursera in Cancer Biology, HIPAA certification, and advanced statistical genetics coursework.'
              : isEcon
              ? 'Complete Columbia University Financial Engineering (Coursera) or Wall Street Prep Financial Modeling certification.'
              : isEngineering
              ? 'Pass Certified SolidWorks Professional (CSWP) exam and complete Embedded Systems with ARM Cortex-M microcontrollers.'
              : isLaw
              ? 'Complete Yale University Global Affairs Certificate and NSDA Premier Distinction point milestone.'
              : isPhysicsMath
              ? 'Complete MIT OpenCourseWare 18.03 Differential Equations and LaTeX scientific typesetting proficiency.'
              : 'Complete DeepLearning.AI Specialization, Stanford Online Algorithms, or professional CAD SolidWorks Associate certification.',
            impactLevel: 'Core Differentiator',
            timeCommitment: '3 hrs/week',
            admissionsRationale:
              'Formalizes advanced technical proficiency that can be directly applied to research codebases.',
          },
        ],
      },
      {
        milestoneNumber: 3,
        grade: 'Grade 11',
        phaseTitle: 'The Spike Year — Preprints & National Recognition',
        objective:
          'Deliver your core differentiator: publish/preprint original research, achieve national/state honors, and demonstrate community impact.',
        items: [
          {
            id: 'g11-research-1',
            category: 'research',
            title: isPreMed
              ? 'Preprint Submission (bioRxiv) & ISEF Regional Grand Award'
              : isEcon
              ? 'SSRN Working Paper Publication & Federal Reserve Challenge'
              : isEngineering
              ? 'ISEF Engineering Mechanics Grand Award & Provisional Patent'
              : isLaw
              ? 'The Concord Review / John Locke Essay Global Distinction'
              : isPhysicsMath
              ? 'arXiv Theoretical Physics / Mathematics Preprint & PRIMES'
              : 'Preprint Submission (arXiv / bioRxiv) & Science Fair',
            suggestedAction: isPreMed
              ? 'Finalize primary-author or first-co-author biomedical manuscript; submit to bioRxiv and compete in Regeneron ISEF regional qualifying fair.'
              : isEcon
              ? 'Publish econometric working paper on SSRN; submit findings to National Economics Challenge or Harvard Global Case Competition.'
              : isEngineering
              ? 'Complete physical working prototype; draft patent claims or submit to Regeneron ISEF in Engineering Mechanics / Robotics.'
              : isLaw
              ? 'Submit finished monograph to The Concord Review (5% acceptance rate) and enter the John Locke Global Essay Competition.'
              : isPhysicsMath
              ? 'Post verified proof paper or astrophysics simulation to arXiv; submit manuscript to MIT PRIMES or Regeneron Science Talent Search.'
              : 'Finalize primary-author or first-co-author manuscript and submit to arXiv, bioRxiv, or a peer-reviewed journal; enter regional ISEF qualifying fair.',
            impactLevel: 'Critical Anchor',
            timeCommitment: '10–12 hrs/week',
            admissionsRationale:
              'A citable preprint or premier national prize is the single highest-weighted academic differentiator for Top global universities.',
          },
          {
            id: 'g11-comp-1',
            category: 'competition',
            title: isPreMed
              ? 'USABO National Semifinalist & HOSA International Finalist'
              : isEcon
              ? 'National Economics Challenge Adam Smith National Finals'
              : isEngineering
              ? 'FIRST Robotics Dean’s List Finalist / National TSA Winner'
              : isLaw
              ? 'NSDA National Speech & Debate Tournament Qualifier'
              : isPhysicsMath
              ? 'USAMO / USAJMO Qualifier or USAPhO Semifinalist Medal'
              : 'National Contest Honors (USAMO, USAPhO, Regeneron STS)',
            suggestedAction: isPreMed
              ? 'Qualify for USABO Semifinal Exam (top 10% nationwide); place in top 3 at State HOSA for ILC qualification.'
              : isEcon
              ? 'Win State Championship in NEC Adam Smith Division; place among top 10 global portfolios in Wharton Global Youth Investment.'
              : isEngineering
              ? 'Nominated for Dean’s List in FIRST Robotics; lead team to Regional Championship or NASA Student Launch finalist.'
              : isLaw
              ? 'Qualify for NSDA National Tournament in Lincoln-Douglas or Policy Debate; win Outstanding Delegate at collegiate Model UN.'
              : isPhysicsMath
              ? 'Score 8+ on AIME to qualify for USAMO; qualify for USAPhO Semifinal round; place top 5% in Harvard-MIT Math Tournament (HMMT).'
              : 'Score 7+ on AIME, qualify for USAPhO Semifinals, submit to Regeneron Science Talent Search, or place in National History Day / John Locke Essay.',
            impactLevel: 'Critical Anchor',
            timeCommitment: '8 hrs/week',
            admissionsRationale:
              'National contest honors validate that the student ranks in the 99th percentile against high-achieving peers nationwide.',
          },
          {
            id: 'g11-intern-1',
            category: 'internship',
            title: isPreMed
              ? 'Selective Merit Medical Institute (SIMR, Garcia, NIH SIP)'
              : isEcon
              ? 'Selective Business Institute (Wharton LBW, BoA Student Leader)'
              : isEngineering
              ? 'Premier Engineering Institute (MIT Beaver Works, SSP)'
              : isLaw
              ? 'Selective Humanities Institute (TASP, Telluride, Senate Page)'
              : isPhysicsMath
              ? 'Elite Residential Mathematics Program (PROMYS, ROSS, Mathcamp)'
              : 'Selective Merit Summer Institute (RSI, Beaver Works, SSP)',
            suggestedAction: isPreMed
              ? 'Apply to hyper-selective summer institutes (Stanford SIMR, Garcia Center, NIH Summer Internship Program) with acceptance rate < 5%.'
              : isEcon
              ? 'Attend Wharton Leadership in the Business World (LBW) or serve as Bank of America Student Leader with paid non-profit internship.'
              : isEngineering
              ? 'Attend MIT Beaver Works Summer Institute (Autonomous RACECAR or CubeSat) or Summer Science Program (SSP).'
              : isLaw
              ? 'Serve as United States Senate Page in Washington D.C. or attend competitive Telluride Association summer institute.'
              : isPhysicsMath
              ? 'Attend PROMYS, Ross Mathematics Program, or Research Science Institute (RSI) for rigorous faculty-mentored investigation.'
              : 'Apply to RSI, MIT Beaver Works, SSP, SIMR, PROMYS, or LaunchX. Alternatively, conduct intensive software engineering at a tech startup.',
            impactLevel: 'High-Impact Spike',
            timeCommitment: 'Full-time 6–8 weeks in summer',
            admissionsRationale:
              'Admissions committees recognize hyper-selective summer institutes (acceptance rates < 5%) as an external gold standard.',
          },
          {
            id: 'g11-lead-1',
            category: 'leadership',
            title: isPreMed
              ? 'Scaled Community Health Clinic / Screening Initiative'
              : isEcon
              ? 'Youth Micro-Finance / Financial Literacy 501(c)(3)'
              : isEngineering
              ? 'Regional STEM Tooling & Assistive Tech Non-Profit'
              : isLaw
              ? 'Statewide Youth Legislative Coalition & Municipal Policy'
              : isPhysicsMath
              ? 'Multi-District Mathematics Olympiad Mentorship Network'
              : 'Scaled Community Initiative & Real-World Deployment',
            suggestedAction: isPreMed
              ? 'Direct youth initiative coordinating health screenings and CPR training for 1,000+ residents in underserved healthcare deserts.'
              : isEcon
              ? 'Found non-profit delivering financial literacy workshops to 1,500+ high schoolers across 8 public schools; secure corporate grant.'
              : isEngineering
              ? 'Design and 3D-print affordable assistive devices for local pediatric rehabilitation center; open-source all CAD specifications.'
              : isLaw
              ? 'Lead statewide coalition on youth civic engagement; present policy brief to city council that results in adopted ordinance.'
              : isPhysicsMath
              ? 'Scale your math circle to 12 regional high schools; author and distribute weekly contest training modules to 500+ student subscribers.'
              : 'Scale your project into an open-source tool with active users, organize a regional youth hackathon, or partner with a registered municipal non-profit.',
            impactLevel: 'High-Impact Spike',
            timeCommitment: '4–6 hrs/week',
            admissionsRationale:
              'Demonstrates leadership scale, teamwork, and societal impact required by holistic admissions committees.',
          },
        ],
      },
      {
        milestoneNumber: 4,
        grade: 'Grade 12',
        phaseTitle: 'Synthesis, Recommendations & Dossier Packaging',
        objective:
          'Consolidate multi-year achievements into a cohesive narrative, secure recommendation letters, and execute tailored university applications.',
        items: [
          {
            id: 'g12-award-1',
            category: 'award',
            title: 'Culminating Awards & Senior Distinctions',
            suggestedAction:
              'Secure National Merit Semifinalist/Finalist status, Congressional Award Gold Medal, or international research presentation invitations.',
            impactLevel: 'Critical Anchor',
            timeCommitment: 'Ongoing',
            admissionsRationale:
              'Validates consistent excellence through the final stages of the high school trajectory.',
          },
          {
            id: 'g12-research-1',
            category: 'research',
            title: isPreMed
              ? 'Biomedical Research Dossier & Co-Author Verifications'
              : isEcon
              ? 'Quantitative Portfolio & Economic Case Study Compendium'
              : isEngineering
              ? 'Maker Supplementary Portfolio & CAD Design Documentation'
              : isLaw
              ? 'Published Writing Portfolio & Debate Record Dossier'
              : isPhysicsMath
              ? 'Mathematical Proof Compendium & Theory Review Portfolio'
              : 'Maker Portfolio & Technical Supplementary Briefing',
            suggestedAction: isPreMed
              ? 'Assemble comprehensive SlideRoom research supplement with lab protocols, bioRxiv DOI links, and letter from university PI.'
              : isEcon
              ? 'Assemble quantitative analysis dossier featuring econometric regression scripts, market whitepapers, and financial case studies.'
              : isEngineering
              ? 'Assemble SlideRoom Maker Portfolio with video demonstrations of working hardware, CAD schematics, and FEA stress analyses.'
              : isLaw
              ? 'Curate writing supplement with published Concord Review monograph, op-eds, NSDA state/national ballots, and legislative testimony.'
              : isPhysicsMath
              ? 'Compile proof compendium and arXiv paper derivations; submit SlideRoom supplement reviewed by university math faculty.'
              : 'Assemble SlideRoom Maker Portfolio (MIT/Stanford), GitHub technical repository documentation, or UCAS course-specific supercurricular bibliography.',
            impactLevel: 'Critical Anchor',
            timeCommitment: '5 hrs/week during application cycle',
            admissionsRationale:
              'Directly presents tangible artifacts and published scholarship to faculty admissions evaluators.',
          },
          {
            id: 'g12-lead-1',
            category: 'leadership',
            title: 'Faculty & Research Mentor Recommendation Dossier',
            suggestedAction:
              `Prepare a detailed 2-page briefing document for your teachers and research PI highlighting your specific breakthroughs in ${targetField}.`,
            impactLevel: 'Critical Anchor',
            timeCommitment: '2 hrs/week',
            admissionsRationale:
              'Top recommendation letters quote specific domain breakthroughs and intellectual hurdles overcome directly from your briefing dossier.',
          },
        ],
      },
    ];
  }, [currentGrade, targetRankTier, targetUniversity, targetCountry, targetField]);

  const categories = [
    { id: 'all', label: 'All Activities' },
    { id: 'research', label: 'Research & Papers' },
    { id: 'competition', label: 'Competitions & Olympiads' },
    { id: 'internship', label: 'Internships & Labs' },
    { id: 'certification', label: 'Certifications' },
    { id: 'leadership', label: 'Leadership & Scale' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider mb-1">
            <span>Milestone-Wise Supercurricular Sequence</span>
            <span>·</span>
            <span>{targetCountry} · {targetRankTier}</span>
            <span>·</span>
            <span className="font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 lowercase first-letter:uppercase">
              {targetField}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Supercurricular Action Blueprint
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
            Phased action items across research, competitions, apprenticeships, and leadership tailored for <strong className="text-stone-900 font-semibold">{targetField}</strong> designed to systematically bridge the trajectory gap for {targetUniversity || `${targetRankTier} universities`}.
          </p>
        </div>

        {/* Progress summary */}
        <div className="bg-stone-50 px-3.5 py-2 rounded-lg border border-stone-200 text-xs font-mono text-stone-700 flex items-center gap-2 shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{completedItemIds.size} of 15 Milestones Completed</span>
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
          const filteredItems = phase.items.filter(
            (item) => selectedCategory === 'all' || item.category === selectedCategory
          );

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

                <div className="text-[11px] font-mono text-stone-400 shrink-0">
                  {filteredItems.length} Milestones
                </div>
              </div>

              {/* Items List (Direct Bullet-Point Takeaways) */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item) => {
                  const isDone = completedItemIds.has(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`rounded-lg p-4 border transition-all flex flex-col justify-between ${
                        isDone
                          ? 'bg-stone-50/90 border-stone-200 opacity-80'
                          : 'bg-white border-stone-200/90 hover:border-stone-400 shadow-2xs'
                      }`}
                    >
                      <div>
                        {/* Top Metadata */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                            <span>{item.category}</span>
                            <span>·</span>
                            <span className="font-semibold text-stone-800">{item.impactLevel}</span>
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
                            isDone ? 'line-through text-stone-500' : ''
                          }`}
                        >
                          {item.title}
                        </h5>
                        <p className="text-xs text-stone-600 leading-relaxed mb-3">
                          {item.suggestedAction}
                        </p>
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
