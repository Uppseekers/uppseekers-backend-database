import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { StudentCard } from './components/StudentCard';
import { TableView } from './components/TableView';
import { StudentDetailModal } from './components/StudentDetailModal';
import { SyncSheetModal } from './components/SyncSheetModal';
import { LoginScreen } from './components/LoginScreen';
import { INITIAL_STUDENTS } from './initialData';
import { StudentProfile, FilterState, AuthUser } from './types';
import { calculateProfileCompleteness } from './utils/workAnalyzer';
import { GraduationCap, Users, Building2, SearchX, Shield, Star, Zap } from 'lucide-react';

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
          parsed.email.toLowerCase().endsWith('@uppseekers.com')
        ) {
          return parsed;
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

  // Student dataset with persistent updates from sheet or CSV
  const [students, setStudents] = useState<StudentProfile[]>(() => {
    try {
      const stored = localStorage.getItem('uppseekers_custom_students');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Only prioritize custom student cache if it's larger or explicitly imported, 
        // otherwise default to the up-to-date INITIAL_STUDENTS
        if (Array.isArray(parsed) && parsed.length > INITIAL_STUDENTS.length) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_STUDENTS;
  });

  const handleUpdateStudents = (newStudents: StudentProfile[]) => {
    setStudents(newStudents);
    try {
      localStorage.setItem('uppseekers_custom_students', JSON.stringify(newStudents));
    } catch {
      // ignore
    }
  };

  const handleResetDefault = () => {
    setStudents(INITIAL_STUDENTS);
    try {
      localStorage.removeItem('uppseekers_custom_students');
      localStorage.removeItem('uppseekers_saved_sheet_url');
    } catch {
      // ignore
    }
  };

  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

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
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Primary Navigation Bar with View Mode Toggle and Authenticated User */}
      <Navbar
        totalCount={students.length}
        filteredCount={filteredStudents.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        user={authUser}
        onLogout={handleLogout}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Top Heading & Scope Description */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                Student Directory Portal
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                <Zap className="w-3 h-3 mr-1 text-amber-600" />
                Work-Rich Profiles Upwards
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Student Profiles & Portfolios
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Explore student credentials, academic standing, research initiatives, work experience,
              and awards. Profiles with rich experience and achievements are highlighted and ranked upwards.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>{students.length} Candidates</span>
            </div>

            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-amber-200/90 shadow-2xs text-xs font-semibold text-amber-900">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{aggregateStats.standoutCount} Standout Work</span>
            </div>

            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>{availableUniversities.length} Universities</span>
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
              {filteredStudents.map(student => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onSelect={setSelectedStudent}
                />
              ))}
            </div>
          ) : (
            <TableView
              students={filteredStudents}
              onSelect={setSelectedStudent}
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
      </main>

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
      />

      {/* Synchronize / Update Student Dataset Modal */}
      <SyncSheetModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onUpdateStudents={handleUpdateStudents}
        onResetDefault={handleResetDefault}
        currentCount={students.length}
      />
    </div>
  );
}
