import React, { useState, useRef } from 'react';
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
} from 'lucide-react';
import { AspiringStudentBaseline, AspiringStudentTarget, GradeLevel } from '../../types';
import { SAMPLE_ASPIRING_PROFILES } from '../../utils/roadmapEngine';
import { parseCSV } from '../../utils/csvParser';

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

  // Edit form state
  const [editForm, setEditForm] = useState<{
    name: string;
    grade: GradeLevel;
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
    gpa: baseline.gpaRigor,
    tests: baseline.testingStatus,
    internships: baseline.internshipsWork,
    research: baseline.researchExperience,
    competitions: baseline.competitionsHonors,
    projects: baseline.technicalProjects,
    leadership: baseline.leadershipActivities,
  });

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

        const gpa = getCol(['gpa', 'academic', 'marks']) || baseline.gpaRigor;
        const tests = getCol(['sat', 'act', 'test', 'score']) || baseline.testingStatus;
        const internships = getCol(['intern', 'work', 'job']) || baseline.internshipsWork;
        const research = getCol(['research', 'paper', 'lab']) || baseline.researchExperience;
        const competitions = getCol(['competition', 'award', 'olympiad', 'honor']) || baseline.competitionsHonors;
        const projects = getCol(['project', 'github', 'app', 'code']) || baseline.technicalProjects;
        const leadership = getCol(['lead', 'activity', 'club', 'sport', 'extracurricular']) || baseline.leadershipActivities;

        onUpdateTarget({
          ...target,
          studentName: name,
          currentGrade: grade,
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

        setUploadSuccess(`Successfully uploaded & parsed profile for "${name}" (${grade}) from ${file.name}!`);
      } catch (err: any) {
        setUploadError(err.message || 'Failed to parse file. Please verify CSV/Excel format.');
      }
    };

    reader.readAsText(file);
  };

  const applyParsedData = (data: any) => {
    if (data.name) {
      onUpdateTarget({
        ...target,
        studentName: data.name,
        currentGrade: data.grade || target.currentGrade,
      });
    }
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

  // Download Sample Template
  const handleDownloadTemplate = () => {
    const csvContent =
      'Name,Current Grade,Academics & GPA,Standardized Tests,Internships & Work,Research Experience,Competitions & Awards,Projects & Technical,Leadership & Activities\n' +
      '"Aarav Patel","Grade 10","GPA: 3.94 / 4.0 UW; Honors Chemistry, Honors Pre-Calc","PSAT 10: 1440 (Math 760); Target SAT: 1560+","Weekend coding tutor at community center","Explored convolutional neural nets online; no published paper yet","AMC 10 score: 98; USACO Bronze","Built React personal portfolio; Python discord bot","Treasurer of Robotics Club; JV Track"';

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
    setUploadSuccess('Profile updated successfully!');
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

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 transition-all cursor-pointer"
            title="Download blank Excel/CSV template"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Download CSV Template</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setEditForm({
                name: target.studentName,
                grade: target.currentGrade,
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
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Aspiring Student Profile Online
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Grade Level</label>
                  <select
                    value={editForm.grade}
                    onChange={(e) => setEditForm({ ...editForm, grade: e.target.value as GradeLevel })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Grade 9">Grade 9 (Freshman)</option>
                    <option value="Grade 10">Grade 10 (Sophomore)</option>
                    <option value="Grade 11">Grade 11 (Junior)</option>
                    <option value="Grade 12">Grade 12 (Senior)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Academics & GPA Rigor</label>
                <input
                  type="text"
                  value={editForm.gpa}
                  onChange={(e) => setEditForm({ ...editForm, gpa: e.target.value })}
                  placeholder="e.g. GPA: 3.94 / 4.0 UW; 4 APs taken"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
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
