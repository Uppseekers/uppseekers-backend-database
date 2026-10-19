import React, { useState, useMemo } from 'react';
import {
  Globe2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  HelpCircle,
  ExternalLink,
  BookOpen,
  Award,
  FlaskConical,
  Code,
  Users,
  Compass,
  FileText,
  ChevronRight,
  TrendingUp,
  Scale,
} from 'lucide-react';
import {
  AdmittedStudentProfile,
  AspiringStudentBaseline,
  AspiringStudentTarget,
  BackEngineeredPath,
  RankTier,
  StudentProfile,
} from '../../types';
import {
  COUNTRY_COMPETENCY_PROFILES,
  CountryCompetencyProfile,
  CountryDimensionalExpectation,
  getCountryDimensionalRequirements,
  calculateCandidateAchievedPoints,
  calculateCountryWeightedCompositeScore,
} from '../../data/countryCompetencyRequirements';

interface CountryCompetencyRequirementsAndGapProps {
  target: AspiringStudentTarget;
  baseline: AspiringStudentBaseline;
  pathData: BackEngineeredPath;
  cohort: AdmittedStudentProfile[];
  completedMilestoneIds?: string[];
  onUpdateTargetCountry: (country: string) => void;
  onUpdateTargetRankTier?: (tier: RankTier) => void;
  onInspectStudent?: (student: StudentProfile) => void;
}

export const CountryCompetencyRequirementsAndGap: React.FC<CountryCompetencyRequirementsAndGapProps> = ({
  target,
  baseline,
  pathData,
  cohort,
  completedMilestoneIds = [],
  onUpdateTargetCountry,
  onUpdateTargetRankTier,
  onInspectStudent,
}) => {
  // Active selected country tab in this explorer
  const [selectedCountryId, setSelectedCountryId] = useState<string>(() => {
    const c = (target.targetCountry || '').toLowerCase();
    if (c.includes('kingdom') || c === 'uk') return 'United Kingdom';
    if (c.includes('canada')) return 'Canada';
    if (c.includes('singapore')) return 'Singapore';
    if (c.includes('switzer') || c.includes('europe') || c.includes('germany')) return 'Switzerland';
    if (c.includes('australia')) return 'Australia';
    return 'United States';
  });

  // Keep selectedCountryId in sync whenever target.targetCountry changes in the parent
  React.useEffect(() => {
    const c = (target.targetCountry || '').toLowerCase();
    let next = 'United States';
    if (c.includes('kingdom') || c === 'uk') next = 'United Kingdom';
    else if (c.includes('canada')) next = 'Canada';
    else if (c.includes('singapore')) next = 'Singapore';
    else if (c.includes('switzer') || c.includes('europe') || c.includes('germany')) next = 'Switzerland';
    else if (c.includes('australia')) next = 'Australia';
    else if (c.includes('state') || c.includes('us')) next = 'United States';

    setSelectedCountryId((prev) => (prev === next ? prev : next));
  }, [target.targetCountry]);

  // Active sub-view: 'country_deepdive' | 'cross_country_matrix' | 'admitted_lookalikes'
  const [activeSubView, setActiveSubView] = useState<'country_deepdive' | 'cross_country_matrix' | 'admitted_lookalikes'>('country_deepdive');

  // Currently viewed country profile
  const currentCountryProfile: CountryCompetencyProfile = useMemo(() => {
    const found = COUNTRY_COMPETENCY_PROFILES.find(
      (c) => c.countryId.toLowerCase() === selectedCountryId.toLowerCase()
    );
    return found || COUNTRY_COMPETENCY_PROFILES[0];
  }, [selectedCountryId]);

  // 1. DYNAMIC COUNTRY REQUIREMENTS SCALED BY UNIVERSITY TIER STANDARD
  const dimensionalRequirements = useMemo(() => {
    return getCountryDimensionalRequirements(
      currentCountryProfile.countryId,
      target.targetRankTier,
      target.targetField
    );
  }, [currentCountryProfile.countryId, target.targetRankTier, target.targetField]);

  // 2. DYNAMIC CANDIDATE ACHIEVED POINTS DRIVEN BY BASELINE + COMPLETED BLUEPRINT ACTIVITIES + TIER STANDARD + COUNTRY SYSTEM
  const candidateAchievedPoints = useMemo(() => {
    return calculateCandidateAchievedPoints(
      currentCountryProfile.countryId,
      target.targetRankTier,
      pathData.aspirantScores,
      completedMilestoneIds
    );
  }, [currentCountryProfile.countryId, target.targetRankTier, pathData.aspirantScores, completedMilestoneIds]);

  // Country-weighted composite score across 6 dimensions
  const countryCompositeScore = useMemo(() => {
    return calculateCountryWeightedCompositeScore(
      currentCountryProfile.countryId,
      candidateAchievedPoints
    );
  }, [currentCountryProfile.countryId, candidateAchievedPoints]);

  // Dimension key mapping to dynamically calculated candidate achieved points
  const getCandidateScoreForDimension = (dimKey: string): number => {
    switch (dimKey) {
      case 'problemSolving':
        return candidateAchievedPoints.problemSolving;
      case 'technicalSkills':
        return candidateAchievedPoints.technicalSkills;
      case 'criticalThinking':
        return candidateAchievedPoints.criticalThinking;
      case 'teamWork':
        return candidateAchievedPoints.teamWork;
      case 'communication':
        return candidateAchievedPoints.communication;
      case 'creativity':
        return candidateAchievedPoints.creativity;
      default:
        return 50;
    }
  };

  // Filter lookalike admitted students for selected country
  const lookalikeStudents = useMemo(() => {
    if (!cohort || cohort.length === 0) return [];
    return cohort
      .filter((s) => {
        const matchCountry =
          s.country.toLowerCase().includes(currentCountryProfile.countryName.toLowerCase()) ||
          (currentCountryProfile.countryName === 'United States' && s.country === 'United States') ||
          (currentCountryProfile.countryName === 'United Kingdom' && s.country === 'United Kingdom');
        return matchCountry;
      })
      .slice(0, 4);
  }, [cohort, currentCountryProfile]);

  const isCurrentTargetCountry =
    target.targetCountry.toLowerCase().includes(currentCountryProfile.countryName.toLowerCase()) ||
    (target.targetCountry === 'United States' && currentCountryProfile.countryName === 'United States') ||
    (target.targetCountry === 'United Kingdom' && currentCountryProfile.countryName === 'United Kingdom');

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-7">
      {/* SECTION HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider mb-1">
            <Globe2 className="w-3.5 h-3.5 text-stone-600" />
            <span>Country-Wise Competency Standard & Admissions Gap Diagnostic</span>
            <span>·</span>
            <span>Replacing Empirical Blueprints</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Destination Country Requirements & Candidate Gap Analyzer
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-4xl leading-relaxed">
            Every destination country operates on an entirely distinct admissions philosophy. A profile engineered for the US holistic system will trigger rejection in the UK if it lacks supercurricular single-subject depth, while a pure UK academic profile will fail in the US for lacking a leadership spike.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 shrink-0 self-start lg:self-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveSubView('country_deepdive')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer ${
              activeSubView === 'country_deepdive'
                ? 'bg-stone-900 text-stone-100 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Country Deep Dive & Gap
          </button>
          <button
            type="button"
            onClick={() => setActiveSubView('cross_country_matrix')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer ${
              activeSubView === 'cross_country_matrix'
                ? 'bg-stone-900 text-stone-100 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Cross-Country Matrix
          </button>
          <button
            type="button"
            onClick={() => setActiveSubView('admitted_lookalikes')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer ${
              activeSubView === 'admitted_lookalikes'
                ? 'bg-stone-900 text-stone-100 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Admitted Lookalikes ({lookalikeStudents.length})
          </button>
        </div>
      </div>

      {/* DESTINATION COUNTRY SELECTOR STRIP */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <span>Select Destination Country System to Analyze:</span>
          </label>
          <div className="text-[11px] font-mono text-stone-500">
            Current Target: <strong className="text-stone-900">{target.targetCountry}</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {COUNTRY_COMPETENCY_PROFILES.map((c) => {
            const isSelected = c.countryId === selectedCountryId;
            const isTarget =
              target.targetCountry.toLowerCase().includes(c.countryName.toLowerCase()) ||
              (target.targetCountry === 'United States' && c.countryName === 'United States') ||
              (target.targetCountry === 'United Kingdom' && c.countryName === 'United Kingdom');

            return (
              <button
                key={c.countryId}
                type="button"
                onClick={() => {
                  setSelectedCountryId(c.countryId);
                  onUpdateTargetCountry(c.countryName);
                }}
                className={`p-3 rounded-xl text-left transition-all border cursor-pointer relative ${
                  isSelected
                    ? 'bg-stone-900 text-stone-100 border-stone-900 shadow-xs'
                    : 'bg-stone-50/80 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                }`}
              >
                {isTarget && (
                  <span
                    className={`absolute top-2 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    TARGET
                  </span>
                )}
                <div className="text-lg mb-1">{c.flag}</div>
                <div className="font-bold text-xs tracking-tight">{c.countryName}</div>
                <div
                  className={`text-[10px] mt-0.5 line-clamp-1 ${
                    isSelected ? 'text-stone-300' : 'text-stone-500'
                  }`}
                >
                  {c.systemName.split('(')[0].trim()}
                </div>
              </button>
            );
          })}
        </div>

        {/* UNIVERSITY TIER STANDARD SELECTOR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-stone-50/80 border border-stone-200">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-700">
              University Tier Standard:
            </span>
            <span className="text-xs text-stone-500">
              (Directly scales benchmark requirement thresholds and evaluated achieved standing)
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['Top 5', 'Top 10', 'Top 25', 'Top 50', 'Top 100'] as RankTier[]).map((tier) => {
              const isSelected = target.targetRankTier === tier;
              return (
                <button
                  key={tier}
                  type="button"
                  onClick={() => onUpdateTargetRankTier && onUpdateTargetRankTier(tier)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-stone-900 text-stone-100 border-stone-900 shadow-2xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                  }`}
                >
                  {tier}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SUB-VIEW 1: DETAILED COUNTRY DEEP-DIVE & CANDIDATE GAP ANALYSIS */}
      {activeSubView === 'country_deepdive' && (
        <div className="space-y-6 animate-fadeIn">
          {/* COUNTRY BANNER & PHILOSOPHY CARD */}
          <div className="p-5 sm:p-6 rounded-xl bg-stone-50/80 border border-stone-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentCountryProfile.flag}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                      {currentCountryProfile.systemName}
                    </h4>
                    {isCurrentTargetCountry ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold">
                        Active Target Objective
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onUpdateTargetCountry(currentCountryProfile.countryName)}
                        className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 underline underline-offset-2 cursor-pointer ml-1"
                      >
                        Set as Active Target Country
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5 font-medium">
                    {currentCountryProfile.tagline}
                  </p>
                </div>
              </div>

              {/* Weight Distribution: 100% Total Across 4 Pillars */}
              <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono">
                  <div className="bg-white px-2.5 py-1 rounded border border-stone-200 text-stone-700">
                    Academics: <strong>{currentCountryProfile.weights.academics}%</strong>
                  </div>
                  <div className="bg-white px-2.5 py-1 rounded border border-stone-200 text-stone-700">
                    Testing: <strong>{currentCountryProfile.weights.testingAndExams}%</strong>
                  </div>
                  <div className="bg-white px-2.5 py-1 rounded border border-stone-200 text-stone-700">
                    Supercurriculars: <strong>{currentCountryProfile.weights.supercurricularsAndProjects}%</strong>
                  </div>
                  <div className="bg-white px-2.5 py-1 rounded border border-stone-200 text-stone-700">
                    Leadership: <strong>{currentCountryProfile.weights.extracurricularsAndLeadership}%</strong>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    100% Total
                  </span>
                </div>

                {/* 100% Horizontal Proportion Bar */}
                <div className="w-full sm:w-72 h-2 rounded-full overflow-hidden flex bg-stone-100 border border-stone-200">
                  <div
                    style={{ width: `${currentCountryProfile.weights.academics}%` }}
                    className="bg-indigo-600 h-full"
                    title={`Academics: ${currentCountryProfile.weights.academics}%`}
                  />
                  <div
                    style={{ width: `${currentCountryProfile.weights.testingAndExams}%` }}
                    className="bg-amber-500 h-full"
                    title={`Testing: ${currentCountryProfile.weights.testingAndExams}%`}
                  />
                  <div
                    style={{ width: `${currentCountryProfile.weights.supercurricularsAndProjects}%` }}
                    className="bg-emerald-600 h-full"
                    title={`Supercurriculars & Research: ${currentCountryProfile.weights.supercurricularsAndProjects}%`}
                  />
                  <div
                    style={{ width: `${currentCountryProfile.weights.extracurricularsAndLeadership}%` }}
                    className="bg-rose-500 h-full"
                    title={`Leadership: ${currentCountryProfile.weights.extracurricularsAndLeadership}%`}
                  />
                </div>
              </div>
            </div>

            {/* Country Evaluation Mechanism vs Fatal Mistake */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 bg-white p-3.5 rounded-lg border border-stone-200">
                <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>How Admissions Actually Evaluates You in {currentCountryProfile.countryName}:</span>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  {currentCountryProfile.primarySelectionMechanism}
                </p>
              </div>

              <div className="space-y-1 bg-amber-50/70 p-3.5 rounded-lg border border-amber-200">
                <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  <span>The Fatal Rejection Mistake in {currentCountryProfile.countryName}:</span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  {currentCountryProfile.fatalMistake}
                </p>
              </div>
            </div>
          </div>

          {/* 6-DIMENSIONAL COMPETENCY GAP ANALYZER FOR THIS COUNTRY */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                  Calibrated for {target.targetRankTier} in {currentCountryProfile.countryName}
                </div>
                <h4 className="text-base font-serif font-bold text-stone-900">
                  6-Dimensional Competency: Achieved Points vs {target.targetRankTier} Benchmark
                </h4>
              </div>
              <div className="text-xs text-stone-600 font-mono bg-stone-50 px-2.5 py-1 rounded border border-stone-200 self-start sm:self-auto">
                {completedMilestoneIds.length} Blueprint Activities Completed
              </div>
            </div>

            {/* Live Achieved Points Calculation Breakdown Banner */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Current Readiness: {countryCompositeScore} pts</strong> · Baseline Standard ({candidateAchievedPoints.tierScoreAdjustment >= 0 ? '+' : ''}{candidateAchievedPoints.tierScoreAdjustment} pts for {target.targetRankTier}) + {candidateAchievedPoints.bonusPointsFromActivities || 0} activity bonus pts.
                </span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                Synchronized with Trajectory & Spider Radar
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {Object.values(dimensionalRequirements).map((dimExp: CountryDimensionalExpectation) => {
                const candidateScore = getCandidateScoreForDimension(dimExp.dimension);
                const gap = dimExp.targetScore - candidateScore;
                const isNegligible = dimExp.weightTier === 'Negligible / Unweighted';

                return (
                  <div
                    key={dimExp.dimension}
                    className={`p-4 rounded-xl border text-xs space-y-3 transition-all ${
                      isNegligible
                        ? 'bg-stone-50/40 border-stone-200 opacity-80'
                        : gap > 10
                        ? 'bg-white border-amber-200 shadow-2xs'
                        : 'bg-white border-stone-200 shadow-2xs'
                    }`}
                  >
                    {/* Top Row: Label, Weight Tier & Scores */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-sm">{dimExp.label}</span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                              dimExp.weightTier === 'Critical Mandatory'
                                ? 'bg-red-50 text-red-700 border-red-200 font-semibold'
                                : dimExp.weightTier === 'Core Evaluated'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-medium'
                                : dimExp.weightTier === 'Secondary Factor'
                                ? 'bg-stone-100 text-stone-600 border-stone-200'
                                : 'bg-stone-100 text-stone-400 border-stone-200'
                            }`}
                          >
                            {dimExp.weightTier} ({dimExp.weightPercentage}%)
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          {currentCountryProfile.countryName} Admissions Expectation
                        </div>
                      </div>

                      {/* Score Metrics */}
                      <div className="text-right shrink-0 font-mono">
                        <div className="flex items-center justify-end gap-1.5 text-xs">
                          <span className="font-bold text-stone-900">{candidateScore}</span>
                          <span className="text-stone-400">/</span>
                          <span className="text-stone-600">{dimExp.targetScore}</span>
                        </div>
                        <div
                          className={`text-[10px] font-semibold ${
                            isNegligible
                              ? 'text-stone-400'
                              : gap > 0
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          {isNegligible
                            ? 'Unweighted in this System'
                            : gap > 0
                            ? `Deficit: -${gap} pts`
                            : `Target Met (+${Math.abs(gap)})`}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar comparison */}
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden flex">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isNegligible
                              ? 'bg-stone-300'
                              : gap > 0
                              ? 'bg-amber-500'
                              : 'bg-emerald-600'
                          }`}
                          style={{ width: `${Math.min(100, candidateScore)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-stone-400">
                        <span>Current Baseline ({candidateScore})</span>
                        <span>{currentCountryProfile.countryName} Target ({dimExp.targetScore})</span>
                      </div>
                    </div>

                    {/* Country-Specific Requirement Explanation */}
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 space-y-1 text-[11px]">
                      <div className="font-semibold text-stone-800">
                        What {currentCountryProfile.countryName} Looks For:
                      </div>
                      <p className="text-stone-600 leading-relaxed">
                        {dimExp.countrySpecificNeed}
                      </p>
                    </div>

                    {/* Actionable Remedy to Close Gap */}
                    {!isNegligible && (
                      <div className="text-[11px] text-stone-700 pt-1 flex items-start gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-stone-900">Tactical Remedy for {currentCountryProfile.countryName}: </strong>
                          <span>{dimExp.tacticalRemedyGuidance}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* DETAILED ADMISSIONS PILLARS FOR THIS COUNTRY */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <div>
              <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                Admissions Pillars Checklist
              </div>
              <h4 className="text-base font-serif font-bold text-stone-900">
                Primary Selection Pillars at {currentCountryProfile.countryName} Universities
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentCountryProfile.pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="bg-stone-50/70 rounded-xl p-4 sm:p-5 border border-stone-200 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between gap-1 pb-2 border-b border-stone-200">
                    <span className="font-bold text-stone-900 text-sm">{pillar.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-600 font-semibold">
                      {pillar.weighting}
                    </span>
                  </div>

                  <p className="text-stone-700 leading-relaxed font-medium">
                    {pillar.systemRequirement}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-mono uppercase text-stone-500">Evaluation Criteria:</div>
                    <ul className="space-y-1 text-[11px] text-stone-600">
                      {pillar.evaluationCriteria.map((crit, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-1.5">
                          <span className="text-stone-400 select-none mt-0.5">•</span>
                          <span>{crit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <blockquote className="pt-2 border-t border-stone-200 text-[11px] italic text-stone-500 leading-snug">
                    {pillar.admissionsOfficerQuote}
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: CROSS-COUNTRY MATRIX */}
      {activeSubView === 'cross_country_matrix' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h4 className="text-base font-serif font-bold text-stone-900">
              Cross-Country Admissions Matrix: System Weightings & Selection Filters
            </h4>
            <p className="text-xs text-stone-600 mt-0.5">
              Side-by-side comparison illustrating why applying to multiple countries requires distinct profile calibration.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="min-w-full divide-y divide-stone-200 text-xs">
              <thead className="bg-stone-100 text-stone-700 font-mono text-[11px] uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Destination</th>
                  <th className="px-4 py-3 text-left">System Style</th>
                  <th className="px-3 py-3 text-center">Academics Weight</th>
                  <th className="px-3 py-3 text-center">Testing & Exams</th>
                  <th className="px-3 py-3 text-center">Supercurriculars</th>
                  <th className="px-3 py-3 text-center">Leadership Spike</th>
                  <th className="px-4 py-3 text-left">The Decisive Factor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {COUNTRY_COMPETENCY_PROFILES.map((c) => (
                  <tr key={c.countryId} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-stone-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{c.flag}</span>
                        <span>{c.countryName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-stone-600 max-w-xs">{c.systemName}</td>
                    <td className="px-3 py-3.5 text-center font-mono font-bold text-stone-900">
                      {c.weights.academics}%
                    </td>
                    <td className="px-3 py-3.5 text-center font-mono font-medium text-stone-700">
                      {c.weights.testingAndExams}%
                    </td>
                    <td className="px-3 py-3.5 text-center font-mono font-medium text-stone-700">
                      {c.weights.supercurricularsAndProjects}%
                    </td>
                    <td className="px-3 py-3.5 text-center font-mono font-medium">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          c.weights.extracurricularsAndLeadership >= 20
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                            : c.weights.extracurricularsAndLeadership >= 5
                            ? 'bg-stone-100 text-stone-700 border border-stone-200'
                            : 'bg-stone-50 text-stone-400'
                        }`}
                      >
                        {c.weights.extracurricularsAndLeadership}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-stone-700 text-[11px] leading-relaxed max-w-sm">
                      {c.winningStrategy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MULTI-COUNTRY APPLICATION FRICTION SUMMARY */}
          <div className="p-5 rounded-xl bg-indigo-50/60 border border-indigo-200 text-xs space-y-2.5">
            <div className="font-bold text-indigo-950 flex items-center gap-1.5 text-sm">
              <Scale className="w-4 h-4 text-indigo-700" />
              <span>The Multi-Country Application Friction: Managing Strategy across Borders</span>
            </div>
            <p className="text-indigo-900 leading-relaxed">
              If {target.studentName} is applying to both the <strong>United States</strong> and the <strong>United Kingdom</strong>, note the fundamental tension:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-3 rounded-lg border border-indigo-200">
                <strong className="text-stone-900 block mb-1">For US Universities:</strong>
                <span className="text-stone-600">
                  Build out the community leadership initiative and publish an intellectual spike. Your personal statement must reveal emotional self-awareness, character, and vision.
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-indigo-200">
                <strong className="text-stone-900 block mb-1">For UK Universities:</strong>
                <span className="text-stone-600">
                  Completely strip out the non-profit leadership from your UCAS statement. Replace it with 80%+ analysis of advanced mathematical problems, reading lists, and STEP/TMUA contest prep.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: ADMITTED STUDENT LOOKALIKES FOR THIS COUNTRY */}
      {activeSubView === 'admitted_lookalikes' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-base font-serif font-bold text-stone-900">
                Admitted Student Dossiers in {currentCountryProfile.countryName}
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Empirical look-alike profiles admitted to {target.targetRankTier} institutions in {currentCountryProfile.countryName}.
              </p>
            </div>
            <div className="text-xs font-mono text-stone-500">
              Showing {lookalikeStudents.length} matching candidates
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lookalikeStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-xl p-5 border border-stone-200 shadow-2xs space-y-3.5 hover:border-stone-300 transition-all text-xs"
              >
                <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-stone-900 text-sm">{student.name}</span>
                      <span className="text-stone-400 text-[11px]">· {student.country}</span>
                    </div>
                    <div className="text-indigo-700 font-semibold text-xs mt-0.5">
                      {student.university} ({student.course})
                    </div>
                  </div>

                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-stone-100 text-stone-700 border border-stone-200 font-semibold shrink-0">
                    {student.rankTier}
                  </span>
                </div>

                <div className="space-y-1.5 text-stone-700">
                  <div>
                    <strong className="text-stone-900">Academics & Testing: </strong>
                    <span>{student.academicsPerformance} · {student.actSat}</span>
                  </div>
                  <div>
                    <strong className="text-stone-900">Key Spike: </strong>
                    <span className="text-emerald-800 font-medium">{student.keySpike || student.research}</span>
                  </div>
                  <div>
                    <strong className="text-stone-900">Competitions: </strong>
                    <span>{student.competitionsAwards || 'None logged'}</span>
                  </div>
                  <div>
                    <strong className="text-stone-900">Leadership: </strong>
                    <span>{student.otherActivities || 'None logged'}</span>
                  </div>
                </div>

                {onInspectStudent && (
                  <div className="pt-2 border-t border-stone-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onInspectStudent(student)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-stone-800 hover:text-stone-950 underline underline-offset-2 cursor-pointer"
                    >
                      <span>Inspect Full Dossier</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
