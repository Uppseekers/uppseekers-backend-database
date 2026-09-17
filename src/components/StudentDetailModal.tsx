import React, { useEffect } from 'react';
import { StudentProfile } from '../types';
import { BlurredName } from './BlurredName';
import { cleanText, parseBulletItems, isFieldMissing, NOT_ADDED_TEXT } from '../utils/textCleaner';
import { calculateProfileCompleteness, isStandoutItem, StandoutHighlight } from '../utils/workAnalyzer';
import { MentorProfileSummary } from './MentorProfileSummary';
import { DetailFieldDisplay } from './DetailFieldDisplay';
import {
  X,
  Building2,
  GraduationCap,
  Sparkles,
  BookOpen,
  Briefcase,
  Microscope,
  Award,
  Sun,
  FileCheck,
  FolderGit2,
  Activity,
  FileText,
  Linkedin,
  ShieldCheck,
  CheckCircle2,
  Star,
  Flame,
  Globe,
  Edit3,
} from 'lucide-react';

interface StudentDetailModalProps {
  student: StudentProfile | null;
  onClose: () => void;
  onEdit?: (student: StudentProfile) => void;
  isAdmin?: boolean;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onEdit,
  isAdmin,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!student) return null;

  const completeness = calculateProfileCompleteness(student);
  const internList = parseBulletItems(student.internshipWork);
  const researchList = parseBulletItems(student.research);
  const summerList = parseBulletItems(student.summerPrograms);
  const certList = parseBulletItems(student.certificationsMoocs);
  const awardList = parseBulletItems(student.competitionsAwards);
  const projectList = parseBulletItems(student.projects);
  const activityList = parseBulletItems(student.otherActivities);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border-b border-indigo-900/60">
          <div className="absolute top-5 right-5 flex items-center gap-2">
            {isAdmin && onEdit && (
              <button
                type="button"
                onClick={() => onEdit(student)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 rounded-xl transition-all cursor-pointer shadow-xs"
                title="Edit this student profile (Admin)"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}

            <button
              type="button"
              id="close-modal-btn"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
              Class of {student.classOf || NOT_ADDED_TEXT}
            </span>

            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              {completeness.detailTier} Completeness ({completeness.workCount} records)
            </span>

            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Last Name Masked
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 flex items-center">
            <BlurredName
              fullName={student.name}
              className="text-white font-bold"
              lastNameClassName="blur-[8px] bg-white/30 text-white/20"
              showPrivacyBadge={true}
            />
          </h2>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300">
            <div className="flex items-center gap-1.5 font-medium text-white">
              <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{student.university || NOT_ADDED_TEXT}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-sky-400 shrink-0" />
              {isFieldMissing(student.course) ? (
                <span className="italic text-slate-400 text-xs">{NOT_ADDED_TEXT}</span>
              ) : (
                <span>{cleanText(student.course)}</span>
              )}
            </div>

            {student.linkedin ? (
              <a
                href={student.linkedin.startsWith('http') ? student.linkedin : `https://${student.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sky-300 hover:text-sky-200 underline text-xs"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn Profile</span>
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-slate-400 text-xs italic">
                <Linkedin className="w-3.5 h-3.5 text-slate-500" />
                <span>LinkedIn: {NOT_ADDED_TEXT}</span>
              </span>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* MENTOR COUNSELOR SUMMARY & EVALUATION (In the beginning, only in the dossier) */}
          <MentorProfileSummary student={student} />

          {/* STANDOUT GOOD WORK HIGHLIGHTS BANNER */}
          {completeness.standouts.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-indigo-50/60 rounded-2xl p-5 border border-amber-200/90 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500 text-white shadow-xs">
                    <Star className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>Featured & Standout Work Highlights</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900 font-semibold">
                        {completeness.standouts.length} Key Highlights Detected
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600">
                      Curated top achievements, recognized research, publications, and elite milestones.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {completeness.standouts.map((highlight: StandoutHighlight) => (
                  <div
                    key={highlight.id}
                    className="bg-white/95 rounded-xl p-3.5 border border-amber-200/80 shadow-2xs hover:border-amber-400 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          <Flame className="w-3 h-3 text-amber-600" />
                          {highlight.badge}
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-slate-400">
                          {highlight.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mb-1 leading-snug">
                        {highlight.title}
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-normal">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 1: Academics, Standardized Tests & Language */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Academics & Testing
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Academics Performance / Marks */}
              <div className={`p-3.5 rounded-xl border shadow-2xs ${
                !isFieldMissing(student.academicsPerformance) && isStandoutItem(student.academicsPerformance)
                  ? 'bg-amber-50/40 border-amber-300'
                  : 'bg-white border-slate-200/80'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                    Academics / Marks
                  </span>
                  {!isFieldMissing(student.academicsPerformance) && isStandoutItem(student.academicsPerformance) && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      Distinction
                    </span>
                  )}
                </div>
                <div className="text-sm font-medium text-slate-900 whitespace-pre-line">
                  <DetailFieldDisplay value={student.academicsPerformance} />
                </div>
              </div>

              {/* ACT/SAT */}
              <div className={`p-3.5 rounded-xl border shadow-2xs ${
                !isFieldMissing(student.actSat) && isStandoutItem(student.actSat)
                  ? 'bg-amber-50/40 border-amber-300'
                  : 'bg-white border-slate-200/80'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                    ACT / SAT Score
                  </span>
                  {!isFieldMissing(student.actSat) && isStandoutItem(student.actSat) && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      Top Score
                    </span>
                  )}
                </div>
                <div className="text-sm font-medium text-slate-900 whitespace-pre-line">
                  <DetailFieldDisplay value={student.actSat} mono />
                </div>
              </div>

              {/* AP Taken */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                  AP Taken
                </span>
                <div className="text-sm font-medium text-slate-900 whitespace-pre-line">
                  <DetailFieldDisplay value={student.apTaken} />
                </div>
              </div>

              {/* Language Test */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  Language Test
                </span>
                <div className="text-sm font-medium text-slate-900">
                  <DetailFieldDisplay value={student.languageTest} />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Internships & Work Experience */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Internship (With Year) / Work Experience ({internList.length})
              </h4>
              <span className="text-[11px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                Industry Work
              </span>
            </div>
            {internList.length > 0 ? (
              <div className="space-y-2">
                {internList.map((item, idx) => {
                  const standout = isStandoutItem(item);
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl flex items-start gap-3 transition-colors shadow-2xs border ${
                        standout
                          ? 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-400/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${
                        standout ? 'text-blue-600' : 'text-slate-400'
                      }`} />
                      <div className="flex-1">
                        {standout && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-blue-700 bg-blue-100/90 px-1.5 py-0.5 rounded mb-1">
                            <Star className="w-2.5 h-2.5 fill-blue-600 text-blue-600" />
                            Recognized Work
                          </span>
                        )}
                        <p className="text-sm text-slate-900 leading-relaxed font-normal">{item}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs italic text-slate-500">
                {NOT_ADDED_TEXT}
              </div>
            )}
          </div>

          {/* Section 3: Research (With Year) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <Microscope className="w-4 h-4 text-emerald-600" />
                Research & Academic Inquiries ({researchList.length})
              </h4>
              <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Laboratory & Academic
              </span>
            </div>
            {researchList.length > 0 ? (
              <div className="space-y-2">
                {researchList.map((item, idx) => {
                  const standout = isStandoutItem(item);
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl flex items-start gap-3 shadow-2xs border ${
                        standout
                          ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-400/30'
                          : 'bg-emerald-50/30 border-emerald-200/70'
                      }`}
                    >
                      <Microscope className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        {standout && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-800 bg-emerald-200/90 px-1.5 py-0.5 rounded mb-1">
                            <Star className="w-2.5 h-2.5 fill-emerald-700 text-emerald-700" />
                            Standout Research / Publication
                          </span>
                        )}
                        <p className="text-sm text-slate-900 leading-relaxed font-normal">{item}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs italic text-slate-500">
                {NOT_ADDED_TEXT}
              </div>
            )}
          </div>

          {/* Section 4: Competitions and Awards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                Competitions, Honors & Awards ({awardList.length})
              </h4>
              <span className="text-[11px] text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Merit & Contests
              </span>
            </div>
            {awardList.length > 0 ? (
              <div className="space-y-2">
                {awardList.map((item, idx) => {
                  const standout = isStandoutItem(item);
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl flex items-start gap-3 shadow-2xs border ${
                        standout
                          ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-400/30'
                          : 'bg-amber-50/30 border-amber-200/70'
                      }`}
                    >
                      <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        {standout && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-amber-900 bg-amber-200/90 px-1.5 py-0.5 rounded mb-1">
                            <Star className="w-2.5 h-2.5 fill-amber-700 text-amber-700" />
                            National / Prestigious Honor
                          </span>
                        )}
                        <p className="text-sm text-slate-900 leading-relaxed font-normal">{item}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs italic text-slate-500">
                {NOT_ADDED_TEXT}
              </div>
            )}
          </div>

          {/* Section 5: Projects */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-purple-600" />
                Technical Projects & Engineering Initiatives ({projectList.length})
              </h4>
              <span className="text-[11px] text-purple-700 font-medium bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                Builds & Code
              </span>
            </div>
            {projectList.length > 0 ? (
              <div className="space-y-2">
                {projectList.map((item, idx) => {
                  const standout = isStandoutItem(item);
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl flex items-start gap-3 shadow-2xs border ${
                        standout
                          ? 'bg-purple-50/60 border-purple-300 ring-1 ring-purple-400/30'
                          : 'bg-purple-50/30 border-purple-200/60'
                      }`}
                    >
                      <FolderGit2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        {standout && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-purple-900 bg-purple-200/90 px-1.5 py-0.5 rounded mb-1">
                            <Star className="w-2.5 h-2.5 fill-purple-700 text-purple-700" />
                            Standout Project
                          </span>
                        )}
                        <p className="text-sm text-slate-900 leading-relaxed font-normal">{item}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs italic text-slate-500">
                {NOT_ADDED_TEXT}
              </div>
            )}
          </div>

          {/* Section 6: Summer Programs & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Sun className="w-4 h-4 text-orange-500" />
                Summer Programs ({summerList.length})
              </h4>
              {summerList.length > 0 ? (
                <div className="space-y-2">
                  {summerList.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 shadow-2xs"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs italic text-slate-500">
                  {NOT_ADDED_TEXT}
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-teal-600" />
                Certificates and MOOCs ({certList.length})
              </h4>
              {certList.length > 0 ? (
                <div className="space-y-2">
                  {certList.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 shadow-2xs"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs italic text-slate-500">
                  {NOT_ADDED_TEXT}
                </div>
              )}
            </div>
          </div>

          {/* Section 7: Other Activities & Leadership */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              Other Activities & Extracurriculars ({activityList.length})
            </h4>
            {activityList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activityList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 flex items-start gap-2"
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs italic text-slate-500">
                {NOT_ADDED_TEXT}
              </div>
            )}
          </div>

          {/* Section 8: Notes */}
          <div className="bg-amber-50/40 rounded-2xl p-4 border border-amber-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-700" />
              Additional Notes
            </h4>
            {!isFieldMissing(student.notes) ? (
              <p className="text-sm text-amber-950 whitespace-pre-line leading-relaxed">
                {cleanText(student.notes)}
              </p>
            ) : (
              <p className="text-xs italic text-slate-400">
                {NOT_ADDED_TEXT}
              </p>
            )}
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between mt-auto">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Student privacy enforced. Last name permanently anonymized.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
