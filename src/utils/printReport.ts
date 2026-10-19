/**
 * Admissions Intelligence Memo & Strategic Diagnostic Dossier Exporter.
 * Generates standalone, print-perfect HTML/PDF reports including the entire
 * diagnostic roadmap (Two-Line Trajectory, Radar Competency Gaps, Required Profile,
 * Supercurricular Blueprint, and Verified Evidence) while strictly omitting the
 * screen-specific Admissions Philosophy & Institutional Ethos module.
 */

import { AspiringStudentBaseline, AspiringStudentTarget, BackEngineeredPath } from '../types';
import { DetectedActivityEvidence } from './roadmapEngine';

export function triggerDossierPrint(onOpenPreview?: () => void): boolean {
  try {
    document.documentElement.classList.add('printing-active');

    if (onOpenPreview) {
      onOpenPreview();
    }

    try {
      window.print();
    } catch (printErr) {
      console.warn('Native window.print() failed in iframe environment:', printErr);
    }

    setTimeout(() => {
      document.documentElement.classList.remove('printing-active');
    }, 2000);

    return true;
  } catch (err) {
    console.warn('Print trigger error:', err);
    document.documentElement.classList.remove('printing-active');
    if (onOpenPreview) {
      onOpenPreview();
    }
    return false;
  }
}

export interface PrintableRequiredProfile {
  countryAdmissionModel?: string;
  academicBar?: string;
  testingBar?: string;
  supercurriculars?: {
    research?: string;
    competitions?: string;
    internships?: string;
    certifications?: string;
    leadership?: string;
  };
  executiveConclusion?: string;
}

export interface PrintableReportData {
  target: AspiringStudentTarget;
  baseline: AspiringStudentBaseline;
  pathData: BackEngineeredPath;
  detectedActivities: DetectedActivityEvidence[];
  requiredProfile?: PrintableRequiredProfile;
  reportTitle?: string;
  isGapAnalysisOnly?: boolean;
}

/**
 * Generates vector SVG markup for the 2-Line Trajectory Journey Chart
 */
function renderTrajectorySVG(pathData: BackEngineeredPath, target: AspiringStudentTarget): string {
  const width = 640;
  const height = 190;
  const pad = { top: 22, bottom: 28, left: 40, right: 30 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const semesters = ['G9 F', 'G9 S', 'G10 F', 'G10 S', 'G11 F', 'G11 S', 'G12 F', 'G12 S'];
  const rampFractions = [0.44, 0.51, 0.62, 0.72, 0.83, 0.91, 0.96, 1.0];
  const targetComposite = pathData.cohortBenchmarks.compositeScore || 85;

  const getX = (idx: number) => pad.left + (idx / 7) * plotW;
  const getY = (val: number) => pad.top + ((100 - Math.max(20, Math.min(100, val))) / 80) * plotH;

  const targetPoints = rampFractions.map((frac, i) => {
    const score = Math.round(targetComposite * frac);
    return { x: getX(i), y: getY(score), score };
  });

  const baseScore = Math.max(25, pathData.readinessScore || 45);
  const projScore = Math.max(baseScore, pathData.projectedReadinessScore || 75);
  const aspirantPoints = rampFractions.map((frac, i) => {
    const score = Math.round(baseScore + (projScore - baseScore) * (i / 7));
    return { x: getX(i), y: getY(score), score };
  });

  const targetPathD = targetPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const aspirantPathD = aspirantPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  return `
    <svg viewBox="0 0 ${width} ${height}" style="width: 100%; max-width: 640px; height: auto; display: block; margin: 0 auto; background: #0c0a09; border-radius: 8px; border: 1px solid #292524;">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#10b981" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <!-- Grid Lines -->
      ${[30, 50, 70, 90].map((sc) => {
        const y = getY(sc);
        return `
          <line x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}" stroke="#292524" stroke-dasharray="3 3" stroke-width="1" />
          <text x="${pad.left - 8}" y="${y + 3}" text-anchor="end" fill="#78716c" font-size="9" font-family="monospace">${sc}</text>
        `;
      }).join('')}
      <!-- Shaded Area under Target -->
      <polygon points="${pad.left},${height - pad.bottom} ${targetPoints.map((p) => `${p.x},${p.y}`).join(' ')} ${width - pad.right},${height - pad.bottom}" fill="url(#areaGrad)"/>
      <!-- Lines -->
      <path d="${targetPathD}" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>
      <path d="${aspirantPathD}" fill="none" stroke="#e7e5e4" stroke-width="2" stroke-dasharray="4 3" stroke-linecap="round"/>
      <!-- Dots & Semester Labels -->
      ${targetPoints.map((p, i) => `
        <circle cx="${p.x}" cy="${p.y}" r="3.5" fill="#10b981" stroke="#052e16" stroke-width="1.5" />
        <circle cx="${aspirantPoints[i].x}" cy="${aspirantPoints[i].y}" r="3" fill="#ffffff" stroke="#1c1917" stroke-width="1.5" />
        <text x="${p.x}" y="${height - pad.bottom + 16}" text-anchor="middle" fill="#a8a29e" font-size="9" font-family="monospace">${semesters[i]}</text>
      `).join('')}
      <!-- Legend in chart -->
      <circle cx="${width - 240}" cy="14" r="3.5" fill="#10b981" />
      <text x="${width - 232}" y="17" fill="#a7f3d0" font-size="9" font-family="monospace">${target.targetRankTier} Target Benchmark (${targetComposite} pts)</text>
      <circle cx="${width - 80}" cy="14" r="3.5" fill="#ffffff" />
      <text x="${width - 72}" y="17" fill="#e7e5e4" font-size="9" font-family="monospace">${target.studentName}</text>
    </svg>
  `;
}

/**
 * Generates vector SVG markup for the 6-Dimensional Radar Chart
 */
function renderRadarSVG(pathData: BackEngineeredPath, target: AspiringStudentTarget): string {
  const size = 320;
  const cx = 160;
  const cy = 160;
  const R = 95;

  const dims = [
    { key: 'problemSolving', label: 'Problem Solving' },
    { key: 'technicalSkills', label: 'Tech Skills' },
    { key: 'criticalThinking', label: 'Critical Think' },
    { key: 'teamWork', label: 'Team Work' },
    { key: 'communication', label: 'Comm' },
    { key: 'creativity', label: 'Creativity' },
  ];

  const getCoord = (idx: number, score: number) => {
    const angle = (idx * 2 * Math.PI) / 6 - Math.PI / 2;
    const r = (Math.max(15, Math.min(100, score)) / 100) * R;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const getLabelCoord = (idx: number) => {
    const angle = (idx * 2 * Math.PI) / 6 - Math.PI / 2;
    const r = R + 18;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      anchor: Math.abs(Math.cos(angle)) < 0.2 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end',
    };
  };

  const targetCoords = dims.map((d, i) => getCoord(i, (pathData.cohortBenchmarks as any)[d.key] || 85));
  const candidateCoords = dims.map((d, i) => getCoord(i, (pathData.aspirantScores as any)[d.key] || 60));

  const targetPointsStr = targetCoords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const candidatePointsStr = candidateCoords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');

  return `
    <svg viewBox="0 0 ${size} ${size}" style="width: 100%; max-width: 320px; height: auto; display: block; margin: 0 auto;">
      <!-- Web rings -->
      ${[20, 40, 60, 80, 100].map((ring) => {
        const ringPoints = dims.map((_, i) => getCoord(i, ring)).map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
        return `
          <polygon points="${ringPoints}" fill="none" stroke="#e7e5e4" stroke-width="0.8" />
          <text x="${cx + 3}" y="${cy - (ring / 100) * R + 3}" fill="#a8a29e" font-size="7" font-family="monospace">${ring}</text>
        `;
      }).join('')}
      <!-- Axis Lines -->
      ${dims.map((_, i) => {
        const c = getCoord(i, 100);
        return `<line x1="${cx}" y1="${cy}" x2="${c.x.toFixed(1)}" y2="${c.y.toFixed(1)}" stroke="#e7e5e4" stroke-width="1" />`;
      }).join('')}
      <!-- Benchmark Polygon -->
      <polygon points="${targetPointsStr}" fill="rgba(16, 185, 129, 0.22)" stroke="#10b981" stroke-width="2" />
      ${targetCoords.map((c) => `<circle cx="${c.x}" cy="${c.y}" r="3" fill="#10b981" />`).join('')}
      <!-- Candidate Polygon -->
      <polygon points="${candidatePointsStr}" fill="rgba(28, 25, 23, 0.22)" stroke="#1c1917" stroke-width="2" stroke-dasharray="3 2" />
      ${candidateCoords.map((c) => `<circle cx="${c.x}" cy="${c.y}" r="3" fill="#1c1917" />`).join('')}
      <!-- Labels -->
      ${dims.map((d, i) => {
        const lc = getLabelCoord(i);
        return `<text x="${lc.x.toFixed(1)}" y="${lc.y.toFixed(1)}" text-anchor="${lc.anchor}" fill="#292524" font-size="8.5" font-family="sans-serif" font-weight="600">${d.label}</text>`;
      }).join('')}
    </svg>
  `;
}

export function generatePrintableDossierHTML(data: PrintableReportData): string {
  const { target, baseline, pathData, detectedActivities, requiredProfile, isGapAnalysisOnly } = data;

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const gaps = [
    { label: 'Problem Solving', current: pathData.aspirantScores.problemSolving, target: pathData.cohortBenchmarks.problemSolving, desc: 'Olympiad contests, advanced mathematical modeling, algorithmic logic' },
    { label: 'Technical Skills', current: pathData.aspirantScores.technicalSkills, target: pathData.cohortBenchmarks.technicalSkills, desc: 'Applied engineering, programming, hardware builds, laboratory assays' },
    { label: 'Critical Thinking', current: pathData.aspirantScores.criticalThinking, target: pathData.cohortBenchmarks.criticalThinking, desc: 'Independent scholarly inquiry, analytical literature critique, scientific writing' },
    { label: 'Team Work', current: pathData.aspirantScores.teamWork, target: pathData.cohortBenchmarks.teamWork, desc: 'Team robotics, hackathon collaboration, laboratory co-investigation' },
    { label: 'Communication', current: pathData.aspirantScores.communication, target: pathData.cohortBenchmarks.communication, desc: 'Debate, conference presentations, essay synthesis, thesis defenses' },
    { label: 'Creativity', current: pathData.aspirantScores.creativity, target: pathData.cohortBenchmarks.creativity, desc: 'Novel invention, open-source deployment, community venture creation' },
  ].map((d) => ({
    ...d,
    gap: d.target - d.current,
  }));

  const totalGap = Math.max(0, (pathData.cohortBenchmarks.totalPoints || 0) - (pathData.aspirantScores.totalPoints || 0));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${target.studentName} — Admissions Intelligence Diagnostic Dossier</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 12mm 12mm 12mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1c1917;
      background: #ffffff;
      line-height: 1.45;
      font-size: 9.5pt;
      margin: 0;
      padding: 20px;
    }
    .header {
      border-bottom: 2px solid #e7e5e4;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .badge {
      display: inline-block;
      font-size: 8pt;
      font-family: monospace;
      text-transform: uppercase;
      background: #f5f5f4;
      color: #44403c;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #d6d3d1;
    }
    .badge-amber {
      background: #fefce8;
      color: #713f12;
      border-color: #fef08a;
    }
    h1 {
      font-size: 19pt;
      margin: 6px 0 3px 0;
      color: #0c0a09;
      font-family: Georgia, serif;
      letter-spacing: -0.3px;
    }
    .meta-subtitle {
      font-size: 9pt;
      color: #57534e;
      line-height: 1.4;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }
    .card {
      border: 1px solid #e7e5e4;
      border-radius: 8px;
      padding: 10px 12px;
      background: #fafaf9;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .card-title {
      font-size: 7.5pt;
      text-transform: uppercase;
      font-family: monospace;
      color: #78716c;
      margin-bottom: 2px;
    }
    .card-value {
      font-size: 13pt;
      font-weight: bold;
      color: #1c1917;
      font-family: monospace;
    }
    .card-sub {
      font-size: 7.5pt;
      color: #78716c;
      margin-top: 2px;
    }
    .section-title {
      font-size: 10.5pt;
      font-weight: bold;
      margin: 18px 0 8px 0;
      color: #0c0a09;
      border-bottom: 1.5px solid #e7e5e4;
      padding-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      break-after: avoid;
      page-break-after: avoid;
    }
    .section-desc {
      font-size: 8.5pt;
      color: #57534e;
      margin: 0 0 10px 0;
    }
    .memo-box {
      background: #fafaf9;
      border: 1px solid #e7e5e4;
      border-radius: 8px;
      padding: 12px 14px;
      margin: 10px 0 16px 0;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .memo-box strong {
      color: #0c0a09;
    }
    .bullet-row {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      margin-bottom: 6px;
      font-size: 9pt;
    }
    .bullet-dot {
      color: #a8a29e;
      font-size: 10pt;
      line-height: 1;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 14px 0;
      font-size: 8.5pt;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #e7e5e4;
      padding: 6px 9px;
      text-align: left;
    }
    th {
      background: #f5f5f4;
      font-family: monospace;
      font-size: 7.5pt;
      text-transform: uppercase;
      color: #44403c;
    }
    .gap-positive {
      color: #b91c1c;
      font-weight: bold;
      font-family: monospace;
    }
    .gap-zero {
      color: #15803d;
      font-weight: bold;
      font-family: monospace;
    }
    .chart-container-flex {
      display: flex;
      flex-direction: row;
      gap: 16px;
      align-items: center;
      margin-bottom: 12px;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .milestone-item {
      border: 1px solid #e7e5e4;
      border-radius: 6px;
      padding: 8px 10px;
      margin-bottom: 8px;
      background: #fafaf9;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .milestone-header {
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      margin-bottom: 3px;
    }
    .milestone-title {
      font-size: 9pt;
      font-weight: bold;
      color: #1c1917;
      margin-bottom: 2px;
    }
    .milestone-body {
      font-size: 8.5pt;
      color: #44403c;
      margin-bottom: 3px;
    }
    .milestone-rationale {
      font-size: 8pt;
      color: #047857;
      background: #ecfdf5;
      padding: 4px 6px;
      border-radius: 4px;
      border: 1px solid #d1fae5;
    }
    .verified-pill {
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 7.5pt;
      font-family: monospace;
      display: inline-block;
      margin-top: 3px;
    }
    .footer {
      margin-top: 24px;
      border-top: 1px solid #e7e5e4;
      padding-top: 8px;
      font-size: 8pt;
      color: #a8a29e;
      text-align: center;
      font-family: monospace;
    }
    @media screen {
      .print-btn-bar {
        position: fixed;
        bottom: 18px;
        right: 18px;
        background: #0c0a09;
        color: #f5f5f4;
        padding: 11px 20px;
        border-radius: 10px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.3);
        cursor: pointer;
        font-weight: 600;
        font-size: 11pt;
        border: 1px solid #44403c;
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 9999;
      }
      .print-btn-bar:hover {
        background: #292524;
      }
    }
    @media print {
      .print-btn-bar { display: none !important; }
      body { padding: 0 !important; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
      <span class="badge">Admissions Intelligence Memo · ${target.targetCountry}</span>
      <span style="font-size: 8.5pt; color: #78716c; font-family: monospace;">${currentDate}</span>
    </div>
    <h1>${target.studentName} — Admissions Diagnostic Dossier & Roadmap</h1>
    <div class="meta-subtitle">
      <strong>Target:</strong> ${target.targetUniversity || `${target.targetCountry} Benchmark`} (${target.targetRankTier} Tier) &nbsp;·&nbsp;
      <strong>Discipline:</strong> ${target.targetField} &nbsp;·&nbsp;
      <strong>Current Grade:</strong> ${target.currentGrade} &nbsp;·&nbsp;
      <strong>Country Standard:</strong> ${target.targetCountry}
    </div>
  </div>

  <!-- Key Metrics Strip -->
  <div class="grid-4">
    <div class="card">
      <div class="card-title">Current Readiness</div>
      <div class="card-value">${pathData.readinessScore}%</div>
      <div class="card-sub">Baseline evaluated score</div>
    </div>
    <div class="card">
      <div class="card-title">Target Standard</div>
      <div class="card-value">${pathData.cohortBenchmarks.compositeScore} pts</div>
      <div class="card-sub">${pathData.cohortBenchmarks.totalPoints || 0} total benchmark pts</div>
    </div>
    <div class="card">
      <div class="card-title">Projected Trajectory</div>
      <div class="card-value" style="color: #059669;">${pathData.projectedReadinessScore}%</div>
      <div class="card-sub">+${pathData.projectedReadinessScore - pathData.readinessScore}% upon execution</div>
    </div>
    <div class="card">
      <div class="card-title">Verified Activities</div>
      <div class="card-value">${detectedActivities.length} Done</div>
      <div class="card-sub">Validated from dossier</div>
    </div>
  </div>

  <!-- SECTION 1: REQUIRED PROFILE & DIAGNOSTIC STANDARD MEMO -->
  <div class="section-title">
    <span>1. Diagnostic Standard Memo & Required Profile Thresholds</span>
    <span class="badge badge-amber">${target.targetRankTier} Standard</span>
  </div>
  <div class="memo-box">
    <div style="font-weight: bold; font-size: 10pt; margin-bottom: 8px; color: #0c0a09;">
      Required Profile Benchmark for ${target.targetUniversity || `${target.targetCountry} ${target.targetRankTier} Tier`}
    </div>
    
    <div class="bullet-row">
      <span class="bullet-dot">•</span>
      <div>
        <strong>Academic Rigor Baseline: </strong>
        <span>${requiredProfile?.academicBar || 'Top 1% class standing with highest available course rigor in target discipline.'}</span>
      </div>
    </div>

    <div class="bullet-row">
      <span class="bullet-dot">•</span>
      <div>
        <strong>Standardized Testing Target: </strong>
        <span>${requiredProfile?.testingBar || '99th percentile SAT/ACT or premier subject admissions assessment score.'}</span>
      </div>
    </div>

    <div class="bullet-row">
      <span class="bullet-dot">•</span>
      <div>
        <strong>Supercurricular Research Standard: </strong>
        <span>${requiredProfile?.supercurriculars?.research || 'Original empirical inquiry, co-authored paper, or state science fair award.'}</span>
      </div>
    </div>

    <div class="bullet-row">
      <span class="bullet-dot">•</span>
      <div>
        <strong>Competitions & Olympiads: </strong>
        <span>${requiredProfile?.supercurriculars?.competitions || 'National distinction in subject contests (AMC/AIME, BPhO, Waterloo, or Olympiad rounds).'}</span>
      </div>
    </div>

    <div class="bullet-row">
      <span class="bullet-dot">•</span>
      <div>
        <strong>Internships & Selective Programs: </strong>
        <span>${requiredProfile?.supercurriculars?.internships || 'Competitive merit program or direct university faculty lab apprenticeship.'}</span>
      </div>
    </div>

    <div class="bullet-row">
      <span class="bullet-dot">•</span>
      <div>
        <strong>Leadership & Community Scale: </strong>
        <span>${requiredProfile?.supercurriculars?.leadership || 'Regional multi-school federation or deployed artifact impacting 500+ users.'}</span>
      </div>
    </div>

    <div style="border-top: 1px solid #e7e5e4; padding-top: 8px; margin-top: 8px; font-size: 8.5pt; color: #44403c;">
      <strong>Admissions Committee Verdict: </strong>
      ${requiredProfile?.executiveConclusion || 'Admissions committees seek demonstrable angular depth and verifiable artifacts over passive well-roundedness.'}
    </div>
  </div>

  <!-- SECTION 2: 2-LINE TRAJECTORY JOURNEY (LINE CHART KEPT OVER AND ABOVE SPIDER CHART) -->
  <div class="section-title">
    <span>2. Trajectory Gap & Readiness Growth Model (Over 8 Semesters)</span>
    <span class="badge">${target.studentName} vs Benchmark</span>
  </div>
  <p class="section-desc">
    Calibrated growth curve comparing ${target.studentName}'s baseline journey against admitted students culminating at Grade 12 Spring (${pathData.cohortBenchmarks.compositeScore} pts).
  </p>

  <div style="margin-bottom: 12px;">
    ${renderTrajectorySVG(pathData, target)}
  </div>

  <!-- SECTION 3: SPIDER & RADAR COMPETENCY COMPARISON -->
  <div class="section-title">
    <span>3. Spider & Radar Competency Comparison & Dimensional Gaps</span>
    <span class="badge">${target.targetCountry} Admissions Logic</span>
  </div>
  <p class="section-desc">
    Exact 6-dimensional radar breakdown comparing candidate's evaluated strengths with the ${target.targetCountry} ${target.targetRankTier} benchmark.
  </p>

  <div class="chart-container-flex">
    <div style="flex: 1; text-align: center;">
      ${renderRadarSVG(pathData, target)}
    </div>
    <div style="flex: 1.4;">
      <table>
        <thead>
          <tr>
            <th>Competency Dimension</th>
            <th>Candidate</th>
            <th>Benchmark</th>
            <th>Deficit / Gap</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${gaps.map((d) => `
            <tr>
              <td><strong>${d.label}</strong><br><span style="font-size: 7.5pt; color: #78716c;">${d.desc}</span></td>
              <td>${d.current} pts</td>
              <td>${d.target} pts</td>
              <td class="${d.gap > 0 ? 'gap-positive' : 'gap-zero'}">${d.gap > 0 ? `-${d.gap} pts` : 'Target Met'}</td>
              <td>${d.gap <= 0 ? '✓ Ready' : d.gap <= 10 ? 'Moderate' : 'Priority Spike'}</td>
            </tr>
          `).join('')}
          <tr style="background: #fafaf9; font-weight: bold;">
            <td>Total Dimensional Points (Sum)</td>
            <td>${pathData.aspirantScores.totalPoints || 0} pts</td>
            <td>${pathData.cohortBenchmarks.totalPoints || 0} pts</td>
            <td class="${totalGap > 0 ? 'gap-positive' : 'gap-zero'}">-${totalGap} pts gap</td>
            <td>Strictly Harmonized</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- SECTION 4: PRIORITY DEFICITS & STRATEGIC REMEDIATION -->
  ${pathData.primaryGaps && pathData.primaryGaps.length > 0 ? `
  <div class="section-title">
    <span>4. Priority Competency Deficits & Targeted Action</span>
    <span class="badge" style="color: #b91c1c;">Top Focus Areas</span>
  </div>
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px;">
    ${pathData.primaryGaps.map((g) => `
      <div class="card" style="border-left: 3px solid #f59e0b;">
        <div style="font-weight: bold; font-size: 9pt; color: #1c1917; margin-bottom: 2px;">${g.area}</div>
        <div style="font-size: 8pt; color: #78716c; margin-bottom: 4px;">${g.gapDescription}</div>
        <div style="font-size: 8.5pt; color: #047857; background: #ecfdf5; padding: 4px 6px; border-radius: 4px; border: 1px solid #d1fae5;">
          <strong>Remedy: </strong>${g.recommendedRemedy}
        </div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- SECTION 5: SUPERCURRICULAR ACTION BLUEPRINT -->
  ${!isGapAnalysisOnly && pathData.milestones && pathData.milestones.length > 0 ? `
  <div class="section-title">
    <span>5. Supercurricular Action Blueprint (Grade 9 – Grade 12)</span>
    <span class="badge">${pathData.milestones.length} Strategic Milestones</span>
  </div>
  <p class="section-desc">
    Tactical roadmap back-engineered from peer admitted profiles in ${target.targetField} targeting ${target.targetRankTier} institutions.
  </p>

  <div style="margin-bottom: 16px;">
    ${pathData.milestones.map((m) => `
      <div class="milestone-item">
        <div class="milestone-header">
          <span style="font-weight: bold; font-family: monospace; color: #44403c;">${m.grade} (${m.quarter}) · ${m.category.toUpperCase()}</span>
          <span style="font-weight: bold; font-family: monospace; color: ${m.impactTier === 'Critical Must-Have' ? '#b91c1c' : '#047857'};">${m.impactTier} · ${m.timeCommitment}</span>
        </div>
        <div class="milestone-title">${m.title}</div>
        <div class="milestone-body">${m.description}</div>
        <div class="milestone-rationale">
          <strong>Admissions Officer Insight: </strong>${m.mentorInsight}
        </div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- SECTION 6: DOCUMENTED EVIDENCE & COMPLETED PROFILE MILESTONES -->
  ${detectedActivities && detectedActivities.length > 0 ? `
  <div class="section-title">
    <span>6. Documented Evidence & Verified Candidate Profile Milestones</span>
    <span class="badge" style="color: #047857;">${detectedActivities.length} Verified</span>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Milestone / Activity</th>
        <th style="width: 15%;">Category</th>
        <th style="width: 20%;">Dimension Boost</th>
        <th style="width: 40%;">Documented Evidence from Dossier</th>
      </tr>
    </thead>
    <tbody>
      ${detectedActivities.map((act) => `
        <tr>
          <td>
            <strong>${act.title}</strong><br>
            <span class="verified-pill">✓ Verified in Profile</span>
          </td>
          <td>${act.category}</td>
          <td>${act.dimension} (+${act.pointsBoost} pts)</td>
          <td style="font-size: 8pt; color: #44403c;">${act.evidenceSnippet}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  ` : ''}

  <!-- SECTION 7: ADMISSIONS COMMITTEE STRATEGIC TAKEAWAYS -->
  <div class="section-title">
    <span>7. Admissions Committee Strategic Takeaways</span>
    <span class="badge">Execution Mandates</span>
  </div>
  <div class="memo-box" style="background: #f8fafc; border-color: #cbd5e1;">
    <div class="bullet-row">
      <span class="bullet-dot">1.</span>
      <div>
        <strong>Differentiate Beyond Grades: </strong>
        <span>At ${target.targetRankTier} level, high test scores and near-perfect GPAs are table stakes. The true differentiator is demonstrable spike depth in ${target.targetField}.</span>
      </div>
    </div>
    <div class="bullet-row">
      <span class="bullet-dot">2.</span>
      <div>
        <strong>Execute First High-Leverage Artifact: </strong>
        <span>Shift immediate focus from accumulating passive certificates to creating a verifiable public artifact (e.g. peer-reviewed preprint, national olympiad medal, open-source deployment, or community initiative).</span>
      </div>
    </div>
    <div class="bullet-row">
      <span class="bullet-dot">3.</span>
      <div>
        <strong>Next 90-Day Execution Target: </strong>
        <span>Focus entirely on closing the primary deficit in <strong>${pathData.primaryGaps[0]?.area || 'Independent Scholarly Inquiry'}</strong>.</span>
      </div>
    </div>
  </div>

  <!-- Note: Admissions Philosophy & Institutional Ethos is intentionally omitted from this diagnostic export -->
  <div class="footer">
    UppSeekers Admissions Diagnostic Dossier · Confidential Academic Assessment · Generated for ${target.studentName}
  </div>

  <button class="print-btn-bar" onclick="window.print()">
    <span>🖨️ Print / Save as PDF</span>
  </button>
</body>
</html>`;
}

export function downloadDossierHTML(filename: string, htmlContent: string) {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 300);
}
