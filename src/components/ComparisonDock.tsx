import React from 'react';
import { StudentProfile } from '../types';
import { BlurredName } from './BlurredName';
import { STUDENT_COLORS } from './SpiderChart';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';

interface ComparisonDockProps {
  selectedStudents: StudentProfile[];
  onOpenComparison: () => void;
  onRemoveStudent: (studentId: string) => void;
  onClearAll: () => void;
}

export const ComparisonDock: React.FC<ComparisonDockProps> = ({
  selectedStudents,
  onOpenComparison,
  onRemoveStudent,
  onClearAll,
}) => {
  if (selectedStudents.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[94%] sm:w-auto animate-slideUp">
      <div className="bg-slate-900/95 text-white backdrop-blur-md px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3 sm:gap-5 flex-wrap sm:flex-nowrap">
        {/* Left: Indicator & Candidate Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto py-0.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 shrink-0">
            <Scale className="w-4 h-4 text-indigo-400" />
            <span className="hidden xs:inline">Compare</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[11px] border border-indigo-400/30">
              {selectedStudents.length}/3
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {selectedStudents.map((student, idx) => {
              const color = STUDENT_COLORS[idx % STUDENT_COLORS.length];
              return (
                <div
                  key={student.id}
                  className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white max-w-[140px] transition-colors"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: color.stroke }}
                  />
                  <span className="truncate text-[11px] font-semibold">
                    <BlurredName fullName={student.name} />
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveStudent(student.id);
                    }}
                    title="Remove candidate"
                    className="text-slate-400 hover:text-rose-400 transition-colors ml-0.5 shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <button
            type="button"
            onClick={onClearAll}
            title="Clear comparison list"
            className="text-slate-400 hover:text-slate-200 text-xs font-semibold px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Clear
          </button>

          <button
            type="button"
            id="open-comparison-dock-btn"
            onClick={onOpenComparison}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all active:scale-98"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
