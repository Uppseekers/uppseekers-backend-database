# Harmonizing Admissions Readiness Trajectory & Spider/Radar Competency Diagnostics

Synchronize the Admissions Readiness 2-Line Trajectory Chart with the Spider & Radar Competency Comparison by unifying their mathematical foundation, passing direct 6-dimensional scores into the radar canvas, and dynamically scaling trajectory benchmarks across country systems and university tier standards.

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural and algorithmic decisions below were clarified and confirmed to guarantee 100% mathematical and visual alignment between the Trajectory Chart and the Spider/Radar Comparison.

- **Confirmed Decision 1: Trajectory Baseline Readiness Calculation**:
  Calculate the candidate's baseline trajectory score as the **country-weighted composite score** across the 6 competency dimensions (Problem Solving, Technical Skills, Critical Thinking, Team Work, Communication, and Creativity), weighted by the destination country's empirical admissions pillars.
- **Confirmed Decision 2: Spider & Radar Direct Data Injection**:
  Pass exact, dynamically calculated 6-dimensional scores (candidate achieved points and benchmark requirements) directly into the radar canvas, bypassing heuristic text re-evaluations to ensure the radar coordinates, dimensional gap table, and trajectory baseline numbers match down to the exact point.
- **Confirmed Decision 3: Tier & Country Dynamic Trajectory Benchmarks**:
  Dynamically scale the 2-Line Trajectory benchmark curve using country-specific admissions pace (e.g. earlier technical specialization in the UK/Singapore vs holistic crescendo in the US/Canada) combined with the University Tier Standard (Top 5, Top 10, Top 25, Top 50, Top 100).

---

## 1. Overview & Core Concept

- **What It Does**: Unifies the diagnostic evaluation pipeline in the Candidate Gap Analyzer and Roadmap. When a user selects a destination country (e.g., Singapore, UK, US, Canada, Germany) or switches university tiers (e.g., Top 5 vs Top 100), the 6-Dimensional Competency values, the Spider & Radar polygon vertices, and the 2-Line Trajectory Chart update in lockstep with zero numerical discrepancies.
- **Target Audience / Persona**: High school students, academic counselors, and parents planning multi-year admissions pathways across global university systems.
- **Key Value**: Eliminates user confusion caused by diverging scores across different visual charts. An aspirant with an evaluated score of 72 points will see that exact rating reflected across the radar polygon, the competency table, and the starting coordinate of their multi-year trajectory line.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Country & Tier Standard Selection**: The user selects or changes their Target Country (e.g. Singapore) or University Tier (e.g. Top 10) in the Roadmap header or Country Gap Analyzer.
2. **Unified Real-Time Recalibration**:
   - The **Spider & Radar Competency Comparison** re-renders its candidate polygon and benchmark polygon using the exact 6-dimensional points calibrated for that country and tier.
   - The adjacent **Competency Dimensional Score Gaps** table reflects those exact points with deficit/surplus indicators.
   - The **Admissions Readiness 2-Line Trajectory Chart** updates its starting milestone (`baselineReadiness`), beacon pin, and multi-year benchmark trajectory line (`averageScore`) according to the selected country's weighting and tier expectations.
3. **Milestone Completion Tracking**: When supercurricular blueprint items are completed or toggled, the point bonuses immediately flow into both the Radar polygon and the Trajectory starting line.

### Visual Identity & Theme
- **Aesthetic Direction**: Academic precision and editorial whitepaper clarity, aligned with the Education & Simulation design principles (clean neutral canvas, tabular numerals, high legibility).
- **Color Palette & Mood**:
  - Dominant Canvas: Clean stone/slate surface (`bg-white` / `bg-stone-50`).
  - Candidate Polygon & Trace: Deep ink stone (`#1c1917` / `text-stone-900`).
  - Benchmark Polygon & Curve: Emerald standard (`#059669` / `text-emerald-700`).
  - Trajectory Target Beacon: Coral / Amber pulse (`#d97706` / `#dc2626`).
- **Typography & Hierarchy**: Serif section headers (`font-serif font-bold text-stone-900`), clean sans body (`font-sans text-stone-600`), and tabular figures (`font-mono tabular-nums`) for all scores, benchmarks, and deltas.
- **Component Styling & Layout**: Zero-pill metadata discipline, crisp hairline borders (`border-stone-200`), explicit labels, and balanced dual-column layout.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Country-Weighted Composite Readiness Score vs Simple Mean
- **Chosen Approach**: Weight the 6 dimensions according to the country's admissions formula (e.g., Singapore: Academics 75%, Testing 15%, Supercurriculars 8%, Leadership 2%, mapped to the 6 dimensions) to compute `baselineReadiness`.
- **Why**: Different destination countries prioritize different competencies. A candidate with world-class olympiad problem solving has higher baseline readiness in Singapore/UK than in holistic US admissions.
- **Trade-Off**: Slightly more complex formula than an unweighted average, but provides authentic admissions modeling.

### Decision 2: Direct 6-Dimensional Points Injection into SpiderChart
- **Chosen Approach**: Extend `SpiderChart` to accept explicit `customEvaluations` or `directScores` (e.g. `Record<DimensionKey, number>`), falling back to `evaluateStudent(profile)` only when direct scores are omitted.
- **Why**: Eliminates the mismatch where `BackEngineeredRoadmapView` computed dynamic tier/country points (e.g. 78, 65, 82) but `SpiderChart` recalculated divergent scores (e.g. 52, 60, 58) from student text strings.
- **Trade-Off**: Requires updating `SpiderChartProps` to support both direct evaluation profiles and raw student profiles.

### Decision 3: Country-Calibrated Trajectory Benchmark Curves
- **Chosen Approach**: Modify `getFieldSpecificMilestones` in `TrajectoryTwoLineChart` to factor in `targetCountry` alongside `targetRankTier`. Countries like the UK require higher early academic/subject competency (steeper initial slope), whereas the US requires sustained extracurricular spikes through Grade 11/12.
- **Why**: Guarantees that the trajectory benchmark line matches the country's expectations and stays mathematically consistent with the radar benchmark polygon.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                      BackEngineeredRoadmapView                         │
│                                                                        │
│  State: target (tier, country), baseline, completedMilestoneIds        │
│                                                                        │
│  Unified Scoring Engine:                                               │
│  ├── getCountryDimensionalRequirements(country, tier, field)           │
│  │   └── Returns: benchmarkScores { problemSolving, tech, ... }       │
│  ├── calculateCandidateAchievedPoints(country, tier, baseline, items)  │
│  │   └── Returns: candidateScores { problemSolving, tech, ... }        │
│  └── calculateCountryWeightedComposite(country, scores)                │
│      └── Returns: compositeReadiness (0 - 100)                         │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
           ┌─────────────────────────┴────────────────────────┐
           ▼                                                  ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│  Spider & Radar Competency Section   │  │  2-Line Trajectory Chart Component  │
│                                      │  │                                      │
│  SpiderChart                         │  │  TrajectoryTwoLineChart              │
│  ├── Direct candidate scores         │  │  ├── baselineReadiness               │
│  │   [78, 82, 65, 70, 75, 68]        │  │      (= composite candidate score)   │
│  └── Direct benchmark scores         │  │  ├── projectedReadiness              │
│      [88, 85, 80, 75, 80, 75]        │  │  ├── targetRankTier & targetCountry  │
│                                      │  │  └── Dynamic milestone avg curve     │
│  Gap Breakdown Table:                │  │      scaled by Country & Tier        │
│  └── Exact matching 6-D points       │  │                                      │
└──────────────────────────────────────┘  └──────────────────────────────────────┘
```

### Data Model & Synchronization Strategy

1. **New Unified Calculation Helper** (`src/utils/roadmapCalculations.ts` or within `countryCompetencyRequirements.ts`):
   - Computes country-weighted composite score from 6-dimensional points:
     $$\text{Composite} = \sum_{d \in \text{dims}} (\text{score}_d \times \text{weight}_d)$$
   - Computes projected readiness dynamically based on remaining milestones.

2. **SpiderChart Props Extension** (`src/components/SpiderChart.tsx`):
   - Add optional `directEvaluations?: { id: string; name: string; scores: Record<string, number>; colorIdx: number }[]`.
   - When provided, render vertices directly from `scores[dimKey]`, guaranteeing pixel-perfect alignment with the table and trajectory score.

3. **TrajectoryTwoLineChart Synchronization** (`src/components/roadmap/TrajectoryTwoLineChart.tsx`):
   - Add `targetCountry?: string` to `TrajectoryTwoLineChartProps`.
   - Calculate trajectory points using `targetCountry` pace curves and `targetRankTier` multipliers.
   - Synchronize the Grade milestone point corresponding to `currentGrade` with the candidate's exact composite readiness score.

4. **Integration in BackEngineeredRoadmapView** (`src/components/roadmap/BackEngineeredRoadmapView.tsx`):
   - Feed the same `candidateAchievedPoints` and `dimensionalRequirements` into both the `SpiderChart` and the `TrajectoryTwoLineChart`.
   - Provide seamless reactivity when the user changes country or tier in any section of the app.
