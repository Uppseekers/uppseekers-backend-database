import React, { useState, useMemo } from 'react';
import {
  Users,
  Award,
  BookOpen,
  FlaskConical,
  Code,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  AdmittedStudentProfile,
  AspiringStudentBaseline,
  AspiringStudentTarget,
  RankTier,
  StudentProfile,
} from '../../types';

interface LookalikeAdmittedStudentsProps {
  cohort: AdmittedStudentProfile[];
  target: AspiringStudentTarget;
  baseline: AspiringStudentBaseline;
  onInspectStudent?: (student: StudentProfile) => void;
}

export const LookalikeAdmittedStudents: React.FC<LookalikeAdmittedStudentsProps> = ({
  cohort,
  target,
  baseline,
  onInspectStudent,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Filter and rank look-alike admitted students
  const lookalikes = useMemo(() => {
    if (!cohort || cohort.length === 0) return [];

    // Filter by tier and target field affinity
    const tierMatches = cohort.filter((s) => {
      const matchTier =
        target.targetRankTier === 'Top 100'
          ? true
          : target.targetRankTier === 'Top 50'
          ? s.universityRank <= 50
          : target.targetRankTier === 'Top 25'
          ? s.universityRank <= 25
          : target.targetRankTier === 'Top 10'
          ? s.universityRank <= 10
          : s.universityRank <= 5;

      const matchCountry =
        target.targetCountry === 'All Global' ||
        s.country.toLowerCase().includes(target.targetCountry.toLowerCase()) ||
        (target.targetCountry === 'United States' && s.country === 'United States') ||
        (target.targetCountry === 'United Kingdom' && s.country === 'United Kingdom');

      return matchTier && matchCountry;
    });

    const pool = tierMatches.length >= 3 ? tierMatches : cohort;

    // Score similarity based on field and non-academic spike
    const targetKeywords = `${target.targetField} ${baseline.technicalProjects} ${baseline.researchExperience} ${baseline.competitionsHonors}`.toLowerCase();

    const scored = pool.map((student) => {
      let score = 50;

      // Field match
      if (student.fieldCategory.toLowerCase() === target.targetField.toLowerCase()) {
        score += 30;
      }

      // Keyword overlap
      const studentKeywords = `${student.course} ${student.keySpike} ${student.research} ${student.projects} ${student.competitionsAwards}`.toLowerCase();
      if (targetKeywords.includes('cs') && studentKeywords.includes('cs')) score += 15;
      if (targetKeywords.includes('bio') && studentKeywords.includes('bio')) score += 15;
      if (targetKeywords.includes('engineering') && studentKeywords.includes('engineering')) score += 15;
      if (targetKeywords.includes('quant') && studentKeywords.includes('quant')) score += 15;
      if (targetKeywords.includes('math') && studentKeywords.includes('math')) score += 10;
      if (targetKeywords.includes('robot') && studentKeywords.includes('robot')) score += 10;

      // Target university match bonus
      if (target.targetUniversity && student.university.toLowerCase().includes(target.targetUniversity.toLowerCase())) {
        score += 20;
      }

      return { student, similarityScore: Math.min(99, score) };
    });

    scored.sort((a, b) => b.similarityScore - a.similarityScore);
    return scored.slice(0, 3);
  }, [cohort, target, baseline]);

  // Set default selected student to the first match
  const activeMatch = useMemo(() => {
    if (!lookalikes || lookalikes.length === 0) return null;
    if (selectedStudentId) {
      const found = lookalikes.find((m) => m.student.id === selectedStudentId);
      if (found) return found;
    }
    return lookalikes[0];
  }, [lookalikes, selectedStudentId]);

  if (lookalikes.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider mb-1">
            <span>Empirical Reference Blueprints</span>
            <span>·</span>
            <span>Look-Alike Admitted Undergraduates</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Admitted Student Look-Alikes & Empirical Blueprints
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
            Real undergraduate profiles from the verified dataset whose academic field, spike orientation, and admissions trajectory provide concrete, empirical blueprints for <strong className="text-stone-900">{target.studentName}</strong>.
          </p>
        </div>

        {/* Match Count Badge */}
        <div className="flex items-center gap-2 text-xs font-mono text-stone-600 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200 shrink-0 self-start lg:self-auto">
          <Users className="w-3.5 h-3.5 text-stone-500" />
          <span>Top 3 Look-Alike Profiles</span>
        </div>
      </div>

      {/* Look-Alike Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {lookalikes.map((item, idx) => {
          const isSelected = activeMatch?.student.id === item.student.id;
          return (
            <button
              key={item.student.id}
              type="button"
              onClick={() => setSelectedStudentId(item.student.id)}
              className={`p-3.5 rounded-xl text-left transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-stone-900 text-stone-100 border-stone-900 shadow-xs'
                  : 'bg-stone-50/70 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-semibold text-sm">
                  {idx + 1}. {item.student.name}
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-stone-800 text-stone-300' : 'bg-stone-200/80 text-stone-700'
                  }`}
                >
                  {item.similarityScore}% Match
                </span>
              </div>
              <div
                className={`text-xs font-serif ${
                  isSelected ? 'text-stone-300' : 'text-stone-600'
                }`}
              >
                {item.student.university}
              </div>
              <div
                className={`text-[11px] font-mono mt-1 ${
                  isSelected ? 'text-amber-400' : 'text-amber-800'
                }`}
              >
                Archetype: {item.student.profileArchetype}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Look-Alike Deep Dive Dossier */}
      {activeMatch && (
        <div className="p-5 sm:p-6 rounded-xl bg-stone-50/70 border border-stone-200 space-y-5">
          {/* Candidate Overview */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider">
                <span>{activeMatch.student.university}</span>
                <span>·</span>
                <span>#{activeMatch.student.universityRank} Global</span>
                <span>·</span>
                <span>{activeMatch.student.country}</span>
              </div>
              <h4 className="text-lg font-serif font-bold text-stone-900 mt-1">
                {activeMatch.student.name} · {activeMatch.student.course}
              </h4>
              <div className="text-xs text-stone-600 mt-0.5">
                Admission Track: <strong className="text-stone-800">{activeMatch.student.admissionType || 'Regular Decision'}</strong> · Class of {activeMatch.student.classOf}
              </div>
            </div>

            {onInspectStudent && (
              <button
                type="button"
                onClick={() => onInspectStudent(activeMatch.student)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-stone-900 text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer border border-stone-900 shadow-2xs self-start sm:self-auto"
              >
                <span>Inspect Full Dossier</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Primary Differentiating Spike */}
          <div className="p-3.5 bg-white rounded-lg border border-stone-200 text-xs space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
              Core Differentiating Spike (What Won the Admission):
            </span>
            <p className="text-stone-900 font-semibold leading-relaxed text-xs">
              "{activeMatch.student.keySpike}"
            </p>
          </div>

          {/* Verified Supercurricular Dossier (Spanning full width, eliminating inconsistent academic/testing blanks) */}
          <div className="p-4 bg-white rounded-lg border border-stone-200 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="font-semibold text-stone-900 font-serif text-sm">
                Verified Supercurricular Dossier & Portfolio Evidence
              </span>
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                Admissions Differentiators
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-stone-700 pt-1">
              {activeMatch.student.research && (
                <div className="p-3 bg-stone-50/70 rounded border border-stone-200/80 space-y-1">
                  <div className="font-mono font-semibold text-stone-900 text-[11px] flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                    <span>Research & Preprints</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    {activeMatch.student.research}
                  </p>
                </div>
              )}

              {activeMatch.student.competitionsAwards && (
                <div className="p-3 bg-stone-50/70 rounded border border-stone-200/80 space-y-1">
                  <div className="font-mono font-semibold text-stone-900 text-[11px] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                    <span>Competitions & Honors</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    {activeMatch.student.competitionsAwards}
                  </p>
                </div>
              )}

              {activeMatch.student.internshipWork && (
                <div className="p-3 bg-stone-50/70 rounded border border-stone-200/80 space-y-1">
                  <div className="font-mono font-semibold text-stone-900 text-[11px] flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                    <span>Internships & Fellowships</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    {activeMatch.student.internshipWork}
                  </p>
                </div>
              )}
            </div>

            {activeMatch.student.projects && (
              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-600">
                <strong className="text-stone-800 font-mono text-[11px]">• Signature Projects & Deployments: </strong>
                <span>{activeMatch.student.projects}</span>
              </div>
            )}
          </div>

          {/* Year-by-Year Milestone Blueprint (If Available) */}
          {activeMatch.student.gradeMilestones && (
            <div className="p-4 bg-white rounded-lg border border-stone-200 text-xs space-y-2">
              <span className="font-semibold text-stone-900 font-serif block border-b border-stone-100 pb-1">
                How {activeMatch.student.name} Built This Profile (Grade 9 → 12 Timeline)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                <div className="p-2.5 bg-stone-50 rounded border border-stone-100 space-y-1">
                  <span className="font-mono font-bold text-stone-700 text-[11px] block">
                    Grade 9 Foundation:
                  </span>
                  <p className="text-stone-600 text-[11px] leading-snug">
                    {activeMatch.student.gradeMilestones.grade9[0] || 'Established academic baseline and explored first technical interests.'}
                  </p>
                </div>

                <div className="p-2.5 bg-stone-50 rounded border border-stone-100 space-y-1">
                  <span className="font-mono font-bold text-stone-700 text-[11px] block">
                    Grade 10 First Artifact:
                  </span>
                  <p className="text-stone-600 text-[11px] leading-snug">
                    {activeMatch.student.gradeMilestones.grade10[0] || 'First competition qualification and initial university lab outreach.'}
                  </p>
                </div>

                <div className="p-2.5 bg-stone-50 rounded border border-stone-100 space-y-1">
                  <span className="font-mono font-bold text-stone-700 text-[11px] block">
                    Grade 11 The Spike:
                  </span>
                  <p className="text-stone-600 text-[11px] leading-snug">
                    {activeMatch.student.gradeMilestones.grade11[0] || 'Published primary paper draft, won state/national honors, and attended selective summer camp.'}
                  </p>
                </div>

                <div className="p-2.5 bg-stone-50 rounded border border-stone-100 space-y-1">
                  <span className="font-mono font-bold text-stone-700 text-[11px] block">
                    Grade 12 Synthesis:
                  </span>
                  <p className="text-stone-600 text-[11px] leading-snug">
                    {activeMatch.student.gradeMilestones.grade12[0] || 'SlideRoom Maker Portfolio submission and targeted Early Action execution.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actionable Blueprint Advice for Aspiring Student */}
          <div className="p-3.5 bg-white rounded-lg border border-stone-200 text-xs">
            <strong className="text-stone-900">• Actionable Blueprint for {target.studentName}: </strong>
            <span className="text-stone-700 leading-relaxed">
              To match {activeMatch.student.name}’s trajectory for {target.targetRankTier}, transition your current baseline ({baseline.technicalProjects ? 'prototype projects' : 'general coursework'}) into a singular, externally verified spike (such as an arXiv preprint or competitive qualification like AIME/USACO/USABO) by the end of 11th grade.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
