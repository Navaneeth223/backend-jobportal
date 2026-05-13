import { MapPin, Briefcase, GraduationCap, UserCheck, UserX, CheckCircle } from 'lucide-react';

const statusStyles = {
  New:          'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/50',
  Reviewed:     'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/20 dark:text-slate-300 dark:border-slate-500/50',
  Contacting:   'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/50',
  Interviewing: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/50',
  Shortlisted:  'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/50',
  Selected:     'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/50',
  Rejected:     'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/50',
};

export const STATUS_ACTIONS = [
  { label: 'Reviewed',   status: 'Reviewed',     icon: UserCheck,   className: 'bg-slate-500 hover:bg-slate-600 text-white border-slate-500' },
  { label: 'Interview',  status: 'Interviewing', icon: UserCheck,   className: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' },
  { label: 'Shortlist',  status: 'Shortlisted',  icon: CheckCircle, className: 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600' },
  { label: 'Select',     status: 'Selected',     icon: CheckCircle, className: 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500' },
  { label: 'Reject',     status: 'Rejected',     icon: UserX,       className: 'bg-red-500 hover:bg-red-600 text-white border-red-500' },
];

// Compact row card for the list panel
const CandidateCard = ({ candidate, onStatusChange, onSelect, isSelected }) => (
  <div
    onClick={() => onSelect?.(candidate)}
    className={`mb-2 cursor-pointer rounded-2xl border p-4 shadow-sm transition-all ${
      isSelected
        ? 'border-blue-400 bg-blue-50 dark:border-blue-500/60 dark:bg-blue-500/10'
        : 'border-slate-200 bg-[#fcfdff] hover:border-slate-300 dark:border-[#22325a] dark:bg-[#05070d] dark:hover:border-[#3456a5]'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
        {candidate.name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{candidate.name}</p>
        <p className="truncate text-xs text-slate-500 dark:text-gray-400">{candidate.role}</p>
      </div>
      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold ${statusStyles[candidate.status] || statusStyles['New']}`}>
        {candidate.status}
      </span>
    </div>

    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-gray-400">
      <span className="flex items-center gap-1"><MapPin size={11} />{candidate.location}</span>
      <span className="flex items-center gap-1"><Briefcase size={11} />{candidate.experience}</span>
    </div>
  </div>
);

export { statusStyles };
export default CandidateCard;
