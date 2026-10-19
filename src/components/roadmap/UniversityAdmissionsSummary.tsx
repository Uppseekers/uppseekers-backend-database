import React, { useState } from 'react';
import {
  Globe2,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Trophy,
  Code,
  FileText,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react';
import {
  COUNTRY_SYSTEM_COMPARISONS,
  UNIVERSITY_VISIONS,
  UniversityVisionInfo,
  getUniversityVisionData,
} from '../../data/universityVisions';
import { RankTier } from '../../types';

interface UniversityAdmissionsSummaryProps {
  targetCountry: string;
  targetUniversity?: string;
  targetRankTier: RankTier;
  targetField?: string;
  onSelectUniversity?: (uniName: string) => void;
}

export const UniversityAdmissionsSummary: React.FC<UniversityAdmissionsSummaryProps> = ({
  targetCountry,
  targetUniversity,
  targetRankTier,
  targetField,
  onSelectUniversity,
}) => {
  // Active sub-tab: 'institutional_vision' | 'cross_country_matrix' | 'multi_country_trap'
  const [activeTab, setActiveTab] = useState<'institutional_vision' | 'cross_country_matrix' | 'multi_country_trap'>(
    'institutional_vision'
  );

  // Selected country in cross-country comparison
  const [selectedComparisonCountry, setSelectedComparisonCountry] = useState<string>(
    targetCountry === 'United Kingdom' ? 'United Kingdom' : 'United States'
  );

  // Get active university vision data dynamically based on current target country, tier, and discipline
  const visionData: UniversityVisionInfo = getUniversityVisionData(
    targetUniversity,
    targetCountry,
    targetRankTier,
    targetField
  );

  return (
    <div id="admissions-philosophy-module" className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-6 print:hidden">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider mb-1 flex-wrap">
            <span>Admissions Philosophy & Institutional Ethos</span>
            <span>·</span>
            <span className="font-semibold text-stone-800 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
              {targetCountry && targetCountry !== 'All Global' ? `${targetCountry} (${targetRankTier})` : `Global Standard (${targetRankTier})`}
            </span>
            <span>·</span>
            <span className="font-semibold text-stone-900 bg-stone-100 border border-stone-300 px-2 py-0.5 rounded">
              {visionData.universityName}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            What Universities Look For in a Candidate Dossier
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
            Many high-achieving applicants get rejected not because their profile is weak, but because it is calibrated for the wrong country’s admissions philosophy. Discover how <strong className="text-stone-900">{visionData.shortName}</strong> ({visionData.country}) and <strong className="text-stone-900">{targetCountry}</strong> peer institutions specifically evaluate candidates, and how institutional vision dictates selection.
          </p>
        </div>

        {/* View Switcher Tabs (Clean Segmented Control) */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 shrink-0 self-start lg:self-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('institutional_vision')}
            className={`px-3 py-1.5 font-medium rounded-md transition-all cursor-pointer ${
              activeTab === 'institutional_vision'
                ? 'bg-stone-900 text-stone-100 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Institutional Ethos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('multi_country_trap')}
            className={`px-3 py-1.5 font-medium rounded-md transition-all cursor-pointer ${
              activeTab === 'multi_country_trap'
                ? 'bg-stone-900 text-stone-100 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Multi-Country Trap
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cross_country_matrix')}
            className={`px-3 py-1.5 font-medium rounded-md transition-all cursor-pointer ${
              activeTab === 'cross_country_matrix'
                ? 'bg-stone-900 text-stone-100 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Country System Matrix
          </button>
        </div>
      </div>

      {/* QUICK INSTITUTION PRESETS (Dynamically filtered by Target Country) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-stone-400 font-mono text-[11px] uppercase tracking-wider shrink-0">
          {targetCountry && targetCountry !== 'All Global' ? `${targetCountry} Dossiers:` : 'Institution Dossiers:'}
        </span>
        {(() => {
          const allEntries = Object.entries(UNIVERSITY_VISIONS);
          const cNorm = (targetCountry || '').toLowerCase();
          const countryMatched = allEntries.filter(([_, uni]) => {
            const uniCountry = uni.country.toLowerCase();
            if (cNorm.includes('kingdom') || cNorm.includes('uk')) return uniCountry.includes('kingdom') || uniCountry.includes('uk');
            if (cNorm.includes('states') || cNorm.includes('us')) return uniCountry.includes('states') || uniCountry.includes('us');
            if (cNorm.includes('canada')) return uniCountry.includes('canada');
            if (cNorm.includes('singapore')) return uniCountry.includes('singapore');
            if (cNorm.includes('switzerland') || cNorm.includes('europe')) return uniCountry.includes('switzerland') || uniCountry.includes('europe');
            if (cNorm.includes('australia')) return uniCountry.includes('australia');
            return true;
          });

          const entriesToRender = countryMatched.length > 0 ? countryMatched : allEntries;

          return entriesToRender.map(([key, uni]) => {
            const isSelected =
              visionData.shortName === uni.shortName ||
              (targetUniversity &&
                (targetUniversity.toLowerCase().includes(key) ||
                  key.includes(targetUniversity.toLowerCase()) ||
                  targetUniversity.toLowerCase().includes(uni.shortName.toLowerCase())));

            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectUniversity && onSelectUniversity(uni.universityName)}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-stone-100 border-stone-900 font-semibold'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                }`}
              >
                <span>{uni.shortName}</span>
                <span className="text-[10px] font-mono text-stone-400 ml-1">#{uni.rank}</span>
                <span className="text-[10px] text-stone-400 ml-1">({uni.country})</span>
              </button>
            );
          });
        })()}
      </div>

      {/* SUB-TAB 1: INSTITUTIONAL ETHOS & SELECTION CRITERIA */}
      {activeTab === 'institutional_vision' && (
        <div className="space-y-6">
          {/* Institutional Ethos Card (Whitepaper memo) */}
          <div className="bg-stone-50/70 border border-stone-200 rounded-xl p-6 sm:p-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider">
                  <span>{visionData.badge}</span>
                  <span>·</span>
                  <span>{visionData.country}</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1">
                  {visionData.universityName}
                </h4>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-mono text-stone-700 italic">
                  "{visionData.motto}"
                </span>
                <div className="text-[11px] text-stone-500">
                  Translation: {visionData.mottoTranslation}
                </div>
              </div>
            </div>

            {/* Official Vision Statement */}
            <div className="text-xs sm:text-sm text-stone-800 leading-relaxed bg-white p-4 rounded-lg border border-stone-200">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block mb-1">
                Official Institutional Vision Statement:
              </span>
              "{visionData.visionStatement}"
            </div>

            {/* Core Selection DNA Memo */}
            <div className="space-y-1.5 pt-1">
              <div className="text-xs font-mono uppercase tracking-wider text-stone-600">
                Admissions Committee Selection DNA:
              </div>
              <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed bg-white p-4 rounded-lg border border-stone-200">
                {visionData.coreSelectionPhilosophy}
              </p>
            </div>

            {/* Multi-Country Perspective Note */}
            <div className="p-3.5 bg-amber-50/70 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-0.5">
              <div className="font-semibold text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span>Multi-Country Cross-Application Advice:</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                {visionData.multiCountryAdvice}
              </p>
            </div>
          </div>

          {/* The Rejection Paradox Warning Memo */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 text-xs text-stone-800 space-y-1.5">
            <div className="font-semibold text-stone-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-stone-600" />
              <span>Why High-Stat Profiles Get Rejected at {visionData.shortName}:</span>
            </div>
            <p className="text-stone-700 leading-relaxed">
              {visionData.whyGreatProfilesFailHere}
            </p>
          </div>

          {/* SELECTION PILLARS WITH DIRECT BULLET POINTS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-mono uppercase tracking-wider text-stone-600">
                Evaluator Decision Pillars & Evidence Required:
              </h5>
              <span className="text-xs text-stone-500 font-mono">
                Assessed in Candidate Dossier
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visionData.whatAdmissionsLooksFor.map((pillar, idx) => (
                <div
                  key={idx}
                  className="bg-stone-50/60 border border-stone-200 rounded-xl p-5 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-stone-900">
                        {idx + 1}. {pillar.pillar}
                      </span>
                      <span className="text-[10px] font-mono text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200">
                        {pillar.weighting}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Concrete Evidence Required */}
                  <div className="p-3 bg-white rounded-lg border border-stone-200 text-xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block mb-0.5">
                      Concrete Evidence Required in Application:
                    </span>
                    <span className="text-stone-800 font-medium text-[11px] leading-relaxed">
                      {pillar.evidenceNeeded}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIONABLE VISION ALIGNMENT (DIRECT TAKEAWAYS) */}
          <div className="p-5 rounded-xl bg-stone-50/60 border border-stone-200 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-stone-600" />
              <span>How to Align Your Portfolio with {visionData.shortName}'s Vision:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                <span className="font-semibold text-stone-900 block">
                  • Research Focus
                </span>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {visionData.actionableVisionAlignment.researchTip}
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                <span className="font-semibold text-stone-900 block">
                  • Competitions Priority
                </span>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {visionData.actionableVisionAlignment.competitionsTip}
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                <span className="font-semibold text-stone-900 block">
                  • Tangible Artifacts
                </span>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {visionData.actionableVisionAlignment.projectsTip}
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                <span className="font-semibold text-stone-900 block">
                  • Essay Tone & Framing
                </span>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {visionData.actionableVisionAlignment.essayTip}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: THE MULTI-COUNTRY APPLICATION TRAP */}
      {activeTab === 'multi_country_trap' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-xl bg-stone-50/70 border border-stone-200 space-y-3">
            <h4 className="text-base font-serif font-bold text-stone-900">
              The Multi-Country Application Paradox Explained
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Why a profile considered top-tier in the United States gets rejected in the United Kingdom or Singapore (and vice-versa).
            </p>
            <p className="text-xs text-stone-700 leading-relaxed font-medium">
              Applicants frequently prepare one generic profile and submit it across universities in the US, UK, Canada, and Singapore. <strong>This is the primary cause of rejection for high-achieving candidates.</strong> Each country's admissions system operates on fundamentally divergent evaluation criteria.
            </p>
          </div>

          {/* 3 Real Scenarios (Direct Bullet-Point Takeaways) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Scenario 1 */}
            <div className="p-5 rounded-xl bg-stone-50/60 border border-stone-200 space-y-2.5">
              <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                Trap 1: The US All-Rounder in the UK
              </div>
              <div className="space-y-1.5 text-stone-700 leading-relaxed">
                <div>
                  <strong className="text-stone-900">• Candidate Dossier: </strong>
                  Valedictorian, Student Council President, Varsity Tennis Captain, 100 volunteer hours, founder of a charity.
                </div>
                <div>
                  <strong className="text-amber-800">• Oxford / Cambridge Outcome: </strong>
                  Direct rejection.
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-stone-200 text-[11px] text-stone-600">
                  <strong className="text-stone-900">Why: </strong>
                  UK tutors view sports and generic charity as irrelevant to reading History or Engineering. Because the student neglected deep subject texts, STEP prep, and academic papers, the UCAS personal statement appears superficial.
                </div>
              </div>
            </div>

            {/* Scenario 2 */}
            <div className="p-5 rounded-xl bg-stone-50/60 border border-stone-200 space-y-2.5">
              <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                Trap 2: The UK Pure Specialist in the US
              </div>
              <div className="space-y-1.5 text-stone-700 leading-relaxed">
                <div>
                  <strong className="text-stone-900">• Candidate Dossier: </strong>
                  BMO1 Gold Medalist, 4 A*s in Further Maths/Physics/Chemistry, spends 40 hours a week solving mathematical proofs alone.
                </div>
                <div>
                  <strong className="text-amber-800">• Harvard / Stanford Outcome: </strong>
                  Waitlist or rejection.
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-stone-200 text-[11px] text-stone-600">
                  <strong className="text-stone-900">Why: </strong>
                  US admissions committees evaluate character, collaborative warmth, and societal empathy. A candidate who appears as a lone genius with zero community presence fails the holistic "roommate test."
                </div>
              </div>
            </div>

            {/* Scenario 3 */}
            <div className="p-5 rounded-xl bg-stone-50/60 border border-stone-200 space-y-2.5">
              <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                Trap 3: The Holistic Innovator in Singapore
              </div>
              <div className="space-y-1.5 text-stone-700 leading-relaxed">
                <div>
                  <strong className="text-stone-900">• Candidate Dossier: </strong>
                  Founded startup with $20k ARR, 1490 SAT, charismatic speaker, 3.82 unweighted GPA.
                </div>
                <div>
                  <strong className="text-amber-800">• NUS / NTU Outcome: </strong>
                  Eliminated at automated cutoff.
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-stone-200 text-[11px] text-stone-600">
                  <strong className="text-stone-900">Why: </strong>
                  NUS Computer Science enforces strict Indicative Grade Profiles (IGP). If an applicant's test score or GPA falls below the 90th percentile threshold, the dossier is filtered out before qualitative achievements are reviewed.
                </div>
              </div>
            </div>
          </div>

          {/* DUAL-TRACK SOLUTION MEMO */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-stone-200 space-y-3 text-xs">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-600">
              The Dual-Track Architecture (Winning Multiple Systems):
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-stone-700">
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                <span className="font-semibold text-stone-900 block">
                  1. Anchor with Supercurricular Rigor (UK, Europe, Canada)
                </span>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Conduct deep independent research, participate in national Olympiads (AIME/BMO/Euclid), and master advanced undergraduate texts. This pure academic mastery satisfies Oxford, Cambridge, Waterloo, and ETH Zurich.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                <span className="font-semibold text-stone-900 block">
                  2. Disseminate for Community Impact (Holistic Systems)
                </span>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Take the exact same technical research or coding project and open-source it, run community workshops, or found an initiative mentoring younger peers. This demonstrates the leadership, collaborative warmth, and civic character that {targetCountry === 'United States' ? `${visionData.shortName}, Stanford, and Harvard` : targetCountry === 'United Kingdom' ? `${visionData.shortName}, Oxford, and Cambridge` : targetCountry === 'Canada' ? `${visionData.shortName} and Waterloo` : targetCountry === 'Singapore' ? 'NUS and NTU' : `${visionData.shortName} and premier peer institutions`} prioritize.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CROSS-COUNTRY MATRIX */}
      {activeTab === 'cross_country_matrix' && (
        <div className="space-y-6">
          {/* Country Selection Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {COUNTRY_SYSTEM_COMPARISONS.map((sys) => (
              <button
                key={sys.country}
                type="button"
                onClick={() => setSelectedComparisonCountry(sys.country)}
                className={`px-3.5 py-1.5 rounded-md font-medium transition-all border shrink-0 cursor-pointer ${
                  selectedComparisonCountry === sys.country
                    ? 'bg-stone-900 text-stone-100 border-stone-900 font-semibold'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>{sys.flag} {sys.country}</span>
              </button>
            ))}
          </div>

          {/* Active Country Detail Memo */}
          {(() => {
            const currentSys =
              COUNTRY_SYSTEM_COMPARISONS.find(
                (c) => c.country === selectedComparisonCountry
              ) || COUNTRY_SYSTEM_COMPARISONS[0];

            return (
              <div className="p-5 sm:p-6 rounded-xl bg-stone-50/70 border border-stone-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
                  <div>
                    <h4 className="text-base font-serif font-bold text-stone-900">
                      {currentSys.flag} {currentSys.country}: {currentSys.systemName}
                    </h4>
                    <p className="text-xs text-stone-600 font-medium">
                      Core Evaluator Mindset: {currentSys.philosophy}
                    </p>
                  </div>
                </div>

                {/* 6 Key Comparison Dimensions (Direct Bullet Points) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 bg-white rounded-lg border border-stone-200">
                    <span className="font-semibold text-stone-900 block mb-1">
                      • Academic Weighting
                    </span>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      {currentSys.academicWeight}
                    </p>
                  </div>

                  <div className="p-3.5 bg-white rounded-lg border border-stone-200">
                    <span className="font-semibold text-stone-900 block mb-1">
                      • Extracurricular Evaluation
                    </span>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      {currentSys.extracurricularWeight}
                    </p>
                  </div>

                  <div className="p-3.5 bg-white rounded-lg border border-stone-200">
                    <span className="font-semibold text-stone-900 block mb-1">
                      • Testing & Assessments
                    </span>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      {currentSys.testingWeight}
                    </p>
                  </div>

                  <div className="p-3.5 bg-white rounded-lg border border-stone-200">
                    <span className="font-semibold text-stone-900 block mb-1">
                      • Personal Statement Focus
                    </span>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      {currentSys.personalStatementFocus}
                    </p>
                  </div>

                  <div className="p-3.5 bg-white rounded-lg border border-stone-200">
                    <span className="font-semibold text-stone-900 block mb-1">
                      • Interview Methodology
                    </span>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      {currentSys.interviewStyle}
                    </p>
                  </div>

                  <div className="p-3.5 bg-white rounded-lg border border-stone-200">
                    <span className="font-semibold text-amber-900 block mb-1">
                      • Primary Rejection Cause
                    </span>
                    <p className="text-amber-800 text-[11px] leading-relaxed">
                      {currentSys.fatalMistake}
                    </p>
                  </div>
                </div>

                {/* Winning Strategy Memo */}
                <div className="p-3 bg-white rounded-lg border border-stone-200 text-xs">
                  <span className="font-semibold text-stone-900">Winning Blueprint for {currentSys.country}: </span>
                  <span className="text-stone-700">{currentSys.winningStrategy}</span>
                </div>
              </div>
            );
          })()}

          {/* Full Side-by-Side Summary Table (Clean Whitepaper Table) */}
          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-stone-100/80 text-stone-700 font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3 font-mono text-[11px] uppercase tracking-wider">Country</th>
                  <th className="p-3 font-mono text-[11px] uppercase tracking-wider">Academics vs Extracurriculars</th>
                  <th className="p-3 font-mono text-[11px] uppercase tracking-wider">Key Assessments</th>
                  <th className="p-3 font-mono text-[11px] uppercase tracking-wider">Personal Statement</th>
                  <th className="p-3 font-mono text-[11px] uppercase tracking-wider">Rejection Trap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {COUNTRY_SYSTEM_COMPARISONS.map((sys) => (
                  <tr
                    key={sys.country}
                    className="hover:bg-stone-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedComparisonCountry(sys.country)}
                  >
                    <td className="p-3 font-semibold text-stone-900 whitespace-nowrap">
                      {sys.flag} {sys.country}
                    </td>
                    <td className="p-3 text-stone-600">
                      <div className="font-medium text-stone-800">{sys.systemName}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{sys.philosophy}</div>
                    </td>
                    <td className="p-3 text-stone-600 text-[11px]">
                      {sys.testingWeight}
                    </td>
                    <td className="p-3 text-stone-600 text-[11px]">
                      {sys.personalStatementFocus}
                    </td>
                    <td className="p-3 text-amber-800 text-[11px]">
                      {sys.fatalMistake}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
