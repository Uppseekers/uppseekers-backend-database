import React, { useState } from 'react';
import {
  Scale,
  Zap,
  Users,
  Award,
  BookOpen,
  FlaskConical,
  Briefcase,
  Code,
  GraduationCap,
  Plus,
  Trash2,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { SpiderChart } from '../SpiderChart';
import { evaluateStudent } from '../../utils/studentEvaluation';
import { BlurredName } from '../BlurredName';

interface CompareLabViewProps {
  allStudents: StudentProfile[];
  comparedStudents: StudentProfile[];
  onAddStudent: (student: StudentProfile) => void;
  onRemoveStudent: (id: string) => void;
  onClearAll: () => void;
  onSelectStudentForDetail: (student: StudentProfile) => void;
}

export const CompareLabView: React.FC<CompareLabViewProps> = ({
  allStudents,
  comparedStudents,
  onAddStudent,
  onRemoveStudent,
  onClearAll,
  onSelectStudentForDetail,
}) => {
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState<string>('');

  const handleAdd = () => {
    if (!selectedStudentToAdd) return;
    const found = allStudents.find((s) => s.id === selectedStudentToAdd);
    if (found) {
      onAddStudent(found);
      setSelectedStudentToAdd('');
    }
  };

  // Evaluate candidate metrics
  const evaluations = comparedStudents.map((s) => ({
    student: s,
    evaluation: evaluateStudent(s),
  }));

  // Quick preset comparisons
  const handleLoadSampleComparison = () => {
    onClearAll();
    const s1 = allStudents[0];
    const s2 = allStudents[1] || allStudents[0];
    const s3 = allStudents[2] || allStudents[0];
    if (s1) onAddStudent(s1);
    if (s2 && s2.id !== s1.id) onAddStudent(s2);
    if (s3 && s3.id !== s1.id && s3.id !== s2.id) onAddStudent(s3);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <Scale className="w-3.5 h-3.5 text-amber-600" />
                Admissions Benchmarking Lab
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Side-by-Side Dimensional Evaluation
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Candidate Comparison & MLS Radar Overlay
            </h1>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Align up to 3 candidate profiles side-by-side. Inspect overlaid 6-aspect competency polygons, identify primary spikes, and review evidence-based admissions readiness.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleLoadSampleComparison}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Top 3 Profiles</span>
            </button>
            {comparedStudents.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Compare</span>
              </button>
            )}
          </div>
        </div>

        {/* Candidate Selector Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Select Profiles ({comparedStudents.length}/3 selected):
          </div>

          <div className="flex-1 min-w-[240px] max-w-md">
            <select
              value={selectedStudentToAdd}
              onChange={(e) => setSelectedStudentToAdd(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              <option value="">-- Choose student profile to add --</option>
              {allStudents.map((s) => (
                <option key={s.id} value={s.id} disabled={comparedStudents.some((c) => c.id === s.id)}>
                  {s.name} ({s.university})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            disabled={!selectedStudentToAdd || comparedStudents.length >= 3}
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {comparedStudents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Scale className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No candidates selected for comparison</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Select up to 3 profiles using the dropdown above or click "Compare" on any candidate card in the Student Database.
          </p>
          <button
            type="button"
            onClick={handleLoadSampleComparison}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs cursor-pointer"
          >
            Compare Sample Profiles
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Section: Radar Chart Overlay & Pillar Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Overlaid Radar Chart Card (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Overlaid MLS Radar Chart
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    6 Aspects
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Polygon overlays representing relative strengths across Problem Solving, Technical Skills, Critical Thinking, Teamwork, Communication, and Creativity.
                </p>

                <div className="flex items-center justify-center py-2">
                  <SpiderChart students={comparedStudents} size={320} />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 text-center">
                Scores normalized on 0–100 rubric calibrated against competitive admissions cohorts.
              </div>
            </div>

            {/* Candidate Pillar Summary Cards (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {evaluations.map(({ student, evaluation }, idx) => {
                const borderColors = [
                  'border-indigo-300 ring-2 ring-indigo-50',
                  'border-emerald-300 ring-2 ring-emerald-50',
                  'border-amber-300 ring-2 ring-amber-50',
                ];
                const badgeColors = [
                  'bg-indigo-600 text-white',
                  'bg-emerald-600 text-white',
                  'bg-amber-600 text-white',
                ];

                return (
                  <div
                    key={student.id}
                    className={`bg-white rounded-2xl p-4 border flex flex-col justify-between shadow-2xs ${borderColors[idx] || 'border-slate-200'}`}
                  >
                    <div>
                      {/* Candidate Header */}
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${badgeColors[idx]}`}>
                          Candidate #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveStudent(student.id)}
                          className="text-slate-400 hover:text-rose-600 text-xs p-1 cursor-pointer"
                          title="Remove from comparison"
                        >
                          ✕
                        </button>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm truncate">
                        <BlurredName fullName={student.name} />
                      </h4>
                      <div className="text-[11px] text-slate-500 truncate mb-3">
                        {student.university}
                      </div>

                      {/* Composite Score & Tier */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center mb-3">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                          Composite Rating
                        </div>
                        <div className="text-2xl font-black text-slate-900">
                          {evaluation.compositeScore}
                          <span className="text-xs text-slate-400 font-normal"> / 100</span>
                        </div>
                        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {evaluation.tier}
                        </span>
                      </div>

                      {/* Spikes */}
                      <div className="space-y-1 text-[11px] mb-3">
                        <div className="text-slate-600">
                          <strong className="text-slate-800">Primary:</strong> {evaluation.primarySpike.label} ({evaluation.primarySpike.score})
                        </div>
                        <div className="text-slate-600">
                          <strong className="text-slate-800">Secondary:</strong> {evaluation.secondarySpike.label} ({evaluation.secondarySpike.score})
                        </div>
                      </div>

                      {/* Mini Bars for 6 Dimensions */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        {evaluation.dimensions.map((dim) => (
                          <div key={dim.key} className="text-[10px]">
                            <div className="flex justify-between text-slate-600 mb-0.5">
                              <span className="truncate">{dim.label.split('&')[0]?.trim()}</span>
                              <span className="font-bold text-slate-900">{dim.score}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full bg-indigo-600 rounded-full"
                                style={{ width: `${dim.score}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectStudentForDetail(student)}
                      className="mt-4 w-full py-1.5 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                    >
                      View Full Dossier
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deep Side-by-Side Comparison Matrix */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              Comprehensive Attribute Matrix
            </h3>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="p-3.5 font-bold text-slate-700 w-1/4">Evaluation Category</th>
                    {comparedStudents.map((s, i) => (
                      <th key={s.id} className="p-3.5 font-bold text-slate-900 w-1/4">
                        <div className="text-[11px] text-indigo-600 font-semibold">Candidate #{i + 1}</div>
                        <BlurredName fullName={s.name} />
                        <div className="text-[11px] text-slate-500 font-normal">{s.university}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Row: Academics */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-800 bg-slate-50/50 align-top">
                      <div className="flex items-center gap-1.5 text-indigo-700">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Academics & GPA</span>
                      </div>
                    </td>
                    {comparedStudents.map((s) => (
                      <td key={s.id} className="p-3.5 text-slate-700 align-top leading-relaxed">
                        <div className="font-semibold text-slate-900">{s.academicsPerformance || 'Not specified'}</div>
                        {s.apTaken && <div className="text-[11px] text-slate-500 mt-1">APs: {s.apTaken}</div>}
                        {s.actSat && <div className="text-[11px] text-indigo-600 font-medium">{s.actSat}</div>}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Research */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-800 bg-slate-50/50 align-top">
                      <div className="flex items-center gap-1.5 text-purple-700">
                        <FlaskConical className="w-3.5 h-3.5" />
                        <span>Research & Inquiries</span>
                      </div>
                    </td>
                    {comparedStudents.map((s) => (
                      <td key={s.id} className="p-3.5 text-slate-700 align-top leading-relaxed">
                        {s.research || <span className="text-slate-400 italic">No formal research recorded</span>}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Internships */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-800 bg-slate-50/50 align-top">
                      <div className="flex items-center gap-1.5 text-blue-700">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Work Experience & Internships</span>
                      </div>
                    </td>
                    {comparedStudents.map((s) => (
                      <td key={s.id} className="p-3.5 text-slate-700 align-top leading-relaxed">
                        {s.internshipWork || <span className="text-slate-400 italic">No internships recorded</span>}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Competitions */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-800 bg-slate-50/50 align-top">
                      <div className="flex items-center gap-1.5 text-amber-700">
                        <Award className="w-3.5 h-3.5" />
                        <span>Competitions & Honors</span>
                      </div>
                    </td>
                    {comparedStudents.map((s) => (
                      <td key={s.id} className="p-3.5 text-slate-700 align-top leading-relaxed">
                        {s.competitionsAwards || <span className="text-slate-400 italic">No honors listed</span>}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Projects */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-800 bg-slate-50/50 align-top">
                      <div className="flex items-center gap-1.5 text-emerald-700">
                        <Code className="w-3.5 h-3.5" />
                        <span>Flagship Projects & Tech</span>
                      </div>
                    </td>
                    {comparedStudents.map((s) => (
                      <td key={s.id} className="p-3.5 text-slate-700 align-top leading-relaxed">
                        {s.projects || <span className="text-slate-400 italic">No projects recorded</span>}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Extracurriculars & Leadership */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-800 bg-slate-50/50 align-top">
                      <div className="flex items-center gap-1.5 text-rose-700">
                        <Users className="w-3.5 h-3.5" />
                        <span>Leadership & Activities</span>
                      </div>
                    </td>
                    {comparedStudents.map((s) => (
                      <td key={s.id} className="p-3.5 text-slate-700 align-top leading-relaxed">
                        {s.otherActivities || <span className="text-slate-400 italic">None specified</span>}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
