import React from 'react';
import { Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({
  icon,
  title,
  description,
  itemCount,
  buttonText,
  actionTo,
  secondaryButtonText,
  secondaryActionTo,
  variant = 'default',
}) => {
  const isStats = variant === 'stats';

  return (
    <div
      className={`flex h-full flex-col rounded-2xl border p-6 shadow-sm ${
        isStats
          ? 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 dark:border-indigo-500/30 dark:from-indigo-900/40 dark:to-purple-900/40'
          : 'border-slate-200 bg-[#fcfdff] dark:border-[#153269] dark:bg-[#040913]'
      }`}
    >
      <div className="mb-4 flex gap-4">
        <div
          className={`shrink-0 self-start rounded-xl p-3 ${
            isStats
              ? 'bg-white text-purple-600 dark:bg-purple-500/20 dark:text-purple-400'
              : 'bg-blue-100 text-blue-600 dark:bg-[#0f2f6d] dark:px-4 dark:py-5 dark:text-[#5fa3ff]'
          }`}
        >
          {React.createElement(icon, { size: 24 })}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          {!isStats ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p> : null}
        </div>
      </div>

      {isStats ? (
        <ul className="mb-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>&bull; 3 active job postings</li>
          <li>&bull; 3 total applications</li>
          <li>
            &bull; Company profile: <span className="text-purple-600 dark:text-purple-400">Incomplete</span>
          </li>
        </ul>
      ) : (
        <div className="mt-auto pt-4">
          {itemCount ? <p className="mb-3 text-xs text-slate-500 dark:text-slate-500">{itemCount} items</p> : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              to={actionTo}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#02031b] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#111630] hover:shadow-md dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <Plus size={15} />
              {buttonText}
            </Link>
            {secondaryButtonText && secondaryActionTo && (
              <Link
                to={secondaryActionTo}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-transparent px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-[#2a3b66] dark:text-gray-300 dark:hover:border-[#3456a5] dark:hover:bg-[#0d1f4a]"
              >
                <Eye size={15} />
                {secondaryButtonText}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Sections = ({ icons }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <StatCard
        icon={icons.Building}
        title="Company Profile"
        description="Create your company profile to start posting jobs and attracting talent"
        buttonText="View Profile"
        actionTo="/profiles?tab=company"
      />
      <StatCard
        icon={icons.Briefcase}
        title="Job Postings"
        description="Browse and manage job listings, create new opportunities"
        itemCount="3"
        buttonText="View Jobs"
        actionTo="/jobs"
      />
      <StatCard
        icon={icons.FileText}
        title="Applications"
        description="Track and manage job applications from candidates"
        itemCount="3"
        buttonText="View Applications"
        actionTo="/applications"
      />
      <StatCard icon={icons.User} title="Quick Stats" variant="stats" />
    </div>
  );
};

export default Sections;
