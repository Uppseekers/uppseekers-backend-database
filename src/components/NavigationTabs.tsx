import React from 'react';
import { GraduationCap, Compass, Scale } from 'lucide-react';
import { AppTab } from '../types';

interface NavigationTabsProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  databaseCount: number;
  comparedCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  currentTab,
  onTabChange,
  databaseCount,
  comparedCount,
}) => {
  const tabs = [
    {
      id: 'database' as AppTab,
      label: 'Student Database',
      sublabel: 'Profiles & Non-Academic Dossiers',
      count: databaseCount,
      icon: GraduationCap,
    },
    {
      id: 'roadmap' as AppTab,
      label: 'Pathfinder & Gap Analysis',
      sublabel: 'Back-Engineered Tier Roadmap',
      icon: Compass,
    },
    {
      id: 'compare_lab' as AppTab,
      label: 'Admissions Compare Lab',
      sublabel: 'Multi-Profile Radar Overlay',
      count: comparedCount,
      icon: Scale,
    },
  ];

  return (
    <div className="bg-white border-b border-stone-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto py-2.5 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`group flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? 'bg-stone-900 text-stone-100 border-stone-900 shadow-2xs'
                    : 'bg-stone-50/70 text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                    isActive ? 'text-stone-300' : 'text-stone-500 group-hover:text-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold tracking-tight">{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-stone-800 text-stone-300 border border-stone-700'
                            : 'bg-stone-200/80 text-stone-700'
                        }`}
                      >
                        {tab.count.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-[11px] leading-tight ${
                      isActive ? 'text-stone-400' : 'text-stone-500'
                    }`}
                  >
                    {tab.sublabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
