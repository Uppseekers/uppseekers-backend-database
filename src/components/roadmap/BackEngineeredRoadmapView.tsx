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
} from '../../utils/roadmapEngine';
import { TOP_UNIVERSITIES, UniversityMeta } from '../../data/admittedStudents1500';
import { SpiderChart } from '../SpiderChart';
import { AspiringStudentUploader } from './AspiringStudentUploader';
import { TrajectoryTwoLineChart } from './TrajectoryTwoLineChart';
import { SupercurricularMilestonesView } from './SupercurricularMilestonesView';
import { UniversityAdmissionsSummary } from './UniversityAdmissionsSummary';
import { LookalikeAdmittedStudents } from './LookalikeAdmittedStudents';

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

  // Required Profile Calibration (Calibrated per Tier from thousands of admitted students)
  const requiredProfile = useMemo(() => {
    const isTop5 = target.targetRankTier === 'Top 5';
    const isTop10 = target.targetRankTier === 'Top 10' || isTop5;
    const isTop25 = target.targetRankTier === 'Top 25';
    const isTop50 = target.targetRankTier === 'Top 50';

    return {
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
        ? 'SAT: 1540–1600 (Math 790+) or ACT: 35–36'
        : isTop10
        ? 'SAT: 1520–1580 (Math 780+) or ACT: 34–36'
        : isTop25
        ? 'SAT: 1480–1550 or ACT: 33–35'
        : isTop50
        ? 'SAT: 1420–1510 or ACT: 31–34'
        : 'SAT: 1360–1460 or ACT: 29–32',
      supercurriculars: {
        research: isTop5
          ? 'First-author or primary contributor on preprint (arXiv/bioRxiv) or ISEF Grand Award finalist'
          : isTop10
          ? 'Structured research paper under university faculty mentorship or regional ISEF award'
          : isTop25
          ? 'Structured research paper draft, school science fair 1st place, or university lab shadowing'
          : 'Independent inquiry project, literature review, or advanced capstone presentation',
        competitions: isTop5
          ? 'AIME Qualifier (Score 7+), USACO Gold/Platinum, USABO Semifinalist, or National Debate Finalist'
          : isTop10
          ? 'AIME Qualifier, USACO Gold, State Science Olympiad Gold, or Wharton Investment Finalist'
          : isTop25
          ? 'USACO Silver, State Science Olympiad Medalist, or National Merit Semifinalist'
          : 'Regional STEM competition participant, AMC 10 score 85+, or hackathon finalist',
        internships: isTop5
          ? 'Selective merit summer institute (RSI, MIT Beaver Works, SSP, SIMR, LaunchX) or faculty apprentice'
          : isTop10
          ? 'University faculty research apprenticeship or technical startup engineering internship'
          : isTop25
          ? 'Structured university lab internship or tech/business apprenticeship'
          : 'Local tech apprenticeship, hospital shadowing, or community STEM tutoring',
        certifications: isTop5
          ? 'CS50x, DeepLearning.AI Specialization, MITx 6.002x, advanced multivariable calculus / linear algebra'
          : isTop25
          ? 'CS50x, Python for Data Science, or Coursera university certificate'
          : 'Relevant technical MOOCs or foundational programming certifications',
        leadership: isTop5
          ? 'Founder of community initiative or 501(c)(3) with verified 1,000+ participant reach'
          : isTop10
          ? 'President of major school STEM/Policy organization with regional event organization'
          : isTop25
          ? 'Officer in 2+ school organizations or varsity athletics lead'
          : 'Active school club officer or team captain',
      },
      executiveConclusion: isTop5
        ? 'Top 5 admission requires an unmistakable "Angular Spike": perfect grades and test scores are merely the baseline ticket. Differentiators are verifiable external validation (Olympiad national selection, primary-author research, or scaled real-world artifact deployment).'
        : isTop10
        ? 'Top 10 institutions seek proven scholastic endurance and high-percentile technical capability. Students must demonstrate tangible independent inquiry outside the standard high school curriculum.'
        : isTop25
        ? 'Top 25 universities look for strong academic consistency, deep involvement in 2–3 meaningful activities, and clear evidence of intellectual vitality and institutional contribution.'
        : 'Focus on maintaining strong GPA trajectory, completing advanced coursework, and anchoring the profile with 1–2 structured projects or regional achievements.',
    };
  }, [target.targetRankTier]);

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16 print:space-y-4">
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

          <div className="flex items-center gap-3 shrink-0 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-stone-900 text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer border border-stone-900 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Complete Dossier</span>
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

        {/* SECONDARY SELECTORS: Country Filter & Optional Specific Institution Tag */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
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
              <span>Specific Institution Focus (Optional within {target.targetRankTier})</span>
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
        onSelectUniversity={(uniName) => {
          setTarget((prev) => ({
            ...prev,
            targetUniversity: uniName,
          }));
        }}
      />

      {/* SECTION 3: SPIDER & RADAR CHART COMPETENCY COMPARISON */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
          <div>
            <div className="text-xs font-mono text-stone-500 uppercase tracking-wider mb-1">
              Diagnostic Overlay
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-900">
              Spider & Radar Competency Comparison
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Overlay of {target.studentName}'s current profile against the {target.targetRankTier} empirical standard.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-mono text-stone-700 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-900" />
              <span>{target.studentName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>{target.targetRankTier} Standard</span>
            </div>
          </div>
        </div>

        {/* Chart + Dimensional Table */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-2">
          {/* Spider Canvas */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <SpiderChart
              students={[studentForRadar, benchmarkStudent]}
              size={360}
            />
          </div>

          {/* 6 Aspects Dimensional Breakdown Table */}
          <div className="w-full lg:w-1/2 space-y-2.5">
            <div className="text-xs font-mono text-stone-500 uppercase tracking-wider mb-1">
              Competency Dimensional Score Gaps:
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
                        <span className="text-stone-600">{dim.target}</span>
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
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: 2-LINE TRAJECTORY JOURNEY CHART WITH BLINKING BEACON */}
      <TrajectoryTwoLineChart
        currentGrade={target.currentGrade}
        studentName={target.studentName}
        targetRankTier={target.targetRankTier}
        targetUniversity={target.targetUniversity}
        baselineReadiness={pathData.readinessScore}
        projectedReadiness={pathData.projectedReadinessScore}
      />

      {/* SECTION 5: ADMITTED STUDENT LOOK-ALIKES & EMPIRICAL BLUEPRINTS */}
      <LookalikeAdmittedStudents
        cohort={cohort1500}
        target={target}
        baseline={baseline}
        onInspectStudent={onInspectStudent}
      />

      {/* SECTION 6: DETAILED SUPERCURRICULAR MILESTONES ACTION PLAN */}
      <SupercurricularMilestonesView
        currentGrade={target.currentGrade}
        targetRankTier={target.targetRankTier}
        targetUniversity={target.targetUniversity}
        targetCountry={target.targetCountry}
      />
    </div>
  );
};
