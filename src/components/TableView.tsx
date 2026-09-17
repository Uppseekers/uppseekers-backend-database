import React, { useRef, useState, useEffect } from 'react';
import { StudentProfile } from '../types';
import { BlurredName } from './BlurredName';
import { cleanText, parseBulletItems, isFieldMissing, NOT_ADDED_TEXT } from '../utils/textCleaner';
import { calculateProfileCompleteness } from '../utils/workAnalyzer';
import {
  Building2,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  Linkedin,
  Star,
  Briefcase,
  Microscope,
  Award,
  BookOpen,
  ArrowLeftRight,
  Edit3,
} from 'lucide-react';

interface TableViewProps {
  students: StudentProfile[];
  onSelect: (student: StudentProfile) => void;
  onEdit?: (student: StudentProfile) => void;
  isAdmin?: boolean;
}

export const TableView: React.FC<TableViewProps> = ({ students, onSelect, onEdit, isAdmin }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [students]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -350 : 350;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col">
      {/* Scroll Navigation & Helper Toolbar */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-medium text-slate-700">
            Horizontal Scroll Enabled
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-[11px] text-slate-500">
            Scroll sideways to view all detailed columns (Academics, Testing, Experience, Research, Awards)
          </span>
        </div>

        {/* Quick Scroll Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id="table-scroll-left-btn"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
              canScrollLeft
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-indigo-600 shadow-2xs cursor-pointer'
                : 'bg-slate-100 border-slate-200/60 text-slate-300 cursor-not-allowed'
            }`}
            title="Scroll table to the left"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden md:inline text-[11px]">Scroll Left</span>
          </button>
          <button
            type="button"
            id="table-scroll-right-btn"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
              canScrollRight
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-indigo-600 shadow-2xs cursor-pointer'
                : 'bg-slate-100 border-slate-200/60 text-slate-300 cursor-not-allowed'
            }`}
            title="Scroll table to the right"
          >
            <span className="hidden md:inline text-[11px]">Scroll Right</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table Container with forced horizontal scroll and opaque sticky boundaries */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-auto max-h-[720px] scroll-smooth select-text"
      >
        <table className="min-w-[1580px] w-full text-left text-xs text-slate-700 border-separate border-spacing-0">
          <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider text-[11px] sticky top-0 z-30">
            <tr>
              {/* Column 1: Sticky Name & Standout with solid opaque background and crisp divider */}
              <th
                scope="col"
                className="w-[230px] min-w-[230px] max-w-[230px] py-3.5 px-4 sticky left-0 z-30 bg-slate-100 border-b border-r border-slate-200 shadow-[3px_0_6px_-2px_rgba(0,0,0,0.06)]"
              >
                Name & Standouts
              </th>

              {/* Column 2: Independent University & Major Column */}
              <th
                scope="col"
                className="w-[240px] min-w-[240px] max-w-[240px] py-3.5 px-4 border-b border-slate-200"
              >
                University & Major
              </th>

              {/* Column 3: Class of */}
              <th
                scope="col"
                className="w-[110px] min-w-[110px] py-3.5 px-3 border-b border-slate-200 text-center"
              >
                Class
              </th>

              {/* Column 4: Academics & Testing */}
              <th
                scope="col"
                className="w-[230px] min-w-[230px] py-3.5 px-4 border-b border-slate-200"
              >
                Academics & Testing
              </th>

              {/* Column 5: Internships & Work */}
              <th
                scope="col"
                className="w-[260px] min-w-[260px] py-3.5 px-4 border-b border-slate-200"
              >
                Internship & Experience
              </th>

              {/* Column 6: Research & Inquiries */}
              <th
                scope="col"
                className="w-[260px] min-w-[260px] py-3.5 px-4 border-b border-slate-200"
              >
                Research & Inquiries
              </th>

              {/* Column 7: Awards & Honors */}
              <th
                scope="col"
                className="w-[240px] min-w-[240px] py-3.5 px-4 border-b border-slate-200"
              >
                Awards & Honors
              </th>

              {/* Column 8: Action button (Sticky Right with solid background) */}
              <th
                scope="col"
                className="w-[130px] min-w-[130px] py-3.5 px-4 text-center sticky right-0 z-30 bg-slate-100 border-b border-l border-slate-200 shadow-[-3px_0_6px_-2px_rgba(0,0,0,0.06)]"
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-slate-100">
            {students.map((student, idx) => {
              const completeness = calculateProfileCompleteness(student);
              const internItems = parseBulletItems(student.internshipWork);
              const researchItems = parseBulletItems(student.research);
              const awardItems = parseBulletItems(student.competitionsAwards);
              const primaryStandout = completeness.standouts[0];

              const hasAcademics = !isFieldMissing(student.academicsPerformance);
              const hasTestScores = !isFieldMissing(student.actSat);
              const hasMajor = !isFieldMissing(student.course);
              const isEvenRow = idx % 2 === 0;

              return (
                <tr
                  key={student.id}
                  id={`table-row-${student.id}`}
                  onClick={() => onSelect(student)}
                  className="group hover:bg-indigo-50/60 cursor-pointer transition-colors"
                >
                  {/* Column 1: Name & Standout (Sticky Left with 100% OPAQUE background and shadow) */}
                  <td
                    className={`w-[230px] min-w-[230px] max-w-[230px] py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap sticky left-0 z-20 border-b border-r border-slate-200 shadow-[3px_0_6px_-2px_rgba(0,0,0,0.06)] transition-colors ${
                      isEvenRow ? 'bg-white group-hover:bg-indigo-50/90' : 'bg-slate-50/90 group-hover:bg-indigo-50/90'
                    }`}
                  >
                    <div className="flex flex-col">
                      <BlurredName fullName={student.name} />
                      {primaryStandout && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded mt-1 w-max border border-amber-200">
                          <Star className="w-2.5 h-2.5 fill-amber-600 text-amber-600 shrink-0" />
                          <span className="truncate max-w-[170px]">{primaryStandout.badge}</span>
                        </span>
                      )}
                      {student.linkedin && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 mt-0.5">
                          <Linkedin className="w-2.5 h-2.5 shrink-0" /> LinkedIn Available
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Column 2: University & Major (Crisply separated, NEVER merged) */}
                  <td className="w-[240px] min-w-[240px] max-w-[240px] py-3.5 px-4 border-b border-slate-200">
                    <div className="flex items-start gap-1.5 font-bold text-slate-900 leading-snug">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{student.university || NOT_ADDED_TEXT}</span>
                    </div>
                    {hasMajor ? (
                      <div className="text-[11px] text-slate-600 flex items-start gap-1 mt-1 font-normal">
                        <BookOpen className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{cleanText(student.course)}</span>
                      </div>
                    ) : (
                      <div className="text-[11px] italic text-slate-400 mt-1">
                        {NOT_ADDED_TEXT}
                      </div>
                    )}
                  </td>

                  {/* Column 3: Class */}
                  <td className="w-[110px] min-w-[110px] py-3.5 px-3 border-b border-slate-200 text-center whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      <GraduationCap className="w-3 h-3 mr-1" />
                      {student.classOf || NOT_ADDED_TEXT}
                    </span>
                  </td>

                  {/* Column 4: Academics & Testing */}
                  <td className="w-[230px] min-w-[230px] py-3.5 px-4 border-b border-slate-200 text-[11px]">
                    {hasAcademics || hasTestScores ? (
                      <div className="space-y-1">
                        {hasAcademics && (
                          <div className="font-medium text-slate-800 line-clamp-2">
                            <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Marks:</span>
                            {cleanText(student.academicsPerformance)}
                          </div>
                        )}
                        {hasTestScores && (
                          <div className="font-mono text-slate-700 line-clamp-1">
                            <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">SAT/ACT:</span>
                            {cleanText(student.actSat)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-normal text-slate-500 bg-slate-100 border border-slate-200/80 italic">
                        {NOT_ADDED_TEXT}
                      </span>
                    )}
                  </td>

                  {/* Column 5: Internship & Experience */}
                  <td className="w-[260px] min-w-[260px] py-3.5 px-4 border-b border-slate-200 text-[11px]">
                    {internItems.length > 0 ? (
                      <div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 mb-1">
                          <Briefcase className="w-2.5 h-2.5" /> {internItems.length} Experience
                        </span>
                        <div className="line-clamp-2 text-slate-800 font-normal">
                          {internItems[0]}
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-normal text-slate-500 bg-slate-100 border border-slate-200/80 italic">
                        {NOT_ADDED_TEXT}
                      </span>
                    )}
                  </td>

                  {/* Column 6: Research */}
                  <td className="w-[260px] min-w-[260px] py-3.5 px-4 border-b border-slate-200 text-[11px]">
                    {researchItems.length > 0 ? (
                      <div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mb-1">
                          <Microscope className="w-2.5 h-2.5" /> {researchItems.length} Research
                        </span>
                        <div className="line-clamp-2 text-slate-800 font-normal">
                          {researchItems[0]}
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-normal text-slate-500 bg-slate-100 border border-slate-200/80 italic">
                        {NOT_ADDED_TEXT}
                      </span>
                    )}
                  </td>

                  {/* Column 7: Awards */}
                  <td className="w-[240px] min-w-[240px] py-3.5 px-4 border-b border-slate-200 text-[11px]">
                    {awardItems.length > 0 ? (
                      <div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mb-1">
                          <Award className="w-2.5 h-2.5" /> {awardItems.length} Awards
                        </span>
                        <div className="line-clamp-2 text-slate-800 font-normal">
                          {awardItems[0]}
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-normal text-slate-500 bg-slate-100 border border-slate-200/80 italic">
                        {NOT_ADDED_TEXT}
                      </span>
                    )}
                  </td>

                  {/* Column 8: Action (Sticky Right with opaque background) */}
                  <td
                    className={`w-[180px] min-w-[180px] py-3.5 px-4 text-center whitespace-nowrap sticky right-0 z-20 border-b border-l border-slate-200 shadow-[-3px_0_6px_-2px_rgba(0,0,0,0.06)] transition-colors ${
                      isEvenRow ? 'bg-white group-hover:bg-indigo-50/90' : 'bg-slate-50/90 group-hover:bg-indigo-50/90'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      {isAdmin && onEdit && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(student);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors shadow-2xs cursor-pointer"
                          title="Edit this student record"
                        >
                          <Edit3 className="w-3 h-3 text-amber-600" />
                          <span>Edit</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onSelect(student);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-900 rounded-lg border border-indigo-200 transition-colors shadow-2xs cursor-pointer"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
