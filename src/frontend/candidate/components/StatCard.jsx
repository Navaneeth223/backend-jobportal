import React from 'react';

const StatCard = ({ icon: Icon, iconBg, value, label, trend }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-panel">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className="text-white" size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
            {trend && (
              <span className={`text-xs font-medium ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
