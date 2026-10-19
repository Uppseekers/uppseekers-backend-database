import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  UserCheck,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Sliders,
  ChevronDown,
  BookOpen,
  UserPlus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { AspiringStudentBaseline, AspiringStudentTarget, GradeLevel } from '../../types';
import { SAMPLE_ASPIRING_PROFILES } from '../../utils/roadmapEngine';
import { parseCSV } from '../../utils/csvParser';

const OPTIONAL_ACTIVITY_PRESETS = [
  {
    label: 'Pre-Med & BioSciences',
    targetField: 'Pre-Med & BioSciences',
    gpa: 'GPA: 3.96 UW / 4.5 W; AP Bio (5), AP Chem (5), AP Calc BC',
    tests: 'SAT: 1540 (Math: 780, EBRW: 760)',
    internships: 'Hospital volunteer (120 hrs); clinical shadowing in pediatric surgery and pathology',
    research: 'Assisted in university genomics wet-lab analyzing CRISPR off-target cleavage assays',
    competitions: 'USABO Semifinalist (Top 10%); HOSA Medical Innovation State Gold Medal',
    projects: 'Interactive web guide mapping clinical trial access disparities in local counties',
    leadership: 'Red Cross Youth Chapter President; organized high school CPR certified workshops',
  },
  {
    label: 'CS & AI Systems',
    targetField: 'Computer Science & AI',
    gpa: 'GPA: 3.95 UW / 4.6 W; AP CSA (5), AP Calc BC (5), AP Physics C',
    tests: 'SAT: 1570 (Math: 800, EBRW: 770)',
    internships: 'Software engineering intern at health-tech startup; built distributed queue worker',
    research: 'Co-author on preprint applying transformer attention mechanisms to code refactoring',
    competitions: 'USACO Gold Division competitor; 1st Place at State High School Hackathon',
    projects: 'Open-source distributed database engine (350+ GitHub stars, 2k downloads)',
    leadership: 'President of High School Computer Science Club; tutor for 40+ middle schoolers in Python',
  },
  {
    label: 'Economics & Quant',
    targetField: 'Economics & Quant Finance',
    gpa: 'GPA: 3.94 UW / 4.4 W; AP Micro (5), AP Macro (5), AP Stats (5), AP Calc BC',
    tests: 'SAT: 1550 (Math: 800, EBRW: 750)',
    internships: 'Summer economic research assistant for municipal tax policy advisory group',
    research: 'Econometric analysis of algorithmic trading order-flow impact on market liquidity',
    competitions: 'National Economics Challenge State Finalist; Wharton High School Investment Top 25',
    projects: 'Algorithmic backtesting framework for momentum equities with Monte Carlo simulation',
    leadership: 'Founder of High School Financial Literacy Initiative; conducted seminars for 200+ students',
  },
  {
    label: 'Law & Policy',
    targetField: 'Law, Policy & International Relations',
    gpa: 'GPA: 3.98 UW / 4.6 W; AP US History (5), AP Gov (5), AP Lang (5), AP Lit',
    tests: 'ACT: 35 (Reading: 36, English: 36, Math: 34, Science: 35)',
    internships: 'Casework intern for State Senator district office; filed legislative briefing memos',
    research: 'Author of 6,000-word treatise on 14th Amendment jurisprudence submitted to The Concord Review',
    competitions: 'NSDA National Speech & Debate Tournament Qualifier (Lincoln-Douglas); Model UN Best Delegate',
    projects: 'Civic engagement database tracking voting rights legislation across state assemblies',
    leadership: 'Mock Trial Captain; President of High School Student Government Association',
  },
  {
    label: 'Physics & Pure Math',
    targetField: 'Physics & Pure Mathematics',
    gpa: 'GPA: 3.97 UW / 4.7 W; Multivariable Calculus & Linear Algebra dual enrollment, AP Physics C',
    tests: 'SAT: 1580 (Math: 800, EBRW: 780)',
    internships: 'Summer research fellowship at university astrophysics numerical simulation lab',
    research: 'First-author preprint on N-body gravitational perturbation theory posted to arXiv',
    competitions: 'AIME Qualifier (Score: 9); USAPhO Semi-finalist; British Physics Olympiad Senior Gold',
    projects: 'Numerical physics engine simulating relativistic particle collision trajectories in WebGL',
    leadership: 'Math Circle Founder; organized weekly problem-solving seminars for high schoolers',
  },
];

interface AspiringStudentUploaderProps {
  target: AspiringStudentTarget;
  baseline: AspiringStudentBaseline;
  onUpdateTarget: (target: AspiringStudentTarget) => void;
  onUpdateBaseline: (baseline: AspiringStudentBaseline) => void;
}

export const AspiringStudentUploader: React.FC<AspiringStudentUploaderProps> = ({
  target,
  baseline,
  onUpdateTarget,
  onUpdateBaseline,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Edit form state including Intended Course or Major
  const [editForm, setEditForm] = useState<{
    name: string;
    grade: GradeLevel;
    targetField: string;
    gpa: string;
    tests: string;
    internships: string;
    research: string;
    competitions: string;
    projects: string;
    leadership: string;
  }>({
    name: target.studentName,
    grade: target.currentGrade,
    targetField: target.targetField || 'Computer Science & AI',
    gpa: baseline.gpaRigor,
    tests: baseline.testingStatus,
    internships: baseline.internshipsWork,
    research: baseline.researchExperience,
    competitions: baseline.competitionsHonors,
    projects: baseline.technicalProjects,
    leadership: baseline.leadershipActivities,
  });

  // Keep form in sync when target or baseline changes
  useEffect(() => {
    setEditForm({
      name: target.studentName,
      grade: target.currentGrade,
      targetField: target.targetField || 'Computer Science & AI',
      gpa: baseline.gpaRigor,
      tests: baseline.testingStatus,
      internships: baseline.internshipsWork,
      research: baseline.researchExperience,
      competitions: baseline.competitionsHonors,
      projects: baseline.technicalProjects,
      leadership: baseline.leadershipActivities,
    });
  }, [target, baseline, isEditingModalOpen]);

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Process File (CSV, JSON, or text export from Excel)
  const processFile = (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) throw new Error('File appears to be empty');

        // Check if JSON
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          applyParsedData(parsed);
          setUploadSuccess(`Successfully loaded ${file.name}!`);
          return;
        }

        // Parse as CSV
        const rows = parseCSV(text);
        if (rows.length < 2) {
          throw new Error('CSV must contain a header row and at least one student data row');
        }

        const headers = rows[0].map((h) => h.toLowerCase().trim());
        const dataRow = rows[1];

        const getCol = (keywords: string[]): string => {
          const index = headers.findIndex((h) => keywords.some((kw) => h.includes(kw)));
          return index !== -1 && dataRow[index] ? dataRow[index].trim() : '';
        };

        const name = getCol(['name', 'student']) || 'Aspiring Student';
        const gradeRaw = getCol(['grade', 'class', 'year']);
        let grade: GradeLevel = 'Grade 10';
        if (gradeRaw.includes('9')) grade = 'Grade 9';
        else if (gradeRaw.includes('11')) grade = 'Grade 11';
        else if (gradeRaw.includes('12')) grade = 'Grade 12';

        const major = getCol(['major', 'course', 'field', 'intended', 'discipline', 'subject', 'program']) || target.targetField;
        const gpa = getCol(['gpa', 'academic', 'marks']) || baseline.gpaRigor;
        const tests = getCol(['sat', 'act', 'test', 'score']) || baseline.testingStatus;
        const internships = getCol(['intern', 'work', 'job']) || baseline.internshipsWork;
        const research = getCol(['research', 'paper', 'lab']) || baseline.researchExperience;
        const competitions = getCol(['competition', 'award', 'olympiad', 'honor']) || baseline.competitionsHonors;
        const projects = getCol(['project', 'github', 'app', 'code', 'hardware', 'artifact']) || baseline.technicalProjects;
        const leadership = getCol(['lead', 'activity', 'club', 'sport', 'extracurricular']) || baseline.leadershipActivities;

        onUpdateTarget({
          ...target,
          studentName: name,
          currentGrade: grade,
          targetField: major || target.targetField,
        });

        onUpdateBaseline({
          gpaRigor: gpa,
          testingStatus: tests,
          internshipsWork: internships,
          researchExperience: research,
          competitionsHonors: competitions,
          technicalProjects: projects,
          leadershipActivities: leadership,
        });

        setUploadSuccess(`Successfully uploaded & parsed profile for "${name}" (${grade} · ${major || target.targetField}) from ${file.name}!`);
      } catch (err: any) {
        setUploadError(err.message || 'Failed to parse file. Please verify CSV/Excel format.');
      }
    };

    reader.readAsText(file);
  };

  const applyParsedData = (data: any) => {
    onUpdateTarget({
      ...target,
      studentName: data.name || target.studentName,
      currentGrade: data.grade || target.currentGrade,
      targetField: data.major || data.course || data.targetField || target.targetField,
    });
    onUpdateBaseline({
      gpaRigor: data.gpa || data.academics || baseline.gpaRigor,
      testingStatus: data.tests || data.satAct || baseline.testingStatus,
      internshipsWork: data.internships || baseline.internshipsWork,
      researchExperience: data.research || baseline.researchExperience,
      competitionsHonors: data.competitions || baseline.competitionsHonors,
      technicalProjects: data.projects || baseline.technicalProjects,
      leadershipActivities: data.leadership || baseline.leadershipActivities,
    });
  };

  // Download Sample Template with Intended Course or Major Column
  const handleDownloadTemplate = () => {
    const csvContent =
      'Name,Current Grade,Intended Course or Major,Academics & GPA,Standardized Tests,Internships & Work,Research Experience,Competitions & Awards,Projects & Technical,Leadership & Activities\n' +
      '"Aarav Patel","Grade 10","Pre-Med & BioSciences","GPA: 3.96 / 4.0 UW; Honors Chemistry, Honors Biology","PSAT 10: 1450 (Math 740, ERW 710); Target SAT: 1550+","Community hospital volunteer (60 hours logged)","Regional science fair inquiry on enzyme kinetics; no published paper yet","HOSA Regional Gold in Medical Math; USABO participant","Personal blog reviewing immunology preprints; CPR certified","Co-President of Red Cross Youth Club; Track & Field"\n' +
      '"Elena Rossi","Grade 10","Economics & Quant Finance","GPA: 3.98 / 4.0 UW; AP Microeconomics (5), Honors Algebra 2","PSAT 10: 1470; Target SAT: 1570+","Youth intern at local credit union financial literacy office","Statistical paper on local retail grocery inflation trends","National Economics Challenge State Finalist; Wharton Global Youth Investment","Algorithmic portfolio backtester script in Python using yfinance","Varsity Debate (Public Forum); Investment Club Co-President"\n' +
      '"Marcus Vance","Grade 11","Mechanical & Aerospace Engineering","GPA: 3.92 / 4.0 UW; AP Physics 1 (5), AP Calc BC","SAT: 1530 (Math 790, ERW 740)","Shadowed automation engineer at aerospace manufacturing plant","Extended essay testing carbon fiber tensile failure points","British Physics Olympiad Senior Challenge Silver; FRC Robotics driver","Designed and 3D-printed custom robotic gripper with Arduino","STEM Outreach Lead; Quiz Bowl Vice Captain"\n' +
      '"Maya Chen","Grade 11","Law, Policy & International Relations","GPA: 3.97 / 4.0 UW; AP US History (5), AP Government (5)","SAT: 1540 (ERW 780, Math 760)","Intern for State Representative district office; citizen constituent casework","Independent analysis on constitutional privacy doctrines and digital surveillance","NSDA National Speech & Debate Qualifier; Model UN Best Delegate Gavel","Author of regional youth public policy newsletter with 1,200 subscribers","Youth City Council Advisory Board Chair; Mock Trial Captain"\n' +
      '"Sophia Lin","Grade 10","Computer Science & AI","GPA: 3.94 / 4.0 UW; Honors Chemistry, Honors Pre-Calc","PSAT 10: 1440 (Math 760); Target SAT: 1560+","Weekend coding tutor at community center","Explored convolutional neural nets online; no published paper yet","AMC 10 score: 98; USACO Bronze","Built React personal portfolio; Python discord bot","Treasurer of Robotics Club; JV Track"\n' +
      '"David Kim","Grade 10","Physics & Pure Mathematics","GPA: 4.0 / 4.0 UW; Multivariable Calculus, AP Physics C","SAT: 1560 (Math 800, ERW 760)","Research assistant on computational stellar astrophysics simulation","Inquiry into numerical approximations for three-body orbital mechanics","USAMO Qualifier; USAPhO F=ma Bronze; AMC 10 score: 126","Developed open-source Python physics engine for gravitational modeling","President of High School Math Circle; Quiz Bowl Captain"';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'aspiring_student_profile_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTarget({
      ...target,
      studentName: editForm.name,
      currentGrade: editForm.grade,
      targetField: editForm.targetField || target.targetField,
    });
    onUpdateBaseline({
      gpaRigor: editForm.gpa,
      testingStatus: editForm.tests,
      internshipsWork: editForm.internships,
      researchExperience: editForm.research,
      competitionsHonors: editForm.competitions,
      technicalProjects: editForm.projects,
      leadershipActivities: editForm.leadership,
    });
    setIsEditingModalOpen(false);
    setUploadSuccess(`Profile updated successfully for ${editForm.name} (${editForm.targetField})!`);
  };

  const handleStartBlankProfile = () => {
    setEditForm({
      name: 'New Candidate',
      grade: 'Grade 10',
      targetField: target.targetField || 'Computer Science & AI',
      gpa: '',
      tests: '',
      internships: '',
      research: '',
      competitions: '',
      projects: '',
      leadership: '',
    });
    setIsEditingModalOpen(true);
  };

  const handleClearActivities = () => {
    setEditForm((prev) => ({
      ...prev,
      gpa: '',
      tests: '',
      internships: '',
      research: '',
      competitions: '',
      projects: '',
      leadership: '',
    }));
  };

  const handleApplyPreset = (preset: typeof OPTIONAL_ACTIVITY_PRESETS[0]) => {
    setEditForm((prev) => ({
      ...prev,
      targetField: preset.targetField,
      gpa: preset.gpa,
      tests: preset.tests,
      internships: preset.internships,
      research: preset.research,
      competitions: preset.competitions,
      projects: preset.projects,
      leadership: preset.leadership,
    }));
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider mb-1">
            <span>Step 1</span>
            <span>·</span>
            <span>Candidate Profile Dossier</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900">
            Upload Aspiring Student Profile
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Load candidate credentials from an Excel/CSV file or select a verified test profile below.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 transition-all cursor-pointer"
            title="Download multi-discipline Excel/CSV template with Intended Course or Major column"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Download CSV Template</span>
          </button>
          <button
            type="button"
            onClick={handleStartBlankProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-300 transition-all cursor-pointer shadow-2xs"
            title="Start a fresh candidate profile with completely empty activities"
          >
            <UserPlus className="w-3.5 h-3.5 text-stone-600" />
            <span>Start Blank Profile</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setEditForm({
                name: target.studentName,
                grade: target.currentGrade,
                targetField: target.targetField || 'Computer Science & AI',
                gpa: baseline.gpaRigor,
                tests: baseline.testingStatus,
                internships: baseline.internshipsWork,
                research: baseline.researchExperience,
                competitions: baseline.competitionsHonors,
                projects: baseline.technicalProjects,
                leadership: baseline.leadershipActivities,
              });
              setIsEditingModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-100 border border-stone-900 transition-all cursor-pointer shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile Online</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-stone-900 bg-stone-100 scale-[1.005]'
            : 'border-stone-300 hover:border-stone-400 bg-stone-50/50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".csv,.xlsx,.xls,.json,.txt"
          className="hidden"
        />
        <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center mx-auto mb-2 border border-stone-200">
          <Upload className="w-4 h-4" />
        </div>
        <div className="font-semibold text-stone-800 text-xs">
          Drop Student Profile Excel / CSV here, or <span className="underline decoration-stone-600">browse file</span>
        </div>
        <p className="text-[11px] text-stone-500 mt-0.5">
          Standard spreadsheet columns: academics, test scores, research papers, internships, competitions, and leadership.
        </p>
      </div>

      {/* Status Messages */}
      {uploadSuccess && (
        <div className="p-3 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}
      {uploadError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Current Active Student Card Summary */}
      <div className="bg-stone-50/70 rounded-xl p-4 sm:p-5 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-stone-900 text-stone-100 font-mono font-bold flex items-center justify-center text-xs shrink-0">
            {target.studentName ? target.studentName.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-900 text-sm">{target.studentName}</span>
              <span className="text-[11px] font-mono text-stone-600">
                ({target.currentGrade})
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Class of {target.targetClassOf} · Focus: {target.targetField}
            </p>
          </div>
        </div>

        {/* Quick Sample Profile Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono text-stone-500 mr-1 uppercase">Sample Profiles:</span>
          {SAMPLE_ASPIRING_PROFILES.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => {
                onUpdateTarget(sample.target);
                onUpdateBaseline(sample.baseline);
                setUploadSuccess(`Loaded profile: ${sample.target.studentName}`);
              }}
              className={`px-2.5 py-1 text-xs rounded-md border transition-all cursor-pointer ${
                target.studentName === sample.target.studentName
                  ? 'bg-stone-900 text-stone-100 border-stone-900 font-semibold shadow-2xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
              }`}
            >
              {sample.target.studentName.split(' ')[0]} ({sample.target.currentGrade.replace('Grade ', 'G')})
            </button>
          ))}
        </div>
      </div>

      {/* Online Edit Profile Modal */}
      {isEditingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-stone-900" />
                Edit Aspiring Student Profile Online
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Current Grade Level</label>
                  <select
                    value={editForm.grade}
                    onChange={(e) => setEditForm({ ...editForm, grade: e.target.value as GradeLevel })}
                    className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 font-medium"
                  >
                    <option value="Grade 9">Grade 9 (Freshman)</option>
                    <option value="Grade 10">Grade 10 (Sophomore)</option>
                    <option value="Grade 11">Grade 11 (Junior)</option>
                    <option value="Grade 12">Grade 12 (Senior)</option>
                  </select>
                </div>
              </div>

              {/* Intended Course or Major */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center justify-between">
                  <span>Intended Course or Major</span>
                  <span className="text-[10px] font-mono text-stone-500">Governs roadmap & supercurricular tasks</span>
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[
                    'Computer Science & AI',
                    'Pre-Med & BioSciences',
                    'Mechanical & Aerospace Engineering',
                    'Economics & Quant Finance',
                    'Physics & Pure Mathematics',
                    'Law, Policy & International Relations',
                    'Electrical & Hardware Systems',
                    'Business & Management',
                  ].map((field) => (
                    <button
                      key={field}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, targetField: field })}
                      className={`text-[11px] px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                        editForm.targetField === field
                          ? 'bg-stone-900 text-stone-100 border-stone-900 font-semibold shadow-2xs'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {field}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  value={editForm.targetField}
                  onChange={(e) => setEditForm({ ...editForm, targetField: e.target.value })}
                  placeholder="e.g. Biomedical Engineering, Pure Mathematics, Cognitive Science..."
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 font-medium text-stone-900"
                />
              </div>

              {/* Activities Control Panel: Clear All & Optional Presets */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-600 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Activities & Extracurricular Data
                  </span>

                  <button
                    type="button"
                    onClick={handleClearActivities}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                    title="Clear all activity fields below to leave profile completely blank"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear All Activities</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
                  <span className="text-stone-500 font-mono text-[10px] mr-1">Optional starter presets:</span>
                  {OPTIONAL_ACTIVITY_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="px-2 py-0.5 rounded bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 font-medium transition-all cursor-pointer text-[10px]"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Academics & GPA Rigor</label>
                <input
                  type="text"
                  value={editForm.gpa}
                  onChange={(e) => setEditForm({ ...editForm, gpa: e.target.value })}
                  placeholder="e.g. GPA: 3.94 / 4.0 UW; 4 APs taken"
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Standardized Testing Status</label>
                <input
                  type="text"
                  value={editForm.tests}
                  onChange={(e) => setEditForm({ ...editForm, tests: e.target.value })}
                  placeholder="e.g. PSAT 10: 1440; Planning SAT in Fall 11th"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Research Experience & Papers</label>
                  <textarea
                    rows={2}
                    value={editForm.research}
                    onChange={(e) => setEditForm({ ...editForm, research: e.target.value })}
                    placeholder="Independent inquiries, lab work, paper drafts"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Internships & Work</label>
                  <textarea
                    rows={2}
                    value={editForm.internships}
                    onChange={(e) => setEditForm({ ...editForm, internships: e.target.value })}
                    placeholder="Summer internships, shadowing, jobs"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Competitions & Awards</label>
                  <textarea
                    rows={2}
                    value={editForm.competitions}
                    onChange={(e) => setEditForm({ ...editForm, competitions: e.target.value })}
                    placeholder="Olympiads (AMC, USACO), hackathons, prizes"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Technical Projects & Artifacts</label>
                  <textarea
                    rows={2}
                    value={editForm.projects}
                    onChange={(e) => setEditForm({ ...editForm, projects: e.target.value })}
                    placeholder="Apps, GitHub repos, robotics, open-source"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Leadership & Extracurriculars</label>
                <textarea
                  rows={2}
                  value={editForm.leadership}
                  onChange={(e) => setEditForm({ ...editForm, leadership: e.target.value })}
                  placeholder="Club presidency, non-profit founded, varsity sports"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-xs cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
