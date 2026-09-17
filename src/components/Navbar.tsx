import React from 'react';
import {
  GraduationCap,
  LayoutGrid,
  Table,
  ShieldCheck,
  Users,
  LogOut,
  UserCheck,
  FileSpreadsheet,
  ShieldAlert,
  PlusCircle,
} from 'lucide-react';
import { AuthUser } from '../types';

interface NavbarProps {
  totalCount: number;
  filteredCount: number;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  user?: AuthUser | null;
  onLogout?: () => void;
  onOpenSyncModal?: () => void;
  onAddNewStudent?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalCount,
  filteredCount,
  viewMode,
  onViewModeChange,
  user,
  onLogout,
  onOpenSyncModal,
  onAddNewStudent,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-sm ring-2 ring-indigo-100 shrink-0">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight">
                  UppSeekers
                </span>
                <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
                  Student Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:flex items-center gap-1.5">
                <span>Verified Admissions & Student Dossiers</span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="inline-flex items-center text-slate-500 font-medium">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 mr-1" />
                  Last Names Anonymized
                </span>
              </p>
            </div>
          </div>

          {/* Right Actions: View Switch, Sync Sheet, Active Count, Authenticated User & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Toggle */}
            <div
              id="view-mode-toggle"
              className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 shadow-2xs"
            >
              <button
                type="button"
                id="view-grid-btn"
                onClick={() => onViewModeChange('grid')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="Cards view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">Cards</span>
              </button>
              <button
                type="button"
                id="view-table-btn"
                onClick={() => onViewModeChange('table')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="Table view"
              >
                <Table className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">Table</span>
              </button>
            </div>

            {/* Admin Add Student Button */}
            {user?.isAdmin && onAddNewStudent && (
              <button
                type="button"
                id="navbar-add-student-btn"
                onClick={onAddNewStudent}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all shadow-2xs cursor-pointer"
                title="Add a new student profile manually"
              >
                <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Add Student</span>
              </button>
            )}

            {/* Sync / Update Sheet Data Button */}
            {onOpenSyncModal && (
              <button
                type="button"
                id="navbar-sync-sheet-btn"
                onClick={onOpenSyncModal}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-2xs cursor-pointer ${
                  user?.isAdmin
                    ? 'text-emerald-800 bg-emerald-100 hover:bg-emerald-200/80 border border-emerald-300 font-bold'
                    : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                }`}
                title={user?.isAdmin ? "Sync & Manage Master Google Sheet" : "Update student dataset from Google Sheets or CSV"}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">
                  {user?.isAdmin ? 'Sync Master Sheet' : 'Update Data'}
                </span>
              </button>
            )}

            {/* Total Student Counter */}
            <div className="hidden md:flex flex-col items-end pl-2 sm:pl-3 border-l border-slate-200">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>{filteredCount} Active</span>
              </div>
              <span className="text-[11px] text-slate-400">
                {totalCount} in Directory
              </span>
            </div>

            {/* User Profile & Logout Action */}
            {user && (
              <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
                <div className="hidden lg:flex flex-col items-end">
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                    {user.isAdmin ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    <span className="max-w-[140px] truncate">{user.email}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      user.isAdmin ? 'text-amber-700' : 'text-emerald-700'
                    }`}
                  >
                    {user.isAdmin ? 'Master Administrator' : 'Authorized Staff'}
                  </span>
                </div>

                <button
                  type="button"
                  id="navbar-logout-btn"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                  title={`Log out (${user.email})`}
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-600" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
