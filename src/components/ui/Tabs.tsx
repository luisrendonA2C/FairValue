'use client';

import React from 'react';

export interface Tab {
  id: string;
  label: string;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div
      className={`relative flex items-center gap-1 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-1 ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={[
              'relative px-4 py-2 text-sm font-medium rounded-lg',
              'transition-all duration-300 ease-in-out',
              'focus:outline-none focus:ring-2 focus:ring-amber/50',
              isActive
                ? 'text-amber'
                : 'text-sage hover:text-white',
            ].join(' ')}
          >
            {tab.label}
            {isActive && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-amber rounded-full"
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

Tabs.displayName = 'Tabs';

export default Tabs;
