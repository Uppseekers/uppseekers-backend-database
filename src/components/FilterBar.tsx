import React from 'react';
import {
  Search,
  GraduationCap,
  Building2,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Star,
  LayoutGrid,
  Table,
} from 'lucide-react';
import { FilterState, SortOption } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableUniversities: { name: string; count: number }[];
  availableClasses: { year: string; count: number }[];
  totalResults: number;
  viewMode?: 'grid' | 'table';
  onViewModeChange?: (mode: 'grid' | 'table') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  availableUniversities,
  availableClasses,
  totalResults,
  viewMode,
  onViewModeChange,
}) => {
  const isFiltered =
    filters.classOf !== 'ALL' ||
    filters.university !== 'ALL' ||
    filters.searchQuery.trim().length > 0 ||
    filters.onlyWithStandouts ||
    filters.sortBy !== 'details';

  const handleReset = () => {
    onFilterChange({
      classOf: 'ALL',
      university: 'ALL',
      searchQuery: '',
      sortBy: 'details',
      onlyWithStandouts: false,
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex flex-col gap-4">
        {/* Main Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Quick Search */}
          <div className="sm:col-span-12 lg:col-span-3 relative">
            <label
              htmlFor="search-input"
              className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search Students & Work</span>
            </label>
            <div className="relative">
              <input
                id="search-input"
                type="text"
                value={filters.searchQuery}
                onChange={e =>
                  onFilterChange({ ...filters, searchQuery: e.target.value })
                }
                placeholder="Name, role, research, lab..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all pl-9"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
                  className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-md"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter on University Name */}
          <div className="sm:col-span-6 lg:col-span-4">
            <label
              htmlFor="university-filter"
              className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>University Name</span>
              <span className="text-[11px] font-normal text-slate-400 ml-auto">
                ({availableUniversities.length} Institutions)
              </span>
            </label>
            <div className="relative">
              <select
                id="university-filter"
                value={filters.university}
                onChange={e =>
                  onFilterChange({ ...filters, university: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer truncate"
              >
                <option value="ALL">All Universities (Any)</option>
                {availableUniversities.map(u => (
                  <option key={u.name} value={u.name}>
                    {u.name} ({u.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter on Class of */}
          <div className="sm:col-span-6 lg:col-span-2">
            <label
              htmlFor="class-filter"
              className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Class of</span>
            </label>
            <div className="relative">
              <select
                id="class-filter"
                value={filters.classOf}
                onChange={e =>
                  onFilterChange({ ...filters, classOf: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="ALL">All Cohorts</option>
                {availableClasses.map(c => (
                  <option key={c.year} value={c.year}>
                    Class of {c.year} ({c.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort By Selector (Most Detailed & Work-Rich Upwards) */}
          <div className="sm:col-span-12 lg:col-span-3">
            <label
              htmlFor="sort-filter"
              className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-600" />
              <span>Profile Ranking</span>
            </label>
            <div className="relative">
              <select
                id="sort-filter"
                value={filters.sortBy}
                onChange={e =>
                  onFilterChange({ ...filters, sortBy: e.target.value as SortOption })
                }
                className="w-full bg-amber-50/50 border border-amber-200/90 text-amber-950 font-semibold rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="details">⚡ Most Detailed & Work-Rich</option>
                <option value="work">💼 Most Work & Research Records</option>
                <option value="awards">🏆 Most Awards & Honors</option>
                <option value="university">🏛️ University Name (A-Z)</option>
                <option value="classOf">🎓 Class Cohort (Newest)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Filter Pill Buttons, Standout Work Toggle & Summary Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-slate-500 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-slate-400" />
              Cohort:
            </span>
            <button
              type="button"
              id="filter-class-all"
              onClick={() => onFilterChange({ ...filters, classOf: 'ALL' })}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filters.classOf === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {availableClasses.map(c => (
              <button
                key={c.year}
                type="button"
                id={`filter-class-${c.year}`}
                onClick={() => onFilterChange({ ...filters, classOf: c.year })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filters.classOf === c.year
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Class of {c.year}
                <span className="ml-1 opacity-70 text-[10px]">({c.count})</span>
              </button>
            ))}

            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

            {/* Standout Work Quick Toggle */}
            <button
              type="button"
              id="filter-standouts-toggle"
              onClick={() =>
                onFilterChange({
                  ...filters,
                  onlyWithStandouts: !filters.onlyWithStandouts,
                })
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                filters.onlyWithStandouts
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Star
                className={`w-3 h-3 ${
                  filters.onlyWithStandouts
                    ? 'fill-white text-white'
                    : 'fill-amber-500 text-amber-600'
                }`}
              />
              <span>Featured / Standout Work Only</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {viewMode && onViewModeChange && (
              <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-slate-600">
                <button
                  type="button"
                  onClick={() => onViewModeChange('grid')}
                  className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Switch to Cards"
                >
                  <LayoutGrid className="w-3 h-3" />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange('table')}
                  className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-all ${
                    viewMode === 'table'
                      ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Switch to Table"
                >
                  <Table className="w-3 h-3" />
                  <span>Table</span>
                </button>
              </div>
            )}

            <span className="text-xs text-slate-600 font-medium">
              Showing <span className="font-bold text-slate-900">{totalResults}</span> student profiles
            </span>
            {isFiltered && (
              <button
                type="button"
                id="clear-filters-btn"
                onClick={handleReset}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
              >
                <X className="w-3 h-3" />
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
