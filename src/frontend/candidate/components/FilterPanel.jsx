import React from 'react';
import { Search, X } from 'lucide-react';

const FilterPanel = ({ filters, onChange, onClear }) => {
  const jobTypes = ['Full-time', 'Part-time', 'Remote', 'Internship', 'Freelance'];
  const experienceLevels = ['Any', 'Fresher', '1-3 yrs', '3-5 yrs', '5+ yrs'];
  const postingDates = ['Any time', 'Today', 'This week', 'This month'];

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-panel">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Filters</h2>
        <button 
          onClick={onClear}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Clear All
        </button>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Job title or keyword"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white"
          />
        </div>
      </div>

      {/* Job Type */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Job Type</label>
        <div className="flex flex-col gap-2">
          {jobTypes.map(type => (
            <label key={type} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={filters.jobTypes.includes(type)}
                onChange={(e) => {
                  const newTypes = e.target.checked 
                    ? [...filters.jobTypes, type]
                    : filters.jobTypes.filter(t => t !== type);
                  onChange({ jobTypes: newTypes });
                }}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Experience</label>
        <div className="flex flex-col gap-2">
          {experienceLevels.map(level => (
            <label key={level} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <input
                type="radio"
                name="experience"
                checked={filters.experience === level}
                onChange={() => onChange({ experience: level })}
                className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              {level}
            </label>
          ))}
        </div>
      </div>

      {/* Salary Range */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Salary Range</label>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">₹{filters.salaryRange[0]}L - ₹{filters.salaryRange[1]}L</span>
        </div>
        <input
          type="range"
          min="0"
          max="30"
          value={filters.salaryRange[1]}
          onChange={(e) => onChange({ salaryRange: [filters.salaryRange[0], parseInt(e.target.value)] })}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-800"
        />
      </div>

      {/* Date Posted */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date Posted</label>
        <div className="flex flex-col gap-2">
          {postingDates.map(date => (
            <label key={date} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <input
                type="radio"
                name="datePosted"
                checked={filters.datePosted === date}
                onChange={() => onChange({ datePosted: date })}
                className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              {date}
            </label>
          ))}
        </div>
      </div>

      <button 
        className="mt-2 w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterPanel;
