export interface SelectionPillar {
  pillar: string;
  description: string;
  evidenceNeeded: string;
  weighting: 'Critical Mandatory' | 'Core Differentiator' | 'Holistic Bonus';
}

export interface CountrySystemComparison {
  country: string;
  flag: string;
  systemName: string;
  philosophy: string;
  academicWeight: string;
  extracurricularWeight: string;
  testingWeight: string;
  personalStatementFocus: string;
  interviewStyle: string;
  fatalMistake: string;
  winningStrategy: string;
}

export interface UniversityVisionInfo {
  universityName: string;
  shortName: string;
  country: string;
  rank: number;
  badge: string;
  motto: string;
  mottoTranslation: string;
  visionStatement: string;
  coreSelectionPhilosophy: string;
  whyGreatProfilesFailHere: string;
  whatAdmissionsLooksFor: SelectionPillar[];
  countrySystemGuide: {
    systemName: string;
    evalFocus: string;
    commonRejectionTrap: string;
    winningStrategy: string;
  };
  multiCountryAdvice: string;
  actionableVisionAlignment: {
    researchTip: string;
    competitionsTip: string;
    projectsTip: string;
    essayTip: string;
  };
}

export const COUNTRY_SYSTEM_COMPARISONS: CountrySystemComparison[] = [
  {
    country: 'United States',
    flag: '🇺🇸',
    systemName: 'Holistic & Angular Spike Admissions',
    philosophy: 'Crafting a diverse, dynamic community of "angular" specialists rather than well-rounded generalists.',
    academicWeight: 'Threshold Factor (Top 1–3% class rank + high rigor is necessary but rarely sufficient alone)',
    extracurricularWeight: 'High (40–50% of decision) — values national/international impact, leadership scale, and personal spike',
    testingWeight: 'SAT/ACT (1530–1600 / 35–36) validates rigor; high test scores do not guarantee admission',
    personalStatementFocus: 'Introspective, voice-driven story demonstrating personal character, resilience, values, and community impact',
    interviewStyle: 'Conversational, alumni-led behavioral interview assessing maturity, social warmth, and institutional fit',
    fatalMistake: 'Having flawless 4.0/1600 stats with 10 generic school club memberships and zero verifiable real-world impact',
    winningStrategy: 'Build a distinct "Spike" (e.g. published machine learning paper + founded non-profit with 2,000 users) and show genuine empathy.',
  },
  {
    country: 'United Kingdom',
    flag: '🇬🇧',
    systemName: 'Supercurricular & Academic Mastery (UCAS)',
    philosophy: 'Selecting candidates purely for academic ability and potential to excel in a demanding, single-subject tutorial/supervision course.',
    academicWeight: 'Primary Factor (70–80% of decision) — requires flawless predicted grades (A*A*A* or IB 42–44)',
    extracurricularWeight: 'Zero Weight for unrelated activities (sports, drama, generic charity are completely disregarded unless subject-related)',
    testingWeight: 'Critical Admissions Tests (STEP, TMUA, MAT, ESAT, UCAT, LNAT) used as objective percentile filters',
    personalStatementFocus: '80%+ pure academic discussion of course literature, problem solving, lab inquiries, and seminar insights',
    interviewStyle: 'Rigorous academic tutorial: solving unseen university-level problems live with professors, accepting hints, thinking aloud',
    fatalMistake: 'Submitting a US-style essay praising your extracurricular leadership or community service; tutors want pure subject geekery',
    winningStrategy: 'Read 5+ academic books beyond the syllabus, master 200+ Olympiad/admissions test problems, and practice articulating logic out loud.',
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    systemName: 'Academic Rigor + Co-op Builder Capability',
    philosophy: 'High academic consistency combined with practical, industry-ready engineering and problem-solving execution.',
    academicWeight: 'Very High (60–70% of decision) — strict Grade 11 & 12 averages (94–98% for Waterloo CS / UofT Eng)',
    extracurricularWeight: 'Moderate (20–30%) — values Waterloo AIF (Admission Information Form), coding projects, and team competitions',
    testingWeight: 'Euclid Mathematics Contest and Canadian Computing Competition (CCC) carry immense weight for STEM',
    personalStatementFocus: 'Concise explanation of practical problem solving, technical self-learning, and collaborative team projects',
    interviewStyle: 'Recorded asynchronous video interview (Kira Talent) answering timed technical and situational prompts',
    fatalMistake: 'Relying on a 95% average while ignoring the Euclid or CCC contests when applying to Waterloo Computer Science or Engineering',
    winningStrategy: 'Maintain a 96%+ grade average and score in the top 10% on the Euclid/CCC contests with deployed code projects.',
  },
  {
    country: 'Singapore',
    flag: '🇸🇬',
    systemName: 'Meritocratic & Percentile-Driven Admissions',
    philosophy: 'Transparent, unapologetic academic meritocracy with direct entry pipelines for International Olympiad medalists.',
    academicWeight: 'Paramount (80%+ of decision) — published Indicative Grade Profiles (IGP) require near-perfect cutoffs (90 RP / IB 43+)',
    extracurricularWeight: 'Secondary unless national-level (Aptitude-Based Admissions looks for A*STAR research or national team selection)',
    testingWeight: 'Standardized tests (SAT 1550+, AP 5s, A-Levels) are strictly ranked against global applicant percentile tables',
    personalStatementFocus: 'Succinct articulation of research interests, technical achievements, and clear career aspirations in Asia/global markets',
    interviewStyle: 'Technical panel interview assessing fundamental subject knowledge, analytical aptitude, and ethics',
    fatalMistake: 'Applying with a strong holistic profile but academic scores below the strict published 10th percentile cutoff',
    winningStrategy: 'Lock in near-perfect exam marks first, then supplement with A*STAR institute research or national competition awards.',
  },
  {
    country: 'Europe / Switzerland',
    flag: '🇨🇭',
    systemName: 'Prerequisite Examination & Fundamental Science',
    philosophy: 'Rigorous entrance examinations and strict prerequisite mastery in core quantitative disciplines (ETH Zurich, TUM).',
    academicWeight: 'Absolute (90%+ of decision) — direct fulfillment of specific math/science curriculum requirements or entrance exam passing',
    extracurricularWeight: 'Negligible — European universities do not evaluate extracurriculars, hobbies, or community volunteer hours',
    testingWeight: 'Comprehensive written entrance examinations in Advanced Mathematics, Physics, Chemistry, and Biology',
    personalStatementFocus: 'Short motivation letter explaining specific alignment with degree curriculum and faculty research laboratories',
    interviewStyle: 'Rarely used; admissions is predominantly determined by documentary credentials and entrance exams',
    fatalMistake: 'Assuming a glowing recommendation letter or athletic record can compensate for lacking prerequisite calculus coursework',
    winningStrategy: 'Master advanced university-level mathematics (differential equations, linear algebra) and prepare intensely for entrance exams.',
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    systemName: 'ATAR Cutoff & Direct Grade Rank Entry',
    philosophy: 'Direct index entry based on standardized equivalent grade thresholds (ATAR) with clear published rank cutoffs.',
    academicWeight: 'Decisive (95%+ of decision) — hitting the guaranteed ATAR/IB score threshold guarantees an offer for most programs',
    extracurricularWeight: 'Virtually None — general admissions does not inspect extracurricular activities or personal essays',
    testingWeight: 'Prerequisite completion (e.g. Advanced Maths, Chemistry) verified directly from school transcripts',
    personalStatementFocus: 'Generally not required for standard undergraduate bachelor courses (except Medicine/Dentistry portfolios)',
    interviewStyle: 'Used exclusively for clinical medical/dental admissions (MMI - Multiple Mini Interviews)',
    fatalMistake: 'Failing to take an essential prerequisite high school subject (e.g. Higher Level Physics for Engineering)',
    winningStrategy: 'Focus 100% of preparation energy on maximizing final IB points or standardized GPA scores to clear the ATAR cutoff.',
  },
];

export const UNIVERSITY_VISIONS: Record<string, UniversityVisionInfo> = {
  'massachusetts institute of technology': {
    universityName: 'Massachusetts Institute of Technology (MIT)',
    shortName: 'MIT',
    country: 'United States',
    rank: 1,
    badge: 'QS Global #1 • Mens et Manus',
    motto: 'Mens et Manus',
    mottoTranslation: 'Mind and Hand',
    visionStatement:
      'To advance knowledge and educate students in science, technology, and other areas of scholarship that will best serve the nation and the world in the 21st century.',
    coreSelectionPhilosophy:
      'MIT does not seek well-rounded students; MIT seeks a well-rounded class composed of fiercely angular, hands-on problem solvers who translate theoretical brilliance into physical or digital reality.',
    whyGreatProfilesFailHere:
      'A student can have a 1600 SAT, 4.0 GPA, and 8 school club presidencies, but get rejected because they have never actually built anything independently. MIT rejects "resume polishers" who lack hands-on maker initiative or who exhibit lone-wolf intellectual arrogance.',
    whatAdmissionsLooksFor: [
      {
        pillar: 'Hands-on Tinkering & Making ("Manus")',
        description:
          'Proof that you do not just solve textbook problem sets, but physically or digitally build things—robotics, software packages, circuit boards, mechanical engines, or synthetic biology assays.',
        evidenceNeeded:
          'GitHub repositories with active commits, Maker Portfolio submissions via SlideRoom, FRC/FTC engineering notebooks, patents, or deployed hardware prototypes.',
        weighting: 'Critical Mandatory',
      },
      {
        pillar: 'Quantitative Fearlessness & Olympiads ("Mens")',
        description:
          'Absolute ease with advanced mathematics, calculus, and scientific modeling. A high SAT math score (790–800) is a baseline, not a differentiator.',
        evidenceNeeded:
          'AIME/USAMO qualification, USAPhO medals, Putnam prep, AMC 12 score 115+, AP Calculus BC and Physics C with 5s.',
        weighting: 'Critical Mandatory',
      },
      {
        pillar: 'Collaborative Altruism & Team Humility',
        description:
          'MIT culture revolves around p-sets (problem sets) done in collaborative groups. They strictly filter out arrogant lone geniuses in favor of students who lift their peers.',
        evidenceNeeded:
          'Mentoring younger cohorts, open-sourcing educational resources, team-based hackathons, peer tutoring in math and coding.',
        weighting: 'Core Differentiator',
      },
      {
        pillar: 'Intensity, Curiosity & Excitement',
        description:
          'The quality MIT calls "spark" — an infectious enthusiasm for taking things apart, exploring esoteric curiosities, and turning ideas into tangible reality.',
        evidenceNeeded:
          'Unusual self-directed passion projects (e.g. building a DIY fusion reactor, designing custom keyboard firmware, home laboratory chemistry).',
        weighting: 'Holistic Bonus',
      },
    ],
    countrySystemGuide: {
      systemName: 'United States Holistic & Angular Review',
      evalFocus: 'Angular Spike + Maker Portfolio + Collaborative Spirit',
      commonRejectionTrap:
        'Being a "well-rounded" straight-A student with generic club memberships and no singular extraordinary hands-on spike.',
      winningStrategy:
        'Cultivate a 99th-percentile spike in one technical discipline while demonstrating genuine collaboration and submitted maker artifacts.',
    },
    multiCountryAdvice:
      'If you are also applying to UK universities (Cambridge/Imperial), MIT loves the same deep technical and Olympiad rigor, but requires you to package it within a personal narrative showing personal reflection, teamwork, and community contribution.',
    actionableVisionAlignment: {
      researchTip:
        'Target applied research that results in code or physical artifacts; submit your technical paper to the MIT Maker Portfolio via SlideRoom.',
      competitionsTip:
        'Focus on team robotics (FRC/FTC) or algorithmic math/computing (AIME, USACO) where peer collaboration is evident.',
      projectsTip:
        'Create something physical or open-source: a custom PCB, an open-source library used by other developers, or an autonomous drone.',
      essayTip:
        'Highlight the messiness of failure: discuss how an experiment broke, what you learned debugging it at 2 AM, and how you collaborated with peers.',
    },
  },

  'stanford university': {
    universityName: 'Stanford University',
    shortName: 'Stanford',
    country: 'United States',
    rank: 3,
    badge: 'QS Global #3 • Silicon Valley Hub',
    motto: 'Die Luft der Freiheit weht',
    mottoTranslation: 'The wind of freedom blows',
    visionStatement:
      'To promote the public welfare by exercising an influence on behalf of humanity and civilization, offering a frontier of independent inquiry and entrepreneurial vitality.',
    coreSelectionPhilosophy:
      'Stanford seeks candidates with unmistakable "Intellectual Vitality"—students who pursue ideas with self-starting entrepreneurial urgency, creativity, and the audacity to disrupt status quos.',
    whyGreatProfilesFailHere:
      'Students with perfect grades and elite summer programs often get rejected because they appear "manufactured" by college consultants. Stanford penalizes conformist careerism; they want authentic rebels, creative visionaries, and self-starters.',
    whatAdmissionsLooksFor: [
      {
        pillar: 'Intellectual Vitality (Self-Directed Passion)',
        description:
          'Pursuing knowledge for the sheer joy of discovery, independent of grades, test scores, or parental/school pressure.',
        evidenceNeeded:
          'Independent research projects, obscure academic reading, personal blogs analyzing scientific papers, self-taught languages or frameworks.',
        weighting: 'Critical Mandatory',
      },
      {
        pillar: 'Audacious Entrepreneurship & Scaled Impact',
        description:
          'The Silicon Valley mindset: identifying a localized friction point, formulating an innovative solution, and mobilizing real users or funding.',
        evidenceNeeded:
          'Founded startups with active monthly users, 501(c)(3) nonprofits with verified community traction, Apple Swift Challenge winners, Congressional App Challenge.',
        weighting: 'Critical Mandatory',
      },
      {
        pillar: 'Personal Voice & Authentic Individuality',
        description:
          'Stanford’s infamous essay prompts ("What matters to you, and why?") test your self-awareness, philosophical grounding, and unconventional perspective.',
        evidenceNeeded:
          'Vulnerable, voice-driven personal statements that avoid admissions clichés and reflect genuine introspection.',
        weighting: 'Core Differentiator',
      },
    ],
    countrySystemGuide: {
      systemName: 'United States Holistic & Angular Review',
      evalFocus: 'Intellectual Vitality + Entrepreneurial Action + Voice',
      commonRejectionTrap:
        'Presenting a flawless but sterile resume that looks manufactured by college admissions consultants without distinctive personal spark.',
      winningStrategy:
        'Demonstrate authentic, self-initiated ventures where you created something from nothing and scaled it beyond your high school walls.',
    },
    multiCountryAdvice:
      'Stanford’s emphasis on entrepreneurship and multidisciplinary curiosity contrasts with the UK’s pure subject focus. Ensure your portfolio shows both deep subject mastery (for UK) and systemic, real-world execution (for Stanford).',
    actionableVisionAlignment: {
      researchTip:
        'Frame your research around societal impact: how does your algorithm or molecular discovery solve a real human bottleneck?',
      competitionsTip:
        'Combine technical competitions with entrepreneurial showcases (e.g. Conrad Challenge, Diamond Challenge, Wharton Investment).',
      projectsTip:
        'Deploy your product to real users: demonstrate active user metrics, GitHub stars, or letters of gratitude from community stakeholders.',
      essayTip:
        'Answer "What matters to you, and why?" with emotional sincerity. Connect your intellectual passions to your core moral compass.',
    },
  },

  'harvard university': {
    universityName: 'Harvard University',
    shortName: 'Harvard',
    country: 'United States',
    rank: 4,
    badge: 'QS Global #4 • Educating Citizen-Leaders',
    motto: 'Veritas',
    mottoTranslation: 'Truth',
    visionStatement:
      'To educate the citizens and citizen-leaders for our society, advancing the frontiers of human knowledge through intellectual transformative power.',
    coreSelectionPhilosophy:
      'Harvard looks for future global leaders and impactful citizens who will shape their fields, institutions, and communities over the next 50 years.',
    whyGreatProfilesFailHere:
      'Harvard rejects thousands of valedictorians with 1600 SATs because they lack personal warmth, civic leadership, and evidence that other people follow their vision. Raw grades without character and mobilization power are treated as a commodity.',
    whatAdmissionsLooksFor: [
      {
        pillar: 'Leadership & Institutional Impact',
        description:
          'Not just being the title-holder of a club, but enacting systemic institutional change—reforming policies, organizing regional conferences, or founding enduring initiatives.',
        evidenceNeeded:
          'Student Body President, youth representation on civic boards, national debate champions, founding registered NGOs with multi-school reach.',
        weighting: 'Critical Mandatory',
      },
      {
        pillar: 'Academic Excellence Across Breadth & Depth',
        description:
          'Uncompromising academic rigor with evidence of scholastic curiosity that extends into the humanities, sciences, and societal ethics.',
        evidenceNeeded:
          'Valedictorian/Top 1% rank, National Merit Scholars, Scholastic Art & Writing National Medals, published policy or scientific papers.',
        weighting: 'Critical Mandatory',
      },
      {
        pillar: 'Character, Empathy & Citizenship',
        description:
          'Evaluators look closely at teacher recommendations and alumni interviews for generosity of spirit, integrity, humor, and resilience in adversity.',
        evidenceNeeded:
          'Enthusiastic recommendation letters detailing specific instances where you championed a peer or resolved a school crisis.',
        weighting: 'Core Differentiator',
      },
    ],
    countrySystemGuide: {
      systemName: 'United States Holistic & Ivy League Review',
      evalFocus: 'Leadership Scale + Civic Character + Scholastic Excellence',
      commonRejectionTrap:
        'Having 1600 SAT and 4.0 GPA with only passive club memberships and no demonstrable record of influencing and mobilizing people.',
      winningStrategy:
        'Show an unmistakable leadership footprint where you mobilized people, secured resources, and left an enduring mark on a community or organization.',
    },
    multiCountryAdvice:
      'For applicants applying to both Harvard and Oxbridge: maintain pristine academic marks (for UK) while ensuring your extracurricular list has verifiable executive leadership and public policy / community resonance (for Harvard).',
    actionableVisionAlignment: {
      researchTip:
        'Publish or present research that touches on ethics, public policy, or public health; demonstrate how scholarship serves the common good.',
      competitionsTip:
        'Participate in national debate (NSDA), Model UN, or youth policymaking summits alongside STEM competitions.',
      projectsTip:
        'Build initiatives that empower underserved communities or mentor low-income students in advanced mathematics.',
      essayTip:
        'Reflect on how your worldview was challenged and how you brought conflicting groups together to solve a shared problem.',
    },
  },

  'university of oxford': {
    universityName: 'University of Oxford',
    shortName: 'Oxford',
    country: 'United Kingdom',
    rank: 2,
    badge: 'QS Global #2 • The Tutorial Tradition',
    motto: 'Dominus Illuminatio Mea',
    mottoTranslation: 'The Lord is my light',
    visionStatement:
      'The advancement of learning by teaching and research and its dissemination by every means, fostering independent intellectual debate of the highest caliber.',
    coreSelectionPhilosophy:
      'Oxford assesses one primary thing: Academic Ability and Potential for Subject-Specific Inquiry within the Tutorial System. Unrelated extracurriculars (sports, generic clubs, casual hobbies) play ZERO role in admissions decisions.',
    whyGreatProfilesFailHere:
      'Students with stellar US resumes packed with extracurriculars and non-profits get rejected immediately if their personal statement doesn’t discuss academic books, if their MAT/TMUA admissions score is mediocre, or if they fumble academic debate during interviews.',
    whatAdmissionsLooksFor: [
      {
        pillar: 'Supercurricular Depth (Subject Immersion)',
        description:
          'Reading university-level academic papers, primary sources, and seminal texts beyond the school syllabus within your chosen degree.',
        evidenceNeeded:
          'EPQ (Extended Project Qualification), reading university textbooks, attending academic public lectures, entering subject essay prizes (John Locke, Cambridge Essay).',
        weighting: 'Critical Mandatory',
      },
      {
        pillar: 'Admissions Test Performance',
        description:
          'High percentile performance on standardized subject tests designed to differentiate among straight-A students (e.g. MAT, TMUA, UCAT, LNAT, PAT, HAT).',
        evidenceNeeded:
          'High scores on university-administered aptitude tests (e.g., MAT 80+, TMUA 7.5+, UCAT 3000+ Band 1).',
        weighting: 'Critical Mandatory',
      },
      {
        pillar: 'Tutorial Aptitude & Academic Interview',
        description:
          'The ability to process unfamiliar problems in real time during the interview, accept tutor hints, defend arguments logically, and pivot without defensive ego.',
        evidenceNeeded:
          'Demonstrating intellectual flexibility, vocalizing thought processes, and deriving proofs from first principles.',
        weighting: 'Critical Mandatory',
      },
    ],
    countrySystemGuide: {
      systemName: 'United Kingdom Supercurricular System (UCAS)',
      evalFocus: '80% Subject-Specific Supercurriculars + 20% Academic Test/Grades',
      commonRejectionTrap:
        'Writing a personal statement stuffed with sports, volunteering, and leadership that has nothing to do with your academic degree.',
      winningStrategy:
        'Dedicate 85% of your personal statement to deep analysis of academic arguments, books, experiments, and admissions test preparation.',
    },
    multiCountryAdvice:
      'CRITICAL: If you have a US-style resume packed with sports and student council, DO NOT submit that to Oxford. Rewrite your profile to center exclusively on subject-matter supercurriculars—what you read, what you investigated, and how you solve problems.',
    actionableVisionAlignment: {
      researchTip:
        'Cite and critique specific academic papers or historical monographs; demonstrate familiarity with Oxford faculty research.',
      competitionsTip:
        'Enter prestigious subject essay prizes (John Locke Institute, Trinity College Cambridge Essay) to prove undergraduate-level writing ability.',
      projectsTip:
        'Frame projects strictly as academic inquiries testing a theoretical hypothesis rather than commercial startups.',
      essayTip:
        'Keep your UCAS statement 85% academic: "Having read Turing’s 1936 paper, I was intrigued by the Halting Problem, which led me to investigate..."',
    },
  },

  'university of cambridge': {
    universityName: 'University of Cambridge',
    shortName: 'Cambridge',
    country: 'United Kingdom',
    rank: 5,
    badge: 'QS Global #5 • Mathematical & Scientific Rigor',
    motto: 'Hinc lucem et pocula sacra',
    mottoTranslation: 'From this place, light and sacred draughts',
    visionStatement:
      'To contribute to society through the pursuit of education, learning, and research at the highest international levels of excellence.',
    coreSelectionPhilosophy:
      'Cambridge evaluates technical precision, raw problem-solving stamina, and academic curiosity. They look for students who thrive in intense, rigorous one-on-one supervision environments.',
    whyGreatProfilesFailHere:
      'Applicants with high grades who rely on rote memorization collapse during the Cambridge supervision interview or fail the STEP/ESAT admissions tests. Cambridge wants fearless mathematical stamina, not coached responses.',
    whatAdmissionsLooksFor: [
      {
        pillar: 'Mathematical & Scientific Dexterity',
        description:
          'Effortless mathematical manipulation and conceptual clarity from first principles, particularly for Engineering, Natural Sciences, CS, and Economics.',
        evidenceNeeded:
          'BMO1/BMO2 distinctions, UKMT Senior Challenge Gold, British Physics/Chemistry Olympiad medals, STEP exam (Grade 1/1S).',
        weighting: 'Critical Mandatory',
      },
      {
        pillar: 'Supercurricular Exploration',
        description:
          'Independent exploration of your course: programming passion projects, reading seminal papers, analyzing economic models, or building lab equipment.',
        evidenceNeeded:
          'Independent research essays, GitHub open-source repositories, university-level online coursework (MIT OCW, Coursera specializations).',
        weighting: 'Critical Mandatory',
      },
      {
        pillar: 'Interview & Supervision Performance',
        description:
          'Demonstrating how you learn when confronted with a question you have never seen before. Tutors care about the trajectory of your thought, not regurgitated facts.',
        evidenceNeeded:
          'Thinking out loud, listening to tutor guidance, and breaking complex problems into basic building blocks.',
        weighting: 'Critical Mandatory',
      },
    ],
    countrySystemGuide: {
      systemName: 'United Kingdom Supercurricular System (UCAS)',
      evalFocus: 'Supercurricular Rigor + First-Principles Problem Solving',
      commonRejectionTrap:
        'Relying on high school marks alone without preparing for Cambridge admissions assessments (ESAT, TMUA, STEP) or failing to show deep reading.',
      winningStrategy:
        'Solve 500+ Olympiad and past admission test problems; master the foundational proofs behind your subject.',
    },
    multiCountryAdvice:
      'For dual US/UK applicants: Your Cambridge supercurriculars (Olympiad medals, research paper, deep reading) serve as the ideal academic core for MIT/Stanford, while keeping Oxford/Cambridge delighted with your technical purity.',
    actionableVisionAlignment: {
      researchTip:
        'Focus on theoretical foundations and mathematical proofs; be prepared to derive every equation in your personal statement on a blackboard.',
      competitionsTip:
        'Target British Olympiads (BMO, BPhO) or American equivalents (AIME/USAMO); Cambridge admissions directors explicitly ask about Olympiad percentiles.',
      projectsTip:
        'Build algorithms or simulations that demonstrate deep understanding of physical laws or data structures from scratch (no high-level black-box libraries).',
      essayTip:
        'Explain what intellectual problem currently keeps you awake at night and what methodologies you employed to explore it.',
    },
  },

  'imperial college london': {
    universityName: 'Imperial College London',
    shortName: 'Imperial',
    country: 'United Kingdom',
    rank: 6,
    badge: 'QS Global #6 • STEM & Innovation Specialist',
    motto: 'Scientia imperii decus et tutamen',
    mottoTranslation: 'Scientific knowledge, the crowning glory and the shield of the empire',
    visionStatement:
      'To achieve enduring excellence in research and education in science, engineering, medicine and business for the benefit of society.',
    coreSelectionPhilosophy:
      'Imperial is unapologetically STEM and business focused: admissions tutors look for razor-sharp analytical rigor, coding/hardware fluency, and career-ready technical stamina.',
    whyGreatProfilesFailHere:
      'Applicants with general intellectual breadth who cannot demonstrate applied programming, mathematical modeling, or physics proficiency are screened out. Imperial expects immediate technical contribution.',
    whatAdmissionsLooksFor: [
      {
        pillar: 'Hard Quantitative Foundations',
        description:
          'Flawless marks in Further Mathematics, Physics, Chemistry, or Computing. High TMUA / ESAT scores are paramount.',
        evidenceNeeded:
          'A* in A-Level Further Maths or 7 in IB Math AA HL; Top 5% in UKMT or national Olympiads.',
        weighting: 'Critical Mandatory',
      },
      {
        pillar: 'Technical Projects & Applied Prototypes',
        description:
          'Evidence of building software systems, electronic circuitry, mechanical contraptions, or full-stack web applications.',
        evidenceNeeded:
          'Functional GitHub code, electronics projects, hackathon prototypes, data analytics dashboards.',
        weighting: 'Critical Mandatory',
      },
      {
        pillar: 'Industry Awareness & Innovation',
        description:
          'Understanding how modern computing, AI, energy transition, or biotechnology transforms industry and society.',
        evidenceNeeded:
          'Internships at tech/engineering firms, shadowing engineers, reading IEEE journals, fintech simulations.',
        weighting: 'Core Differentiator',
      },
    ],
    countrySystemGuide: {
      systemName: 'United Kingdom STEM Specialist Review',
      evalFocus: 'Quantitative Prowess + Practical Applied Engineering Capability',
      commonRejectionTrap:
        'Vague general interest in STEM without concrete programming, mathematical modeling, or hardware engineering evidence.',
      winningStrategy:
        'Demonstrate proven engineering proficiency: build a functional project, ace admissions tests, and display deep technical mastery.',
    },
    multiCountryAdvice:
      'Imperial values practical engineering artifacts (similar to MIT), making your software repos, hardware prototypes, and math competitions highly versatile across both systems.',
    actionableVisionAlignment: {
      researchTip:
        'Focus on applied engineering, data science, or computational modeling with clear industrial utility.',
      competitionsTip:
        'Excel in collegiate-style hackathons, robotics challenges, and applied math contests.',
      projectsTip:
        'Deploy functional full-stack web apps, IoT sensor networks, or robotics hardware with clean documentation.',
      essayTip:
        'Connect your quantitative skills to a pressing technological crisis: renewable grid stability, quantum cryptography, or scalable cancer diagnostics.',
    },
  },

  'national university of singapore': {
    universityName: 'National University of Singapore (NUS) / NTU',
    shortName: 'NUS / NTU',
    country: 'Singapore',
    rank: 8,
    badge: 'QS Global #8 • Asian Premier Flagship',
    motto: 'Towards a global knowledge enterprise',
    mottoTranslation: 'National & Global Excellence',
    visionStatement:
      'A leading global university shaping the future through impactful research, visionary education, and strategic innovation.',
    coreSelectionPhilosophy:
      'Singaporean admissions operate on transparent, unforgiving meritocracy: top percentile standardized grades and international/national Olympiad credentials form the ultimate filtering mechanism.',
    whyGreatProfilesFailHere:
      'Holistic applicants who have brilliant essays and charming extracurriculars get rejected if their GPA/SAT is even slightly below the 10th percentile cutoff. The initial filter is almost purely quantitative.',
    whatAdmissionsLooksFor: [
      {
        pillar: 'Objective Academic Cutoffs',
        description:
          'Nearly perfect Rank Points (88.75–90 RP for GCE A-Levels) or IB 42–45 points. Standardized SAT (1540+) and high school transcripts must be near top of cohort.',
        evidenceNeeded:
          'A* in all subjects, 90 Rank Points, IB 43+ points, SAT 1550+ (Math 790+).',
        weighting: 'Critical Mandatory',
      },
      {
        pillar: 'National / International Olympiad Medals',
        description:
          'High placement in competitive science, math, or informatics Olympiads provides direct accelerated entry (Aptitude-Based Admissions).',
        evidenceNeeded:
          'Medals in SMO, IOI, IPhO, IBO, IChO, or National Science Olympiad.',
        weighting: 'Critical Mandatory',
      },
      {
        pillar: 'Research Apprenticeship & Industry Focus',
        description:
          'Structured research with national institutes (like A*STAR) or corporate tech apprenticeships demonstrating career readiness.',
        evidenceNeeded:
          'A*STAR Science Award, research papers co-authored with university professors, corporate software internships.',
        weighting: 'Core Differentiator',
      },
    ],
    countrySystemGuide: {
      systemName: 'Singapore Meritocratic & Metric-First Admissions',
      evalFocus: 'Flawless Test Cutoffs + Olympiad Validation',
      commonRejectionTrap:
        'Applying with great soft extracurriculars but grades below the published 10th percentile cutoff.',
      winningStrategy:
        'Prioritize academic percentiles first; back it up with A*STAR research internships or national contest medals.',
    },
    multiCountryAdvice:
      'NUS and NTU place much heavier initial weighting on raw grades and test percentiles than US universities do. Ensure your transcript is spotless before banking on extracurricular differentiation.',
    actionableVisionAlignment: {
      researchTip:
        'Engage in formal research programs with established national laboratories or university faculty.',
      competitionsTip:
        'Prioritize recognized official Olympiads (National Math/Physics/Informatics Olympiads) over informal hackathons.',
      projectsTip:
        'Focus on structured technical deliverables aligned with Singapore’s Smart Nation initiative (FinTech, AI, biomedical).',
      essayTip:
        'Be clear, structured, and pragmatic about your academic trajectory and how you will contribute to Singapore’s knowledge economy.',
    },
  },

  'university of toronto': {
    universityName: 'University of Toronto & University of Waterloo',
    shortName: 'U of T / Waterloo',
    country: 'Canada',
    rank: 21,
    badge: 'Canada #1 • Co-op & Research Powerhouse',
    motto: 'Velut arbor aevo',
    mottoTranslation: 'May it grow as a tree through the ages',
    visionStatement:
      'To be an internationally significant research university, fostering innovative minds that transform industry through co-op programs and breakthrough discoveries.',
    coreSelectionPhilosophy:
      'Canadian top universities look for high academic grades coupled with practical, builder-first engineering capability (especially Waterloo Co-op and UofT Engineering).',
    whyGreatProfilesFailHere:
      'Applying with strong US-style extracurriculars but a 92% high school average will lead to rejection for Waterloo CS or UofT TrackOne Engineering, which routinely require 96%+ grade averages plus high Euclid math contest scores.',
    whatAdmissionsLooksFor: [
      {
        pillar: 'High Grade Consistency (95%+ Average)',
        description:
          'Top tier Grade 11 and Grade 12 marks in prerequisite subjects (Calculus, Chemistry, Physics, English).',
        evidenceNeeded:
          'Predicted IB 41+, A-Levels AAA*, or High School average 95%+ with no grade dips in Math/Sciences.',
        weighting: 'Critical Mandatory',
      },
      {
        pillar: 'Waterloo CEMC Mathematics & Computing Contests',
        description:
          'Waterloo places massive weight on Euclid, CSMC, and Canadian Computing Competition (CCC) scores for CS and Engineering admissions.',
        evidenceNeeded:
          'Euclid Contest score 80+, CCC Senior distinction, CIMC/CSMC honor roll.',
        weighting: 'Critical Mandatory',
      },
      {
        pillar: 'Co-op Readiness & Production Coding',
        description:
          'Proof that you can contribute on day one at a tech company: Git workflows, web/mobile development, real-world internships.',
        evidenceNeeded:
          'Deployed web applications, hackathon wins, previous internship or freelance experience.',
        weighting: 'Core Differentiator',
      },
    ],
    countrySystemGuide: {
      systemName: 'Canadian Academic & Co-op Practical Assessment',
      evalFocus: 'Grade Average (95%+) + Waterloo Math/CS Contests + Builder Experience',
      commonRejectionTrap:
        'Ignoring the Euclid or CCC math contests when targeting Waterloo CS or Software Engineering.',
      winningStrategy:
        'Keep Grade 12 average at 96%+ and score in the top 10% on the Euclid mathematics and CCC programming contests.',
    },
    multiCountryAdvice:
      'Canada provides the ideal middle ground: high academic requirements (like UK) combined with appreciation for software building and hackathons (like US).',
    actionableVisionAlignment: {
      researchTip:
        'Highlight applied computing, machine learning, or laboratory problem solving with practical implementations.',
      competitionsTip:
        'Register for the official CEMC Waterloo Euclid, Fermat, and Canadian Computing Competitions (CCC).',
      projectsTip:
        'Emphasize end-to-end full-stack software development that proves you are prepared for rapid co-op recruitment.',
      essayTip:
        'In the Waterloo AIF or UofT Engineering profile, be concise and specific about how you handled technical obstacles in team settings.',
    },
  },

  'eth zurich': {
    universityName: 'ETH Zurich & EPFL',
    shortName: 'ETH Zurich',
    country: 'Switzerland',
    rank: 7,
    badge: 'QS Global #7 • Continental Europe Flagship',
    motto: 'In libertate et veritate',
    mottoTranslation: 'In freedom and truth',
    visionStatement:
      'To discover and develop solutions to major global challenges through world-class education, fundamental research, and technology transfer.',
    coreSelectionPhilosophy:
      'ETH Zurich is an uncompromising cathedral of fundamental mathematics, natural sciences, and engineering. Admissions is determined by strict prerequisite curriculum rigor or passing their formidable entrance examination.',
    whyGreatProfilesFailHere:
      'Students with charming essays, glowing recommendations, and impressive non-profit leadership are summarily rejected if they cannot pass the rigorous entrance exam or lack prerequisite advanced calculus and physics coursework.',
    whatAdmissionsLooksFor: [
      {
        pillar: 'Advanced Mathematical Rigor',
        description:
          'Mastery of differential equations, linear algebra, vector calculus, and Newtonian mechanics.',
        evidenceNeeded:
          'Passing the ETH Reduzierte Aufnahmeprüfung (Reduced Entrance Exam) or presenting equivalent national diploma with top-tier math/physics.',
        weighting: 'Critical Mandatory',
      },
      {
        pillar: 'Language Proficiency (German/English)',
        description:
          'Undergraduate bachelor programs at ETH Zurich are taught in German (first year), transitioning to English. C1 German certificate is mandatory.',
        evidenceNeeded:
          'Goethe-Zertifikat C1 or TestDaF (minimum 4 in all sections).',
        weighting: 'Critical Mandatory',
      },
      {
        pillar: 'Scientific Problem Solving Stamina',
        description:
          'Ability to solve multi-step university-level theoretical physics and applied engineering problems under strict exam conditions.',
        evidenceNeeded:
          'International Physics/Chemistry/Math Olympiad (IPhO, IChO, IMO) medals or top percentile national exam scores.',
        weighting: 'Core Differentiator',
      },
    ],
    countrySystemGuide: {
      systemName: 'Continental European Rigorous Examination System',
      evalFocus: 'Strict Math/Physics Prerequisites + Entrance Examination Performance',
      commonRejectionTrap:
        'Underestimating the German language requirement (C1) or assuming holistic extracurriculars can substitute for exam grades.',
      winningStrategy:
        'Begin German language preparation early (aim for C1 by Grade 11) and rigorously practice past ETH Zurich entrance examination problem sets.',
    },
    multiCountryAdvice:
      'If preparing for ETH Zurich alongside US/UK schools, your intense focus on Olympiad-level mathematics and physics provides the absolute best preparation for Oxford/Cambridge interviews and MIT quantitative rigor.',
    actionableVisionAlignment: {
      researchTip:
        'Focus on fundamental theoretical questions in physics, chemistry, or mathematics rather than commercial venture demos.',
      competitionsTip:
        'Aim for international Olympiad selections (IMO, IPhO, IOI), which provide respected validation in continental Europe.',
      projectsTip:
        'Write technical papers derived from first principles with rigorous mathematical notation and proofs.',
      essayTip:
        'Keep motivation statements strictly formal, concise, and focused on specific departmental research groups and laboratory facilities.',
    },
  },
  'university of melbourne': {
    universityName: 'University of Melbourne & Australian National University',
    shortName: 'Melbourne & ANU',
    country: 'Australia',
    rank: 13,
    badge: 'QS Global #13 • Group of Eight (Go8) Flagship',
    motto: 'Postera crescam laude',
    mottoTranslation: 'We shall grow in the esteem of future generations',
    visionStatement:
      'To discover and share knowledge that transforms individuals and societies, championing intellectual rigor, public benefit, and global engagement.',
    coreSelectionPhilosophy:
      'Australian Go8 flagships prioritize direct academic rank mastery (ATAR percentiles or IB Diploma scores) alongside prerequisite mathematics and science rigor. Comprehensive holistic portfolios and interviews are reserved for clinical medical and dental cohorts.',
    whyGreatProfilesFailHere:
      'Applicants with stellar extracurricular resumes and startup leadership get rejected if they fall even 0.2 points below the strict published ATAR / IB cutoffs (e.g. 99.00 ATAR for flagship Engineering / Biomedicine) or lack mandatory prerequisites in Higher Level Mathematics or Chemistry.',
    whatAdmissionsLooksFor: [
      {
        pillar: 'Direct ATAR / IB Score Rank Clearance',
        description:
          'Clearance of published guaranteed or competitive entry thresholds for the target undergraduate degree.',
        evidenceNeeded:
          'ATAR 98.00–99.85+ or IB Diploma 40–44/45 points directly verified from school examination authority transcripts.',
        weighting: 'Critical Mandatory',
      },
      {
        pillar: 'Prerequisite Subject Mastery',
        description:
          'Completion of essential prerequisite high school subjects (e.g., Mathematical Methods, Specialist Mathematics, Chemistry).',
        evidenceNeeded:
          'Study scores of 35+ / 50 in Victorian VCE prerequisites or 6+ in IB Higher Level core subjects.',
        weighting: 'Critical Mandatory',
      },
      {
        pillar: 'Clinical & Multidisciplinary Aptitude (Medical Tracks)',
        description:
          'High percentile performance on the UCAT ANZ examination combined with performance in Multiple Mini Interviews (MMI).',
        evidenceNeeded:
          'UCAT ANZ 90th+ percentile score and strong ethical problem solving in structured behavioral scenario interviews.',
        weighting: 'Core Differentiator',
      },
      {
        pillar: 'Undergraduate Research Intent & Honours Pathway',
        description:
          'Demonstrated scholarly endurance and readiness to participate in bachelor honours and laboratory research colloquia.',
        evidenceNeeded:
          'Independent research notebooks, Australian Mathematics Competition (AMC) High Distinction, or science Olympiad participation.',
        weighting: 'Holistic Bonus',
      },
    ],
    countrySystemGuide: {
      systemName: 'Australian Direct ATAR Index & Prerequisite System',
      evalFocus: 'Guaranteed Academic Score Cutoffs + Core Prerequisite Subjects',
      commonRejectionTrap:
        'Assuming compelling personal essays or athletic achievement can compensate for falling below the published ATAR score cutoff.',
      winningStrategy:
        'Focus completely on maximizing external exam grades to lock in your ATAR/IB score, and ensure all prerequisites are satisfied with high marks.',
    },
    multiCountryAdvice:
      'When applying to Australia alongside the US/UK, your intense academic preparation for UK/US exams will easily help you clear Australian ATAR thresholds. Ensure your high school curriculum includes required prerequisite subjects.',
    actionableVisionAlignment: {
      researchTip:
        'Highlight independent empirical investigations and scientific literature comprehension aligned with faculty research institutes.',
      competitionsTip:
        'Compete in the Australian Mathematics Competition (AMC) and Australian Science Olympiads for objective validation.',
      projectsTip:
        'Build structured subject portfolios and capstones that prove deep mathematical and scientific understanding.',
      essayTip:
        'Keep statements concise and focused on academic preparedness and degree specialization; avoid emotional or dramatic narrative arcs.',
    },
  },
};

export function getUniversityVisionData(
  universityName?: string,
  country?: string,
  tier?: string,
  field?: string
): UniversityVisionInfo {
  const norm = (universityName || '').toLowerCase().trim();
  const countryNorm = (country || 'United States').toLowerCase().trim();
  const f = (field || '').toLowerCase();
  const isCSOrEng = f.includes('cs') || f.includes('computer') || f.includes('engineer') || f.includes('robot') || f.includes('tech');
  const isPreMedOrLawOrEcon = f.includes('med') || f.includes('bio') || f.includes('law') || f.includes('econ') || f.includes('policy') || f.includes('humanit');

  // Country classification checks
  const isUKTarget = countryNorm.includes('kingdom') || countryNorm.includes('uk') || countryNorm.includes('britain');
  const isCanadaTarget = countryNorm.includes('canada');
  const isSingaporeTarget = countryNorm.includes('singapore');
  const isEuropeTarget = countryNorm.includes('switzerland') || countryNorm.includes('europe') || countryNorm.includes('germany') || countryNorm.includes('france');
  const isAustraliaTarget = countryNorm.includes('australia');
  const isUSTarget = countryNorm.includes('states') || countryNorm.includes('us');

  // 1. If user selected a specific university, verify that it matches the target country context
  if (norm) {
    for (const [key, val] of Object.entries(UNIVERSITY_VISIONS)) {
      const matchKey = norm.includes(key) || key.includes(norm) || norm.includes(val.shortName.toLowerCase());
      if (matchKey) {
        const uniCountry = val.country.toLowerCase();
        // Check if university belongs to the currently active country target
        const countryCompatible =
          countryNorm === 'all global' ||
          (isUKTarget && (uniCountry.includes('kingdom') || uniCountry.includes('uk'))) ||
          (isUSTarget && (uniCountry.includes('states') || uniCountry.includes('us'))) ||
          (isCanadaTarget && uniCountry.includes('canada')) ||
          (isSingaporeTarget && uniCountry.includes('singapore')) ||
          (isEuropeTarget && (uniCountry.includes('switzerland') || uniCountry.includes('europe'))) ||
          (isAustraliaTarget && uniCountry.includes('australia'));

        if (countryCompatible) {
          return val;
        }
      }
    }
  }

  // 2. Dynamic Country & Peer Institution Binding:

  // UNITED KINGDOM: Supercurricular exploration, deep academic curiosity, subject mastery & UCAS focus
  if (isUKTarget) {
    if (isCSOrEng) {
      return tier === 'Top 10'
        ? UNIVERSITY_VISIONS['imperial college london']
        : UNIVERSITY_VISIONS['university of cambridge'];
    }
    if (isPreMedOrLawOrEcon) {
      return UNIVERSITY_VISIONS['university of oxford'];
    }
    return UNIVERSITY_VISIONS['university of oxford'];
  }

  // CANADA: Academic cutoffs (95%+), Waterloo CEMC contests & practical Co-op builders
  if (isCanadaTarget) {
    return UNIVERSITY_VISIONS['university of toronto'];
  }

  // SINGAPORE: Meritocratic Indicative Grade Profile (IGP) cutoffs & A*STAR research
  if (isSingaporeTarget) {
    return UNIVERSITY_VISIONS['national university of singapore'];
  }

  // CONTINENTAL EUROPE: Entrance exams, theoretical proof notebooks & first-principles mathematics
  if (isEuropeTarget) {
    return UNIVERSITY_VISIONS['eth zurich'];
  }

  // AUSTRALIA / APAC: Direct ATAR rank index, core prerequisites & clinical exams
  if (isAustraliaTarget) {
    return UNIVERSITY_VISIONS['university of melbourne'];
  }

  // UNITED STATES & GLOBAL: Holistic evaluation, intellectual vitality, community impact & angular spikes
  if (isCSOrEng && (tier === 'Top 5' || tier === 'Top 10')) {
    // If student is targeting Top 5/10 tech, balance between MIT and Stanford based on discipline
    if (f.includes('robot') || f.includes('hard') || f.includes('mech') || f.includes('ee')) {
      return UNIVERSITY_VISIONS['massachusetts institute of technology'];
    }
    return UNIVERSITY_VISIONS['stanford university'];
  }

  if (isPreMedOrLawOrEcon) {
    return UNIVERSITY_VISIONS['harvard university'];
  }

  // Default flagship peer institution for US holistic admissions
  return UNIVERSITY_VISIONS['stanford university'];
}
