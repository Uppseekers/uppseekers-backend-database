import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Copy,
  Check,
  Printer,
  Download,
  Sparkles,
  BookOpen,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  FileText,
  BarChart3,
  Globe2,
} from 'lucide-react';
import {
  AspiringStudentBaseline,
  AspiringStudentTarget,
  BackEngineeredPath,
} from '../../types';
import {
  triggerDossierPrint,
  generatePrintableDossierHTML,
  downloadDossierHTML,
  PrintableRequiredProfile,
} from '../../utils/printReport';
import { detectProfileCompletedActivities } from '../../utils/roadmapEngine';

interface AspirantReportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  target: AspiringStudentTarget;
  baseline: AspiringStudentBaseline;
  pathData: BackEngineeredPath;
  totalMilestonesCount: number;
  completedMilestonesCount: number;
  requiredProfile?: PrintableRequiredProfile;
  initialTab?: 'preview' | 'gap_analysis' | 'markdown';
}

export const AspirantReportDrawer: React.FC<AspirantReportDrawerProps> = ({
  isOpen,
  onClose,
  target,
  baseline,
  pathData,
  totalMilestonesCount,
  completedMilestonesCount,
  requiredProfile,
  initialTab = 'preview',
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'gap_analysis' | 'markdown'>(initialTab);
  const [copied, setCopied] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const detectedActivities = useMemo(() => {
    return detectProfileCompletedActivities(target, baseline);
  }, [target, baseline]);

  if (!isOpen) return null;

  // Calculate gaps
  const problemSolvingGap = pathData.cohortBenchmarks.problemSolving - pathData.aspirantScores.problemSolving;
  const technicalSkillsGap = pathData.cohortBenchmarks.technicalSkills - pathData.aspirantScores.technicalSkills;
  const criticalThinkingGap = pathData.cohortBenchmarks.criticalThinking - pathData.aspirantScores.criticalThinking;
  const teamWorkGap = pathData.cohortBenchmarks.teamWork - pathData.aspirantScores.teamWork;
  const communicationGap = pathData.cohortBenchmarks.communication - pathData.aspirantScores.communication;
  const creativityGap = pathData.cohortBenchmarks.creativity - pathData.aspirantScores.creativity;

  const trajectoryMessage = pathData.readinessScore >= 80
    ? `Strong foundational alignment with ${target.targetRankTier} standards. Execution must now center on closing the remaining spike gap in ${target.targetField} through verified research preprints and national-level competition honors.`
    : pathData.readinessScore >= 60
    ? `Promising competitive baseline for ${target.targetRankTier}. Current credentials show solid classroom rigor, but require an urgent shift toward external verification artifacts (publications, high-impact prototypes, and state/national recognitions) to bridge the +${pathData.projectedReadinessScore - pathData.readinessScore} point trajectory deficit.`
    : `Emerging profile currently facing a notable gap against admitted ${target.targetRankTier} cohorts. Prioritize establishing an unshakeable academic anchor while initiating foundational domain certifications and club leadership in ${target.targetField}.`;

  // Build clean, professional Markdown report
  const generateMarkdownReport = (): string => {
    return `# ADMISSIONS INTELLIGENCE DOSSIER & STRATEGIC ROADMAP
**Prepared for:** ${target.studentName}  
**Date Generated:** ${currentDate}  
**Current Grade:** ${target.currentGrade}  
**Target Discipline:** ${target.targetField}  
**Target University Tier:** ${target.targetRankTier} (${target.targetUniversity || `${target.targetCountry} Target`})  
**Admissions System Context:** ${target.targetCountry}

---

## 1. EXECUTIVE DIAGNOSTIC SUMMARY
- **Baseline Profile Readiness:** ${pathData.readinessScore} / 100
- **Projected Target Tier Readiness:** ${pathData.projectedReadinessScore} / 100
- **Trajectory Delta to Close:** +${pathData.projectedReadinessScore - pathData.readinessScore} points
- **Supercurricular Milestones Volume:** ${completedMilestonesCount} / ${totalMilestonesCount} completed (Scaled dynamically for ${target.targetRankTier} in ${target.targetCountry})

### Strategic Trajectory Assessment:
${trajectoryMessage}

---

## 2. 6-ASPECT COMPETENCY RADAR BENCHMARK
Calibrated empirically against admitted student records for ${target.targetRankTier} institutions in ${target.targetCountry}.

| Competency Dimension | Current Candidate Score | Target Tier Benchmark | Deficit / Status |
| :--- | :--- | :--- | :--- |
| **Problem Solving** | ${pathData.aspirantScores.problemSolving} / 100 | ${pathData.cohortBenchmarks.problemSolving} / 100 | ${problemSolvingGap > 0 ? `Deficit: -${problemSolvingGap} pts` : 'Target Satisfied'} |
| **Technical Skills** | ${pathData.aspirantScores.technicalSkills} / 100 | ${pathData.cohortBenchmarks.technicalSkills} / 100 | ${technicalSkillsGap > 0 ? `Deficit: -${technicalSkillsGap} pts` : 'Target Satisfied'} |
| **Critical Thinking** | ${pathData.aspirantScores.criticalThinking} / 100 | ${pathData.cohortBenchmarks.criticalThinking} / 100 | ${criticalThinkingGap > 0 ? `Deficit: -${criticalThinkingGap} pts` : 'Target Satisfied'} |
| **Team Work** | ${pathData.aspirantScores.teamWork} / 100 | ${pathData.cohortBenchmarks.teamWork} / 100 | ${teamWorkGap > 0 ? `Deficit: -${teamWorkGap} pts` : 'Target Satisfied'} |
| **Communication** | ${pathData.aspirantScores.communication} / 100 | ${pathData.cohortBenchmarks.communication} / 100 | ${communicationGap > 0 ? `Deficit: -${communicationGap} pts` : 'Target Satisfied'} |
| **Creativity** | ${pathData.aspirantScores.creativity} / 100 | ${pathData.cohortBenchmarks.creativity} / 100 | ${creativityGap > 0 ? `Deficit: -${creativityGap} pts` : 'Target Satisfied'} |

**Harmonized Total Score Points:** Candidate: ${pathData.aspirantScores.totalPoints || 0} pts sum vs Benchmark: ${pathData.cohortBenchmarks.totalPoints || 0} pts sum (Net Gap: ${Math.max(0, (pathData.cohortBenchmarks.totalPoints || 0) - (pathData.aspirantScores.totalPoints || 0))} pts)

---

## 3. PRIMARY COMPETENCY GAPS & TACTICAL REMEDIES
${pathData.primaryGaps
  .map(
    (gap, index) => `### Gap ${index + 1}: ${gap.area}
- **Current Observation & Deficit:** ${gap.gapDescription}
- **Tactical Remedy:** ${gap.recommendedRemedy}
`
  )
  .join('\n')}

---

## 4. CURRENT CANDIDATE CREDENTIAL BASELINE
- **Academics & GPA Rigor:** ${baseline.gpaRigor || 'Unspecified'}
- **Standardized Testing:** ${baseline.testingStatus || 'Unspecified'}
- **Internships & Industry Experience:** ${baseline.internshipsWork || 'None recorded'}
- **Research & Publications:** ${baseline.researchExperience || 'None recorded'}
- **Competitions & Olympiads:** ${baseline.competitionsHonors || 'None recorded'}
- **Technical Projects & Artifacts:** ${baseline.technicalProjects || 'None recorded'}
- **Leadership & Initiatives:** ${baseline.leadershipActivities || 'None recorded'}

---

## 5. SUPERCURRICULAR ACTION BLUEPRINT (${totalMilestonesCount} SCALED MILESTONES)
${pathData.milestones
  .map(
    (m) => `### ${m.grade} (${m.quarter}): ${m.title}
- **Category:** ${m.category.toUpperCase()}
- **Impact Level:** ${m.impactTier}
- **Commitment:** ${m.timeCommitment}
- **Action Description:** ${m.description}
- **Admissions Officer Insight:** ${m.mentorInsight}
`
  )
  .join('\n')}

---

## 6. ADMISSIONS COMMITTEE STRATEGIC TAKEAWAYS
1. **Differentiate Beyond Grades:** At ${target.targetRankTier} level, high test scores and near-perfect GPAs are table stakes. The differentiator is demonstrable spike depth in ${target.targetField}.
2. **Execute First High-Leverage Artifact:** Shift immediate focus from collecting passive certificates to creating verifiable public artifacts (e.g. peer-reviewed preprint, national olympiad round, open-source deployment, or community initiative).
3. **Next 90-Day Execution Target:** Focus entirely on closing the primary deficit in **${pathData.primaryGaps[0]?.area || 'Independent Scholarly Inquiry'}**.

*Confidential Report — Generated via Admissions Empirical Intelligence Platform*
`;
  };

  const markdownText = generateMarkdownReport();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownText);
      setCopied(true);
      setFeedbackMessage('Markdown copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
        setFeedbackMessage(null);
      }, 2500);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = markdownText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setFeedbackMessage('Markdown copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
        setFeedbackMessage(null);
      }, 2500);
    }
  };

  const handleNativePrint = () => {
    setFeedbackMessage('Print dialog initiated. If blocked by browser sandbox, click "Download HTML Report".');
    triggerDossierPrint();
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleDownloadHTML = () => {
    const html = generatePrintableDossierHTML({
      target,
      baseline,
      pathData,
      detectedActivities,
      requiredProfile,
      isGapAnalysisOnly: activeTab === 'gap_analysis',
    });
    const filename = `${target.studentName.replace(/\s+/g, '_')}_${activeTab === 'gap_analysis' ? 'Gap_Analysis' : 'Admissions_Dossier'}.html`;
    downloadDossierHTML(filename, html);
    setFeedbackMessage(`Exported standalone report "${filename}"! Open in browser and choose Print / Save to PDF.`);
    setTimeout(() => setFeedbackMessage(null), 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/60 backdrop-blur-xs transition-opacity animate-fadeIn print:static print:bg-white print:p-0 print:block">
      {/* Backdrop click to dismiss */}
      <div className="flex-1 print:hidden" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col border-l border-stone-200 overflow-hidden print:w-full print:max-w-full print:h-auto print:border-none print:shadow-none">
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 bg-stone-900 text-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 shrink-0 print:hidden">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-stone-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Admissions Intelligence Dossier</span>
              <span>·</span>
              <span className="text-amber-300 font-semibold">{target.targetCountry}</span>
              <span>·</span>
              <span>{target.targetRankTier} Benchmark</span>
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight">
              {target.studentName} — Admissions Diagnostic Report
            </h2>
            <p className="text-xs text-stone-300">
              {target.currentGrade} · {target.targetField} · {target.targetUniversity || `${target.targetCountry} Peer Standard`}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleNativePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold transition-all cursor-pointer shadow-xs"
              title="Print directly or save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadHTML}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-800 text-stone-200 hover:bg-stone-700 transition-all cursor-pointer border border-stone-700"
              title="Download standalone clean HTML document ready for printing"
            >
              <Download className="w-3.5 h-3.5 text-stone-300" />
              <span>Download HTML</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-stone-800 text-stone-200 border-stone-700 hover:bg-stone-700'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedbackMessage && (
          <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200 text-xs font-medium text-amber-900 flex items-center justify-between animate-fadeIn print:hidden">
            <span>{feedbackMessage}</span>
            <button type="button" onClick={() => setFeedbackMessage(null)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Toggle Navigation */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-stone-100 border-b border-stone-200 shrink-0 text-xs print:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white text-stone-900 shadow-2xs border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-stone-500" />
              <span>Full Admissions Dossier</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gap_analysis')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === 'gap_analysis'
                  ? 'bg-white text-stone-900 shadow-2xs border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-stone-500" />
              <span>Gap Analysis & Radar Breakdown</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('markdown')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === 'markdown'
                  ? 'bg-white text-stone-900 shadow-2xs border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Markdown Source
            </button>
          </div>

          <div className="text-[11px] font-mono text-stone-500 hidden sm:block">
            {completedMilestonesCount} / {totalMilestonesCount} Milestones Verified ({target.targetCountry})
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 print:overflow-visible print:p-0 print:space-y-4">
          {activeTab === 'markdown' ? (
            <div className="relative">
              <button
                type="button"
                onClick={handleCopy}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded bg-stone-800 text-stone-200 hover:bg-stone-700 cursor-pointer shadow-sm border border-stone-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <pre className="p-5 bg-stone-900 text-stone-200 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed border border-stone-800 select-all">
                {markdownText}
              </pre>
            </div>
          ) : activeTab === 'gap_analysis' ? (
            <div className="space-y-6 print:space-y-4">
              {/* Gap Analysis Focus Banner */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-stone-500">
                    <Globe2 className="w-3.5 h-3.5 text-stone-600" />
                    <span>Regional Competency Benchmark Overlay · {target.targetCountry}</span>
                  </div>
                  <span className="text-xs text-stone-600 font-mono">{currentDate}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-stone-900">
                      {target.studentName} — 6-Dimensional Gap Analysis
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Targeting <strong className="text-stone-900">{target.targetRankTier} Tier Standard</strong> in {target.targetCountry} ({target.targetField})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500">Achieved Points</div>
                      <div className="text-base font-bold text-stone-900 font-mono">{pathData.aspirantScores.totalPoints || 0} pts sum</div>
                      <div className="text-[10px] text-stone-400">{pathData.aspirantScores.compositeScore} avg</div>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-emerald-950">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-700">{target.targetRankTier} Benchmark</div>
                      <div className="text-base font-bold text-emerald-900 font-mono">{pathData.cohortBenchmarks.totalPoints || 0} pts sum</div>
                      <div className="text-[10px] text-emerald-700">{pathData.cohortBenchmarks.compositeScore} avg</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exact Harmonized Gaps Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-stone-800" />
                    Strict 6-Dimensional Breakdown & Point Harmonization
                  </h4>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Net Deficit: -{Math.max(0, (pathData.cohortBenchmarks.totalPoints || 0) - (pathData.aspirantScores.totalPoints || 0))} pts
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-50 border-b border-stone-200 text-[10px] font-mono uppercase text-stone-500">
                      <tr>
                        <th className="p-3">Competency Dimension</th>
                        <th className="p-3 text-center">Student Achieved</th>
                        <th className="p-3 text-center">{target.targetRankTier} Benchmark</th>
                        <th className="p-3 text-center">Required Deficit Gap</th>
                        <th className="p-3">Admissions Rationale ({target.targetCountry})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-mono">
                      {[
                        { label: 'Problem Solving', current: pathData.aspirantScores.problemSolving, target: pathData.cohortBenchmarks.problemSolving, gap: problemSolvingGap, note: 'Tested through math/science competitions and entrance assessments.' },
                        { label: 'Technical Skills', current: pathData.aspirantScores.technicalSkills, target: pathData.cohortBenchmarks.technicalSkills, gap: technicalSkillsGap, note: 'Evaluated via production code, CAD modeling, or wet-lab experimental protocols.' },
                        { label: 'Critical Thinking', current: pathData.aspirantScores.criticalThinking, target: pathData.cohortBenchmarks.criticalThinking, gap: criticalThinkingGap, note: 'Scholarly literature review, EPQ formulation, and theoretical essay defenses.' },
                        { label: 'Team Work', current: pathData.aspirantScores.teamWork, target: pathData.cohortBenchmarks.teamWork, gap: teamWorkGap, note: 'Collaborative robotics, hackathon teams, and clinical shadowing rotations.' },
                        { label: 'Communication', current: pathData.aspirantScores.communication, target: pathData.cohortBenchmarks.communication, gap: communicationGap, note: 'Debate distinctions, published abstracts, and tutorial interview defense.' },
                        { label: 'Creativity', current: pathData.aspirantScores.creativity, target: pathData.cohortBenchmarks.creativity, gap: creativityGap, note: 'Original maker artifacts, deployed ventures, or open-source solutions.' },
                      ].map((dim) => (
                        <tr key={dim.label} className="hover:bg-stone-50/50">
                          <td className="p-3 font-semibold text-stone-900 font-sans">{dim.label}</td>
                          <td className="p-3 text-center font-bold text-stone-900">{dim.current} pts</td>
                          <td className="p-3 text-center font-bold text-emerald-800">{dim.target} pts</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              dim.gap > 0 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                            }`}>
                              {dim.gap > 0 ? `-${dim.gap} pts` : '✓ Satisfied'}
                            </span>
                          </td>
                          <td className="p-3 text-[11px] font-sans text-stone-600">{dim.note}</td>
                        </tr>
                      ))}
                      <tr className="bg-stone-50/80 font-bold border-t border-stone-200">
                        <td className="p-3 font-sans text-stone-900">Total Harmonized Points</td>
                        <td className="p-3 text-center text-stone-900">{pathData.aspirantScores.totalPoints || 0} pts sum</td>
                        <td className="p-3 text-center text-emerald-900">{pathData.cohortBenchmarks.totalPoints || 0} pts sum</td>
                        <td className="p-3 text-center text-amber-900">
                          -{Math.max(0, (pathData.cohortBenchmarks.totalPoints || 0) - (pathData.aspirantScores.totalPoints || 0))} pts net
                        </td>
                        <td className="p-3 font-sans text-[11px] text-stone-500">Trajectory Line Chart directly mirrors this aggregate sum</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tactical Next Steps */}
              <div className="p-5 rounded-2xl bg-stone-900 text-white space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  Tactical Gap Closing Mandate
                </div>
                <div className="space-y-2 text-xs text-stone-300 leading-relaxed">
                  <p>
                    • <strong>Primary Focus:</strong> Close the <strong>{pathData.primaryGaps[0]?.area || 'Technical Spike'}</strong> deficit by prioritizing 6–8 hours/week on verifiable external artifacts.
                  </p>
                  <p>
                    • <strong>Country Adaptation ({target.targetCountry}):</strong> Align submissions with {target.targetCountry === 'United Kingdom' ? 'pure academic reading and UKMT/BPhO competitions' : target.targetCountry === 'Canada' ? 'Waterloo CEMC contest rankings and GitHub repos' : 'an unmissable angular spike with verified community impact'}.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 print:space-y-4">
              {/* Report Header Card */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
                    Confidential Admissions Assessment · {target.targetCountry}
                  </span>
                  <span className="text-xs text-stone-600 font-mono">{currentDate}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-stone-900">
                      {target.studentName}
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Targeting: <strong className="text-stone-900">{target.targetUniversity || `${target.targetRankTier} Universities`}</strong> in {target.targetCountry}
                    </p>
                    <p className="text-xs text-stone-600">
                      Intended Program: <span className="font-semibold text-stone-800">{target.targetField}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="p-3 bg-white rounded-xl border border-stone-200 text-center">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500">Current Readiness</div>
                      <div className="text-lg font-bold text-stone-900 font-mono">{pathData.readinessScore} / 100</div>
                    </div>
                    <div className="p-3 bg-stone-900 text-white rounded-xl text-center">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Projected Exit</div>
                      <div className="text-lg font-bold text-amber-400 font-mono">{pathData.projectedReadinessScore} / 100</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trajectory Diagnosis Message */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 leading-relaxed">
                <div className="font-semibold flex items-center gap-1.5 mb-1 text-amber-900">
                  <TrendingUp className="w-4 h-4 text-amber-700" />
                  Strategic Trajectory Analysis ({target.targetCountry} Context)
                </div>
                {trajectoryMessage}
              </div>

              {/* 6-Aspect Score Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-stone-800" />
                    6-Dimensional Competency Gap vs {target.targetRankTier} Benchmark
                  </h4>
                  <span className="text-[11px] font-mono text-stone-500">
                    Harmonized Sum: {pathData.aspirantScores.totalPoints || 0} vs {pathData.cohortBenchmarks.totalPoints || 0} pts
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {[
                    { label: 'Problem Solving', current: pathData.aspirantScores.problemSolving, target: pathData.cohortBenchmarks.problemSolving, gap: problemSolvingGap },
                    { label: 'Technical Skills', current: pathData.aspirantScores.technicalSkills, target: pathData.cohortBenchmarks.technicalSkills, gap: technicalSkillsGap },
                    { label: 'Critical Thinking', current: pathData.aspirantScores.criticalThinking, target: pathData.cohortBenchmarks.criticalThinking, gap: criticalThinkingGap },
                    { label: 'Team Work', current: pathData.aspirantScores.teamWork, target: pathData.cohortBenchmarks.teamWork, gap: teamWorkGap },
                    { label: 'Communication', current: pathData.aspirantScores.communication, target: pathData.cohortBenchmarks.communication, gap: communicationGap },
                    { label: 'Creativity', current: pathData.aspirantScores.creativity, target: pathData.cohortBenchmarks.creativity, gap: creativityGap },
                  ].map((dim) => (
                    <div key={dim.label} className="p-3 bg-white rounded-lg border border-stone-200 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-stone-900">{dim.label}</div>
                        <div className="text-[11px] font-mono text-stone-500">
                          Current: {dim.current} · Target: {dim.target}
                        </div>
                      </div>
                      <div className={`text-xs font-mono font-bold ${dim.gap > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {dim.gap > 0 ? `-${dim.gap} pts` : 'Satisfied'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Completed Milestones in Profile */}
              {detectedActivities.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Documented Evidence & Verified Completed Activities ({detectedActivities.length})
                    </h4>
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Directly Linked to Scores
                    </span>
                  </div>

                  <div className="space-y-2">
                    {detectedActivities.map((act) => (
                      <div key={act.milestoneId} className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-stone-900 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                            {act.title}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            +{act.pointsBoost} pts ({act.dimension})
                          </span>
                        </div>
                        <p className="text-stone-600 text-[11px] italic bg-white p-2 rounded border border-emerald-100">
                          "{act.evidenceSnippet}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scaled Roadmap Sequence */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-stone-800" />
                    Back-Engineered Supercurricular Action Sequence ({totalMilestonesCount} Milestones)
                  </h4>
                  <span className="text-[11px] font-mono text-stone-500">
                    Tier {target.targetRankTier} · {target.targetCountry}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {pathData.milestones.slice(0, 10).map((m, idx) => (
                    <div key={m.id || idx} className="p-3.5 bg-white rounded-xl border border-stone-200 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-md bg-stone-100 text-stone-700 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-stone-900">{m.title}</span>
                          <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                            {m.grade} ({m.quarter})
                          </span>
                        </div>
                        <p className="text-stone-600 text-[11px] leading-relaxed">{m.description}</p>
                        <div className="text-[10px] font-mono text-stone-500 flex items-center gap-2 pt-1">
                          <span>Commitment: {m.timeCommitment}</span>
                          <span>·</span>
                          <span className="text-amber-800">{m.impactTier}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pathData.milestones.length > 10 && (
                    <div className="text-center text-xs text-stone-500 py-2">
                      + {pathData.milestones.length - 10} additional tactical milestones detailed in full roadmap.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
