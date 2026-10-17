import React, { useState } from 'react';
import {
  TrendingUp,
  Target,
  Sparkles,
  Info,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { GradeLevel, RankTier } from '../../types';

interface TrajectoryPoint {
  id: string;
  semester: string;
  grade: GradeLevel;
  averageScore: number;
  aspirantScore: number;
  isProjected: boolean;
  benchmarkMilestone: string;
  suggestedAction: string;
}

interface TrajectoryTwoLineChartProps {
  currentGrade: GradeLevel;
  studentName: string;
  targetRankTier: RankTier;
  targetUniversity?: string;
  baselineReadiness: number;
  projectedReadiness: number;
}

export const TrajectoryTwoLineChart: React.FC<TrajectoryTwoLineChartProps> = ({
  currentGrade,
  studentName,
  targetRankTier,
  targetUniversity,
  baselineReadiness,
  projectedReadiness,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<TrajectoryPoint | null>(null);

  // Map student current grade to milestone index (0 to 7)
  const currentGradeIndex =
    currentGrade === 'Grade 9'
      ? 1
      : currentGrade === 'Grade 10'
      ? 3
      : currentGrade === 'Grade 11'
      ? 5
      : 6;

  // Scale scores based on target tier
  const tierTargetMultiplier =
    targetRankTier === 'Top 5'
      ? 1.0
      : targetRankTier === 'Top 10'
      ? 0.95
      : targetRankTier === 'Top 25'
      ? 0.9
      : 0.85;

  const rawMilestones: {
    semester: string;
    grade: GradeLevel;
    avg: number;
    benchmark: string;
    action: string;
  }[] = [
    {
      semester: 'G9 Fall',
      grade: 'Grade 9',
      avg: 42,
      benchmark: 'Highest honors course load; joined STEM / math club',
      action: 'Lock in unweighted 4.0 GPA; join high school competitive team',
    },
    {
      semester: 'G9 Spring',
      grade: 'Grade 9',
      avg: 48,
      benchmark: 'First local science fair / AMC 10 participation; basic coding artifacts',
      action: 'Complete independent inquiry; explore specialized MOOC coursework',
    },
    {
      semester: 'G10 Fall',
      grade: 'Grade 10',
      avg: 58,
      benchmark: 'Regional competition honors; club executive role; AMC 10 score 95+',
      action: 'Aim for AIME cutoff; build first public open-source project or app',
    },
    {
      semester: 'G10 Spring',
      grade: 'Grade 10',
      avg: 68,
      benchmark: 'Cold lab outreach; secured summer research apprenticeship or top camp',
      action: 'Contact 15+ university professors with tailored research proposals',
    },
    {
      semester: 'G11 Fall',
      grade: 'Grade 11',
      avg: 79,
      benchmark: 'SAT 1550+ lockout; founded community initiative; national Olympiad qualifier',
      action: 'Complete SAT/ACT lockout; scale community initiative to 500+ participants',
    },
    {
      semester: 'G11 Spring',
      grade: 'Grade 11',
      avg: 88,
      benchmark: 'First-author paper draft submitted / ISEF finalist / flagship capstone',
      action: 'Submit manuscript to peer-reviewed journal or arXiv; win state ISEF fair',
    },
    {
      semester: 'G12 Fall',
      grade: 'Grade 12',
      avg: 94,
      benchmark: 'Early Action submission; stellar recommendation letters; primary spike narrative',
      action: 'Assemble cohesive admissions dossier; draft distinctive essays',
    },
    {
      semester: 'G12 Spring',
      grade: 'Grade 12',
      avg: 96,
      benchmark: 'Admitted student profile tier; final senior capstone transition',
      action: 'Maintain academic excellence; finalize university matriculation',
    },
  ];

  // Construct trajectory data points
  const points: TrajectoryPoint[] = rawMilestones.map((m, idx) => {
    const averageScore = Math.round(m.avg * tierTargetMultiplier);
    let aspirantScore: number;
    const isProjected = idx > currentGradeIndex;

    if (idx <= currentGradeIndex) {
      // Historical curve leading up to current baseline
      const fraction = (idx + 1) / (currentGradeIndex + 1);
      aspirantScore = Math.round(35 + (baselineReadiness - 35) * fraction);
    } else {
      // Projected path after current grade
      const remainingSteps = 7 - currentGradeIndex;
      const stepIdx = idx - currentGradeIndex;
      const fraction = stepIdx / remainingSteps;
      aspirantScore = Math.round(baselineReadiness + (projectedReadiness - baselineReadiness) * fraction);
    }

    return {
      id: `pt-${idx}`,
      semester: m.semester,
      grade: m.grade,
      averageScore,
      aspirantScore,
      isProjected,
      benchmarkMilestone: m.benchmark,
      suggestedAction: m.action,
    };
  });

  const currentPoint = points[currentGradeIndex];
  const currentGap = currentPoint.averageScore - currentPoint.aspirantScore;

  // SVG Chart Geometry
  const width = 800;
  const height = 320;
  const padding = { top: 40, right: 40, bottom: 50, left: 55 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const minScore = 20;
  const maxScore = 100;

  const getX = (idx: number) => padding.left + (idx / (points.length - 1)) * graphWidth;
  const getY = (score: number) => padding.top + (1 - (score - minScore) / (maxScore - minScore)) * graphHeight;

  // Build SVG path strings
  // 1. Average line
  const averagePathD = points.reduce((acc, pt, idx) => {
    const x = getX(idx);
    const y = getY(pt.averageScore);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // 2. Aspirant Solid path (up to current grade)
  const aspirantSolidPoints = points.slice(0, currentGradeIndex + 1);
  const aspirantSolidPathD = aspirantSolidPoints.reduce((acc, pt, idx) => {
    const x = getX(idx);
    const y = getY(pt.aspirantScore);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // 3. Aspirant Projected path (from current grade onward)
  const aspirantProjectedPoints = points.slice(currentGradeIndex);
  const aspirantProjectedPathD = aspirantProjectedPoints.reduce((acc, pt, idx) => {
    const x = getX(currentGradeIndex + idx);
    const y = getY(pt.aspirantScore);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Area under average path for subtle fill
  const averageAreaD = `${averagePathD} L ${getX(points.length - 1)} ${padding.top + graphHeight} L ${getX(0)} ${padding.top + graphHeight} Z`;

  // Coordinates of student current point
  const currentX = getX(currentGradeIndex);
  const currentY = getY(currentPoint.aspirantScore);
  const avgCurrentY = getY(currentPoint.averageScore);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-6">
      {/* Header & Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider mb-1">
            <span>Trajectory Pathfinder</span>
            <span>·</span>
            <span>Grade 9 Fall → Grade 12 Spring Benchmark</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Admissions Readiness 2-Line Trajectory Chart
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Empirical journey of {targetRankTier} admitted candidates vs. <strong className="text-stone-900">{studentName}</strong>'s current milestone and projected path.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-600 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-emerald-600 rounded-full inline-block" />
            <span>Average Admitted Path</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-stone-900 rounded-full inline-block" />
            <span className="text-stone-900 font-semibold">{studentName} (Active)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 border-t border-dashed border-stone-400 inline-block" />
            <span className="text-stone-500">Tentative Projected Path</span>
          </div>
        </div>
      </div>

      {/* Trajectory Gap Highlight Memo (Direct Bullet Points) */}
      <div className="p-4 sm:p-5 rounded-xl bg-stone-50/70 border border-stone-200 space-y-2 text-xs">
        <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
          Diagnostic Milestone Assessment at {currentPoint.semester} ({currentGrade}):
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <span className="text-stone-500 block text-[11px]">• Current Score</span>
            <span className="font-mono font-semibold text-stone-900 text-sm">
              {currentPoint.aspirantScore} pts
            </span>
          </div>
          <div>
            <span className="text-stone-500 block text-[11px]">• {targetRankTier} Benchmark</span>
            <span className="font-mono font-semibold text-stone-900 text-sm">
              {currentPoint.averageScore} pts
            </span>
          </div>
          <div>
            <span className="text-stone-500 block text-[11px]">• Gap Verdict</span>
            <span
              className={`font-mono font-semibold text-sm ${
                currentGap > 0 ? 'text-amber-800' : 'text-emerald-700'
              }`}
            >
              {currentGap > 0 ? `-${currentGap} pts deficit` : `+${Math.abs(currentGap)} pts ahead`}
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-600">
          <strong className="text-stone-800">• Actionable Objective: </strong>
          {currentPoint.suggestedAction}
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="relative w-full overflow-x-auto bg-stone-950 rounded-xl p-4 sm:p-6 shadow-inner border border-stone-800">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[620px] select-none"
        >
          <defs>
            {/* Shaded Area Gradients */}
            <linearGradient id="averageAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="aspirantLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>

            <linearGradient id="averageLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>

            {/* Glowing filter for the blinking beacon */}
            <filter id="beaconGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[30, 50, 70, 90].map((score) => {
            const y = getY(score);
            return (
              <g key={score}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="sans-serif"
                >
                  {score}%
                </text>
              </g>
            );
          })}

          {/* Shaded Area for Average Line */}
          <path d={averageAreaD} fill="url(#averageAreaGrad)" />

          {/* Line 1: Average Admitted Candidate Journey */}
          <path
            d={averagePathD}
            fill="none"
            stroke="url(#averageLineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Line 2A: Aspiring Student Historical / Current Solid Line */}
          <path
            d={aspirantSolidPathD}
            fill="none"
            stroke="url(#aspirantLineGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Line 2B: Aspiring Student Projected Tentative Dashed Path */}
          <path
            d={aspirantProjectedPathD}
            fill="none"
            stroke="#818cf8"
            strokeWidth="3"
            strokeDasharray="6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Vertical Gap Connector Line between Student Blinking Dot and Average Line */}
          <line
            x1={currentX}
            y1={currentY}
            x2={currentX}
            y2={avgCurrentY}
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />

          {/* Gap Delta Callout Tag on Chart */}
          <g transform={`translate(${currentX + 10}, ${(currentY + avgCurrentY) / 2})`}>
            <rect
              x="-4"
              y="-12"
              width="80"
              height="22"
              rx="6"
              fill="#78350f"
              stroke="#f59e0b"
              strokeWidth="1"
            />
            <text x="36" y="2" textAnchor="middle" fill="#fef3c7" fontSize="10" fontWeight="bold">
              Δ -{currentGap} pts Gap
            </text>
          </g>

          {/* Average Line Milestone Dots */}
          {points.map((pt, idx) => {
            const x = getX(idx);
            const y = getY(pt.averageScore);
            return (
              <circle
                key={`avg-pt-${idx}`}
                cx={x}
                cy={y}
                r="4"
                fill="#10b981"
                stroke="#064e3b"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Student Line Milestone Dots */}
          {points.map((pt, idx) => {
            const x = getX(idx);
            const y = getY(pt.aspirantScore);
            const isCurrent = idx === currentGradeIndex;
            const isPast = idx < currentGradeIndex;

            if (isCurrent) return null; // Rendered as special beacon below

            return (
              <circle
                key={`asp-pt-${idx}`}
                cx={x}
                cy={y}
                r={isPast ? 4 : 3.5}
                fill={isPast ? '#6366f1' : '#1e1b4b'}
                stroke="#818cf8"
                strokeWidth={isPast ? 2 : 1.5}
                strokeDasharray={isPast ? 'none' : '2 2'}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}

          {/* THE BLINKING DOT (Beacon on Student Current Line Position) */}
          <g transform={`translate(${currentX}, ${currentY})`}>
            {/* Outer Pulsing Glow Wave */}
            <circle
              cx="0"
              cy="0"
              r="18"
              fill="none"
              stroke="#818cf8"
              strokeWidth="2"
              opacity="0.6"
              className="animate-ping"
            />
            {/* Second Pulsing Ring */}
            <circle
              cx="0"
              cy="0"
              r="12"
              fill="#6366f1"
              opacity="0.3"
              className="animate-pulse"
            />
            {/* Core Blinking Dot with High-Intensity Filter */}
            <circle
              cx="0"
              cy="0"
              r="7"
              fill="#ffffff"
              stroke="#4f46e5"
              strokeWidth="3.5"
              filter="url(#beaconGlow)"
              className="cursor-pointer animate-pulse"
              onMouseEnter={() => setHoveredPoint(currentPoint)}
              onMouseLeave={() => setHoveredPoint(null)}
            />

            {/* "You Are Here" Floating Tag */}
            <g transform="translate(0, -22)">
              <rect
                x="-52"
                y="-14"
                width="104"
                height="20"
                rx="10"
                fill="#4f46e5"
                stroke="#a5b4fc"
                strokeWidth="1.5"
                className="drop-shadow-lg"
              />
              <text
                x="0"
                y="0"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
                letterSpacing="0.5"
              >
                📍 YOU ARE HERE
              </text>
            </g>
          </g>

          {/* X-axis Semester Labels */}
          {points.map((pt, idx) => {
            const x = getX(idx);
            const isCurrent = idx === currentGradeIndex;

            return (
              <g
                key={pt.semester}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <text
                  x={x}
                  y={height - 24}
                  textAnchor="middle"
                  fill={isCurrent ? '#818cf8' : '#94a3b8'}
                  fontSize={isCurrent ? '11' : '10'}
                  fontWeight={isCurrent ? 'bold' : 'normal'}
                >
                  {pt.semester}
                </text>
                <text
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="9"
                >
                  {pt.grade.replace('Grade ', 'G')}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered Point Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-4 right-4 bg-slate-800/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700 text-white text-xs max-w-xs shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-bold text-indigo-300">{hoveredPoint.semester} ({hoveredPoint.grade})</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                {hoveredPoint.isProjected ? 'Projected Step' : 'Current Track'}
              </span>
            </div>
            <div className="space-y-1 text-[11px] mb-2">
              <div className="text-emerald-400">
                <strong>Admitted Avg Score:</strong> {hoveredPoint.averageScore}%
              </div>
              <div className="text-indigo-300">
                <strong>{studentName}'s Score:</strong> {hoveredPoint.aspirantScore}%
              </div>
            </div>
            <div className="pt-1.5 border-t border-slate-700 text-[11px] text-slate-300">
              <span className="text-slate-400 font-semibold">Admitted Benchmark:</span> {hoveredPoint.benchmarkMilestone}
            </div>
          </div>
        )}
      </div>

      {/* Trajectory Key Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Foundation Phase (G9)
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Average admits establish unshakeable GPA rigor early (3.95+ UW) and start foundational Olympiad/competition training.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs">
          <div className="font-bold text-indigo-950 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Inflection Point (G10–G11)
          </div>
          <p className="text-indigo-900 text-[11px] leading-relaxed">
            This is where candidate trajectories diverge: top admits transition from club members to lab apprentices and original paper authors.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-amber-600" />
            The Closing Target (G12)
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Executing the supercurricular milestones below bridges the current {currentGap} pt gap to reach the 90%+ target admitted tier.
          </p>
        </div>
      </div>
    </div>
  );
};
