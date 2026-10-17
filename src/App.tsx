import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { StudentCard } from './components/StudentCard';
import { TableView } from './components/TableView';
import { StudentDetailModal } from './components/StudentDetailModal';
import { StudentComparisonModal } from './components/StudentComparisonModal';
import { ComparisonDock } from './components/ComparisonDock';
import { SyncSheetModal } from './components/SyncSheetModal';
import { EditStudentModal } from './components/EditStudentModal';
import { LoginScreen } from './components/LoginScreen';
import { INITIAL_STUDENTS } from './initialData';
import { StudentProfile, FilterState, AuthUser, AppTab, AdmittedStudentProfile } from './types';
import { calculateProfileCompleteness } from './utils/workAnalyzer';
import { NavigationTabs } from './components/NavigationTabs';
import { BackEngineeredRoadmapView } from './components/roadmap/BackEngineeredRoadmapView';
import { CompareLabView } from './components/comparison/CompareLabView';
import {
  getAdmittedCohort1500,
  saveCustom1500Cohort,
  resetDefault1500Cohort,
} from './data/admittedStudents1500';
import { GraduationCap, Users, Building2, SearchX, Shield, Star, Zap, Scale } from 'lucide-react';

export default function App() {
  // Authentication state initialized from localStorage
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('uppseekers_auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          parsed &&
          typeof parsed.email === 'string' &&
          (parsed.email.toLowerCase() === 'uppseekers@gmail.com' ||
            parsed.email.toLowerCase().endsWith('@uppseekers.com'))
        ) {
          return {
            ...parsed,
            role: parsed.role || (parsed.email.toLowerCase() === 'uppseekers@gmail.com' ? 'admin' : 'staff'),
            isAdmin: parsed.isAdmin ?? (parsed.email.toLowerCase() === 'uppseekers@gmail.com'),
          };
        }
      }
    } catch {
      // ignore parse error
    }
    return null;
  });

  const handleLogout = () => {
    try {
      localStorage.removeItem('uppseekers_auth_user');
    } catch {
      // ignore
    }
    setAuthUser(null);
  };

  const CURRENT_DATA_VERSION = '2026.10_cohort_53_active_v5';

  // Helper to ensure student data consistency across any cached or synced state
  const sanitizeStudentList = (list: StudentProfile[]): StudentProfile[] => {
    return list
      .filter((s) => Boolean(s && s.name && s.name.trim()))
      .map((s) => {
        if (s.name.toLowerCase().includes('akshith')) {
          return { ...s, university: 'Purdue University' };
        }
        return s;
      });
  };

  // Student dataset with persistent updates from sheet or CSV
  const [students, setStudents] = useState<StudentProfile[]>(() => {
    try {
      const storedVersion = localStorage.getItem('uppseekers_data_version');
      if (storedVersion !== CURRENT_DATA_VERSION) {
        localStorage.removeItem('uppseekers_custom_students');
        localStorage.setItem('uppseekers_data_version', CURRENT_DATA_VERSION);
        return sanitizeStudentList(INITIAL_STUDENTS);
      }

      const stored = localStorage.getItem('uppseekers_custom_students');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = sanitizeStudentList(parsed);
          try {
            localStorage.setItem('uppseekers_custom_students', JSON.stringify(sanitized));
          } catch {
            // ignore
          }
          if (sanitized.length > 0) {
            return sanitized;
          }
        }
      }
    } catch {
      // ignore
    }
    return sanitizeStudentList(INITIAL_STUDENTS);
  });

  // Ensure any cached stale records are sanitized on launch
  useEffect(() => {
    try {
      localStorage.setItem('uppseekers_data_version', CURRENT_DATA_VERSION);
    } catch {
      // ignore
    }
    setStudents((prev) => {
      const filtered = sanitizeStudentList(prev);
      if (filtered.length !== prev.length || prev.some(s => s.name.toLowerCase().includes('akshith') && s.university.toLowerCase().includes('stanford'))) {
        try {
          localStorage.setItem('uppseekers_custom_students', JSON.stringify(filtered));
        } catch {
          // ignore
        }
        return filtered;
      }
      return prev;
    });
  }, []);

  const handleUpdateStudents = (newStudents: StudentProfile[]) => {
    const sanitized = sanitizeStudentList(newStudents);
    setStudents(sanitized);
    try {
      localStorage.setItem('uppseekers_custom_students', JSON.stringify(sanitized));
      localStorage.setItem('uppseekers_data_version', CURRENT_DATA_VERSION);
    } catch {
      // ignore
    }
  };

  const handleResetDefault = () => {
    const defaultSanitized = sanitizeStudentList(INITIAL_STUDENTS);
    setStudents(defaultSanitized);
    try {
      localStorage.removeItem('uppseekers_custom_students');
      localStorage.removeItem('uppseekers_saved_sheet_url');
      localStorage.setItem('uppseekers_data_version', CURRENT_DATA_VERSION);
    } catch {
      // ignore
    }
  };

  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  // Active top-level navigation tab: 'database' | 'roadmap' | 'compare_lab' | 'cohort_1500'
  const [activeTab, setActiveTab] = useState<AppTab>('database');

  // 1,500 Global Admitted Students Cohort dataset
  const [admittedCohort1500, setAdmittedCohort1500] = useState<AdmittedStudentProfile[]>(() => {
    return getAdmittedCohort1500();
  });

  const handleUpdate1500Cohort = (newCohort: AdmittedStudentProfile[]) => {
    saveCustom1500Cohort(newCohort);
    setAdmittedCohort1500(newCohort);
  };

  const handleReset1500Cohort = () => {
    resetDefault1500Cohort();
    setAdmittedCohort1500(getAdmittedCohort1500());
  };

  // Candidate Comparison State (up to 3 profiles)
  const [comparedStudentIds, setComparedStudentIds] = useState<string[]>(() => {
    try {
      const stored = sessionStorage.getItem('uppseekers_compared_students');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed.slice(0, 3);
      }
    } catch {
      // ignore
    }
    return [];
  });
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem('uppseekers_compared_students', JSON.stringify(comparedStudentIds));
    } catch {
      // ignore
    }
  }, [comparedStudentIds]);

  const handleToggleCompare = (student: StudentProfile) => {
    setComparedStudentIds((prev) => {
      if (prev.includes(student.id)) {
        return prev.filter((id) => id !== student.id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), student.id];
      }
      return [...prev, student.id];
    });
  };

  const handleAddCompareStudent = (student: StudentProfile) => {
    setComparedStudentIds((prev) => {
      if (prev.includes(student.id)) return prev;
      if (prev.length >= 3) {
        return [...prev.slice(1), student.id];
      }
      return [...prev, student.id];
    });
  };

  const handleRemoveCompareStudent = (studentId: string) => {
    setComparedStudentIds((prev) => prev.filter((id) => id !== studentId));
  };

  const handleClearCompare = () => {
    setComparedStudentIds([]);
  };

  const comparedStudents = useMemo(() => {
    const combined = [...students, ...admittedCohort1500];
    return comparedStudentIds
      .map((id) => combined.find((s) => s.id === id))
      .filter((s): s is StudentProfile => Boolean(s));
  }, [comparedStudentIds, students, admittedCohort1500]);

  const handleOpenEdit = (student: StudentProfile) => {
    setEditingStudent(student);
    setIsEditModalOpen(true);
  };

  const handleAddNewStudent = () => {
    const newStudentTemplate: StudentProfile = {
      id: `student-manual-${Date.now()}`,
      name: '',
      university: '',
      course: '',
      classOf: '2028',
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
    };
    setEditingStudent(newStudentTemplate);
    setIsEditModalOpen(true);
  };

  const handleSaveStudent = (updatedStudent: StudentProfile) => {
    setStudents((prev) => {
      const exists = prev.some((s) => s.id === updatedStudent.id);
      let updated: StudentProfile[];
      if (exists) {
        updated = prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
      } else {
        updated = [updatedStudent, ...prev];
      }
      try {
        localStorage.setItem('uppseekers_custom_students', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (selectedStudent && selectedStudent.id === updatedStudent.id) {
      setSelectedStudent(updatedStudent);
    }
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem('uppseekers_custom_students', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (selectedStudent && selectedStudent.id === id) {
      setSelectedStudent(null);
    }
  };

  // Filter state: Class of, University, Search Query, and Ranking Option
  const [filters, setFilters] = useState<FilterState>({
    classOf: 'ALL',
    university: 'ALL',
    searchQuery: '',
    sortBy: 'details', // 'details' ranks profiles with more rich student work upwards
    onlyWithStandouts: false,
  });

  // Calculate completeness & work analysis for all students in advance
  const studentCompletenessMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof calculateProfileCompleteness>>();
    for (const s of students) {
      map.set(s.id, calculateProfileCompleteness(s));
    }
    return map;
  }, [students]);

  // Aggregate stats across students
  const aggregateStats = useMemo(() => {
    let standoutCount = 0;
    let comprehensiveCount = 0;
    for (const s of students) {
      const comp = studentCompletenessMap.get(s.id);
      if (comp) {
        if (comp.standoutCount > 0) standoutCount++;
        if (comp.detailTier === 'Comprehensive' || comp.detailTier === 'High') {
          comprehensiveCount++;
        }
      }
    }
    return { standoutCount, comprehensiveCount };
  }, [students, studentCompletenessMap]);

  // Calculate distinct available universities with counts
  const availableUniversities = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of students) {
      if (!s.university) continue;
      const cleanUni = s.university.trim();
      map.set(cleanUni, (map.get(cleanUni) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students]);

  // Calculate distinct available class cohorts with counts
  const availableClasses = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of students) {
      if (!s.classOf) continue;
      map.set(s.classOf, (map.get(s.classOf) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year.localeCompare(b.year));
  }, [students]);

  // Filter and sort students: profiles with more details and rich work are ranked upwards
  const filteredStudents = useMemo(() => {
    const matched = students.filter(student => {
      // Filter by Class of
      if (filters.classOf !== 'ALL' && student.classOf !== filters.classOf) {
        return false;
      }

      // Filter by University
      if (filters.university !== 'ALL' && student.university.trim() !== filters.university) {
        return false;
      }

      // Filter by Standout Work only
      if (filters.onlyWithStandouts) {
        const comp = studentCompletenessMap.get(student.id);
        if (!comp || comp.standouts.length === 0) {
          return false;
        }
      }

      // Filter by Search query
      if (filters.searchQuery.trim().length > 0) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = [
          student.name,
          student.university,
          student.course,
          student.academicsPerformance,
          student.actSat,
          student.internshipWork,
          student.research,
          student.competitionsAwards,
          student.projects,
          student.otherActivities,
        ].join(' ').toLowerCase();

        if (!searchableText.includes(query)) {
          return false;
        }
      }

      return true;
    });

    // Sort according to selected criteria (default: most detailed and work-rich upwards!)
    return [...matched].sort((a, b) => {
      const compA = studentCompletenessMap.get(a.id);
      const compB = studentCompletenessMap.get(b.id);
      const scoreA = compA ? compA.totalScore : 0;
      const scoreB = compB ? compB.totalScore : 0;

      if (filters.sortBy === 'details') {
        // High detail, work, research & awards upwards
        if (scoreB !== scoreA) return scoreB - scoreA;
        const workA = compA ? compA.workCount : 0;
        const workB = compB ? compB.workCount : 0;
        if (workB !== workA) return workB - workA;
        return a.name.localeCompare(b.name);
      }

      if (filters.sortBy === 'work') {
        const workA = compA ? compA.internshipCount + compA.researchCount : 0;
        const workB = compB ? compB.internshipCount + compB.researchCount : 0;
        if (workB !== workA) return workB - workA;
        return scoreB - scoreA;
      }

      if (filters.sortBy === 'awards') {
        const awA = compA ? compA.awardCount : 0;
        const awB = compB ? compB.awardCount : 0;
        if (awB !== awA) return awB - awA;
        return scoreB - scoreA;
      }

      if (filters.sortBy === 'university') {
        const uniComp = a.university.localeCompare(b.university);
        if (uniComp !== 0) return uniComp;
        return scoreB - scoreA;
      }

      if (filters.sortBy === 'classOf') {
        const classComp = b.classOf.localeCompare(a.classOf);
        if (classComp !== 0) return classComp;
        return scoreB - scoreA;
      }

      return scoreB - scoreA;
    });
  }, [students, filters, studentCompletenessMap]);

  // If user is not authenticated with an @uppseekers.com account, render the Login Screen
  if (!authUser) {
    return <LoginScreen onLoginSuccess={(user) => setAuthUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col text-stone-900 font-sans antialiased selection:bg-stone-800 selection:text-white">
      {/* Primary Navigation Bar with View Mode Toggle and Authenticated User */}
      <Navbar
        totalCount={students.length}
        filteredCount={filteredStudents.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        user={authUser}
        onLogout={handleLogout}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onAddNewStudent={handleAddNewStudent}
        comparedCount={comparedStudentIds.length}
        onOpenComparison={() => setActiveTab('compare_lab')}
      />

      {/* Top Level Navigation Tabs: Database, Pathfinder & Gap Analysis, Compare Lab */}
      <NavigationTabs
        currentTab={activeTab}
        onTabChange={setActiveTab}
        databaseCount={students.length}
        comparedCount={comparedStudentIds.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: STUDENT PROFILES DATABASE (Original Cohort) */}
        {activeTab === 'database' && (
          <>
            {/* Page Top Heading & Scope Description */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider mb-1">
                  <span>Student Directory Portal</span>
                  <span>·</span>
                  <span>Work-Rich Profiles Ranked First</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-stone-900">
                  Student Profiles & Portfolios
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                  Explore student credentials, academic standing, research initiatives, work experience,
                  and honors. Profiles with verified non-academic depth are indexed and highlighted.
                </p>
              </div>

              {/* Quick Metrics Badges */}
              <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-lg border border-stone-200 shadow-2xs text-stone-700">
                  <Users className="w-3.5 h-3.5 text-stone-600" />
                  <span>{students.length} Candidates</span>
                </div>

                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-lg border border-stone-200 shadow-2xs text-stone-700">
                  <Star className="w-3.5 h-3.5 text-stone-600" />
                  <span>{aggregateStats.standoutCount} Standout Portfolios</span>
                </div>

                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-lg border border-stone-200 shadow-2xs text-stone-700">
                  <Building2 className="w-3.5 h-3.5 text-stone-600" />
                  <span>{availableUniversities.length} Institutions</span>
                </div>
              </div>
            </div>

            {/* Primary Filter Bar (Class of, University Name, Search, and Ranking) */}
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              availableUniversities={availableUniversities}
              availableClasses={availableClasses}
              totalResults={filteredStudents.length}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {/* Content Area: Grid or Table */}
            {filteredStudents.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredStudents.map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      onSelect={setSelectedStudent}
                      onEdit={handleOpenEdit}
                      isAdmin={authUser?.isAdmin}
                      isCompared={comparedStudentIds.includes(student.id)}
                      onToggleCompare={handleToggleCompare}
                    />
                  ))}
                </div>
              ) : (
                <TableView
                  students={filteredStudents}
                  onSelect={setSelectedStudent}
                  onEdit={handleOpenEdit}
                  isAdmin={authUser?.isAdmin}
                  comparedStudentIds={comparedStudentIds}
                  onToggleCompare={handleToggleCompare}
                />
              )
            ) : (
              /* Empty Search State */
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
                  <SearchX className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No Student Profiles Found</h3>
                <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                  No student profiles match your current combination of Class of, University Name, or search keyword.
                </p>
                <button
                  type="button"
                  id="reset-all-filters-btn"
                  onClick={() =>
                    setFilters({
                      classOf: 'ALL',
                      university: 'ALL',
                      searchQuery: '',
                      sortBy: 'details',
                      onlyWithStandouts: false,
                    })
                  }
                  className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </>
        )}

        {/* TAB 2: BACK-ENGINEERED ROADMAP & PATHFINDER */}
        {activeTab === 'roadmap' && (
          <BackEngineeredRoadmapView
            cohort1500={admittedCohort1500}
            onInspectStudent={(student) => setSelectedStudent(student)}
          />
        )}

        {/* TAB 3: ADMISSIONS COMPARE & BENCHMARKING LAB */}
        {activeTab === 'compare_lab' && (
          <CompareLabView
            allStudents={[...students, ...admittedCohort1500]}
            comparedStudents={comparedStudents}
            onAddStudent={handleAddCompareStudent}
            onRemoveStudent={handleRemoveCompareStudent}
            onClearAll={handleClearCompare}
            onSelectStudentForDetail={(student) => setSelectedStudent(student)}
          />
        )}
      </main>

      {/* Floating Comparison Dock (visible when profiles are selected for comparison) */}
      <ComparisonDock
        selectedStudents={comparedStudents}
        onOpenComparison={() => setActiveTab('compare_lab')}
        onRemoveStudent={handleRemoveCompareStudent}
        onClearAll={handleClearCompare}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-800">UppSeekers Student Portal Database</span>
            <span className="text-slate-300">|</span>
            <span>Managed directly via backend database</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" /> Last Name Masking Active
            </span>
          </div>
        </div>
      </footer>

      {/* Full Student Detail Dossier Modal */}
      <StudentDetailModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        isAdmin={authUser?.isAdmin}
        onEdit={handleOpenEdit}
        isCompared={selectedStudent ? comparedStudentIds.includes(selectedStudent.id) : false}
        onToggleCompare={handleToggleCompare}
      />

      {/* Side-by-Side Candidate Comparison Modal with Spider Chart */}
      <StudentComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        selectedStudents={comparedStudents}
        allStudents={students}
        onAddStudent={handleAddCompareStudent}
        onRemoveStudent={handleRemoveCompareStudent}
        onSelectForDetail={setSelectedStudent}
      />

      {/* Synchronize / Update Student Dataset Modal */}
      <SyncSheetModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onUpdateStudents={handleUpdateStudents}
        onResetDefault={handleResetDefault}
        currentCount={students.length}
        isAdmin={authUser?.isAdmin}
      />

      {/* Admin Edit Student Modal */}
      <EditStudentModal
        isOpen={isEditModalOpen}
        student={editingStudent}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        onDelete={handleDeleteStudent}
      />
    </div>
  );
}
