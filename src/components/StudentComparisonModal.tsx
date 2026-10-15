import React, { useState, useEffect } from 'react';
import { StudentProfile } from '../types';
import { BlurredName } from './BlurredName';
import { SpiderChart, STUDENT_COLORS } from './SpiderChart';
import { evaluateStudent } from '../utils/studentEvaluation';
import { cleanText, parseBulletItems, isFieldMissing, NOT_ADDED_TEXT } from '../utils/textCleaner';
import { calculateProfileCompleteness, isStandoutItem } from '../utils/workAnalyzer';
import {
  X,
  Plus,
  Scale,
  Building2,
  GraduationCap,
  BookOpen,
  Award,
  Briefcase,
  Microscope,
  FolderGit2,
  Activity,
  FileCheck,
  FileText,
  Star,
  Zap,
  Printer,
  ChevronDown,
  Search,
  Check,
  Sparkles,
  TrendingUp,
  Layers,
  Info,
} from 'lucide-react';

interface StudentComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudents: StudentProfile[];
  allStudents: StudentProfile[];
  onAddStudent: (student: StudentProfile) => void;
  onRemoveStudent: (studentId: string) => void;
  onSelectForDetail?: (student: StudentProfile) => void;
}

export const StudentComparisonModal: React.FC<StudentComparisonModalProps> = ({
  isOpen,
  onClose,
  selectedStudents,
  allStudents,
  onAddStudent,
  onRemoveStudent,
  onSelectForDetail,
}) => {
  const [activeTab, setActiveTab] = useState<'both' | 'chart' | 'matrix'>('both');
  const [hoveredStudentId, setHoveredStudentId] = useState<string | null>(null);
  const [searchPickerSlot, setSearchPickerSlot] = useState<number | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (searchPickerSlot !== null) {
          setSearchPickerSlot(null);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, searchPickerSlot, onClose]);

  if (!isOpen) return null;

  // Filter available students for search picker (exclude already selected ones)
  const availableToAdd = allStudents.filter(
    (s) => !selectedStudents.some((sel) => sel.id === s.id) &&
      (pickerSearch.trim() === '' ||
        s.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
        s.university.toLowerCase().includes(pickerSearch.toLowerCase()) ||
        s.course.toLowerCase().includes(pickerSearch.toLowerCase()))
  );

  const handlePrint = () => {
    window.print();
  };

  // Up to 3 slots
  const slots: (StudentProfile | null)[] = [
    selectedStudents[0] || null,
    selectedStudents[1] || null,
    selectedStudents[2] || null,
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden my-4 border border-slate-200 flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-5 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-500 flex items-center justify-center text-white shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Side-by-Side Candidate Evaluation
                </h2>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded-full border border-indigo-400/30">
                  {selectedStudents.length} of 3 Candidates
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Aligned comparison across academics, research, work experience, awards, and MLS Spider Chart rubrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab('both')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'both' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Combined View
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('chart')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'chart' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Spider Chart
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('matrix')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'matrix' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Data Matrix
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              title="Print or export comparison report"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Candidate Selector Slots Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {slots.map((student, slotIdx) => {
              const color = STUDENT_COLORS[slotIdx];

              if (!student) {
                return (
                  <div
                    key={`empty-slot-${slotIdx}`}
                    className="relative border-2 border-dashed border-slate-300 rounded-2xl p-3 flex flex-col items-center justify-center text-center bg-white/60 hover:bg-white hover:border-indigo-400 transition-all cursor-pointer min-h-[90px]"
                    onClick={() => {
                      setSearchPickerSlot(slotIdx);
                      setPickerSearch('');
                    }}
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      Add Candidate {slotIdx + 1}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Select from {availableToAdd.length} available profiles
                    </span>

                    {/* Inline Student Picker Dropdown */}
                    {searchPickerSlot === slotIdx && (
                      <div
                        className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 text-left animate-fadeIn max-h-72 flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative mb-2">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            value={pickerSearch}
                            onChange={(e) => setPickerSearch(e.target.value)}
                            placeholder="Search name, university, or major..."
                            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            autoFocus
                          />
                        </div>
                        <div className="overflow-y-auto space-y-1 flex-1 max-h-48">
                          {availableToAdd.slice(0, 15).map((s) => (
                            <div
                              key={s.id}
                              onClick={() => {
                                onAddStudent(s);
                                setSearchPickerSlot(null);
                              }}
                              className="px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-900 cursor-pointer text-xs flex items-center justify-between"
                            >
                              <div className="truncate">
                                <div className="font-bold text-slate-800">
                                  <BlurredName fullName={s.name} />
                                </div>
                                <div className="text-[10px] text-slate-500 truncate">
                                  {s.university} · {s.course || 'Admitted'}
                                </div>
                              </div>
                              <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                                '{s.classOf?.slice(-2)}
                              </span>
                            </div>
                          ))}
                          {availableToAdd.length === 0 && (
                            <div className="text-center text-xs text-slate-400 py-3">
                              No candidates match search
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setSearchPickerSlot(null)}
                          className="mt-2 text-center text-[11px] text-slate-500 hover:text-slate-800 font-medium py-1 border-t border-slate-100"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              const evalData = evaluateStudent(student);
              const completeness = calculateProfileCompleteness(student);

              return (
                <div
                  key={student.id}
                  onMouseEnter={() => setHoveredStudentId(student.id)}
                  onMouseLeave={() => setHoveredStudentId(null)}
                  className={`relative rounded-2xl p-3 border transition-all bg-white shadow-2xs ${
                    hoveredStudentId === student.id ? 'ring-2 ring-indigo-500/30' : ''
                  }`}
                  style={{ borderColor: color.stroke }}
                >
                  <button
                    type="button"
                    onClick={() => onRemoveStudent(student.id)}
                    title="Remove from comparison"
                    className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-400 flex items-center justify-center transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: color.stroke }}
                    />
                    <h3 className="font-bold text-sm text-slate-900 truncate pr-5">
                      <BlurredName fullName={student.name} />
                    </h3>
                  </div>

                  <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5 truncate">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{student.university}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] font-semibold text-indigo-700 shrink-0">
                      '{student.classOf?.slice(-2)}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs pt-1.5 border-t border-slate-100">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Score: <span className="font-mono font-bold">{evalData.compositeScore}</span>/100
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {evalData.evaluationTier.split(' ')[1] || 'Competitive'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Section 1: MLS Radar Spider Chart & Candidate Pillar Cards */}
          {(activeTab === 'both' || activeTab === 'chart') && (
            <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-600" />
                    MLS Competency Spider Chart
                  </h3>
                  <p className="text-xs text-slate-500">
                    Multilateral radar comparison across all 6 core MLS evaluation aspects: Problem Solving, Technical Skills, Critical Thinking, Team Work, Communication, and Creativity.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Spider Chart Graphic */}
                <div className="lg:col-span-6 flex justify-center bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                  <SpiderChart
                    students={selectedStudents}
                    highlightedStudentId={hoveredStudentId}
                    onHoverStudent={setHoveredStudentId}
                  />
                </div>

                {/* Candidate Breakdown Pillars Cards */}
                <div className="lg:col-span-6 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Candidate Profile Rubric & Key Spikes
                  </h4>

                  {selectedStudents.map((student, idx) => {
                    const color = STUDENT_COLORS[idx % STUDENT_COLORS.length];
                    const evalData = evaluateStudent(student);

                    return (
                      <div
                        key={`breakdown-${student.id}`}
                        onMouseEnter={() => setHoveredStudentId(student.id)}
                        onMouseLeave={() => setHoveredStudentId(null)}
                        className={`bg-white rounded-2xl p-4 border transition-all shadow-2xs ${
                          hoveredStudentId === student.id
                            ? 'ring-2 ring-indigo-400/30'
                            : ''
                        }`}
                        style={{ borderLeftWidth: '4px', borderLeftColor: color.stroke }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">
                              <BlurredName fullName={student.name} />
                            </span>
                            <span className="text-xs text-slate-400">·</span>
                            <span className="text-xs text-slate-600 font-medium">
                              {student.university}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700">
                              {evalData.compositeScore} pts
                            </span>
                          </div>
                        </div>

                        {/* Primary Spikes */}
                        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                              Primary Spike
                            </span>
                            <span className="font-bold text-slate-800 truncate block">
                              {evalData.primarySpike}
                            </span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                              Secondary Spike
                            </span>
                            <span className="font-bold text-slate-800 truncate block">
                              {evalData.secondarySpike}
                            </span>
                          </div>
                        </div>

                        {/* Mini Dimension Progress Bars across all 6 aspects */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 pt-1.5 border-t border-slate-100">
                          {evalData.dimensions.map((d) => (
                            <div key={d.key} className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-600 font-medium truncate max-w-[105px]">{d.label}</span>
                              <div className="flex items-center gap-1.5 w-24">
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                      width: `${d.score}%`,
                                      backgroundColor: color.stroke,
                                    }}
                                  />
                                </div>
                                <span className="font-mono text-[10px] text-slate-500 w-5 text-right font-semibold">
                                  {d.score}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Detailed Aligned Data Matrix */}
          {(activeTab === 'both' || activeTab === 'matrix') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Aligned Profile Data Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Compare verified application components line-by-line across all candidates.
                  </p>
                </div>
              </div>

              {/* Matrix Table with sticky headers */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
                <div className="divide-y divide-slate-200">
                  {/* Row 1: University & Major */}
                  <ComparisonMatrixRow
                    icon={<Building2 className="w-4 h-4 text-indigo-600" />}
                    title="Target University & Program"
                    description="Admitted institution, specific undergraduate program/major, and cohort."
                    students={selectedStudents}
                    renderContent={(student) => (
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 text-sm">
                          {student.university || NOT_ADDED_TEXT}
                        </div>
                        <div className="text-xs text-slate-600 font-medium">
                          {cleanText(student.course) || NOT_ADDED_TEXT}
                        </div>
                        <div className="text-[11px] text-indigo-700 font-semibold">
                          Class of {student.classOf || NOT_ADDED_TEXT}
                        </div>
                      </div>
                    )}
                  />

                  {/* Row: MLS 6-Aspect Competency Ratings */}
                  <ComparisonMatrixRow
                    icon={<Zap className="w-4 h-4 text-amber-500" />}
                    title="MLS Competency Ratings (Spider Chart Aspects)"
                    description="Systematic scoring (0-100) and verified evidence for Problem Solving, Technical Skills, Critical Thinking, Team Work, Communication, and Creativity."
                    students={selectedStudents}
                    renderContent={(student, idx) => {
                      const evalData = evaluateStudent(student);
                      const color = STUDENT_COLORS[idx % STUDENT_COLORS.length];
                      return (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Composite</span>
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                              {evalData.compositeScore}/100 · {evalData.evaluationTier}
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            {evalData.dimensions.map((dim) => (
                              <div key={dim.key} className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="font-bold text-slate-800 text-[11px]">{dim.label}</span>
                                  <span className="font-mono font-bold text-[11px]" style={{ color: color.stroke }}>
                                    {dim.score}/100
                                  </span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-200/70 rounded-full overflow-hidden mb-1">
                                  <div
                                    className="h-full rounded-full transition-all"
                                    style={{ width: `${dim.score}%`, backgroundColor: color.stroke }}
                                  />
                                </div>
                                <p className="text-[10.5px] text-slate-600 leading-tight">
                                  {dim.evidence}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }}
                  />

                  {/* Row 2: Academics & GPA Performance */}
                  <ComparisonMatrixRow
                    icon={<GraduationCap className="w-4 h-4 text-blue-600" />}
                    title="Academic Record & GPA"
                    description="Reported unweighted/weighted GPA, class rank, board percentages, and curriculum rigor."
                    students={selectedStudents}
                    renderContent={(student) => (
                      <div className="space-y-1 text-xs">
                        {isFieldMissing(student.academicsPerformance) ? (
                          <span className="italic text-slate-400 text-xs">{NOT_ADDED_TEXT}</span>
                        ) : (
                          <div className="font-semibold text-slate-800 whitespace-pre-line leading-relaxed">
                            {cleanText(student.academicsPerformance)}
                          </div>
                        )}
                      </div>
                    )}
                  />

                  {/* Row 3: Standardized Testing & Quantitative Aptitude */}
                  <ComparisonMatrixRow
                    icon={<FileCheck className="w-4 h-4 text-emerald-600" />}
                    title="Standardized Tests & Exams"
                    description="SAT, ACT, AP courses, AMC/AIME math olympiad scores, and language exams."
                    students={selectedStudents}
                    renderContent={(student) => {
                      const hasTests = !isFieldMissing(student.actSat);
                      const hasAps = !isFieldMissing(student.apTaken);
                      const hasLang = !isFieldMissing(student.languageTest);

                      if (!hasTests && !hasAps && !hasLang) {
                        return <span className="italic text-slate-400 text-xs">{NOT_ADDED_TEXT}</span>;
                      }

                      return (
                        <div className="space-y-2 text-xs">
                          {hasTests && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                SAT / ACT / Olympiad Scores
                              </span>
                              <span className="font-semibold text-slate-800">
                                {cleanText(student.actSat)}
                              </span>
                            </div>
                          )}
                          {hasAps && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                AP Courses
                              </span>
                              <span className="text-slate-700">{cleanText(student.apTaken)}</span>
                            </div>
                          )}
                          {hasLang && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                Language
                              </span>
                              <span className="text-slate-700">{cleanText(student.languageTest)}</span>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />

                  {/* Row 4: Research & Scholarly Inquiries */}
                  <ComparisonMatrixRow
                    icon={<Microscope className="w-4 h-4 text-purple-600" />}
                    title="Research & Laboratory Inquiries"
                    description="Independent investigations, peer-reviewed journal papers, and research institute appointments."
                    students={selectedStudents}
                    renderContent={(student) => {
                      const items = parseBulletItems(student.research);
                      if (items.length === 0) {
                        return <span className="italic text-slate-400 text-xs">{NOT_ADDED_TEXT}</span>;
                      }
                      return (
                        <ul className="space-y-2 text-xs">
                          {items.map((item, i) => {
                            const isStandout = isStandoutItem(item);
                            return (
                              <li
                                key={i}
                                className={`p-2 rounded-xl border text-xs leading-relaxed ${
                                  isStandout
                                    ? 'bg-purple-50/70 border-purple-200 text-purple-950 font-medium'
                                    : 'bg-slate-50 border-slate-200/80 text-slate-700'
                                }`}
                              >
                                {isStandout && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 uppercase mb-0.5">
                                    <Star className="w-3 h-3 fill-purple-600 text-purple-600" />
                                    Standout Research
                                  </span>
                                )}
                                <div>{item}</div>
                              </li>
                            );
                          })}
                        </ul>
                      );
                    }}
                  />

                  {/* Row 5: Professional Internships & Work Experience */}
                  <ComparisonMatrixRow
                    icon={<Briefcase className="w-4 h-4 text-amber-600" />}
                    title="Internships & Work Experience"
                    description="Corporate employment, engineering internships, and startup software development."
                    students={selectedStudents}
                    renderContent={(student) => {
                      const items = parseBulletItems(student.internshipWork);
                      if (items.length === 0) {
                        return <span className="italic text-slate-400 text-xs">{NOT_ADDED_TEXT}</span>;
                      }
                      return (
                        <ul className="space-y-2 text-xs">
                          {items.map((item, i) => (
                            <li
                              key={i}
                              className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 leading-relaxed text-xs"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      );
                    }}
                  />

                  {/* Row 6: Competitions, Olympiads & Awards */}
                  <ComparisonMatrixRow
                    icon={<Award className="w-4 h-4 text-rose-600" />}
                    title="Competitions & Distinctions"
                    description="Academic Olympiads, hackathons, national rankings, and merit scholarships."
                    students={selectedStudents}
                    renderContent={(student) => {
                      const items = parseBulletItems(student.competitionsAwards);
                      if (items.length === 0) {
                        return <span className="italic text-slate-400 text-xs">{NOT_ADDED_TEXT}</span>;
                      }
                      return (
                        <ul className="space-y-2 text-xs">
                          {items.map((item, i) => {
                            const isStandout = isStandoutItem(item);
                            return (
                              <li
                                key={i}
                                className={`p-2 rounded-xl border text-xs leading-relaxed ${
                                  isStandout
                                    ? 'bg-rose-50/70 border-rose-200 text-rose-950 font-medium'
                                    : 'bg-slate-50 border-slate-200/80 text-slate-700'
                                }`}
                              >
                                {isStandout && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 uppercase mb-0.5">
                                    <Star className="w-3 h-3 fill-rose-600 text-rose-600" />
                                    Elite Recognition
                                  </span>
                                )}
                                <div>{item}</div>
                              </li>
                            );
                          })}
                        </ul>
                      );
                    }}
                  />

                  {/* Row 7: Technical & Capstone Projects */}
                  <ComparisonMatrixRow
                    icon={<FolderGit2 className="w-4 h-4 text-emerald-600" />}
                    title="Technical & Portfolio Projects"
                    description="Autonomous robotics, full-stack software, mobile apps, and machine learning models."
                    students={selectedStudents}
                    renderContent={(student) => {
                      const items = parseBulletItems(student.projects);
                      if (items.length === 0) {
                        return <span className="italic text-slate-400 text-xs">{NOT_ADDED_TEXT}</span>;
                      }
                      return (
                        <ul className="space-y-2 text-xs">
                          {items.map((item, i) => (
                            <li
                              key={i}
                              className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 leading-relaxed text-xs"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      );
                    }}
                  />

                  {/* Row 8: Extracurricular Leadership & Impact */}
                  <ComparisonMatrixRow
                    icon={<Activity className="w-4 h-4 text-indigo-600" />}
                    title="Leadership & Extracurriculars"
                    description="Executive officer titles, sports captaincy, non-profit initiatives, and student government."
                    students={selectedStudents}
                    renderContent={(student) => {
                      const items = parseBulletItems(student.otherActivities);
                      if (items.length === 0) {
                        return <span className="italic text-slate-400 text-xs">{NOT_ADDED_TEXT}</span>;
                      }
                      return (
                        <ul className="space-y-1.5 text-xs">
                          {items.slice(0, 8).map((item, i) => (
                            <li
                              key={i}
                              className="text-xs text-slate-700 flex items-start gap-1.5"
                            >
                              <span className="text-indigo-500 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }}
                  />

                  {/* Row 9: Summer Programs & Certifications */}
                  <ComparisonMatrixRow
                    icon={<FileText className="w-4 h-4 text-sky-600" />}
                    title="Summer Institutes & MOOCs"
                    description="Competitive summer research academies, online certifications, and specialized coursework."
                    students={selectedStudents}
                    renderContent={(student) => {
                      const summerItems = parseBulletItems(student.summerPrograms);
                      const certItems = parseBulletItems(student.certificatesMoocs);

                      if (summerItems.length === 0 && certItems.length === 0) {
                        return <span className="italic text-slate-400 text-xs">{NOT_ADDED_TEXT}</span>;
                      }

                      return (
                        <div className="space-y-2 text-xs">
                          {summerItems.length > 0 && (
                            <div>
                              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                                Summer Programs
                              </span>
                              <div className="space-y-1">
                                {summerItems.map((item, i) => (
                                  <div key={i} className="text-slate-700 text-xs bg-sky-50/60 p-1.5 rounded-lg border border-sky-100">
                                    {item}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {certItems.length > 0 && (
                            <div>
                              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                                Certifications & Courses
                              </span>
                              <div className="space-y-1">
                                {certItems.map((item, i) => (
                                  <div key={i} className="text-slate-700 text-xs bg-slate-50 p-1.5 rounded-lg border border-slate-200/80">
                                    {item}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />

                  {/* Row 10: Counselor & Strategic Notes */}
                  <ComparisonMatrixRow
                    icon={<Star className="w-4 h-4 text-amber-600" />}
                    title="Advising Notes & Background"
                    description="Secondary school, intended career plans, and counselor remarks."
                    students={selectedStudents}
                    renderContent={(student) => {
                      if (isFieldMissing(student.notes)) {
                        return <span className="italic text-slate-400 text-xs">{NOT_ADDED_TEXT}</span>;
                      }
                      return (
                        <div className="text-xs text-slate-700 bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 leading-relaxed">
                          {cleanText(student.notes)}
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>Side-by-side alignment enables instant evaluation across candidate profiles.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
            >
              Done Evaluating
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for an aligned row across students
interface ComparisonMatrixRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  students: StudentProfile[];
  renderContent: (student: StudentProfile, index: number) => React.ReactNode;
}

const ComparisonMatrixRow: React.FC<ComparisonMatrixRowProps> = ({
  icon,
  title,
  description,
  students,
  renderContent,
}) => {
  return (
    <div className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors">
      {/* Row Header with Category Title */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
        <div className="p-1.5 rounded-lg bg-slate-100 shrink-0">{icon}</div>
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
            {title}
          </h4>
          <p className="text-[11px] text-slate-500 leading-none mt-0.5">{description}</p>
        </div>
      </div>

      {/* Synchronized Columns for each student */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {students.map((student, idx) => (
          <div
            key={student.id}
            className="rounded-2xl p-3 bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-start"
          >
            {renderContent(student, idx)}
          </div>
        ))}
      </div>
    </div>
  );
};
