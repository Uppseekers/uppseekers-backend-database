import React, { useState, useRef } from 'react';
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
  targetField?: string;
  baselineReadiness: number;
  projectedReadiness: number;
}

export const TrajectoryTwoLineChart: React.FC<TrajectoryTwoLineChartProps> = ({
  currentGrade,
  studentName,
  targetRankTier,
  targetUniversity,
  targetField = 'Computer Science & AI',
  baselineReadiness,
  projectedReadiness,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<TrajectoryPoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<TrajectoryPoint | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Generate field-specific trajectory milestones
  const getFieldSpecificMilestones = (field: string) => {
    const f = field.toLowerCase();
    const isPreMed = f.includes('pre-med') || f.includes('bio') || f.includes('health') || f.includes('med');
    const isEngineering = f.includes('engineering') || f.includes('robotics') || f.includes('mechanical') || f.includes('aerospace');
    const isEcon = f.includes('econ') || f.includes('quant') || f.includes('finance') || f.includes('business');
    const isLaw = f.includes('law') || f.includes('policy') || f.includes('international') || f.includes('gov');
    const isPhysicsMath = f.includes('physics') || f.includes('math') || f.includes('astronomy');

    if (isPreMed) {
      return [
        {
          semester: 'G9 Fall',
          grade: 'Grade 9' as GradeLevel,
          avg: 42,
          benchmark: 'Highest honors biology/chemistry course load; joined HOSA / pre-med enrichment club',
          action: 'Lock in unweighted 4.0 GPA; join high school Science Olympiad or biology team',
        },
        {
          semester: 'G9 Spring',
          grade: 'Grade 9' as GradeLevel,
          avg: 48,
          benchmark: 'Local science fair inquiry; completed bio-safety course & 30+ hrs clinical volunteering',
          action: 'Formulate independent biological hypothesis; volunteer at community medical clinic',
        },
        {
          semester: 'G10 Fall',
          grade: 'Grade 10' as GradeLevel,
          avg: 58,
          benchmark: 'Regional science fair honors; USA Biology Olympiad (USABO) Semifinalist prep',
          action: 'Target Campbell Biology mastery; secure laboratory safety / data assay certification',
        },
        {
          semester: 'G10 Spring',
          grade: 'Grade 10' as GradeLevel,
          avg: 68,
          benchmark: 'University wet-lab outreach; secured summer biomedical research apprenticeship',
          action: 'Contact 15+ university biomedical researchers with tailored research proposals',
        },
        {
          semester: 'G11 Fall',
          grade: 'Grade 11' as GradeLevel,
          avg: 78,
          benchmark: 'USABO Semifinalist (Top 10%); first-author preprint draft on bioRxiv',
          action: 'Focus on primary manuscript submission in molecular biology, oncology, or genetics',
        },
        {
          semester: 'G11 Spring',
          grade: 'Grade 11' as GradeLevel,
          avg: 86,
          benchmark: 'ISEF finalist in Biomedical Sciences; selective summer institute admit (SIMR/RSI)',
          action: 'Submit ISEF qualifying project; complete standardized testing (SAT/ACT 1550+)',
        },
        {
          semester: 'G12 Fall',
          grade: 'Grade 12' as GradeLevel,
          avg: 94,
          benchmark: 'SlideRoom Research Portfolio; Principal Investigator letter of recommendation secured',
          action: 'Submit Early Action / Early Decision with polished clinical and research dossier',
        },
        {
          semester: 'G12 Spring',
          grade: 'Grade 12' as GradeLevel,
          avg: 98,
          benchmark: 'Senior clinical capstone presentation; national medical symposium honors; Top tier admission',
          action: 'Maintain academic momentum; prepare scholarship and honors submissions',
        },
      ];
    }

    if (isEngineering) {
      return [
        {
          semester: 'G9 Fall',
          grade: 'Grade 9' as GradeLevel,
          avg: 42,
          benchmark: 'Highest honors physics/calculus course load; joined FRC / FTC Robotics team',
          action: 'Lock in unweighted 4.0 GPA; master CAD fundamentals in SolidWorks or Onshape',
        },
        {
          semester: 'G9 Spring',
          grade: 'Grade 9' as GradeLevel,
          avg: 48,
          benchmark: 'First physical mechanism deployed; Arduino/Raspberry Pi micro-controller projects',
          action: 'Build autonomous mechanism prototype; compete in rookie robotics tournament',
        },
        {
          semester: 'G10 Fall',
          grade: 'Grade 10' as GradeLevel,
          avg: 58,
          benchmark: 'FRC lead subsystem designer; Science Olympiad medal; advanced 3D fabrication',
          action: 'Achieve Certified SolidWorks Associate (CSWA); lead mechanical build cycle',
        },
        {
          semester: 'G10 Spring',
          grade: 'Grade 10' as GradeLevel,
          avg: 68,
          benchmark: 'University engineering lab outreach; secured summer robotics or materials apprenticeship',
          action: 'Contact university robotics and aerospace labs with tailored prototyping portfolio',
        },
        {
          semester: 'G11 Fall',
          grade: 'Grade 11' as GradeLevel,
          avg: 78,
          benchmark: 'First-author engineering preprint or patent pending; FRC regional division finalist',
          action: 'Deploy novel hardware artifact; submit paper to IEEE or young researcher symposium',
        },
        {
          semester: 'G11 Spring',
          grade: 'Grade 11' as GradeLevel,
          avg: 86,
          benchmark: 'MIT THINK finalist or Beaver Works / RSI admit; national robotics qualification',
          action: 'Apply to competitive engineering institutes; lock in standardized testing',
        },
        {
          semester: 'G12 Fall',
          grade: 'Grade 12' as GradeLevel,
          avg: 94,
          benchmark: 'SlideRoom Maker Portfolio with CAD schematics and video demonstrations',
          action: 'Submit Early Action / Early Decision with faculty/mentor recommendation',
        },
        {
          semester: 'G12 Spring',
          grade: 'Grade 12' as GradeLevel,
          avg: 98,
          benchmark: 'Senior engineering capstone deployed; national design honors; Top tier admission',
          action: 'Maintain academic momentum; prepare scholarship and honors submissions',
        },
      ];
    }

    if (isEcon) {
      return [
        {
          semester: 'G9 Fall',
          grade: 'Grade 9' as GradeLevel,
          avg: 42,
          benchmark: 'Highest honors mathematics course load; joined speech & debate or economics club',
          action: 'Lock in unweighted 4.0 GPA; study AP Micro/Macroeconomics principles',
        },
        {
          semester: 'G9 Spring',
          grade: 'Grade 9' as GradeLevel,
          avg: 48,
          benchmark: 'National Economics Challenge (David Ricardo division); econometric modeling in Python',
          action: 'Complete introductory econometrics or data analysis; compete in stock pitch competition',
        },
        {
          semester: 'G10 Fall',
          grade: 'Grade 10' as GradeLevel,
          avg: 58,
          benchmark: 'Wharton Global Youth Investment Challenge state finalist; AMC 10 score 95+',
          action: 'Target AIME qualification for quantitative spike; lead school investment society',
        },
        {
          semester: 'G10 Spring',
          grade: 'Grade 10' as GradeLevel,
          avg: 68,
          benchmark: 'FinTech / economic policy firm outreach; secured summer financial research fellowship',
          action: 'Contact university economics faculty; build automated macroeconomic scraper',
        },
        {
          semester: 'G11 Fall',
          grade: 'Grade 11' as GradeLevel,
          avg: 78,
          benchmark: 'Published econometric paper in student economics journal; NEC Adam Smith Semifinalist',
          action: 'Complete primary-author empirical economic inquiry on market efficiency or inflation',
        },
        {
          semester: 'G11 Spring',
          grade: 'Grade 11' as GradeLevel,
          avg: 86,
          benchmark: 'Fed Challenge finalist; Bank of America Student Leader or Wharton LBW admit',
          action: 'Present findings at youth economics symposium; lock in SAT/ACT 1550+',
        },
        {
          semester: 'G12 Fall',
          grade: 'Grade 12' as GradeLevel,
          avg: 94,
          benchmark: 'Economic Policy Brief & Quantitative Portfolio; faculty recommendation secured',
          action: 'Submit Early Action / Early Decision with polished analytical dossier',
        },
        {
          semester: 'G12 Spring',
          grade: 'Grade 12' as GradeLevel,
          avg: 98,
          benchmark: 'Senior investment fund capstone deployed; national business honors; Top tier admission',
          action: 'Maintain academic momentum; prepare scholarship and honors submissions',
        },
      ];
    }

    if (isLaw) {
      return [
        {
          semester: 'G9 Fall',
          grade: 'Grade 9' as GradeLevel,
          avg: 42,
          benchmark: 'Highest honors English & history course load; joined Model UN and Speech & Debate',
          action: 'Lock in unweighted 4.0 GPA; master parliamentary procedure and research briefs',
        },
        {
          semester: 'G9 Spring',
          grade: 'Grade 9' as GradeLevel,
          avg: 48,
          benchmark: 'Novice Best Delegate gavel; published local youth op-ed on civic municipal policy',
          action: 'Compete in regional speech and debate circuit; engage in district community advocacy',
        },
        {
          semester: 'G10 Fall',
          grade: 'Grade 10' as GradeLevel,
          avg: 58,
          benchmark: 'Varsity Lincoln-Douglas state qualifier; organized district youth voting rights forum',
          action: 'Draft regional public policy whitepaper; lead high school Model UN delegation',
        },
        {
          semester: 'G10 Spring',
          grade: 'Grade 10' as GradeLevel,
          avg: 68,
          benchmark: 'Congressional district office or legal aid clinic internship; legislative research',
          action: 'Secure summer policy fellowship with state representative or non-profit legal advocacy',
        },
        {
          semester: 'G11 Fall',
          grade: 'Grade 11' as GradeLevel,
          avg: 78,
          benchmark: 'National Speech & Debate Tournament qualifier; published policy brief in law journal',
          action: 'Submit legal commentary manuscript; organize statewide civic coalition',
        },
        {
          semester: 'G11 Spring',
          grade: 'Grade 11' as GradeLevel,
          avg: 86,
          benchmark: 'Senate Page or TASP / Telluride Association summer admit; national MUN gavels',
          action: 'Complete standardized testing (SAT/ACT 1550+ with 99th percentile reading/writing)',
        },
        {
          semester: 'G12 Fall',
          grade: 'Grade 12' as GradeLevel,
          avg: 94,
          benchmark: 'SlideRoom Writing & Policy Portfolio; congressional/mentor recommendation secured',
          action: 'Submit Early Action / Early Decision with polished constitutional or policy dossier',
        },
        {
          semester: 'G12 Spring',
          grade: 'Grade 12' as GradeLevel,
          avg: 98,
          benchmark: 'Policy brief adopted by municipal council; National Merit; Top tier admission',
          action: 'Maintain academic momentum; prepare scholarship and honors submissions',
        },
      ];
    }

    if (isPhysicsMath) {
      return [
        {
          semester: 'G9 Fall',
          grade: 'Grade 9' as GradeLevel,
          avg: 42,
          benchmark: 'Accelerated proof-based mathematics; joined regional Math Circle / olympiad training',
          action: 'Lock in unweighted 4.0 GPA; begin preparation for AMC 10 and USAMTS',
        },
        {
          semester: 'G9 Spring',
          grade: 'Grade 9' as GradeLevel,
          avg: 48,
          benchmark: 'AMC 10 score 100+; USAMTS participant; introductory computational astrophysics',
          action: 'Complete linear algebra / multivariable calculus; write numerical physics simulation',
        },
        {
          semester: 'G10 Fall',
          grade: 'Grade 10' as GradeLevel,
          avg: 58,
          benchmark: 'AIME qualifier (Score 7+); USAPhO F=ma contest top 10% nationwide score',
          action: 'Intensive contest rounds; submit solution to mathematical problem journal',
        },
        {
          semester: 'G10 Spring',
          grade: 'Grade 10' as GradeLevel,
          avg: 68,
          benchmark: 'Theoretical physics / pure math department outreach; secured summer research mentorship',
          action: 'Contact university mathematicians with specific inquiries on abstract algebra or topology',
        },
        {
          semester: 'G11 Fall',
          grade: 'Grade 11' as GradeLevel,
          avg: 78,
          benchmark: 'USAMO or USAPhO Semifinalist; first-author preprint draft on arXiv (math/physics)',
          action: 'Finalize proof or simulation paper; submit to Intel/Regeneron STS or MIT PRIMES',
        },
        {
          semester: 'G11 Spring',
          grade: 'Grade 11' as GradeLevel,
          avg: 86,
          benchmark: 'PROMYS / Ross Mathematics / RSI admit; national olympiad medal',
          action: 'Attend elite summer mathematics institute; lock in standardized testing',
        },
        {
          semester: 'G12 Fall',
          grade: 'Grade 12' as GradeLevel,
          avg: 94,
          benchmark: 'SlideRoom Pure Mathematics Portfolio; university faculty recommendation secured',
          action: 'Submit Early Action / Early Decision with rigorous mathematical/physics dossier',
        },
        {
          semester: 'G12 Spring',
          grade: 'Grade 12' as GradeLevel,
          avg: 98,
          benchmark: 'Senior theoretical capstone deployed; national mathematics honors; Top tier admission',
          action: 'Maintain academic momentum; prepare scholarship and honors submissions',
        },
      ];
    }

    // Default to Computer Science & AI / General Tech
    return [
      {
        semester: 'G9 Fall',
        grade: 'Grade 9' as GradeLevel,
        avg: 42,
        benchmark: 'Highest honors course load; joined STEM / math enrichment circle',
        action: 'Lock in unweighted 4.0 GPA; join high school competitive team',
      },
      {
        semester: 'G9 Spring',
        grade: 'Grade 9' as GradeLevel,
        avg: 48,
        benchmark: 'First local science fair / AMC 10 participation; self-taught coding',
        action: 'Complete independent inquiry; explore CS50x or specialized MOOCs',
      },
      {
        semester: 'G10 Fall',
        grade: 'Grade 10' as GradeLevel,
        avg: 58,
        benchmark: 'Regional competition honors; club executive role; AMC 10 score 95+',
        action: 'Target AIME cutoff; build first public open-source project or app',
      },
      {
        semester: 'G10 Spring',
        grade: 'Grade 10' as GradeLevel,
        avg: 68,
        benchmark: 'Cold lab outreach; secured summer research apprenticeship or top camp',
        action: 'Contact 15+ university professors with tailored research proposals',
      },
      {
        semester: 'G11 Fall',
        grade: 'Grade 11' as GradeLevel,
        avg: 78,
        benchmark: 'AIME qualifier (Score 6+); first-author preprint draft on arXiv',
        action: 'Focus on primary preprint submission and national contest rounds',
      },
      {
        semester: 'G11 Spring',
        grade: 'Grade 11' as GradeLevel,
        avg: 86,
        benchmark: 'ISEF finalist / USAMO qualifier; selective summer institute admit',
        action: 'Apply to RSI, Beaver Works, or SIMR; prepare standardized testing',
      },
      {
        semester: 'G12 Fall',
        grade: 'Grade 12' as GradeLevel,
        avg: 94,
        benchmark: 'SlideRoom Maker Portfolio; technical recommendations secured',
        action: 'Submit Early Action / Early Decision with polished technical dossier',
      },
      {
        semester: 'G12 Spring',
        grade: 'Grade 12' as GradeLevel,
        avg: 98,
        benchmark: 'Senior capstone deployed; mentorship transition; Top tier admission',
        action: 'Maintain academic momentum; prepare scholarship and honors submissions',
      },
    ];
  };

  const rawMilestones = getFieldSpecificMilestones(targetField);

  // Synthesize points with student's current baseline & projected curve
  const points: TrajectoryPoint[] = rawMilestones.map((m, idx) => {
    const averageScore = Math.round(m.avg * tierTargetMultiplier);
    const isProjected = idx > currentGradeIndex;
    let aspirantScore = 0;

    if (idx <= currentGradeIndex) {
      const progressRatio = (idx + 1) / (currentGradeIndex + 1);
      aspirantScore = Math.round(baselineReadiness * (0.6 + 0.4 * progressRatio));
      if (idx === currentGradeIndex) aspirantScore = baselineReadiness;
    } else {
      const remainingSteps = Math.max(1, rawMilestones.length - 1 - currentGradeIndex);
      const stepIndex = idx - currentGradeIndex;
      const scoreGain = projectedReadiness - baselineReadiness;
      aspirantScore = Math.round(baselineReadiness + (scoreGain * stepIndex) / remainingSteps);
    }

    return {
      id: `pt-${m.semester}`,
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

  // Active point to inspect: active on hover or explicit selection only (prevents flickering)
  const activeInspectorPoint = hoveredPoint || selectedPoint;

  // Stable hover handlers with 200ms debounce to eliminate pointer flicker
  const handlePointMouseEnter = (pt: TrajectoryPoint) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredPoint(pt);
  };

  const handlePointMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredPoint(null);
    }, 200);
  };

  const handlePointClick = (pt: TrajectoryPoint) => {
    setSelectedPoint((prev) => (prev?.id === pt.id ? null : pt));
  };

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
  const averagePathD = points.reduce((acc, pt, idx) => {
    const x = getX(idx);
    const y = getY(pt.averageScore);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const aspirantSolidPoints = points.slice(0, currentGradeIndex + 1);
  const aspirantSolidPathD = aspirantSolidPoints.reduce((acc, pt, idx) => {
    const x = getX(idx);
    const y = getY(pt.aspirantScore);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const aspirantProjectedPoints = points.slice(currentGradeIndex);
  const aspirantProjectedPathD = aspirantProjectedPoints.reduce((acc, pt, idx) => {
    const x = getX(currentGradeIndex + idx);
    const y = getY(pt.aspirantScore);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const averageAreaD = `${averagePathD} L ${getX(points.length - 1)} ${padding.top + graphHeight} L ${getX(0)} ${padding.top + graphHeight} Z`;

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
            <span className="text-stone-800 font-semibold">{targetField}</span>
            <span>·</span>
            <span>Grade 9 Fall → Grade 12 Spring Benchmark</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Admissions Readiness 2-Line Trajectory Chart
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Empirical journey of {targetRankTier} ({targetField}) admitted candidates vs. <strong className="text-stone-900">{studentName}</strong>'s current standing and tentative back-engineered path. Hover or click any milestone point below to inspect benchmark criteria.
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

      {/* SVG Interactive Chart with Stable Invisible Hit Targets */}
      <div className="relative w-full overflow-x-auto bg-stone-950 rounded-xl p-4 sm:p-6 shadow-inner border border-stone-800">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[620px] select-none"
        >
          <defs>
            {/* Shaded Area Gradients */}
            <linearGradient id="averageAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="aspirantLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d6d3d1" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            <linearGradient id="averageLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>

            {/* Subtle glow filter */}
            <filter id="beaconGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
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
              <g key={score} className="pointer-events-none">
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#292524"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#78716c"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {score}%
                </text>
              </g>
            );
          })}

          {/* Shaded Area for Average Line */}
          <path d={averageAreaD} fill="url(#averageAreaGrad)" className="pointer-events-none" />

          {/* Line 1: Average Admitted Candidate Journey */}
          <path
            d={averagePathD}
            fill="none"
            stroke="url(#averageLineGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none"
          />

          {/* Line 2A: Aspiring Student Historical / Current Solid Line */}
          <path
            d={aspirantSolidPathD}
            fill="none"
            stroke="url(#aspirantLineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none"
          />

          {/* Line 2B: Aspiring Student Projected Tentative Dashed Path */}
          <path
            d={aspirantProjectedPathD}
            fill="none"
            stroke="#a8a29e"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none"
          />

          {/* Vertical Gap Connector Line between Student Blinking Dot and Average Line */}
          <line
            x1={currentX}
            y1={currentY}
            x2={currentX}
            y2={avgCurrentY}
            stroke="#d97706"
            strokeWidth="2"
            strokeDasharray="4 3"
            className="pointer-events-none"
          />

          {/* Gap Delta Callout Tag on Chart */}
          <g
            transform={`translate(${currentX + 10}, ${(currentY + avgCurrentY) / 2})`}
            className="pointer-events-none"
          >
            <rect
              x="-4"
              y="-12"
              width="84"
              height="22"
              rx="4"
              fill="#292524"
              stroke="#d97706"
              strokeWidth="1"
            />
            <text x="38" y="2" textAnchor="middle" fill="#fef3c7" fontSize="10" fontFamily="monospace" fontWeight="bold">
              Δ -{currentGap} pts Gap
            </text>
          </g>

          {/* Milestone Hover Guideline */}
          {activeInspectorPoint && (
            <line
              x1={getX(points.findIndex((p) => p.id === activeInspectorPoint.id))}
              y1={padding.top}
              x2={getX(points.findIndex((p) => p.id === activeInspectorPoint.id))}
              y2={padding.top + graphHeight}
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.7"
              className="pointer-events-none"
            />
          )}

          {/* Average Line Milestone Dots (Visual) */}
          {points.map((pt, idx) => {
            const x = getX(idx);
            const y = getY(pt.averageScore);
            const isHovered = activeInspectorPoint?.id === pt.id;
            return (
              <g key={`avg-pt-${idx}`} className="pointer-events-none">
                {isHovered && (
                  <circle
                    cx={x}
                    cy={y}
                    r={9}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth={2}
                    opacity={0.65}
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  fill="#10b981"
                  stroke="#064e3b"
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  className="transition-all duration-150"
                />
              </g>
            );
          })}

          {/* Student Line Milestone Dots (Visual) */}
          {points.map((pt, idx) => {
            const x = getX(idx);
            const y = getY(pt.aspirantScore);
            const isCurrent = idx === currentGradeIndex;
            const isPast = idx < currentGradeIndex;
            const isHovered = activeInspectorPoint?.id === pt.id;

            if (isCurrent) return null; // Rendered as special beacon below

            return (
              <g key={`asp-pt-${idx}`} className="pointer-events-none">
                {isHovered && (
                  <circle
                    cx={x}
                    cy={y}
                    r={9}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    opacity={0.65}
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : isPast ? 4 : 3.5}
                  fill={isPast ? '#ffffff' : '#1c1917'}
                  stroke={isHovered ? '#f59e0b' : '#a8a29e'}
                  strokeWidth={isHovered ? 2.5 : isPast ? 2 : 1.5}
                  strokeDasharray={isPast ? 'none' : '2 2'}
                  className="transition-all duration-150"
                />
              </g>
            );
          })}

          {/* THE BLINKING BEACON (Current Student Position Visual) */}
          <g transform={`translate(${currentX}, ${currentY})`} className="pointer-events-none">
            {/* Outer Pulsing Glow Wave */}
            <circle
              cx="0"
              cy="0"
              r="16"
              fill="none"
              stroke="#d97706"
              strokeWidth="1.5"
              opacity="0.5"
              className="animate-ping"
            />
            {/* Second Pulsing Ring */}
            <circle
              cx="0"
              cy="0"
              r="10"
              fill="#d97706"
              opacity="0.25"
              className="animate-pulse"
            />
            {/* Core Beacon Dot */}
            <circle
              cx="0"
              cy="0"
              r="6"
              fill="#ffffff"
              stroke="#d97706"
              strokeWidth="3"
              filter="url(#beaconGlow)"
            />

            {/* "You Are Here" Floating Tag */}
            <g transform="translate(0, -20)">
              <rect
                x="-48"
                y="-13"
                width="96"
                height="18"
                rx="4"
                fill="#1c1917"
                stroke="#d97706"
                strokeWidth="1"
              />
              <text
                x="0"
                y="0"
                textAnchor="middle"
                fill="#fef3c7"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="0.5"
              >
                YOU ARE HERE
              </text>
            </g>
          </g>

          {/* X-axis Semester Labels (Visual) */}
          {points.map((pt, idx) => {
            const x = getX(idx);
            const isCurrent = idx === currentGradeIndex;
            const isHovered = activeInspectorPoint?.id === pt.id;

            return (
              <g key={pt.semester} className="pointer-events-none">
                <text
                  x={x}
                  y={height - 24}
                  textAnchor="middle"
                  fill={isHovered ? '#fbbf24' : isCurrent ? '#ffffff' : '#a8a29e'}
                  fontSize={isCurrent || isHovered ? '11' : '10'}
                  fontWeight={isCurrent || isHovered ? 'bold' : 'normal'}
                  fontFamily="monospace"
                >
                  {pt.semester}
                </text>
                <text
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  fill="#78716c"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {pt.grade.replace('Grade ', 'G')}
                </text>
              </g>
            );
          })}

          {/* DEDICATED INVISIBLE HOVER HITBOXES & POINTER TARGETS (Rock-Solid Stability) */}
          {points.map((pt, idx) => {
            const x = getX(idx);
            const avgY = getY(pt.averageScore);
            const aspY = getY(pt.aspirantScore);

            return (
              <g
                key={`hitbox-${pt.id}`}
                className="cursor-pointer"
                onMouseEnter={() => handlePointMouseEnter(pt)}
                onMouseLeave={handlePointMouseLeave}
                onClick={() => handlePointClick(pt)}
              >
                {/* Generous vertical column hitbox with pointer-events: all */}
                <rect
                  x={x - graphWidth / (points.length * 2)}
                  y={padding.top}
                  width={graphWidth / points.length}
                  height={graphHeight + 30}
                  fill="transparent"
                  style={{ pointerEvents: 'all' }}
                />
                {/* Direct circular pointer targets over average and aspirant dots */}
                <circle
                  cx={x}
                  cy={avgY}
                  r={20}
                  fill="transparent"
                  style={{ pointerEvents: 'all' }}
                />
                <circle
                  cx={x}
                  cy={aspY}
                  r={20}
                  fill="transparent"
                  style={{ pointerEvents: 'all' }}
                />
              </g>
            );
          })}
        </svg>

        {/* Stable Details Modal (Active on hover or locked selection only) */}
        {activeInspectorPoint ? (
          <div className="absolute top-4 right-4 bg-stone-900/95 backdrop-blur-md p-3.5 rounded-lg border border-amber-500/40 text-stone-100 text-xs max-w-xs shadow-2xl pointer-events-none transition-all duration-150">
            <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-stone-800">
              <span className="font-mono font-bold text-amber-400">
                {activeInspectorPoint.semester} ({activeInspectorPoint.grade})
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-800 text-stone-300">
                {selectedPoint?.id === activeInspectorPoint.id
                  ? 'Locked Pin'
                  : activeInspectorPoint.isProjected
                  ? 'Projected Step'
                  : 'Current Stage'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-2">
              <div className="text-emerald-400">
                <span className="text-stone-400 block text-[10px]">Admitted Avg:</span>
                <span className="font-bold">{activeInspectorPoint.averageScore}%</span>
              </div>
              <div className="text-stone-200">
                <span className="text-stone-400 block text-[10px]">{studentName}:</span>
                <span className="font-bold">{activeInspectorPoint.aspirantScore}%</span>
              </div>
            </div>

            <div className="pt-1 border-t border-stone-800 text-[11px] text-stone-300 leading-snug">
              <strong className="text-amber-300">• Benchmark: </strong>
              {activeInspectorPoint.benchmarkMilestone}
            </div>
            <div className="pt-1 text-[10px] text-stone-400 leading-snug">
              <strong className="text-stone-300">• Suggested Action: </strong>
              {activeInspectorPoint.suggestedAction}
            </div>
          </div>
        ) : (
          <div className="absolute top-4 right-4 bg-stone-900/50 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-stone-800/80 text-[11px] font-mono text-stone-400 pointer-events-none">
            Hover over any milestone pointer to inspect benchmark criteria
          </div>
        )}
      </div>

      {/* Trajectory Key Insight Cards (Clean Editorial Whitepaper Memo) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
        <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200 space-y-1">
          <div className="font-semibold text-stone-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Foundation Phase (G9)</span>
          </div>
          <p className="text-stone-600 text-[11px] leading-relaxed">
            Admitted candidates establish an unshakeable GPA rigor baseline early (3.95+ unweighted) and start foundational Olympiad and contest benchmarking.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200 space-y-1">
          <div className="font-semibold text-stone-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-stone-700" />
            <span>Inflection Point (G10–G11)</span>
          </div>
          <p className="text-stone-600 text-[11px] leading-relaxed">
            Where trajectories diverge: top admits transition from school club members to faculty lab apprentices, producing their first independent preprints.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200 space-y-1">
          <div className="font-semibold text-stone-900 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-amber-700" />
            <span>Target Zone (G12)</span>
          </div>
          <p className="text-stone-600 text-[11px] leading-relaxed">
            Executing the phased supercurricular blueprint closes the current {currentGap} pt deficit to reach the 90%+ readiness threshold for {targetRankTier}.
          </p>
        </div>
      </div>
    </div>
  );
};
