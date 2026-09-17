import React from 'react';
import {
  Building2,
  GraduationCap,
  Award,
  Briefcase,
  Microscope,
  ChevronRight,
  Linkedin,
  BookOpen,
  Star,
  Zap,
  FolderGit2,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { BlurredName } from './BlurredName';
import { cleanText, parseBulletItems, isFieldMissing, NOT_ADDED_TEXT } from '../utils/textCleaner';
import { calculateProfileCompleteness } from '../utils/workAnalyzer';

interface StudentCardProps {
  student: StudentProfile;
  onSelect: (student: StudentProfile) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onSelect }) => {
  const completeness = calculateProfileCompleteness(student);
  const internItems = parseBulletItems(student.internshipWork);
  const researchItems = parseBulletItems(student.research);
  const awardItems = parseBulletItems(student.competitionsAwards);
  const projectItems = parseBulletItems(student.projects);

  const primaryStandout = completeness.standouts[0];
  const hasAcademics = !isFieldMissing(student.academicsPerformance);
  const hasTestScore = !isFieldMissing(student.actSat);
  const hasCourse = !isFieldMissing(student.course);
  const cleanedCourse = cleanText(student.course);

  return (
    <div
      id={`student-card-${student.id}`}
      onClick={() => onSelect(student)}
      className={`group bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer relative overflow-hidden ${
        completeness.detailTier === 'Comprehensive'
          ? 'border-indigo-200 hover:border-indigo-500'
          : 'border-slate-200 hover:border-indigo-400'
      }`}
    >
      {/* Top accent bar on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header: Name, Cohort Badge, University, and Detail Tier */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="text-base sm:text-lg tracking-tight font-bold text-slate-900 truncate">
                <BlurredName fullName={student.name} />
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">{student.university || NOT_ADDED_TEXT}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <GraduationCap className="w-3 h-3 mr-1" />
              Class of {student.classOf || NOT_ADDED_TEXT}
            </span>

            {/* Profile Richness Tag */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                completeness.detailTier === 'Comprehensive'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : completeness.detailTier === 'High'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <Zap className="w-2.5 h-2.5 mr-0.5" />
              {completeness.detailTier}
            </span>
          </div>
        </div>

        {/* Course / Major */}
        <div className="mb-3 text-xs text-slate-700 font-medium flex items-center gap-1.5 truncate">
          <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {hasCourse ? (
            <span className="truncate">{cleanedCourse}</span>
          ) : (
            <span className="italic text-slate-400 text-[11px]">{NOT_ADDED_TEXT}</span>
          )}
        </div>

        {/* FEATURED STANDOUT WORK HIGHLIGHT (when detected) */}
        {primaryStandout ? (
          <div className="mb-3.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200/70 px-1.5 py-0.5 rounded">
                <Star className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />
                {primaryStandout.badge}
              </span>
              <span className="text-[10px] text-amber-700 font-semibold uppercase">
                Featured Work
              </span>
            </div>
            <p className="line-clamp-2 text-slate-800 text-[11px] leading-snug font-medium">
              {primaryStandout.description}
            </p>
          </div>
        ) : null}

        {/* Work Inventory Quick Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {internItems.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/80">
              <Briefcase className="w-3 h-3 text-blue-600" />
              {internItems.length} {internItems.length === 1 ? 'Work' : 'Work Exp'}
            </span>
          )}
          {researchItems.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <Microscope className="w-3 h-3 text-emerald-600" />
              {researchItems.length} Research
            </span>
          )}
          {awardItems.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/80">
              <Award className="w-3 h-3 text-amber-600" />
              {awardItems.length} Awards
            </span>
          )}
          {projectItems.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200/80">
              <FolderGit2 className="w-3 h-3 text-purple-600" />
              {projectItems.length} Projects
            </span>
          )}
        </div>

        {/* Detailed Work & Academic Snippets */}
        <div className="space-y-2 text-xs text-slate-600 mb-4">
          {/* Research Highlight */}
          {researchItems.length > 0 && (
            <div className="p-2 rounded-lg bg-emerald-50/40 border border-emerald-100 flex items-start gap-2">
              <Microscope className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-emerald-900 block text-[10px] uppercase">
                  Research ({researchItems.length})
                </span>
                <p className="line-clamp-2 text-slate-800 text-[11px] leading-snug">
                  {researchItems[0]}
                </p>
              </div>
            </div>
          )}

          {/* Internship Highlight */}
          {internItems.length > 0 && (
            <div className="p-2 rounded-lg bg-blue-50/40 border border-blue-100 flex items-start gap-2">
              <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-blue-900 block text-[10px] uppercase">
                  Experience ({internItems.length})
                </span>
                <p className="line-clamp-2 text-slate-800 text-[11px] leading-snug">
                  {internItems[0]}
                </p>
              </div>
            </div>
          )}

          {/* Academics & Testing snippet */}
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-slate-700 block text-[10px] uppercase">
                Academics & Testing (Marks / SAT / ACT)
              </span>
              {hasAcademics || hasTestScore ? (
                <p className="line-clamp-1 text-slate-800 font-mono text-[11px]">
                  {hasAcademics ? cleanText(student.academicsPerformance) : ''}
                  {hasAcademics && hasTestScore ? ' • ' : ''}
                  {hasTestScore ? cleanText(student.actSat) : ''}
                </p>
              ) : (
                <p className="italic text-slate-400 text-[11px]">
                  {NOT_ADDED_TEXT}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Call to Action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <div className="text-[11px] text-slate-400 font-mono">
            ID: {student.id.slice(-6)}
          </div>
          {student.linkedin && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-blue-600 font-medium">
              <Linkedin className="w-2.5 h-2.5" /> LinkedIn
            </span>
          )}
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 group-hover:translate-x-0.5 transition-all"
        >
          <span>View Dossier</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
