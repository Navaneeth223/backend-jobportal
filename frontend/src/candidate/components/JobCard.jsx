import React from 'react';
import { MapPin, Briefcase, Bookmark, IndianRupee } from 'lucide-react';
import SkillChip from './SkillChip';

const JobCard = ({ job, isSaved, hasApplied, onSave, onApply, view = 'grid', className = '', ...props }) => {
  const isGrid = view === 'grid';

  return (
    <div
      className={`group relative rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:shadow-lg dark:border-slate-800 dark:bg-panel ${isGrid ? 'w-full' : 'flex items-center gap-6'} ${className}`}
      {...props}
    >
      {/* Match Badge */}
      <div className="absolute right-4 top-4 z-10">
        <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
          {job.matchPercentage}% Match
        </span>
      </div>

      {/* Company Logo */}
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white ${!isGrid && 'shrink-0'}`}>
        {job.companyLogo}
      </div>

      <div className={isGrid ? 'mt-4' : 'flex-1'}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              {job.title}
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{job.company}</p>
          </div>
          {isGrid && (
            <button 
              onClick={() => onSave(job.id)}
              className={`p-1 transition-colors ${isSaved ? 'text-yellow-500' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase size={16} />
            <span>{job.jobType}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
            <IndianRupee size={16} />
            <span>{job.salaryMin} - {job.salaryMax}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills.slice(0, 3).map(skill => (
            <SkillChip key={skill} label={skill} />
          ))}
          {job.skills.length > 3 && (
            <span className="text-xs text-slate-400">+{job.skills.length - 3} more</span>
          )}
        </div>

        <div className={`mt-6 flex items-center justify-between ${!isGrid && 'gap-4'}`}>
          <button 
            onClick={() => !hasApplied && onApply(job.id)}
            disabled={hasApplied}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all active:scale-95 ${
              hasApplied 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-default' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {hasApplied ? 'Applied' : 'Apply Now'}
          </button>
          {!isGrid && (
            <button 
              onClick={() => onSave(job.id)}
              className={`rounded-xl border border-slate-200 p-2.5 transition-colors dark:border-slate-800 ${isSaved ? 'text-yellow-500' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
        <p className="mt-3 text-[10px] text-slate-400">{job.postedDate}</p>
      </div>
    </div>
  );
};

export default JobCard;
