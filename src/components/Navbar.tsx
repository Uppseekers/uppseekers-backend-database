import React from 'react';
import {
  GraduationCap,
  LayoutGrid,
  Table,
  Users,
  LogOut,
  FileSpreadsheet,
  PlusCircle,
  Compass,
  Scale,
  Sparkles,
} from 'lucide-react';
import { AuthUser, AppTab } from '../types';

interface NavbarProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  databaseCount: number;
  filteredCount?: number;
  comparedCount?: number;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  user?: AuthUser | null;
  onLogout?: () => void;
  onOpenSyncModal?: () => void;
  onAddNewStudent?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  databaseCount,
  filteredCount,
  comparedCount = 0,
  viewMode,
  onViewModeChange,
  user,
  onLogout,
  onOpenSyncModal,
  onAddNewStudent,
}) => {
  const tabs = [
    {
      id: 'database' as AppTab,
      label: 'Student Directory',
      count: databaseCount,
      icon: Users,
    },
    {
      id: 'roadmap' as AppTab,
      label: 'Pathfinder & Gap Analysis',
      icon: Compass,
    },
    {
      id: 'compare_lab' as AppTab,
      label: 'Compare Lab',
      count: comparedCount,
      icon: Scale,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
      {/* Primary Tool Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-15 gap-4">
          {/* Brand & Left Navigation */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            {/* Logo Emblem */}
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center shadow-xs shrink-0">
                <GraduationCap className="h-4.5 w-4.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-stone-900 text-lg tracking-tight">
                  UppSeekers
                </span>
                <span className="hidden sm:inline-flex items-center text-[10px] font-mono uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200/90">
                  Admissions Intelligence
                </span>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden lg:block h-5 w-px bg-stone-200" />

            {/* Desktop Navigation Tabs (Sleek SaaS Segmented Controls) */}
            <nav className="hidden md:flex items-center space-x-1 p-1 bg-stone-100/80 rounded-lg border border-stone-200/80 text-xs">
              {tabs.map((tab) => {
                const isActive = currentTab === tab.id;
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-stone-900 text-white shadow-2xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? 'bg-stone-800 text-amber-300'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Tools: Contextual Controls, Sync, Admin & Account */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* View Mode Switcher (Contextual: Only relevant on Directory tab) */}
            {currentTab === 'database' && (
              <div
                id="view-mode-toggle"
                className="flex items-center p-0.5 bg-stone-100 rounded-lg border border-stone-200 text-stone-600 shadow-2xs"
              >
                <button
                  type="button"
                  id="view-grid-btn"
                  onClick={() => onViewModeChange('grid')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold border border-stone-200/80'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cards</span>
                </button>
                <button
                  type="button"
                  id="view-table-btn"
                  onClick={() => onViewModeChange('table')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold border border-stone-200/80'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Table view"
                >
                  <Table className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Table</span>
                </button>
              </div>
            )}

            {/* Admin Add Student Button */}
            {user?.isAdmin && onAddNewStudent && (
              <button
                type="button"
                id="navbar-add-student-btn"
                onClick={onAddNewStudent}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-2xs cursor-pointer border border-stone-900"
                title="Add a new student profile manually"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Student</span>
              </button>
            )}

            {/* Sync / Update Data Button */}
            {onOpenSyncModal && (
              <button
                type="button"
                id="navbar-sync-sheet-btn"
                onClick={onOpenSyncModal}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition-colors shadow-2xs cursor-pointer"
                title={user?.isAdmin ? 'Sync & Manage Master Sheet' : 'Update dataset from Google Sheets / CSV'}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-stone-600" />
                <span className="hidden sm:inline">
                  {user?.isAdmin ? 'Sync Sheet' : 'Import'}
                </span>
              </button>
            )}

            {/* User Account Capsule */}
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                <div
                  className="flex items-center gap-2 py-1 px-2 rounded-lg bg-stone-50 border border-stone-200/80 text-xs text-stone-700"
                  title={`${user.email} (${user.isAdmin ? 'Administrator' : 'Staff'})`}
                >
                  <span className="w-5 h-5 rounded-full bg-stone-900 text-stone-100 text-[10px] font-mono font-bold flex items-center justify-center">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden lg:inline max-w-[120px] truncate font-medium">
                    {user.email}
                  </span>
                  {user.isAdmin && (
                    <span className="hidden xl:inline text-[9px] font-mono uppercase bg-amber-100 text-amber-900 px-1 py-0.2 rounded font-semibold border border-amber-200">
                      Admin
                    </span>
                  )}
                </div>

                {onLogout && (
                  <button
                    type="button"
                    id="navbar-logout-btn"
                    onClick={onLogout}
                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-stone-200"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Horizontal Navigation Strip (< md) */}
      <div className="md:hidden border-t border-stone-200/80 bg-stone-50/80 px-4 py-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-2">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={`mobile-${tab.id}`}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-stone-900 text-white border-stone-900 shadow-2xs font-semibold'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-stone-800 text-amber-300' : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
