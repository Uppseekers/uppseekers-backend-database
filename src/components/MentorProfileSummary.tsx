import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Compass,
  Layers,
  Award,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Target,
  BookOpen,
  HelpCircle,
  BrainCircuit,
  FileQuestion,
  ChevronRight,
} from 'lucide-react';
import { StudentProfile } from '../types';
import {
  fetchMentorSummary,
  MentorSummaryResponse,
  evaluateProfileSufficiency,
} from '../utils/mentorSummaryService';

interface MentorProfileSummaryProps {
  student: StudentProfile;
}

export const MentorProfileSummary: React.FC<MentorProfileSummaryProps> = ({ student }) => {
  const [summary, setSummary] = useState<MentorSummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showRarityExplanation, setShowRarityExplanation] = useState<boolean>(false);

  // Quick synchronous check so we don't flash loading if clearly insufficient
  const sufficiency = evaluateProfileSufficiency(student);

  const loadSummary = async (force = false) => {
    if (force) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await fetchMentorSummary(student, force);
      setSummary(data);
    } catch (err) {
      console.error('Failed to load mentor summary:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSummary(false);
  }, [student.id, student.name]);

  // If loading and no previous summary
  if (loading && !summary) {
    return (
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-200/80" />
            <div className="space-y-1.5">
              <div className="h-4 w-48 bg-slate-300 rounded-sm" />
              <div className="h-3 w-64 bg-slate-200 rounded-sm" />
            </div>
          </div>
          <div className="h-6 w-28 bg-indigo-100 rounded-full" />
        </div>
        <div className="h-20 bg-slate-200/70 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="h-16 bg-slate-200/60 rounded-xl" />
          <div className="h-16 bg-slate-200/60 rounded-xl" />
        </div>
      </div>
    );
  }

  // CASE 1: Student has very little information -> Skip summary and show data is required
  if (summary && !summary.hasEnoughInfo) {
    const missing = summary.missingFields || sufficiency.missingFields;
    return (
      <div
        id="mentor-summary-skipped"
        className="rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 p-5 sm:p-6 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-200/60">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-xs shrink-0">
              <FileQuestion className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Advising Summary Withheld — Student Data Required
                </h3>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Evaluation Skipped
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Activity documentation is currently too sparse to formulate an authentic counselor evaluation.
              </p>
            </div>
          </div>

          <div className="text-xs font-semibold px-3 py-1 rounded-lg bg-white border border-amber-200 text-amber-900 shrink-0 self-start sm:self-auto">
            Action Required by Student
          </div>
        </div>

        <div className="pt-4 space-y-4">
          <p className="text-xs text-slate-700 leading-relaxed">
            {summary.reason ||
              'Our advisory team intentionally bypasses compiling strategic summaries for students who have not yet submitted sufficient portfolio records. A mentor narrative requires verified context regarding research inquiry, industry internships, or competitive achievements.'}
          </p>

          <div className="bg-white/90 rounded-xl p-4 border border-amber-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Required Information Needed from Student:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {missing.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-slate-700 bg-amber-50/50 p-2 rounded-lg border border-amber-200/50"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="font-medium text-slate-800">{item}</span>
                  <span className="text-[10px] text-amber-800 ml-auto font-medium">Pending Entry</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CASE 2: Student has rich information -> Render Full Counselor Evaluation
  if (!summary) return null;

  return (
    <div
      id="mentor-profile-dossier"
      className="rounded-2xl border border-indigo-200/90 bg-gradient-to-br from-indigo-50/60 via-white to-slate-50/80 p-5 sm:p-7 shadow-xs space-y-6"
    >
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-indigo-100">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-xs shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Advisory Counselor Narrative & Activity Evaluation
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => loadSummary(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-2xs disabled:opacity-50"
            title="Re-evaluate candidate portfolio"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-indigo-600' : ''}`} />
            <span>{refreshing ? 'Analyzing...' : 'Re-Evaluate'}</span>
          </button>
        </div>
      </div>

      {/* 1. Human Counselor Narrative */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-900">
          <Compass className="w-4 h-4 text-indigo-600" />
          <span>Counselor Mentorship Summary</span>
        </div>
        <div className="relative bg-white rounded-xl p-5 border border-indigo-100/90 shadow-2xs">
          <div className="absolute top-3 left-0 w-1 h-12 bg-indigo-600 rounded-r-full" />
          <div className="space-y-3 text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
            {summary.counselorVoiceSummary}
          </div>
        </div>
      </div>

      {/* 2. Breadth (Width) and Depth of Knowledge Analysis */}
      {summary.knowledgeAssessment && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              <span>Intellectual Scope: Width vs. Depth of Knowledge</span>
            </div>
            {summary.knowledgeAssessment.technicalLevel && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                {summary.knowledgeAssessment.technicalLevel}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Width of Knowledge */}
            <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <div className="p-1 rounded-md bg-sky-100 text-sky-800">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span>Width of Knowledge (Cross-Disciplinary Breadth)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {summary.knowledgeAssessment.breadthAnalysis}
              </p>
            </div>

            {/* Depth of Knowledge */}
            <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <div className="p-1 rounded-md bg-purple-100 text-purple-800">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span>Depth of Knowledge (Technical Rigor & Stamina)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {summary.knowledgeAssessment.depthAnalysis}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Activity Benchmarking, % of Students, & "Why Was That Suggested" */}
      {summary.activityBenchmarking && summary.activityBenchmarking.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
              <Target className="w-4 h-4 text-amber-600" />
              <span>Activity Rarity Benchmarks & Strategic Advisory Rationale</span>
            </div>
            <button
              type="button"
              onClick={() => setShowRarityExplanation(!showRarityExplanation)}
              className="inline-flex items-center text-[11px] text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <HelpCircle className="w-3 h-3 mr-1" />
              <span>What is this benchmark?</span>
            </button>
          </div>

          {showRarityExplanation && (
            <div className="bg-slate-100 rounded-xl p-3.5 text-xs text-slate-600 border border-slate-200 animate-in fade-in duration-150">
              <p className="leading-relaxed">
                <strong>Rarity Benchmarking:</strong> Reflects the percentage of competitive national/international applicants who achieve or pursue this tier of activity.
                <br />
                <strong>Why Was That Suggested:</strong> Represents the strategic rationale our advisory team recommended to the student early in high school to differentiate their narrative for top-tier admissions committees.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {summary.activityBenchmarking.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs space-y-3 hover:border-indigo-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {item.activityName}
                      </h4>
                      {item.category && (
                        <span className="text-[11px] text-slate-500 font-medium">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* % of students rarity badge */}
                  <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 shrink-0 self-start sm:self-auto">
                    <Award className="w-3 h-3 mr-1 text-amber-600" />
                    {item.rarityPercent}
                  </span>
                </div>

                {/* Why Was That Suggested */}
                <div className="bg-indigo-50/40 rounded-lg p-3 border border-indigo-100/70 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                    <Compass className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Why This Activity Was Recommended Early On:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed pl-5">
                    {item.whySuggested}
                  </p>
                </div>

                {item.knowledgeContribution && (
                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5 pl-1">
                    <ChevronRight className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span><strong>Knowledge Impact:</strong> {item.knowledgeContribution}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Strategic Admissions Verdict */}
      {summary.strategicAdmissionsVerdict && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-xs flex items-start gap-3">
          <div className="p-2 rounded-lg bg-white/10 text-white shrink-0 mt-0.5">
            <BookOpen className="w-4 h-4 text-indigo-300" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              Admissions Committee Standing & Synthesis
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              {summary.strategicAdmissionsVerdict}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
