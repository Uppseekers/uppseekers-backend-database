import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Layers,
} from 'lucide-react';
import { GradeLevel, RankTier } from '../../types';

interface SupercurricularMilestoneItem {
  id: string;
  category: 'internship' | 'research' | 'competition' | 'certification' | 'award' | 'leadership';
  title: string;
  suggestedAction: string;
  impactLevel: 'Critical Anchor' | 'High-Impact Spike' | 'Core Differentiator';
  timeCommitment: string;
  admissionsRationale: string;
}

interface MilestonePhase {
  milestoneNumber: number;
  grade: GradeLevel;
  phaseTitle: string;
  objective: string;
  items: SupercurricularMilestoneItem[];
}

interface SupercurricularMilestonesViewProps {
  currentGrade: GradeLevel;
  targetRankTier: RankTier;
  targetUniversity?: string;
  targetCountry: string;
}

export const SupercurricularMilestonesView: React.FC<SupercurricularMilestonesViewProps> = ({
  currentGrade,
  targetRankTier,
  targetUniversity,
  targetCountry,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completedItemIds, setCompletedItemIds] = useState<Set<string>>(
    new Set(['g9-cert-1', 'g9-comp-1'])
  );

  const toggleItem = (id: string) => {
    setCompletedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const phases: MilestonePhase[] = [
    {
      milestoneNumber: 1,
      grade: 'Grade 9',
      phaseTitle: 'Foundation & Curiosity Discovery',
      objective:
        'Establish unshakeable academic baseline, build foundational technical & quantitative tools, and explore 2–3 genuine areas of intellectual curiosity.',
      items: [
        {
          id: 'g9-cert-1',
          category: 'certification',
          title: 'Foundational University MOOCs',
          suggestedAction:
            'Complete CS50x (Harvard Introduction to Computer Science), MITx 6.00.1x (Python), or advanced pre-calculus / linear algebra online courses.',
          impactLevel: 'Critical Anchor',
          timeCommitment: '3–5 hrs/week',
          admissionsRationale:
            'Demonstrates self-directed curiosity beyond school syllabus early on; provides prerequisite vocabulary for independent research.',
        },
        {
          id: 'g9-comp-1',
          category: 'competition',
          title: 'First-Round Olympiads & Contest Benchmarking',
          suggestedAction:
            'Participate in AMC 10 (target 85+ score), USACO Bronze division, local high school hackathons, or novice debate.',
          impactLevel: 'Core Differentiator',
          timeCommitment: '2–4 hrs/week',
          admissionsRationale:
            'Establishes objective contest benchmark. Starting in 9th grade provides multiple attempts to qualify for national rounds (AIME/Gold).',
        },
        {
          id: 'g9-intern-1',
          category: 'internship',
          title: 'Shadowing & Exploratory Project Lab',
          suggestedAction:
            'Shadow a local university graduate student, assist in a robotics club workshop, or complete structured laboratory safety courses.',
          impactLevel: 'Core Differentiator',
          timeCommitment: '2 hrs/week',
          admissionsRationale:
            'Provides real-world perspective on active scientific investigation and experimental pipelines.',
        },
        {
          id: 'g9-lead-1',
          category: 'leadership',
          title: 'Peer Mentorship & School Club Initiation',
          suggestedAction:
            'Organize an after-school coding circle or math enrichment group for middle school students in your district.',
          impactLevel: 'Core Differentiator',
          timeCommitment: '2 hrs/week',
          admissionsRationale:
            'Shows early inclination toward sharing knowledge and mobilizing peers.',
        },
      ],
    },
    {
      milestoneNumber: 2,
      grade: 'Grade 10',
      phaseTitle: 'Specialization & First Scholarly Artifact',
      objective:
        'Narrow down to 1–2 target academic spikes, compete at regional/national levels, and draft an independent inquiry paper.',
      items: [
        {
          id: 'g10-comp-1',
          category: 'competition',
          title: 'AIME Cutoff & USACO Silver → Gold Advancement',
          suggestedAction:
            'Target 100+ on AMC 10 to lock in AIME qualification; advance to USACO Gold; compete in State Science Olympiad or Wharton Investment Challenge.',
          impactLevel: 'Critical Anchor',
          timeCommitment: '6–8 hrs/week contest prep',
          admissionsRationale:
            'AIME or USACO Gold qualification is universally recognized by MIT, Stanford, and Cambridge as proof of top 2% quantitative ability.',
        },
        {
          id: 'g10-intern-1',
          category: 'internship',
          title: 'University Lab Outreach & Summer Apprenticeship',
          suggestedAction:
            'Reach out to university faculty with tailored inquiries referencing recent publications; secure an apprenticeship in an AI, genomics, or robotics lab.',
          impactLevel: 'High-Impact Spike',
          timeCommitment: 'Full-time 6–8 weeks in summer',
          admissionsRationale:
            'Mentorship under a university Principal Investigator provides credibility and experimental guidance for publication-grade work.',
        },
        {
          id: 'g10-research-1',
          category: 'research',
          title: 'Experimental Protocol & Initial Paper Draft',
          suggestedAction:
            'Under lab mentorship, run computational simulations, wet-lab assays, or econometric models; synthesize findings into a structured paper draft.',
          impactLevel: 'High-Impact Spike',
          timeCommitment: '8–10 hrs/week',
          admissionsRationale:
            'Demonstrates shift from passive learner to independent investigator producing original empirical data.',
        },
        {
          id: 'g10-cert-1',
          category: 'certification',
          title: 'Specialized Technical Certifications',
          suggestedAction:
            'Complete DeepLearning.AI Specialization, Stanford Online Algorithms, or professional CAD SolidWorks Associate certification.',
          impactLevel: 'Core Differentiator',
          timeCommitment: '3 hrs/week',
          admissionsRationale:
            'Formalizes advanced technical proficiency that can be directly applied to research codebases.',
        },
      ],
    },
    {
      milestoneNumber: 3,
      grade: 'Grade 11',
      phaseTitle: 'The Spike Year — Preprints & National Recognition',
      objective:
        'Deliver your core differentiator: publish/preprint original research, achieve national/state honors, and demonstrate community impact.',
      items: [
        {
          id: 'g11-research-1',
          category: 'research',
          title: 'Preprint Submission (arXiv / bioRxiv) & Science Fair',
          suggestedAction:
            'Finalize primary-author or first-co-author manuscript and submit to arXiv, bioRxiv, or a peer-reviewed high school journal; enter regional ISEF qualifying fair.',
          impactLevel: 'Critical Anchor',
          timeCommitment: '10–12 hrs/week',
          admissionsRationale:
            'A citable preprint or ISEF finalist credential is the single highest-weighted academic differentiator for Top 10 global universities.',
        },
        {
          id: 'g11-comp-1',
          category: 'competition',
          title: 'National Contest Honors (USAMO, USAPhO, Regeneron STS)',
          suggestedAction:
            'Score 7+ on AIME, qualify for USAPhO Semifinals, submit to Regeneron Science Talent Search, or place in National History Day / John Locke Essay.',
          impactLevel: 'Critical Anchor',
          timeCommitment: '8 hrs/week',
          admissionsRationale:
            'National contest honors validate that the student ranks in the 99th percentile against high-achieving peers nationwide.',
        },
        {
          id: 'g11-intern-1',
          category: 'internship',
          title: 'Selective Merit Summer Institute (RSI, Beaver Works, SSP)',
          suggestedAction:
            'Apply to RSI, MIT Beaver Works, SSP, SIMR, PROMYS, or LaunchX. Alternatively, conduct intensive software engineering at a tech startup.',
          impactLevel: 'High-Impact Spike',
          timeCommitment: 'Full-time 6–8 weeks in summer',
          admissionsRationale:
            'Admissions committees recognize hyper-selective summer institutes (acceptance rates < 5%) as an external gold standard.',
        },
        {
          id: 'g11-lead-1',
          category: 'leadership',
          title: 'Scaled Community Initiative & Real-World Deployment',
          suggestedAction:
            'Scale your project into an open-source tool with active users, organize a regional youth hackathon, or partner with a registered municipal non-profit.',
          impactLevel: 'High-Impact Spike',
          timeCommitment: '4–6 hrs/week',
          admissionsRationale:
            'Demonstrates leadership scale, teamwork, and societal impact required by US holistic admissions (MIT, Harvard, Stanford).',
        },
      ],
    },
    {
      milestoneNumber: 4,
      grade: 'Grade 12',
      phaseTitle: 'Synthesis, Recommendations & Dossier Packaging',
      objective:
        'Consolidate multi-year achievements into a cohesive narrative, secure recommendation letters, and execute tailored university applications.',
      items: [
        {
          id: 'g12-award-1',
          category: 'award',
          title: 'Culminating Awards & Senior Distinctions',
          suggestedAction:
            'Secure National Merit Semifinalist status, Congressional Award Gold Medal, or international research presentation invitations.',
          impactLevel: 'Critical Anchor',
          timeCommitment: 'Ongoing',
          admissionsRationale:
            'Validates consistent excellence through the final stages of the high school trajectory.',
        },
        {
          id: 'g12-research-1',
          category: 'research',
          title: 'Maker Portfolio & Technical Supplementary Briefing',
          suggestedAction:
            'Assemble SlideRoom Maker Portfolio (MIT/Stanford), GitHub technical repository documentation, or UCAS course-specific supercurricular bibliography.',
          impactLevel: 'Critical Anchor',
          timeCommitment: '5 hrs/week during application cycle',
          admissionsRationale:
            'Directly presents tangible artifacts (circuits, code, mathematical derivations) to faculty reviewers.',
        },
        {
          id: 'g12-lead-1',
          category: 'leadership',
          title: 'Faculty Recommendation Dossier Preparation',
          suggestedAction:
            'Prepare a detailed 2-page briefing document for your STEM teachers and research PI highlighting your intellectual growth and specific breakthroughs.',
          impactLevel: 'Critical Anchor',
          timeCommitment: '2 hrs/week',
          admissionsRationale:
            'Top recommendation letters quote specific technical breakthroughs and character moments directly from your briefing dossier.',
        },
      ],
    },
  ];

  const categories = [
    { id: 'all', label: 'All Activities' },
    { id: 'research', label: 'Research & Papers' },
    { id: 'competition', label: 'Competitions & Olympiads' },
    { id: 'internship', label: 'Internships & Labs' },
    { id: 'certification', label: 'Certifications' },
    { id: 'leadership', label: 'Leadership & Scale' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider mb-1">
            <span>Milestone-Wise Supercurricular Sequence</span>
            <span>·</span>
            <span>{targetCountry} · {targetRankTier}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Supercurricular Action Blueprint
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
            Phased action items across research, competitions, apprenticeships, and leadership designed to systematically bridge the trajectory gap for {targetUniversity || `${targetRankTier} universities`}.
          </p>
        </div>

        {/* Progress summary */}
        <div className="bg-stone-50 px-3.5 py-2 rounded-lg border border-stone-200 text-xs font-mono text-stone-700 flex items-center gap-2 shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{completedItemIds.size} of 15 Milestones Completed</span>
        </div>
      </div>

      {/* Category Filter Pills (Clean Segmented Tabs) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-stone-900 text-stone-100 border-stone-900 font-semibold'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Milestones Phases */}
      <div className="space-y-6">
        {phases.map((phase) => {
          const isCurrentPhase = currentGrade === phase.grade;
          const filteredItems = phase.items.filter(
            (item) => selectedCategory === 'all' || item.category === selectedCategory
          );

          if (filteredItems.length === 0) return null;

          return (
            <div
              key={phase.milestoneNumber}
              className={`rounded-xl border transition-all ${
                isCurrentPhase
                  ? 'bg-stone-50/70 border-stone-300 ring-1 ring-stone-300'
                  : 'bg-white border-stone-200'
              }`}
            >
              {/* Phase Header */}
              <div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                      isCurrentPhase
                        ? 'bg-stone-900 text-stone-100'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    M{phase.milestoneNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-stone-900 text-base">
                        {phase.phaseTitle}
                      </h4>
                      <span className="text-xs font-mono text-stone-500">
                        ({phase.grade}{isCurrentPhase ? ' · Current Year' : ''})
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                      {phase.objective}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-stone-400 shrink-0">
                  {filteredItems.length} Milestones
                </div>
              </div>

              {/* Items List (Direct Bullet-Point Takeaways) */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item) => {
                  const isDone = completedItemIds.has(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`rounded-lg p-4 border transition-all flex flex-col justify-between ${
                        isDone
                          ? 'bg-stone-50/90 border-stone-200 opacity-80'
                          : 'bg-white border-stone-200/90 hover:border-stone-400 shadow-2xs'
                      }`}
                    >
                      <div>
                        {/* Top Metadata */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                            <span>{item.category}</span>
                            <span>·</span>
                            <span className="font-semibold text-stone-800">{item.impactLevel}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleItem(item.id)}
                            className="text-stone-400 hover:text-stone-900 transition-colors cursor-pointer shrink-0"
                            title={isDone ? 'Mark as pending' : 'Mark as completed'}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Title & Suggested Action */}
                        <h5
                          className={`text-sm font-semibold text-stone-900 mb-1 ${
                            isDone ? 'line-through text-stone-500' : ''
                          }`}
                        >
                          {item.title}
                        </h5>
                        <p className="text-xs text-stone-600 leading-relaxed mb-3">
                          {item.suggestedAction}
                        </p>
                      </div>

                      {/* Footer Note: Admissions Rationale & Time */}
                      <div className="pt-2.5 border-t border-stone-100 space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-500">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>Commitment: {item.timeCommitment}</span>
                        </div>

                        <div className="p-2 rounded bg-stone-50/80 border border-stone-200 text-[11px] text-stone-700 leading-snug">
                          <strong className="text-stone-900 font-semibold">• Rationale: </strong>
                          {item.admissionsRationale}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
