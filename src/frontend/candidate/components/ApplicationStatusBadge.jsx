import React from 'react';

const ApplicationStatusBadge = ({ status }) => {
  const statusConfig = {
    applied: { label: 'Applied', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    shortlisted: { label: 'Shortlisted', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    selected: { label: 'Selected', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    interview_scheduled: { label: 'Interview', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
  };

  const config = statusConfig[status] || statusConfig.applied;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export default ApplicationStatusBadge;
