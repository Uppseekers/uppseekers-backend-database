import React, { useState } from 'react';
import { StudentProfile } from '../types';
import {
  X,
  Save,
  Trash2,
  AlertCircle,
  Building2,
  GraduationCap,
  BookOpen,
  Briefcase,
  Microscope,
  Award,
  Sun,
  FolderGit2,
  Linkedin,
  FileText,
} from 'lucide-react';

interface EditStudentModalProps {
  isOpen: boolean;
  student: StudentProfile | null;
  onClose: () => void;
  onSave: (updated: StudentProfile) => void;
  onDelete?: (id: string) => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  isOpen,
  student,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!isOpen || !student) return null;

  const [formData, setFormData] = useState<StudentProfile>({ ...student });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleChange = (field: keyof StudentProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-indigo-700 to-indigo-900 text-white p-6 border-b border-indigo-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">Edit Student Profile</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-amber-950">
                  Admin Edit
                </span>
              </div>
              <p className="text-xs text-indigo-100 mt-0.5">
                Modifying record for {student.name} • {student.university}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1 text-slate-800 text-xs sm:text-sm">
          {/* Basic Information */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              Core Candidate Identity & Placement
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Admitted University *</label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => handleChange('university', e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course / Major</label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => handleChange('course', e.target.value)}
                  placeholder="e.g. Computer Science, Economics"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Class Of (Graduation Cohort)</label>
                <input
                  type="text"
                  value={formData.classOf}
                  onChange={(e) => handleChange('classOf', e.target.value)}
                  placeholder="e.g. 2028, 2029"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={formData.linkedin}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Standardized Testing (SAT / ACT)</label>
                <input
                  type="text"
                  value={formData.actSat}
                  onChange={(e) => handleChange('actSat', e.target.value)}
                  placeholder="e.g. SAT: 1560, ACT: 35"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Academic & Work Records */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                Internships & Professional Work
              </label>
              <textarea
                rows={3}
                value={formData.internshipWork}
                onChange={(e) => handleChange('internshipWork', e.target.value)}
                placeholder="• Role, Company (Details)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Microscope className="w-3.5 h-3.5 text-emerald-600" />
                Academic & Laboratory Research
              </label>
              <textarea
                rows={3}
                value={formData.research}
                onChange={(e) => handleChange('research', e.target.value)}
                placeholder="• Research Title, Laboratory, Advisor, Paper Publications"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                Competitions, Honors & Awards
              </label>
              <textarea
                rows={3}
                value={formData.competitionsAwards}
                onChange={(e) => handleChange('competitionsAwards', e.target.value)}
                placeholder="• Competition Name (Award Level, Year)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-purple-600" />
                Technical & Independent Projects
              </label>
              <textarea
                rows={3}
                value={formData.projects}
                onChange={(e) => handleChange('projects', e.target.value)}
                placeholder="• Project Title: Architecture, stack, and demonstrable impact"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  Summer Programs
                </label>
                <textarea
                  rows={2}
                  value={formData.summerPrograms}
                  onChange={(e) => handleChange('summerPrograms', e.target.value)}
                  placeholder="• Summer Institute or Program name"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Other Activities & Community Service
                </label>
                <textarea
                  rows={2}
                  value={formData.otherActivities}
                  onChange={(e) => handleChange('otherActivities', e.target.value)}
                  placeholder="• Leadership roles, clubs, sports, or volunteering"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            {onDelete ? (
              <div>
                {showDeleteConfirm ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(student.id);
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
                    >
                      Confirm Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </button>
                )}
              </div>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
