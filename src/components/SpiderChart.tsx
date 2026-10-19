import React, { useState, useRef } from 'react';
import { StudentProfile } from '../types';
import { evaluateStudent, StudentEvaluation } from '../utils/studentEvaluation';
import { BlurredName } from './BlurredName';
import { Info } from 'lucide-react';

export interface CustomSpiderEvaluation {
  studentId: string;
  studentName: string;
  compositeScore: number;
  totalPoints?: number;
  dimensions: {
    key: string;
    label: string;
    score: number;
    evidence: string;
  }[];
}

interface SpiderChartProps {
  students?: StudentProfile[];
  customEvaluations?: CustomSpiderEvaluation[];
  height?: number;
  size?: number;
  highlightedStudentId?: string | null;
  onHoverStudent?: (studentId: string | null) => void;
  interactive?: boolean;
}

export const STUDENT_COLORS = [
  {
    name: 'Indigo',
    stroke: '#6366f1',
    fill: 'rgba(99, 102, 241, 0.22)',
    point: '#4f46e5',
    text: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    lightFill: 'rgba(99, 102, 241, 0.08)',
  },
  {
    name: 'Emerald',
    stroke: '#10b981',
    fill: 'rgba(16, 185, 129, 0.22)',
    point: '#059669',
    text: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    lightFill: 'rgba(16, 185, 129, 0.08)',
  },
  {
    name: 'Amber',
    stroke: '#f59e0b',
    fill: 'rgba(245, 158, 11, 0.22)',
    point: '#d97706',
    text: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    lightFill: 'rgba(245, 158, 11, 0.08)',
  },
];

export const SpiderChart: React.FC<SpiderChartProps> = ({
  students = [],
  customEvaluations,
  size: customSize,
  highlightedStudentId,
  onHoverStudent,
  interactive = true,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<{
    x: number;
    y: number;
    dimension: string;
    score: number;
    studentName: string;
    evidence: string;
    color: string;
  } | null>(null);

  const [hoveredPointKey, setHoveredPointKey] = useState<string | null>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [activeStudentFilter, setActiveStudentFilter] = useState<string | null>(null);

  const handlePointEnter = (
    e: React.MouseEvent,
    dim: { label: string; score: number; evidence: string },
    student: StudentProfile,
    colorStroke: string,
    key: string
  ) => {
    if (!interactive) return;
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    setHoveredPointKey(key);
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top,
      dimension: dim.label,
      score: dim.score,
      studentName: student.name,
      evidence: dim.evidence,
      color: colorStroke,
    });
  };

  const handlePointLeave = () => {
    if (!interactive) return;
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    tooltipTimeoutRef.current = setTimeout(() => {
      setActiveTooltip(null);
      setHoveredPointKey(null);
    }, 180);
  };

  const hasData = (customEvaluations && customEvaluations.length > 0) || students.length > 0;
  if (!hasData) {
    return (
      <div className="flex items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
        No students selected for radar evaluation.
      </div>
    );
  }

  // Pre-calculate evaluations for all provided students or custom evaluations
  const evaluations: { student: StudentProfile; eval: StudentEvaluation; colorIdx: number }[] =
    customEvaluations && customEvaluations.length > 0
      ? customEvaluations.map((ce, idx) => ({
          student: {
            id: ce.studentId,
            name: ce.studentName,
            university: '',
            course: '',
            classOf: '',
            linkedin: '',
            academicsPerformance: '',
            apTaken: '',
            actSat: '',
            languageTest: '',
            internshipWork: '',
            research: '',
            summerPrograms: '',
            certificatesMoocs: '',
            competitionsAwards: '',
            projects: '',
            otherActivities: '',
            notes: '',
          },
          eval: {
            studentId: ce.studentId,
            studentName: ce.studentName,
            compositeScore: ce.compositeScore,
            evaluationTier: 'Tier 1 Elite',
            primarySpike: '',
            secondarySpike: '',
            dimensions: ce.dimensions.map((d) => ({
              key: d.key as any,
              label: d.label,
              shortLabel: d.label,
              score: d.score,
              tierLabel: '',
              evidence: d.evidence,
            })),
            radarData: ce.dimensions.map((d) => ({
              axis: d.label,
              shortAxis: d.label,
              value: d.score,
              description: d.evidence,
            })),
          },
          colorIdx: idx % STUDENT_COLORS.length,
        }))
      : students.map((s, idx) => ({
          student: s,
          eval: evaluateStudent(s),
          colorIdx: idx % STUDENT_COLORS.length,
        }));

  const dimensions = evaluations[0]?.eval.dimensions || [];
  const totalAxes = dimensions.length;

  // Chart Geometry
  const size = customSize || 460;
  const center = size / 2;
  const maxRadius = Math.round(size * 0.326);
  const levels = [20, 40, 60, 80, 100];

  // Helper: calculate coordinates for a given angle and radius
  const getCoordinates = (index: number, value: number, radiusScale = maxRadius) => {
    // Start from top (-Math.PI / 2)
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / 100) * radiusScale;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Helper: SVG polygon points string for a level ring
  const getLevelPolygonPoints = (levelValue: number) => {
    return dimensions
      .map((_, idx) => {
        const { x, y } = getCoordinates(idx, levelValue);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  // Filter students if one is isolated
  const displayedEvaluations = activeStudentFilter
    ? evaluations.filter(e => e.student.id === activeStudentFilter)
    : evaluations;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Interactive Legend & Filter Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2 mb-3 w-full">
        <button
          type="button"
          onClick={() => setActiveStudentFilter(null)}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors border ${
            activeStudentFilter === null
              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Compare All ({students.length})
        </button>

        {evaluations.map(({ student, eval: ev, colorIdx }) => {
          const color = STUDENT_COLORS[colorIdx];
          const isSelected = activeStudentFilter === student.id;
          const isHighlighted = highlightedStudentId === student.id;

          return (
            <button
              key={student.id}
              type="button"
              onClick={() => setActiveStudentFilter(isSelected ? null : student.id)}
              onMouseEnter={() => onHoverStudent?.(student.id)}
              onMouseLeave={() => onHoverStudent?.(null)}
              className={`flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-lg transition-all border ${
                isSelected
                  ? `${color.bg} ${color.text} ${color.border} ring-2 ring-indigo-400/40 shadow-xs`
                  : isHighlighted
                  ? `${color.bg} ${color.text} ${color.border} shadow-2xs`
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: color.stroke }}
              />
              <span className="truncate max-w-[120px]">
                <BlurredName fullName={student.name} />
              </span>
              <span className="text-[11px] font-mono opacity-80">
                {ev.compositeScore}/100
              </span>
            </button>
          );
        })}
      </div>

      {/* SVG Spider Chart */}
      <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center select-none">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full overflow-visible drop-shadow-2xs"
        >
          {/* Background Concentric Polygon Rings */}
          {levels.map((lvl) => (
            <g key={`ring-${lvl}`}>
              <polygon
                points={getLevelPolygonPoints(lvl)}
                fill={lvl === 100 ? '#f8fafc' : 'none'}
                stroke="#e2e8f0"
                strokeWidth={lvl === 100 ? '1.5' : '1'}
                strokeDasharray={lvl === 100 ? 'none' : '3,3'}
              />
              {/* Level Percentage Indicator along the top spoke */}
              <text
                x={center + 6}
                y={center - (lvl / 100) * maxRadius + 4}
                fill="#94a3b8"
                fontSize="9"
                fontWeight="600"
                className="font-mono select-none"
              >
                {lvl}
              </text>
            </g>
          ))}

          {/* Radiating Spokes from Center to Vertices */}
          {dimensions.map((dim, idx) => {
            const end = getCoordinates(idx, 100);
            return (
              <line
                key={`spoke-${dim.key}`}
                x1={center}
                y1={center}
                x2={end.x}
                y2={end.y}
                stroke="#cbd5e1"
                strokeWidth="1.2"
              />
            );
          })}

          {/* Dimension Axis Labels Around the Perimeter */}
          {dimensions.map((dim, idx) => {
            const angle = (Math.PI * 2 / totalAxes) * idx - Math.PI / 2;
            const labelRadius = maxRadius + 28;
            const lx = center + labelRadius * Math.cos(angle);
            const ly = center + labelRadius * Math.sin(angle);

            // Anchor logic depending on horizontal position
            let textAnchor: 'middle' | 'start' | 'end' = 'middle';
            if (Math.cos(angle) > 0.3) textAnchor = 'start';
            else if (Math.cos(angle) < -0.3) textAnchor = 'end';

            return (
              <g key={`label-${dim.key}`} className="cursor-default">
                <text
                  x={lx}
                  y={ly + 4}
                  textAnchor={textAnchor}
                  fill="#0f172a"
                  fontSize="11"
                  fontWeight="700"
                  className="tracking-tight"
                >
                  {dim.label}
                </text>
              </g>
            );
          })}

          {/* Plotted Student Data Polygons */}
          {displayedEvaluations.map(({ student, eval: ev, colorIdx }) => {
            const color = STUDENT_COLORS[colorIdx];
            const isHovered = highlightedStudentId === student.id || activeStudentFilter === student.id;

            const pointsString = ev.dimensions
              .map((dim, idx) => {
                const { x, y } = getCoordinates(idx, dim.score);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              })
              .join(' ');

            return (
              <g
                key={`poly-${student.id}`}
                className="transition-all duration-300"
                style={{ opacity: isHovered || activeStudentFilter === null ? 1 : 0.35 }}
              >
                {/* Polygon Area Fill & Outline */}
                <polygon
                  points={pointsString}
                  fill={isHovered ? color.fill : color.lightFill}
                  stroke={color.stroke}
                  strokeWidth={isHovered ? '2.5' : '1.8'}
                  className="transition-all duration-200"
                  style={{ filter: isHovered ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.12))' : 'none' }}
                />

                {/* Data Vertex Nodes with Generous Hit Targets & Rock-Solid Hover Stability */}
                {ev.dimensions.map((dim, idx) => {
                  const { x, y } = getCoordinates(idx, dim.score);
                  const pointKey = `pt-${student.id}-${dim.key}`;
                  const isPointActive = hoveredPointKey === pointKey;

                  return (
                    <g
                      key={pointKey}
                      className="cursor-pointer"
                      onMouseEnter={(e) =>
                        handlePointEnter(e, dim, student, color.stroke, pointKey)
                      }
                      onMouseLeave={handlePointLeave}
                    >
                      {/* Generous invisible hit zone (32px diameter) with pointer-events: all */}
                      <circle
                        cx={x}
                        cy={y}
                        r={16}
                        fill="transparent"
                        style={{ pointerEvents: 'all' }}
                      />

                      {/* Active highlight ring when hovered */}
                      {isPointActive && (
                        <circle
                          cx={x}
                          cy={y}
                          r={8}
                          fill="none"
                          stroke={color.stroke}
                          strokeWidth={2}
                          opacity={0.65}
                          className="pointer-events-none"
                        />
                      )}

                      {/* Visual node circle - NO scale-150 transform, completely stable */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isPointActive ? 5 : isHovered ? 4.5 : 3.5}
                        fill="#ffffff"
                        stroke={color.stroke}
                        strokeWidth={isPointActive ? 3 : isHovered ? 2.5 : 1.8}
                        className="pointer-events-none transition-all duration-150"
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Dimension Hover Tooltip (Stable on hover only, pointer-events-none) */}
        {activeTooltip && (
          <div
            className="fixed z-60 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 bg-stone-900/95 text-white px-3 py-2 rounded-xl text-xs shadow-xl backdrop-blur-xs max-w-xs border border-stone-700/80 transition-opacity duration-150"
            style={{
              left: `${activeTooltip.x}px`,
              top: `${activeTooltip.y - 10}px`,
            }}
          >
            <div className="flex items-center gap-1.5 font-bold mb-0.5" style={{ color: activeTooltip.color }}>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: activeTooltip.color }} />
              <BlurredName fullName={activeTooltip.studentName} />
              <span className="text-white ml-auto font-mono text-[11px]">
                {activeTooltip.score}/100
              </span>
            </div>
            <div className="text-[11px] font-semibold text-stone-200">
              {activeTooltip.dimension}
            </div>
            <div className="text-[10px] text-stone-400 mt-1 leading-snug">
              {activeTooltip.evidence}
            </div>
          </div>
        )}
      </div>

      {/* Spider Chart Rubric Note */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
        <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
        <span>MLS Evaluation Rubric: Standardized across the 6 core competency aspects (Problem Solving, Technical Skills, Critical Thinking, Team Work, Communication, Creativity).</span>
      </div>
    </div>
  );
};
