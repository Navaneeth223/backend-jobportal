import React from 'react';

const StatusFilters = ({ filters, activeFilter, onFilterChange }) => {
  return (
    <div className="w-full overflow-x-auto overflow-y-hidden rounded-2xl bg-slate-100 p-2 dark:bg-slate-900/50">
      <div className="flex w-max min-w-full gap-2">
      {filters.map((filter) => (
        <button
          key={filter.label}
          type="button"
          onClick={() => onFilterChange(filter.label)}
          className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            activeFilter === filter.label
            ? 'border-slate-300 bg-white text-slate-800 dark:border-blue-500 dark:bg-blue-600 dark:text-white' 
            : 'border-transparent bg-transparent text-slate-700 hover:bg-white dark:text-gray-400 dark:hover:border-gray-500 dark:hover:bg-[#1e293b]'
          }`}
        >
          {filter.label} ({filter.count})
        </button>
      ))}
      </div>
    </div>
  );
};

export default StatusFilters;
